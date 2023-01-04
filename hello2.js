const express = require('express');
const fs = require('fs');
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/my_database";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user_name:String,
    topic: String,
    msgbody: String,
    status: String
});


// Compile model from schema
const messageModel = mongoose.model("messagemodel", messageSchema);

const app = express();
const  port=3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(port, () => {
    console.log("Application started and Listening on port:"+port);
});

app.use(express.static(__dirname));

const data = fs.readFileSync(__dirname+"/answer.html", 'utf8');



app.get("/api/getmessages", (req, res) => {
    console.log(__dirname)
    res.json({ message: "Hello from my server !" });

    // console.log(req.body);
    // res.sendFile(__dirname+"/answer.html");
});

app.post("/api/senditmsg", (req, res) => {
    // console.log(__dirname)
// Create an instance of model SomeModel
    const messageInst = new messageModel({ user_name: "vlad04",topic:req.body.topic,msgbody:req.body.msg,status:"_new"});
// Save the new model instance, passing a callback
    messageInst.save((err) => {

        const regex01 = /\$p1/g;
        // regex01.global=true;
        const regex02 = /\$p2/g;
        // regex02.global=true;
        let data2;
        if (err)
        {
            data2=data.replace(regex01,"false");
            data2=data2.replace(regex02,err.toString());
            // return handleError(err);
        }
        else
        {
            data2=data.replace(regex01,"true");
            data2=data2.replace(regex02,'"Ok"');
        }
        res.send(data2);
    });
});