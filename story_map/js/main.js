var windowHeight = $(window).height();

$(window).resize(function(){     
    windowHeight = $(window).height();
})




$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
}); 

 
var width = $(window).width(); 
if(width >= 768){

      function callImageModal (item) {
        var imgUrl = $(item).find('img').attr("src").slice(0,-9) + 'large.jpg';
        var img_maxHeight = (windowHeight*0.85).toString() + "px";
        $(".modal-img").css('max-height', img_maxHeight);
        $(".modal-img").attr('src', imgUrl);
        $("#myImageModal").modal();    
      }

      $(".quickNav").html('<div class="btn-group">'+
          '<button type="button" class="btn btn-xs dropdown-toggle btn-quickNav" data-toggle="dropdown">'+ 
            '<span style="font-size:18px; color:#f5f5f5;"> ☰ </span></button>'+
            '<ul class="dropdown-menu" role="menu">'+
              '<li><a href="#">Home</a></li>'+
              '<li><a href="#livelihoods"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Livelihoods Profiles</a></li>'+
              '<li><a href="#coconutlady"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; The Coconut Lady</a></li>'+
              '<li><a href="#shelter"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Shelter Profiles</a></li>'+
              '<li><a href="#sheltergallery1"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; Building Back</a></li>'+
              '<li><a href="#sheltergallery2"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; The Building Process</a></li>'+
              // '<li class="divider"></li>'+
              // '<li class="header">Livelihood Beneficiary Profiles</li>'+
              // '<li><a href="#liporada">Maria Redubla Liporada</a></li>'+
              // '<li><a href="#barroa">Restituto B. Barroa</a></li>'+
              // '<li><a href="#rogan">Estifana Rogan</a></li>'+
              // '<li><a href="#calinao">Francisco Calinao</a></li>'+    
              // '<li class="header">Shelter Beneficiary Profiles</li>'+
              // '<li><a href="#beron">Manuel Beron</a></li>'+
              // '<li><a href="#jubos">Misalina Cabalquinto Jubos</a></li>'+
              // '<li><a href="#neri">Neri</a></li>'+
              '<li><a href="#films"><span class="glyphicon glyphicon-film color-khaki"></span>&nbsp; Films</a></li>'+
              '<li><a href="#roasa"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Reflections</a></li>'+
              '<li><a href="#manila"><span class="glyphicon glyphicon-info-sign color-red"></span>&nbsp; Philippine Red Cross</a></li>'+
              '<li><a href="#movement"><span class="glyphicon glyphicon-info-sign color-red"></span>&nbsp; International Red Cross and Red Crescent Movement</a></li></ul></div>');
      $(".quickNav").tooltip(); 


      $('body').css("padding-top","0px");


      // geojson points for each story piece
      var storyPoints = [
      {
          "type": "Feature",
          "properties": {
            "id": "cover",
            "place_name": "PHL",
            "view_bounds": [
            [7.667441482726068, 118.564453125], 
            [18.375379094031814, 127.06787109374999]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "livelihoods",
            "place_name": "PHL",
            "view_bounds": [
            [7.667441482726068, 118.564453125], 
            [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "liporada",
            "place_name": "Anonang, Burauen, Leyte",
            "view_bounds": [
            [10.7928387592471, 124.722290039062], [11.3286071438514, 125.119171142577]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "martinez",
            "place_name": "Villa Corazon, Burauen, Leyte",
            "view_bounds": [
            [10.7145866909815, 124.576721191406], [11.2503550755858, 124.973602294921]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.78842258453368,
            10.93659901550848
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "cabujoc",
            "place_name": "Santol, San Miguel, Leyte",
            "view_bounds": [
            [11.081384602413, 124.626159667968], [11.6171529870173, 125.023040771483]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.82698202133177,
            11.34642079068341
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "barroa",
            "place_name": "Ilawod Daga, Panay, Capiz",
            "view_bounds": [
            [11.3077077077654, 122.596435546874], [11.8434760923697, 122.993316650389] 
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.77608,
            11.49622
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "rogan",
            "place_name": "Ogsip, Libacao, Aklan",
            "view_bounds": [
            [11.3561823923755, 122.173461914062], [11.8919507769798, 122.570343017577] 
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.3032906,
            11.4812281
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "calinao",
            "place_name": "Bago Chiquito, Panay, Capiz",
            "view_bounds": [
            [11.3050144289314, 122.618408203125], [11.8407828135357, 123.01528930664]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.7941653,
            11.5576111
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "coconutlady",
            "place_name": "Candahug, Palo, Leyte",
            "view_bounds": [
            [10.9142240069443, 124.810180664062], [11.4499923915486, 125.207061767577]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.01407146453856,
            11.17861237947222
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "shelter",
            "place_name": "",
            "view_bounds": [
            [7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              124.8833,
              10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "beron",
            "place_name":"Biasong, San Isidro, Leyte",
            "view_bounds": [
            [11.1406767764011, 124.163360595703], [11.6764451610054, 124.560241699218]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.3423,
            11.3869
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "jubos",
            "place_name":"San Isidro, Leyte",
            "view_bounds": [
            [11.1406767764011, 124.163360595703], [11.6764451610054, 124.560241699218]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.36695098876952,
            11.360558174382662
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "neri",
            "place_name":"Banat-i, San Isidro, Leyte",
            "view_bounds": [
            [11.1406767764011, 124.163360595703], [11.6764451610054, 124.560241699218]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.3948,
            11.3688
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "remorta",
            "place_name":"Batilisan Bawud, San Isidro, Leyte",
            "view_bounds": [
            [11.1406767764011, 124.163360595703], [11.6764451610054, 124.560241699218]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.35245,
            11.40760
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "sheltergallery1",
            "place_name":"Tabontabon, Leyte",
            "view_bounds": [
            [10.8710704594996, 124.826660156249], [11.4068388441039, 125.223541259764]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.96398925781249,
            11.049038346537106
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "sheltergallery2",
            "place_name":"Panay, Capiz",
            "view_bounds": [
            [11.302321124788, 122.579956054687], [11.8380895093923, 122.976837158202]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.78938293457031,
            11.542598193914182
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "films",
            "place_name": "",
            "view_bounds": [
            [7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              124.8833,
              10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "roasa",
            "place_name":"tacloban",
            "view_bounds": [
            [10.9978161519681, 124.840393066406], [11.5335845365724, 125.237274169921]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.0043296813965,
            11.223699186296267
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "pidolopez",
            "place_name":"Tacuranga, Palo, Leyte",
            "view_bounds": [
            [10.9411917934565, 124.867858886718], [11.4769601780608, 125.264739990233]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.97909545898436,
            11.147161126102558
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "amparo",
            "place_name":"taguig city",
            "view_bounds": [
            [14.2856773001825, 120.899047851562], [14.8214456847868, 121.295928955077]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            121.07826232910156,
            14.536397292888351
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "manila",
            "view_bounds": [
            [14.3894576807687, 120.750732421875], [14.925226065373, 121.14761352539]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            120.96999764442444,
            14.59133954466318
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "movement",
            "view_bounds": [
            [-37.71859032558814, 42.890625], [71.74643171904148, 158.90625]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.6953125,
            11.953349393643416
            ]
          }
        }
        ];
      // define tile layer for base map
      // var tileLayerUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      var tileLayerUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png';

      var tileLayer = L.tileLayer(tileLayerUrl);
      // setup leaflet map with desired options
      
      var storyWidth = $(window).width() * 0.60;
      var padding = L.point(storyWidth, 0);
      var map = L.map('map', { 
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          zoomControl: false,
          attributionControl: false,  
          // zoom: 6,
          // center: [11, 125.7],     
          layers: [tileLayer]
      }).fitBounds([[7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]], {
        paddingTopLeft: padding
      });

 

      //add markers to map
      var markerMap = {};
      var spots = L.geoJson(storyPoints, {
        pointToLayer: function (feature, latlng) {
            var thisIcon = L.divIcon({
              className: feature.properties.id +' spot spot-' + feature.properties.id,
              iconAnchor: [60,60]
            });
            var thisMarker = L.marker(latlng, {
              icon: thisIcon, 
              clickable: false
            });
            markerMap[feature.properties.id] = thisMarker;
            return thisMarker;
        }
      }).addTo(map);

      // Array of story section elements.
      var sections = document.getElementsByTagName('section');      

      // Helper to set the active section.
      var previousActive = 0;
      var setActive = function(index, ease) {
          var activeSpotId = sections[index].id;
          // Set active class on sections
          _(sections).each(function(s) { s.className = s.className.replace(' active', '') });
          sections[index].className += ' active';

          // if sections[index].id == cover || movement || etc. then add a class for display:none for all the markers

          // Set active class on markers
          $.each($('.spot'), function(index, spotDiv) {     
            if($(spotDiv).hasClass(activeSpotId)){
              $(spotDiv).addClass('active');
            } else {
              $(spotDiv).removeClass('active');
            }
          });
          
          // Set a body class for the active section.
          document.body.className = 'section-' + index;

          // Ease map to active marker.
          if (ease && previousActive !== index && markerMap[activeSpotId] !== undefined) {
            var storyWidth = $(window).width() * 0.6;
            var padding = L.point(storyWidth, 0)
            map.fitBounds(markerMap[activeSpotId].feature.properties.view_bounds, {
              paddingTopLeft: padding,
              // zoom: {
              //   animate: true,
              //   duration: 6
              // },
              pan: {
                animate: true,
                duration: 2.5
              }
            });

            previousActive = index;
          } 
          return true;
      };

      // Bind to scroll events to find the active section.
      window.onscroll = _(function() {
        // IE 8
        if (window.pageYOffset === undefined) {
          var y = document.documentElement.scrollTop;
          var h = document.documentElement.clientHeight;
        } else {
          var y = window.pageYOffset;
          var h = window.innerHeight;
        }

        // If scrolled to the very top of the page set the first section active.
        if (y === 0) return setActive(0, true);

        // Otherwise, conditionally determine the extent to which page must be
        // scrolled for each section. The first section that matches the current
        // scroll position wins and exits the loop early.
        var memo = 0;
        var buffer = (h * 0.3333);
        var active = _(sections).any(function(el, index) {
          memo += el.offsetHeight;
          return y < (memo-buffer) ? setActive(index, true) : false;
        });

        // If no section was set active the user has scrolled past the last section.
        // Set the last section active.
        if (!active) setActive(sections.length - 1, true);
      }).debounce(10);

      // Set map to first section.
      setActive(0, false);

      // show disclaimer text on click of dislcaimer link
      function showDisclaimer() {
          window.alert("The maps used do not imply the expression of any opinion on the part of the International Federation of Red Cross and Red Crescent Societies or National Societies concerning the legal status of a territory or of its authorities.");
      }

}