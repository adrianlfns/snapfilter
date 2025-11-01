# Photo Filter Application Blueprint

## Overview

This document outlines the plan for creating a web-based photo filter application named **SnapFilter**. The application will allow users to apply various filters to images from a file upload or a real-time camera feed using the OpenCV.js library.

## Project Structure

The project follows a simple structure to keep the code organized:

*   `src/`: A directory containing all the source files.
    *   `index.html`: The main entry point of the application.
    *   `upload.html`: The page for uploading and filtering images.
    *   `camera.html`: The page for real-time camera filtering.
    *   `js/`: Contains the JavaScript files.
        *   `upload.js`: Logic for the image upload page.
        *   `camera.js`: Logic for the real-time camera page.
        *   `cv.js`: The OpenCV.js library.
        *   `utils.js`: Utility functions for OpenCV.
        *   `filters.js`: Contains the core filter logic.
    *   `css/`: Contains the stylesheets.
        *   `style.css`: Custom styles for the application.
*   `blueprint.md`: This file, documenting the project.
*   `README.md`: General information about the project.

## Style and Design

*   **Layout:** A two-column layout where filter controls are on the left and the image/video previews are on the right.
*   **Color Palette:** A vibrant and modern color palette with dark-mode aesthetics, using gradients and highlights to create a visually engaging experience.
*   **Typography:** Expressive and clear fonts to establish a strong visual hierarchy.
*   **User Experience:** The application is highly interactive and easy to use, with real-time feedback on all user actions. Filter controls are designed to be intuitive.
*   **Standardization:** A standardized and modular approach is taken for adding new filters, ensuring consistency in both UI and code structure.

### Features

*   **Image Upload:** Users can upload an image from their local machine and download the filtered result.
*   **Real-time Camera Filtering:** Users can use their camera to apply filters in real-time.
*   **Filter Selection:** A selection of filters is available, including Box Blur, Gaussian Blur, Sharpen, Grayscale, and Edge Detection.
*   **Adjustable Filters:** Filters have parameters that can be adjusted by the user in real-time.
*   **Real-time Preview:** The filtered image or video feed is displayed in real-time.

## Current Plan: Add Cartoon Effect Filter

I will now add a creative **Cartoon Effect** filter to the application. This will be a new, configurable filter that gives images a stylized, cartoonish appearance.

1.  **Update `filters.js`:**
    *   Implement an `applyCartoonEffect` function. This will use a combination of bilateral filtering (to smooth colors while preserving edges) and adaptive thresholding (to create sharp outlines).
2.  **Update HTML:** Add a new "Creative Filters" section to `upload.html` and `camera.html` with a checkbox to enable the cartoon effect and sliders for its parameters (diameter, sigma color, sigma space).
3.  **Update JavaScript Logic:** Modify `upload.js` and `camera.js` to incorporate the new filter. The cartoon effect will be mutually exclusive with the existing filters to prevent conflicts.
