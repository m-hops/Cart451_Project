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

//MONGODB SETUP//
import { MongoClient } from 'mongodb';
const mongo_connection_url = process.env.MONGO_DB_URI;
const mClient = new MongoClient(mongo_connection_url,{});

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


            //ACCESS COLLECTION//
            const db = await mClient.db("CART451_Final");
            const tarotDB = await db.collection('Tarot');
        
            //TAROT DB QUERY//
            let dbQuery = await tarotDB.aggregate([
                {$project:  {_id: 0, card: "$cards.name"}},
                {$unwind:   "$card"},
                {$sample:    {size: 3}},
                
            ]).toArray();

            let stringMongoOutput = JSON.stringify(dbQuery);
            let regexMonogo = stringMongoOutput.replace(/[\[\]{}":]|card/g, '');

            console.log(regexMonogo);

            const worldSetup = "Pretend you are someone helping me write a story. I will give you some information, you will imagine a character who exists in this world, and then you will give me random facts about this person."
            const responseLimiter = "Do not include a name. The character uses they pronouns. Return results in point form, create a total of 5 points in numerical form, and limit each point to one sentence."
            const tarotRadomizer = `Take inspiration from, but do not directly reference, the meaning of the tarot card ${regexMonogo}.`
            let data1 = req.body.value;

            //console.log(data1);

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": worldSetup},
                    {"role": "system", "content": tarotRadomizer},
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
