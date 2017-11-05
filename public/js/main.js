$(document).ready(function(){

    $.getJSON("/currentData",(function(stockData){
        if(stockData){
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
            
            stockData.forEach((ele)=>{
                seriesOptions.push({
                    name: ele.name,
                    data: ele.data
                });
                seriesCounter += 1;
                if (seriesCounter === stockData.length) {
                    createChart();
                }
            }) 
        }
    })).fail(function(e){
        console.log(e);
    });

});

