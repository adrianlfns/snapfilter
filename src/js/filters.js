/**
 * @file filters.js
 * @description This file defines a globally accessible object `window.snapFilters` that contains
 * a collection of image filtering functions. These functions are designed to be used with OpenCV.js (cv).
 * Each function takes a source image (src) and a destination image (dst) as cv.Mat objects,
 * along with filter-specific parameters, and applies the corresponding visual effect.
 */

window.snapFilters = {
    /**
     * Applies a box blur to an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat) where the result will be stored.
     * @param {number} kernelSize - The side length of the square blur kernel. Must be an odd number.
     */
    applyBoxBlur: function(src, dst, kernelSize) {
        let ksize = new cv.Size(kernelSize, kernelSize);
        cv.blur(src, dst, ksize, new cv.Point(-1, -1), cv.BORDER_DEFAULT);
    },

    /**
     * Applies a Gaussian blur to an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The side length of the blur kernel. Must be an odd number.
     * @param {number} sigmaX - The standard deviation of the Gaussian kernel in the X direction.
     * @param {number} sigmaY - The standard deviation of the Gaussian kernel in the Y direction.
     */
    applyGaussianBlur: function(src, dst, kernelSize, sigmaX, sigmaY) {
        let ksize = new cv.Size(kernelSize, kernelSize);
        cv.GaussianBlur(src, dst, ksize, sigmaX, sigmaY, cv.BORDER_DEFAULT);
    },

    /**
     * Sharpens an image using the "unsharp masking" technique.
     * This method enhances edges by creating a detail mask from the original image and adding it to the source.
     * @param {cv.Mat} src - The source image to apply the sharpening to (e.g., a blurred image).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} intensity - A multiplier for the sharpening strength.
     * @param {cv.Mat} originalSrc - The original, pristine image, used to create the detail mask.
     */
    applySharpen: function(src, dst, intensity, originalSrc) {
        // Use the provided original image to create the detail mask. If not provided, fall back to the source.
        const imageForMask = originalSrc ? originalSrc : src;

        let blurred = new cv.Mat();
        let ksize = new cv.Size(5, 5); // Standard kernel for unsharp masking
        // Blur the original image to find the low-frequency components.
        cv.GaussianBlur(imageForMask, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);

        // Subtract the blurred image from the original to get the high-frequency details (the "mask").
        let diff = new cv.Mat();
        cv.subtract(imageForMask, blurred, diff);

        // Add the detail mask (weighted by intensity) to the source image (which could be pre-filtered).
        // This sharpens the src image.
        cv.addWeighted(src, 1.0, diff, intensity, 0, dst);

        // Clean up temporary matrices.
        blurred.delete();
        diff.delete();
    },

    /**
     * Converts a color image to grayscale.
     * @param {cv.Mat} src - The source RGBA image (cv.Mat).
     * @param {cv.Mat} dst - The destination grayscale image (cv.Mat).
     */
    applyGrayscale: function(src, dst) {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    },

    /**
     * Applies a 3D-like emboss effect to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     */
    applyEmboss: function(src, dst) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        let embossKernel = cv.matFromArray(3, 3, cv.CV_32F, [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
        cv.filter2D(gray, dst, cv.CV_8U, embossKernel);
        gray.delete();
        embossKernel.delete();
    },

    /**
     * Applies Sobel edge detection to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {string} direction - The direction for the Sobel operator ('x' for vertical, 'y' for horizontal).
     */
    applySobel: function(src, dst, direction) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        let grad_x = new cv.Mat();
        let grad_y = new cv.Mat();
        let abs_grad_x = new cv.Mat();
        let abs_grad_y = new cv.Mat();

        if (direction === 'x') {
            cv.Sobel(gray, grad_x, cv.CV_16S, 1, 0);
            cv.convertScaleAbs(grad_x, abs_grad_x);
            cv.cvtColor(abs_grad_x, dst, cv.COLOR_GRAY2RGBA);
        } else if (direction === 'y') {
            cv.Sobel(gray, grad_y, cv.CV_16S, 0, 1);
            cv.convertScaleAbs(grad_y, abs_grad_y);
            cv.cvtColor(abs_grad_y, dst, cv.COLOR_GRAY2RGBA);
        }

        gray.delete();
        grad_x.delete();
        grad_y.delete();
        abs_grad_x.delete();
        abs_grad_y.delete();
    },

    /**
     * Applies Canny edge detection.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} threshold1 - The first (lower) threshold for the hysteresis procedure.
     * @param {number} threshold2 - The second (higher) threshold for the hysteresis procedure.
     */
    applyCanny: function(src, dst, threshold1, threshold2) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.Canny(gray, dst, threshold1, threshold2);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
        gray.delete();
    },

    /**
     * Creates a pencil sketch effect.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The blur kernel size, which affects the thickness of the sketch lines.
     */
    applyPencilSketch: function(src, dst, kernelSize) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        let inverted = new cv.Mat();
        cv.bitwise_not(gray, inverted);
        let blurred = new cv.Mat();
        cv.GaussianBlur(inverted, blurred, new cv.Size(kernelSize, kernelSize), 0, 0, cv.BORDER_DEFAULT);
        let sketch = new cv.Mat();
        cv.divide(gray, blurred, sketch, 255.0);
        cv.cvtColor(sketch, dst, cv.COLOR_GRAY2RGBA);
        gray.delete();
        inverted.delete();
        blurred.delete();
        sketch.delete();
    }
};
