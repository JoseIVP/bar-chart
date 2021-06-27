function createSVGElement(tagName){
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}

export default class BarChart extends HTMLElement{

    #bars;
    #barWidth;
    #contentHeight;
    #contentWidth;
    #gapFraction;
    #gapWidth;
    #height;
    #maxValue;
    #minValue;
    #padding;
    #size;
    #svgRoot;
    #values;
    #width;
    #xLabelElements;
    #xLabels;
    #xLabelsHeight;
    #xLabelsRotation;
    #yLabelElements;
    #yLabels;
    #yLabelsGap;
    #yLabelsWidth;
    
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.#render();
    }
    
    #render(){
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                svg{
                    display: block;
                    width: var(--width);
                    height: var(--height);
                    box-shadow: var(--box-shadow);
                    margin: var(--margin, 0);
                    border: var(--border);
                    border-radius: var(--border-radius);
                }

                .background{
                    fill: var(--background-fill, #EEEEEE);
                }

                .bar{
                    fill: var(--bar-fill, #BDBDBD);
                    stroke: var(--bar-stroke, #9E9E9E);
                    stroke-width: var(--bar-stroke-width, 2);
                    rx: var(--bar-rx, 2);
                    ry: var(--bar-ry, 2);
                }

                text{
                    fill: var(--labels-fill, #616161);
                    font: var(--labels-font, 16px Arial, Helvetica, sans-serif)
                }
            </style>
            <svg>
                <rect class="background" width="100%" height="100%"/>
            </svg>
        `;
        this.#svgRoot = this.shadowRoot.querySelector('svg');
    }
    
    plot(options={}){
        this.#size = options.size ?? 10;
        this.#width = options.width ?? 600;
        this.#height = options.height ?? 400;
        this.#padding = options.padding ?? 10;
        this.#xLabelsRotation = options.xLabelsRotation ?? 0;
        // Fraction of the content width for the gaps between the bars:
        this.#gapFraction = options.gapFraction ?? 0.2;
        this.#xLabels = options.xLabels ?? [];
        this.#yLabels = options.yLabels ?? [];
        this.#values = options.values ?? [];
        this.#minValue = options.minValue ?? 0;
        const maxYLabelValue = this.#yLabels[this.#yLabels.length - 1];
        this.#maxValue = options.maxValue ?? maxYLabelValue ??  null;
        this.#yLabelsGap = options.yLabelsGap ?? 0;
        
        this.#svgRoot.setAttribute('viewBox', `0 0 ${this.#width} ${this.#height}`);
        this.#initLabels();
        this.#initBars();
    }
    
    #initLabels(){
        this.#measureXLabelsHeight();
        this.#measureYLabelsWidth();
        this.#positionXLabels();
        this.#positionYLabels();
    }
    
    #measureXLabelsHeight(){
        const rotation = Math.PI / 180 * this.#xLabelsRotation;
        let maxVerticalSpace = 0;
        this.#xLabelElements = [];
        // Create the x axis labels and compute the maximum
        // vertical space they use:
        for(let i=0; i<this.#size && i<this.#xLabels.length; i++){
            const label = createSVGElement('text');
            label.setAttribute('class', 'xLabel');
            this.#svgRoot.appendChild(label);
            this.#xLabelElements.push(label);
            label.textContent = this.#xLabels[i];
            const {width, height} = label.getBBox();
            const verticalSpace = Math.sin(rotation) * width + Math.cos(rotation) * height;
            maxVerticalSpace = Math.max(maxVerticalSpace, verticalSpace);
        }
        this.#xLabelsHeight = maxVerticalSpace;
        this.#contentHeight = this.#height - 2 * this.#padding - this.#xLabelsHeight;
    }
    
    #measureYLabelsWidth(){
        // Create the y axis labels and compute the maximum
        // horizontal space they use:
        this.#yLabelElements = [];
        let maxHorizontalSpace = 0;
        for(const labelValue of this.#yLabels){
            const label = createSVGElement('text');
            label.setAttribute('class', 'yLabel');
            label.textContent = labelValue;
            this.#svgRoot.append(label);
            this.#yLabelElements.push(label);
            const {width} = label.getBBox();
            maxHorizontalSpace = Math.max(maxHorizontalSpace, width);
        }
        this.#yLabelsWidth = maxHorizontalSpace;
        this.#contentWidth = this.#width - 2 * this.#padding - this.#yLabelsWidth - this.#yLabelsGap;
        this.#gapWidth = this.#contentWidth * this.#gapFraction / (this.#size - 1);
        this.#barWidth = this.#contentWidth * (1 - this.#gapFraction) / this.#size;
    }
    
    #positionXLabels(){
        // Position the x axis labels aligned to the top of
        // the maximum vertical space they use
        const rotation = Math.PI / 180 * this.#xLabelsRotation;
        for(let i=0; i<this.#xLabelElements.length; i++){
            const label = this.#xLabelElements[i];
            const {width, height} = label.getBBox();
            const horizontalSpace = Math.sin(rotation) * height + Math.cos(rotation) * width;
            const y = this.#height - this.#padding - this.#xLabelsHeight + Math.sin(rotation) * width + Math.cos(rotation) * height;
            const x = this.#padding + this.#yLabelsWidth + this.#yLabelsGap + i * (this.#barWidth + this.#gapWidth) + this.#barWidth / 2 - horizontalSpace / 2 + Math.sin(rotation) * height;
            label.setAttribute('transform', `translate(${x} ${y}) rotate(-${this.#xLabelsRotation})`);
        }
    }
    
    #positionYLabels(){
        // Position the y axis labels aligned to the right of
        // the maximum horizontal space they use
        for(let i=0; i<this.#yLabels.length; i++){
            const labelValue = this.#yLabels[i];
            const label = this.#yLabelElements[i];
            const {width, height} = label.getBBox();
            const y = this.#padding + this.#contentHeight - this.#contentHeight * (labelValue - this.#minValue) / (this.#maxValue - this.#minValue) + height / 2;
            label.setAttribute('y', y);
            const x = this.#padding + this.#yLabelsWidth - width;
            label.setAttribute('x', x);
        }
    }
    
    #initBars(){
        this.#bars = [];
        for(let i=0; i<this.#size; i++){
            const x = this.#padding + this.#yLabelsWidth + this.#yLabelsGap + i * (this.#barWidth + this.#gapWidth);
            const bar = createSVGElement('rect');
            bar.setAttribute('class', 'bar');
            bar.setAttribute('x', x);
            bar.setAttribute('width', this.#barWidth);
            this.#svgRoot.appendChild(bar);
            this.#bars.push(bar);
        }
        if(this.#values.length > 0){
            this.update(this.#values);
        }
    }
    
    update(values){
        this.#values = values;
        const min = this.#minValue;
        const max = this.#maxValue ?? Math.max(...values);
        this.#bars.forEach((bar, i) => {
            const height = this.#contentHeight * (values[i] - min) / (max - min);
            bar.setAttribute('height', height);
            bar.setAttribute('y', this.#padding + this.#contentHeight - height)
        });
    }
    
}
