// Import the mongoose module
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

// Create an instance of model SomeModel
const messageInst = new messageModel({ user_name: "vlad03",topic:"topic01",msgbody:" SMS message1",status:"_new"});

// Save the new model instance, passing a callback
messageInst.save((err) => {
    if (err)
        return handleError(err);
    // saved!
});


