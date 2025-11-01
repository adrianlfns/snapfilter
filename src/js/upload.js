document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
        cv.onRuntimeInitialized = () => {
            console.log('OpenCV Ready');
            startApp();
        };
    };
});

function startApp() {
    // --- DOM Element Selection ---
    const inputElement = document.getElementById('fileInput');
    const canvasInput = document.getElementById('canvasInput');
    const canvasOutput = document.getElementById('canvasOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    const ctxInput = canvasInput.getContext('2d');

    // --- Filter Controls ---
    const controls = {
        blur: {
            enable: document.getElementById('blur-enable'),
            kernelSlider: document.getElementById('blur-kernel-size'),
            kernelValue: document.getElementById('blur-kernel-value'),
        },
        gaussianBlur: {
            enable: document.getElementById('gaussian-blur-enable'),
            kernelSlider: document.getElementById('gaussian-blur-kernel-size'),
            kernelValue: document.getElementById('gaussian-blur-kernel-value'),
            sigmaXSlider: document.getElementById('gaussian-blur-sigma-x'),
            sigmaXValue: document.getElementById('gaussian-blur-sigma-x-value'),
            sigmaYSlider: document.getElementById('gaussian-blur-sigma-y'),
            sigmaYValue: document.getElementById('gaussian-blur-sigma-y-value'),
        },
        sharpen: {
            enable: document.getElementById('sharpen-enable'),
            intensitySlider: document.getElementById('sharpen-intensity'),
            intensityValue: document.getElementById('sharpen-intensity-value'),
        },
        grayscale: {
            enable: document.getElementById('grayscale-enable'),
        },
        emboss: {
            enable: document.getElementById('emboss-enable'),
        },
        pencilSketch: {
            enable: document.getElementById('pencil-sketch-enable'),
            controls: document.getElementById('pencil-sketch-controls'),
            kernelSlider: document.getElementById('pencil-sketch-kernel-size'),
            kernelValue: document.getElementById('pencil-sketch-kernel-size-value'),
            sigmaSpaceSlider: document.getElementById('pencil-sketch-sigma-space'),
            sigmaSpaceValue: document.getElementById('pencil-sketch-sigma-space-value'),
            sigmaColorSlider: document.getElementById('pencil-sketch-sigma-color'),
            sigmaColorValue: document.getElementById('pencil-sketch-sigma-color-value'),
        },
        edge: {
            enable: document.getElementById('edge-enable'),
            controls: document.getElementById('edge-controls'),
            sobelControls: document.getElementById('sobel-controls'),
            cannyControls: document.getElementById('canny-controls'),
            methodRadios: document.querySelectorAll('input[name="edge-method"]'),
            sobelDirectionRadios: document.querySelectorAll('input[name="sobel-direction"]'),
            cannyThreshold1Slider: document.getElementById('canny-threshold1'),
            cannyThreshold1Value: document.getElementById('canny-threshold1-value'),
            cannyThreshold2Slider: document.getElementById('canny-threshold2'),
            cannyThreshold2Value: document.getElementById('canny-threshold2-value'),
        },
    };

    const allFilters = [
        controls.blur.enable,
        controls.gaussianBlur.enable,
        controls.sharpen.enable,
        controls.edge.enable,
        controls.grayscale.enable,
        controls.emboss.enable,
        controls.pencilSketch.enable
    ];

    // --- Core Functions ---

    function applyFilters() {
        if (!canvasInput.width || !canvasInput.height) return;

        const src = cv.imread(canvasInput);
        let dst = new cv.Mat();
        let processed = new cv.Mat();

        try {
            const activeFilter = getActiveFilter();
            if (activeFilter) {
                activeFilter(src, processed);
            } else {
                src.copyTo(processed);
            }

            if (controls.grayscale.enable.checked && getActiveFilterName() !== 'edge' && getActiveFilterName() !== 'pencil') {
                 const temp = new cv.Mat();
                 window.snapFilters.applyGrayscale(processed, temp);
                 cv.cvtColor(temp, dst, cv.COLOR_GRAY2RGBA);
                 temp.delete();
            } else if (controls.grayscale.enable.checked) {
                window.snapFilters.applyGrayscale(processed, dst);
            }
             else {
                processed.copyTo(dst);
            }

            cv.imshow('canvasOutput', dst);
        } finally {
            src.delete();
            dst.delete();
            processed.delete();
        }
    }

    function getActiveFilter() {
        if (controls.blur.enable.checked) {
            const kernelSize = parseInt(controls.blur.kernelSlider.value);
            return (src, dst) => window.snapFilters.applyBoxBlur(src, dst, kernelSize);
        }
        if (controls.gaussianBlur.enable.checked) {
            const kernelSize = parseInt(controls.gaussianBlur.kernelSlider.value);
            const sigmaX = parseFloat(controls.gaussianBlur.sigmaXSlider.value);
            const sigmaY = parseFloat(controls.gaussianBlur.sigmaYSlider.value);
            return (src, dst) => window.snapFilters.applyGaussianBlur(src, dst, kernelSize, sigmaX, sigmaY);
        }
        if (controls.sharpen.enable.checked) {
            const intensity = parseFloat(controls.sharpen.intensitySlider.value);
            return (src, dst) => window.snapFilters.applySharpen(src, dst, intensity);
        }
        if (controls.emboss.enable.checked) {
            return (src, dst) => window.snapFilters.applyEmboss(src, dst);
        }
        if (controls.pencilSketch.enable.checked) {
            const kernelSize = parseInt(controls.pencilSketch.kernelSlider.value);
            const sigmaSpace = parseFloat(controls.pencilSketch.sigmaSpaceSlider.value);
            const sigmaColor = parseFloat(controls.pencilSketch.sigmaColorSlider.value);
            return (src, dst) => window.snapFilters.applyPencilSketch(src, dst, kernelSize, sigmaSpace, sigmaColor);
        }
        if (controls.edge.enable.checked) {
            const edgeMethod = document.querySelector('input[name="edge-method"]:checked').value;
            if (edgeMethod === 'sobel') {
                const sobelDirection = document.querySelector('input[name="sobel-direction"]:checked').value;
                return (src, dst) => window.snapFilters.applySobel(src, dst, sobelDirection);
            }
            if (edgeMethod === 'canny') {
                const threshold1 = parseInt(controls.edge.cannyThreshold1Slider.value);
                const threshold2 = parseInt(controls.edge.cannyThreshold2Slider.value);
                return (src, dst) => window.snapFilters.applyCanny(src, dst, threshold1, threshold2);
            }
        }
        return null; // No filter enabled
    }
    
    function getActiveFilterName() {
        if (controls.blur.enable.checked) return 'blur';
        if (controls.gaussianBlur.enable.checked) return 'gaussian';
        if (controls.sharpen.enable.checked) return 'sharpen';
        if (controls.emboss.enable.checked) return 'emboss';
        if (controls.pencilSketch.enable.checked) return 'pencil';
        if (controls.edge.enable.checked) return 'edge';
        return null;
    }


    function handleImageUpload(event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvasInput.width = img.width;
                canvasInput.height = img.height;
                canvasOutput.width = img.width;
                canvasOutput.height = img.height;
                ctxInput.drawImage(img, 0, 0, img.width, img.height);
                applyFilters();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'filtered-image.png';
        link.href = canvasOutput.toDataURL();
        link.click();
    }

    function setMutualExclusivity(enabledFilter) {
        allFilters.forEach(filter => {
            if (filter !== enabledFilter) {
                filter.checked = false;
                filter.dispatchEvent(new Event('change'));
            }
        });
    }

    function setupEventListeners() {
        inputElement.addEventListener('change', handleImageUpload);
        downloadBtn.addEventListener('click', downloadImage);

        // --- Filter Event Listeners ---

        // Generic handler for simple enable/disable
        const setupSimpleFilter = (control) => {
            control.enable.addEventListener('change', () => {
                if (control.enable.checked) setMutualExclusivity(control.enable);
                if (control.slider) {
                    control.slider.style.opacity = control.enable.checked ? '1' : '0.5';
                }
                applyFilters();
            });
        };

        // Box Blur
        controls.blur.enable.addEventListener('change', () => {
            if (controls.blur.enable.checked) setMutualExclusivity(controls.blur.enable);
            controls.blur.kernelSlider.style.opacity = controls.blur.enable.checked ? '1' : '0.5';
            applyFilters();
        });
        controls.blur.kernelSlider.addEventListener('input', () => {
             if (!controls.blur.enable.checked) {
                controls.blur.enable.checked = true;
                controls.blur.enable.dispatchEvent(new Event('change'));
            }
            const kernelSize = parseInt(controls.blur.kernelSlider.value);
            controls.blur.kernelValue.textContent = `${kernelSize}x${kernelSize}`;
            applyFilters();
        });
        
        // Gaussian Blur
        controls.gaussianBlur.enable.addEventListener('change', () => {
            if (controls.gaussianBlur.enable.checked) setMutualExclusivity(controls.gaussianBlur.enable);
            const opacity = controls.gaussianBlur.enable.checked ? '1' : '0.5';
            controls.gaussianBlur.kernelSlider.style.opacity = opacity;
            controls.gaussianBlur.sigmaXSlider.style.opacity = opacity;
            controls.gaussianBlur.sigmaYSlider.style.opacity = opacity;
            applyFilters();
        });
         controls.gaussianBlur.kernelSlider.addEventListener('input', () => {
             if (!controls.gaussianBlur.enable.checked) {
                controls.gaussianBlur.enable.checked = true;
                controls.gaussianBlur.enable.dispatchEvent(new Event('change'));
            }
            const kernelSize = parseInt(controls.gaussianBlur.kernelSlider.value);
            controls.gaussianBlur.kernelValue.textContent = `${kernelSize}x${kernelSize}`;
            applyFilters();
        });
        controls.gaussianBlur.sigmaXSlider.addEventListener('input', () => {
            if (!controls.gaussianBlur.enable.checked) {
                controls.gaussianBlur.enable.checked = true;
                controls.gaussianBlur.enable.dispatchEvent(new Event('change'));
            }
            controls.gaussianBlur.sigmaXValue.textContent = parseFloat(controls.gaussianBlur.sigmaXSlider.value).toFixed(1);
            applyFilters();
        });
        controls.gaussianBlur.sigmaYSlider.addEventListener('input', () => {
            if (!controls.gaussianBlur.enable.checked) {
                controls.gaussianBlur.enable.checked = true;
                controls.gaussianBlur.enable.dispatchEvent(new Event('change'));
            }
            controls.gaussianBlur.sigmaYValue.textContent = parseFloat(controls.gaussianBlur.sigmaYSlider.value).toFixed(1);
            applyFilters();
        });

        // Sharpen
        controls.sharpen.enable.addEventListener('change', () => {
            if (controls.sharpen.enable.checked) setMutualExclusivity(controls.sharpen.enable);
            controls.sharpen.intensitySlider.style.opacity = controls.sharpen.enable.checked ? '1' : '0.5';
            applyFilters();
        });
        controls.sharpen.intensitySlider.addEventListener('input', () => {
            if (!controls.sharpen.enable.checked) {
                controls.sharpen.enable.checked = true;
                controls.sharpen.enable.dispatchEvent(new Event('change'));
            }
            controls.sharpen.intensityValue.textContent = parseFloat(controls.sharpen.intensitySlider.value).toFixed(1);
            applyFilters();
        });
        
        // Grayscale
        controls.grayscale.enable.addEventListener('change', () => {
             if (controls.grayscale.enable.checked) {
                // Grayscale can be combined with other filters, so it's not mutually exclusive
                const anyOtherFilterActive = allFilters.some(f => f.checked && f !== controls.grayscale.enable);
                if (!anyOtherFilterActive) {
                    // If no other filter is active, we can just apply grayscale
                }
            }
            applyFilters();
        });

        // Emboss
        controls.emboss.enable.addEventListener('change', () => {
            if (controls.emboss.enable.checked) {
                setMutualExclusivity(controls.emboss.enable);
            }
            applyFilters();
        });

        // Pencil Sketch
        controls.pencilSketch.enable.addEventListener('change', () => {
            if (controls.pencilSketch.enable.checked) setMutualExclusivity(controls.pencilSketch.enable);
            controls.pencilSketch.controls.style.display = controls.pencilSketch.enable.checked ? 'block' : 'none';
            applyFilters();
        });
        controls.pencilSketch.kernelSlider.addEventListener('input', () => {
            if (!controls.pencilSketch.enable.checked) {
                controls.pencilSketch.enable.checked = true;
                controls.pencilSketch.enable.dispatchEvent(new Event('change'));
            }
            controls.pencilSketch.kernelValue.textContent = controls.pencilSketch.kernelSlider.value;
            applyFilters();
        });
        controls.pencilSketch.sigmaSpaceSlider.addEventListener('input', () => {
            if (!controls.pencilSketch.enable.checked) {
                controls.pencilSketch.enable.checked = true;
                controls.pencilSketch.enable.dispatchEvent(new Event('change'));
            }
            controls.pencilSketch.sigmaSpaceValue.textContent = controls.pencilSketch.sigmaSpaceSlider.value;
            applyFilters();
        });
        controls.pencilSketch.sigmaColorSlider.addEventListener('input', () => {
            if (!controls.pencilSketch.enable.checked) {
                controls.pencilSketch.enable.checked = true;
                controls.pencilSketch.enable.dispatchEvent(new Event('change'));
            }
            controls.pencilSketch.sigmaColorValue.textContent = parseFloat(controls.pencilSketch.sigmaColorSlider.value).toFixed(2);
            applyFilters();
        });

        // Edge Detection
        controls.edge.enable.addEventListener('change', () => {
            if (controls.edge.enable.checked) setMutualExclusivity(controls.edge.enable);
            controls.edge.controls.style.display = controls.edge.enable.checked ? 'block' : 'none';
            applyFilters();
        });
        controls.edge.methodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const sobelVisible = document.getElementById('edge-method-sobel').checked;
                controls.edge.sobelControls.style.display = sobelVisible ? 'block' : 'none';
                controls.edge.cannyControls.style.display = sobelVisible ? 'none' : 'block';
                applyFilters();
            });
        });
        controls.edge.sobelDirectionRadios.forEach(radio => radio.addEventListener('change', applyFilters));
        controls.edge.cannyThreshold1Slider.addEventListener('input', () => {
            controls.edge.cannyThreshold1Value.textContent = controls.edge.cannyThreshold1Slider.value;
            applyFilters();
        });
        controls.edge.cannyThreshold2Slider.addEventListener('input', () => {
            controls.edge.cannyThreshold2Value.textContent = controls.edge.cannyThreshold2Slider.value;
            applyFilters();
        });
    }
    
    function initializeUI() {
        controls.blur.kernelSlider.style.opacity = '0.5';
        controls.gaussianBlur.kernelSlider.style.opacity = '0.5';
        controls.gaussianBlur.sigmaXSlider.style.opacity = '0.5';
        controls.gaussianBlur.sigmaYSlider.style.opacity = '0.5';
        controls.sharpen.intensitySlider.style.opacity = '0.5';
        controls.pencilSketch.controls.style.display = 'none';
        controls.edge.controls.style.display = 'none';
        document.getElementById('edge-method-sobel').dispatchEvent(new Event('change'));
    }

    // --- Initialization ---
    initializeUI();
    setupEventListeners();
}