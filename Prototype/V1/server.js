//TEST VARIABLES//
const responseLimiter = "Limit response to one sentence and do not include personalize greetings or names"
const worldSetup = "Pretend you are someone helping me write a fantasy novel"
const characterGen = "Create a character"

//ENV ACCESS//
import 'dotenv/config'

//EXPRESS SETUP//
import express from 'express'; 
import path from 'path';
const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//OPENAI SETUP//
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//CALL FUNCTION
async function main() {
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {"role": "system", "content": responseLimiter},
            {"role": "system", "content": worldSetup},
            {"role": "user", "content": characterGen},
        ],
        max_tokens: 256,
        temperature:1.1,
    });

    const output = JSON.stringify([chatCompletion.choices[0].message.content])
    const regex = /[\[\]"]/g;
    const modifiedOutput = output.replace(regex, '');

    console.log("");
    console.log(modifiedOutput);
    console.log("");
}

//main();
