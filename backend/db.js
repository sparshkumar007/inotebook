const mongoose = require("mongoose");
const mongoURI = "mongodb://0.0.0.0:27017";

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=> {
        console.log("connected to Mongo successfully")
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports = connectToMongo;
