
# SnapFilter: Real-Time Photo and Camera Filter Application

SnapFilter is an interactive web application that allows you to apply a variety of filters to your images. Built with modern, framework-less web technologies, it leverages the power of **OpenCV.js** for high-performance, in-browser image processing.

You can either upload an image from your device or use your camera for real-time filtering, with a seamless and intuitive user interface.

## Features

*   **Dual Mode:** Choose between uploading a static image or using your live camera feed.
*   **Real-Time Filtering:** See the effects of filters applied instantly as you adjust the controls.
*   **Comprehensive Filter Library:**
    *   **Box Blur:** Apply a simple, fast blur effect.
    *   **Gaussian Blur:** Create a smoother, more natural blur with adjustable sigma values.
    *   **Sharpen:** Enhance the details and edges in your image.
    *   **Grayscale:** Convert your image to black and white.
    *   **Edge Detection:** Highlight the edges in your image using either the **Sobel** or **Canny** algorithms.
*   **Adjustable Controls:** Fine-tune filter parameters with intuitive sliders and radio buttons.
*   **Download Your Creations:** Save your filtered images directly to your device.
*   **Modern UI:** A sleek, dark-mode interface built with Tailwind CSS for a polished user experience.

## How to Run the Application

This project consists of static HTML, CSS, and JavaScript files and does not require a complex build process. You can run it locally using any simple HTTP server.

### Using Python's HTTP Server

If you have Python installed, you can easily start a server from the project's root directory.

1.  **Navigate to the project's root directory** in your terminal.

2.  **Start the HTTP server:**

    *If you are using Python 3:*
    ```bash
    python3 -m http.server
    ```

    *If you are using Python 2:*
    ```bash
    python -m SimpleHTTPServer
    ```

3.  **Open the application in your browser:**
    Navigate to `http://localhost:8000`.

Now you can use the SnapFilter application.
