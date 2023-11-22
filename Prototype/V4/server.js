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
      
        app.post('/api/generate', jsonParser, async(req, res) => {

            const worldSetup = "Pretend you are someone helping me write a story. I will give you some information, you will imagine a character who exists in this world, and then you will give me random facts about this person."
            const responseLimiter = "Do not include a name. The character uses they pronouns. Return results in point form, create a total of 5 points in numerical form, and limit each point to one sentence."
            let data1 = req.body.value;

            //console.log(data1);

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": worldSetup},
                    {"role": "system", "content": responseLimiter},
                    {"role": "user", "content": data1},
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 256,
                temperature:0.7,
            });

            const output = JSON.stringify([chatCompletion.choices[0].message.content])
            const regex = /[\[\]"]/g;
            const modifiedOutput = output.replace(regex, '');
            
            res.send({value: modifiedOutput});
            //console.log(modifiedOutput);
            
        })

    }catch(error){

        console.log(error);
        
    }finally{

    }


}

main();
