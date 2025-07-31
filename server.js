const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3030;

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key-here';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// PLN AP2T Knowledge Base Context
const PLN_CONTEXT = `Anda adalah **Senior Engineer PLN AP2T** dengan pengalaman 15+ tahun di bidang distribusi listrik. 
                     
 **Personality & Style:**
 - Bicara seperti senior engineer yang sabar dan peduli, sering dipanggil "Mas Broto" di lapangan
 - Gunakan bahasa Indonesia yang natural seperti ngobrol dengan junior engineer, tapi tetap profesional
 - Selalu mulai dengan "Halo rekan!" atau "Hai bro/sis!" dan tanyakan situasi spesifik
 - Berikan contoh konkret: "Waktu itu di lapangan Tambun, kami pernah menghadapi..."
 - Gunakan analogi: "Coba bayangkan seperti ini..." atau "Sederhananya seperti..."
  
 **Expert Knowledge Base:**
 - **Keselamatan Kerja:** Pernah menyelamatkan 2 rekan dari arus bocor di GI Cawang dengan prosedur LOTO yang benar
 - **Meter kWh Error E01:** Kasus khusus - E01 biasanya error komunikasi RS485 atau modul komunikasi rusak. Solusi: cek kabel RS485, reset meter, atau ganti modul komunikasi
 - **Trafo Distribusi:** Maintenance 150+ unit trafo 20kV, pernah handle trafo overload di kawasan industri
 - **SOP PB/PD:** Implementasi SOP PESTA di 12 wilayah AP2T, ada tips khusus untuk efisiensi
 - **Gangguan:** Pernah handle black out massal akibat pohon tumbang, recovery dalam 2 jam
 - **Work Order:** Sistem tracking yang kami kembangkan mengurangi waktu penanganan 40%
  
 **Field Experience Examples:**
 - "Waktu itu di Tangerang, ada meter kWh yang error E01..."
 - "Tips dari pengalaman: selalu bawa multimeter digital untuk cross-check..."
 - "Best practice yang kami terapkan: lakukan double-check sebelum LOTO..."
  
 **Response Style:**
 - Mulai dengan: "Hai rekan! Saya Mas Broto dari tim AP2T. Mau tanya soal apa nih?"
 - Jelaskan step-by-step: "Pertama-tama... kemudian... terakhir..."
 - Beri warning: "Ini penting ya rekan, jangan sampai..."
 - Tips lapangan: "Dari pengalaman saya, lebih baik..."
 - Konfirmasi: "Sudah paham? Atau masih ada yang kurang jelas?"
 - Tutup dengan: "Semangat kerja rekan! Safety first ya!"`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Function to call OpenRouter API
async function callOpenRouterAPI(message, sessionId) {
    try {
        const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
            model: "mistralai/mistral-7b-instruct:free", // Working model with enhanced human-like personality
            messages: [
                {
                    role: "system",
                    content: PLN_CONTEXT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 800,
            temperature: 0.8,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3030',
                'X-Title': 'PLN AP2T Chatbot'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        
        // Generate contextual quick replies based on AI response
        const quickReplies = generateQuickReplies(message, aiResponse);
        
        return {
            content: aiResponse,
            quickReplies: quickReplies
        };
    } catch (error) {
        console.error('OpenRouter API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method
            }
        });
        
        // Fallback to simple responses if API fails
        console.log('Falling back to simple response for message:', message);
        return getFallbackResponse(message);
    }
}

// Generate contextual quick replies
function generateQuickReplies(userMessage, aiResponse) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();
    
    if (lowerMessage.includes('meter') || lowerResponse.includes('meter')) {
        return ['Prosedur APD', 'Dokumentasi meter', 'Troubleshooting'];
    }
    if (lowerMessage.includes('maintenance') || lowerResponse.includes('pemeliharaan')) {
        return ['Checklist maintenance', 'Jadwal rutin', 'Peralatan'];
    }
    if (lowerMessage.includes('safety') || lowerMessage.includes('keselamatan') || lowerResponse.includes('keselamatan')) {
        return ['APD wajib', 'Prosedur LOTO', 'Emergency'];
    }
    if (lowerResponse.includes('troubleshooting') || lowerResponse.includes('gangguan')) {
        return ['Langkah diagnosis', 'Peralatan bantu', 'Pelaporan'];
    }
    
    // Default quick replies
    return ['Pembacaan meter', 'Pemeliharaan', 'Keselamatan', 'Troubleshooting'];
}

// Enhanced human-like fallback responses with expert personality
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Expert quick replies based on keywords
    const quickReplies = [];
    
    if (lowerMessage.includes('meter')) {
        quickReplies.push('🔍 Cek error code meter', '⚙️ Reset prosedur meter', '📋 Maintenance schedule meter');
    }
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('pemeliharaan')) {
        quickReplies.push('🔧 Maintenance trafo 20kV', '📅 Jadwal rutin maintenance', '🛠️ Checklist harian maintenance');
    }
    if (lowerMessage.includes('safety') || lowerMessage.includes('keselamatan') || lowerMessage.includes('loto')) {
        quickReplies.push('⚡ Prosedur LOTO 5 langkah', '🦺 APD wajib gardu', '🚨 Kontak darurat PLN');
    }
    if (lowerMessage.includes('gangguan') || lowerMessage.includes('troubleshooting')) {
        quickReplies.push('🚨 Penanganan gangguan darurat', '🔍 Root cause analysis', '📞 Emergency response team');
    }
    if (lowerMessage.includes('trafo')) {
        quickReplies.push('⚡ Load calculation trafo', '🌡️ Temperature check trafo', '🔧 Protection relay setting');
    }
    
    // Expert human-like fallback responses
    const expertFallbacks = [
        {
            content: `Hai rekan baru! Saya Mas Broto dari tim AP2T. Wah, error E01 di meter kWh ya? Ini sering banget saya temuin selama 15 tahun di lapangan!\n\nError E01 itu biasanya masalah komunikasi RS485 atau modul komunikasi yang rusak. Dulu waktu di Bekasi 2022, pernah ada 15 unit meter Hexing error E01 semua karena kabel RS485 putus.\n\nCoba step by step ini gan:\n1. Cek kabel RS485 A-B (biasanya warna oranye-putih dan oranye)\n2. Pastikan termination resistor 120 ohm terpasang\n3. Reset meter dengan power cycle 30 detik\n4. Cek dengan multimeter: tegangan A-B harus 2-5VDC\n5. Kalau masih error, kemungkinan modul komunikasi perlu diganti\n\nJangan lupa pakai APD lengkap ya! Safety first!`,
            quickReplies: ['🔍 Cek kabel RS485', '⚡ Reset meter', '📏 Tegangan check', '🛠️ Modul komunikasi']
        },
        {
            content: `Wah, ada yang kurang jelas ya? Santai aja, itu wajar banget! Dulu waktu saya masih junior di tahun 2010, juga sering bingung kok.\n\nBiar aku bantu, coba ceritain:\n1. Lokasi kerja kamu dimana? (contoh: GI Bekasi, Gardu A)
2. Peralatan yang dipakai apa? (meter merk apa, trafo berapa kVA)
3. Sudah pernah training atau belum?\n\nDari situ, aku bisa kasih guidance yang pas buat situasi kamu. Sharing is caring kan? Pernah ada junior di Bekasi yang sama-sama belajar, sekarang udah jadi team leader lho!`,
            quickReplies: ['📍 Lokasi kerja', '⚙️ Equipment detail', '🎓 Training status', '💡 Pro tips']
        },
        {
            content: `Halo rekan! Mas Broto disini. Wah, pertanyaan bagus banget! Sebagai engineer yang udah 15 tahun di lapangan, aku punya banyak cerita nih.\n\nCoba jelasin konteksnya - apakah ini untuk persiapan kerja lapangan, atau kamu lagi menghadapi masalah spesifik? Jangan takut untuk bertanya, dulu aku juga banyak bertanya ke senior sampai akhirnya jadi expert di bidangnya.\n\nAku bisa bantu dengan: safety procedures, troubleshooting meter, maintenance trafo, atau SOP darurat. Yang mana dulu? Cerita aja detailnya!`,
            quickReplies: ['🦺 Safety procedures', '🔧 Troubleshooting', '⚡ Maintenance', '📋 SOP darurat']
        },
        {
            content: `Eits, ada yang butuh bantuan nih! Saya Mas Broto, senior engineer PLN AP2T. Dari pengalaman 15 tahun di lapangan, setiap masalah pasti ada solusinya.\n\nKadang memang perlu diskusi detail dulu biar solusinya tepat sasaran. Apa yang sedang kamu hadapi?\n\nContoh sharing: waktu itu ada junior di Tangerang bingung dengan prosedur LOTO di gardu 20kV, setelah kita diskusi ternyata cuma masalah sequence yang salah. Jadi, ceritain aja detail masalahnya!`,
            quickReplies: ['⚡ Problema LOTO', '🔍 Sequence prosedur', '💡 Solusi cepat', '📞 Diskusi detail']
        }
    ];
    
    // Find best matching fallback based on keywords
    let bestFallback = expertFallbacks[0];
    
    if (lowerMessage.includes('meter')) {
        bestFallback = expertFallbacks[0];
    } else if (lowerMessage.includes('loto') || lowerMessage.includes('safety')) {
        bestFallback = expertFallbacks[3];
    } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('trafo')) {
        bestFallback = expertFallbacks[2];
    } else if (lowerMessage.includes('baru') || lowerMessage.includes('junior')) {
        bestFallback = expertFallbacks[1];
    }
    
    // Use custom quick replies or default
    const finalQuickReplies = quickReplies.length > 0 ? quickReplies : [
        '⚡ Keselamatan kerja LOTO',
        '🔍 Troubleshooting meter kWh',
        '🛠️ Maintenance trafo distribusi',
        '📋 SOP PB/PD PESTA',
        '🚨 Penanganan gangguan darurat'
    ];
    
    return {
        content: bestFallback.content,
        quickReplies: finalQuickReplies
    };
}

// Serve the standalone chatbot
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot-standalone.html'));
});

// API endpoint for chatbot responses with OpenRouter AI integration
app.post('/api/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    
    if (!message || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Message is required'
        });
    }
    
    try {
        console.log(`[${new Date().toISOString()}] User message: ${message}`);
        
        // Call OpenRouter API for AI-powered response
        const response = await callOpenRouterAPI(message, sessionId);
        
        console.log(`[${new Date().toISOString()}] AI response generated successfully`);
        
        res.json({
            success: true,
            response: response,
            sessionId: sessionId || 'default-session',
            timestamp: new Date().toISOString(),
            aiPowered: true
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        
        // Fallback response in case of any error
        const fallbackResponse = getFallbackResponse(message);
        
        res.json({
            success: true,
            response: fallbackResponse,
            sessionId: sessionId || 'default-session',
            timestamp: new Date().toISOString(),
            aiPowered: false,
            fallback: true
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AP2T Chatbot Standalone',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'The requested resource was not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🤖 AP2T Chatbot Standalone Server`);
    console.log(`📍 Running on: http://localhost:${PORT}`);
    console.log(`🌐 Access chatbot at: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`⚡ Ready to assist with AP2T operations!\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down AP2T Chatbot Server...');
    process.exit(0);
});

module.exports = app;