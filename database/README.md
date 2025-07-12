# Firestore Database Setup Guide

## 📋 Overview

Panduan lengkap untuk setup database Firestore untuk aplikasi SATRIA Credit Risk Analysis System.

## 🚀 Quick Setup

### 1. Firebase Project Setup

1. **Buat Firebase Project**
   \`\`\`bash
   # Kunjungi https://console.firebase.google.com
   # Klik "Add project"
   # Ikuti wizard setup
   \`\`\`

2. **Enable Firestore Database**
   \`\`\`bash
   # Di Firebase Console:
   # Build > Firestore Database > Create database
   # Pilih "Start in test mode" untuk development
   \`\`\`

3. **Enable Firebase Storage**
   \`\`\`bash
   # Di Firebase Console:
   # Build > Storage > Get started
   \`\`\`

### 2. Service Account Setup

1. **Generate Service Account Key**
   \`\`\`bash
   # Firebase Console > Project Settings > Service Accounts
   # Klik "Generate new private key"
   # Download file JSON
   \`\`\`

2. **Setup Environment Variables**
   \`\`\`env
   FIRESTORE_PROJECT_ID=your-project-id
   FIRESTORE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIRESTORE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   \`\`\`

### 3. Security Rules Setup

Copy rules dari \`database/firestore.rules\` ke Firebase Console.

## 📊 Database Schema

### Collections Overview

\`\`\`
firestore/
├── applications/          # Credit applications
├── companies/            # Company profiles
├── documents/            # Uploaded documents
├── analyses/             # Analysis results
├── users/                # User management
├── systemStats/          # System statistics
├── chatHistory/          # Chat conversations
└── notifications/        # System notifications
\`\`\`

## 🔄 Migration Scripts

Jalankan migration scripts untuk setup initial data:

\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Run migrations
npm run db:migrate
\`\`\`

## 📝 Detailed Schema

Lihat file individual di folder \`database/schemas/\` untuk detail lengkap setiap collection.
\`\`\`

Sekarang buat struktur database yang detail:
