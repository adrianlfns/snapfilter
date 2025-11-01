# Project Blueprint

## Overview

This project is a web-based image filtering application called SnapFilter. It allows users to upload an image or use their live camera feed and apply various filters in real-time. The application is built using modern, framework-less web technologies, including HTML, CSS, and JavaScript, with OpenCV.js for image processing.

## Core Features

*   **Image Upload:** Users can upload an image and apply filters.
*   **Live Camera Feed:** Users can apply filters directly to their live camera stream.
*   **Real-time Filtering:** The application applies selected filters in real-time, displaying the filtered result alongside the original.
*   **Filter Controls:** Each filter has a set of controls (e.g., sliders, checkboxes) that allow users to adjust its parameters.
*   **Download:** Users can download the filtered image from the upload page.
*   **Responsive Design:** The application is designed to be responsive and work on both desktop and mobile devices.

## Implemented Filters

*   **Box Blur:** Applies a simple box blur. The kernel size is adjustable.
*   **Gaussian Blur:** Applies a Gaussian blur. Kernel size, sigma X, and sigma Y are adjustable.
*   **Sharpen:** Enhances edges in the image. The intensity is adjustable.
*   **Grayscale:** Converts the image to grayscale.
*   **Emboss:** Applies an emboss effect.
*   **Pencil Sketch:** Creates a pencil sketch effect using `cv.pencilSketch`. Kernel size is adjustable.
*   **Edge Detection:** Detects edges using either the Sobel or Canny method. Sobel direction and Canny thresholds are adjustable.

## Project Status

**Stable.** The core functionality for both image upload and real-time camera filtering is complete and robust. All styling issues with the reusable filter controls component have been definitively resolved. The camera initialization race condition has been fixed.

## Current Task: Fix Camera Initialization (Completed)

**Goal:** Resolve the "IndexSizeError: The source width is 0" error that occurs on `camera.html`.

**Problem:** The application was attempting to get the video's dimensions and start the image processing loop before the video stream had fully loaded its metadata. This created a race condition where the `<video>` element's width and height were 0, causing `getImageData` to fail.

**Solution:**

1.  **Use Correct Video Properties:** The `canplay` event listener in `src/js/camera.js` was modified to use `video.videoWidth` and `video.videoHeight`. These properties provide the intrinsic dimensions of the video, whereas `video.width` and `video.height` refer to the dimensions of the HTML element itself.
2.  **Add a Guard Clause:** A check (`if (width > 0 && height > 0)`) was added to ensure that the canvas dimensions are only set and the processing loop is only started *after* the video stream reports valid, non-zero dimensions.

**Result:** The race condition is eliminated. The application now waits for the camera stream to be fully initialized before attempting to process video frames, making the camera feature stable and error-free.