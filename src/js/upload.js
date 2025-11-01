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
    const inputElement = document.getElementById('fileInput');
    const canvasInput = document.getElementById('canvasInput');
    const canvasOutput = document.getElementById('canvasOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    const ctxInput = canvasInput.getContext('2d');
    const filterControls = document.querySelector('filter-controls');

    let currentFilterState = {};

    function applyFilters() {
        if (!canvasInput.width || !canvasInput.height) return;

        const src = cv.imread(canvasInput);
        let mat1 = new cv.Mat();
        let mat2 = new cv.Mat();
        src.copyTo(mat1);

        try {
            const exclusiveFilterFunc = getActiveExclusiveFilter(currentFilterState);
            if (exclusiveFilterFunc) {
                exclusiveFilterFunc(mat1, mat2);
                mat1.delete();
                mat1 = mat2.clone();
            }

            if (currentFilterState.sharpen && currentFilterState.sharpen.enable) {
                window.snapFilters.applySharpen(mat1, mat2, currentFilterState.sharpen.intensity, src);
                mat1.delete();
                mat1 = mat2.clone();
            }

            if (currentFilterState.grayscale && currentFilterState.grayscale.enable) {
                const activeExclusiveName = getActiveExclusiveFilterName(currentFilterState);
                if (activeExclusiveName !== 'pencil' && activeExclusiveName !== 'edge' && activeExclusiveName !== 'emboss') {
                    window.snapFilters.applyGrayscale(mat1, mat2);
                    mat1.delete();
                    mat1 = mat2.clone();
                }
            }

            if (mat1.channels() === 1) {
                cv.cvtColor(mat1, mat2, cv.COLOR_GRAY2RGBA);
                cv.imshow('canvasOutput', mat2);
            } else {
                cv.imshow('canvasOutput', mat1);
            }
        } finally {
            src.delete();
            mat1.delete();
            mat2.delete();
        }
    }

    function getActiveExclusiveFilter(state) {
        if (state.blur && state.blur.enable) {
            return (src, dst) => window.snapFilters.applyBoxBlur(src, dst, state.blur.kernelSize);
        }
        if (state.gaussianBlur && state.gaussianBlur.enable) {
            return (src, dst) => window.snapFilters.applyGaussianBlur(src, dst, state.gaussianBlur.kernelSize, state.gaussianBlur.sigmaX, state.gaussianBlur.sigmaY);
        }
        if (state.emboss && state.emboss.enable) {
            return (src, dst) => window.snapFilters.applyEmboss(src, dst);
        }
        if (state.pencilSketch && state.pencilSketch.enable) {
            return (src, dst) => window.snapFilters.applyPencilSketch(src, dst, state.pencilSketch.kernelSize);
        }
        if (state.edge && state.edge.enable) {
            if (state.edge.method === 'sobel') {
                return (src, dst) => window.snapFilters.applySobel(src, dst, state.edge.sobelDirection);
            }
            if (state.edge.method === 'canny') {
                return (src, dst) => window.snapFilters.applyCanny(src, dst, state.edge.cannyThreshold1, state.edge.cannyThreshold2);
            }
        }
        return null;
    }

    function getActiveExclusiveFilterName(state) {
        if (state.blur && state.blur.enable) return 'blur';
        if (state.gaussianBlur && state.gaussianBlur.enable) return 'gaussian';
        if (state.emboss && state.emboss.enable) return 'emboss';
        if (state.pencilSketch && state.pencilSketch.enable) return 'pencil';
        if (state.edge && state.edge.enable) return 'edge';
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

    function setupEventListeners() {
        inputElement.addEventListener('change', handleImageUpload);
        downloadBtn.addEventListener('click', downloadImage);
        filterControls.addEventListener('filterchange', (e) => {
            currentFilterState = e.detail;
            applyFilters();
        });
    }

    // Initial filter state
    currentFilterState = filterControls.getFilterState();
    setupEventListeners();
}
