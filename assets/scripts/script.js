$(document).ready(function() {
var zip = "66214"
var proxy = "https://cors-anywhere.herokuapp.com/"
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyAZ41msymSNTMIGE9DV22sPHymLfz7Kgtg&address=" + zip;
var queryproxyURL = proxy + queryURL;
var lat;
var long;
var restaurantArray = [];
var choiceArray = [];
var randomized;
var queryURL2;
var foodArray = ["American", "Barbecue", "Chinese", "Fast Food", "French", "Greek", "Indian", "Italian", "Japanese", "Mexican", "Pizza", "Seafood", "Steak", "Sushi", "Thai"];
var ajax1 = function() {
    $.ajax({
    url: queryproxyURL,
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
            queryproxyURL2 = proxy + queryURL2;
                $.ajax({
            url: queryproxyURL2,
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
                // closing out restaurantArray loop
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
                var targetDiv = $("#results");
                targetDiv.empty();
                targetDiv.append("<h1>" + randomized.name + "</h1>");
                targetDiv.append("<h3>" + randomized.address + "</h3>");
                targetDiv.append("<h3>Open: " + randomized.open + "</h3>");
                targetDiv.append("<button id = differentButton>I don't like this choice, gimme another!</button>");

                $("#results").append(targetDiv);
                choiceArray = [];
            // closing out places .done function
            });
        // closing out choiceArray loop
        };
    // closing out geocode .done function 
    });
// closing out ajax1 function
};
    var config = {
    apiKey: "AIzaSyCYdPMoNLmcfap3ayxyS8l8fKfJveTpr84",
    authDomain: "ku-group-project.firebaseapp.com",
    databaseURL: "https://ku-group-project.firebaseio.com",
    projectId: "ku-group-project",
    storageBucket: "",
    messagingSenderId: "1072058023036"
  };
    firebase.initializeApp(config);
    var database = firebase.database();
// Loop through foodArray and add buttons to page
    var updateFoods = function(){
        $("#buttonSection").empty();
        for (var i = 0; i < foodArray.length; i++) {
            var newLabel = $("<label>");
            newLabel.addClass("btn btn-sm btn-primary buttonCheck");
            var newInput = $('<input>');
            newLabel.text(foodArray[i]);
            newInput.val(foodArray[i]);
            newInput.attr({
                type: "checkbox",
                autocomplete: "off"
            });
            newLabel.append(newInput);
            $("#buttonSection").append(newLabel);
        }
            // $("moodButtons").empty();
        if (!localStorage.userAdded) {
            return false;
        }
        else {
            var userAdded = JSON.parse(localStorage.getItem("userAdded"));
            for (var i = 0; i < userAdded.length; i++) {
                var newLabel = $("<label>");
                newLabel.addClass("btn btn-sm btn-primary buttonCheck");
                var newInput = $('<input>');
                newLabel.text(userAdded[i]);
                newInput.val(userAdded[i]);
                newInput.attr({
                    type: "checkbox",
                    autocomplete: "off"
                });
                newLabel.append(newInput);
                $("#buttonSection").append(newLabel);
            }
        }
    }
    updateFoods();


// Allow User to add food types to foodArray
    $("#userAddition").on("click", function(event){
        event.preventDefault();
        var userFood = $("#searchField").val().trim();
        if ($("#searchField").val() === ""){
            return false;
        }
        else {
            event.preventDefault();
            var newFood = $("#searchField").val().trim();
            var userAdded = []; // Array that is Written to localStorage
            $("#searchField").val("");
            // foodArray.push(newFood);
            if (!localStorage.userAdded){
                userAdded.push(newFood);
                localStorage.setItem("userAdded", JSON.stringify(userAdded));
            }
            else {
                userAdded = JSON.parse(localStorage.getItem("userAdded"))
                userAdded.push(newFood);
                localStorage.setItem("userAdded", JSON.stringify(userAdded));
            }
            userAdded = [];
            updateFoods();
        }
    });
// Send User choices to array for Google Search
    $("#pickPlace").on("click", function(){
        restaurantArray = [];
    $("label").each(function(){
        if ($(this).hasClass("active")){
            var selection = $(this).text().trim();
            var replaced = selection.replace(/ /g, '+');
            choiceArray.push(replaced);
            console.log(choiceArray);
            // Run AJAX CALL WITH FOODS THEN:
        }
    });
    console.log("after click");
    console.log(restaurantArray);
    ajax1();
    });
    $("#results").on("click", "#differentButton", function(){
    randomized = restaurantArray[Math.floor(Math.random()*restaurantArray.length)];
    console.log(randomized);
    $("#test").attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyBBD9zvuayxJ1_OtpgrqG75VNnW8v0ozeI&q=" + randomized.address);
    var targetDiv = $("#results");
    targetDiv.empty();
    targetDiv.append("<h1>" + randomized.name + "</h1>");
    targetDiv.append("<h3>" + randomized.address + "</h3>");
    targetDiv.append("<h3>Open: " + randomized.open + "</h3>");
    targetDiv.append("<button id = differentButton>I don't like this choice, gimme another!</button>");
    $("#testdiv").append(targetDiv);
});
});
