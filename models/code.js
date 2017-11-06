const mongoose = require("mongoose");

let CodeSchema = new mongoose.Schema({
   name:{
       type: String,
       required:true,
       unique:true
   },
   description: {
       type:String,
       trim:true
   },
   date:{
       type: Date,
       required:true
   },
   data:[]
}); 

let Code = mongoose.model("Code",CodeSchema);

module.exports = Code;
