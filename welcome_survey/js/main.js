var ages = [];
var agesTotal=0;
var agesAverage=0;
var maleCount = 0;
var femaleCount = 0;
var pizzaFans = 0; 
var goldfishFans = 0;
var dogFans = 0;
var catFans = 0;
var rockFans = 0;
var pizzaFanPerc = "";

var formatPerc = d3.format(".1%")
var formatAges = d3.format(".1")

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
        if(entry.gender === "male"){
            maleCount += 1;
        } 
        if(entry.gender === "female"){
            femaleCount += 1;
        }
        if(entry.pizza_fan === "yes"){
            pizzaFans += 1;
        }
        if(entry.favorite_pet === "dog"){
            dogFans += 1;
        }
        if(entry.favorite_pet === "cat"){
            catFans += 1;
        }
        if(entry.favorite_pet === "goldfish"){
            goldfishFans += 1;
        }
        if(entry.favorite_pet === "rock"){
            rockFans += 1;
        }
        
    })
    getAverages();
}

function getAverages(){

    for(var i=0;i<ages.length;i++){
        agesTotal+=ages[i];
    }
    agesAverage = formatAges((agesTotal/ages.length));
    var pizzaFanCalc = pizzaFans / surveyData.length;
    pizzaFanPerc = formatPerc(pizzaFanCalc);
    displayResults();

}

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
    $("#pizzaFanPerc").html(pizzaFanPerc);
    $("#dogFans").html(dogFans);
    $("#catFans").html(catFans);
    $("#goldfishFans").html(goldfishFans);
    $("#rockFans").html(rockFans);
    $("#averageAge").html(agesAverage);


}

getData();




