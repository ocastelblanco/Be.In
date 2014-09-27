/**
 * @author: Chris Hjorth, www.chrishjorth.com
 */
var jqmReady = $.Deferred();
var pgReady = $.Deferred();
var pictureSource;
var destinationType;
var app = {
    //Callback for when the app is ready
    callback: null,
    // Application Constructor
    initialize: function(callback) {
        this.callback = callback;
        var browser = document.URL.match(/^https?:/);
        if(browser) {
        $('#salida').append('Es web<br>');
        //In case of web we ignore PhoneGap but resolve the Deferred Object to trigger initialization
            pgReady.resolve();
        } else {
            $('#salida').append('Es app<br>');
            this.bindEvents();
        }
    }, bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }, onDeviceReady: function() {
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
    $('#salida').append('jQueryMobile inicializado<br>');
    jqmReady.resolve();
});
/**
 * General initialization.
 */
$.when(jqmReady, pgReady).then(function() {
    $('#salida').append('Frameworks ready. Inicia captura<br>');
    //Initialization code here
    if(app.callback) {
        app.callback();
    }
});
app.initialize(function() {
   iniciaDispositivo();
});
function iniciaDispositivo() {
    $('#salida').append('Dispositivo listo<br>');
    /* */
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    navigator.splashscreen.hide();
    /* */
}
function onPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
}
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('smallImage');
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