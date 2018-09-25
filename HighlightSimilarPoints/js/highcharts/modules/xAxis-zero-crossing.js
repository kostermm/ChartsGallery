/**
 * Highcharts plugin for xAxis vertical centering
 *
 * @Date: 2014-03-31
 * @Author: Pavlos Polianidis
 */

(function (H) {
    H.wrap(H.Axis.prototype, 'render', function (proceed) {
        if (!this.isXAxis) { return; }

        var chart = this.chart,
            xAxis, yAxis, extremes, crossing;

        if (typeof this.options.zeroCrossing === 'boolean') {
            xAxis = chart['xAxis'][0];
            yAxis = chart['yAxis'][0];
            extremes = yAxis.getExtremes();
            crossing = Math.abs(extremes.min) + Math.abs(extremes.max);
            this.offset = yAxis.toPixels(crossing, true);
            chart.axisOffset[this.side] = 10;

            // set the labels offset
            xAxis.options.labels.y = -this.offset;
        }
        proceed.call(this);

    });

}(Highcharts));