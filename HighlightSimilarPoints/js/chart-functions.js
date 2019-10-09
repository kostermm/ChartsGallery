// vzinfo object contains all props and methods used for rendering ranglijsten
var vzinfo = {

  indicators: ['Doodsoorzaak', 'Verloren levensjaren', 'Verlies gezonde levensjaren', 'Voorkomen', 'Ziektelast', 'Zorgkosten'],
  params: {},
  aandoeningRanglijsten: [],
  aandoeningFilter: {},
  infoTableCaptionPrefix: 'Positie van ',
  infoTableCaptionPostfix: ' in alle ranglijsten',
  infoTableNoData: 'Geen data gevonden voor geselecteerd punt',
  tooltipRowItems: [
    {
      name: 'rank',
      label: 'Positie'
    },
    {
      name: 'y',
      label: 'Aantal'
    }
  ],
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
      "height": null,
      marginTop: 30

    },
    "title": { text: '' },
    "colors": [
      "#e5f0f9"
      // "rgba(0,80,149,0.4)"
    ],
    "xAxis": {
      // "visible": true,
      // "categories": [],
      "lineWidth": 0,
      "tickLength": 0,
      "tickInterval": 1,
      "labels": {
        "align": "center",
        "x": -15,
        "style": {
          "fontWeight": "bold"
        }
      },
      "reversed": true
    },
    "yAxis": {
      visible: false,
      // "opposite": true,
      // "title": {
      //   "text": "Aantal"
      // },
      "labels": {
        enabled: "false",
        "align": "center",
        "formatter": function () {
          return Highcharts.numberFormat(Math.abs(this.value), 0);
          return ''
        }
      },
      // "allowDecimals": false,
      // "tickInterval": 2000
    },
    "tooltip": {
      useHTML: true,
      formatter: function () {
        return vzinfo.tooltipFormatterSimple(this.point);
                }

      // 
    },
    "legend": {
      "enabled": false
    },
    "credits": {
      "enabled": false
    },
    "exporting": {
      "enabled": true,
      buttons:
      {
        contextButton: {
          y: -8
        }
      }
    },
    "plotOptions": {
      "bar": {
        "borderColor": vzinfo.rhs_kleuren.base,
        "pointWidth": 20,
        "pointPadding": 0.05,
        "groupPadding": 0,
        "borderWidth": 2,
        "grouping": false
      },
      "series": {
        "dataLabels": {
          "enabled": true,
          "align": "left",
          "style": {
            "fontSize": "13px",
          },
          "formatter": function () {
            return this.point.name;
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
  // ***** algemeen *****
  "algemeen": {
    "chart": {
      marginLeft: 22
    },
    yAxis: {
      visible: false
    }
  },

  // ***** geslacht *****
  "mannen": {
    "chart": {
      marginLeft: 22
    },
    "xAxis": {
      "labels": {
        "enabled": true
      }
    }
  },
  "vrouwen": {
    "xAxis": {
      "visible": false,
      "labels": {
        "enabled": false
      }
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
  "0-15": {
    "chart": {
      marginLeft: 22
    }
  },
  "15-65": {
    "xAxis": {
      "labels": {
        "enabled": false
      }
    }
  },
  "65plus": {
    "xAxis": {
      "labels": {
        "enabled": false
      }
    }
  }
};

// Define ranglijsten
vzinfo.ranglijsten = {
  algemeen: {
    name: 'algemeen',
    dimensions: ['Totaal'],
    ranglijstFilter: function (item) {
      return (item.geslacht.toLowerCase().trim() == 'totaal'
        && item.leeftijd.toLowerCase().trim() == 'totaal');
    },
    charts: {
      totaal: {
        name: 'totaal',
        title: 'Totaal',
        ranglijst: 'algemeen',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'totaal'
            && item.leeftijd.toLowerCase().trim() == 'totaal'
            && item.positie <= 10
          );
        },
        options: vzinfo.chartConfig.algemeen
      }
    }
  },
  geslacht: {
    name: 'geslacht',
    dimensions: ['Vrouwen', 'Mannen', 'Totaal'],
    ranglijstFilter: function (item) {
      return item.leeftijd.toLowerCase().trim() == 'totaal';
    },
    charts: {
      vrouwen: {
        name: 'vrouwen',
        title: 'Vrouwen',
        ranglijst: 'geslacht',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'vrouwen'
            && item.leeftijd.toLowerCase().trim() == 'totaal'
          );
        },
        options: vzinfo.chartConfig.vrouwen
      },
      mannen: {
        name: 'mannen',
        title: 'Mannen',
        ranglijst: 'geslacht',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'mannen'
            && item.leeftijd.toLowerCase().trim() == 'totaal'
          );
        },
        options: vzinfo.chartConfig.mannen
      }
    }
  },
  leeftijd: {
    name: 'leeftijd',
    dimensions: ['0-15 jaar', '15-65 jaar', '65+', 'Totaal'],
    ranglijstFilter: function (item) {
      return item.geslacht.toLowerCase().trim() == 'totaal';
    },
    charts: {
      '0-15': {
        name: '0-15',
        title: '0- tot 15-jarigen',
        ranglijst: 'leeftijd',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'totaal'
            && item.leeftijd.toLowerCase().trim() == '0-15 jaar'
          );
        },
        options: vzinfo.chartConfig['0-15']
      },
      '15-65': {
        name: '15-65',
        title: '15- tot 65-jarigen',
        ranglijst: 'leeftijd',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'totaal'
            && item.leeftijd.toLowerCase().trim() == '15-65 jaar'
          );
        },
        options: vzinfo.chartConfig['15-65']
      },
      '65plus': {
        name: '65plus',
        title: '65-plussers',
        ranglijst: 'leeftijd',
        chartFilter: function (item) {
          return (item.indicator == vzinfo.params.Indicator
            && item.geslacht.toLowerCase().trim() == 'totaal'
            && item.leeftijd.toLowerCase().trim() == '65+'
          );
        },
        options: vzinfo.chartConfig['65plus']
      }
    }
  },

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
    // Get ranglijst from data attribute
    vzinfo.ranglijst = vzinfo.ranglijsten[$('div.ranglijst.wrapper').data('ranglijst')];
    console.log('- Ranglijst', vzinfo.ranglijst.name + ':', vzinfo.ranglijst);

    // Get indicator from select
    vzinfo.params.Indicator = $('#ranglijst_indicator').val();

    // Set h1 page title
    $('#page-title.title').html('Ranglijst ' + vzinfo.params.Indicator);

    // Full-width containers
    $('div.ranglijst.wrapper').closest('.field-name-field-paragraph-chart').width('100%');
    $('div.ranglijst.wrapper').closest('article.venz_paragraph').find('>h2:not(#page-title)').remove();

    // indicator select event
    $('div.ranglijst.indicator select').change(function () {
      // Clear info table
      $('div.ranglijst div.info-table').remove();

      // Get indicator from select
      vzinfo.params.Indicator = this.value;
      // Set h1 page title
      $('#page-title.title').html('Ranglijst ' + vzinfo.params.Indicator);

      // console.log('Selected indicator:', this.value);

      // Render charts
      vzinfo.renderCharts();

    })

    // Call render functions to render chars for all containers
    vzinfo.renderCharts();
  },

  // Render charts: get indicator & ranglijst, process all ranglijst.charts (append containers, get options, create chart)
  renderCharts: function (indicator) {

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
      chart.options.title.text = chart.title || chart.name
      chart.options.chart.renderTo = 'ranglijst_' + chart.name;

      // Create Chart object, getData & create chart
      chart.Chart = new vzinfo.Chart(chart, vzinfo.ranglijsten.data);
      chart.Chart.getData();
      // Set yAxis.title
      chart.options.yAxis.title = { text: vzinfo.params.Measure };

      chart.Chart.createChart();
    });

    // Add container for info table
    $('div.ranglijst.wrapper').append('<div class="info-table"></div>');

    // Show popup table
    $.each(Highcharts.charts, function (index, chart) {
      if (chart != undefined && chart.series[0] != undefined && chart.series[0].points[0] != undefined) {
        vzinfo.showInfoTable(chart.series[0].points[0]);
        return false;
      }

    });

    // Set h1 page title
    $('#page-title.title').html('Ranglijst ' + vzinfo.params.Indicator + ' in ' + vzinfo.params.Period);
  },

  // Render Info table for selected data point
  showInfoTable: function (point) {
    var aandoening = point.name, data = vzinfo.ranglijsten.data;

    console.log('showInfoTable - ', point);
    // Filter data for this ranglijst
    data = data.filter(vzinfo.ranglijst.ranglijstFilter);

    this.renderTable(aandoening, data);
  },

  // Render info table to show ranking of selected aandoening in other ranglijsten
  renderTable: function (aandoening, arrData) {
    /* Data structure
    [{
      "indicator": "Voorkomen",
      "aandoening": "Nek- en rugklachten",
      "geslacht": "Vrouwen" | "Mannen" | "Totaal"
      "leeftijd": "0- tot 15-jarigen" | "15- tot 65-jarigen" | "65-plussers" | "Totaal",
      "positie": 1,
      "aantal": 1982300,
      "maat": "Jaarprevalentie",
      "jaar": 2015
      },
      ..]
    */
    var vzinfo = this, ranglijst = vzinfo.ranglijst, indicators = vzinfo.indicators, itemFilter = {};
    var thead = '', rows = '', strCaption = vzinfo.infoTableCaptionPrefix + '<strong>' + aandoening + '</strong>' + vzinfo.infoTableCaptionPostfix

    // Filter row of 'aandoening'
    var rankInLists = arrData.filter(function (item, index, filter) {
      return (item.aandoening == aandoening);
    });

    console.log('RenderTable - selected', rankInLists[0]);

    if (rankInLists.length > 0) {
      thead = '<thead><tr><th>Ranglijst</th>';
      // Render column headings for dimensions 
      $.each(vzinfo.ranglijst.dimensions, function (index, item) {
        thead += '<th>' + item + '</th>';
      });
      thead += '</tr></thead><tbody>';


      // Loop indicators to show rank for selected aandoening
      $.each(indicators, function (index, indicator) {
        itemFilter = { indicator: indicator.toLowerCase() };

        // row heading: indicator
        rows += '<tr class="' + (indicator == vzinfo.params.Indicator ? 'highlight' : '') + '"><th>' + indicator
          + ' - ' + vzinfo.getItemProp('jaar', rankInLists, itemFilter) + '</th>';

        // Loop dimensions and get rank
        $.each(vzinfo.ranglijst.dimensions, function (index, dimension) {
          // Create itemFilter dependent on selected ranglijst
          switch (ranglijst.name) {
            case 'algemeen':
              itemFilter.geslacht = 'totaal';
              itemFilter.leeftijd = 'totaal';
            case 'geslacht':
              itemFilter.geslacht = dimension.toLowerCase();
              itemFilter.leeftijd = 'totaal';
              break;
            case 'leeftijd':
              itemFilter.geslacht = 'totaal';
              itemFilter.leeftijd = dimension.toLowerCase();
              break;
          }
          // console.log('renderTable - itemFilter: ', itemFilter);

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
      var boolTrue = true;

      $.each(itemFilter, function (key, value) {
        boolTrue = boolTrue && item[key].toLowerCase() == value;
        // console.log('bolTrue:', boolTrue, 'key/value: ', key, value);
      })

      return boolTrue;
    })
    // if (items.length == 0 || items.length > 1) console.warn('getItemProp - items:', items);
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
    this.title = chart.title;
    this.ranglijst = chart.ranglijst;
    this.chartOptions = chart.options;
    this.chartOptions.chart.renderTo = chart.options.chart.renderTo || this.name; // Use chart name if renderTo not set
    this.dataSet = dataSet;

    // console.log('Chart.init - renderTo:', this.chartOptions.chart.renderTo, ' using dataset:', this.dataSet);

    // Get data from dataSet config to load data array

    this.getData = function () {
      var chart = this, data = chart.dataSet,
        chartOptions = chart.chartOptions, data;

      var series = { name: chart.name, data: [] };
      /* Data structure
      [{
        "indicator": "Voorkomen",
        "aandoening": "Nek- en rugklachten",
        "geslacht": "Vrouwen" | "Mannen" | "Totaal"
        "leeftijd": "0- tot 15-jarigen" | "15- tot 65-jarigen" | "65-plussers" | "Totaal",
        "positie": 1,
        "aantal": 1982300,
        "maat": "Jaarprevalentie",
        "jaar": 2015
        },
        ..]
      */
      var columns = {
        category: 'aandoening',
        value: 'aantal',
        rank: 'positie',
        indicator: 'indicator',
        measure: 'maat',
        period: 'jaar',
        filter: vzinfo.ranglijsten[chart.ranglijst].charts[chart.name].chartFilter
      }
      // Filter column
      if (columns.filter != undefined) {
        data = data.filter(columns.filter);
      }

      // Get period and measure from data
      if (data.length > 0) {
        vzinfo.params.Period = data[0][columns.period];
        vzinfo.params.Measure = data[0][columns.measure].toLowerCase();
      } else {
        vzinfo.params.Period = null;
        vzinfo.params.Measure = '';
      }

      // Fill data array with x/category and for each row
      $.each(data, function (index, item) {
        series.data.push({
          x: item[columns.rank],
          name: item[columns.category],
          y: chart.name == 'vrouwen' ? - item[columns.value] : item[columns.value],
          rank: item[columns.rank],
          indicator: item[columns.indicator],
          measure: item[columns.measure],
          period: item[columns.period]
        });
      });
      

      // Add series to chartOptions
      chartOptions.series = [series];
      console.log('--- Chart.getData', chartOptions, chartOptions.series, vzinfo.maat);
    }

    // create chart
    this.createChart = function () {

      this.chart = new Highcharts.Chart(this.chartOptions);

    }
  },

  tooltipFormatterSimple: function (thisPoint) {

    return '<strong>' + thisPoint.name + '</strong> (' + thisPoint.measure + '): ' 
      + Highcharts.numberFormat(Math.abs(thisPoint.y), 0);
  },

  tooltipFormatter: function (thisPoint) {

    if (thisPoint != undefined) {
      var pointName = thisPoint.name,
        points = [], rows = '';

      var tooltipHead = '<em>Ranglijst: ' + thisPoint.indicator + ' in '
        + thisPoint.period + '</em>'
        + '<br/><strong><large>' + thisPoint.name + '</large></strong>'
        + '<br/>Maat: ' + thisPoint.measure
        + '<br/>'

      // Get points in all charts with same 'name'
      $.each(Highcharts.charts, function (index, chart) {
        if (chart != undefined) {
          $.each(chart.series, function () {
            $.each(this.data, function () {
              if (this.name == pointName) {
                points.push(this);
  }
            })
          })
        }
      })

      // header row with empty first cell
      rows += '<table><thead><tr><td></td>';
      // Loop series of available points 
      $.each(points, function (index, point) {
        rows += '<th>' + point.series.name + '</th>';
      })
      rows += '</tr></thead><tbody>';

      // Add row items to tooltip table
      $.each(vzinfo.tooltipRowItems, function (index, rowItem) {
        rows += '<tr><th>' + rowItem.label + '</th>';

        $.each(points, function (index, point) {
          rows += '<td class="number">' + Highcharts.numberFormat(Math.abs(point[rowItem.name]), 0) + '</td>';
        })
        rows += '</tr>'
});
      // Finalize table row
      rows += '</tbody></table>';

      return tooltipHead + rows;
    }
  }
});
