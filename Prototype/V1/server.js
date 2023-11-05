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


var jsonParser = bodyParser.json()

//OPENAI QUERY//
async function main() {

    try {
      
        app.post('/api/generate', jsonParser, async(req, res) => {

            const responseLimiter = "Limit response to one sentence and do not include personalize greetings or names"
            const worldSetup = "Pretend you are someone helping me write a fantasy novel"
            let data1 = req.body.value;

            //console.log(data1);

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": responseLimiter},
                    {"role": "system", "content": worldSetup},
                    {"role": "user", "content": data1},
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 256,
                temperature:1.1,
            });

            const output = JSON.stringify([chatCompletion.choices[0].message.content])
            const regex = /[\[\]"]/g;
            const modifiedOutput = output.replace(regex, '');
            
            res.send({value: modifiedOutput});
            console.log(modifiedOutput);
            
        })

    }catch(error){

        console.log(error);
        
    }finally{

    }


}

main();
