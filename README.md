# SnapFilter - Real-Time Image & Camera Filtering

SnapFilter is a modern, framework-less web application that allows you to apply a variety of powerful visual filters to both static images and your live camera feed in real-time.

![SnapFilter Application Screenshot](https://storage.googleapis.com/static.aifire.dev/assets/snapfilter.png)

## Key Features

- **Dual Mode:** Choose between uploading a static image or using your live camera for filtering.
- **Real-Time Previews:** See the original and filtered images side-by-side instantly.
- **Adjustable Filters:** Fine-tune filter parameters with intuitive sliders and controls for the perfect look.
- **Downloadable Results:** Save your filtered images directly from the upload page.
- **Modern & Responsive:** Built with modern, framework-less web technologies (HTML, CSS, JavaScript) for a fast and responsive experience on any device.
- **Advanced Image Processing:** Powered by the robust OpenCV.js library for high-performance computer vision tasks.

## Available Filters

- **Box Blur:** A simple and fast blur effect.
- **Gaussian Blur:** A smoother, more natural-looking blur.
- **Sharpen:** Enhances the details and edges in your image.
- **Grayscale:** Converts your image to classic black and white.
- **Emboss:** Creates a stylized 3D embossed effect.
- **Pencil Sketch:** Transforms your image into a hand-drawn artistic sketch.
- **Edge Detection:** Highlight the edges in your image using the **Sobel** or **Canny** algorithms.

## How To Use

### For Static Images
1.  Navigate to the **[Upload Page](src/upload.html)**.
2.  Click "Select Image" to upload an image from your device.
3.  Use the checkboxes and sliders to select and adjust a filter.
4.  Click "Download Image" to save your creation.

### For Live Camera
1.  Navigate to the **[Camera Page](src/camera.html)**.
2.  Grant the browser permission to access your camera.
3.  Your live feed will appear on the left, and the filtered feed on the right.
4.  Select and adjust the filters to see the effect in real-time.

## Built With

- **HTML5**
- **Tailwind CSS**
- **JavaScript (ES6+)**
- **OpenCV.js** - For all image processing and computer vision operations.

## Demo app

https://adrianlfns.github.io/snapfilter/
