let inputElement = document.getElementById('fileInput');
let canvasInput = document.getElementById('canvasInput');
let canvasOutput = document.getElementById('canvasOutput');
let ctxInput = canvasInput.getContext('2d');
let downloadBtn = document.getElementById('downloadBtn');

// Filter controls
let blurEnable = document.getElementById('blur-enable');
let blurKernelSlider = document.getElementById('blur-kernel-size');
let blurKernelValue = document.getElementById('blur-kernel-value');

let gaussianBlurEnable = document.getElementById('gaussian-blur-enable');
let gaussianBlurKernelSlider = document.getElementById('gaussian-blur-kernel-size');
let gaussianBlurKernelValue = document.getElementById('gaussian-blur-kernel-value');
let gaussianBlurSigmaXSlider = document.getElementById('gaussian-blur-sigma-x');
let gaussianBlurSigmaXValue = document.getElementById('gaussian-blur-sigma-x-value');
let gaussianBlurSigmaYSlider = document.getElementById('gaussian-blur-sigma-y');
let gaussianBlurSigmaYValue = document.getElementById('gaussian-blur-sigma-y-value');

let sharpenEnable = document.getElementById('sharpen-enable');
let sharpenIntensitySlider = document.getElementById('sharpen-intensity');
let sharpenIntensityValue = document.getElementById('sharpen-intensity-value');

let grayscaleEnable = document.getElementById('grayscale-enable');

// Edge Detection Controls
let edgeEnable = document.getElementById('edge-enable');
let edgeControls = document.getElementById('edge-controls');
let sobelControls = document.getElementById('sobel-controls');
let cannyControls = document.getElementById('canny-controls');
let edgeMethodRadios = document.querySelectorAll('input[name="edge-method"]');
let sobelDirectionRadios = document.querySelectorAll('input[name="sobel-direction"]');
let cannyThreshold1Slider = document.getElementById('canny-threshold1');
let cannyThreshold1Value = document.getElementById('canny-threshold1-value');
let cannyThreshold2Slider = document.getElementById('canny-threshold2');
let cannyThreshold2Value = document.getElementById('canny-threshold2-value');

function startApp() {
    console.log('OpenCV Ready for Upload');

    // Initial UI state
    blurKernelSlider.style.opacity = blurEnable.checked ? '1' : '0.5';
    gaussianBlurKernelSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    gaussianBlurSigmaXSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    gaussianBlurSigmaYSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    sharpenIntensitySlider.style.opacity = sharpenEnable.checked ? '1' : '0.5';
    edgeControls.style.display = edgeEnable.checked ? 'block' : 'none';


    function applyFilters() {
        if (!canvasInput.width || !canvasInput.height) {
            return;
        }

        let src = cv.imread(canvasInput);
        let dst = new cv.Mat();

        let blurred = new cv.Mat();
        let processed = new cv.Mat();

        // 1. Apply blur if enabled
        if (blurEnable.checked) {
            let kernelSize = parseInt(blurKernelSlider.value);
            window.snapFilters.applyBoxBlur(src, blurred, kernelSize);
        } else if (gaussianBlurEnable.checked) {
            let kernelSize = parseInt(gaussianBlurKernelSlider.value);
            let sigmaX = parseFloat(gaussianBlurSigmaXSlider.value);
            let sigmaY = parseFloat(gaussianBlurSigmaYSlider.value);
            window.snapFilters.applyGaussianBlur(src, blurred, kernelSize, sigmaX, sigmaY);
        } else {
            src.copyTo(blurred);
        }

        // 2. Apply either edge detection or sharpen to the (potentially) blurred image
        if (edgeEnable.checked) {
            const edgeMethod = document.querySelector('input[name="edge-method"]:checked').value;
            if (edgeMethod === 'sobel') {
                const sobelDirection = document.querySelector('input[name="sobel-direction"]:checked').value;
                window.snapFilters.applySobel(blurred, processed, sobelDirection);
            } else if (edgeMethod === 'canny') {
                const threshold1 = parseInt(cannyThreshold1Slider.value);
                const threshold2 = parseInt(cannyThreshold2Slider.value);
                window.snapFilters.applyCanny(blurred, processed, threshold1, threshold2);
            }
        } else if (sharpenEnable.checked) {
            window.snapFilters.applySharpen(blurred, processed, parseFloat(sharpenIntensitySlider.value));
        } else {
            blurred.copyTo(processed);
        }

        // 3. Apply grayscale if enabled
        if (grayscaleEnable.checked) {
            let temp = new cv.Mat();
            window.snapFilters.applyGrayscale(processed, temp);
            // If edge detection was not used, convert back to RGBA for consistency
            if (!edgeEnable.checked) {
                cv.cvtColor(temp, dst, cv.COLOR_GRAY2RGBA);
            } else {
                temp.copyTo(dst);
            }
            temp.delete();
        } else {
            processed.copyTo(dst);
        }


        cv.imshow('canvasOutput', dst);
        src.delete();
        blurred.delete();
        processed.delete();
        dst.delete();
    }

    inputElement.addEventListener('change', (e) => {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                canvasInput.width = img.width;
                canvasInput.height = img.height;
                canvasOutput.width = img.width;
                canvasOutput.height = img.height;
                ctxInput.drawImage(img, 0, 0, img.width, img.height);
                applyFilters();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }, false);

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'filtered-image.png';
        link.href = canvasOutput.toDataURL();
        link.click();
    });

    const allFilters = [blurEnable, gaussianBlurEnable, sharpenEnable, edgeEnable, grayscaleEnable];

    function setMutualExclusivity(enabledFilter) {
        allFilters.forEach(filter => {
            if (filter !== enabledFilter) {
                filter.checked = false;
                filter.dispatchEvent(new Event('change'));
            }
        });
    }

    blurEnable.addEventListener('change', () => {
        if (blurEnable.checked) setMutualExclusivity(blurEnable);
        blurKernelSlider.style.opacity = blurEnable.checked ? '1' : '0.5';
        applyFilters();
    });

    blurKernelSlider.addEventListener('input', () => {
        if (!blurEnable.checked) {
            blurEnable.checked = true;
            blurEnable.dispatchEvent(new Event('change'));
        }
        let kernelSize = parseInt(blurKernelSlider.value);
        let displayKernel = kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize;
        blurKernelValue.textContent = `${displayKernel}x${displayKernel}`;
        applyFilters();
    });

    gaussianBlurEnable.addEventListener('change', () => {
        if (gaussianBlurEnable.checked) setMutualExclusivity(gaussianBlurEnable);
        const opacity = gaussianBlurEnable.checked ? '1' : '0.5';
        gaussianBlurKernelSlider.style.opacity = opacity;
        gaussianBlurSigmaXSlider.style.opacity = opacity;
        gaussianBlurSigmaYSlider.style.opacity = opacity;
        applyFilters();
    });

    gaussianBlurKernelSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        let kernelSize = parseInt(gaussianBlurKernelSlider.value);
        let displayKernel = kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize;
        gaussianBlurKernelValue.textContent = `${displayKernel}x${displayKernel}`;
        applyFilters();
    });

    gaussianBlurSigmaXSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        gaussianBlurSigmaXValue.textContent = parseFloat(gaussianBlurSigmaXSlider.value).toFixed(1);
        applyFilters();
    });

    gaussianBlurSigmaYSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        gaussianBlurSigmaYValue.textContent = parseFloat(gaussianBlurSigmaYSlider.value).toFixed(1);
        applyFilters();
    });

    sharpenEnable.addEventListener('change', () => {
        if (sharpenEnable.checked) setMutualExclusivity(sharpenEnable);
        sharpenIntensitySlider.style.opacity = sharpenEnable.checked ? '1' : '0.5';
        applyFilters();
    });

    sharpenIntensitySlider.addEventListener('input', () => {
        if (!sharpenEnable.checked) {
            sharpenEnable.checked = true;
            sharpenEnable.dispatchEvent(new Event('change'));
        }
        sharpenIntensityValue.textContent = parseFloat(sharpenIntensitySlider.value).toFixed(1);
        applyFilters();
    });

    grayscaleEnable.addEventListener('change', () => {
        if (grayscaleEnable.checked) setMutualExclusivity(grayscaleEnable);
        applyFilters();
    });

    // --- Edge Detection Event Listeners ---

    edgeEnable.addEventListener('change', () => {
        if (edgeEnable.checked) setMutualExclusivity(edgeEnable);
        edgeControls.style.display = edgeEnable.checked ? 'block' : 'none';
        applyFilters();
    });

    edgeMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const sobelVisible = document.getElementById('edge-method-sobel').checked;
            sobelControls.style.display = sobelVisible ? 'block' : 'none';
            cannyControls.style.display = sobelVisible ? 'none' : 'block';
            applyFilters();
        });
    });

    sobelDirectionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            applyFilters();
        });
    });

    cannyThreshold1Slider.addEventListener('input', () => {
        cannyThreshold1Value.textContent = cannyThreshold1Slider.value;
        applyFilters();
    });

    cannyThreshold2Slider.addEventListener('input', () => {
        cannyThreshold2Value.textContent = cannyThreshold2Slider.value;
        applyFilters();
    });

    // Trigger change to set initial visibility of controls
    document.getElementById('edge-method-sobel').dispatchEvent(new Event('change'));
}


(function() {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.onload = () => {
        cv.onRuntimeInitialized = () => {
            startApp();
        };
    };
    document.head.appendChild(script);
})();