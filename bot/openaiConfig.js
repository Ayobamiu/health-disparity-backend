const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const aiModel = "gpt-4o-2024-08-06";

module.exports = { openai, aiModel };
