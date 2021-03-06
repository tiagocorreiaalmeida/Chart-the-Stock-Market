"use strict";

$(document).ready(function () {

    const socket = io();

    let chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}$</b>',
        },
        series: []
    });

    let appendCode = function(ele){
        $('#codelist').append(`
        <div class="card col-md-4">
            <div class="card-body">
                <h4 class="card-title">${ele.name}</h4>
                <p class="card-text">${ele.description}</p>
                <button class="remove btn btn-outline-danger" id="${ele.name}">Remove</button>
            </div>
        </div>`);
    }

    $.getJSON("/currentData", (function (stockData) {
        if (stockData && stockData.length !== 0) {
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
        if($(".alert").length > 0){
          $(".alert").remove();
        }
        let input = $("#code").val();
        if (input) {
            socket.emit("insertCode",{name:input});
            $("#code").val("");
        } else {
              $("#error").append(`<div class="alert alert-success mt-4" role="alert">
              <strong>Error message: </strong>Fill the input field</div>`);
        }
    });
  
    $(document).keypress(function(e){
        if(e.which === 13){
            $("#send").click();
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
      if($(".alert").length > 0){
        $(".alert").remove();
      }
      $("#error").append(`<div class="alert alert-success mt-4" role="alert">
      <strong>Error message: </strong>${data.message}
    </div>`);
  })
});

