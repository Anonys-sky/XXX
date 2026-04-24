import OpenAI from "openai";

const zai = new OpenAI({
  apiKey: process.env.ZAI_API_KEY || "",
  baseURL: process.env.ZAI_BASE_URL || "https://api.ilmu.ai/v1",
});

export default zai;
