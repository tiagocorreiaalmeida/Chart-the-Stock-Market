const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL).then((res)=>{
    console.log("Connected to DB");
}).catch((e)=>{
    console.log(`Unable to connect to DB -> ${e}`);
});

module.exports = mongoose;