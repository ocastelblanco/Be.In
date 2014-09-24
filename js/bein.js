$(function(){
    $('#tomarFoto').click(function(){
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
};