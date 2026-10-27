import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getCliArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return undefined;
}

// Dev server must always run on port 3000 and bind to 0.0.0.0
const cliPort = getCliArg('--port');
const cliHost = getCliArg('--host');
const PORT = Number(cliPort) || 3000;
const HOST = cliHost || '0.0.0.0';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST endpoint for speaking feedback
app.post('/api/gemini/feedback', async (req, res) => {
  try {
    const {
      targetSentence,
      spokenText,
      attemptNumber = 1,
      partnerQuestion,
      keyWords = [],
      koreanMeaning = '',
    } = req.body;

    if (!targetSentence) {
      return res.status(400).json({ error: 'targetSentence is required' });
    }

    // If Gemini is not configured, send signal so client uses Section 7 rule engine
    if (!ai || !geminiApiKey) {
      return res.json({
        source: 'fallback',
        feedback: null,
      });
    }

    const systemInstruction = `
You are NAYA, a friendly, encouraging 8-bit pixel-art character helping Korean middle school students (Grades 1-2, CEFR A1-A2) practice asking for and giving directions abroad.

YOUR FEEDBACK RULES (STRICT COMPLIANCE REQUIRED):
1. Keep feedback to maximum TWO sentences: Simple English followed by Korean translation in parentheses.
2. Always praise the student first, then focus on only ONE thing to improve.
3. Judge success by whether the directions can be understood by a local person, not native pronunciation. Accept understandable variations.
4. NEVER use the words "wrong" or "incorrect", numerical scores, percentages, or mouth/tongue position guides.
5. Adapt feedback according to attempt number:
   - Success (intelligible): "Great job! I understood your directions clearly. (잘했어요! 길 안내를 명확하게 이해했어요.)"
   - Success + small word missing (e.g. 'the', 'a', 'please', 'at'): Praise first, then gently suggest adding it: "Nice job! I understood you. Try adding \\"the\\": \\"${targetSentence}\\" (잘했어요! 의미는 이해했어요. the를 넣어 완전한 문장으로 말해 볼까요?)"
   - Attempt 1 failure: Recast (give full model sentence warmly): "Good try! You can say, \\"${targetSentence}\\". (잘 시도했어요! 이렇게 말해 볼까요? \\"${koreanMeaning}\\")"
   - Attempt 2 failure: Elicitation (give a first-letter hint for key direction word): "You're getting closer! Try \\"...\\". (점점 좋아지고 있어요! ...)"
   - Attempt 3+ failure: Chunking (divide sentence into 2 short chunks): "Good effort! Let's say it in small parts: \\"Part 1\\" / \\"Part 2\\". (잘 노력했어요! 짧은 부분으로 나눠서 말해 봐요.)"
   - No speech/unclear: "That's okay! Let's try again. Tap the microphone and say, \\"${targetSentence}\\". (괜찮아요! 다시 해 봐요. 마이크를 누르고 말씀해 보세요.)"
Respond ONLY with JSON matching the schema.
`;

    const prompt = `
Target sentence: "${targetSentence}"
Korean meaning: "${koreanMeaning}"
Key direction words: ${JSON.stringify(keyWords)}
Partner asked: "${partnerQuestion || ''}"
Student actually said: "${spokenText || ''}"
Attempt number for this sentence: ${attemptNumber}

Evaluate whether the student's spoken text communicates the directions intelligibly.
Provide:
- isUnderstood: boolean (true if the essential directions are communicated clearly)
- englishFeedback: string (friendly English message, max 1 sentence)
- koreanFeedback: string (Korean translation in parentheses, max 1 sentence)
- missingKeyWords: array of strings
- missingSmallWords: array of strings (like "the", "a", "please", "at")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json({
      source: 'gemini',
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Gemini feedback error:', err?.message || err);
    // Graceful fallback response
    return res.json({
      source: 'fallback',
      feedback: null,
      error: 'Gemini service unavailable, using local rules.',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
