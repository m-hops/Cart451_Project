//ENV ACCESS//
import 'dotenv/config'

//EXPRESS SETUP//
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'; 

//OPENAI SETUP//
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//EXPRESS VARIABLES//
const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var jsonParser = bodyParser.json()

//SETS UP ALL FILES IN THE PUBLIC FOLDER//
app.use(express.static("public"))

//CALLS INDEX.HTML AT STARTUP//
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//PORT LISTENING//
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//OPENAI QUERY//
async function main() {

    try {
      
        //GENERATE OPENAI QUERY//
        app.post('/api/generate', jsonParser, async(req, res) => {

            let data1 = req.body.value0;
            const worldSetup = "Pretend you are someone helping me write a story and are coming up with one character suggestion."
            const responseLimiter = "Do not include a name. Use only they pronouns and do not identify gender. Return results in point form. Create a total of 5 numerical points and limit each point to one sentence. Try to make the answers about various points in their lives. Do not include any text outside of the text in the numerical points."
            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": worldSetup},
                    {"role": "system", "content": responseLimiter},
                    {"role": "user", "content": data1},
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 256,
                temperature:1.1,
            });

            const output = JSON.stringify([chatCompletion.choices[0].message.content])
            const regex = /[\[\]"]/g;
            let modifiedOutput = output.replace(regex, '');
            
            res.send({value: modifiedOutput});
        })

    }catch(error){

        console.log(error);
        
    }finally{

    }
}

main();
