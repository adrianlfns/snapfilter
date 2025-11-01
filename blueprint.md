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
*   **Pencil Sketch:** Creates a pencil sketch effect using `cv.pencilSketch`. Kernel size (mapped to shade factor), sigma space, and sigma color are adjustable.
*   **Edge Detection:** Detects edges using either the Sobel or Canny method. Sobel direction and Canny thresholds are adjustable.

## Project Status

**Stable.** The core functionality for both image upload and real-time camera filtering is complete and robust. The persistent "Bad size of input mat" error in the camera module has been definitively resolved by re-architecting the video processing pipeline to handle dynamic video dimension changes safely and efficiently.