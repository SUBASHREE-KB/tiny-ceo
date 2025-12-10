/**
 * Vultr Object Storage Service
 * S3-compatible object storage for files (PDFs, exports, etc.)
 */

const { logger } = require('../utils/logger');

class VultrStorageService {
  constructor() {
    this.endpoint = process.env.VULTR_S3_ENDPOINT || 'ewr1.vultrobjects.com';
    this.accessKey = process.env.VULTR_S3_ACCESS_KEY;
    this.secretKey = process.env.VULTR_S3_SECRET_KEY;
    this.bucket = process.env.VULTR_S3_BUCKET || 'tiny-ceo-files';
    this.region = process.env.VULTR_S3_REGION || 'ewr1';

    // For now, we'll use a simple approach
    // In production, you'd use AWS SDK configured for Vultr
    this.baseUrl = `https://${this.bucket}.${this.endpoint}`;
  }

  /**
   * Upload file to Vultr Object Storage
   */
  async uploadFile(fileBuffer, fileName, folder = '', contentType = 'application/octet-stream') {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;

      logger.info('Uploading file to Vultr Object Storage', {
        key,
        size: fileBuffer.length,
        contentType
      });

      // Using fetch with presigned URL or direct S3 API
      // For production, use AWS SDK with Vultr endpoint
      const url = `${this.baseUrl}/${key}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'x-amz-acl': 'public-read' // Make files publicly readable
        },
        body: fileBuffer
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const publicUrl = `${this.baseUrl}/${key}`;

      logger.success('File uploaded successfully', { url: publicUrl });

      return {
        success: true,
        url: publicUrl,
        key,
        size: fileBuffer.length
      };
    } catch (error) {
      logger.error('Vultr upload failed', error);
      throw error;
    }
  }

  /**
   * Download file from Vultr Object Storage
   */
  async downloadFile(key) {
    try {
      const url = `${this.baseUrl}/${key}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();

      return {
        buffer: Buffer.from(buffer),
        contentType: response.headers.get('content-type'),
        size: buffer.byteLength
      };
    } catch (error) {
      logger.error('Vultr download failed', error);
      throw error;
    }
  }

  /**
   * Delete file from Vultr Object Storage
   */
  async deleteFile(key) {
    try {
      const url = `${this.baseUrl}/${key}`;

      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      logger.success('File deleted successfully', { key });

      return { success: true };
    } catch (error) {
      logger.error('Vultr delete failed', error);
      throw error;
    }
  }

  /**
   * Get presigned URL for temporary access
   */
  async getPresignedUrl(key, expiresIn = 3600) {
    // In production, use AWS SDK to generate presigned URLs
    // For now, return public URL
    return `${this.baseUrl}/${key}`;
  }

  /**
   * List files in a folder
   */
  async listFiles(folder = '') {
    try {
      // This would use S3 ListObjects API in production
      // Simplified for now
      logger.info('Listing files in folder', { folder });

      return {
        files: []
      };
    } catch (error) {
      logger.error('Vultr list files failed', error);
      throw error;
    }
  }

  /**
   * Upload pitch deck PDF
   */
  async uploadPitchDeck(pdfBuffer, workspaceId, fileName) {
    return await this.uploadFile(
      pdfBuffer,
      `${workspaceId}_${fileName}`,
      'pitch-decks',
      'application/pdf'
    );
  }

  /**
   * Upload analysis export
   */
  async uploadAnalysisExport(jsonBuffer, workspaceId, fileName) {
    return await this.uploadFile(
      jsonBuffer,
      `${workspaceId}_${fileName}`,
      'exports',
      'application/json'
    );
  }

  /**
   * Upload document
   */
  async uploadDocument(buffer, workspaceId, fileName, contentType) {
    return await this.uploadFile(
      buffer,
      `${workspaceId}_${fileName}`,
      'documents',
      contentType
    );
  }
}

// Export singleton instance
const vultrStorageService = new VultrStorageService();

module.exports = vultrStorageService;
