/**
 * @author: Chris Hjorth, www.chrishjorth.com
 */
var jqmReady = $.Deferred();
var pgReady = $.Deferred();
var esPG = false;
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
            esPG = true;
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
    if (esPG) {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        navigator.splashscreen.hide();
    }
}
function onPhotoDataSuccess(imageData) {
    $('#salida').append('Fin de photoData<br>');
    $('#tomarFotoDialogo').popup('close');
    $('#divFotoB').hide();
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
    $('#smallImage').show().attr('src',"data:image/jpeg;base64," + imageData);
}
function onPhotoURISuccess(imageURI) {
    $('#salida').append('Fin de photoURI<br>');
    var largeImage = document.getElementById('smallImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    $('#smallImage').show().attr('src',imageURI);
}
function capturePhoto() {
   $('#salida').append('Iniciando captura<br>');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50, destinationType: destinationType.DATA_URL});
}
function capturePhotoEdit() {
    $('#salida').append('Iniciando captura con edición<br>');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL});
}
function getPhoto(source) {
   $('#salida').append('Iniciando captura de foto existente<br>');
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: source});
}
function onFail(message) {
    $('#salida').append('Failed because: ' + message+'<br>');
}
/* */
$(function(){
    $('[data-role="page"]').on('pagecreate', function(){
        console.log('Cualquier página creada');
    });
    $('#inicial').on('pagecreate', function(){
        $('#tomarFotoDialogo').on("popupafteropen", function(event,ui){
            var anchoPant = $(document).innerWidth();
            var anchoPopup = Math.floor(anchoPant*0.9);
            var margenIzq = Math.floor((anchoPant-anchoPopup)/2);
            console.log(anchoPant, anchoPopup, margenIzq);
            $(this).width(anchoPopup);
        	$('#tomarFotoDialogo-popup').css('left', margenIzq+"px");
        });
    });
});