var username = "supriya.saraogi1314@gmail.com";
var username = "supriya.saraogi1314@gmail.com";
var request = new XMLHttpRequest();
var map;
var formattedAddress;
var weatherDetails;
var locationGeoCodes;
var marker;


//initializes map to a location
function initialize() {

    //initializing the map with zoom level 17 and centered as required in the project definition
    locationGeoCodes = new google.maps.LatLng(32.75, -97.13);
    var mapOption = {
        zoom: 17,
        center: locationGeoCodes,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    marker = new google.maps.Marker({}); // initialize marker
    
    map = new google.maps.Map(document.getElementById("map"), mapOption);
    reverseGeoCode();

    // fetches the latitude and longitude info when the map is clicked and calls the reverseGeoCode function 
    google.maps.event.addListener(map, 'click', function(event) {
    	locationGeoCodes = event.latLng;
        reverseGeoCode();
    });

}

/**
*	creates marker on the map as per the geocodes
*	locationGeoCodes	{Object} - contains the latitude and longitude parameters
*	
*/
function createMarker() {

    marker = new google.maps.Marker({
        position: locationGeoCodes,
        map: map
    });

    // displays the info window on the marker only when infoWindowDetails parameter has some address
    if (formattedAddress != null) {
        var infowindow = new google.maps.InfoWindow({
            content: weatherDetails	
        });
        infowindow.open(map, marker);

    }
}


/**
*	Fetches the address of the clicked location
*	locationGeoCodes {Object} - contains the latitude and longitude parameters
*/
function reverseGeoCode() {

	// clear the previous marker
    marker.setMap(null);

    var latitude = locationGeoCodes.lat();
    var longitude = locationGeoCodes.lng();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': locationGeoCodes
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
            	formattedAddress = results[0].formatted_address;
                sendRequest();
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

// clear the contents of the output div
function clearAllFields() {
    document.getElementById("output").innerHTML = "";
    marker.setMap(null);
}


// extracts the required info from the xml response and displays it on the page
function displayResult() {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
        var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
        var windspeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
        weatherDetails = "<strong>Address: </strong>" + formattedAddress+"<br/><strong>Temperature: </strong>" + temperature +
            "<br/><strong>Clouds: </strong>" + clouds +
            "<br/><strong>Wind Speed: </strong>" + windspeed;
        createMarker();
        document.getElementById("output").innerHTML += "<pre>" +
        	weatherDetails
            "</pre>";
    }
}


/**
	sends the latitutde and longitude info to the geonames API to fetch the weather info
	locationGeoCodes {Object} - contains the latitude and longitude parameters
*/
function sendRequest() {
    request.onreadystatechange = displayResult;
    var lat = locationGeoCodes.lat();
    var lng = locationGeoCodes.lng();
    request.open("GET", " proxy.php?lat=" + lat + "&lng=" + lng + "&username=" + username);
    request.withCredentials = "true";
    request.send(null);
}