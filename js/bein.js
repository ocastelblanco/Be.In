$(function(){
    $('#tomarFoto').click(function(){
        console.log("Clic en botón de capturar");
        $(this).after('<div id="fotoCapturada"></div>');
        navigator.device.capture.captureImage(captureSuccess, captureError, {limit:2});
    });
    $('#tomarFoto2').click(function(){
        $(this).after('<img id="fotoCapturada">');
        console.log('Captura de foto2');
        navigator.camera.getPicture(onSuccess, onFail, { quality: 75, destinationType: Camera.DestinationType.FILE_URI });
    });
});
var captureSuccess = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        $('#fotoCapturada').append('<img src="'+path+'" >')
        console.log(path);
    }
};
var captureError = function(error) {
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    console.log('Error code: ' + error.code, null, 'Capture Error');
};
function onSuccess(imageURI) {
    var image = document.getElementById('fotoCapturada');
    image.src = imageURI;
}

function onFail(message) {
    console.log('Failed because: ' + message);
}