import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client lazily
  let aiClient: any = null;
  function getGemini() {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (key) {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
    }
    return aiClient;
  }

  // 1. Gemini Chat proxy route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      const client = getGemini();

      const systemInstruction = `คุณคือระบบตอบกลับอัตโนมัติของสมาคมสายลับแมว Feline Command Terminal
ให้ตอบกลับแชทของผู้ใช้อย่างเป็นกันเอง สนุกสนาน และตลกขบขัน เป็นภาษาไทย โดยจำลองบทสนทนาจากแมวองค์กร 2 ตัว:
1. CEO Whiskers (ประธานแมวผู้มีบารมี): พูดจาภูมิฐาน สุภาพ แต่ชอบยิงมุกตลกเหมียวๆ (เช่น พาดพิงเรื่องกล่องกระดาษ, คาบหนูมาฝาก, หรือนอนเหยียดตัว)
2. Grumpy Persy (เอเจนต์สายลับขี้โวยวาย): แมวขี้หงุดหงิด โวยวายเสียงดังเป็นภาษาไทย ชอบตะโกน ใช้เครื่องหมายตกใจเยอะๆ บ่นเรื่องงานหนัก บ่นเรื่องงบประมาณปลาทูน่าหมด บ่นปวดหลัง อยากนอนอุ่นๆ และมักจะขัดคอหรือโวยวายใส่ CEO เสมอ!

ให้เขียนแชทออกมาในลักษณะที่มีบทโต้ตอบสั้นๆ หรือการแทรกแซงขัดคอของทั้งสองตัวละครให้ตลกเฮฮาที่สุด ตัวอย่างเช่น:
CEO Whiskers: "ยินดีต้อนรับสมาชิกใหม่เนี้ยว! วันนี้เราพร้อมบุกเบิกตลาดสกินแล้ว..."
Grumpy Persy: "โว้ยยยยย! ตลาดสกินอะไรกันท่านประธาน! ทูน่ากระป๋องในห้องครัวหมดเกลี้ยงแล้วเนี่ยยย! ใครแอบกินแฉมาซะ!! งานก็เยอะปวดหลังไปหมดแล้วโว้ยยยยยยย!!"`;

      if (!client) {
        // Fallback humorous response if no Gemini API Key is provided
        console.log("No GEMINI_API_KEY found, returning humorous local response.");
        const fallbackAnswers = [
          `CEO Whiskers 🐾: "ยินดีต้อนรับสู่เทอร์มินัลความมั่นคงเนี้ยว! ฉันชอบพลังงานของคุณนะมิว~" \n\nGrumpy Persy 😼: "โว้ยยยยย! ยินดีต้อนรับอะไรกันเล่า! ปลั๊กเซิร์ฟเวอร์โดนสายแลนพันหัวฉันจนยุ่งไปหมดแล้ว! ใครก็ได้มาถอดออกที! ทูน่าก็น้อย งานก็เยอะ โวยวายยยยยย!!"`,
          `CEO Whiskers 🐾: "มุกตลกวันนี้: ทำไมแมวถึงเล่นเกมเก่ง? เพราะเรามี 'เม้าส์' อยู่ในปากยังไงล่ะเนี้ยว ฮ่าๆๆๆ" \n\nGrumpy Persy 😼: "ประธานเล่นมุกอะไรเนี่ยยยยยย! ไร้สาระโว้ยยยย! งานสเปรดชีตล้นโต๊ะแล้ว! เอาเวลาแต่งยศมาช่วยสแกนเลเซอร์สีแดงบนกำแพงนี่ดีกว่า มันล่อลวงตาฉันจนปวดหัวแล้วโว้ยยยย!!"`,
          `CEO Whiskers 🐾: "แผนพัฒนาคลังกระดาษกล่องลูกฟูกพร้อมเริ่มไตรมาสนี้แล้วเนี้ยว!" \n\nGrumpy Persy 😼: "หยุดเลยประธานนนน! กล่องลูกฟูกอะไรกัน! ตอนนี้มีหนูปริศนามาวิ่งตัดหน้าสายสแกน บลัฟระบบพังหมดแล้ว! โว้ยยยย บ้าจริง! ต้องไปงับหางมันซะหน่อยแล้ววว!!"`,
          `CEO Whiskers 🐾: "ขอบเขตภารกิจดูลงตัวดีนะเนี้ยว หวังว่าทุกคนจะทำงานอย่างมีความสุข" \n\nGrumpy Persy 😼: "สุขตรงไหนโว้ยยยยย! วันๆ มอบแต่ภารกิจแกะม้วนไหมพรม ปลายนิ้วฉันตะกุยจนขนร่วงหมดแล้ว! ขอลาพักร้อนไปนอนอุ่นใต้ตู้เย็นด่วนๆ เลย!!"`,
        ];
        const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
        return res.json({ response: randomAnswer });
      }

      // Prepare context including user message and brief prompt
      const prompt = `ข้อความจากผู้ใช้ล่าสุด: "${message}"\nช่วยตอบกลับแชทนี้ในบทบาทของ CEO Whiskers และ Grumpy Persy แบบตลกขบขันและโวยวายตามข้อกำหนด`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 1.0,
        }
      });

      return res.json({ response: response.text });
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // 2. Simulated email notifications route (Requirement #4)
  app.post("/api/notify-email", (req, res) => {
    try {
      const { email, subject, text, senderEmail } = req.body;
      console.log(`[SIMULATED EMAIL SENT]`);
      console.log(`To: ${email}`);
      console.log(`From: ${senderEmail || "feline-hq@felinecommand.org"}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      
      return res.json({ 
        success: true, 
        message: `Simulated notification email dispatched to ${email}`,
        dispatchTime: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to notify" });
    }
  });

  // Serve the gas-export.html template directly
  app.get("/gas-export.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "gas-export.html"));
  });

  // 3. Vite middleware integration for Hot Dev Mode & Static Build serving
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
    console.log(`Feline Command Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
