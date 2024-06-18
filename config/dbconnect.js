const mongoose = require('mongoose');
require("dotenv").config();

//Get Env Variables
const dbconnection_url = process.env.DB_CONNECTION_URL  ;
//Connect DB

const dbconnect = () => {

    mongoose.connect(dbconnection_url)
    //When connected Successfully
    .then((value)=>{
        console.log("MongoDB Connection Established Successfully")
    })
    //If Error
    .catch((error)=>{
        console.log(error);
    })

}


module.exports = dbconnect;