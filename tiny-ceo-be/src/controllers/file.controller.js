const smartSQLService = require('../services/smartsql.service');
const vultrStorageService = require('../services/vultr-storage.service');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const PDFDocument = require('pdfkit');

/**
 * File Controller
 * Handles file upload/download operations with Vultr Object Storage
 */
const fileController = {
  /**
   * Export workspace analysis as PDF
   */
  exportPDF: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;

      // Get workspace and verify ownership
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError('Workspace not found', 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get agent outputs
      const result = await smartSQLService.getLatestAgentOutputs(workspaceId);
      const outputs = {};
      if (result.rows) {
        result.rows.forEach(row => {
          outputs[row.agent_type] = row.output_data;
        });
      }

      logger.info('Generating PDF export', { workspaceId });

      // Generate PDF
      const pdfBuffer = await this.generatePDF(workspace, outputs);

      // Upload to Vultr
      const fileName = `analysis_${workspaceId}_${Date.now()}.pdf`;
      const uploadResult = await vultrStorageService.uploadAnalysisExport(
        pdfBuffer,
        workspaceId,
        fileName
      );

      // Save file metadata
      await smartSQLService.saveFileMetadata(
        workspaceId,
        'analysis_pdf',
        fileName,
        uploadResult.url,
        uploadResult.size,
        'application/pdf'
      );

      logger.success('PDF exported successfully', { workspaceId, url: uploadResult.url });

      res.json({
        message: 'PDF exported successfully',
        url: uploadResult.url,
        fileName
      });
    } catch (error) {
      logger.error('Failed to export PDF', error);
      next(error);
    }
  },

  /**
   * Export workspace analysis as JSON
   */
  exportJSON: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;

      // Get workspace and verify ownership
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError('Workspace not found', 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get agent outputs
      const result = await smartSQLService.getLatestAgentOutputs(workspaceId);
      const outputs = {};
      if (result.rows) {
        result.rows.forEach(row => {
          outputs[row.agent_type] = row.output_data;
        });
      }

      const exportData = {
        workspace,
        outputs,
        exportedAt: new Date().toISOString()
      };

      const jsonBuffer = Buffer.from(JSON.stringify(exportData, null, 2));
      const fileName = `analysis_${workspaceId}_${Date.now()}.json`;

      // Upload to Vultr
      const uploadResult = await vultrStorageService.uploadAnalysisExport(
        jsonBuffer,
        workspaceId,
        fileName
      );

      // Save file metadata
      await smartSQLService.saveFileMetadata(
        workspaceId,
        'export_json',
        fileName,
        uploadResult.url,
        uploadResult.size,
        'application/json'
      );

      logger.success('JSON exported successfully', { workspaceId, url: uploadResult.url });

      res.json({
        message: 'JSON exported successfully',
        url: uploadResult.url,
        fileName
      });
    } catch (error) {
      logger.error('Failed to export JSON', error);
      next(error);
    }
  },

  /**
   * List all files for a workspace
   */
  listFiles: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;

      // Verify workspace ownership
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError('Workspace not found', 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get file metadata
      const result = await smartSQLService.getFiles(workspaceId);
      const files = result.rows || [];

      res.json({ files });
    } catch (error) {
      logger.error('Failed to list files', error);
      next(error);
    }
  },

  /**
   * Upload a custom file
   */
  uploadFile: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;
      const { fileName, fileData, fileType, contentType } = req.body;

      // Verify workspace ownership
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError('Workspace not found', 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Convert base64 to buffer if needed
      const buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData, 'base64');

      // Upload to Vultr
      const uploadResult = await vultrStorageService.uploadDocument(
        buffer,
        workspaceId,
        fileName,
        contentType || 'application/octet-stream'
      );

      // Save file metadata
      await smartSQLService.saveFileMetadata(
        workspaceId,
        fileType || 'document',
        fileName,
        uploadResult.url,
        uploadResult.size,
        contentType || 'application/octet-stream'
      );

      logger.success('File uploaded successfully', { workspaceId, fileName });

      res.json({
        message: 'File uploaded successfully',
        url: uploadResult.url,
        fileName
      });
    } catch (error) {
      logger.error('Failed to upload file', error);
      next(error);
    }
  },

  /**
   * Helper: Generate PDF from workspace data
   */
  async generatePDF(workspace, outputs) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Title
        doc.fontSize(24).font('Helvetica-Bold').text('Startup Analysis Report', { align: 'center' });
        doc.moveDown();

        // Workspace Info
        doc.fontSize(18).text(workspace.name);
        doc.fontSize(12).font('Helvetica').text(`Industry: ${workspace.industry}`);
        doc.text(`Target Audience: ${workspace.target_audience}`);
        doc.moveDown();

        // Startup Idea
        doc.fontSize(14).font('Helvetica-Bold').text('Startup Idea');
        doc.fontSize(11).font('Helvetica').text(workspace.startup_idea);
        doc.moveDown();

        // Agent Outputs
        if (outputs.overview) {
          doc.addPage();
          doc.fontSize(16).font('Helvetica-Bold').text('Executive Summary');
          doc.fontSize(11).font('Helvetica');
          if (outputs.overview.startup_name) {
            doc.text(`Startup Name: ${outputs.overview.startup_name}`);
          }
          if (outputs.overview.tagline) {
            doc.text(`Tagline: ${outputs.overview.tagline}`);
          }
          doc.moveDown();
        }

        // CEO Analysis
        if (outputs.ceo) {
          doc.addPage();
          doc.fontSize(16).font('Helvetica-Bold').text('CEO Strategic Analysis');
          doc.fontSize(11).font('Helvetica');
          if (outputs.ceo.vision_statement) {
            doc.text(`Vision: ${outputs.ceo.vision_statement}`);
          }
          doc.moveDown();
        }

        // Finance Analysis
        if (outputs.finance) {
          doc.addPage();
          doc.fontSize(16).font('Helvetica-Bold').text('Financial Analysis');
          doc.fontSize(11).font('Helvetica').text(JSON.stringify(outputs.finance, null, 2));
          doc.moveDown();
        }

        // Marketing Analysis
        if (outputs.marketing) {
          doc.addPage();
          doc.fontSize(16).font('Helvetica-Bold').text('Marketing Strategy');
          doc.fontSize(11).font('Helvetica').text(JSON.stringify(outputs.marketing, null, 2));
          doc.moveDown();
        }

        // Footer
        doc.fontSize(10).text(`Generated on ${new Date().toLocaleDateString()}`, {
          align: 'center'
        });
        doc.text('Powered by Tiny CEO - Raindrop MCP + Vultr', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = fileController;
