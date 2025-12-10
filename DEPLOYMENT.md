# Tiny CEO - Deployment Guide for Vultr + Raindrop

This guide walks you through deploying the complete Tiny CEO application on Vultr infrastructure with Raindrop MCP integration.

## 📋 Prerequisites

- Vultr account (https://www.vultr.com)
- Raindrop MCP Server access
- Domain name (optional but recommended)
- SSH client
- Git installed locally

## 🎯 Deployment Architecture

```
User Browser
     ↓
Vultr Object Storage (Static Frontend)
     ↓
Vultr Compute VM (Backend API)
     ↓
Raindrop MCP Server (Smart Components)
     ↓
Vultr Object Storage (File Storage)
```

---

## Part 1: Set Up Raindrop MCP Server

### Step 1: Configure Raindrop

1. **Upload the configuration file**:
   ```bash
   # Upload raindrop-config/raindrop-server.json to your Raindrop instance
   ```

2. **Initialize SmartSQL database**:
   ```bash
   # Connect to Raindrop's PostgreSQL and run:
   psql -h your-raindrop-db.com -U raindrop_user -d tiny_ceo_production -f raindrop-config/smartsql-schema.sql
   ```

3. **Verify connection**:
   ```bash
   curl https://your-raindrop-server.com/info
   ```

4. **Get your API key**:
   - Save your Raindrop API key for later use

---

## Part 2: Set Up Vultr Object Storage

### Step 1: Create Object Storage

1. Log into Vultr dashboard
2. Navigate to **Products** → **Object Storage**
3. Click **Deploy Object Storage**
4. Choose a location (e.g., New Jersey - ewr1)
5. Name your subscription: `tiny-ceo-storage`
6. Click **Deploy Now**

### Step 2: Create Bucket and Get Credentials

1. Once deployed, click on your Object Storage
2. Click **Buckets** → **Add Bucket**
3. Name: `tiny-ceo-files`
4. Access Control: **Public** (for file downloads)
5. Click **Add Bucket**

6. Go to **Access** tab
7. Click **Generate S3 Credentials**
8. Save these securely:
   - Access Key
   - Secret Key
   - Hostname (e.g., `ewr1.vultrobjects.com`)

### Step 3: Configure CORS (Optional)

For direct frontend uploads:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

---

## Part 3: Deploy Backend on Vultr Compute

### Step 1: Create Vultr VM

1. Go to **Products** → **Compute**
2. Click **Deploy Server**
3. Choose **Cloud Compute**
4. Select location: **Same as Object Storage** (e.g., New Jersey)
5. Server Type: **Ubuntu 22.04 LTS**
6. Server Size: **2 vCPU, 4GB RAM** (or higher)
7. Add SSH Key (recommended)
8. Server Hostname: `tiny-ceo-api`
9. Click **Deploy Now**
10. Note your server IP address

### Step 2: Connect to Your VM

```bash
ssh root@YOUR_SERVER_IP
```

### Step 3: Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install NGINX
apt install -y nginx

# Install Git
apt install -y git

# Verify installations
node --version  # Should show v20.x
npm --version
pm2 --version
nginx -v
```

### Step 4: Clone and Setup Application

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone your repository (or upload files)
git clone https://github.com/yourusername/tiny-ceo.git
cd tiny-ceo/tiny-ceo-be

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env
```

### Step 5: Configure Environment Variables

Edit `/var/www/tiny-ceo/tiny-ceo-be/.env`:

```bash
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Raindrop MCP
RAINDROP_MCP_URL=https://your-raindrop-server.com
RAINDROP_API_KEY=your_raindrop_api_key

# Vultr Object Storage
VULTR_S3_ENDPOINT=ewr1.vultrobjects.com
VULTR_S3_ACCESS_KEY=your_access_key_here
VULTR_S3_SECRET_KEY=your_secret_key_here
VULTR_S3_BUCKET=tiny-ceo-files
VULTR_S3_REGION=ewr1

# Authentication
JWT_SECRET=generate_a_random_secret_here

# CORS
CORS_ORIGINS=https://yourdomain.com
```

### Step 6: Start Application with PM2

```bash
# Start the app
cd /var/www/tiny-ceo/tiny-ceo-be
pm2 start src/server.js --name tiny-ceo-api

# Save PM2 configuration
pm2 save

# Enable PM2 on system startup
pm2 startup
# Run the command it outputs

# View logs
pm2 logs tiny-ceo-api

# Check status
pm2 status
```

### Step 7: Configure NGINX Reverse Proxy

Create NGINX config:

```bash
nano /etc/nginx/sites-available/tiny-ceo
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Or your server IP

    # API endpoint
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization';

        # Increase timeout for AI generation
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
    }
}
```

Enable the site:

```bash
# Remove default site
rm /etc/nginx/sites-enabled/default

# Enable Tiny CEO site
ln -s /etc/nginx/sites-available/tiny-ceo /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart NGINX
systemctl restart nginx
```

### Step 8: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

### Step 9: Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

---

## Part 4: Deploy Frontend on Vultr Object Storage

### Step 1: Build Frontend

On your local machine:

```bash
cd tiny-ceo-fe

# Update API endpoint in .env
echo "VITE_API_URL=https://api.yourdomain.com" > .env

# Build for production
npm run build
```

### Step 2: Install S3 CLI Tool

```bash
# Install AWS CLI (works with S3-compatible services)
pip3 install awscli

# Or use s3cmd
apt install -y s3cmd
```

### Step 3: Configure AWS CLI for Vultr

```bash
aws configure

# Enter:
# AWS Access Key ID: <Your Vultr Access Key>
# AWS Secret Access Key: <Your Vultr Secret Key>
# Default region: ewr1
# Default output format: json
```

### Step 4: Upload Frontend to Object Storage

```bash
# Navigate to build directory
cd tiny-ceo-fe/dist

# Upload to Vultr Object Storage
aws s3 sync . s3://tiny-ceo-files/frontend/ \
  --endpoint-url https://ewr1.vultrobjects.com \
  --acl public-read

# Verify upload
aws s3 ls s3://tiny-ceo-files/frontend/ \
  --endpoint-url https://ewr1.vultrobjects.com
```

### Step 5: Configure Static Website Hosting

1. Go to Vultr Dashboard → Object Storage
2. Select `tiny-ceo-files` bucket
3. Go to **Settings** tab
4. Enable **Static Website Hosting**
5. Index document: `index.html`
6. Error document: `index.html` (for SPA routing)
7. Save settings

Your frontend is now available at:
`https://tiny-ceo-files.ewr1.vultrobjects.com/frontend/index.html`

### Step 6: Set Up Custom Domain (Optional)

1. Create CNAME record:
   ```
   app.yourdomain.com → tiny-ceo-files.ewr1.vultrobjects.com
   ```

2. Or use Vultr DNS:
   - Products → DNS → Add Domain
   - Add A record pointing to your bucket

---

## Part 5: Verification & Testing

### Test Backend API

```bash
# Health check
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","timestamp":"...","version":"2.0.0"}
```

### Test Raindrop Connection

```bash
# Check if backend connected to Raindrop
curl https://api.yourdomain.com/api/status

# Check logs
ssh root@YOUR_SERVER_IP
pm2 logs tiny-ceo-api | grep -i raindrop
```

### Test Object Storage

```bash
# Upload a test file
curl -X POST https://api.yourdomain.com/api/files/test \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

### Test Full Application

1. Open frontend: `https://app.yourdomain.com`
2. Create a new workspace
3. Generate AI analysis
4. Chat with an agent
5. Export a pitch deck
6. Verify file appears in Vultr Object Storage

---

## Part 6: Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs tiny-ceo-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart tiny-ceo-api

# View detailed info
pm2 info tiny-ceo-api
```

### NGINX Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Update Application

```bash
# SSH to server
ssh root@YOUR_SERVER_IP

# Pull latest changes
cd /var/www/tiny-ceo
git pull origin main

# Update backend
cd tiny-ceo-be
npm install
pm2 restart tiny-ceo-api

# Update frontend
cd ../tiny-ceo-fe
npm install
npm run build
aws s3 sync dist/ s3://tiny-ceo-files/frontend/ \
  --endpoint-url https://ewr1.vultrobjects.com \
  --acl public-read
```

---

## 🎉 Deployment Complete!

Your Tiny CEO application is now running on:
- **Frontend**: Vultr Object Storage static hosting
- **Backend API**: Vultr Compute VM
- **Database**: Raindrop SmartSQL
- **AI**: Raindrop SmartInference
- **Memory**: Raindrop SmartMemory
- **Files**: Vultr Object Storage

## 📊 Cost Estimate

- Vultr Compute (2 vCPU, 4GB): ~$12/month
- Vultr Object Storage (250GB): ~$5/month
- Raindrop MCP: (check Raindrop pricing)
- **Total**: ~$17-25/month + Raindrop costs

## 🐛 Troubleshooting

### Backend not starting
```bash
pm2 logs tiny-ceo-api --err
# Check for missing environment variables or connection issues
```

### Can't connect to Raindrop
```bash
# Test connectivity
curl -I $RAINDROP_MCP_URL/health

# Check firewall
ufw status
```

### Object Storage upload fails
```bash
# Verify credentials
aws s3 ls --endpoint-url https://ewr1.vultrobjects.com

# Check bucket permissions
```

### CORS errors
```bash
# Add CORS headers to NGINX config
# Or configure CORS in bucket settings
```

## 📞 Support

- Vultr Documentation: https://docs.vultr.com
- Raindrop Documentation: (check Raindrop docs)
- GitHub Issues: https://github.com/yourusername/tiny-ceo/issues
