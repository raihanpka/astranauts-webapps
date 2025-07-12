# SATRIA - Credit Risk Analysis System

## 📋 Deskripsi Aplikasi

SATRIA (Sistem Analisis Risiko Kredit Terintegrasi dan Adaptif) adalah platform analisis risiko kredit modern yang mengintegrasikan teknologi AI untuk memberikan penilaian kredit yang akurat dan komprehensif. Sistem ini menggunakan Cloudflare R2 untuk penyimpanan file yang aman dan efisien.

### Modul Utama:
- **SARANA**: OCR & NLP untuk ekstraksi data dokumen keuangan
- **PRABU**: Credit Scoring AI dengan M-Score dan Altman Z-Score
- **SETIA**: Sentiment Analysis & News Monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Cloudflare dengan R2 Storage
- Google Cloud account (untuk Gemini AI)

### 1. Installation

```bash
# Clone repository
git clone https://github.com/your-org/satria-credit-risk.git
cd satria-credit-risk

# Install dependencies
npm install
# atau
yarn install
```

### 2. Environment Setup

Copy file environment example:
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda:

```env
# Application
NEXT_PUBLIC_APP_NAME=SATRIA
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_KEY=your-api-key-here

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=satria-documents
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# External APIs
NEXT_PUBLIC_OCR_API_URL=https://api.ocr-service.com
NEXT_PUBLIC_SENTIMENT_API_URL=https://api.sentiment-service.com
```

### 3. Cloudflare R2 Setup

#### Langkah 1: Buat Akun Cloudflare dan Aktifkan R2

1. **Daftar/Login ke Cloudflare**
   - Kunjungi [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Daftar akun baru atau login dengan akun existing

2. **Aktifkan R2 Storage**
   - Di dashboard Cloudflare, pilih "R2 Object Storage"
   - Klik "Enable R2" dan ikuti proses setup
   - Verifikasi pembayaran (R2 memiliki free tier 10GB/bulan)

#### Langkah 2: Buat Bucket

1. **Buat Bucket Baru**
   ```bash
   # Di Cloudflare Dashboard > R2 Object Storage
   # Klik "Create bucket"
   # Nama bucket: satria-documents
   # Region: Automatic (recommended)
   ```

2. **Konfigurasi Bucket**
   - **Bucket name**: `satria-documents`
   - **Location**: Automatic
   - **Storage class**: Standard

#### Langkah 3: Generate API Keys

1. **Buat R2 Token**
   ```bash
   # Di Cloudflare Dashboard > R2 Object Storage > Manage R2 API tokens
   # Klik "Create API token"
   ```

2. **Konfigurasi Token**
   - **Token name**: `satria-r2-token`
   - **Permissions**: 
     - Object Read
     - Object Write
     - Object Delete
   - **Bucket resources**: Include specific bucket > `satria-documents`

3. **Simpan Credentials**
   ```env
   CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
   CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   ```

#### Langkah 4: Setup Custom Domain (Opsional)

1. **Buat Custom Domain**
   ```bash
   # Di R2 bucket settings > Custom domains
   # Tambahkan domain: files.satria.com
   ```

2. **Update Environment**
   ```env
   NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://files.satria.com
   ```

### 4. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔧 Arsitektur Sistem

### Storage Architecture

```
SATRIA Application
├── Frontend (Next.js)
│   ├── File Upload Component
│   ├── Document Viewer
│   └── Progress Tracking
├── Backend API Routes
│   ├── /api/upload (File Upload)
│   ├── /api/applications (CRUD)
│   └── /api/stats (Statistics)
├── Cloudflare R2 Storage
│   ├── /documents (Financial docs)
│   ├── /images (Company logos)
│   └── /reports (Analysis results)
└── External Services
    ├── OCR Service (SARANA)
    ├── Credit Scoring (PRABU)
    └── Sentiment Analysis (SETIA)
```

### File Upload Flow

1. **Client Upload**: User selects files via drag & drop
2. **Validation**: File type, size, and count validation
3. **API Route**: `/api/upload` handles multipart form data
4. **R2 Storage**: Files uploaded to Cloudflare R2 bucket
5. **Database**: File metadata stored in application database
6. **Response**: Public URL returned to client

### Security Features

- **File Type Validation**: Only allowed file types accepted
- **Size Limits**: Maximum 10MB per file
- **Secure URLs**: Presigned URLs for temporary access
- **Access Control**: Bucket-level permissions
- **CORS Protection**: Proper CORS headers configured

## 📁 Project Structure

```
satria-credit-risk/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── upload/        # File upload endpoint
│   │   ├── applications/  # Application CRUD
│   │   └── stats/         # System statistics
│   ├── dashboard/         # Dashboard pages
│   ├── form/             # Multi-step form
│   └── layout.tsx        # Root layout
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── file-upload.tsx   # File upload component
│   └── ...
├── lib/                  # Utilities & Configurations
│   ├── cloudflare-r2.ts # R2 storage functions
│   ├── database.ts      # Database operations
│   ├── api-handlers.ts  # API client functions
│   └── utils.ts         # Utility functions
├── public/              # Static assets
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🗄️ Database Schema

### Application Table
```typescript
interface Application {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  // ... other fields
  documentUrls?: string[]  // R2 file URLs
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}
```

### File Metadata
```typescript
interface FileMetadata {
  fileName: string
  fileSize: number
  contentType: string
  uploadedAt: Date
  fileUrl: string
}
```

## 🔌 API Endpoints

### File Upload
```typescript
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- folder: string (optional, default: "documents")

Response:
{
  success: boolean
  data?: {
    fileUrl: string
    fileName: string
    fileSize: number
    originalName: string
  }
  error?: string
}
```

### Applications
```typescript
// Get all applications
GET /api/applications

// Create new application
POST /api/applications
Body: ApplicationData

// Get specific application
GET /api/applications/[id]

// Update application
PUT /api/applications/[id]
Body: Partial<ApplicationData>

// Delete application
DELETE /api/applications/[id]
```

### System Statistics
```typescript
GET /api/stats

Response:
{
  success: boolean
  data: {
    totalApplications: number
    successfulApplications: number
    errorRate: number
    averageProcessingTime: number
    lastUpdated: Date
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

### Manual Testing

1. **File Upload Testing**
   ```bash
   # Test different file types
   - PDF documents ✓
   - Image files (JPG, PNG) ✓
   - Office documents (DOC, XLS) ✓
   - Large files (>10MB) ✗
   - Invalid file types ✗
   ```

2. **API Testing**
   ```bash
   # Test API endpoints
   curl -X POST http://localhost:3000/api/applications \
     -H "Content-Type: application/json" \
     -d '{"companyName": "Test Company", ...}'
   ```

## 📦 Build & Deploy

### Development Build
```bash
npm run build
npm run start
```

### Production Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID
vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY
# ... add all required env vars
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t satria-app .
docker run -p 3000:3000 --env-file .env satria-app
```

## 🔧 Configuration

### Cloudflare R2 Advanced Configuration

#### CORS Setup
```javascript
// R2 Bucket CORS configuration
{
  "corsRules": [
    {
      "allowedOrigins": ["https://your-domain.com"],
      "allowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "allowedHeaders": ["*"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

#### Lifecycle Rules
```javascript
// Auto-delete temporary files after 30 days
{
  "lifecycleRules": [
    {
      "id": "delete-temp-files",
      "status": "Enabled",
      "filter": {
        "prefix": "temp/"
      },
      "expiration": {
        "days": 30
      }
    }
  ]
}
```

### Performance Optimization

1. **File Compression**
   ```typescript
   // Compress images before upload
   import imageCompression from 'browser-image-compression'
   
   const compressedFile = await imageCompression(file, {
     maxSizeMB: 1,
     maxWidthOrHeight: 1920
   })
   ```

2. **Parallel Uploads**
   ```typescript
   // Upload multiple files in parallel
   const uploadPromises = files.map(file => uploadFileToR2(file))
   const results = await Promise.all(uploadPromises)
   ```

3. **CDN Integration**
   ```env
   # Use Cloudflare CDN for faster file delivery
   NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://cdn.satria.com
   ```

## 🔒 Security Best Practices

### File Upload Security
- **File Type Validation**: Whitelist allowed MIME types
- **File Size Limits**: Prevent large file uploads
- **Virus Scanning**: Integrate with antivirus services
- **Content Scanning**: Check for malicious content

### Access Control
- **Presigned URLs**: Temporary access to files
- **IP Restrictions**: Limit access by IP address
- **Rate Limiting**: Prevent abuse of upload endpoints
- **Authentication**: Secure API endpoints (when implemented)

## 🚨 Troubleshooting

### Common Issues

1. **Upload Fails with 403 Error**
   ```bash
   # Check R2 credentials and permissions
   # Verify bucket name and endpoint URL
   # Ensure CORS is properly configured
   ```

2. **Files Not Accessible**
   ```bash
   # Check public URL configuration
   # Verify custom domain setup
   # Ensure bucket is publicly readable
   ```

3. **Large File Upload Timeout**
   ```bash
   # Increase timeout in next.config.js
   # Use multipart upload for large files
   # Implement upload resumption
   ```

### Debug Mode
```env
# Enable detailed logging
DEBUG=true
API_LOGGING=true
```

### Monitoring
```typescript
// Add monitoring for upload success/failure rates
const uploadMetrics = {
  totalUploads: 0,
  successfulUploads: 0,
  failedUploads: 0,
  averageUploadTime: 0
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Use conventional commit messages

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔄 Migration Notes

### From Firestore to Cloudflare R2

1. **Removed Dependencies**
   - ❌ Firebase SDK
   - ❌ Firestore authentication
   - ❌ Firebase Storage

2. **Added Dependencies**
   - ✅ AWS SDK for S3 (R2 compatibility)
   - ✅ Cloudflare R2 integration
   - ✅ Local database simulation

3. **Breaking Changes**
   - File storage moved from Firebase to R2
   - Authentication system removed
   - Database operations simplified
   - API endpoints restructured

4. **Migration Steps**
   - Update environment variables
   - Install new dependencies
   - Configure R2 bucket
   - Test file upload functionality
   - Deploy with new configuration

## 🎯 Roadmap

- [ ] **Database Integration**: PostgreSQL/MySQL support
- [ ] **Authentication**: JWT-based auth system
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Advanced Analytics**: Enhanced reporting
- [ ] **Mobile App**: React Native application
- [ ] **API Documentation**: OpenAPI/Swagger docs
- [ ] **Monitoring**: Application performance monitoring
- [ ] **Backup System**: Automated data backup
