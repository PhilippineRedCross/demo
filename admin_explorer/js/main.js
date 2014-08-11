var pageHeight = $(window).height();
$("#loader").css("height", pageHeight * 0.75 );

var pageWidth = $(window).width();

var width = pageWidth,
    height = 400;

var projection = d3.geo.mercator()
    .scale(4000)
    .center([122,12])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([0, 17])
    .on("zoom", zoomed);

var formatCommas = d3.format(",");

function zoomed() {
  provinceGroup.style("stroke-width", 1.5 / d3.event.scale + "px");
  municipGroup.style("stroke-width", 1 / d3.event.scale + "px");
  brgyGroup.selectAll("circle").attr("r", 8 / d3.event.scale + "px")
  provinceGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  municipGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  brgyGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

}

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);


var provinceGroup = svg.append('g').attr("id", "province-mapped");
var municipGroup = svg.append('g').attr("id", "municip-mapped");
var brgyGroup = svg.append('g').attr("id", "brgy-mapped");


svg
    // .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);


  d3.json("data/adm1_simple10.json", function(data) {
    provinceData = data;
    d3.json("data/adm2_simple10.json", function(data) {
      municipData = data;
      d3.csv("data/adm3_simple2_Points-clip.csv", function(data) {
        brgyData = data;
        $(brgyData).each(function(aIndex, a){
          a.coordinates = [a.X,a.Y];
        });

        provinceGroup.selectAll("path")
          .data(provinceData.features)
          .enter().append("path")
          .attr("d",path)
          .on("click",clickedProvince)
          .on("mouseover", function(d){ 
            var tooltipText = "<strong>" + d.properties.NAME_1 + "</strong>";
            $('#tooltip').append(tooltipText);                
          })
          .on("mouseout", function(){ 
             $('#tooltip').empty();        
          });
        $("#loading").fadeOut(300);
      });
    });
  });


var livelihoodData = [];
var shelterData = [];
var indicatorList = [];
var partnerList = [];
var partnerButtons;

function addPH(data){
  $(data).each(function(index, record){
    // var provinceCode = "PH"+record.Admin2;
    // var municipCode = "PH"+record.Admin3;
    // var brgyCode = "PH"+record.Admin4;
    // record.Admin2 = provinceCode;
    // record.Admin3 = municipCode;
    // record.Admin4 = brgyCode;
    record.Admin2 = "PH"+record.Admin2;
    record.Admin3 = "PH"+record.Admin3;
    record.Admin4 = "PH"+record.Admin4;
  });
  return data;
}

function loadSector(sector, target){
  d3.select("#sector-options").selectAll(".btn").classed("active", false);
  d3.select(target).classed("active", true);
  if(sector === "livelihood"){
    indicatorList = [
      "HH Support Beneficiaries Selected", 
      "First Installment (conditional PHP 6,000)", 
      "Second Installment (conditional PHP 4,000)"
    ]; 
    if(livelihoodData.length === 0){
      $("#loading").show();
      d3.csv("data/livelihood_20140730.csv", function(data) { 
        livelihoodData = addPH(data);
        $("#loading").fadeOut(300);
        parsePartners(); 
      });
    } else {
      parsePartners();
    }    
  }
  if(sector === "shelter"){
    indicatorList = [
      "Shelter Repair Beneficiaries Selected",
      "First Distribution (6,000 PHP)",
      "Second Distribution (4,000 PHP)",
      "CGI",
      "Shelter Repair Closeout / Completed",
      "Core Shelter Beneficiaries Selected",
      "Construction Started",
      "Wooden Shelter (Core Shelter)",
      "Half Concrete (Core Shelter)"
    ]; 
    if(shelterData.length === 0){
      $("#loading").show();
      d3.csv("data/shelter_20140730.csv", function(data) { 
        shelterData = addPH(data);
        $("#loading").fadeOut(300);
        parsePartners(); 
      });
    } else {
      parsePartners();
    }    
  }
    
}

//rebuild partners buttons
function parsePartners() {
  partnerList = [];
  $(currentSectorData()).each(function(index, record){
    var partnerName = record.Partner;
    if (partnerList.indexOf(partnerName) === -1){
        partnerList.push(partnerName);
    }; 
  });

  var partnerFilterHtml = '<button id="ALL-PARTNERS" class="btn btn-sm btn-donor filtering all" type="button" onclick="togglePartnerFilter('+"'ALL-DONORS'"+', this);"'+
      ' style="margin-right:10px;">All<span class="glyphicon glyphicon-check" style="margin-left:4px;"></span></button>';
  partnerList.sort();
  $.each(partnerList, function(index, partner){
    var itemHtml = '<button id="'+partner+'" class="btn btn-sm btn-donor" type="button" onclick="togglePartnerFilter('+"'"+partner+"'"+', this);">'+partner+
        '<span class="glyphicon glyphicon-unchecked" style="margin-left:4px;"></span></button>';
    partnerFilterHtml += itemHtml;    
  });
  $('#partnerButtons').html(partnerFilterHtml);
  partnerButtons = $("#partnerButtons").children(); 
  
  changePartnerFilter();

}


var selectedPartners = [];

function changePartnerFilter(){
  selectedPartners = [];
  provinceList = {};
  municipList = {};
  brgyList = {};
  $.each(partnerButtons, function(i, button){
    if($(button).hasClass("filtering")){
      var buttonid = $(button).attr("id");
      selectedPartners.push(buttonid);
    }
  });
  $(currentSectorData()).each(function(index, record){
    if(selectedPartners.indexOf(record.Partner) != -1  || selectedPartners.indexOf("ALL-PARTNERS") != -1 ){
      provinceList[record.Admin2] = record.prov;
      municipList[record.Admin3] = record.municip;
      brgyList[record.Admin4] = record.brgy; 
    }
    
  });
  colorProvinces();
  colorMunicip();
  colorBrgy();
  createTable();


}



function clickedProvince(d) {

  provinceGroup.selectAll("path").classed("active", false);
  municipGroup.selectAll("path").classed("active", false);
  brgyGroup.selectAll("circle").classed("active", false);
  d3.select(this).classed("active", true);

  var clickedPcode = d.properties.PCODE_PH1;
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);

  brgyGroup.selectAll("circle").remove();

  var municipDisplay = municipGroup.selectAll("path")
      .data(municipData.features.filter(function(d) {return d.properties.PCODE_PH1 === clickedPcode;}), function(d) { return d.properties.PCODE_PH2; });
  municipDisplay.enter().append("path")
      .attr("d",path).on("click",clickedMunicip)
      .on("mouseover", function(d){ 
        var tooltipText = d.properties.NAME_2;
        $('#tooltip').append(tooltipText);                
      })
      .on("mouseout", function(){ 
         $('#tooltip').empty();        
      });
  municipDisplay.exit().remove();

  colorMunicip();
  createTable();
 
}

var totalRow = {};
var breakdownRows = {};

function createTable(){

  var activePcode = "ALL";
  var activeName = "Haiyan Operation";
  
  provinceGroup.selectAll(".active").each(function(d,i){
    activePcode = d.properties.PCODE_PH1;
    activeName = d.properties.NAME_1;
    municipGroup.selectAll(".active").each(function(d,i){
      activePcode = d.properties.PCODE_PH2;
      activeName = d.properties.NAME_2;
    });
  });

  totalRow = {};
  breakdownRows = {};
    
  totalRow[activePcode] = { 'name' : activeName };
  $.each(indicatorList, function(index, indicator){
    totalRow[activePcode][indicator] = 0;
  });  
  $(currentSectorData()).each(function(index, record){
    if(selectedPartners.indexOf(record.Partner) != -1  || selectedPartners.indexOf("ALL-PARTNERS") != -1 ){
      // operation overview
      if("ALL" === activePcode){
          if(breakdownRows.hasOwnProperty(record.Admin2) === false){
            breakdownRows[record.Admin2] = { 'name' : record.prov };
            $.each(indicatorList, function(index, indicator){
              breakdownRows[record.Admin2][indicator] = 0;
            });
          }
          $.each(indicatorList, function(index, indicator){
            if(isFinite(parseInt(record[indicator]))){
              totalRow[activePcode][indicator] += parseInt(record[indicator]);
              breakdownRows[record.Admin2][indicator] += parseInt(record[indicator]);
            }
          });        
      }

      // province active
      if(record.Admin2 === activePcode){
        if(breakdownRows.hasOwnProperty(record.Admin3) === false){
          breakdownRows[record.Admin3] = { 'name' : record.municip };
          $.each(indicatorList, function(index, indicator){
            breakdownRows[record.Admin3][indicator] = 0;
          });
        }
        $.each(indicatorList, function(index, indicator){
          if(isFinite(parseInt(record[indicator]))){
            totalRow[activePcode][indicator] += parseInt(record[indicator]);
            breakdownRows[record.Admin3][indicator] += parseInt(record[indicator]);
          }
        });
      }
      // muncip active
      if(record.Admin3 === activePcode){
        if(breakdownRows.hasOwnProperty(record.Admin4) === false){
          breakdownRows[record.Admin4] = { 'name' : record.brgy };
          $.each(indicatorList, function(index, indicator){
            breakdownRows[record.Admin4][indicator] = 0;
          });
        }
        $.each(indicatorList, function(index, indicator){
          if(isFinite(parseInt(record[indicator]))){
            totalRow[activePcode][indicator] += parseInt(record[indicator]);
            breakdownRows[record.Admin4][indicator] += parseInt(record[indicator]);
          }
        });
      }
    }
  });

  $("#sector-accomplished_headers").empty();
  $("#sector-accomplished_content").empty();

  $("#sector-accomplished_headers").append("<th></th>");
  var columnCount = 0;
  $.each(indicatorList, function(index, indicator){
    columnCount ++;
    $("#sector-accomplished_headers").append("<th>" + indicator + "</th>");
  });
  $("#sector-accomplished colgroup").html('<col style="width:20%">');
  var columnWidth = 80 / columnCount;
  for(i=0; i<columnCount; i++){
    $("#sector-accomplished colgroup").append('<col style="width:' + columnWidth.toString() + '%">');
  }

  for(x in totalRow){
    var thisHtml = '<tr class="danger totalRow"><td>' + totalRow[x]['name'] + "</td>";
    $.each(indicatorList, function(index, indicator){
      thisHtml += "<td>" + formatCommas(totalRow[x][indicator]) + "</td>";
    });
    thisHtml += "</tr>";
    $("#sector-accomplished_content").append(thisHtml);
  }
  for(x in breakdownRows){
    var thisHtml = "<tr><td>" + breakdownRows[x]['name'] + "</td>";
    $.each(indicatorList, function(index, indicator){
      thisHtml += "<td>" + formatCommas(breakdownRows[x][indicator]) + "</td>";
    });
    thisHtml += "</tr>";
    $("#sector-accomplished_content").append(thisHtml);
  }

}


function clickedMunicip(d){

  municipGroup.selectAll("path").classed("active", false);
  brgyGroup.selectAll("circle").classed("active", false);
  d3.select(this).classed("active", true);

  var clickedPcode = d.properties.PCODE_PH2;

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0]+5,
      dy = bounds[1][1] - bounds[0][1]+5,
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);

  var brgyDisplay = brgyGroup.selectAll("circle")
      .data(brgyData.filter(function(d) { 
        var thisCode = d.PCODE_PH3.slice(0,8) + "000"; 
        return thisCode === clickedPcode; 
      }), function(d) { return d.PCODE_PH3; });
  brgyDisplay.enter().append("circle")
      .attr("cx", function(d){ return projection(d.coordinates)[0] })
      .attr("cy", function(d){ return projection(d.coordinates)[1] });
  brgyDisplay.exit().remove();

  colorBrgy();
  createTable();

}



var provinceList = {};
var municipList = {};
var brgyList = {};





function colorProvinces(){
  provinceGroup.selectAll("path").attr("fill", null);
  for(entry in provinceList){
    provinceGroup.selectAll("path")
        .filter(function(d) {return d.properties.PCODE_PH1 == entry})
        .attr('fill',"red");
  }
}

function colorMunicip(){
  municipGroup.selectAll("path").attr("fill", null);
  for(entry in municipList){
    municipGroup.selectAll("path")
        .filter(function(d) {return d.properties.PCODE_PH2 == entry})
        .attr('fill',"red");
  }
}

function colorBrgy(){
  brgyGroup.selectAll("circle").attr("fill", null);
  for(entry in brgyList){
    brgyGroup.selectAll("circle")
        .filter(function(d) {return d.PCODE_PH3 == entry})
        .attr('fill',"#7F181B");
  }
  
}



function currentSectorData(){
  var activeSector = $('#sector-options').find('.active').attr('id');
  if(activeSector === "livelihood"){
    return livelihoodData;
  }
  if(activeSector === "shelter"){
    return shelterData;
  }
}


function togglePartnerFilter (filter, element) {
  // check if filter is for all
  if($(element).hasClass('all')){
    $.each(partnerButtons, function(i, button){
      $(button).children().removeClass("glyphicon-check");
      $(button).children().addClass("glyphicon-unchecked");
      $(button).removeClass("filtering");
    })
    $(element).children().removeClass("glyphicon-unchecked"); 
    $(element).children().addClass("glyphicon-check");
    $(element).addClass("filtering");         
  } else {
      // clear the ALL filter for the filter category
      var partnerAllFilter = $('#partnerButtons').find('.all');
      $(partnerAllFilter).children().addClass("glyphicon-unchecked");
      $(partnerAllFilter).children().removeClass("glyphicon-check");
      $(partnerAllFilter).removeClass("filtering");
      
      // if clicked sector filter is on, then turn it off
      if($(element).hasClass("filtering") === true){
        $(element).removeClass("filtering");
        $(element).children().removeClass("glyphicon-check");
        $(element).children().addClass("glyphicon-unchecked");
          // if no sector filters are turned on, toggle 'All' back on
          var noSectorFiltering = true;
          $.each(partnerButtons, function(i, button){
            if ($(button).hasClass("filtering")){
              noSectorFiltering = false;
            }
          });
          if (noSectorFiltering === true){
            $(partnerAllFilter).children().removeClass("glyphicon-unchecked"); 
            $(partnerAllFilter).children().addClass("glyphicon-check");
            $(partnerAllFilter).addClass("filtering");     
          }
      // if clicked sector filter is off, then turn it on
    } else {
      $(element).addClass("filtering");
      $(element).children().removeClass("glyphicon-unchecked");
      $(element).children().addClass("glyphicon-check");                
    }
  }

  changePartnerFilter();
}


// tooltip follows cursor
$(document).ready(function() {
    $('#map').mouseover(function(e) {        
        //Set the X and Y axis of the tooltip
        $('#tooltip').css('top', e.pageY + 10 );
        $('#tooltip').css('left', e.pageX + 20 );         
    }).mousemove(function(e) {    
        //Keep changing the X and Y axis for the tooltip, thus, the tooltip move along with the mouse
        $("#tooltip").css({top:(e.pageY+15)+"px",left:(e.pageX+20)+"px"});        
    });
});


function zoomOut() {

  provinceGroup.selectAll("path").classed("active", false);
  municipGroup.selectAll("path").classed("active", false);
  brgyGroup.selectAll("circle").classed("active", false);

  brgyGroup.selectAll("circle").remove();
  municipGroup.selectAll("path").remove();
  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);

  $("#sector-accomplished_headers").empty();
  $("#sector-accomplished_content").empty();
}


 
// show disclaimer text on click of dislcaimer link
function showDisclaimer() {
    window.alert("The maps on this page do not imply the expression of any opinion on the part of the Philippine Red Cross concerning the legal status of a territory or of its authorities.");
}


