"use strict";

let renderData = () => {
    //DISPLAY DATA ON START
    $.getJSON("/currentData", (function (stockData) {
        if (stockData) {
            let seriesOptions = [],
                seriesCounter = 0;

            function createChart() {
                Highcharts.stockChart('container', {
                    rangeSelector: {
                        selected: 4
                    },
                    yAxis: {
                        labels: {
                            formatter: function () {
                                return (this.value > 0 ? ' + ' : '') + this.value + '%';
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },
                    plotOptions: {
                        series: {
                            compare: 'percent',
                            showInNavigator: true
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                        valueDecimals: 2,
                        split: true
                    },
                    series: seriesOptions
                });
            }

            stockData.forEach((ele) => {
                seriesOptions.push({
                    name: ele.name,
                    data: ele.data
                });
                $('#codelist').append(`
        <div class="card col-md-4">
            <div class="card-body">
                <h4 class="card-title">${ele.name}</h4>
                <p class="card-text">${ele.description}</p>
                <button class="btn btn-primary remove" id="${ele.name}">Remove</button>
            </div>
        </div>`
                );
                seriesCounter += 1;
                if (seriesCounter === stockData.length) {
                    createChart();
                }
            })
        }
    })).fail(function (e) {
        console.log(e);
    });
}

$(document).ready(function () {

    renderData();

    $("#send").click(function () {
        let input = $("#code").val();

        if (input) {

            $.getJSON(`/stock/${input}`, (function (stockData) {
                if (stockData && stockData.message === "Invalid Code") {
                    console.log(stockData);
                } else if (stockData && stockData.message === "Inserted with Success") {
                    console.log(stockData);
                }
            })).fail(function (e) {
                console.log(e);
            });

        } else {
            //Send alert message to user about empty input
        }
    });
});

