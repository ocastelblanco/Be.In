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
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            $('#fotoCapturada').append('<img src="'+path+'" >')
            console.log(path);
        }
    };
    var captureError = function(error) {
        console.log('Error code: ' + error.code, null, 'Capture Error');
    };
    function onSuccess(imageURI) {
        var image = document.getElementById('fotoCapturada');
        image.src = imageURI;
    }
    function onFail(message) {
        console.log('Failed because: ' + message);
    }
});

$("#inicial").on("pagecreate", function(event, ui){
    console.log("Listo para capturar");
});
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    // Wait for device API libraries to load
    document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }
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
    // A button will call this function
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType.DATA_URL });
    }
    // A button will call this function
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: source });
    }

    // Called if something bad happens.
    function onFail(message) {
        console.log('Failed because: ' + message);
      alert('Failed because: ' + message);
    }