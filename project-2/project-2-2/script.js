//AIgenerated program!!!!(but i modified it)------------------------------------------------------------------
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

// 1. 定义或获取输出目录
function getOutputDir() {
  // 优先级: 1) first non-flag CLI arg, 2) ENV Var, 3) 默认值 'AIgen'
  const envDir = process.env.OUTPUT_DIR;
  const args = process.argv.slice(2);
  // pick the first argument that does not start with '-' (i.e. not a flag)
  const nonFlag = args.find(a => typeof a === 'string' && a.length > 0 && !a.startsWith('-'));
  return nonFlag || envDir || 'AIgen';
}

const ai = new GoogleGenAI({});
const PROMPT = "I want to generate a Van Gogh-style painting using the following text, but I feel my current draft is a bit monotonous. Could you help polish it? (Please only reply with the polished sections—all text you reply with will be used as prompts in the image generation software): I want to generate a Van Gogh-style painting using the text below, but I feel my current draft is a bit monotonous. Could you help me refine it? (Please only reply with the parts you've polished—all text you provide will be used as prompts in the image generation software):"
  +"cat";

// Support a mock/dry-run mode so the script can be exercised without Google credentials.
const isMock = process.argv.includes('--mock') || process.env.MOCK === '1' || process.env.MOCK === 'true';
let generatedText = "";

async function runTasks() {
  const outputDir = getOutputDir();
  console.log(`--- 开始 AI 任务 ---`);
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  // ============================
  // A. 文本生成任务 (Gemini)
  // ============================
  console.log(`\n1. 正在运行文本生成 (Prompt: "不给看")...`);
  try {
    if (isMock) {
      console.log('⚠️ Running in mock mode: skipping real API call for text generation');
      generatedText = 'Mocked Van Gogh-style prompt: swirling skies, thick impasto, vibrant blues and yellows.';
    } else {
      const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: PROMPT,
      });
      
      generatedText = textResponse.text;
    }
    console.log(`✅ 文本生成完成。`);
    // 打印前几个字符作为预览
    console.log("   预览:", generatedText.substring(0, 50) + "...");
    
    // 你可以在这里选择将生成的文本保存到文件，例如:
    // fs.writeFileSync(path.join(outputDir, 'ai_explanation.txt'), generatedText);
    
  } catch (error) {
    console.error("❌ 文本生成失败:", error.message);
    if (error && error.message && error.message.includes('Could not load the default credentials')) {
      console.error('\n⚠️ Credential hint: Google Cloud credentials not found.\n' +
        ' - Option A (recommended for servers): create a service account, download the JSON key, then set:\n' +
        '     export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/your-service-account.json"\n' +
        ' - Option B (for local development): run:\n' +
        '     gcloud auth application-default login\n' +
        ' - More info: https://cloud.google.com/docs/authentication/getting-started\n');
    }
  }


  // ============================
  // B. 图像生成任务 (Imagen)
  // ============================
  console.log(`\n2. 正在运行图像生成 (Prompt: "不给看")...`);
  try {
    if (isMock) {
      console.log('⚠️ Running in mock mode: creating placeholder image');
      const filename = path.join(outputDir, `imagen-rcx-mock-1.png`);
      // Create a small 1x1 PNG file (base64) as a placeholder
      const oneByOnePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
      fs.writeFileSync(filename, Buffer.from(oneByOnePngBase64, 'base64'));
      console.log(`✅ Mock 图片已保存到: ${filename}`);
    } else {
      const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: generatedText,
        config: {
          numberOfImages: 1, // 只生成 1 张图片
        },
      });

      let idx = 1;
      for (const generatedImage of imageResponse.generatedImages) {
        const imgBytes = generatedImage.image.imageBytes;
        const buffer = Buffer.from(imgBytes, "base64");
        const filename = path.join(outputDir, `imagen-rcx-${idx}.png`);
        fs.writeFileSync(filename, buffer);
        console.log(`✅ 图片已保存到: ${filename}`);
        idx++;
      }
    }
    
  } catch (error) {
    console.error("❌ 图像生成失败:", error.message);
    if (error && error.message && error.message.includes('Could not load the default credentials')) {
      console.error('\n⚠️ Credential hint: Google Cloud credentials not found.\n' +
        ' - Option A (recommended for servers): create a service account, download the JSON key, then set:\n' +
        '     export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/your-service-account.json"\n' +
        ' - Option B (for local development): run:\n' +
        '     gcloud auth application-default login\n' +
        ' - More info: https://cloud.google.com/docs/authentication/getting-started\n');
    }
  }

  console.log(`\n--- 所有任务完成 ---`);
}

runTasks();