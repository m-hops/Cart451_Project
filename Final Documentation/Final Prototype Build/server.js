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

            console.log(dbQuery[0].card);
            console.log(dbQuery[1].card);
            console.log(dbQuery[2].card);

            const pastCard = dbQuery[0].card;
            const presentCard = dbQuery[1].card;
            const futureCard = dbQuery[2].card;

            const worldSetup = "You are someone helping me write a story. I will give you some information, you will create a new character who exists in this world, and then you will give me 5 random facts about this person."
            
            const tarotPast = `For the characters past, take inspiration from the tarot card ${pastCard}.`
            const tarotPresent = `For the characters present state, take inspiration fromtarot card ${presentCard}.`
            const tarotFuture = `For the characters future, take inspiration fromthe tarot card ${futureCard}.`
            const tarotPrompt = `Take inspiration from (but do not directly reference) the results of a tarot card read when constructing the character. ${tarotPast} ${tarotPresent} ${tarotFuture}`

            const responseLimiter = "In the final output, do not include any names and remove any direct references to tarot cards. Refer to the character using only they pronouns. Return results in point form, create a total of 5 points in numerical form, and limit each point to one sentence."

            let data1 = req.body.value;

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": worldSetup},
                    {"role": "system", "content": tarotPrompt},
                    {"role": "system", "content": responseLimiter},
                    {"role": "user", "content": data1},
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 256,
                temperature:0.7,
            });

            const output = JSON.stringify([chatCompletion.choices[0].message.content])
            const regex0 = /[\[\]"]|.*?1/g;
            const formattedOutput = output.replace(regex0, '');
            const regex1 = /.*?(1)/g;
            const preTextRemovalOutput = formattedOutput.replace(regex1, '1');
            const regex2 = /^(.*?\d.*?\.){5}/g;
            const postTextRemovalOutput = preTextRemovalOutput.replace(regex2, '1');

            
            res.send({value: postTextRemovalOutput});
            //console.log(modifiedOutput);
            
        })

    }catch(error){

        console.log(error);
        
    }finally{

    }


}

main();
