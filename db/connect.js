const mongoose = require("mongoose");

uri = "mongodb+srv://harshitamore16:<Harshita@16>@cluster0.p1hfn8w.mongodb.net/"

const connectDB = () =>{
    console.log("connect db");
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;