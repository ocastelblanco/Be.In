/**
 * @author: Chris Hjorth, www.chrishjorth.com
 * Modificaciones ocastelblanco@gmail.com
 */
var jqmReady = $.Deferred();
var pgReady = $.Deferred();
var esPG = false;
var pictureSource, destinationType, baseDatos;
var nombreUsuaria = "Luisa Castillo";
var rutaFotoUsuaria, numCuerpo
var cuerpoUsuaria = "Reloj de Arena";
var app = {
    //Callback for when the app is ready
    callback: null,
    // Application Constructor
    initialize: function(callback) {
        this.callback = callback;
        var browser = document.URL.match(/^https?:/);
        if(browser) {
        //$('#salida').append('Es web<br>');
        //In case of web we ignore PhoneGap but resolve the Deferred Object to trigger initialization
            pgReady.resolve();
        } else {
            //$('#salida').append('Es app<br>');
            this.bindEvents();
            esPG = true;
        }
    }, bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }, onDeviceReady: function() {
        //$('#salida').append('Cordova PhoneGap inicializado<br>');
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
    //$('#salida').append('jQueryMobile inicializado<br>');
    jqmReady.resolve();
    $(this).off("pageinit");
});
$.when(jqmReady, pgReady).then(function() {
    //$('#salida').append('Frameworks ready. Inicia captura<br>');
    //Initialization code here
    if(app.callback) {
        app.callback();
    }
});
app.initialize(function() {
   iniciaDispositivo();
});
function iniciaDispositivo() {
    //$('#salida').append('Dispositivo listo<br>');
    if (esPG) {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        navigator.splashscreen.hide();
    }
    //$('#salida').append('Inicia conexión con Firebase<br>');
    baseDatos = new Firebase("https://bein.firebaseio.com/");
    //$('#salida').append('Variable baseDatos cargada<br>');
}
function capturePhoto(obj) {
    var pagina =$(obj).parentsUntil('.pagina').parent().attr('id');
    //$('#'+pagina+' .salida').append('Iniciando captura en '+pagina+'<br>');
    navigator.camera.getPicture(function(imageData){
        $('#tomarFotoDialogo').popup('close');
        //$('#'+pagina+' .salida').append('Foto capturada en '+pagina+'<br>');
        var fotosBD = baseDatos.child(pagina);
        fotosBD.push({
            fotoData:   imageData,
            tipo:       'data'
        });
    }, function(mensaje){
        //$('#'+pagina+' .salida').append('Fallo debido a '+mensaje+'<br>');
    }, {quality: 50, destinationType: destinationType.DATA_URL});
}
function getPhoto(obj, source) {
    var pagina =$(obj).parentsUntil('.pagina').parent().attr('id');
    //$('#'+pagina+' .salida').append('Iniciando captura desde galería en '+pagina+'<br>');
    navigator.camera.getPicture(function(imageURI){
        $('#tomarFotoDialogo').popup('close');
        //$('#'+pagina+' .salida').append('Foto de galería en '+pagina+'<br>');
        var fotosBD = baseDatos.child(pagina);
        fotosBD.push({
            fotoData:   imageURI,
            tipo:       'uri'
        });
    }, function(mensaje){
        //$('#'+pagina+' .salida').append('Fallo debido a '+mensaje+'<br>');
    }, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: source});
}
function iniciaBaseDatos(pagina) {
    var fotosBD = baseDatos.child(pagina);
    $('#'+pagina+' .salida').html('<i class="fa fa-spinner fa-spin"></i> Cargando '+pagina+' en Mi Armario.<br>Espera un momento...');
    // La función de captura de carga de nuevas imágenes
    fotosBD.on('value',function(captura){
        $('#'+pagina+' .salida').append('Evento value. Nuevas fotos<br>');
        var enlace1 = '<a href="#';
        var enlace2 = '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="';
        var enlace3 = '"></a></div>';
        var popUpModal1 = '<div data-role="popup" id="';
        var popUpModal2 = '" data-overlay-theme="b" data-theme="b" data-corners="false"><a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Cerrar</a><img class="popphoto" src="';
        var popUpModal3 = '"></div>';
        var columna = true;
        var celda1 = '<div class="ui-block-';
        var celda2, enlaceTotal, popUpModalTotal;
        $('#'+pagina+' .contFotos').html('');
        $('#'+pagina+' .popUpModales').html('');
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
            $('#'+pagina+' .contFotos').append(enlaceTotal);
            $('#'+pagina+' .popUpModales').append(popUpModalTotal);
            $('#'+pagina+' .popUpModales #'+nombreFoto).popup();
            columna = !columna;
        });
        $('#'+pagina+' .salida').html('');
    });
}
/* */
$(function(){
    $('#camisas').on('pagecreate', function(){
        $('#tomarFotoDialogo').on("popupafteropen", function(event,ui){
            var anchoPant = $(document).innerWidth();
            var anchoPopup = Math.floor(anchoPant*0.9);
            var margenIzq = Math.floor((anchoPant-anchoPopup)/2);
            //console.log(anchoPant, anchoPopup, margenIzq);
            $(this).width(anchoPopup);
        	$('#tomarFotoDialogo-popup').css('left', margenIzq+"px");
        });
    });
    $('.pagina').on('pagecreate', function(){
        $('.listaRopa').owlCarousel({
            singleItem: true
        });
    });
    $('#cuerpos').on('pagecreate', function(){
        $('.listaCuerpos').owlCarousel({
            singleItem: true,
            afterAction : cambiaCuerpo
        });
    });
    $('.pagina').on('pageshow', function(event,ui){
        var nomPagina = $(this).attr('id');
        iniciaBaseDatos(nomPagina);
        $('#headerGeneral h1').html(nomPagina);
        $('.ui-content h2 span').html(cuerpoUsuaria);
    });
    function cambiaCuerpo() {
        numCuerpo = this.owl.currentItem;
    }
    $('.seleccionCuerpo').click(function(){
        cuerpoUsuaria = $('.listaCuerpos .owl-wrapper div:nth-of-type('+(numCuerpo+1)+') p').html();
    });
    //$('#inicio').on('pageshow', function(){
        //console.log('Inicia weather');
        var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        var hoy = new Date();
        var hora = (hoy.getHours() > 12) ? (hoy.getHours()-12)+':'+dosDigitos(hoy.getMinutes())+'<span>pm</span>' : hoy.getHours()+':'+dosDigitos(hoy.getMinutes())+'<span>am</span>';
        var fecha = dias[hoy.getDay()]+', '+hoy.getDate()+' de '+ meses[hoy.getMonth()]+' de '+hoy.getFullYear();
        $.simpleWeather({
            location: 'Bogotá, CO',
            woeid: '',
            unit: 'c',
            success: function(weather) {
              var html = '<div id="hora">'+hora+'</div>';
              html += '<div id="clima"><i class="icon-'+weather.code+'"></i><h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2></div>';
              html += '<div id="fecha">'+fecha+'</div>';
              $("#weather").html(html);
            },
            error: function(error) {
              $("#weather").html('<p>'+error+'</p>');
            }
        });
        $('#saludo').html('¡Hola '+nombreUsuaria.substr(0,nombreUsuaria.indexOf(' '))+'!');
        var fotoUsuaria = new Firebase('https://bein.firebaseio.com/perfil');
        fotoUsuaria.on('value', function(captura){
            var datos = captura.val();
            rutaFotoUsuaria = datos.fotoData;
            $('#rostro').html('<img src="'+rutaFotoUsuaria+'">');
            //console.log('url(\''+datos.fotoData+'\')');
            //$('#inicio .ui-content:before').css('background-image', datos.fotoData);
        });
    //});
    $('#configuracion').on('pageshow', function(){
        $('#configuracion #rostro').html('<a href="#tomarFotoDialogo" data-rel="popup" data-position-to="window" data-transition="pop"><img src="'+rutaFotoUsuaria+'"></a>');
    });
});
function dosDigitos(num) {
    var salida;
    if (num<10) {
        salida = '0'+num;
    } else {
        salida = num;
    }
    return salida;
}