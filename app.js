"use strict";

require("dotenv").config();
const express = require("express"),
      http = require("http"),
      https = require("https"),
      socketIO = require("socket.io"),
      queryString = require("query-string"),
      moment = require("moment"),
      hbs = require("handlebars");


const mongoose = require("./config/mongoose");
const Mark = require("./models/Mark");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname+"/public"));
app.set("views",__dirname+"/public/views");
app.set("view engine","hbs");

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/currentData",(req,res)=>{
    Mark.find({date:new Date(moment().format("YYYY-MM-DD"))}).sort({"data":-1}).then((data)=>{
        let sortedData = data.map((ele)=>{
            ele["data"].sort();
            return ele;
        })
        res.send(JSON.stringify(sortedData));
    }).catch((e)=>{
        console.log(e);
    });
});

server.listen(3000,()=>{
    console.log("Running on port 3000");
});




/*STOCK REQUEST
   let markSearched = "GOOG";
    
        const queryParams = queryString.stringify({
            start_date: moment().subtract(1, 'y').format("YYYY-MM-DD"),
            end_date: moment().format("YYYY-MM-DD"),
            column_index: 4,
            api_key: process.env.API_KEY
        });
    
        const options = {
            hostname:'www.quandl.com',
            port: 443,
            path:`/api/v3/datasets/WIKI/${markSearched}.json?${queryParams}`,
            method: 'GET'
        }
    
         https.get(options,(response)=>{
            let responseData = "";
            response.setEncoding('utf-8');
    
            response.on('data',(content)=>{
                responseData += content;
            });
            
            response.on("end",()=>{
                responseData = JSON.parse(responseData);
                let dataSta = responseData.dataset.data.map((ele)=>{
                    return [Number(moment(ele[0]).format('x')),ele[1]];
                });
    
                Mark.create({name:responseData.dataset.dataset_code,description:responseData.dataset.name
                    ,date:moment().format("YYYY-MM-DD")
                    ,data:dataSta}).then((doc)=>{
                       //emit to frontend
                    }).catch((e)=>{ 
                        console.log(e);
                    });
            });
        });

 */