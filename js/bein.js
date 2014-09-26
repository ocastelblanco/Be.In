/**
 * @author: Chris Hjorth, www.chrishjorth.com
 */
var jqmReady = $.Deferred();
var pgReady = $.Deferred();
var app = {
   //Callback for when the app is ready
   callback: null,
   // Application Constructor
   initialize: function(callback) {
      this.callback = callback;
      var browser = document.URL.match(/^https?:/);
      if(browser) {
        console.log("Is web.");
        //In case of web we ignore PhoneGap but resolve the Deferred Object to trigger initialization
	    pgReady.resolve();
      } else {
        console.log("Is not web.");
	    this.bindEvents();
      }
   }, bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   }, onDeviceReady: function() {
       console.log("Cordova PhoneGap inicializado");
      // The scope of 'this' is the event, hence we need to use app.
      app.receivedEvent('deviceready');
   }, receivedEvent: function(event) {
      switch(event) {
        case 'deviceready':
    	    pgReady.resolve();
    	    break;
      }
   }
};
$(document).on("pageinit", function(event, ui) {
    console.log("jQueryMobile inicializado");
   jqmReady.resolve();
});
/**
 * General initialization.
 */
$.when(jqmReady, pgReady).then(function() {
   console.log("Frameworks ready. Inicia captura.");
   //Initialization code here
   if(app.callback) {
      app.callback();
   }
});
app.initialize(function() {
   //Do something
    // Código de ejemplo desde cordova.apache.org
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    // Wait for device API libraries to load
    //document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //function onDeviceReady() {
        console.log("Dispositivo listo");
        $('#botonesFoto').show();
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    //}
    // Called when a photo is successfully retrieved
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);
      // Get image handle
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }
    // Called when a photo is successfully retrieved
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);
      // Get image handle
      var largeImage = document.getElementById('largeImage');
      // Unhide image elements
      largeImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      largeImage.src = imageURI;
    }
    // A button will call this functions -------\/
    function capturePhoto() {
        console.log('Iniciando captura');
        alert('Captura de foto');
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50, destinationType: destinationType.DATA_URL});
    }
    function capturePhotoEdit() {
        console.log('Iniciando captura con edición');
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL});
    }
    function getPhoto(source) {
        console.log('Iniciando captura de foto existente');
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: source});
    }
    // Called if something bad happens.
    function onFail(message) {
        console.log('Failed because: ' + message);
      alert('Failed because: ' + message);
    }
/*
*/
});