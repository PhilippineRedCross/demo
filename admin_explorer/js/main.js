
var width = 960,
    height = 500;

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


var provinceGroup = svg.append('g').attr("id", "province");
var municipGroup = svg.append('g').attr("id", "municip");
var brgyGroup = svg.append('g').attr("id", "brgy");


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
     
      });
    });
  });




function clickedProvince(d) {
  // if (active.node() === this) return reset();
  // active.classed("active", false);
  // active = d3.select(this).classed("active", true);
  // console.log(d);
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
 
}

function clickedMunicip(d){

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
  brgyGroup.selectAll("circle").remove();
  municipGroup.selectAll("path").remove();
  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
}


 
// show disclaimer text on click of dislcaimer link
function showDisclaimer() {
    window.alert("The maps on this page do not imply the expression of any opinion on the part of the Philippine Red Cross concerning the legal status of a territory or of its authorities.");
}


