# SnapFilter - Real-Time Image & Camera Filtering

<p align="center">
  <img src="src/images/logo.svg" alt="SnapFilter Logo" width="200">
</p>

SnapFilter is a modern, framework-less web application that allows you to apply a variety of powerful visual filters to both static images and your live camera feed in real-time.



## Key Features

-   **Dual Mode:** Choose between uploading a static image or using your live camera for filtering.
-   **Real-Time Previews:** See the original and filtered images side-by-side instantly.
-   **Adjustable Filters:** Fine-tune filter parameters with intuitive sliders and controls for the perfect look.
-   **Downloadable Results:** Save your filtered images directly from the upload page.
-   **Modern & Responsive:** Built with modern, framework-less web technologies (HTML, CSS, JavaScript) for a fast and responsive experience on any device.
-   **Advanced Image Processing:** Powered by the robust OpenCV.js library for high-performance computer vision tasks.

## Available Filters

-   **Box Blur:** Applies a simple and fast blur effect. The kernel size is adjustable.
-   **Gaussian Blur:** A smoother, more natural-looking blur. Kernel size, sigma X, and sigma Y are adjustable.
-   **Sharpen:** Enhances the details and edges in your image. The intensity is adjustable.
-   **Grayscale:** Converts your image to classic black and white.
-   **Emboss:** Creates a stylized 3D embossed effect.
-   **Pencil Sketch:** Transforms your image into a hand-drawn artistic sketch. The effect can be fine-tuned by adjusting kernel size, sigma space, and sigma color.
-   **Edge Detection:** Highlights the edges in your image using the **Sobel** or **Canny** algorithms. Sobel direction and Canny thresholds are fully adjustable.

## Setup and Installation

This project is designed to be run directly in a browser without any build steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/google-gemini/snapfilter-ai-codemate.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd snapfilter-ai-codemate
    ```
3.  **Run a local server:**
    For the live camera feature to work, you need to serve the files from a local web server due to browser security policies. A simple way to do this is with Python.
    ```bash
    python -m http.server
    ```
4.  **Open in browser:**
    Navigate to `http://localhost:8000` in your web browser.

## How To Use

### For Static Images
1.  Navigate to the **Upload Page**.
2.  Click "Select Image" to upload an image from your device.
3.  Use the checkboxes and sliders to select and adjust a filter.
4.  Click "Download Image" to save your creation.

### For Live Camera
1.  Navigate to the **Camera Page**.
2.  Grant the browser permission to access your camera.
3.  Your live feed will appear on the left, and the filtered feed on the right.
4.  Select and adjust the filters to see the effect in real-time.

## Built With

-   **HTML5**
-   **Tailwind CSS**
-   **JavaScript (ES6+)**
-   **OpenCV.js** - For all image processing and computer vision operations.

## Development Process

This project was built iteratively in **Firebase Studio**, a cloud-based IDE powered by Google's Gemini AI models.

The development process involved a conversational workflow:
1.  Describing a desired feature or bug fix in plain English.
2.  The AI generating the necessary code (HTML, CSS, JavaScript).
3.  Testing the result in a live preview environment.
4.  Providing feedback to the AI to refine and iterate until the feature was complete and correct.

This approach facilitated rapid prototyping and development, demonstrating a modern AI-assisted workflow for building web applications.


## Reflection on using vibe coding tools

For effective vibe coding, clear and explicit instructions are critical. Ambiguous prompts will inevitably increase the number of iterative refinements required.

## Screnshots

### Upload Image Part 1
![Upload Image Part 1](/assets/screenshots/UploadImage_Part1.gif "Upload Image Part 1")

### Upload Image Part 2
![Upload Image Part 2](/assets/screenshots/UploadImage_Part2.gif "Upload Image Part 2")

### Live Camera Feed Part 1
![Live Camera Feed Part 1](/assets/screenshots/RealTimeCamera_Part1.gif "Upload Image Part 1")


### Live Camera Feed Part 2
![Live Camera Feed Part 2](/assets/screenshots/RealTimeCamera_Part2.gif "Upload Image Part 2")


## Demo app

https://adrianlfns.github.io/snapfilter/
