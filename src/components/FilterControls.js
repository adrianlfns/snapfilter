const filterControlsTemplate = `
<div class="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold text-center mb-6">Filters</h2>
    
    <!-- Box Blur Filter -->
    <div class="flex items-center justify-between">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="blur-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Box Blur</span>
        </label>
    </div>
    <div id="blur-controls" class="hidden mt-4">
        <div class="flex items-center justify-between">
           <span class="text-lg">Kernel Size</span>
           <span id="blur-kernel-value" class="text-lg">5x5</span>
        </div>
        <input type="range" id="blur-kernel-size" min="1" max="51" step="2" value="5" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">
    </div>

    <!-- Gaussian Blur Filter -->
    <div class="flex items-center justify-between mt-6 border-t border-gray-700 pt-6">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="gaussian-blur-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Gaussian Blur</span>
        </label>
    </div>
    <div id="gaussian-blur-controls" class="hidden mt-4">
        <div class="flex items-center justify-between">
            <span class="text-lg">Kernel Size</span>
            <span id="gaussian-blur-kernel-value" class="text-lg">5x5</span>
        </div>
        <input type="range" id="gaussian-blur-kernel-size" min="1" max="51" step="2" value="5" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">

        <div class="flex items-center justify-between mt-4">
            <span class="text-lg">Sigma X</span>
            <span id="gaussian-blur-sigma-x-value" class="text-lg">0</span>
        </div>
        <input type="range" id="gaussian-blur-sigma-x" min="0" max="10" step="0.1" value="0" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">

        <div class="flex items-center justify-between mt-4">
            <span class="text-lg">Sigma Y</span>
            <span id="gaussian-blur-sigma-y-value" class="text-lg">0</span>
        </div>
        <input type="range" id="gaussian-blur-sigma-y" min="0" max="10" step="0.1" value="0" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">
    </div>

    <!-- Sharpen Filter -->
    <div class="flex items-center justify-between mt-6 border-t border-gray-700 pt-6">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="sharpen-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Sharpen</span>
        </label>
    </div>
    <div id="sharpen-controls" class="hidden mt-4">
        <div class="flex items-center justify-between">
            <span class="text-lg">Intensity</span>
            <span id="sharpen-intensity-value" class="text-lg">1.0</span>
        </div>
        <input type="range" id="sharpen-intensity" min="0" max="5" step="0.1" value="1" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">
    </div>

    <!-- Grayscale Filter -->
    <div class="mt-6 border-t border-gray-700 pt-6">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="grayscale-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Grayscale</span>
        </label>
    </div>
    
    <!-- Emboss Filter -->
    <div class="mt-6 border-t border-gray-700 pt-6">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="emboss-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Emboss</span>
        </label>
    </div>

    <!-- Pencil Sketch Filter -->
    <div class="mt-6 border-t border-gray-700 pt-6">
        <label class="flex items-center space-x-3">
            <input type="checkbox" id="pencil-sketch-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
            <span class="text-lg font-bold">Pencil Sketch</span>
        </label>
    </div>
    <div id="pencil-sketch-controls" class="hidden mt-4">
        <div class="flex items-center justify-between">
            <span class="text-lg">Kernel Size</span>
            <span id="pencil-sketch-kernel-size-value" class="text-lg">21</span>
        </div>
        <input type="range" id="pencil-sketch-kernel-size" min="1" max="51" step="2" value="21" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">
    </div>

    <!-- Edge Detection Filter -->
    <div class="mt-6 border-t border-gray-700 pt-6">
        <div class="flex items-center justify-between">
            <label class="flex items-center space-x-3">
                <input type="checkbox" id="edge-enable" class="form-checkbox h-5 w-5 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500">
                <span class="text-lg font-bold">Edge Detection</span>
            </label>
        </div>

        <div id="edge-controls" class="mt-4 hidden">
            <div class="flex items-center space-x-4">
                <label class="flex items-center">
                    <input type="radio" name="edge-method" id="edge-method-sobel" value="sobel" checked class="form-radio h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 focus:ring-violet-500">
                    <span class="ml-2">Sobel</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" name="edge-method" id="edge-method-canny" value="canny" class="form-radio h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 focus:ring-violet-500">
                    <span class="ml-2">Canny</span>
                </label>
            </div>

            <div id="sobel-controls" class="mt-4">
                <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                        <input type="radio" name="sobel-direction" id="sobel-direction-x" value="x" checked class="form-radio h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 focus:ring-violet-500">
                        <span class="ml-2">Horizontal</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="sobel-direction" id="sobel-direction-y" value="y" class="form-radio h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 focus:ring-violet-500">
                        <span class="ml-2">Vertical</span>
                    </label>
                </div>
            </div>

            <div id="canny-controls" class="mt-4 hidden">
                <div class="flex items-center justify-between">
                    <span class="text-lg">Threshold 1</span>
                    <span id="canny-threshold1-value" class="text-lg">50</span>
                </div>
                <input type="range" id="canny-threshold1" min="0" max="255" step="1" value="50" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">

                <div class="flex items-center justify-between mt-4">
                    <span class="text-lg">Threshold 2</span>
                    <span id="canny-threshold2-value" class="text-lg">100</span>
                </div>
                <input type="range" id="canny-threshold2" min="0" max="255" step="1" value="100" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2">
            </div>
        </div>
    </div>
</div>
`;

class FilterControls extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = filterControlsTemplate;
        this._setupControls();
    }

    _setupControls() {
        const controls = {
            blur: {
                enable: this.querySelector('#blur-enable'),
                controls: this.querySelector('#blur-controls'),
                kernelSlider: this.querySelector('#blur-kernel-size'),
                kernelValue: this.querySelector('#blur-kernel-value'),
            },
            gaussianBlur: {
                enable: this.querySelector('#gaussian-blur-enable'),
                controls: this.querySelector('#gaussian-blur-controls'),
                kernelSlider: this.querySelector('#gaussian-blur-kernel-size'),
                kernelValue: this.querySelector('#gaussian-blur-kernel-value'),
                sigmaXSlider: this.querySelector('#gaussian-blur-sigma-x'),
                sigmaXValue: this.querySelector('#gaussian-blur-sigma-x-value'),
                sigmaYSlider: this.querySelector('#gaussian-blur-sigma-y'),
                sigmaYValue: this.querySelector('#gaussian-blur-sigma-y-value'),
            },
            sharpen: {
                enable: this.querySelector('#sharpen-enable'),
                controls: this.querySelector('#sharpen-controls'),
                intensitySlider: this.querySelector('#sharpen-intensity'),
                intensityValue: this.querySelector('#sharpen-intensity-value'),
            },
            grayscale: {
                enable: this.querySelector('#grayscale-enable'),
            },
            emboss: {
                enable: this.querySelector('#emboss-enable'),
            },
            pencilSketch: {
                enable: this.querySelector('#pencil-sketch-enable'),
                controls: this.querySelector('#pencil-sketch-controls'),
                kernelSlider: this.querySelector('#pencil-sketch-kernel-size'),
                kernelValue: this.querySelector('#pencil-sketch-kernel-size-value'),
            },
            edge: {
                enable: this.querySelector('#edge-enable'),
                controls: this.querySelector('#edge-controls'),
                sobelControls: this.querySelector('#sobel-controls'),
                cannyControls: this.querySelector('#canny-controls'),
                methodRadios: this.querySelectorAll('input[name="edge-method"]'),
                sobelDirectionRadios: this.querySelectorAll('input[name="sobel-direction"]'),
                cannyThreshold1Slider: this.querySelector('#canny-threshold1'),
                cannyThreshold1Value: this.querySelector('#canny-threshold1-value'),
                cannyThreshold2Slider: this.querySelector('#canny-threshold2'),
                cannyThreshold2Value: this.querySelector('#canny-threshold2-value'),
            },
        };

        const exclusiveFilters = [
            controls.blur,
            controls.gaussianBlur,
            controls.emboss,
            controls.pencilSketch,
            controls.edge,
        ];

        const setMutualExclusivity = (enabledFilterControl) => {
            exclusiveFilters.forEach(control => {
                if (control !== enabledFilterControl) {
                    control.enable.checked = false;
                    if (control.controls) {
                        control.controls.style.display = 'none';
                    }
                }
            });
        };

        const dispatchFilterChange = () => {
            this.dispatchEvent(new CustomEvent('filterchange', { detail: this.getFilterState(), bubbles: true, composed: true }));
        };

        Object.values(controls).forEach(control => {
            if (control.enable) {
                control.enable.addEventListener('change', (e) => {
                    if (exclusiveFilters.includes(control) && control.enable.checked) {
                        setMutualExclusivity(control);
                    }
                    if (control.controls) {
                        control.controls.style.display = control.enable.checked ? 'block' : 'none';
                    }
                    dispatchFilterChange();
                });
            }
            if(control.kernelSlider) {
                 control.kernelSlider.addEventListener('input', () => {
                    control.kernelValue.textContent = control.kernelSlider.step == 2 ? `${control.kernelSlider.value}x${control.kernelSlider.value}`: control.kernelSlider.value;
                    dispatchFilterChange();
                });
            }
            if(control.intensitySlider) control.intensitySlider.addEventListener('input', () => {
                control.intensityValue.textContent = parseFloat(control.intensitySlider.value).toFixed(1);
                dispatchFilterChange();
            });
            if(control.sigmaXSlider) control.sigmaXSlider.addEventListener('input', () => {
                control.sigmaXValue.textContent = parseFloat(control.sigmaXSlider.value).toFixed(1);
                dispatchFilterChange();
            });
            if(control.sigmaYSlider) control.sigmaYSlider.addEventListener('input', () => {
                control.sigmaYValue.textContent = parseFloat(control.sigmaYSlider.value).toFixed(1);
                dispatchFilterChange();
            });
             if(control.methodRadios) control.methodRadios.forEach(r => r.addEventListener('change', () => {
                 controls.edge.sobelControls.style.display = this.querySelector('#edge-method-sobel').checked ? 'block' : 'none';
                 controls.edge.cannyControls.style.display = this.querySelector('#edge-method-canny').checked ? 'block' : 'none';
                dispatchFilterChange();
            }));
            if(control.sobelDirectionRadios) control.sobelDirectionRadios.forEach(r => r.addEventListener('change', dispatchFilterChange));
            if(control.cannyThreshold1Slider) control.cannyThreshold1Slider.addEventListener('input', () => {
                control.cannyThreshold1Value.textContent = control.cannyThreshold1Slider.value;
                dispatchFilterChange();
            });
            if(control.cannyThreshold2Slider) control.cannyThreshold2Slider.addEventListener('input', () => {
                control.cannyThreshold2Value.textContent = control.cannyThreshold2Slider.value;
                dispatchFilterChange();
            });
        });

        [...exclusiveFilters, controls.sharpen, controls.pencilSketch, controls.edge].forEach(control => {
            if (control.controls) {
                control.controls.style.display = control.enable.checked ? 'block' : 'none';
            }
        });

        const edgeMethodSobel = this.querySelector('#edge-method-sobel');
        if (edgeMethodSobel) {
            edgeMethodSobel.dispatchEvent(new Event('change'));
        }
    }

    getFilterState() {
        return {
            blur: {
                enable: this.querySelector('#blur-enable').checked,
                kernelSize: parseInt(this.querySelector('#blur-kernel-size').value),
            },
            gaussianBlur: {
                enable: this.querySelector('#gaussian-blur-enable').checked,
                kernelSize: parseInt(this.querySelector('#gaussian-blur-kernel-size').value),
                sigmaX: parseFloat(this.querySelector('#gaussian-blur-sigma-x').value),
                sigmaY: parseFloat(this.querySelector('#gaussian-blur-sigma-y').value),
            },
            sharpen: {
                enable: this.querySelector('#sharpen-enable').checked,
                intensity: parseFloat(this.querySelector('#sharpen-intensity').value),
            },
            grayscale: {
                enable: this.querySelector('#grayscale-enable').checked,
            },
            emboss: {
                enable: this.querySelector('#emboss-enable').checked,
            },
            pencilSketch: {
                enable: this.querySelector('#pencil-sketch-enable').checked,
                kernelSize: parseInt(this.querySelector('#pencil-sketch-kernel-size').value),
            },
            edge: {
                enable: this.querySelector('#edge-enable').checked,
                method: this.querySelector('input[name="edge-method"]:checked').value,
                sobelDirection: this.querySelector('input[name="sobel-direction"]:checked').value,
                cannyThreshold1: parseInt(this.querySelector('#canny-threshold1').value),
                cannyThreshold2: parseInt(this.querySelector('#canny-threshold2').value),
            },
        };
    }
}

customElements.define('filter-controls', FilterControls);