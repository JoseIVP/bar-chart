# BarChart web component

This is a simple web component for a bar chart. See the file `example.html` for
an example of how to use it, or take a look at this
[codepen](https://codepen.io/JoseIVP/pen/bGWbQaz).

## Functions

<dl>
<dt><a href="#plot">plot([options])</a></dt>
<dd><p>Configures and shows the chart.</p>
</dd>
<dt><a href="#update">update(values)</a></dt>
<dd><p>Updates the bars of the chart with an array of values.</p>
</dd>
</dl>

<a name="plot"></a>

## plot([options])
Configures and shows the chart.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | The options for the chart. |
| [options.size] | <code>number</code> | <code>10</code> | The number of values to plot. |
| [options.width] | <code>number</code> | <code>600</code> | The width of the SVG viewport. |
| [options.height] | <code>number</code> | <code>400</code> | The height of the SVG viewport. |
| [options.padding] | <code>number</code> | <code>10</code> | The padding around the chart. |
| [options.gapFraction] | <code>number</code> | <code>0.2</code> | The fraction of the content to use for the gaps between the bars. |
| [options.values] | <code>number</code> | <code>[]</code> | The values to plot. |
| [options.minValue] | <code>number</code> | <code>0</code> | The minimum value to plot, i.e. the value for which the height of the bars is 0. |
| [options.maxValue] | <code>number</code> |  | The maximum value to plot, i.e. the value for which the height of the bar is at the top. By default it is the value of the maximum label provided for the Y axis, if those are present. If there are no labels for the Y axis, then the hight of the bars will be relative to the height of the bar with the maximum value. |
| [options.xLabels] | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;number&gt;</code> | <code>[]</code> | The labels of the X axis. |
| [options.xLabelsGap] | <code>number</code> | <code>0</code> | The gap between the labels of the X axis and the bars of the chart. |
| [options.xLabelsRotation] | <code>number</code> | <code>0</code> | The rotation in degrees of the labels in the X axis. |
| [options.yLabels] | <code>Array.&lt;number&gt;</code> | <code>[]</code> | The labels of the Y axis. |
| [options.yLabelsGap] | <code>number</code> | <code>0</code> | The gap between the Y axis labels and the bars. |
| [options.yLabelsMapping] | <code>Array.&lt;string&gt;</code> | <code></code> | If given, should be an array of the same size than options.yLabels. Each label in options.yLabels will be replaced in the chart by the corresponding value in this array. |
| [options.xLegend] | <code>string</code> | <code>null</code> | The legend of the X axis. |
| [options.xLegendGap] | <code>number</code> | <code>0</code> | The gap between the legend of the X axis and the labels of the same axis. |
| [options.yLegend] | <code>string</code> | <code>null</code> | The legend of the Y axis. |
| [options.yLegendGap] | <code>number</code> | <code>0</code> | The gap between the Y axis legend and the Y axis labels. |
| [options.title] | <code>string</code> | <code>null</code> | The title of the chart. |
| [options.titleGap] | <code>number</code> | <code>0</code> | The gap between the title of the chart and the bars. |
| [options.showHorizontalLines] | <code>boolean</code> | <code>true</code> | true if the chart should show horizontal bars for each of the labels in options.yLabels, false otherwise. |

<a name="update"></a>

## update(values)
Updates the bars of the chart with an array of values.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>Array.&lt;number&gt;</code> | The array of values with which to update the chart. |

