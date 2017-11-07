"use strict";

$(document).ready(function () {

    const socket = io();

    let chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        series: []
    });

    let appendCode = function(ele){
        $('#codelist').append(`
        <div class="card col-md-4">
            <div class="card-body">
                <h4 class="card-title">${ele.name}</h4>
                <p class="card-text">${ele.description}</p>
                <button class="remove btn btn-primary" id="${ele.name}">Remove</button>
            </div>
        </div>`);
    }

    $.getJSON("/currentData", (function (stockData) {
        if (stockData) {
            stockData.forEach(function(ele) {
                chart.addSeries({
                    name: ele.name,
                    data: ele.data
                });
                appendCode(ele);
            })
        }
    })).fail(function (e) {
        console.log(e);
    });

    $("#send").click(function () {
        let input = $("#code").val();
        if (input) {
        socket.emit("insertCode",{name:input});
        } else {
            console.log("fill the input");
        }
    });
  

  $("#codelist").on("click",".remove",function(){
    let id = $(this).attr("id");
    socket.emit("deleteCode",{name:id});
  });

  socket.on("inserted",function(data){
    chart.addSeries({
        name: data.name,
        data: data.data
    });
    appendCode(data);
  });

  socket.on("deleted",function(data){
    chart.series.forEach(function (ele,ind){
        if(ele.name === data.name){
          chart.series[ind].remove();
        }
    });
    $(`#${data.name}`).parent().parent().remove();
  });

  socket.on("errorMessage",function(data){
      console.log(data);
  })
});

