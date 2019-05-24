// chart-functions.js start ***************

// vzinfo object contains all props and methods used for rendering ranglijsten
var vzinfo = {

  indicators: ['Incidentie', 'Doodsoorzaken', 'Verloren levensjaren', 'Verlies van gezonde levensjaren', 'Ziektelast', 'Zorgkosten'],
  aandoeningRanglijsten: [],
  aandoeningFilter: {},
  infoTableCaptionPrefix: 'Positie in alle ranglijsten:',
  infoTableNoData: 'Geen data gevonden voor geselecteerd punt',

  rhs_kleuren: {
    base: '#01689b',
    lighter: '#cce0f1',
    lightest: '#e5f0f9'
  }
}
vzinfo.chartConfig = {
  "basis":
  {
    "chart": {
      "type": "bar",
      "height": null
    },
    "title": { text: '' },
    "colors": [
      "white"
      // "rgba(0,80,149,0.4)"
    ],
    "xAxis": {
      "visible": true,
      "categories": [],
      "lineWidth": 0,
      "tickLength": 0,
      "labels": {
        "enabled": false,
      },
      "reversed": true
    },
    "yAxis": {
      "opposite": true,
      "title": {
        "text": "Aantal"
      },
      "labels": {
        "align": "center",
        "formatter": function () { return Highcharts.numberFormat(Math.abs(this.value), 0); }
      },
      "allowDecimals": false,
      "tickInterval": 2000
    },
    "tooltip": {
      formatter: function () {
        return '<strong><large>' + this.point.name + '</large></strong>'
          + '<br>Aantal: ' + Highcharts.numberFormat(Math.abs(this.y), 0)
          + (this.point.rank != undefined ? '<br>Positie: ' + this.point.rank : '')
          + '<br>Indicator: ' + this.point.indicator;
      }
    },
    "legend": {
      "enabled": false
    },
    "credits": {
      "enabled": false
    },
    "exporting": {
      "enabled": true
    },
    "plotOptions": {
      "bar": {
        "borderColor": vzinfo.rhs_kleuren.base,
        "pointWidth": 20,
        "pointPadding": 0,
        "groupPadding": 0,
        "borderWidth": 2,
        "grouping": false
      },
      "series": {
        "pointPadding": 0.05,
        "dataLabels": {
          "enabled": true,
          "align": "left",
          "style": {
            "fontSize": "13px",
          },
          "formatter": function () {
            return this.point.name; // + ': ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
          }
        },
        "animation": {
          "duration": 500
        },
        "point": {
          "events": {
            "mouseOver": function (event) {
              vzinfo.syncHighlight(event);
            },
            "mouseOut": function (event) {
              vzinfo.syncHighlight(event);
            },
            "click": function (event) {
              vzinfo.showInfoTable(this);
            }
          }
        }
      }
    }
  },

  // ***** geslacht *****
  "mannen": {
    "yAxis": {
      "min": 0,
      "max": 14000,
    }
  },
  "vrouwen": {
    "yAxis": {
      "min": -14000,
      "max": 0,
    },
    "exporting": {
      "enabled": false
    },
    "plotOptions": {
      "series": {
        "dataLabels": {
          "align": "right"
        }
      }
    }
  },

  // ***** leeftijd *****
  "0-15": {},
  "15-65": {},
  "65plus": {}
};

// Define ranglijsten
vzinfo.ranglijsten = {
  geslacht: {
    name: 'geslacht',
    dimensions: ['Vrouwen', 'Mannen', 'Totaal'],
    charts: {
      vrouwen: {
        name: 'vrouwen',
        dataFilter: function (item, geslacht) {
          return item.geslacht == geslacht;
        },
        options: vzinfo.chartConfig.vrouwen
      },
      mannen: {
        name: 'mannen',
        dataFilter: function (item, geslacht) {
          return item.geslacht == geslacht;
        },
        options: vzinfo.chartConfig.mannen
      }
    }
  },
  leeftijd: {
    name: 'leeftijd',
    dimensions: ['0- tot 15-jarigen', '15- tot 65-jarigen', '65-plussers', 'Totaal'],
    charts: {
      '0-15': {
        name: '0-15',
        label: '0- tot 15-jarigen',
        dataFilter: function (item, geslacht) {
          return item.leeftijd == geslacht;
        },
        options: vzinfo.chartConfig['0-15']
      },
      '15-65': {
        name: '15-65',
        label: '15- tot 65-jarigen',
        dataFilter: function (item, dimensie) {
          return item.leeftijd == dimensie;
        },
        options: vzinfo.chartConfig['15-65']
      },
      '65plus': {
        name: '65plus',
        label: '65-plussers',
        dataFilter: function (item, dimensie) {
          return item.leeftijd == dimensie;
        },
        options: vzinfo.chartConfig['65plus']
      }
    }
  },
  totaal: {}
};

// Methods
$.extend(true, vzinfo, {
  // Function for synchronized highlighting of data points with equal property
  syncHighlight: function (event) {
    eventType = event.type;

    // event objects
    point = event.target;
    series = point.series;
    chart = series.chart;

    highlightColor = 'rgba(255,165,0,0.6)';//'orange';
    if (eventType == 'mouseOut') highlightColor = series.options.color;
    // if(point.color != series.color) 
    //   highlightColor = series.options.color;
    // }
    highlightStyle = { color: highlightColor };
    dimmStyle = { brightness: 0.5 };
    // event indices
    pointIndex = point.index;
    seriesIndex = series.index;
    chartIndex = chart.index;

    seriesCount = event.target.series.chart.series.length;
    // console.log(eventType + ' chart: ' + chartIndex + ' series: ' + seriesIndex + ' point: ' + pointIndex);

    // Highlight points in all series with same 'name'
    $.each(Highcharts.charts, function (index, chart) {
      if (chart != undefined) {
        $.each(chart.series, function () {
          $.each(this.data, function () {
            if (this.name == point.name || eventType == 'mouseOut') {
              if (eventType == 'mouseOut') highlightColor = undefined;   //this.series.color;
              highlightStyle = { color: highlightColor };
              this.update(highlightStyle, true, false);
            } else {
              // this.update({color: 'lightgray'}, true, false);
            }
          })
        })
      }
    })

  },

  // Initialize ranglijst: styling, events, rendering
  init: function () {
    // Full-width containers
    $('div.ranglijst.wrapper').closest('.field-name-field-paragraph-chart').width('100%');

    // indicator select event
    $('div.ranglijst.indicator select').change(function () {
      // Clear info table
      $('div.ranglijst div.info-table').remove();

      console.log('Selected indicator:', this.value);
      vzinfo.renderCharts();
    })

    // Call render functions to render chars for all containers
    vzinfo.renderCharts();
  },

  // Render charts: get indicator & ranglijst, process all ranglijst.charts (append containers, get options, create chart)
  renderCharts: function (indicator) {
    // Get indicator from select
    vzinfo.paramIndicator = indicator || $('#ranglijst_indicator').val();
    // Get ranglijst from data attribute
    vzinfo.ranglijst = vzinfo.ranglijsten[$('div.ranglijst.wrapper').data('ranglijst')];
    console.log('- Ranglijst', vzinfo.ranglijst.name + ':', vzinfo.ranglijst);

    // Process charts of ranglijst
    $.each(vzinfo.ranglijst.charts, function (key, chart) {
      console.log('-- Chart', key + ':', chart);

      // add chart container if not present
      if ($('div.ranglijst.wrapper #ranglijst_' + chart.name).length == 0) {
        $('div.ranglijst.wrapper').append('<div id="ranglijst_' + chart.name + '" class="chart-container"></div>');
      }

      // Merge basis and specific config
      $.extend(true, chart.options, vzinfo.chartConfig.basis);

      // Set parameters of chart options
      chart.options.title.text = chart.label || chart.name
      chart.options.chart.renderTo = 'ranglijst_' + chart.name;

      // Create Chart object, getData & create chart
      chart.Chart = new vzinfo.Chart(chart, vzinfo.ranglijst.data);
      chart.Chart.getData();
      chart.Chart.createChart();
    });

    // Add container for info table
    $('div.ranglijst.wrapper').append('<div class="info-table"></div>');
  },

  // Render Info table for selected data point
  showInfoTable: function (point) {
    var aandoening = point.name, data = vzinfo.ranglijst.data;

    this.renderTable(aandoening, data);
  },

  // Render info table to show ranking of selected aandoening in other ranglijsten
  renderTable: function (aandoening, arrData) {
    /* Data structure
    [{
     "indicator": "Doodsoorzaken",
     "leeftijd": "0- tot 15-jarigen" | "15- tot 65-jarigen" | "65-plussers" | "totaal",   of  "geslacht": "vrouwen" | "mannen" | "totaal"
     "aandoening": "Dementie",
     "aantal": 10719,
     "positie": 1
   },, ..]
  */
    var vzinfo = this, ranglijst = vzinfo.ranglijst, indicators = vzinfo.indicators, itemFilter = {};
    var thead = '', rows = '', strCaption = vzinfo.infoTableCaptionPrefix + '<br/><strong>' + aandoening + '</strong>'

    // Filter row of 'aandoening'
    var rankInLists = arrData.filter(function (item, index, filter) {
      return (item.aandoening == aandoening);
    });

    console.log('RenderTable - selected', rankInLists[0]);

    if (rankInLists.length > 0) {
      thead = '<thead><tr><th>Indicator</th>';
      // Render column headings for dimensions 
      $.each(vzinfo.ranglijst.dimensions, function (index, item) {
        thead += '<th class="number">' + item + '</th>';
      });
      thead += '</tr></thead><tbody>';


      // Loop indicators to show rank for selected aandoening
      $.each(indicators, function (index, indicator) {
        itemFilter = { indicator: indicator };

        // row heading: indicator
        rows += '<tr class="' + (indicator == vzinfo.paramIndicator ? 'highlight' : '') + '"><th>' + indicator + '</th>';

        // Loop dimensions and get rank
        $.each(vzinfo.ranglijst.dimensions, function (index, item) {
          itemFilter[ranglijst.name] = item;
          rows += '<td class="number">' + vzinfo.getItemProp('positie', rankInLists, itemFilter)
        })
        rows += '</tr>';
      });
      rows += '</tbody>';
    } else { // Show no data is found
      strCaption += '<br/><br/><em>' + vzinfo.infoTableNoData + '</em>';
    }

    $('div.info-table').html('<table><caption>' + strCaption + '</caption>'
      + thead + rows + '</table>');
  },

  // Get specified property of filtered item
  getItemProp: function (prop, arrItems, itemFilter) {
    var items = [];
    /*
      itemFilter = { Indicator: filterValue, ranglijst_name: filterValue}
    */
    items = arrItems.filter(function (item, index) {
      return (item.indicator.toLowerCase() == itemFilter.indicator.toLowerCase()) &&
        (item[vzinfo.ranglijst.name].toLowerCase() == itemFilter[vzinfo.ranglijst.name].toLowerCase());
    })
    return (items[0] != undefined && items[0][prop] != undefined) ? items[0][prop] : '';

  },

  renderSlider: function (value) { // Render SVG slider
    var height = 20, length = 100, svgWidth = length + 5 + (height / 3);
    var strSVG = '<svg width="' + svgWidth + '" height="' + height + '">' +
      '<line id="e1_line" x1="0" y1="' + height / 2 + '" x2="' + length + '" y2="' + height / 2 + '" style="stroke:black;fill:none;stroke-width:1px;"/>' +
      '<circle id="e2_circle" cx="' + value * (length / 10) + '" cy="' + height / 2 +
      '" style="fill:none;stroke:green;stroke-width:4px;" r="' + height / 3 + '"/>' +
      '</svg>';

    return strSVG;
  },

  /* Chart object definition
  |   Params: dataSet, chart
  |   Properties: name, chart, chartOptions, dataSet
  |   Methods:    getData, createChart
  */
  Chart: function (chart, dataSet) {
    this.name = chart.name;
    this.label = chart.label;
    this.chartOptions = chart.options;
    this.chartOptions.chart.renderTo = chart.options.chart.renderTo || this.name; // Use chart name if renderTo not set
    this.dataSet = dataSet;

    console.log('Chart.init - renderTo:', this.chartOptions.chart.renderTo, ' using dataset:', this.dataSet);

    // Get data from dataSet config to load data array
    this.getData = function () {
      var chart = this, data = chart.dataSet,
        chartOptions = chart.chartOptions, data;

      var series = { name: chart.name, data: [] };
      var columns = {
        category: 'aandoening',
        value: 'aantal',
        rank: 'positie',
        indicator: 'indicator',
        filter: function (item, index, filter) {
          return ((item.indicator == vzinfo.paramIndicator) && (item[vzinfo.ranglijst.name].toLowerCase() == (chart.label || chart.name)));
        }
      }
      // Filter column
      if (columns.filter != undefined) {
        data = data.filter(columns.filter);
      }

      // Fill data array with x/category and for each row
      $.each(data, function (index, item) {
        series.data.push({
          name: item[columns.category],
          y: chart.name == 'vrouwen' ? - item[columns.value] : item[columns.value],
          rank: item[columns.rank],
          indicator: item[columns.indicator]
        });
      });

      // Add series to chartOptions
      chartOptions.series = [series];
      console.log('Chart.getData', chartOptions, chartOptions.series);
    }

    // create chart
    this.createChart = function () {

      this.chart = new Highcharts.Chart(this.chartOptions);

    }
  }
});

// ***** Data *****

vzinfo.ranglijsten.geslacht.data = [
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Prostaatkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Vrouwen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Mannen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "geslacht": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  }
]

vzinfo.ranglijsten.leeftijd.data = [
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Prostaatkanker",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Borstkanker",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Prostaatkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Dementie",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Longkanker",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Beroerte",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Coronaire hartziekten",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Hartfalen",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "COPD",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Dikkedarmkanker",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Doodsoorzaken",
    "leeftijd": "Totaal",
    "aandoening": "Accidentele val",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Incidentie",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Verlies van gezonde levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Verloren levensjaren",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Ziektelast",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dementie",
    "aantal": 10719,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Beroerte",
    "aantal": 5421,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 4509,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Longkanker",
    "aantal": 4257,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "COPD",
    "aantal": 3363,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 3350,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 2408,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2326,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "0- tot 15-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 2085,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Longkanker",
    "aantal": 6134,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dementie",
    "aantal": 5259,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Coronaire hartziekten",
    "aantal": 4983,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Beroerte",
    "aantal": 3935,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "COPD",
    "aantal": 3759,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Hartfalen",
    "aantal": 3180,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Prostaatkanker",
    "aantal": 2862,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Dikkedarmkanker",
    "aantal": 2771,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 1684,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "15- tot 65-jarigen",
    "aandoening": "Accidentele val",
    "aantal": 1623,
    "positie": 10
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Dementie",
    "aantal": 16853,
    "positie": 1
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Longkanker",
    "aantal": 10680,
    "positie": 2
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Beroerte",
    "aantal": 9492,
    "positie": 3
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Coronaire hartziekten",
    "aantal": 8192,
    "positie": 4
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Hartfalen",
    "aantal": 7122,
    "positie": 5
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "COPD",
    "aantal": 6530,
    "positie": 6
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Dikkedarmkanker",
    "aantal": 5968,
    "positie": 7
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Accidentele val",
    "aantal": 5179,
    "positie": 8
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Infecties van de onderste luchtwegen",
    "aantal": 4010,
    "positie": 9
  },
  {
    "indicator": "Zorgkosten",
    "leeftijd": "65-plussers",
    "aandoening": "Borstkanker",
    "aantal": 3106,
    "positie": 10
  }
];

// chart-functions.js end ***************

// Initialize ranglijsten and render charts
vzinfo.init();
