let video = document.getElementById('videoInput');
let canvasOutput = document.getElementById('canvasOutput');

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

// Cartoon Effect Controls
let cartoonEnable = document.getElementById('cartoon-enable');
let cartoonControls = document.getElementById('cartoon-controls');
let cartoonDiameterSlider = document.getElementById('cartoon-diameter');
let cartoonDiameterValue = document.getElementById('cartoon-diameter-value');
let cartoonSigmaColorSlider = document.getElementById('cartoon-sigma-color');
let cartoonSigmaColorValue = document.getElementById('cartoon-sigma-color-value');
let cartoonSigmaSpaceSlider = document.getElementById('cartoon-sigma-space');
let cartoonSigmaSpaceValue = document.getElementById('cartoon-sigma-space-value');

function startApp() {
    console.log('OpenCV Ready for Camera');

    // Initial UI state
    blurKernelSlider.style.opacity = blurEnable.checked ? '1' : '0.5';
    gaussianBlurKernelSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    gaussianBlurSigmaXSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    gaussianBlurSigmaYSlider.style.opacity = gaussianBlurEnable.checked ? '1' : '0.5';
    sharpenIntensitySlider.style.opacity = sharpenEnable.checked ? '1' : '0.5';
    edgeControls.style.display = edgeEnable.checked ? 'block' : 'none';
    cartoonControls.style.display = cartoonEnable.checked ? 'block' : 'none';

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;

    function processVideo() {
        try {
            if (!video.srcObject || video.readyState < 3) {
                setTimeout(processVideo, 1000 / FPS);
                return;
            }

            let begin = Date.now();
            cap.read(src);

            if (cartoonEnable.checked) {
                const diameter = parseInt(cartoonDiameterSlider.value);
                const sigmaColor = parseInt(cartoonSigmaColorSlider.value);
                const sigmaSpace = parseInt(cartoonSigmaSpaceSlider.value);
                window.snapFilters.applyCartoonEffect(src, dst, diameter, sigmaColor, sigmaSpace);
                cv.imshow('canvasOutput', dst);

            } else {

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
                blurred.delete();
                processed.delete();
            }


            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);

        } catch (err) {
            console.error(err);
            setTimeout(processVideo, 100); // Restart on error
        }
    };

    video.addEventListener('loadeddata', () => {
        src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        dst = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        canvasOutput.width = video.videoWidth;
        canvasOutput.height = video.videoHeight;
        setTimeout(processVideo, 0);
    });

    const allFilters = [blurEnable, gaussianBlurEnable, sharpenEnable, edgeEnable, grayscaleEnable, cartoonEnable];

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
    });

    blurKernelSlider.addEventListener('input', () => {
        if (!blurEnable.checked) {
            blurEnable.checked = true;
            blurEnable.dispatchEvent(new Event('change'));
        }
        let kernelSize = parseInt(blurKernelSlider.value);
        let displayKernel = kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize;
        blurKernelValue.textContent = `${displayKernel}x${displayKernel}`;
    });

    gaussianBlurEnable.addEventListener('change', () => {
        if (gaussianBlurEnable.checked) setMutualExclusivity(gaussianBlurEnable);
        const opacity = gaussianBlurEnable.checked ? '1' : '0.5';
        gaussianBlurKernelSlider.style.opacity = opacity;
        gaussianBlurSigmaXSlider.style.opacity = opacity;
        gaussianBlurSigmaYSlider.style.opacity = opacity;
    });

    gaussianBlurKernelSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        let kernelSize = parseInt(gaussianBlurKernelSlider.value);
        let displayKernel = kernelSize % 2 === 0 ? kernelSize + 1 : kernelSize;
        gaussianBlurKernelValue.textContent = `${displayKernel}x${displayKernel}`;
    });

    gaussianBlurSigmaXSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        gaussianBlurSigmaXValue.textContent = parseFloat(gaussianBlurSigmaXSlider.value).toFixed(1);
    });

    gaussianBlurSigmaYSlider.addEventListener('input', () => {
        if (!gaussianBlurEnable.checked) {
            gaussianBlurEnable.checked = true;
            gaussianBlurEnable.dispatchEvent(new Event('change'));
        }
        gaussianBlurSigmaYValue.textContent = parseFloat(gaussianBlurSigmaYSlider.value).toFixed(1);
    });

    sharpenEnable.addEventListener('change', () => {
        if (sharpenEnable.checked) setMutualExclusivity(sharpenEnable);
        sharpenIntensitySlider.style.opacity = sharpenEnable.checked ? '1' : '0.5';
    });

    sharpenIntensitySlider.addEventListener('input', () => {
        if (!sharpenEnable.checked) {
            sharpenEnable.checked = true;
            sharpenEnable.dispatchEvent(new Event('change'));
        }
        sharpenIntensityValue.textContent = parseFloat(sharpenIntensitySlider.value).toFixed(1);
    });
    
    grayscaleEnable.addEventListener('change', () => {
        if (grayscaleEnable.checked) setMutualExclusivity(grayscaleEnable);
    });


    // --- Edge Detection Event Listeners ---

    edgeEnable.addEventListener('change', () => {
        if (edgeEnable.checked) setMutualExclusivity(edgeEnable);
        edgeControls.style.display = edgeEnable.checked ? 'block' : 'none';
    });

    edgeMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const sobelVisible = document.getElementById('edge-method-sobel').checked;
            sobelControls.style.display = sobelVisible ? 'block' : 'none';
            cannyControls.style.display = sobelVisible ? 'none' : 'block';
        });
    });

    sobelDirectionRadios.forEach(radio => {
        radio.addEventListener('change', () => {});
    });

    cannyThreshold1Slider.addEventListener('input', () => {
        cannyThreshold1Value.textContent = cannyThreshold1Slider.value;
    });

    cannyThreshold2Slider.addEventListener('input', () => {
        cannyThreshold2Value.textContent = cannyThreshold2Slider.value;
    });

    // --- Cartoon Effect Event Listeners ---

    cartoonEnable.addEventListener('change', () => {
        if (cartoonEnable.checked) setMutualExclusivity(cartoonEnable);
        cartoonControls.style.display = cartoonEnable.checked ? 'block' : 'none';
    });

    cartoonDiameterSlider.addEventListener('input', () => {
        if (!cartoonEnable.checked) {
            cartoonEnable.checked = true;
            cartoonEnable.dispatchEvent(new Event('change'));
        }
        cartoonDiameterValue.textContent = cartoonDiameterSlider.value;
    });

    cartoonSigmaColorSlider.addEventListener('input', () => {
        if (!cartoonEnable.checked) {
            cartoonEnable.checked = true;
            cartoonEnable.dispatchEvent(new Event('change'));
        }
        cartoonSigmaColorValue.textContent = cartoonSigmaColorSlider.value;
    });

    cartoonSigmaSpaceSlider.addEventListener('input', () => {
        if (!cartoonEnable.checked) {
            cartoonEnable.checked = true;
            cartoonEnable.dispatchEvent(new Event('change'));
        }
        cartoonSigmaSpaceValue.textContent = cartoonSigmaSpaceSlider.value;
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