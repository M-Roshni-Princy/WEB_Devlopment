# Unfazed — Simple Therapist Practice Portal

A beginner-friendly version of the Unfazed web development major project. It includes a public therapist profile, appointment booking, a small therapist dashboard, client list, and shared/private session notes.

This is a learning/demo project. It uses local browser storage so it can run without setting up MongoDB or payment credentials. It does not process real payments, send real notifications, or provide secure storage for actual clinical records.

## Requirements
- Node.js 18 or newer
- npm

## Run the project
Open two terminals.

### 1. Backend
```bash
cd unfazed-backend
npm install
npm run dev
```
API runs at `http://localhost:5000`.

### 2. Frontend
```bash
cd unfazed-frontend
npm install
npm run dev
```
Open the local URL shown by Vite, usually `http://localhost:5173`.

## Included
- Home page and branded therapist profile
- Appointment booking form
- Therapist dashboard with appointments and clients
- Session notes with private/shared visibility in the demo UI
- Simple Express API health route and example endpoints

## Demo note
The UI stores demo records in this browser only. The API is a small starter backend, not a production clinical system. Do not enter real client or health information. Authentication, database persistence, payment gateway, real-time chat, and production-grade authorization are not included in this simplified version.
