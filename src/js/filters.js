window.snapFilters = {
    /**
     * Applies a box blur to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The size of the blur kernel.
     */
    applyBoxBlur: function(src, dst, kernelSize) {
        //builds a kernel size 3 by 3 or 5 by 5, etc. Depending on the variable kernelSize.
        let ksize = new cv.Size(kernelSize, kernelSize);

        //convenient method in opencv for box blur 
        cv.blur(src, dst, ksize, new cv.Point(-1, -1), cv.BORDER_DEFAULT);
    },

    /**
     * Applies a Gaussian blur to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - The size of the blur kernel.
     * @param {number} sigmaX - The standard deviation in the X direction.
     * @param {number} sigmaY - The standard deviation in the Y direction.
     */
    applyGaussianBlur: function(src, dst, kernelSize, sigmaX, sigmaY) {

        //builds a kernel size 3 by 3 or 5 by 5, etc. Depending on the variable kernelSize.
        let ksize = new cv.Size(kernelSize, kernelSize);

        //convenient method in opencv for gaussianBlur
        cv.GaussianBlur(src, dst, ksize, sigmaX, sigmaY, cv.BORDER_DEFAULT);
    },

    /**
     * Sharpens the image by adding a weighted version of the high-pass filtered image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} intensity - The intensity of the sharpening effect.
     */
    applySharpen: function(src, dst, intensity) {
        
        let blurred = new cv.Mat();
        let ksize = new cv.Size(5, 5);
        cv.GaussianBlur(src, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);

        let diff = new cv.Mat();
        cv.subtract(src, blurred, diff);

        cv.addWeighted(src, 1.0, diff, intensity, 0, dst);

        blurred.delete();
        diff.delete();
    },

    /**
     * Converts the image to grayscale.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     */
    applyGrayscale: function(src, dst) {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    },

    /**
     * Applies an emboss effect to the image.
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
     * Applies the Sobel edge detection algorithm to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {string} direction - The direction for the Sobel operator ('x', 'y', or 'both').
     */
    applySobel: function(src, dst, direction) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        let grad_x = new cv.Mat();
        let grad_y = new cv.Mat();
        let abs_grad_x = new cv.Mat();
        let abs_grad_y = new cv.Mat();

        if (direction === 'x' || direction === 'both') {
            cv.Sobel(gray, grad_x, cv.CV_16S, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
            cv.convertScaleAbs(grad_x, abs_grad_x);
        }

        if (direction === 'y' || direction === 'both') {
            cv.Sobel(gray, grad_y, cv.CV_16S, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
            cv.convertScaleAbs(grad_y, abs_grad_y);
        }

        if (direction === 'x') {
            cv.cvtColor(abs_grad_x, dst, cv.COLOR_GRAY2RGBA);
        } else if (direction === 'y') {
            cv.cvtColor(abs_grad_y, dst, cv.COLOR_GRAY2RGBA);
        } else {
            cv.addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dst);
            cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
        }

        gray.delete();
        grad_x.delete();
        grad_y.delete();
        abs_grad_x.delete();
        abs_grad_y.delete();
    },

    /**
     * Applies the Canny edge detection algorithm to the image.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} threshold1 - The first threshold for the hysteresis procedure.
     * @param {number} threshold2 - The second threshold for the hysteresis procedure.
     */
    applyCanny: function(src, dst, threshold1, threshold2) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.Canny(gray, dst, threshold1, threshold2);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
        gray.delete();
    },

    /**
     * Creates a pencil sketch effect using a robust, manual implementation.
     * @param {cv.Mat} src - The source image (cv.Mat).
     * @param {cv.Mat} dst - The destination image (cv.Mat).
     * @param {number} kernelSize - Not directly used, but kept for signature consistency.
     * @param {number} sigmaSpace - Controls the blur radius, which dictates the sketch's thickness.
     * @param {number} sigmaColor - Not directly used, but kept for signature consistency.
     */
    applyPencilSketch: function(src, dst, kernelSize, sigmaSpace, sigmaColor) {
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        let inverted = new cv.Mat();
        cv.bitwise_not(gray, inverted);

        let blurred = new cv.Mat();
        // The kernel size for GaussianBlur must be odd.
        let ksize = Math.floor(sigmaSpace / 2) * 2 + 1;
        if (ksize < 3) ksize = 3; // Ensure a minimum blur.
        cv.GaussianBlur(inverted, blurred, new cv.Size(ksize, ksize), 0, 0, cv.BORDER_DEFAULT);

        // Implement Color Dodge blend mode by dividing the grayscale image by the inverted-and-blurred image.
        let sketch = new cv.Mat();
        cv.divide(gray, blurred, sketch, 255.0);

        // Convert the single-channel sketch back to a 4-channel RGBA image for display.
        cv.cvtColor(sketch, dst, cv.COLOR_GRAY2RGBA);

        // Clean up intermediate Mats to prevent memory leaks.
        gray.delete();
        inverted.delete();
        blurred.delete();
        sketch.delete();
    }
};