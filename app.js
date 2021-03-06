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
const Code = require("./models/code");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/currentData", (req, res) => {
    Code.remove({date:{$lte:new Date(moment().subtract(1, 'd').format("YYYY-MM-DD"))}}).then(()=>{
        return  Code.find({date:new Date(moment().format("YYYY-MM-DD"))}).sort({ "data": -1 });
    }).then((data)=>{
        res.send(JSON.stringify(data));
    }).catch((e)=>{
    console.log(e);
    });
});

io.on("connection",(socket)=>{

    socket.on("insertCode",function(data){
        if(data.name){
            const queryParams = queryString.stringify({
                start_date: moment().subtract(2, 'y').format("YYYY-MM-DD"),
                end_date: moment().format("YYYY-MM-DD"),
                column_index: 4,
                api_key: process.env.API_KEY
            });
    
            const options = {
                hostname: 'www.quandl.com',
                port: 443,
                path: `/api/v3/datasets/WIKI/${data.name}.json?${queryParams}`,
                method: 'GET'
            }
        
            https.get(options, (response) => {

                let responseData = "";
                response.setEncoding('utf-8');
                
                response.on('data', (content) => {
                    responseData += content;
                });
        
                response.on("end", () => {
                    responseData = JSON.parse(responseData);
                   if(responseData.quandl_error || responseData.dataset.data.length === 0){
                        socket.emit("errorMessage",{message:"Invalid Code"});
                    }else{
                        let dataSta = responseData.dataset.data.map((ele) => {
                            return [Number(moment(ele[0]).format('x')), ele[1]];
                        });
        
                        let sortedData = dataSta.sort();
                        Code.create({
                            name: responseData.dataset.dataset_code, description: responseData.dataset.name
                            ,date: moment().format("YYYY-MM-DD")
                            ,data: sortedData
                        }).then((data) => {
                            if(data){
                                io.emit("inserted",data);
                            }
                        }).catch((e) => {
                            if (e.code === 11000) {
                                return socket.emit("errorMessage",{message:"The stock you searched for all ready exists listed on the chart"});
                            }
                            console.log(e);
                        });
                     } 
                });
            });
        }
    });

    socket.on("deleteCode",function(data){
        if(data.name){
            Code.findOneAndRemove({name:data.name}).then((doc)=>{
                if(doc){
                    Code.find().then((dbData)=>{
                        if(dbData && dbData.length > 0){
                            io.emit("deleted",{name: doc.name});
                        }else{
                            io.emit("deleted",{name: doc.name,empty:true});
                        }
                    });
                }else{
                    socket.emit("errorMessage",{message:"Stock Code not found"});
                }
            }).catch((e)=>{
              console.log(e);
            });
        }
        });
});

server.listen(3000, () => {
    console.log("Running on port 3000");
});


