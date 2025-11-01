const video = document.getElementById('videoInput');
const canvasOutput = document.getElementById('canvasOutput');
const statusElement = document.getElementById('status');
const mainContent = document.getElementById('main-content');

const controls = {
    blur: { enable: document.getElementById('blur-enable'), slider: document.getElementById('blur-kernel-size'), value: document.getElementById('blur-kernel-value') },
    gaussianBlur: { enable: document.getElementById('gaussian-blur-enable'), kernelSlider: document.getElementById('gaussian-blur-kernel-size'), kernelValue: document.getElementById('gaussian-blur-kernel-value'), sigmaXSlider: document.getElementById('gaussian-blur-sigma-x'), sigmaXValue: document.getElementById('gaussian-blur-sigma-x-value'), sigmaYSlider: document.getElementById('gaussian-blur-sigma-y'), sigmaYValue: document.getElementById('gaussian-blur-sigma-y-value') },
    sharpen: { enable: document.getElementById('sharpen-enable'), slider: document.getElementById('sharpen-intensity'), value: document.getElementById('sharpen-intensity-value') },
    grayscale: { enable: document.getElementById('grayscale-enable') },
    emboss: { enable: document.getElementById('emboss-enable') },
    pencilSketch: { enable: document.getElementById('pencil-sketch-enable'), controls: document.getElementById('pencil-sketch-controls'), kernelSlider: document.getElementById('pencil-sketch-kernel-size'), kernelValue: document.getElementById('pencil-sketch-kernel-size-value'), sigmaSpaceSlider: document.getElementById('pencil-sketch-sigma-space'), sigmaSpaceValue: document.getElementById('pencil-sketch-sigma-space-value'), sigmaColorSlider: document.getElementById('pencil-sketch-sigma-color'), sigmaColorValue: document.getElementById('pencil-sketch-sigma-color-value') },
    edge: { enable: document.getElementById('edge-enable'), controls: document.getElementById('edge-controls'), sobelControls: document.getElementById('sobel-controls'), cannyControls: document.getElementById('canny-controls'), methodRadios: document.querySelectorAll('input[name="edge-method"]'), sobelDirectionRadios: document.querySelectorAll('input[name="sobel-direction"]'), cannyThreshold1Slider: document.getElementById('canny-threshold1'), cannyThreshold1Value: document.getElementById('canny-threshold1-value'), cannyThreshold2Slider: document.getElementById('canny-threshold2'), cannyThreshold2Value: document.getElementById('canny-threshold2-value') }
};

function setupUI() {
    const allFilters = Object.values(controls).map(c => c.enable).filter(Boolean);
    allFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            if (filter.checked) {
                allFilters.forEach(otherFilter => {
                    if (otherFilter !== filter) { otherFilter.checked = false; otherFilter.dispatchEvent(new Event('change')); }
                });
            }
        });
    });

    Object.values(controls).forEach(control => {
        if (!control.enable) return;
        const container = control.slider?.parentElement || control.controls;
        control.enable.addEventListener('change', () => {
            const isChecked = control.enable.checked;
            if (container) container.style.opacity = isChecked ? '1' : '0.5';
            if (control.controls) control.controls.style.display = isChecked ? 'block' : 'none';
        });
        control.enable.dispatchEvent(new Event('change'));
    });

    controls.edge.methodRadios.forEach(radio => radio.addEventListener('change', () => {
        const sobelVisible = document.getElementById('edge-method-sobel').checked;
        controls.edge.sobelControls.style.display = sobelVisible ? 'block' : 'none';
        controls.edge.cannyControls.style.display = sobelVisible ? 'none' : 'block';
    }));
    document.getElementById('edge-method-sobel').dispatchEvent(new Event('change'));

    const setupSlider = (slider, valueDisplay, format = val => val) => {
        if (slider && valueDisplay) {
            const update = () => { valueDisplay.textContent = format(slider.value); };
            slider.addEventListener('input', update);
            update();
        }
    };
    const formatKernel = val => { let k = parseInt(val); k = k % 2 ? k : k + 1; return `${k}x${k}`; };
    setupSlider(controls.blur.slider, controls.blur.value, formatKernel);
    setupSlider(controls.gaussianBlur.kernelSlider, controls.gaussianBlur.kernelValue, formatKernel);
    setupSlider(controls.gaussianBlur.sigmaXSlider, controls.gaussianBlur.sigmaXValue, val => parseFloat(val).toFixed(1));
    setupSlider(controls.gaussianBlur.sigmaYSlider, controls.gaussianBlur.sigmaYValue, val => parseFloat(val).toFixed(1));
    setupSlider(controls.sharpen.slider, controls.sharpen.value, val => parseFloat(val).toFixed(1));
    setupSlider(controls.pencilSketch.kernelSlider, controls.pencilSketch.kernelValue);
    setupSlider(controls.pencilSketch.sigmaSpaceSlider, controls.pencilSketch.sigmaSpaceValue);
    setupSlider(controls.pencilSketch.sigmaColorSlider, controls.pencilSketch.sigmaColorValue, val => parseFloat(val).toFixed(2));
    setupSlider(controls.edge.cannyThreshold1Slider, controls.edge.cannyThreshold1Value);
    setupSlider(controls.edge.cannyThreshold2Slider, controls.edge.cannyThreshold2Value);
}

function startVideoProcessing() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                requestAnimationFrame(processVideoFrame);
            };
        })
        .catch(err => {
            console.error("Camera access failed:", err);
            statusElement.innerHTML = `Camera access failed: ${err.message}. Please grant permission and refresh the page.`;
        });

    const hiddenCanvas = document.createElement('canvas');
    const hiddenContext = hiddenCanvas.getContext('2d');

    function processVideoFrame() {
        if (video.paused || video.ended || video.videoWidth === 0) {
            requestAnimationFrame(processVideoFrame);
            return;
        }

        let src, dst, temp; // Mats for this frame

        try {
            const w = video.videoWidth;
            const h = video.videoHeight;

            if (hiddenCanvas.width !== w || hiddenCanvas.height !== h) {
                hiddenCanvas.width = w;
                hiddenCanvas.height = h;
                canvasOutput.width = w;
                canvasOutput.height = h;
            }

            hiddenContext.drawImage(video, 0, 0, w, h);
            const imageData = hiddenContext.getImageData(0, 0, w, h);
            src = cv.matFromImageData(imageData);
            dst = new cv.Mat();
            temp = new cv.Mat();

            const activeFilterControl = Object.values(controls).find(c => c.enable && c.enable.checked);

            if (!activeFilterControl) {
                src.copyTo(dst);
            } else {
                if (activeFilterControl === controls.blur) window.snapFilters.applyBoxBlur(src, dst, parseInt(controls.blur.slider.value));
                else if (activeFilterControl === controls.gaussianBlur) window.snapFilters.applyGaussianBlur(src, dst, parseInt(controls.gaussianBlur.kernelSlider.value), parseFloat(controls.gaussianBlur.sigmaXSlider.value), parseFloat(controls.gaussianBlur.sigmaYSlider.value));
                else if (activeFilterControl === controls.sharpen) window.snapFilters.applySharpen(src, dst, parseFloat(controls.sharpen.slider.value));
                else if (activeFilterControl === controls.emboss) window.snapFilters.applyEmboss(src, dst);
                else if (activeFilterControl === controls.pencilSketch) window.snapFilters.applyPencilSketch(src, dst, parseInt(controls.pencilSketch.kernelSlider.value), parseFloat(controls.pencilSketch.sigmaSpaceSlider.value), parseFloat(controls.pencilSketch.sigmaColorSlider.value));
                else if (activeFilterControl === controls.grayscale) {
                    window.snapFilters.applyGrayscale(src, temp);
                    cv.cvtColor(temp, dst, cv.COLOR_GRAY2RGBA);
                } else if (activeFilterControl === controls.edge) {
                    const method = document.querySelector('input[name="edge-method"]:checked').value;
                    if (method === 'sobel') window.snapFilters.applySobel(src, dst, document.querySelector('input[name="sobel-direction"]:checked').value);
                    else window.snapFilters.applyCanny(src, dst, parseInt(controls.edge.cannyThreshold1Slider.value), parseInt(controls.edge.cannyThreshold2Slider.value));
                } else {
                    src.copyTo(dst);
                }
            }
            
            cv.imshow(canvasOutput, dst);

        } catch (err) {
            console.error("Error in processing loop:", err);
        } finally {
            if (src) src.delete();
            if (dst) dst.delete();
            if (temp) temp.delete();
            requestAnimationFrame(processVideoFrame); 
        }
    }
}

// --- Main Execution --- 
// This is the official and robust way to wait for OpenCV.js
var Module = {
    onRuntimeInitialized: () => {
        console.log("OpenCV.js is ready.");
        statusElement.style.display = 'none';
        mainContent.style.display = 'block';
        setupUI();
        startVideoProcessing();
    }
};