/**
 * @author: Chris Hjorth, www.chrishjorth.com
 * Modificaciones ocastelblanco@gmail.com
 */
var jqmReady = $.Deferred();
var pgReady = $.Deferred();
var esPG = false;
var pictureSource, destinationType;
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
    $(this).off("pageinit");
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
    /*
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
    */
    $('#smallImage').show().attr('src',"data:image/jpeg;base64," + imageData);
    fotosBD.push({
        fotoData:   imageData,
        tipo:       'data'
    });
}
function onPhotoURISuccess(imageURI) {
    $('#salida').append('Fin de photoURI<br>');
    $('#tomarFotoDialogo').popup('close');
    $('#divFotoB').hide();
    /*
    var largeImage = document.getElementById('smallImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    */
    $('#smallImage').show().attr('src',imageURI);
    fotosBD.push({
        fotoData:   imageURI,
        tipo:       'uri'
    });
}
function capturePhoto() {
   $('#salida').append('Iniciando captura<br>');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50, destinationType: destinationType.DATA_URL});
}
function getPhoto(source) {
   $('#salida').append('Iniciando captura de foto existente<br>');
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: source});
}
function onFail(message) {
    $('#salida').append('Failed because: ' + message+'<br>');
}
var baseDatos = new Firebase("https://bein.firebaseio.com/");
var fotosBD = baseDatos.child('fotosArmario');
// La función de captura de carga de nuevas imágenes
fotosBD.on('value',function(captura){
    $('#salida').append('Nuevas fotos<br>');
    var enlace1 = '<a href="#';
    var enlace2 = '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="';
    var enlace3 = '"></a></div>';
    var popUpModal1 = '<div data-role="popup" id="';
    var popUpModal2 = '" data-overlay-theme="b" data-theme="b" data-corners="false"><a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Cerrar</a><img class="popphoto" src="';
    var popUpModal3 = '"></div>';
    var columna = true;
    var celda1 = '<div class="ui-block-';
    var celda2, enlaceTotal, popUpModalTotal;
    $('#contFotos').html('');
    $('#popUpModales').html('');
    captura.forEach(function(cadaFoto){
        if (columna) {
            celda2 = 'a">'
        } else {
            celda2 = 'b">'
        }
        var nombreFoto = cadaFoto.name();
        var contFoto = cadaFoto.val();
        var origenFoto = '';
        if (contFoto.tipo == 'data') {
            origenFoto = 'data:image/jpeg;base64,';
        }
        enlaceTotal = celda1+celda2+enlace1+nombreFoto+enlace2+origenFoto+contFoto.fotoData+enlace3;
        popUpModalTotal = popUpModal1+nombreFoto+popUpModal2+origenFoto+contFoto.fotoData+popUpModal3;
        $('#contFotos').append(enlaceTotal);
        $('#popUpModales').append(popUpModalTotal);
        $('#popUpModales #'+nombreFoto).popup();
        columna = !columna;
    });
});
/* */
$(function(){
    $('[data-role="page"]').on('pagecreate', function(){
        console.log('Cualquier página creada');
    });
    $('#camisas').on('pagecreate', function(){
        $('#tomarFotoDialogo').on("popupafteropen", function(event,ui){
            var anchoPant = $(document).innerWidth();
            var anchoPopup = Math.floor(anchoPant*0.9);
            var margenIzq = Math.floor((anchoPant-anchoPopup)/2);
            console.log(anchoPant, anchoPopup, margenIzq);
            $(this).width(anchoPopup);
        	$('#tomarFotoDialogo-popup').css('left', margenIzq+"px");
        });
    });
    $('#universidad').on('pagecreate', function(){
        console.log('Universidad creada');
        $('.listaRopa').owlCarousel();
    });
});