$(document).ready(function() {

// Initializing firebase
var config = {
    apiKey: "AIzaSyBsIcv8wg6Hzn9hKx3HvMJI3nFEZKZ-OHE",
    authDomain: "myproject-7e42c.firebaseapp.com",
    databaseURL: "https://myproject-7e42c.firebaseio.com",
    projectId: "myproject-7e42c",
    storageBucket: "myproject-7e42c.appspot.com",
    messagingSenderId: "308228989062"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// When child is added...
database.ref().on("child_added", function(childSnapshot) {
    // Calculating next arrival and minutes away
    var frequency = childSnapshot.val().frequency
    var currentTime = moment();
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    var diffTime = currentTime - firstTimeConverted;
    var remainder = diffTime % frequency;
    var minsAway = frequency - remainder;
    var nextTrain = moment(currentTime).add(minsAway, "m");
    var nextTrainFormatted = moment(nextTrain).format("HH:mm");

    // ...get info from database and push to HTML table
    var newRow = $("<tr>");
    newRow.html(
        "<td>" + childSnapshot.val().trainName +
        "<td>" + childSnapshot.val().destination +
        "<td>" + childSnapshot.val().frequency +
        "<td>" + nextTrainFormatted +
        "<td>" + minsAway
    )

    $("tbody").append(newRow);
});

// When submit button is clicked, push info to database
$(".btn").on("click", function() {
    var trainName = $("#train-name").val();
    var destination = $("#destination").val();
    var firstTrainTime = $("#first-train-time").val();
    var frequency = $("#frequency").val();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

});