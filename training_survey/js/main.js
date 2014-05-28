var ages = [];
var agesTotal=0;
var agesAverage=0;
var maleCount = 0;
var femaleCount = 0;
var strongly_disagree = 0;
var disagree = 0;
var neither = 0;
var agree = 0;
var strongly_agree = 0;
var dontknow = 0;

var mappedCount =0;

var donor_items=0;
var donor_money=0;
var donor_blood=0;
var volunteer=0;
var member=0;

var formatPerc = d3.format(".1%")
var formatAges = d3.format(".1")


var mapHeight = $(window).height() - 50;
var mapBounds = [];
var surveyData = [];


var extentGroup = new L.FeatureGroup();

$("#map").height(mapHeight);

var mapAttribution = 'Base map &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a> | &copy; <a href="http://www.redcross.org.ph/" title="Philippine Red Cross" target="_blank">Philippine Red Cross</a> 2014, CC-BY | <a title="Disclaimer" onClick="showDisclaimer();">Disclaimer</a>';
var mapboxStreetsUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hmki3gmj/{z}/{x}/{y}.png',
  mapboxTerrainUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hc5olfpa/{z}/{x}/{y}.png',
  greyscaleUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.i4d2d077/{z}/{x}/{y}.png',
  hotUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var mapboxStreets = new L.TileLayer(mapboxStreetsUrl, {attribution: mapAttribution}),
  mapboxTerrain = new L.TileLayer(mapboxTerrainUrl, {attribution: mapAttribution}),
  greyscale = new L.TileLayer(greyscaleUrl, {attribution: mapAttribution}),
  hot = new L.TileLayer(hotUrl, {attribution: mapAttribution});
  

var Lmap = new L.Map("map", {
  center: [11.04197, 124.96296], 
  zoom: 8, 
  minZoom: 8,
  // scrollWheelZoom: false,
  layers: [greyscale]
});

var baseMaps = {
  "Grey": greyscale,
  "Streets": mapboxStreets,
  "Terrain": mapboxTerrain,
  "HOT": hot
};

L.control.layers(baseMaps).addTo(Lmap);


function getData() {
    $.ajax({
        type: 'GET',
        url: 'data/data.json',
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,        
        success: function(json) {
            surveyData = json;
            crunchData();
               
        },
        error: function(e) {
            console.log(e);
        }
    });
}



function crunchData(){
    $.each(surveyData, function(index, entry){
        ages.push(entry.age);
        if(entry.sex === "male"){
            maleCount += 1;
        } 
        if(entry.sex === "female"){
            femaleCount += 1;
        }
        if(entry.sectionA_prc_yolanda === "strongly_disagree"){
            strongly_disagree += 1;
        }
        if(entry.sectionA_prc_yolanda === "disagree"){
            disagree += 1;
        }
        if(entry.sectionA_prc_yolanda === "neither"){
            neither += 1;
        }
        if(entry.sectionA_prc_yolanda === "agree"){
            agree += 1;
        }
        if(entry.sectionA_prc_yolanda === "strongly_agree"){
            strongly_agree += 1;
        }
        if(entry.sectionA_prc_yolanda === "dontknow"){
            dontknow += 1;
        }

        if(entry.sectionB_donor_items === "yes"){
            donor_items += 1;
        }
        if(entry.sectionB_donor_money === "yes"){
            donor_money += 1;
        }
        if(entry.sectionB_donor_blood === "yes"){
            donor_blood += 1;
        }
        if(entry.sectionB_volunteer === "yes"){
            volunteer += 1;
        }
        if(entry.sectionB_member === "yes"){
            member += 1;
        }
        

        
    })
    getAverages();
}

function getAverages(){

    for(var i=0;i<ages.length;i++){
        agesTotal+=ages[i];
    }
    agesAverage = d3.round((agesTotal/ages.length), 1);
    var itemsCalc = donor_items / surveyData.length;
    itemsPerc = formatPerc(itemsCalc);
    var moneyCalc = donor_money / surveyData.length;
    moneyPerc = formatPerc(moneyCalc);
    var bloodCalc = donor_blood / surveyData.length;
    bloodPerc = formatPerc(bloodCalc);
    
    var volunteerCalc = volunteer / surveyData.length;
    volunteerPerc = formatPerc(volunteerCalc);
    var memberCalc = member / surveyData.length;
    memberPerc = formatPerc(memberCalc);
    displayResults();
}

var itemsPerc = "";
var moneyPerc = "";
var bloodPerc = "";
var memberPerc = "";
var volunteerPerc = "";



function displayResults(){
    $("#results-count").html(surveyData.length.toString());
    $("#results-male").html(maleCount.toString());
    $("#results-female").html(femaleCount.toString());
    for(var i=0;i<femaleCount;i++){
        $("#gender-icons").append("<img class='gender-icon' src='img/female.png'>");
    }
    for(var i=0;i<maleCount;i++){
        $("#gender-icons").append("<img class='gender-icon' src='img/male.png'>");
    }
    $("#strongly_disagree").html(strongly_disagree.toString());
    $("#disagree").html(disagree.toString());
    $("#neither").html(neither.toString());
    $("#agree").html(agree.toString());
    $("#strongly_agree").html(strongly_agree.toString());
    $("#dontknow").html(dontknow.toString());

    $("#donor_money").html(moneyPerc);
    $("#donor_blood").html(bloodPerc);
    $("#donor_items").html(itemsPerc);
    $("#volunteer").html(volunteerPerc);
    $("#member").html(memberPerc);

    $("#averageAge").html(agesAverage);

    mapData();

}




function mapData(){
  $(surveyData).each(function(aIndex, a){
    if(a._interview_location_latitude !== "n/a" && a._interview_location_longitude !== "n/a"){
    
        var coordinates = [parseFloat(a._interview_location_latitude), parseFloat(a._interview_location_longitude)];
        extentGroup.addLayer(new L.CircleMarker(coordinates));
        mappedCount +=1; 
    }
            
  });  
  $("#mappedCount").html(mappedCount.toString());
  extentGroup.addTo(Lmap);
  mapBounds = extentGroup.getBounds();
  Lmap.fitBounds(mapBounds);
  showImages();
}

function showImages(){
    $(surveyData).each(function(aIndex,a){
        if(a.picture_image !== "n/a"){
            var imageHtml = '<img class="interview-img"'+' src="images/' + a.picture_image + '">'; 
            $("#images").append(imageHtml);
        }
        
    })
}

getData();




