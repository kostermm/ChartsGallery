// chart-functions.js start ***************
// vzinfo object contains all props and methods used for rendering ranglijsten
var vzinfo = {
  rhs_kleuren: {
    base: '#01689b',
    lighter: '#cce0f1',
    lightest: '#e5f0f9'
  },
  indicators: ['Incidentie', 'Doodsoorzaken', 'Verloren levensjaren', 'Verlies van gezonde levensjaren', 'Ziektelast', 'Zorgkosten'],
  aandoeningRanglijsten: [],
  aandoeningFilter: {},
  strInfoTable: 'Aandoening;Incidentie;Doodsoorzaken;Verloren levensjaren;verlies van gezonde levensjaren;ziektelast;zorgkosten\nLongkanker;1;1;4;2;9;1\nDementie;8;2;6;5;4;2\nCoronaire hartziekten;6;7;2;10;8;3\nBeroerte;7;6;10;8;7;7\nCOPD;4;8;1;7;2;9\nHartfalen;9;9;5;9;6;5\nProstaatkanker;3;10;3;6;5;6\nDikkedarmkanker;5;5;7;3;10;4\nInfecties van de onderste luchtwegen;2;4;8;4;1;8\nAccidentele val;10;3;9;1;3;10',
  dataSets: {
    geslacht: {
    },
    leeftijd: {
      data: []
    }
  },

}
vzinfo.chartConfig = {
  "ranglijst_basis":
  {
    "chart": {
      "type": "bar",
      "height": null
    },
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
        "text": "Aantal sterfgevallen"
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

  // ***** male *****
  "ranglijst_mannen": {
    "chart": {
      "renderTo": "ranglijst_mannen"
    },
    "title": {
      "text": "mannen"
    },
    "yAxis": {
      "min": 0,
      "max": 14000,
    },

    "plotOptions": {
      "series": {
        "dataLabels": {
          "align": "left"
        }
      }
    }
  },

  // ***** female *****
  "ranglijst_vrouwen": {
    "chart": {
      "renderTo": "ranglijst_vrouwen"
    },
    "title": {
      "text": "vrouwen"
    },
    "yAxis": {
      "min": -14000,
      "max": 0,
    },
    "plotOptions": {
      "series": {
        "dataLabels": {
          "align": "right"
        }
      }
    },
    "exporting": {
      "enabled": true
    }
  }
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

  charts: {
    mannen: {
      name: 'mannen',
      datasetName: 'geslacht',
      dataFilter: function (item, geslacht) {
        return item.Geslacht == geslacht;
      },
      options: vzinfo.chartConfig.ranglijst_mannen
    },
    vrouwen: {
      name: 'vrouwen',
      datasetName: 'geslacht',
      dataFilter: function (item, geslacht) {
        return item.Geslacht == geslacht;
      },
      options: vzinfo.chartConfig.ranglijst_vrouwen
    }
  },

  init: function() {
    // Full-width containers
    $('div.ranglijst .chart-container').closest('.field-name-field-paragraph-chart').width('100%');

    // indicator select event
    $('div.ranglijst.indicator select').change(function(){
      // Clear info table
      $('div.ranglijst div.info-table').html('');

      console.log('Selected indicator:', this.value);
      vzinfo.renderCharts();
    })
    
    // Call render functions to render chars for all containers
    vzinfo.renderCharts();
  },

  renderCharts: function (indicator) {
    /* Rendering all R Charts by looping all htmlwidget containers, 
    |  find correspondig R-config object (script.json) and render chart 
    
    */
    vzinfo.paramIndicator = indicator || $('#ranglijst_indicator').val();

    $('div.ranglijst .chart-container').each(function (index, value) {
      var id = $(this).attr('id').replace('ranglijst_', ''),
        thisChart = vzinfo.charts[id];

      console.log('div' + index + ':' + id);
      // Merge basis and specific config
      $.extend(true, thisChart.options, vzinfo.chartConfig['ranglijst_basis']);

      thisChart.Chart = new vzinfo.Chart(vzinfo.charts[id], vzinfo.dataSets[thisChart.datasetName], {});
      thisChart.Chart.getData();
      thisChart.Chart.createChart();

    });
  },

  showInfoTable: function (point) {
    var aandoening = point.name,
      selectedChart = vzinfo.charts[point.series.name],
      dataSet = vzinfo.dataSets[selectedChart.datasetName];

    if (vzinfo.aandoeningRanglijsten.length == 0) {
      console.log('Infotable - ', aandoening, selectedChart)

      // vzinfo.aandoeningRanglijsten = this.CSVToArray(vzinfo.strInfoTable, ';');
    }
    this.renderTable(aandoening, dataSet.data);
  },

  /*
  [{
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  }, ..]
*/
  // Render info table to show ranking of selected aandoening in other ranglijsten
  renderTable: function (aandoening, arrData) {
    var vzinfo = this,
      indicators = vzinfo.indicators;

    // Filter row of 'aandoening'
    var rankInLists = arrData.filter(function (item, index, filter) {
      return (item.Aandoening == aandoening);
    });
    var rows = '', strCaption = '';

    console.log('RenderTable - selected', rankInLists[0]);

    if (rankInLists.length > 0) {
      strCaption = 'Positie in alle ranglijsten van <br/><strong> ' + aandoening + '</strong>'
      rows = '<tr><th>Indicator</th><th>Mannen</th><th>Vrouwen</th><th>Totaal</th></tr>';

      // Loop ranking of selected aandoening
      $.each(indicators, function (index, indicator) {
          rows += '<tr class="' + (indicator == vzinfo.paramIndicator ? 'highlight' : '') + '"><th>' + indicator +
            '</th><td class="number">' + vzinfo.getItem(rankInLists, 'Positie', { Indicator: indicator, Geslacht: 'Mannen'}) +
            '</td><td class="number">' + vzinfo.getItem(rankInLists, 'Positie', { Indicator: indicator, Geslacht: 'Vrouwen'}) +
            '</td><td class="number">' + vzinfo.getItem(rankInLists, 'Positie', { Indicator: indicator, Geslacht: 'Totaal'}) +
            '</td></tr>';
      });
    } else {
      strCaption = 'Positie in alle ranglijsten van <strong> ' + aandoening + '</strong>: Geen data gevonden';
    }

    $('div.info-table').html('<table><caption>' + strCaption + '</caption>' + rows + '</table>');
  },
  
  getItem: function(arrItems, prop, filter){
    var items = [];
    /*
      filter = { Indicator: 'Incidentie', Geslacht: 'Mannen'}
    */
    items = arrItems.filter(  function (item, index) {
      return (item.Indicator.toLowerCase() == filter.Indicator.toLowerCase()) && (item['Geslacht'].toLowerCase() == filter.Geslacht.toLowerCase());
    })
    return (items[0] != undefined && items[0][prop] !=undefined) ? items[0][prop] : '';

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
  Chart: function (chart, dataSet, filter) {
    this.name = chart.name;
    this.chartOptions = chart.options;
    this.chartOptions.chart.renderTo = chart.options.chart.renderTo || this.name; // Use chart name if renderTo not set
    this.dataSet = dataSet || vzinfo.dataSets[this.name]; // Use chart name for dataset if dataset undefined

    console.log('Chart.init - renderTo:', this.chartOptions.chart.renderTo, ' using dataset', this.dataSet.name);

    // Get data from dataSet config to load data array
    this.getData = function () {
      var chart = this, ds = chart.dataSet,
        chartOptions = chart.chartOptions, data;

      var series = { name: chart.name, data: [] };
      var columns = {
        series: 'Geslacht',
        category: 'Aandoening',
        value: 'Aantal',
        rank: 'Positie',
        indicator: 'Indicator',
        filter: function (item, index, filter) {
          return (item.Indicator == vzinfo.paramIndicator) && (item['Geslacht'].toLowerCase() == chart.name);
        }
      }
      // Filter column
      if (columns.filter != undefined) {
        data = ds.data.filter(columns.filter);
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

vzinfo.dataSets.geslacht.data = [
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Prostaatkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Doodsoorzaken",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 3106,
    "Positie": 10
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Incidentie",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 10
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Verlies van gezonde levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 10
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Verloren levensjaren",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 10
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Ziektelast",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 10
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dementie",
    "Aantal": 10719,
    "Positie": 1
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Beroerte",
    "Aantal": 5421,
    "Positie": 2
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Hartfalen",
    "Aantal": 4509,
    "Positie": 3
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Longkanker",
    "Aantal": 4257,
    "Positie": 4
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "COPD",
    "Aantal": 3363,
    "Positie": 5
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 3350,
    "Positie": 6
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 7
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Accidentele val",
    "Aantal": 2408,
    "Positie": 8
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2326,
    "Positie": 9
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Vrouwen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 2085,
    "Positie": 10
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Longkanker",
    "Aantal": 6134,
    "Positie": 1
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Dementie",
    "Aantal": 5259,
    "Positie": 2
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 4983,
    "Positie": 3
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Beroerte",
    "Aantal": 3935,
    "Positie": 4
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "COPD",
    "Aantal": 3759,
    "Positie": 5
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Hartfalen",
    "Aantal": 3180,
    "Positie": 6
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Prostaatkanker",
    "Aantal": 2862,
    "Positie": 7
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 2771,
    "Positie": 8
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 1684,
    "Positie": 9
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Mannen",
    "Aandoening": "Accidentele val",
    "Aantal": 1623,
    "Positie": 10
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Dementie",
    "Aantal": 16853,
    "Positie": 1
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Longkanker",
    "Aantal": 10680,
    "Positie": 2
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Beroerte",
    "Aantal": 9492,
    "Positie": 3
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Coronaire hartziekten",
    "Aantal": 8192,
    "Positie": 4
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Hartfalen",
    "Aantal": 7122,
    "Positie": 5
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "COPD",
    "Aantal": 6530,
    "Positie": 6
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Dikkedarmkanker",
    "Aantal": 5968,
    "Positie": 7
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Accidentele val",
    "Aantal": 5179,
    "Positie": 8
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Infecties van de onderste luchtwegen",
    "Aantal": 4010,
    "Positie": 9
  },
  {
    "Indicator": "Zorgkosten",
    "Geslacht": "Totaal",
    "Aandoening": "Borstkanker",
    "Aantal": 3106,
    "Positie": 10
  }
]

// chart-functions.js end ***************

// Styling of Drupal parent elements
$('div.ranglijst.chart-container').closest('.field-name-field-paragraph-chart').width('100%');

// Initialize ranglijsten and render charts
vzinfo.init();
