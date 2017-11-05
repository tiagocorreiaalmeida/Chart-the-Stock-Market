const mongoose = require("mongoose");

let Markschema = new mongoose.Schema({
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

let Mark = mongoose.model("Mark",Markschema);

module.exports = Mark;
