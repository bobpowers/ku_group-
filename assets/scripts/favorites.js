$(document).ready(function() {

var user = JSON.parse(localStorage.getItem("user"))
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


database.ref().child(user).on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		var restName = childSnapshot.val().name;
		var restAddr = childSnapshot.val().addr;

		// Train Info
		console.log(restName);
		console.log(restAddr);


		// Add each train's data into the table
		$("#favesDisplay").append("<h1>" + restName + "</h1>");
		$("#favesDisplay").append("<h1>" + restAddr + "</h1>");
		$("#favesDisplay").append("<br>");

});
});