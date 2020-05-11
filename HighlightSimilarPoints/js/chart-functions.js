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
  colors: {
    rhs_kleuren: {
      /* 
        $purple:                    #42145f !default;
        $purple-light:              #c6b8cf !default;
        $purple-lightest:           #e3dce7 !default;
      */
      base: '#42145f',
      lighter: '#c6b8cf',
      lightest: '#e3dce7'
    },
    /*
      $dark-yellow:               #ffb612 !default;
      $dark-yellow-light:         #ffe9b7 !default;
      $dark-yellow-lightest:      #fff4dc !default;
    */
    highlightColor: '#ffe9b7', // '#f6d4b2', // 'rgba(255,165,0,0.6)',
    selectColor: '#ffb612', // '#fbead9' //'orange';
  },
  chartLayout: {
    rankMargin: 25,
    dataLabelWidth: 130,
    tooltipOffsetY: 35
  }
}

vzinfo.chartConfig = {
  "basis":
  {
    "chart": {
      "type": "bar",
      "height": null,
      "marginTop": 30,
      // "borderWidth": 1
    },
    "title": {
      "text": '',
      "align": 'center'
    },
    "colors": [vzinfo.colors.rhs_kleuren.lightest],
    "xAxis": {
      // "visible": true,
      // "categories": [],
      "type": "category",
      "max": 9,
      "lineWidth": 0,
      "tickLength": 0,
      "tickInterval": 1,
      "labels": {
        // "enabled": true,
        "align": "center",
        "x": -15,
        "style": {
          "fontWeight": "bold"
        }
      },
      "reversed": true
    },
    "yAxis": {
      "visible": true,
      // Title set from data
      // "title": {
      //   "text": "Aantal"
      // },
      "labels": {
        "enabled": true,
        "align": "center",
        "formatter": function () {
          if (this.isLast || this.isFirst) {
            return Highcharts.numberFormat(Math.abs(this.value), 0);
          }
        }
      },
      // "allowDecimals": false,
      // "tickInterval": 2000
      gridLineWidth: 0
    },
    "tooltip": {
      "useHTML": true,
      "backgroundColor": 'white',
      "formatter": function () {
        return vzinfo.tooltipFormatterSimple(this.point);
      },
      /* positioner:
          A callback function to place the tooltip in a default position. The callback receives three parameters: labelWidth, labelHeight and point, where point contains values for plotX and plotY telling where the reference point is in the plot area. Add chart.plotLeft and chart.plotTop to get the full coordinates.
          The return should be an object containing x and y values, for example { x: 100, y: 100 }.
      */
      positioner: function (labelWidth, labelHeight, point) {
        // console.log('TooltipPositioner',  arguments, point);
        return { x: 0, y: point.plotY + vzinfo.chartLayout.tooltipOffsetY };
      },
      // Reset svg settings to only use html styling
      borderRadius: 0,
      borderWidth: 0,
      shadow: false,
      enabled: true,
      backgroundColor: 'none',
      style: {
        whiteSpace: 'normal'
      }
    },
    "legend": {
      "enabled": false
    },
    "credits": {
      "enabled": false
    },
    "exporting": {
      "enabled": false,
      buttons:
      {
        contextButton: {
          y: -8
        }
      }
    },
    "plotOptions": {
      "bar": {
        "borderColor": vzinfo.colors.rhs_kleuren.base,
        "pointWidth": 20,
        "pointPadding": 0.05,
        "groupPadding": 0,
        "borderWidth": 2,
        "grouping": false
      },
      "series": {
        /*
          Desired CSS style
          .highcharts-data-labels div span {
              z-index: 0 !important;
              overflow: hidden;
              text-overflow: ellipsis;
              height: 1.1em;
              white-space: nowrap;
          }
        */

        "dataLabels": {
          "enabled": true,
          "useHTML": true,
          // "align": "right",
          "style": {
            "fontSize": "13px",
            "width": vzinfo.chartLayout.dataLabelWidth + "px",
            "height": "15px",
            "textOverflow": "ellipsis",
            // "whiteSpace": "nowrap",
            "overflow": "hidden"
            /* CSSObject: https://api.highcharts.com/class-reference/Highcharts.CSSObject
            textOverflow :string|undefined  Line break style of the element text. Highcharts SVG elements support ellipsis when a width is set.

            whiteSpace :string|undefined  Line break style of the element text.

          */
          },
          "formatter": function () { // Only show Aandoening
            return this.point.aandoening;
          },
          // "overflow": "justify", // "allow" | "justify" How to handle data labels that flow outside the plot area. The default is "justify", which aligns them inside the plot area. For columns and bars, this means it will be moved inside the bar. To display data labels outside the plot area, set crop to false and overflow to "allow".
          // "crop": false,
          "inside": true // For points with an extent, like columns or map areas, whether to align the data label inside the box or to the actual value point. Defaults to false in most cases, true in stacked columns.


        },
        "animation": {
          "duration": 500
        },
        states: {
          hover: {
            animation: {
              duration: 0
            },
            color: vzinfo.colors.highlightColor,
            brightness: 0
          },
          select: {
            animation: {
              duration: 0
            },
            color: vzinfo.colors.selectColor,
            borderColor: null,
            brightness: 0
          },
          normal: {
            animation: false
          }
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
              vzinfo.syncHighlight(event);
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
      "marginLeft": vzinfo.chartLayout.rankMargin,
      "width": 305
    },
    "yAxis": {
      "title": {
        "align": "low"
      }
    }
  },

  // ***** geslacht *****
  "mannen": {
    "chart": {
      "marginLeft": vzinfo.chartLayout.rankMargin,
      "width": 305
    },
    "xAxis": {
      "labels": {
        "enabled": true
      }
    },
    "yAxis": {
      "title": {
        "align": "low"
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
  "vrouwen": {
    "chart": {
      "width": 280
    },
    "xAxis": {
      "visible": false,
      "labels": {
        "enabled": false
      }
    },
    "yAxis": {
      "title": {
        "align": "high"
      }
    },
    "plotOptions": {
      "series": {
        "dataLabels": {
          "align": "left"
        }
      }
    }
  },

  // ***** leeftijd *****
  "0-15": {
    "chart": {
      "marginLeft": vzinfo.chartLayout.rankMargin,
    },
    "yAxis": {
      "title": {
        "align": "low"
      }
    }
  },
  "15-65": {
    "chart": {
      "marginLeft": vzinfo.chartLayout.rankMargin,
    },
    "yAxis": {
      "title": {
        "align": "low"
      }
    }
  },
  "65plus": {
    "chart": {
      "marginLeft": vzinfo.chartLayout.rankMargin,
    },
    "yAxis": {
      "title": {
        "align": "low"
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
  }
};

// Methods
$.extend(true, vzinfo, {
  // Function for synchronized highlighting of data points with equal property
  syncHighlight: function (event) {
    var eventType = event.type;

    // event objects
    var point = event.target, series = point.series, chart = series.chart,
      highlightColor = (eventType == 'mouseOut') ? series.options.color : vzinfo.colors.highlightColor;

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

    // Highlight points in all series with same 'aandoening'
    $.each(Highcharts.charts, function (index, chart) {
      if (chart != undefined) {
        $.each(chart.series, function () {
          $.each(this.data, function () {
            if (this.aandoening == point.aandoening || eventType == 'mouseOut') {
              if (eventType == 'mouseOut') highlightColor = undefined;   //this.series.color;
              highlightStyle = { color: highlightColor };
              this.update(highlightStyle, true, false);
              if (eventType == 'click') this.select(true);
            } else if (this.aandoening != point.aandoening && eventType == 'click') {
              this.select(false);
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
      // Set yAxis.title & disable labels
      chart.options.yAxis.title.text = vzinfo.params.Measure;
      // chart.options.yAxis.labels = { enabled: false };

      chart.Chart.createChart();
    });

    // Add container for info table
    $('div.ranglijst.wrapper').append('<div class="info-table"></div>');

    // Show popup table after chart render
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
    var aandoening = point.aandoening, data = vzinfo.ranglijsten.data;

    // Select point
    point.select();
    // select points in all series with same 'aandoening'
    $.each(Highcharts.charts, function (index, chart) {
      if (chart != undefined) {
        $.each(chart.series, function () {
          $.each(this.data, function () {
            if (this.aandoening == point.aandoening) this.select(true);
          })
        })
      }
    })

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
          name: item[columns.rank],
          aandoening: item[columns.category],
          y: chart.name == 'vrouwen' ? - item[columns.value] : item[columns.value],
          rank: item[columns.rank],
          indicator: item[columns.indicator],
          measure: item[columns.measure],
          period: item[columns.period]
        });
      });

      // Add series to chartOptions
      chartOptions.series = [series];
      console.log('--- Chart.getData ---', chartOptions.title.text, '\nchartOptions:', chartOptions, 'Series:', chartOptions.series);
    }

    // create chart
    this.createChart = function () {

      this.chart = new Highcharts.Chart(this.chartOptions);

    }
  },

  tooltipFormatterSimple: function (thisPoint) {

    return '<strong>' + thisPoint.name + '. ' + thisPoint.aandoening + '</strong> <br/>' + thisPoint.measure + ': '
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




// Wrapping function for drawing dataLabels of a series
Highcharts.wrap(Highcharts.Series.prototype, 'drawDataLabels', function (proceed) {
  var series = this, yAxis = series.chart.yAxis[0],
    inverted = yAxis.min < 0;

  // Apply the original function
  proceed.apply(series);

  // console.log('---- drawDataLabels for', series.name, yAxis.len, series.options.dataLabels);
  // console.log('Inverted chart:', inverted);

  $.each(series.points, function (index, point) {
    var label = point.dataLabel, labelWidth = label.getBBox().width;

    if (inverted) {
      // Test how label should be translated
      if (Math.abs(point.y) < 0.5 * Math.max(Math.abs(yAxis.min), yAxis.max)) {
        // Bar smaller than half plotWidth -> position outside
        xBase = (1 - Math.abs(point.y / yAxis.min)) * yAxis.len - 4
          - Math.min(vzinfo.chartLayout.dataLabelWidth, labelWidth);

        // console.log('Move outside:', xBase, point.aandoening);
        point.dataLabel.translate(xBase);
      } else {
        // console.log('Stay inside:', point.aandoening);
      }
    } else {
      // Test how label should be translated
      if (Math.abs(point.y) < 0.5 * Math.max(Math.abs(yAxis.min), yAxis.max)) {
        // Bar smaller than half plotWidth -> position outside
        xBase = (point.y / yAxis.max) * yAxis.len;

        // console.log('Move outside:', xBase, point.aandoening);
        point.dataLabel.translate(xBase);
      } else {
        // Bar wider than half plotWidth -> position inside
        xBase = (point.y / yAxis.max) * yAxis.len - 4
          - Math.min(vzinfo.chartLayout.dataLabelWidth, labelWidth);

        // console.log('Move inside:', xBase, point.aandoening);
        point.dataLabel.translate(xBase);
      }
    }

  });

});
