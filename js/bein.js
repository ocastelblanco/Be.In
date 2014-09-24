$(function(){
    $('#tomarFoto').click(function(){
        console.log("Clic en botón de capturar");
        navigator.device.capture.captureImage(captureSuccess, captureError);
        $(this).after('<img id="fotoCapturada">');
    });
});
var captureSuccess = function(mediaFiles) {
    var path = mediaFiles[0].fullPath;
    $('#fotoCapturada').attr('src',path);
};
var captureError = function(error) {
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    console.log('Error code: ' + error.code, null, 'Capture Error');
};