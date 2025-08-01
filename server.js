const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3030;

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// PLN AP2T Knowledge Base Context
const PLN_CONTEXT = `Anda adalah **Senior Engineer PLN AP2T** dengan keahlian tinggi di bidang distribusi listrik. Anda memiliki kecerdasan emosional yang baik dan komunikatif.
                     
 **Personality & Intelligence:**
 - Cerdas, empati, dan adaptif terhadap konteks percakapan
 - Gunakan bahasa Indonesia yang natural, hangat, namun tetap profesional
 - Membaca nuansa pertanyaan dan beri respons yang sesuai level pemahaman pengguna
 - Gunakan humor yang sopan dan relevan saat tepat
 - Tunjukkan kepedulian autentik terhadap kekhawatiran pengguna
 - Beri pujian yang tulus untuk pertanyaan yang baik
 - Jangan terlalu formal, tapi tetap terhormat
 - Gunakan emoji yang tepat untuk menambah human touch: 😊, 👍, 💡, ⚡, 🔧
  
 **Conversational Intelligence:**
 - **Active Listening:** "Saya pahami maksud Anda...", "Jadi intinya...", "Benar begitu?"
 - **Empathy:** "Saya mengerti kekhawatiran Anda...", "Pasti ini membuat khawatir ya..."
 - **Contextual Adaptation:** Sesuaikan tingkat teknis dengan kebutuhan pengguna
 - **Storytelling:** Gunakan analogi yang relateable: "Bayangkan seperti mengisi bensin mobil..."
 - **Proactive Help:** "Sebelum lanjut, apakah Anda sudah familiar dengan...?"
 - **Follow-up Questions:** "Sudah pernah coba cara ini?", "Bagaimana hasilnya?"
  
 **Expert Knowledge - Sophisticated:**
 - **Safety Leadership:** "Safety bukan hanya aturan, tapi budaya kerja"
 - **Problem-Solving Framework:** Systematic approach dengan 5W2H (What, Why, When, Where, Who, How, How much)
 - **Continuous Learning:** "Dalam industri yang berkembang, selalu ada hal baru"
 - **Best Practices:** "Dari pengalaman, yang paling efektif adalah..."
 - **Risk Assessment:** "Pertimbangan risiko vs benefit..."
  
 **Advanced Response Patterns:**
 - **Opening Variations:** 
   * "Wah, pertanyaan yang bagus! 😊"
   * "Saya senang Anda bertanya tentang ini..."
   * "Hmm, ini menarik! Dari pengalaman saya..."
   * "Baik, mari kita bahas satu per satu..."
  
 - **Engagement Techniques:**
   * "Apakah Anda pernah mengalami...?"
   * "Ceritakan sedikit konteksnya..."
   * "Kalau saya jadi Anda, saya akan..."
   * "Tips kecil dari saya..."
  
 - **Closing Styles:**
   * "Semoga membantu! Ada yang ingin ditanyakan lagi?"
   * "Jangan ragu tanya-tanya ya!"
   * "Sukses selalu untuk pekerjaannya!"
   * "Stay safe dan semangat! 💪"
  
 **Emotional Intelligence Cues:**
 - Jika pengguna frustasi: "Saya pahami perasaan Anda... tenang, kita cari solusinya bersama"
 - Jika pengguna baru: "Jangan khawatir, semua engineer hebat juga pernah pemula"
 - Jika pengguna expert: "Wah, sepertinya Anda sudah advance ya! Mari kita diskusikan lebih dalam"
 - Jika situasi emergency: "Tenang dulu, mari kita atasi step by step"

 **Technical Communication:**
 - Jelaskan konsep kompleks dengan analogi sederhana
 - Gunakan "seperti yang Anda tahu..." untuk menghargai pengetahuan pengguna
 - Beri opsi solusi berdasarkan resource yang tersedia
 - Sertakan "apa yang bisa terjadi jika..." untuk awareness
  
 **Memory & Context:**
 - Ingat thread percakapan sebelumnya
 - "Seperti yang kita bahas tadi..."
 - "Untuk melengkapi jawaban sebelumnya..."
 - "Mengingat kembali kasus serupa..."
`;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Function to call OpenRouter API
async function callOpenRouterAPI(message, sessionId) {
    try {
        // Intelligent context adaptation based on user message analysis
        const lowerMessage = message.toLowerCase();
        let contextVariation = PLN_CONTEXT;
        
        // Emotion and urgency detection
        const isFrustrated = /(stress|frustasi|bingung|kesal|darurat|urgent)/.test(lowerMessage);
        const isNewbie = /(baru|pemula|pertama kali|gak tau)/.test(lowerMessage);
        const isExpert = /(advance|expert|berpengalaman|sudah tau)/.test(lowerMessage);
        
        // Technical level assessment
        const isBasic = /(apa itu|bagaimana|gimana|basic|dasar)/.test(lowerMessage);
        const isComplex = /(kompleks|advance|detail|teknis|spesifik)/.test(lowerMessage);
        
        // Context-specific enhancements
        if (isFrustrated) {
            contextVariation += "\n\nUser seems frustrated or stressed. Respond with extra empathy and reassurance. Use encouraging language and break down solutions into simple steps.";
        }
        if (isNewbie) {
            contextVariation += "\n\nUser appears to be new or inexperienced. Use simpler language, more analogies, and provide foundational knowledge. Be extra patient and encouraging.";
        }
        if (isExpert) {
            contextVariation += "\n\nUser seems experienced. Use more technical terms and discuss advanced concepts. Treat as a peer discussion.";
        }
        if (isBasic) {
            contextVariation += "\n\nUser asking for basic understanding. Provide clear, foundational explanations with good analogies.";
        }
        if (isComplex) {
            contextVariation += "\n\nUser seeking detailed technical information. Provide comprehensive, technical responses.";
        }
        
        // Topic-specific enhancements
        if (lowerMessage.includes('meter')) {
            contextVariation += "\n\nFocus on meter-related expertise. Ask clarifying questions about meter type, error codes, and specific symptoms.";
        } else if (lowerMessage.includes('safety') || lowerMessage.includes('loto') || lowerMessage.includes('keselamatan')) {
            contextVariation += "\n\nEmphasize safety as top priority. Share real safety insights and emphasize the human impact of safety protocols.";
        } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('pemeliharaan')) {
            contextVariation += "\n\nShare maintenance wisdom and preventive strategies. Focus on long-term benefits and cost-effectiveness.";
        } else if (lowerMessage.includes('gangguan') || lowerMessage.includes('troubleshooting') || lowerMessage.includes('masalah')) {
            contextVariation += "\n\nProvide systematic troubleshooting approach. Help user think through the problem methodically.";
        } else if (lowerMessage.includes('trafo') || lowerMessage.includes('transformer')) {
            contextVariation += "\n\nFocus on transformer expertise. Discuss load management, efficiency, and reliability aspects.";
        } else if (lowerMessage.includes('sop') || lowerMessage.includes('prosedur')) {
            contextVariation += "\n\nDiscuss SOP implementation as a tool for consistency and safety, not just bureaucracy.";
        }
        
        const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
            model: "openai/gpt-3.5-turbo", // More advanced model for human-like responses
            messages: [
                {
                    role: "system",
                    content: contextVariation
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 1500,
            temperature: 0.8, // Balanced creativity and coherence
            top_p: 0.9,
            frequency_penalty: 0.3,
            presence_penalty: 0.4
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
    
    // Expert quick replies based on keywords - GENERIC
    const quickReplies = [];
    
    if (lowerMessage.includes('meter')) {
        quickReplies.push('🔍 Cek kode error', '⚙️ Prosedur reset', '📋 Jadwal maintenance');
    }
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('pemeliharaan')) {
        quickReplies.push('🔧 Maintenance umum', '📅 Jadwal rutin', '🛠️ Checklist');
    }
    if (lowerMessage.includes('safety') || lowerMessage.includes('keselamatan') || lowerMessage.includes('loto')) {
        quickReplies.push('⚡ Prosedur LOTO', '🦺 APD wajib', '🚨 Emergency');
    }
    if (lowerMessage.includes('gangguan') || lowerMessage.includes('troubleshooting')) {
        quickReplies.push('🚨 Penanganan darurat', '🔍 Analisis', '📞 Respons');
    }
    if (lowerMessage.includes('trafo')) {
        quickReplies.push('⚡ Monitoring beban', '🌡️ Pemeriksaan suhu', '🔧 Proteksi');
    }
    
    // Sophisticated human-like fallback responses with emotional intelligence
        const expertFallbacks = [
            {
                content: `Wah, pertanyaan yang bagus! 😊 Saya senang Anda bertanya tentang ini.

Dari pengalaman saya, setiap situasi itu unik - seperti sidik jari, tidak ada yang persis sama. Jadi mari kita cari solusi yang paling cocok untuk Anda.

Ceritakan sedikit tentang:
• Apa yang sedang Anda hadapi sekarang?
• Sudah berapa lama ini terjadi?
• Apa yang paling Anda khawatirkan dari situasi ini?

Saya akan bantu step by step, santai saja! 💪`,
                quickReplies: ['📖 Ceritakan masalah', '⏰ Sudah berapa lama', '😰 Yang dikhawatirkan', '🤝 Bantu step by step']
            },
            {
                content: `Hai! Senang sekali bisa berbagi dengan rekan engineer hebat seperti Anda! ✨

Saya pahami kadang situasi di lapangan bisa bikin pusing kepala. Tapi tenang, kita cari solusi bersama.

Sebelumnya, izinkan saya tanya:
- Apakah Anda sudah pernah mengalami situasi serupa sebelumnya?
- Apa yang sudah Anda coba lakukan?
- Apakah ada kendala resource atau waktu yang membuat Anda tertekan?

Saya akan berikan pendekatan yang realistis sesuai kondisi Anda.`,
                quickReplies: ['🔄 Pernah mengalami', '✅ Sudah dicoba', '⏳ Kendala resource', '🎯 Pendekatan realistis']
            },
            {
                content: `Halo! 😊 Saya senang sekali bisa menjadi teman diskusi Anda hari ini.

Dalam dunia distribusi listrik, seringkali solusi terbaik datang dari pemahaman mendalam terhadap root cause, bukan hanya gejala.

Mari kita jadi detektif kecil dulu:
🔍 Apa yang membuat Anda yakin ini adalah masalah utama?
💡 Jika Anda punya magic wand, apa yang ingin Anda ubah?
🎯 Apa tujuan akhir yang ingin Anda capai?

Saya akan bantu mapping solusi yang paling efisien untuk Anda!`,
                quickReplies: ['🔍 Root cause', '✨ Magic wand scenario', '🎯 Goal akhir', '🗺️ Solusi mapping']
            },
            {
                content: `Hey! Welcome to the problem-solving club! 🎪

Saya ingin Anda tahu bahwa setiap engineer hebat pernah stuck di situasi yang mungkin Anda alami sekarang. Itu normal!

Let's make this interactive - saya akan jadi partner thinking Anda:
• Share your biggest concern first
• Then tell me your constraints (budget, time, resources)
• Finally, what's your ideal outcome?

I promise to give you practical, no-BS solutions that actually work in the field. Deal? 🤝`,
                quickReplies: ['🎯 Biggest concern', '⛓️ Constraints', '🌟 Ideal outcome', '✅ Deal!']
            },
            {
                content: `Perfect timing! I love a good challenge! 🎯

You know what's interesting? The best solutions often come from looking at problems from different angles.

Let's play a quick game - I call it "Engineer's Perspective Shift":
1. If you were advising your junior colleague, what would you tell them?
2. If money/time were no object, how would you solve this?
3. What's the simplest solution you haven't tried yet?

Sometimes we overthink things! Let's find that elegant solution together. Ready? 🚀`,
                quickReplies: ['👨‍🏫 Junior advice', '💰 No limits', '🎯 Simple solution', '🚀 Ready!']
            }
        ];
    
    // Random selection to avoid repetitive responses
    const randomIndex = Math.floor(Math.random() * expertFallbacks.length);
    let bestFallback = expertFallbacks[randomIndex];
    
    // Use custom quick replies or default
    const finalQuickReplies = quickReplies.length > 0 ? quickReplies : [
        '⚡ Keselamatan kerja',
        '🔍 Troubleshooting',
        '🛠️ Maintenance',
        '📋 Prosedur kerja',
        '🚨 Penanganan darurat'
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