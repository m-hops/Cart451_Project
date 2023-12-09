//OPENAI SETUP//
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
});

const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
});
