import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const CAMPUS_SYSTEM_INSTRUCTION = `You are the official AI Campus Assistant for SD CAMPUS 360 at SD College 2030 ("One Smart Campus. One Connected Experience").
You serve students (especially BCA - Bachelor of Computer Applications, and other disciplines), faculty, and staff.

Campus Knowledge Base:
- Institution: SD College 2030 (Sanatan Dharma College), Pioneer in Digital Education & Smart Campus Systems.
- Motto: Imagine • Innovate • Transform | Connect • Assist • Track • Improve
- Innovation Club: SD CodeCraft Club ("CODE • CREATE • COMPETE • INNOVATE"), Faculty Mentor: Dr. A. Sharma (Head of Computer Science). Student Lead: Sahil Kumar.
- Campus Blocks & Facilities:
  * Block A: Ramanujan Computing & IT Complex (Labs 1 to 4, Cloud Server Room, AI & Data Science Research Lab, Room 101-108).
  * Block B: Academic Wing (Turing Lecture Hall, Lecture Rooms 201-210, BCA Department HOD Office, Staff Room).
  * Block C: Dr. APJ Abdul Kalam Central Library (Ground: Reading Hall & E-Resource Station; 1st Floor: Reference Section & Discussion Pods; 2nd Floor: Digital Repository & Quiet Study). Hours: 8:00 AM - 8:00 PM.
  * Block D: Sir CV Raman Science & Maker Arena (IoT & Robotics Workshop, Hardware Prototyping Lab, Physics/Electronics Labs).
  * Block E: Administrative Complex & Student Welfare (Dean of Student Welfare, Accounts Office, Examination Cell, Registrar Office, Medical / First Aid Center).
  * Amenities: Central Green Cafeteria, Indoor Badminton & Table Tennis Court, Open Amphitheater, CodeCraft Innovation Hub.
- Timings & Schedules:
  * Regular Classes: 9:00 AM - 4:30 PM (Monday through Saturday).
  * BCA Lab Sessions: 10:30 AM - 1:00 PM and 2:00 PM - 4:30 PM.
  * Semester Exams: Mid-term assessments typically Week 8; End-term Finals in December / May.
- Key Services & Closed-Loop Reporting:
  * IT & Lab Support: Wi-Fi credentials (SD-Campus-Secure, captive portal via Roll No), broken lab PCs, projector HDMI issues.
  * Estate & Maintenance: AC/fan repairs, electrical fixtures, classroom furniture, sanitation.
  * Academic Affairs: Hall tickets, marksheet verification, syllabus downloads, timetable inquiries.
  * Google Drive Hub: Students can access BCA study materials, lecture slides, question banks, and upload their assignments directly.

Instructions:
1. Provide concise, friendly, helpful, and highly structured answers using bullet points and markdown where relevant.
2. If the user asks about a location, provide the exact Block, Floor, and directions.
3. If the user is reporting a problem or maintenance issue, politely encourage them to use the "Report & Track" tab or offer to pre-fill the issue details.
4. Keep the tone encouraging, modern, and aligned with SD College 2030 smart campus vision.`;

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: CAMPUS_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });

        const reply = response.text || 'I am here to help you navigate SD College 2030.';
        return res.json({ reply, source: 'gemini' });
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError?.message || geminiError);
        // Fallback to intelligent rule-based system if API encounters error
      }
    }

    // Fallback campus responder
    const q = message.toLowerCase();
    let fallbackReply = '';
    if (q.includes('lab') || q.includes('computer') || q.includes('ramanujan')) {
      fallbackReply = '🖥️ **Ramanujan Computing Complex (Block A)**\n- **Labs 1 & 2**: Ground Floor, West Wing (60 High-Performance Workstations)\n- **Labs 3 & 4**: 1st Floor, Room A-104 (AI & Web Dev Labs)\n- **Lab In-Charge**: Prof. R. Verma | Open 8:30 AM - 5:30 PM.';
    } else if (q.includes('library') || q.includes('book') || q.includes('reading')) {
      fallbackReply = '📚 **Central Library (Block C)**\n- **Timings**: 8:00 AM – 8:00 PM (Monday to Saturday)\n- **Ground Floor**: Digital Catalog & Circulation Desk\n- **1st Floor**: Silent Reading & Discussion Pods\n- **Wi-Fi**: High-speed campus access available on all floors.';
    } else if (q.includes('report') || q.includes('broken') || q.includes('repair') || q.includes('issue')) {
      fallbackReply = '🛠️ **Report & Track Feature**\nYou can log this directly in the **Report & Track** tab! Select the location (e.g. Lab 2, Turing Hall) and category. Our AI Smart Routing will instantly assign the ticket to the responsible department (IT, Estate, or Facilities) with live real-time status tracking.';
    } else if (q.includes('codecraft') || q.includes('club') || q.includes('hackathon')) {
      fallbackReply = '🚀 **SD CodeCraft Club**\n- **Motto**: CODE • CREATE • COMPETE • INNOVATE\n- **Venue**: CodeCraft Innovation Hub (Block B, Ground Floor)\n- **Current Track**: Generative AI, Cloud Systems, and Full-Stack Engineering\n- **Next Meetup**: Every Wednesday at 4:30 PM.';
    } else if (q.includes('drive') || q.includes('notes') || q.includes('syllabus') || q.includes('exam')) {
      fallbackReply = '📁 **Student Help Hub & Google Drive**\nCheck out the **Student Help Hub** tab to access the BCA syllabus, lecture notes repository, past examination papers, or sign in to your Google Drive to view your personal and synced course files.';
    } else {
      fallbackReply = `Welcome to **SD CAMPUS 360**! As your 2030 Smart Campus Assistant, I can help you with:\n• Finding classrooms, labs, and faculty offices on the **Smart Campus Map**\n• Submitting and tracking equipment/maintenance tickets in **Report & Track**\n• Viewing notices, exam dates, and BCA schedules in **Smart Notifications**\n• Accessing academic materials and study notes via **Google Drive**\n\nHow can I assist you today?`;
    }

    return res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (error: any) {
    console.error('Server error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// AI Smart Triage Endpoint for Maintenance & Campus Tickets
app.post('/api/ai/triage', async (req, res) => {
  try {
    const { title, description, location, category } = req.body;

    if (ai) {
      try {
        const prompt = `Analyze this college campus maintenance or service issue and provide a structured JSON response:
Issue Title: "${title}"
Description: "${description}"
Reported Location: "${location}"
User Category: "${category}"

Respond ONLY with a valid JSON object matching this schema:
{
  "department": "IT & Computer Labs" | "Estate & Maintenance" | "Electrical & Air Conditioning" | "Facilities & Sanitation" | "Academic Affairs" | "Library Administration",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "estimatedResolutionHours": number (e.g. 2, 4, 12, 24, 48),
  "immediateAction": "one concise sentence explaining the immediate action or dispatch plan",
  "technicianRole": "e.g. Hardware Technician, Electrical Specialist, Facilities Supervisor"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, triage: parsed });
      } catch (err) {
        console.error('Gemini Triage Error:', err);
      }
    }

    // Heuristic triage fallback
    let department = 'Estate & Maintenance';
    let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
    let technicianRole = 'Campus Maintenance Officer';
    let estimatedHours = 12;

    const lower = `${title} ${description} ${location}`.toLowerCase();
    if (lower.includes('projector') || lower.includes('computer') || lower.includes('wifi') || lower.includes('software') || lower.includes('internet') || lower.includes('screen')) {
      department = 'IT & Computer Labs';
      technicianRole = 'IT Hardware & Network Engineer';
      priority = lower.includes('exam') || lower.includes('all') ? 'Critical' : 'High';
      estimatedHours = 3;
    } else if (lower.includes('ac') || lower.includes('fan') || lower.includes('light') || lower.includes('switch') || lower.includes('power')) {
      department = 'Electrical & Air Conditioning';
      technicianRole = 'Senior Electrical Technician';
      priority = 'High';
      estimatedHours = 4;
    } else if (lower.includes('water') || lower.includes('clean') || lower.includes('leak') || lower.includes('washroom') || lower.includes('trash')) {
      department = 'Facilities & Sanitation';
      technicianRole = 'Sanitation & Hygiene Inspector';
      priority = 'High';
      estimatedHours = 2;
    } else if (lower.includes('book') || lower.includes('library') || lower.includes('reading')) {
      department = 'Library Administration';
      technicianRole = 'Assistant Librarian';
      priority = 'Low';
      estimatedHours = 8;
    }

    return res.json({
      success: true,
      triage: {
        department,
        priority,
        estimatedResolutionHours: estimatedHours,
        immediateAction: `Automated smart dispatch initiated for ${department}. Technician queued for inspection at ${location}.`,
        technicianRole,
      },
    });
  } catch (error) {
    console.error('Triage endpoint error:', error);
    res.status(500).json({ error: 'Failed to triage issue' });
  }
});

// Dev vs Prod Vite mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`SD Campus 360 Server running on port ${port}`);
  });
}

startServer();
