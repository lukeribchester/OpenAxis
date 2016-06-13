// Temporary non-dynamic function for updating images
var image_front_overview = new Image();
var image_rear_overview = new Image();
var image_front = new Image();
var image_rear = new Image();
image_front_overview.src = "http://root:password123@192.168.1.12/axis-cgi/jpg/image.cgi?resolution=1024x768&camera=4&textstring=&";
image_rear_overview.src = "http://root:password123@192.168.1.15/axis-cgi/jpg/image.cgi?resolution=1024x768&textstring=&";
image_front.src = "http://root:password123@192.168.1.12/axis-cgi/jpg/image.cgi?resolution=1024x768&camera=4&";
image_rear.src = "http://root:password123@192.168.1.15/axis-cgi/jpg/image.cgi?resolution=1024x768&";

(function load_image() {
    if (image_front_overview.complete && image_rear_overview.complete) {
        document.getElementById('openaxis-frontcamera-overview').src = image_front_overview.src;
        document.getElementById('openaxis-rearcamera-overview').src = image_rear_overview.src;
        image_front_overview = new Image();
        image_rear_overview = new Image();
        image_front_overview.src = "http://root:password123@192.168.1.12/axis-cgi/jpg/image.cgi?resolution=1024x768&camera=4&textstring=&" +
            new Date().getTime();
        image_rear_overview.src = "http://root:password123@192.168.1.15/axis-cgi/jpg/image.cgi?resolution=1024x768&textstring=&" +
            new Date().getTime();
    }
    if (image_front.complete && image_rear.complete) {
        document.getElementById('openaxis-frontcamera').src = image_front.src;
        document.getElementById('openaxis-rearcamera').src = image_rear.src;
        image_front = new Image();
        image_rear = new Image();
        image_front.src = "http://root:password123@192.168.1.12/axis-cgi/jpg/image.cgi?resolution=1024x768&camera=4&" +
            new Date().getTime();
        image_rear.src = "http://root:password123@192.168.1.15/axis-cgi/jpg/image.cgi?resolution=1024x768&" +
            new Date().getTime();
    }

    setTimeout(load_image, 1000);
})();
