var pageHeight = $(window).height();
$("#loader").css("height", pageHeight * 0.75 );

// setup Leaflet map
var mapHeight = $(window).height() - 50;
var mapBounds = [];
var registrationData = [];
var progressData = [];


var extentGroup = new L.FeatureGroup();
var totalSurveysCount = 0;
var mappedHeatPoints = [];

$("#map").height(mapHeight);
$("#infoWrapper").height(mapHeight);

var mapAttribution = 'Base map &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a> | &copy; <a href="http://www.redcross.org.ph/" title="Philippine Red Cross" target="_blank">Philippine Red Cross</a> 2014, CC-BY | <a title="Disclaimer" onClick="showDisclaimer();">Disclaimer</a>';
var mapboxStreetsUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hmki3gmj/{z}/{x}/{y}.png',
  mapboxTerrainUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hc5olfpa/{z}/{x}/{y}.png',
  greyscaleUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.i4d2d077/{z}/{x}/{y}.png',
  hotUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  mapboxSatelliteUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.inlanejo/{z}/{x}/{y}.png';
var mapboxStreets = new L.TileLayer(mapboxStreetsUrl, {attribution: mapAttribution}),
  mapboxSatellite = new L.TileLayer(mapboxSatelliteUrl, {attribution: mapAttribution}),
  mapboxTerrain = new L.TileLayer(mapboxTerrainUrl, {attribution: mapAttribution}),
  greyscale = new L.TileLayer(greyscaleUrl, {attribution: mapAttribution}),
  hot = new L.TileLayer(hotUrl, {attribution: mapAttribution});
  

var Lmap = new L.Map("map", {
  center: [11.04197, 124.96296], 
  zoom: 8, 
  minZoom: 8,
  maxZoom: 17,
  // scrollWheelZoom: false,
  layers: [greyscale]
});

var baseMaps = {
  "Grey": greyscale,
  "Satellite": mapboxSatellite,
  "Streets": mapboxStreets,
  "Terrain": mapboxTerrain,
  "HOT": hot
};

L.control.layers(baseMaps).addTo(Lmap);


/* Initialize the SVG layer */
Lmap._initPathRoot()    

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg");
var shelterMarkers = svg.append('g').attr("id", "shelterMarkers");


function d3Draw(){  
  d3.csv("data/Shelter_QR-Registration_2014_07_09_01_04_40.csv", function(data) {
    registrationData = data;
    /* Add a LatLng object to each item in the dataset */
    data.forEach(function(d) {
      d.LatLng = new L.LatLng(d._location_latitude,d._location_longitude)
    })

    var featureShelter = shelterMarkers.selectAll("circle")
      .data(data)
      .enter().append("circle").attr("r", 5).attr('stroke','black')
      .attr('stroke-opacity', 1)
      .attr('fill','red')
      .attr('fill-opacity', 0.3)
      .on("click", function(d){
        
        d3.select("#shelterMarkers").selectAll("circle").attr("r", 5).attr('stroke','black');
        d3.select(this).attr("r", 9).attr('stroke','red');

        var thisPCode = d["house_code"].slice(2,13);
        $("#houseBrgy").html(adminLookup[thisPCode]["NAME_3"]);
        $("#houseMunicip").html(adminLookup[thisPCode]["NAME_2"]);
        $("#houseProv").html(adminLookup[thisPCode]["NAME_1"]);
       
        $("#houseDesign").html(d["house_code"].slice(0,1));
        checkForImages(d);
        
        

      });
   
    function update() {
      featureShelter.attr("cx",function(d) { return Lmap.latLngToLayerPoint(d.LatLng).x})
      featureShelter.attr("cy",function(d) { return Lmap.latLngToLayerPoint(d.LatLng).y})
      // featureShelter.attr("r",function(d) { return 5})
    }
    Lmap.on("viewreset", update);
    update();
    getExtent();
  })
}

function getExtent(){
  $(registrationData).each(function(aIndex, a){
    totalSurveysCount += 1;
    var coordinates = [a._location_latitude, a._location_longitude];
    extentGroup.addLayer(new L.CircleMarker(coordinates, {
      opacity: 0,
      fillOpacity: 0
    }));         
  });  
  extentGroup.addTo(Lmap);
  mapBounds = extentGroup.getBounds();
  Lmap.removeLayer(extentGroup);
  Lmap.fitBounds(mapBounds);
  $("#totalHousesCount").html(totalSurveysCount.toString())
  getProgressData();
}

function getProgressData() {
  d3.csv("data/Shelter_ProgressUpdate_2014_07_09_01_06_09.csv", function(data) {
    progressData = data;
  });
  $("#loading").remove();
}


function checkForImages(markerObj){
  $("#houseImg").empty();
  var marker = markerObj;
  $(progressData).each(function(aIndex, a){
    if(marker["house_code"] === a["house_code"]){
      if(a["img_progress"] !== "n/a"){
        $("#houseImg").html("<img class='img-responsive' src='images/" + a["img_progress"] + "'>");
      }
      if(a["img_beamsTrusses"] !== "n/a"){
        $("#beamImg").html("<img class='img-responsive' src='images/" + a["img_beamsTrusses"] + "'>");
      }
    }
  });
}  





// VARIOUS HELPER FUNCTIONS
function zoomOut(){
  Lmap.fitBounds(mapBounds);
} 




// adjust map div height on screen resize
$(window).resize(function(){
  mapHeight = $(window).height() - 50;
  $("#map").height(mapHeight);
  $("#infoWrapper").height(mapHeight);
});

// show disclaimer text on click of dislcaimer link
function showDisclaimer() {
    window.alert("The maps on this page do not imply the expression of any opinion on the part of the Philippine Red Cross concerning the legal status of a territory or of its authorities.");
}

// get count of markers visible in current map extent
Lmap.on('moveend', function(){
  var visibleMarkers = 0;
  var newBounds = Lmap.getBounds();
  var northernLat = newBounds._northEast.lat;
  var easternLng = newBounds._northEast.lng;
  var southernLat = newBounds._southWest.lat;
  var westernLng = newBounds._southWest.lng;
  $.each(registrationData, function(aIndex, a){
    if(a._location_latitude < northernLat && 
      a._location_latitude > southernLat &&
      a._location_longitude < easternLng &&
      a._location_longitude > westernLng){
        visibleMarkers += 1;
    }
  });
  $("#visibleHousesCount").html(visibleMarkers.toString());
})

//initialize function chain
d3Draw();