//EXPRESS SETUP//
const express = require("express");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
require('dotenv').config();

//OPENAI SETUP//
const {Configuration, OpenAIApi} = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_PASSCODE,
});

async function main() {
    const completion = await openai.Completion.create({
        model: "gpt-3.5-turbo",
        prompt: "What is today's date?"
    });

    console.log(completion.choices[0]);
}

main();

//SERVER START//
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/index.html')});
app.listen(port, () => {console.log("Server is listening")});



//OLD CODE//

// //MONGO SETUP//
// const mongo_connection_url = process.env.MONGO_DB_URI;
// const {MongoClient} = require('mongodb');
// const client = new MongoClient(mongo_connection_url,{});
// //let static = require('node-static');

// //QUERY PROCESSING//
// async function run() {

//     try {
      
//         // //MONGO QUERY//
//         // await client.connect();
//         // await client.db("cart451Final").command({ping:1});
//         // const db = await client.db("cart451Final");
//         // const horrorFilmsDB = await db.collection('default');
//         // console.log("success");

//         //OPENAI QUERY//
        

//     }catch(error){

//         console.log(error);
        
//     }finally{

//         await client.close();

//     }
// }

// run();
