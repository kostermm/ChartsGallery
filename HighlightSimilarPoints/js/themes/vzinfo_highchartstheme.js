/*
 | Highcharts theme for easycharts
 | @author Martin Kosterman
 | @date Dec 2017
 |
 | This is a theme used by Highcharts
 | The theme is defined as property of Highcharts object and will be loaded with code:
 | Highcharts.setOptions(Highcharts.easyChartTheme)

https://stackoverflow.com/questions/13070126/highcharts-exporting-filename
 var filename = (view.el.attr("data-title")!=undefined) ? (view.el.attr("data-title").replace(/["',]/g,'')).replace(/[^a-zA-Z0-9]/g,'-') : 'Grafiek';

        if (docType == 'print')
          view.chart.print();
        else {
          view.exporting = true;
          view.chart.exportChart({
            type: mimetypes[docType],
            filename: filename
          });
 */
Highcharts.vzinfoTheme = { "colors": ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#8085e8", "#8d4653", "#91e8e1"], "symbols": ["circle", "diamond", "square", "triangle", "triangle-down"], "lang": { "loading": "Loading...", "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], "weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "decimalPoint": ",", "numericSymbols": null, "resetZoom": "Reset zoom", "resetZoomTitle": "Reset zoom level 1:1", "thousandsSep": ".", "printChart": "Print chart", "downloadPNG": "Download PNG image", "downloadJPEG": "Download JPEG image", "downloadPDF": "Download PDF document", "downloadSVG": "Download SVG vector image", "contextButtonTitle": "Chart context menu", "noData": "No data to display", "zoomIn": "Inzoomen", "zoomOut": "Uitzoomen", "downloadCSV": "CSV downloaden", "downloadXLS": "XLS downloaden", "viewData": "Tabel tonen" }, "global": { "useUTC": true, "canvasToolsURL": "http://code.highcharts.com/4.0.4/modules/canvas-tools.js", "VMLRadialGradientURL": "http://code.highcharts.com/4.0.4/gfx/vml-radial-gradient.png" }, "chart": { "borderColor": "#4572A7", "borderRadius": 0, "defaultSeriesType": "line", "ignoreHiddenSeries": true, "spacing": [10, 10, 15, 10], "backgroundColor": "#FFFFFF", "plotBorderColor": "#C0C0C0", "resetZoomButton": { "theme": { "zIndex": 20 }, "position": { "align": "right", "x": -10, "y": 10 } }, "height": 600, "marginTop": 75, "spacingBottom": 20, "style": { "color": "#ff0000", "fontFamily": "RijksoverheidSans, Verdana", "fontSize": "14px", "fontWeight": "normal" }, "events": {} }, "title": { "text": "Chart title", "align": "left", "margin": 30, "style": { "color": "#000000", "fontSize": "13pt", "fontWeight": "bold" }, "x": 0, "y": 10 }, "subtitle": { "text": "", "align": "left", "style": { "color": "#000000", "fontSize": "9pt", "fontWeight": "normal" }, "x": 2, "y": 40 }, "plotOptions": { "line": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } }, "enabled": false }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000 }, "area": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 0, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } }, "enabled": false }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "threshold": 0 }, "spline": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000 }, "areaspline": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "threshold": 0 }, "column": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": null, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": null, "verticalAlign": null }, "cropThreshold": 50, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": false, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderRadius": 0, "groupPadding": 0.1, "pointPadding": 0.1, "minPointLength": 0, "tooltip": { "distance": 6 }, "threshold": 0, "borderWidth": 0 }, "bar": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": null, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": null, "verticalAlign": null }, "cropThreshold": 50, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": false, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderRadius": 0, "groupPadding": 0.1, "pointPadding": 0, "minPointLength": 0, "tooltip": { "distance": 6 }, "threshold": 0, "borderWidth": 0 }, "scatter": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 0, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": false, "turboThreshold": 1000, "tooltip": { "headerFormat": "<span style=\"color:{series.color}\">●</span> <span style=\"font-size: 10px;\"> {series.name}</span><br/>", "pointFormat": "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>" } }, "pie": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": true, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom", "distance": 30 }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 }, "brightness": 0.1, "shadow": false }, "select": { "marker": {} } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderWidth": 1, "center": [null, null], "clip": false, "colorByPoint": true, "ignoreHiddenPoint": true, "legendType": "point", "size": null, "showInLegend": false, "slicedOffset": 10, "tooltip": { "followPointer": true } }, "arearange": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": null, "xLow": 0, "xHigh": 0, "yLow": 0, "yHigh": 0 }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "threshold": null, "tooltip": { "pointFormat": "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>" }, "trackByArea": true }, "areasplinerange": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": null, "xLow": 0, "xHigh": 0, "yLow": 0, "yHigh": 0 }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "threshold": null, "tooltip": { "pointFormat": "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>" }, "trackByArea": true }, "columnrange": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": null, "xLow": 0, "xHigh": 0, "yLow": 0, "yHigh": 0 }, "cropThreshold": 300, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 }, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": true, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderRadius": 0, "groupPadding": 0.2, "pointPadding": 0.1, "minPointLength": 0, "tooltip": { "distance": 6, "pointFormat": "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>" }, "threshold": null, "trackByArea": true }, "gauge": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": true, "x": 0, "y": 15, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px", "fontWeight": "bold" }, "align": "center", "verticalAlign": "top", "borderWidth": 1, "borderColor": "silver", "borderRadius": 3, "crop": false, "zIndex": 2 }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "dial": {}, "pivot": {}, "tooltip": { "headerFormat": "" }, "showInLegend": false }, "boxplot": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": null, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": null, "verticalAlign": null }, "cropThreshold": 50, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": false, "brightness": -0.3, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderRadius": 0, "groupPadding": 0.2, "pointPadding": 0.1, "minPointLength": 0, "tooltip": { "distance": 6, "pointFormat": "<span style=\"color:{series.color};font-weight:bold\">{series.name}</span><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>" }, "threshold": null, "fillColor": "#FFFFFF", "medianWidth": 2, "whiskerLength": "50%", "whiskerWidth": 2 }, "errorbar": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": null, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": null, "verticalAlign": null }, "cropThreshold": 50, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": false, "brightness": -0.3, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderRadius": 0, "groupPadding": 0.2, "pointPadding": 0.1, "minPointLength": 0, "tooltip": { "distance": 6, "pointFormat": "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>" }, "threshold": null, "fillColor": "#FFFFFF", "medianWidth": 2, "whiskerLength": "50%", "whiskerWidth": null, "color": "#000000", "grouping": false, "linkedTo": ":previous" }, "waterfall": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 1, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": null, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": null, "verticalAlign": null }, "cropThreshold": 50, "pointRange": null, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": false, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#333", "borderRadius": 0, "groupPadding": 0.2, "pointPadding": 0.1, "minPointLength": 0, "tooltip": { "distance": 6 }, "threshold": 0, "lineColor": "#333", "dashStyle": "dot" }, "bubble": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 0, "marker": { "lineWidth": 1, "radius": 4, "lineColor": null, "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "white", "cursor": "default", "fontSize": "11px", "textShadow": "0px 0px 3px black" }, "align": "center", "verticalAlign": "middle", "inside": true }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": false, "turboThreshold": 0, "tooltip": { "headerFormat": "<span style=\"color:{series.color}\">●</span> <span style=\"font-size: 10px;\"> {series.name}</span><br/>", "pointFormat": "({point.x}, {point.y}), Size: {point.z}" }, "minSize": 8, "maxSize": "20%", "zThreshold": 0 }, "heatmap": { "allowPointSelect": false, "showCheckbox": false, "animation": false, "events": {}, "lineWidth": 0, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": false, "x": 0, "y": 0, "style": { "color": "white", "cursor": "default", "fontSize": "11px", "fontWeight": "bold", "HcTextStroke": "1px rgba(0,0,0,0.5)" }, "align": "center", "verticalAlign": "middle", "crop": false, "overflow": false }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 }, "brightness": 0.2 }, "select": { "marker": {} }, "normal": { "animation": true } }, "stickyTracking": false, "turboThreshold": 1000, "tooltip": { "headerFormat": "<span style=\"color:{series.color}\">●</span> <span style=\"font-size: 10px;\"> {series.name}</span><br/>", "pointFormat": "{point.x}, {point.y}: {point.value}<br/>" }, "borderWidth": 0, "nullColor": "#F8F8F8" }, "funnel": { "allowPointSelect": false, "showCheckbox": false, "animation": false, "events": {}, "lineWidth": 2, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": true, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom", "distance": 30, "connectorWidth": 1, "connectorColor": "#606060" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 }, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderWidth": 1, "center": ["50%", "50%"], "clip": false, "colorByPoint": true, "ignoreHiddenPoint": true, "legendType": "point", "size": true, "showInLegend": false, "slicedOffset": 10, "tooltip": { "followPointer": true }, "width": "90%", "neckWidth": "30%", "height": "100%", "neckHeight": "25%", "reversed": false }, "pyramid": { "allowPointSelect": false, "showCheckbox": false, "animation": false, "events": {}, "lineWidth": 2, "marker": null, "point": { "events": {} }, "dataLabels": { "enabled": true, "x": 0, "y": 0, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px" }, "align": "center", "verticalAlign": "bottom", "distance": 30, "connectorWidth": 1, "connectorColor": "#606060" }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 }, "brightness": 0.1, "shadow": false }, "select": { "marker": {}, "color": "#C0C0C0", "borderColor": "#000000", "shadow": false } }, "stickyTracking": false, "turboThreshold": 1000, "borderColor": "#FFFFFF", "borderWidth": 1, "center": ["50%", "50%"], "clip": false, "colorByPoint": true, "ignoreHiddenPoint": true, "legendType": "point", "size": true, "showInLegend": false, "slicedOffset": 10, "tooltip": { "followPointer": true }, "width": "90%", "neckWidth": "0%", "height": "100%", "neckHeight": "0%", "reversed": true }, "solidgauge": { "allowPointSelect": false, "showCheckbox": false, "animation": { "duration": 1000 }, "events": {}, "lineWidth": 2, "marker": { "lineWidth": 0, "radius": 4, "lineColor": "#FFFFFF", "states": { "hover": { "enabled": true, "lineWidthPlus": 1, "radiusPlus": 2 }, "select": { "fillColor": "#FFFFFF", "lineColor": "#000000", "lineWidth": 2 } } }, "point": { "events": {} }, "dataLabels": { "enabled": true, "x": 0, "y": 15, "style": { "color": "#606060", "cursor": "default", "fontSize": "11px", "fontWeight": "bold" }, "align": "center", "verticalAlign": "top", "borderWidth": 1, "borderColor": "silver", "borderRadius": 3, "crop": false, "zIndex": 2 }, "cropThreshold": 300, "pointRange": 0, "states": { "hover": { "lineWidthPlus": 1, "marker": {}, "halo": { "size": 10, "opacity": 0.25 } }, "select": { "marker": {} } }, "stickyTracking": true, "turboThreshold": 1000, "dial": {}, "pivot": {}, "tooltip": { "headerFormat": "" }, "showInLegend": false, "colorByPoint": true }, "series": { "stickyTracking": false, "lineWidth": 2, "states": { "hover": { "lineWidthPlus": 2, "brightness": 0.15 } }, "marker": { "symbol": "circle", "radius": 0, "lineColor": null, "states": { "hover": { "fillColor": "#ffffff", "lineWidth": 4, "radius": 7 } } }, "animation": { "duration": 2000 } } }, "labels": { "style": { "position": "absolute", "color": "#3E576F" } }, "legend": { "enabled": true, "align": "center", "layout": "horizontal", "borderColor": "#909090", "borderRadius": 0, "navigation": { "activeColor": "#274b6d", "inactiveColor": "#CCC" }, "shadow": false, "itemStyle": { "color": "black", "fontSize": "11px", "fontWeight": "normal", "cursor": "pointer" }, "itemHoverStyle": { "color": "#007bc7" }, "itemHiddenStyle": { "color": "#c8c8c8" }, "itemCheckboxStyle": { "position": "absolute", "width": "13px", "height": "13px" }, "symbolPadding": 5, "verticalAlign": "bottom", "x": 40, "y": -10, "title": { "style": { "fontWeight": "normal", "fontSize": "16px", "color": "black" } }, "margin": 0, "squareSymbol": false, "symbolWidth": 24, "symbolHeight": 12, "symbolRadius": 0 }, "loading": { "labelStyle": { "fontWeight": "bold", "position": "relative", "top": "45%" }, "style": { "position": "absolute", "backgroundColor": "white", "opacity": 0.5, "textAlign": "center" } }, "tooltip": { "enabled": true, "animation": true, "backgroundColor": "rgba(255,255,255,0.95)", "borderWidth": 2, "borderRadius": 3, "dateTimeLabelFormats": { "millisecond": "%A, %b %e, %H:%M:%S.%L", "second": "%A, %b %e, %H:%M:%S", "minute": "%A, %b %e, %H:%M", "hour": "%A, %b %e, %H:%M", "day": "%A, %b %e, %Y", "week": "Week from %A, %b %e, %Y", "month": "%B %Y", "year": "%Y" }, "headerFormat": " <span style=\"font-size: 16px\"><b>{point.key}</b></span><br/>", "pointFormat": "<span style=\"color:{series.color}\">●</span> {series.name}: <b>{point.y}</b><br/>", "shadow": false, "snap": 10, "style": { "color": "#000000", "cursor": "default", "fontSize": "11pt", "padding": "8px", "whiteSpace": "nowrap", "fontWeight": "normal" }, "valueDecimals": 1, "hideDelay": 0.2, "borderColor": "#51d0e3" }, "credits": { "enabled": true, "text": "Highcharts.com", "href": "http://www.highcharts.com", "position": { "align": "left", "x": 20, "verticalAlign": "bottom", "y": -5 }, "style": { "cursor": "pointer", "color": "#909090", "fontSize": "14px" } }, "navigation": { "menuStyle": { "border": "1px solid #A0A0A0", "background": "#FFFFFF", "padding": "5px 0" }, "menuItemStyle": { "padding": "0 10px", "background": "none", "color": "#303030", "fontSize": "11px" }, "menuItemHoverStyle": { "background": "#4572A5", "color": "#FFFFFF" }, "buttonOptions": { "symbolFill": "#E0E0E0", "symbolSize": 14, "symbolStroke": "#666", "symbolStrokeWidth": 3, "symbolX": 12.5, "symbolY": 10.5, "align": "right", "buttonSpacing": 3, "height": 22, "theme": { "fill": "white", "stroke": "none" }, "verticalAlign": "top", "width": 24 } }, "exporting": { "type": "image/png", "url": "http://export.highcharts.com/", "buttons": { "contextButton": { "menuClassName": "highcharts-contextmenu", "symbol": "menu", "_titleKey": "contextButtonTitle", "menuItems": [{ "textKey": "printChart" }, { "separator": true }, { "textKey": "downloadPNG" }, { "textKey": "downloadJPEG" }, { "textKey": "downloadPDF" }, { "textKey": "downloadSVG" }] } }, "enabled": false }, "noData": { "position": { "x": 0, "y": 0, "align": "center", "verticalAlign": "middle" }, "attr": {}, "style": { "fontWeight": "bold", "fontSize": "12px", "color": "#60606a" } }, "colorPalettes": { "categorien": ["#42145f", "#ffb612", "#a90061", "#777c00", "#f092cd", "#01689b", "#673327", "#e17000", "#f9e11e", "#76d2b6", "#39870c", "#d52b1e", "#94710a", "#8fcae7", "#275937", "#ca005d"], "ECHI": ["#42145f", "#ffb612", "#a90061", "#777c00", "#f092cd", "#01689b", "#673327", "#e17000", "#f9e11e", "#76d2b6", "#39870c", "#d52b1e", "#94710a", "#8fcae7", "#275937", "#ca005d"], "geslacht": ["#01689b", "#ca005d", "#42145f"], "ECHISex": ["#42145f", "#01689b", "#ca005d"], "internationaal": ["#42145f", "#e17000", "#ffb612"], "def": ["#24CBE5", "#64E572", "#FF9655", "#CB2326", "#6AF9C4", "#8FCAE7", "#F092CD", "#DDDF00"], "sex": ["rgba(51,102,204,1)", "rgba(255,80,80,1)"], "sextotal": ["rgba(51,102,204,1)", "rgba(255,80,80,1)", "rgba(5, 151, 72, 1)"], "sextwice": ["rgba(51,102,204,1)", "rgba(255,80,80,1)", "rgba(51,102,204,.8)", "rgba(255,80,80,.8)"], "sex_alternate": ["rgba(51,102,204,1)", "rgba(255,80,80,1)", "rgba(51,102,204,.8)", "rgba(255,80,80,.8)", "rgba(51,102,204,.6)", "rgba(255,80,80,.6)", "rgba(51,102,204,.4)", "rgba(255,80,80,.4)"], "male": ["rgba(51,102,204,1)", "rgba(51,102,204,.8)", "rgba(51,102,204,.6)", "rgba(51,102,204,.4)", "rgba(51,102,204,.2)"], "female": ["rgba(255,80,80,1)", "rgba(255,80,80,.8)", "rgba(255,80,80,.6)", "rgba(255,80,80,.4)", "rgba(255,80,80,.2)"], "countries": ["#006D2C", "#EC7014", "blue"], "countries_series": ["#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#CB2326", "#6AF9C4", "#8FCAE7", "#F092CD"], "countries_specific": { "NEDERLAND": "#e27000", "EU": "#42145f", "EU15": "lightblue" }, "ses": ["#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#CB2326", "#6AF9C4", "#8FCAE7", "#F092CD"], "lifestyle": ["#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#CB2326", "#6AF9C4", "#8FCAE7", "#F092CD"], "divplane": ["#543005", "#8C510A", "#BF812D", "#DFC27D", "#F6E8C3", "#F5F5F5", "#C7EAE5", "#80CDC1", "#35978F", "#01665E", "#003C30"], "line": ["#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#CB2326", "#6AF9C4", "#8FCAE7", "#F092CD"], "divline": ["#67001F", "#B2182B", "#D6604D", "#F4A582", "#FDDBC7", "#F7F7F7", "#D1E5F0", "#92C5DE", "#4393C3", "#2166AC", "#053061"] }, "xAxis": { "labels": { "style": { "fontSize": "10pt", "color": "#000000" } }, "title": { "text": "", "align": "high", "style": { "fontSize": "11pt", "color": "#727272" }, "rotation": 0 }, "lineColor": "#c0d0e0", "lineWidth": 1 }, "yAxis": { "allowDecimals": false, "title": { "text": "", "align": "high", "style": { "fontSize": "11pt", "color": "#727272" }, "rotation": 0, "y": -10 }, "labels": { "align": "right", "x": 0 }, "lineColor": "#c0d0e0", "lineWidth": 1, "gridLineColor": "#c0d0e0", "gridLineDashStyle": "dash", "tickLength": 20 } }


Highcharts.setOptions(Highcharts.vzinfoTheme);