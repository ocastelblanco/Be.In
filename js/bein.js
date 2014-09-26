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
        $('#salida').append('Es web<br>');
        //In case of web we ignore PhoneGap but resolve the Deferred Object to trigger initialization
	    pgReady.resolve();
      } else {
        console.log("Is not web.");
        $('#salida').append('Es app<br>');
	    this.bindEvents();
      }
   }, bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   }, onDeviceReady: function() {
       console.log("Cordova PhoneGap inicializado");
        $('#salida').append('Cordova PhoneGap inicializado<br>');
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
    $('#salida').append('jQueryMobile inicializado<br>');
   jqmReady.resolve();
});
/**
 * General initialization.
 */
$.when(jqmReady, pgReady).then(function() {
   console.log("Frameworks ready. Inicia captura.");
    $('#salida').append('Frameworks ready. Inicia captura<br>');
   //Initialization code here
   if(app.callback) {
      app.callback();
   }
});
app.initialize(function() {
   //Do something
   iniciarCamara();
});
var pictureSource;
var destinationType;
function iniciarCamara() {
    console.log("Dispositivo listo");
    $('#salida').append('Dispositivo listo<br>');
    $('#botonesFoto').show();
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}
function onPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
}
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}
function capturePhoto() {
    console.log('Iniciando captura');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50, destinationType: destinationType.DATA_URL});
}
function capturePhotoEdit() {
    console.log('Iniciando captura con edición');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL});
}
function getPhoto(source) {
    console.log('Iniciando captura de foto existente');
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: source});
}
function onFail(message) {
    console.log('Failed because: ' + message);
}