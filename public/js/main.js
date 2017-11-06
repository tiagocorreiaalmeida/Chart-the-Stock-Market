"use strict";

$(document).ready(function () {
    let chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        series: []
    });

    let appendCode = (ele)=>{
        $('#codelist').append(`
        <div class="card col-md-4">
            <div class="card-body">
                <h4 class="card-title">${ele.name}</h4>
                <p class="card-text">${ele.description}</p>
                <button class="btn btn-primary remove" id="${ele.name}">Remove</button>
            </div>
        </div>`);
    }

    $.getJSON("/currentData", (function (stockData) {
        if (stockData) {
            stockData.forEach((ele) => {
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
            $.getJSON(`/stock/${input}`, (function (stockData) {
                if (stockData && stockData.message === "Invalid Code") {
                    console.log(stockData);
                } else if (stockData) {
                    chart.addSeries({
                        name: stockData.name,
                        data: stockData.data
                    });
                    appendCode(stockData);
                    //socket.on
                }   
            })).fail(function (e) {
                console.log(e);
            });
        } else {
            //Send alert message to user about empty input
        }
    });
});

