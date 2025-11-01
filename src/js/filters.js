/**
 * @file A library of image filtering functions using OpenCV.js.
 * @author Gemini
 */

/**
 * A collection of image filtering functions.
 * @namespace snapFilters
 */
window.snapFilters = {

    /**
     * Applies a simple box blur to an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The size of the blur kernel. Must be an odd number.
     */
    applyBoxBlur: function(src, dst, kernelSize) {
        let ksize = Math.max(1, kernelSize);
        if (ksize % 2 === 0) ksize++;
        let kernel = new cv.Size(ksize, ksize);
        cv.blur(src, dst, kernel, new cv.Point(-1, -1), cv.BORDER_DEFAULT);
    },

    /**
     * Applies a Gaussian blur to an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The size of the blur kernel. Must be an odd number.
     * @param {number} sigmaX - The standard deviation in the X direction.
     * @param {number} sigmaY - The standard deviation in the Y direction.
     */
    applyGaussianBlur: function(src, dst, kernelSize, sigmaX, sigmaY) {
        let ksize = Math.max(1, kernelSize);
        if (ksize % 2 === 0) ksize++;
        let kernel = new cv.Size(ksize, ksize);
        cv.GaussianBlur(src, dst, kernel, sigmaX, sigmaY, cv.BORDER_DEFAULT);
    },

    /**
     * Sharpens an image by enhancing edges.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} intensity - The intensity of the sharpening effect.
     */
    applySharpen: function(src, dst, intensity) {
        const centerValue = 4 + intensity;
        let kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [0, -1, 0, -1, centerValue, -1, 0, -1, 0]);
        cv.filter2D(src, dst, -1, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT);
        kernel.delete();
    },

    /**
     * Applies the Sobel operator to detect edges in an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {'x' | 'y'} direction - The direction of the edge detection ('x' for horizontal, 'y' for vertical).
     */
    applySobel: function(src, dst, direction) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let grad = new cv.Mat();
        const dx = direction === 'x' ? 1 : 0;
        const dy = direction === 'y' ? 1 : 0;
        cv.Sobel(gray, grad, cv.CV_8U, dx, dy, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.cvtColor(grad, dst, cv.COLOR_GRAY2RGBA); // Convert back to RGBA for display
        gray.delete();
        grad.delete();
    },

    /**
     * Applies the Canny edge detector to an image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} threshold1 - The first threshold for the hysteresis procedure.
     * @param {number} threshold2 - The second threshold for the hysteresis procedure.
     */
    applyCanny: function(src, dst, threshold1, threshold2) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let edges = new cv.Mat();
        cv.Canny(gray, edges, threshold1, threshold2, 3, false);
        cv.cvtColor(edges, dst, cv.COLOR_GRAY2RGBA); // Convert back to RGBA for display
        gray.delete();
        edges.delete();
    },

    /**
     * Converts an image to grayscale.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     */
    applyGrayscale: function(src, dst) {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    }
};