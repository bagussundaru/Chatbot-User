# PLN AP2T - Smart Assistant (Standalone)

Chatbot standalone untuk PLN AP2T yang berjalan di `http://localhost:3030`

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env file dengan API key Anda
   ```

3. **Run Server**
   ```bash
   npm start
   ```

4. **Access Chatbot**
   Buka browser dan akses: `http://localhost:3030`

## File Structure

```
chatbot-users-standalone/
├── server.js          # Express server utama
├── index.html         # Interface chatbot
├── package.json       # Dependencies
├── .env.example       # Template environment variables
├── favicon.ico        # Icon aplikasi
├── manifest.json      # PWA manifest
└── README.md          # Dokumentasi ini
```

## Features

- ✅ Chatbot AI dengan konteks PLN AP2T
- ✅ Interface web yang responsif
- ✅ Integrasi dengan OpenRouter API
- ✅ Standalone server (tidak perlu deployment)
- ✅ Konfigurasi environment yang mudah

## Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3030
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## API Endpoints

- `GET /` - Interface chatbot
- `POST /api/chat` - Endpoint untuk chat dengan AI

## Support

Untuk bantuan teknis, hubungi tim PLN AP2T.