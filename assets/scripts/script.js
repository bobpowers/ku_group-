$( document ).ready(function() {

var zip = "66214"
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyAZ41msymSNTMIGE9DV22sPHymLfz7Kgtg&address=" + zip;
var lat;
var long;
var restaurantArray = [];
var choiceArray = ["chinese", "mexican", "greek"];
var randomized;
var queryURL2;
$.ajax({
	url: queryURL,
	method: "GET"
	}).done(function(geocodeResponse) {

		// logging the response URL
		console.log("------------------------------------");
		console.log("Geocode API URL: " + queryURL);

		// logging the entire response
		console.log("------------------------------------");
		console.log("JSON response from Geocode API")
		console.log(geocodeResponse);
		console.log("------------------------------------");

		lat = geocodeResponse.results[0].geometry.location.lat;
		long = geocodeResponse.results[0].geometry.location.lng;

		// logging the latitude and longitude
		console.log("latitude: " + lat);
		console.log("longitude: " + long);
		console.log("------------------------------------");


 	// making another ajax call after the first (to geocode) is complete
 		for (c=0; c<choiceArray.length;c++) {
 			queryURL2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=" + choiceArray[c] + "&location=" + lat + "," + long + "&radius=10000&type=restaurant&key=AIzaSyDy2zMoM1O0AbT5V948JyuE4AHVTrhrgjM";
 				$.ajax({
			url: queryURL2,
			method: "GET"
			}).done(function(placesResponse) {

				console.log("Places API URL: " + queryURL2);
				console.log("------------------------------------");

				console.log("JSON response from Places API")
				console.log(placesResponse);
				console.log("------------------------------------");

	  		   // creating new objects for the restaurantArray by looping through the top 10 results
		    	for (i=0; i<10; i++) {
		        	let newRestaurant = {
		          		name: placesResponse.results[i].name,
		          		address: placesResponse.results[i].vicinity,
		          		open: placesResponse.results[i].opening_hours.open_now,
		          		photo: placesResponse.results[i].photos[0].html_attributions[0]
		        	}
		        restaurantArray.push(newRestaurant);
		      	}


				console.log("Restaurants Array")
		    	console.log(restaurantArray);
		    	console.log("------------------------------------");
		      
				// Randomly selecting an object from the array
		    	randomized = restaurantArray[Math.floor(Math.random()*restaurantArray.length)];

		    	console.log("Randomized Selection from Array")
		    	console.log(randomized);
		      	console.log("------------------------------------");

				// setting the DOM element for google maps embed
		    	$("#test").attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyBBD9zvuayxJ1_OtpgrqG75VNnW8v0ozeI&q=" + randomized.address);
		    	var targetDiv = $("#targetChoice");
		    	targetDiv.empty();
		    	targetDiv.append("<h1>" + randomized.name + "</h1>");
		    	targetDiv.append("<h3>" + randomized.address + "</h3>");
		    	targetDiv.append("<h3>Open: " + randomized.open + "</h3>");
		    	$("#testdiv").append(targetDiv);
			});
 		};
	});
});