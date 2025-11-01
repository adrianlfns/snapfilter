window.snapFilters = {
  applyBoxBlur: function(src, dst, kernelSize) {
    let ksize = kernelSize;
    if (ksize > 1) {
      if (ksize % 2 === 0) {
        ksize++;
      }
      let kernel = new cv.Size(ksize, ksize);
      cv.blur(src, dst, kernel, new cv.Point(-1, -1), cv.BORDER_DEFAULT);
    } else {
      src.copyTo(dst);
    }
  },
  applyGaussianBlur: function(src, dst, kernelSize, sigmaX, sigmaY) {
    let ksize = kernelSize;
    if (ksize > 1) {
      if (ksize % 2 === 0) {
        ksize++;
      }
      let kernel = new cv.Size(ksize, ksize);
      cv.GaussianBlur(src, dst, kernel, sigmaX, sigmaY, cv.BORDER_DEFAULT);
    } else {
      src.copyTo(dst);
    }
  },
  applySharpen: function(src, dst, intensity) {
    let centerValue = 4 + intensity;
    let kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [0, -1, 0, -1, centerValue, -1, 0, -1, 0]);
    cv.filter2D(src, dst, -1, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT);
    kernel.delete();
  },
  applySobel: function(src, dst, direction) {
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let grad = new cv.Mat();
    let dx = direction === 'x' ? 1 : 0;
    let dy = direction === 'y' ? 1 : 0;
    cv.Sobel(gray, grad, cv.CV_8U, dx, dy, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.cvtColor(grad, dst, cv.COLOR_GRAY2RGBA);
    gray.delete();
    grad.delete();
  },
  applyCanny: function(src, dst, threshold1, threshold2) {
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let edges = new cv.Mat();
    cv.Canny(gray, edges, threshold1, threshold2, 3, false);
    cv.cvtColor(edges, dst, cv.COLOR_GRAY2RGBA);
    gray.delete();
    edges.delete();
  },
  applyGrayscale: function(src, dst) {
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
  }
};
