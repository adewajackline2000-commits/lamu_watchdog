import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limits for large PDF support
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// API: Analyze Budget PDF
app.post("/api/analyze", upload.single("budgetPdf"), async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/analyze - Start`);
  try {
    if (!req.file) {
      console.warn("No file uploaded in /api/analyze");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Analyzing file: ${req.file.originalname} (${req.file.size} bytes)`);

    const pdfPart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: "application/pdf",
      },
    };

    const prompt = `Analyze this county budget document and extract the following information in JSON format:
1. A clear, simple summary for citizens.
2. A list of departments and their total budget allocations.
3. A list of wards mentioned and any specific projects or allocations for them.
4. Top 5 major projects with their description and estimated cost.

Be precise and skip anything that isn't clearly a budget allocation. Use the following schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [pdfPart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            departments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  allocation: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "allocation"]
              }
            },
            wards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  projects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name"]
              }
            },
            keyProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  cost: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "cost"]
              }
            }
          },
          required: ["summary", "departments", "wards", "keyProjects"]
        },
      },
    });

    const extraction = JSON.parse(response.text || "{}");
    console.log(`[${new Date().toISOString()}] POST /api/analyze - Success`);
    res.json(extraction);
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze document" });
  }
});

// API: Question Answering
app.post("/api/ask", upload.single("budgetPdf"), async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/ask - Start`);
  try {
    const { question } = req.body;
    if (!req.file || !question) {
      console.warn("Missing file or question in /api/ask");
      return res.status(400).json({ error: "Missing file or question" });
    }

    const pdfPart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: "application/pdf",
      },
    };

    const prompt = `You are a helpful county budget watchdog. Based on the provided budget document, answer the following question for a citizen in simple, clear language. If the information is not in the document, say so. Question: ${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [pdfPart, { text: prompt }] },
    });

    console.log(`[${new Date().toISOString()}] POST /api/ask - Success`);
    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to answer question" });
  }
});

// Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
