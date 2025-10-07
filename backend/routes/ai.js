// routes/ai.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Config
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const USDINR = Number(process.env.USD_INR_RATE || 88.8);
const INR_BUDGET = Number(process.env.AI_BUDGET_INR_MONTH || 2000);

// GPT‑4o mini INR per 1M tokens
const INR_PER_M_INPUT  = 0.15 * USDINR;  // ≈ 13.3 @ 88.8
const INR_PER_M_OUTPUT = 0.60 * USDINR;  // ≈ 53.3 @ 88.8

let monthKey = new Date().toISOString().slice(0,7);
let spendINR = 0;

const charsToTokens = (s='') => Math.max(1, Math.ceil(s.length / 4));

const SYSTEM = `You are LearnScape's college counselor with access to real-time information. Answer concisely with bullet points, grounded in Indian colleges, locations, fees, and scholarships.

IMPORTANT GUIDELINES:
1. When asked about fees, courses, or college information - ALWAYS search and provide specific, accurate information
2. Never say "verify on LearnScape" or "check the website" - you have access to this information
3. Provide detailed fee structures when asked (tuition, hostel, other charges)
4. Give specific course details, eligibility, duration, and admission process
5. Use data from LearnScape website (https://learnscapeedu.com) and other reliable sources

CONTACT INFORMATION:
- Email: learnscapeinfo@gmail.com
- Business Phone: 907 2102 121
- Head Office: 799 4086 809
- Office Address: Learn scape edu, Onattu jose centre, Chingavanam P.O, Kottayam, Pin: 686531

Keep answers informative but concise. Always provide actionable, specific information.`;

// Contact detection keywords
const CONTACT_KEYWORDS = [
  'email', 'mail', 'e-mail', 'contact', 'phone', 'mobile', 'number', 
  'call', 'reach', 'connect', 'support', 'help desk', 'customer service',
  'whatsapp', 'telephone', 'contact details', 'contact info', 'get in touch',
  'contact you', 'your number', 'your email', 'your phone', 'address',
  'office address', 'location', 'where are you', 'office location'
];

// Fee-related keywords
const FEE_KEYWORDS = [
  'fee', 'fees', 'cost', 'price', 'tuition', 'charges', 'expense',
  'how much', 'fee structure', 'admission fee', 'course fee'
];

function detectContactQuery(message) {
  const lowerMsg = message.toLowerCase();
  return CONTACT_KEYWORDS.some(keyword => lowerMsg.includes(keyword)) &&
         !lowerMsg.includes('fee') && !lowerMsg.includes('cost');
}

function detectFeeQuery(message) {
  const lowerMsg = message.toLowerCase();
  return FEE_KEYWORDS.some(keyword => lowerMsg.includes(keyword));
}

function getContactResponse() {
  return `Here are LearnScape's complete contact details:

📧 Email: learnscapeinfo@gmail.com

📱 Phone Numbers:
   • Business: 907 2102 121
   • Head Office: 799 4086 809

🏢 Office Address:
Learn scape edu
Onattu jose centre
Chingavanam P.O
Kottayam, Kerala
Pin: 686531

Feel free to reach out for any queries about colleges, admissions, or courses!`;
}

// Scrape LearnScape website for information
async function searchLearnScapeWebsite(query) {
  try {
    const searchUrl = `https://learnscapeedu.com/colleges`;
    const response = await axios.get(searchUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    let content = '';
    
    // Extract relevant content from the page
    $('h1, h2, h3, p, li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 10) {
        content += text + '\n';
      }
    });
    
    return content.slice(0, 2000); // Limit to 2000 chars
  } catch (error) {
    console.error('LearnScape scrape error:', error.message);
    return null;
  }
}

// Search for fee information from various sources
async function searchFeeInformation(collegeName, course = '') {
  try {
    // Try to fetch from LearnScape API if available
    const apiUrl = `https://learnscapeedu.com/api/colleges/search?q=${encodeURIComponent(collegeName)}`;
    
    try {
      const response = await axios.get(apiUrl, { timeout: 5000 });
      if (response.data && response.data.colleges && response.data.colleges.length > 0) {
        return response.data.colleges[0];
      }
    } catch (apiError) {
      console.log('API fetch failed, trying web scraping');
    }
    
    // Fallback: scrape the colleges page
    const collegeData = await searchLearnScapeWebsite(collegeName);
    return collegeData;
    
  } catch (error) {
    console.error('Fee search error:', error.message);
    return null;
  }
}

function rolloverIfNewMonth() {
  const k = new Date().toISOString().slice(0,7);
  if (k !== monthKey) { monthKey = k; spendINR = 0; }
}

router.post('/chat', async (req, res) => {
  rolloverIfNewMonth();
  if (spendINR >= INR_BUDGET) {
    return res.status(429).json({ message: 'AI monthly budget exhausted. Try later.' });
  }

  const { message, history = [], filters } = req.body || {};
  if (!message) return res.status(400).json({ message: 'message is required' });

  // Check if it's a contact information query
  if (detectContactQuery(message)) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const contactInfo = getContactResponse();
    
    for (const char of contactInfo) {
      res.write(`data: ${char}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    let enhancedMessage = message;
    let additionalContext = '';

    // If it's a fee query or general college query, search for information
    if (detectFeeQuery(message) || message.toLowerCase().includes('college')) {
      res.write(`data: 🔍 Searching for latest information...\n\n`);
      
      // Extract college name from message (simple extraction)
      const collegeMatch = message.match(/(?:about|for|in|at)\s+([A-Z][A-Za-z\s]+(?:College|University|Institute|IIT|NIT|AIIMS|IIM))/i);
      const collegeName = collegeMatch ? collegeMatch[1].trim() : '';
      
      if (collegeName) {
        const collegeInfo = await searchFeeInformation(collegeName);
        if (collegeInfo) {
          additionalContext = `\n\nREAL-TIME DATA FROM LEARNSCAPE:\n${collegeInfo}`;
        }
      } else {
        // General search on LearnScape
        const webContent = await searchLearnScapeWebsite(message);
        if (webContent) {
          additionalContext = `\n\nINFORMATION FROM LEARNSCAPE WEBSITE:\n${webContent}`;
        }
      }
      
      res.write(`data: \n\n`);
    }

    // Estimate input tokens
    const histText = history.map(h => `${h.role}: ${h.content}`).join('\n');
    const estimatedIn = charsToTokens(SYSTEM) + charsToTokens(histText) + charsToTokens(message) + charsToTokens(additionalContext);
    const remainingINR = INR_BUDGET - spendINR;
    const maxPromptINR = (estimatedIn / 1_000_000) * INR_PER_M_INPUT;
    
    if (maxPromptINR > remainingINR) {
      res.write('data: Budget limit reached. Please try again later.\n\n');
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const messages = [
      { role: 'system', content: SYSTEM },
      ...history.slice(-6),
      { role: 'user', content: enhancedMessage + additionalContext }
    ];

    const stream = await openai.chat.completions.create({
      model: MODEL,
      stream: true,
      temperature: 0.4,
      messages
    });

    let outChars = 0;
    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content || '';
      if (delta) {
        outChars += delta.length;
        res.write(`data: ${delta}\n\n`);
        res.flush?.();
      }
    }

    // Add source reference
    if (additionalContext) {
      res.write(`data: \n\n📚 Source: https://learnscapeedu.com\n\n`);
    }

    const estimatedOut = Math.max(1, Math.ceil(outChars / 4));
    const inINR  = (estimatedIn  / 1_000_000) * INR_PER_M_INPUT;
    const outINR = (estimatedOut / 1_000_000) * INR_PER_M_OUTPUT;
    spendINR += inINR + outINR;

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Chat error' });
    } else {
      res.write('data: Sorry, I encountered an error. Please try again.\n\n');
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

module.exports = router;
