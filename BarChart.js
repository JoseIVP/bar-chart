function createSVGElement(tagName){
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}

/**
 * A web component for creating bar charts.
 * Here is a list of all the CSS custom properties available:
 * --background-fill
 * --bar-fill
 * --bar-rx
 * --bar-ry
 * --bar-stroke
 * --bar-stroke-width
 * --border
 * --border-radius
 * --box-shadow
 * --default-text-fill
 * --default-text-font
 * --height
 * --horizontal-line-stroke
 * --horizontal-line-stroke-width
 * --margin
 * --text-fill
 * --text-font
 * --title-fill
 * --title-font
 * --width
 * --x-label-fill
 * --x-label-font
 * --x-legend-fill
 * --x-legend-font
 * --y-label-fill
 * --y-label-font
 * --y-legend-fill
 * --y-legend-font
 */
export default class BarChart extends HTMLElement{

    #bars;
    #barWidth;
    #contentHeight;
    #contentWidth;
    #contentXStart;
    #contentYStart;
    #gapFraction;
    #gapWidth;
    #height;
    #maxValue;
    #minValue;
    #padding;
    #showHorizontalLines;
    #size;
    #svgRoot;
    #title;
    #titleGap;
    #titleHeight;
    #values;
    #width;
    #xLabelElements;
    #xLabels;
    #xLabelsGap;
    #xLabelsHeight;
    #xLabelsRotation;
    #xLegend;
    #xLegendElement;
    #xLegendGap;
    #xLegendHeight;
    #yLabelElements;
    #yLabels;
    #yLabelsGap;
    #yLabelsMapping;
    #yLabelsWidth;
    #yLegend;
    #yLegendElement;
    #yLegendGap;
    #yLegendWidth;

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    
    /**
     * Renders the component's HTML and base SVG tags.
     * @private
     */
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
                    --default-text-fill: var(--text-fill, #616161);
                    --default-text-font: var(--text-font, 16px Arial, Helvetica, sans-serif);
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

                .title{
                    fill: var(--title-fill, var(--default-text-fill));
                    font: var(--title-font, var(--default-text-font));
                }
                
                .x-label{
                    fill: var(--x-label-fill, var(--default-text-fill));
                    font: var(--x-label-font, var(--default-text-font));
                }
                
                .y-label{
                    fill: var(--y-label-fill, var(--default-text-fill));
                    font: var(--y-label-font, var(--default-text-font));
                }
                
                .x-legend{
                    fill: var(--x-legend-fill, var(--default-text-fill));
                    font: var(--x-legend-font, var(--default-text-font));
                }
                
                .y-legend{
                    fill: var(--y-legend-fill, var(--default-text-fill));
                    font: var(--y-legend-font, var(--default-text-font));
                }
                
                .horizontal-line{
                    stroke: var(--horizontal-line-stroke, #BDBDBD);
                    stroke-width: var(--horizontal-line-stroke-width, 2);
                }
            </style>
            <svg>
                <rect class="background" width="100%" height="100%"/>
            </svg>
        `;
        this.#svgRoot = this.shadowRoot.querySelector('svg');
    }
    
    /**
     * Configures and shows the chart.
     * @param {Object} [options] - The options for the chart.
     * @param {number} [options.size=10] - The number of values to plot.
     * @param {number} [options.width=600] - The width of the SVG viewport.
     * @param {number} [options.height=400] - The height of the SVG viewport.
     * @param {number} [options.padding=10] - The padding around the chart.
     * @param {number} [options.gapFraction=0.2] - The fraction of the content
     * to use for the gaps between the bars.
     * @param {number} [options.values=[]] - The values to plot.
     * @param {number} [options.minValue=0] - The minimum value to plot, i.e.
     * the value for which the height of the bars is 0.
     * @param {number} [options.maxValue] - The maximum value to plot, i.e. the
     * value for which the height of the bar is at the top. By default it is the
     * value of the maximum label provided for the Y axis, if those are present.
     * If there are no labels for the Y axis, then the hight of the bars will be
     * relative to the height of the bar with the maximum value.
     * @param {(string[]|number[])} [options.xLabels=[]] - The labels of the X axis.
     * @param {number} [options.xLabelsGap=0] - The gap between the labels of
     * the X axis and the bars of the chart.
     * @param {number} [options.xLabelsRotation=0] - The rotation in degrees of
     * the labels in the X axis.
     * @param {number[]} [options.yLabels=[]] - The labels of the Y axis.
     * @param {number} [options.yLabelsGap=0] - The gap between the Y axis
     * labels and the bars.
     * @param {string[]} [options.yLabelsMapping=null] - If given, should be an
     * array of the same size than options.yLabels. Each label in
     * options.yLabels will be replaced in the chart by the corresponding value
     * in this array.
     * @param {string} [options.xLegend=null] - The legend of the X axis.
     * @param {number} [options.xLegendGap=0] - The gap between the legend of
     * the X axis and the labels of the same axis.
     * @param {string} [options.yLegend=null] - The legend of the Y axis.
     * @param {number} [options.yLegendGap=0] - The gap between the Y axis
     * legend and the Y axis labels.
     * @param {string} [options.title=null] - The title of the chart.
     * @param {number} [options.titleGap=0] - The gap between the title of the
     * chart and the bars.
     * @param {boolean} [options.showHorizontalLines=true] - true if the chart
     * should show horizontal bars for each of the labels in options.yLabels,
     * false otherwise.
     */
    plot(options={}){
        this.#size = options.size ?? 10;
        this.#width = options.width ?? 600;
        this.#height = options.height ?? 400;
        this.#padding = options.padding ?? 10;
        this.#gapFraction = options.gapFraction ?? 0.2;
        this.#xLabels = options.xLabels ?? [];
        this.#xLabelsGap = options.xLabelsGap ?? 0;
        this.#xLabelsRotation = options.xLabelsRotation ?? 0;
        this.#yLabels = options.yLabels ?? [];
        this.#yLabelsGap = options.yLabelsGap ?? 0;
        this.#yLabelsMapping = options.yLabelsMapping ?? null;
        this.#values = options.values ?? [];
        this.#minValue = options.minValue ?? 0;
        this.#maxValue = options.maxValue ?? (this.#yLabels.length > 0 ? Math.max(...this.#yLabels) : null);
        this.#xLegend = options.xLegend ?? null;
        this.#xLegendGap = options.xLegendGap ?? 0;
        this.#yLegend = options.yLegend ?? null;
        this.#yLegendGap = options.yLegendGap ?? 0;
        this.#title = options.title ?? null;
        this.#titleGap = options.titleGap ?? 0;
        this.#showHorizontalLines = options.showHorizontalLines ?? true;

        this.#render();
        this.#svgRoot.setAttribute('viewBox', `0 0 ${this.#width} ${this.#height}`);
        this.#positionTitle();
        this.#measureXLegendHeight();
        this.#measureYLegendWidth();
        this.#measureXLabelsHeight();
        this.#contentYStart = this.#padding + this.#titleHeight + this.#titleGap;
        this.#contentHeight = this.#height - this.#contentYStart - this.#padding - this.#xLabelsGap - this.#xLabelsHeight - this.#xLegendGap - this.#xLegendHeight;
        this.#measureYLabelsWidth();
        this.#contentXStart = this.#padding + this.#yLegendWidth + this.#yLegendGap + this.#yLabelsWidth + this.#yLabelsGap;
        this.#contentWidth = this.#width - this.#contentXStart - this.#padding;
        this.#gapWidth = this.#contentWidth * this.#gapFraction / (this.#size - 1);
        this.#barWidth = this.#contentWidth * (1 - this.#gapFraction) / this.#size;
        this.#positionXLegend();
        this.#positionYLegend();
        this.#positionXLabels();
        this.#positionYLabels();
        this.#positionBars();
    }

    /**
     * Creates and positions the title of the chart, if there is one. And
     * measures its height.
     * @private
     */
    #positionTitle(){
        if(this.#title){
            const title = createSVGElement('text');
            title.textContent = this.#title;
            title.setAttribute('class', 'title');
            this.#svgRoot.appendChild(title);
            const {width, height} = title.getBBox();
            const x = this.#width / 2 - width / 2;
            const y = this.#padding + height;
            title.setAttribute('transform', `translate(${x} ${y})`);
            this.#titleHeight = height;
        }else{
            this.#titleHeight = 0;
        }
    }

    /**
     * Creates the legend for the X axis if there is one, and measures the
     * vertical space it uses from the chart.
     * @private
     */
    #measureXLegendHeight(){
        if(this.#xLegend){
            const legend = createSVGElement('text');
            legend.textContent = this.#xLegend;
            legend.setAttribute('class', 'x-legend');
            this.#svgRoot.appendChild(legend);
            this.#xLegendHeight = legend.getBBox().height;
            this.#xLegendElement = legend;
        }else{
            this.#xLegendHeight = 0;
            this.#xLegendElement = null;
        }
    }

    /**
     * Creates the legend for the Y axis if there is one, and measures the
     * horizontal space it uses from the chart.
     * @private
     */
    #measureYLegendWidth(){
        if(this.#yLegend){
            const legend = createSVGElement('text');
            legend.textContent = this.#yLegend;
            legend.setAttribute('class', 'y-legend');
            this.#svgRoot.appendChild(legend);
            // The label will be rotated in 90 degrees, so the horizontal space
            // it uses corresponds to its height.
            this.#yLegendWidth = legend.getBBox().height;
            this.#yLegendElement = legend;
        }else{
            this.#yLegendWidth = 0;
            this.#yLegendElement = null;
        }
    }
    
    /**
     * Creates the labels for the X axis and measures the maximum vertical space
     * used by them.
     * @private
     */
    #measureXLabelsHeight(){
        // Transform the rotation from degrees to radians
        const rotation = Math.PI / 180 * this.#xLabelsRotation;
        let maxVerticalSpace = 0;
        this.#xLabelElements = [];
        for(let i=0; i<this.#size && i<this.#xLabels.length; i++){
            const label = createSVGElement('text');
            label.setAttribute('class', 'x-label');
            this.#svgRoot.appendChild(label);
            this.#xLabelElements.push(label);
            label.textContent = this.#xLabels[i];
            // Calculate the vertical space used considering the rotation of the
            // labels
            const {width, height} = label.getBBox();
            const verticalSpace = Math.sin(rotation) * width + Math.cos(rotation) * height;
            maxVerticalSpace = Math.max(maxVerticalSpace, verticalSpace);
        }
        this.#xLabelsHeight = maxVerticalSpace;
    }
    
    /**
     * Creates the labels for the Y axis and measures the maximum horizontal
     * space used by them.
     * @private
     */
    #measureYLabelsWidth(){
        this.#yLabelElements = [];
        let maxHorizontalSpace = 0;
        for(let i=0; i<this.#yLabels.length; i++){
            const label = createSVGElement('text');
            label.setAttribute('class', 'y-label');
            // If there is a mapping use it for the content of the label
            if(this.#yLabelsMapping){
                label.textContent = this.#yLabelsMapping[i];
            }else{
                label.textContent = this.#yLabels[i];
            }
            this.#svgRoot.append(label);
            this.#yLabelElements.push(label);
            const {width} = label.getBBox();
            maxHorizontalSpace = Math.max(maxHorizontalSpace, width);
        }
        this.#yLabelsWidth = maxHorizontalSpace;
    }

    #positionXLegend(){
        if(this.#xLegendElement){
            const {width} = this.#xLegendElement.getBBox();
            const x = this.#contentXStart + this.#contentWidth / 2 - width / 2;
            const y = this.#height - this.#padding;
            this.#xLegendElement.setAttribute('transform', `translate(${x} ${y})`);
        }
    }

    #positionYLegend(){
        if(this.#yLegendElement){
            const {width, height} = this.#yLegendElement.getBBox();
            const x = this.#padding + height;
            const y = this.#contentYStart + this.#contentHeight / 2 + width / 2;
            this.#yLegendElement.setAttribute('transform', `translate(${x} ${y}) rotate(-90)`);
        }
    }
    
    /**
     * Positions the X axis labels, rotating them if that option was given.
     * @private
     */
    #positionXLabels(){
        // Transform the rotation from degrees to radians
        const rotation = Math.PI / 180 * this.#xLabelsRotation;
        for(let i=0; i<this.#xLabelElements.length; i++){
            const label = this.#xLabelElements[i];
            const {width, height} = label.getBBox();
            const horizontalSpace = Math.sin(rotation) * height + Math.cos(rotation) * width;
            const verticalSpace = Math.sin(rotation) * width + Math.cos(rotation) * height;
            const y = this.#contentYStart + this.#contentHeight + this.#xLabelsGap + verticalSpace;
            const x = this.#contentXStart + i * (this.#barWidth + this.#gapWidth) + this.#barWidth / 2 - horizontalSpace / 2 + Math.sin(rotation) * height;
            label.setAttribute('transform', `translate(${x} ${y}) rotate(-${this.#xLabelsRotation})`);
        }
    }
    
    /**
     * Positions the Y axis labels and creates the horizontal lines at the
     * corresponding Y coordinates.
     * @private
     */
    #positionYLabels(){
        for(let i=0; i<this.#yLabels.length; i++){
            const labelValue = this.#yLabels[i];
            const label = this.#yLabelElements[i];
            const {width, height} = label.getBBox();
            let heightFraction = (labelValue - this.#minValue) / (this.#maxValue - this.#minValue); 
            heightFraction = Math.min(1, Math.max(0, heightFraction)); // Restrict the fraction to [0, 1]
            const y = this.#contentYStart + this.#contentHeight - this.#contentHeight * heightFraction;
            label.setAttribute('y', y + 1 / 3 * height);
            const x = this.#contentXStart - this.#yLabelsGap - width;
            label.setAttribute('x', x);
            if(this.#showHorizontalLines){
                const line = createSVGElement('line');
                line.setAttribute('class', 'horizontal-line');
                this.#svgRoot.appendChild(line);
                const x1 = this.#contentXStart;
                const x2 = x1 + this.#contentWidth;
                line.setAttribute('x1', x1);
                line.setAttribute('x2', x2);
                line.setAttribute('y1', y);
                line.setAttribute('y2', y);
            }
        }
    }
    
    /**
     * Creates and positions the bars of the plot, also giving them a height if
     * values where provided when plot() was called.
     * @private
     */
    #positionBars(){
        this.#bars = [];
        for(let i=0; i<this.#size; i++){
            const x =this.#contentXStart + i * (this.#barWidth + this.#gapWidth);
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
    
    /**
     * Updates the bars of the chart with an array of values.
     * @param {number[]} values - The array of values with which to update the
     * chart.
     */
    update(values){
        this.#values = values;
        const min = this.#minValue;
        const max = this.#maxValue ?? Math.max(...values);
        this.#bars.forEach((bar, i) => {
            const height = this.#contentHeight * (values[i] - min) / (max - min);
            bar.setAttribute('height', height);
            bar.setAttribute('y', this.#contentYStart + this.#contentHeight - height)
        });
    }
    
}
