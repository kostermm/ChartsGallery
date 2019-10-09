// vzinfo object contains all props and methods used for rendering ranglijsten
var vzinfo = {

  indicators: ['Doodsoorzaak', 'Verloren levensjaren', 'Verlies gezonde levensjaren', 'Voorkomen', 'Ziektelast', 'Zorgkosten'],
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

        var pointName = this.point.name,
          points = [], rows = '';

        var tooltipHead = '<em>Ranglijst: ' + this.point.indicator + ' in '
          + this.point.period + '</em>'
          + '<br/><strong><large>' + this.point.name + '</large></strong>'
          + '<br/>Maat: ' + this.point.measure
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
          return (item.indicator == vzinfo.paramIndicator
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
          return (item.indicator == vzinfo.paramIndicator
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
          return (item.indicator == vzinfo.paramIndicator
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
          return (item.indicator == vzinfo.paramIndicator
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
          return (item.indicator == vzinfo.paramIndicator
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
          return (item.indicator == vzinfo.paramIndicator
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
    vzinfo.paramIndicator = $('#ranglijst_indicator').val();

    // Set h1 page title
    $('#page-title.title').html('Ranglijst ' + vzinfo.paramIndicator);

    // Full-width containers
    $('div.ranglijst.wrapper').closest('.field-name-field-paragraph-chart').width('100%');
    $('div.ranglijst.wrapper').closest('article.venz_paragraph').find('>h2:not(#page-title)').remove();

    // indicator select event
    $('div.ranglijst.indicator select').change(function () {
      // Clear info table
      $('div.ranglijst div.info-table').remove();

      // Get indicator from select
      vzinfo.paramIndicator = this.value;
      // Set h1 page title
      $('#page-title.title').html('Ranglijst ' + vzinfo.paramIndicator);

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
    $('#page-title.title').html('Ranglijst ' + vzinfo.paramIndicator + ' in ' + vzinfo.paramPeriod);
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
        rows += '<tr class="' + (indicator == vzinfo.paramIndicator ? 'highlight' : '') + '"><th>' + indicator
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

      // Get period from data
      if (data.length > 0) {
        vzinfo.paramPeriod = data[0][columns.period];
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
      console.log('--- Chart.getData', chartOptions, chartOptions.series);
    }

    // create chart
    this.createChart = function () {

      this.chart = new Highcharts.Chart(this.chartOptions);

    }
  }
});

// ***** Data *****
vzinfo.ranglijsten.data = [
  {
    "indicator": "Voorkomen",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 1,
    "aantal": 1982300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 2,
    "aantal": 1199100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 3,
    "aantal": 1111000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 4,
    "aantal": 1046300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 5,
    "aantal": 961700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 6,
    "aantal": 749500,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 7,
    "aantal": 732200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 8,
    "aantal": 624600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 9,
    "aantal": 619300,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 10,
    "aantal": 613500,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 11,
    "aantal": 607300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 12,
    "aantal": 551600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 13,
    "aantal": 437000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 14,
    "aantal": 431400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Hartritmestoornissen (boezemfibrilleren)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 15,
    "aantal": 389800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 16,
    "aantal": 378600,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Prive-ongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 17,
    "aantal": 374200,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 18,
    "aantal": 334600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 19,
    "aantal": 284000,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Migraine",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 20,
    "aantal": 274400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Overspannenheid en burn-out",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 21,
    "aantal": 261000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 22,
    "aantal": 252300,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 23,
    "aantal": 234400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 24,
    "aantal": 227300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 25,
    "aantal": 180600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 26,
    "aantal": 179700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 27,
    "aantal": 154000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 28,
    "aantal": 142600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 29,
    "aantal": 142200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 30,
    "aantal": 132300,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Borstkanker ",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 31,
    "aantal": 128900,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Vervoersongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 32,
    "aantal": 124800,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Aandoeningen van het endocard/klepafwijkingen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 33,
    "aantal": 116800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Aandoeningen gerelateerd aan alcohol",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 34,
    "aantal": 109000,
    "maat": "Benadering puntprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 35,
    "aantal": 94300,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Autisme",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 36,
    "aantal": 78700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 37,
    "aantal": 77900,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 38,
    "aantal": 72000,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 39,
    "aantal": 62400,
    "maat": "Puntprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Aandoeningen gerelateerd aan drugs",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 40,
    "aantal": 61800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 41,
    "aantal": 61200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Arbeidsongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 42,
    "aantal": 48800,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Schizofrenie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 43,
    "aantal": 48500,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 44,
    "aantal": 48300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 45,
    "aantal": 24100,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 46,
    "aantal": 24000,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "AIDS en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 47,
    "aantal": 23000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Letsel als gevolg van geweld",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 48,
    "aantal": 17700,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 49,
    "aantal": 16800,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 50,
    "aantal": 15000,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal ",
    "positie": 51,
    "aantal": 5100,
    "maat": "10-jaarsprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 832700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 572000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 450100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Angststoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 421100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Artrose",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 409900,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Contacteczeem",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 395000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 325900,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 322100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "COPD",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 308800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 282300,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 1149600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Artrose",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 789200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Angststoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 625200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Contacteczeem",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 566700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 539000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 427400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Osteoporose",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 368500,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 355600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Astma",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 346300,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Vrouwen",
    "leeftijd": "",
    "positie": 10,
    "aantal": 337000,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 150200,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 107900,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 106900,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 101400,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 99900,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Prive-ongevallen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 91100,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 84200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 8,
    "aantal": 76200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 9,
    "aantal": 70200,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 10,
    "aantal": 49600,
    "maat": "Aantal SEH-bezoeken",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 1,
    "aantal": 1334700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 840100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 613000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 447000,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 426400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 394600,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 394400,
    "maat": "Zorgprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 272300,
    "maat": "Aantal nieuwe gevallen",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 244300,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Overspannenheid en burn-out",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 243700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 803800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 656700,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 601200,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 540400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 512800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 390800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 354100,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 319800,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 309400,
    "maat": "Jaarprevalentie",
    "jaar": 2015
  },
  {
    "indicator": "Voorkomen",
    "aandoening": "Hartritmestoornissen (boezemfibrilleren)",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 285400,
    "maat": "Jaarprevalentie",
    "jaar": null
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 15978,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 10391,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 9180,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 8333,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 7689,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 6820,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 5097,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele val",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 4031,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 3769,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 3132,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 11,
    "aantal": 2862,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 12,
    "aantal": 2779,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Aandoeningen van het endocard/klepafwijkingen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 13,
    "aantal": 2368,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartritmestoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 14,
    "aantal": 2255,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 15,
    "aantal": 1936,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 16,
    "aantal": 1917,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 17,
    "aantal": 1908,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 18,
    "aantal": 1769,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 19,
    "aantal": 1324,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 20,
    "aantal": 925,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 21,
    "aantal": 665,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 22,
    "aantal": 515,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 23,
    "aantal": 489,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 24,
    "aantal": 279,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 25,
    "aantal": 234,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele vergiftiging",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 26,
    "aantal": 224,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 27,
    "aantal": 206,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 28,
    "aantal": 205,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Downsyndroom",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 29,
    "aantal": 180,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 30,
    "aantal": 160,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 31,
    "aantal": 151,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Geweld",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 32,
    "aantal": 132,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 33,
    "aantal": 130,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 34,
    "aantal": 124,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 35,
    "aantal": 96,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 36,
    "aantal": 93,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele verdrinking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 37,
    "aantal": 86,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Laag geboortegewicht",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 38,
    "aantal": 46,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Aids en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 39,
    "aantal": 25,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 40,
    "aantal": 12,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 41,
    "aantal": 11,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Migraine",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 42,
    "aantal": 1,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 999,
    "aantal": 0,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 999,
    "aantal": 0,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 999,
    "aantal": 0,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 999,
    "aantal": 0,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Longkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 6134,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dementie",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 5259,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 4983,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Beroerte",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 3759,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "COPD",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 3457,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartfalen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 3180,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Prostaatkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 2862,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 2771,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 1684,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele val",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 1623,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dementie",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 10719,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Beroerte",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 5421,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartfalen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 4509,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Longkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 4257,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "COPD",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 3363,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 3350,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Borstkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 3106,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele val",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 2408,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 2326,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 2085,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 51,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Laag geboortegewicht",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 46,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 19,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 17,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Geweld",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 12,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 11,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele verdrinking",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 11,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 2627,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 1493,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 1087,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 1047,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 997,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 724,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 666,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 347,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 346,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 296,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 15842,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 8512,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 7764,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 7478,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 7336,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 6096,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 4050,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Accidentele val",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 3849,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 3609,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Doodsoorzaak",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 2670,
    "maat": "Aantal doden",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 155497,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 95423,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 85422,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 79669,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 72032,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 68136,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 61327,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 54151,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 49545,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele val",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 28273,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 11,
    "aantal": 27582,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 12,
    "aantal": 26162,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 13,
    "aantal": 25127,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 14,
    "aantal": 22645,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Aandoeningen van het endocard/klepafwijkingen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 15,
    "aantal": 18686,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 16,
    "aantal": 18563,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartritmestoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 17,
    "aantal": 17503,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 18,
    "aantal": 17392,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 19,
    "aantal": 15235,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 20,
    "aantal": 14873,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 21,
    "aantal": 12706,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele vergiftiging",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 22,
    "aantal": 7918,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 23,
    "aantal": 7091,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Geweld",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 24,
    "aantal": 5443,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 25,
    "aantal": 5345,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Downsyndroom",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 26,
    "aantal": 4569,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 27,
    "aantal": 4568,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 28,
    "aantal": 4140,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Laag geboortegewicht",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 29,
    "aantal": 3747,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 30,
    "aantal": 3728,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele verdrinking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 31,
    "aantal": 2986,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 32,
    "aantal": 2425,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 33,
    "aantal": 2123,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 34,
    "aantal": 1963,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 35,
    "aantal": 1728,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 36,
    "aantal": 1511,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 37,
    "aantal": 1096,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 38,
    "aantal": 734,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Aids en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 39,
    "aantal": 694,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 40,
    "aantal": 200,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 41,
    "aantal": 194,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Migraine",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 42,
    "aantal": 29,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": null,
    "aantal": 0,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": null,
    "aantal": 0,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": null,
    "aantal": 0,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": null,
    "aantal": 0,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 82694,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 56147,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 41357,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 36670,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 35264,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "COPD",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 33333,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 33260,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Prostaatkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 26162,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartfalen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 22937,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 14816,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 72802,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 62163,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Borstkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 53803,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 44404,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "COPD",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 38699,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 31466,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 29275,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartfalen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 26608,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 19969,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele val",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 14993,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 4058,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Laag geboortegewicht",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 3747,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 1401,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 1256,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Geweld",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 906,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele verdrinking",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 826,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 757,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 8,
    "aantal": 552,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 1,
    "aantal": 68482,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Zelftoegebracht letsel",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 55536,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 32890,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 28426,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 26144,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 18632,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 18041,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Vervoersongeval",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 14370,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 9321,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 8261,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 91917,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 87015,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 60888,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 59278,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 53991,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 43814,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 39710,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Accidentele val",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 23057,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 21785,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verloren levensjaren",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 21261,
    "maat": "Jaren",
    "jaar": 2017
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 173900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 164000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 159900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 158600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 144700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 141900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 127900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 108400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "PrivÈ-ongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 87100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 83800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 11,
    "aantal": 52900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Overspannenheid en burn-out",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 12,
    "aantal": 46500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 13,
    "aantal": 45700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "SuÔcide(poging)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 14,
    "aantal": 44600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 15,
    "aantal": 40000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 16,
    "aantal": 39200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Vervoersongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 17,
    "aantal": 37800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 18,
    "aantal": 37200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Hartritmestoornissen (boezemfibrilleren)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 19,
    "aantal": 28500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 20,
    "aantal": 26900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 21,
    "aantal": 26200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Afhankelijkheid van alcohol",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 22,
    "aantal": 24900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 23,
    "aantal": 23600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Schizofrenie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 24,
    "aantal": 22700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 25,
    "aantal": 22200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 26,
    "aantal": 21700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 27,
    "aantal": 20000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Autisme",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 28,
    "aantal": 19900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 29,
    "aantal": 17800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 30,
    "aantal": 15300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 31,
    "aantal": 13700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 32,
    "aantal": 13700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 33,
    "aantal": 9000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 34,
    "aantal": 8600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Aandoeningen van het endocard",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 35,
    "aantal": 8500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 36,
    "aantal": 8400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 37,
    "aantal": 8400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Afhankelijkheid van drugs",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 38,
    "aantal": 7200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 39,
    "aantal": 5900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 40,
    "aantal": 5900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 41,
    "aantal": 5400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 42,
    "aantal": 5300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Migraine",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 43,
    "aantal": 5200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Arbeidsongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 44,
    "aantal": 5100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 45,
    "aantal": 4900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 46,
    "aantal": 3800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Letsel als gevolg van geweld",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 47,
    "aantal": 3200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 48,
    "aantal": 2320,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Aids en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 49,
    "aantal": 1080,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 50,
    "aantal": 750,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 51,
    "aantal": 700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 102200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 82900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 72600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 70200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 65400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 58400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "COPD",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 55100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 44200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 43500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "PrivÈ-ongevallen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 39100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 103700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 93100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 86300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 84400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 77000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 69300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 61800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "COPD",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 53300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "PrivÈ-ongevallen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 48000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 39600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Letsel door privÈ-ongevallen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 21200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Autisme",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 11000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 10200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 8100,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 6000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 5400,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Letsel door vervoersongevallen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 5300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 8,
    "aantal": 5000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 9,
    "aantal": 3900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 10,
    "aantal": 3800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 1,
    "aantal": 142200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 133900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 85300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 66900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 51000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 46000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 45300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Burn-out en overspannenheid",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 43700,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 43500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "SuÔcide(poging)",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 41900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 112900,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 95800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 92000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 84300,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 60600,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 58500,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 49800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 44000,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 27200,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Verlies gezonde levensjaren",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 26800,
    "maat": "Ziektejaarquivalenten",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 260200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 228300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 188900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 182500,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 173900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 169200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 160400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 145800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 129800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 129100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "PrivÈ-ongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 11,
    "aantal": 125300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "SuÔcide(poging)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 12,
    "aantal": 104200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 13,
    "aantal": 88600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 14,
    "aantal": 85400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 15,
    "aantal": 83800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 16,
    "aantal": 71600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Vervoersongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 17,
    "aantal": 57200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 18,
    "aantal": 55700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 19,
    "aantal": 48700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Hartritmestoornissen (boezemfibrilleren)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 20,
    "aantal": 46800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Overspannenheid en burn-out",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 21,
    "aantal": 46500,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 22,
    "aantal": 40800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 23,
    "aantal": 40400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 24,
    "aantal": 40000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 25,
    "aantal": 38700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Afhankelijkheid van alcohol",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 26,
    "aantal": 35300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Aandoeningen van het endocard",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 27,
    "aantal": 27100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 28,
    "aantal": 26800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 29,
    "aantal": 26200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Hartstilstand",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 30,
    "aantal": 25200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 31,
    "aantal": 22700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Schizofrenie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 32,
    "aantal": 22700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 33,
    "aantal": 22200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 34,
    "aantal": 21700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Huidkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 35,
    "aantal": 21400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 36,
    "aantal": 21200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Autisme",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 37,
    "aantal": 19900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 38,
    "aantal": 16000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 39,
    "aantal": 13700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 40,
    "aantal": 13400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 41,
    "aantal": 11800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 42,
    "aantal": 10100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Afhankelijkheid van drugs",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 43,
    "aantal": 8300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Letsel als gevolg van geweld",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 44,
    "aantal": 7500,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Arbeidsongevallen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 45,
    "aantal": 7400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 46,
    "aantal": 5400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "ADHD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 47,
    "aantal": 5300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Migraine",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 48,
    "aantal": 5200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Downsyndroom",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 49,
    "aantal": 4700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Gedragsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 50,
    "aantal": 3800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Laag geboortegewicht",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 51,
    "aantal": 3700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 52,
    "aantal": 3000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Aids en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 53,
    "aantal": 2060,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 164100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Beroerte",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 111000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 98300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "COPD",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 89900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Longkanker",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 88300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Angststoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 70200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 66000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Letsel door privÈ-ongevallena",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 59500,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 59000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Zelftoegebracht letsel / suÔcide(poging)",
    "geslacht": "Mannen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 53200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Beroerte",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 117200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Angststoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 103700,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 96100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 94400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "COPD",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 92600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 90600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 86900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Dementie",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 85900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Artrose",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 85300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Borstkanker",
    "geslacht": "Vrouwen",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 85000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Letsel door privÈ-ongevallenb",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 23250,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 11200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Autisme",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 11000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Sportblessures",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 8100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Letsel door vervoersongevallen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 7100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 6300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Astma",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 6270,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Constitutioneel eczeem",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 8,
    "aantal": 5400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 9,
    "aantal": 5000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Infecties van de onderste luchtwegen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 10,
    "aantal": 4660,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 1,
    "aantal": 142200,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Stemmingsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 134800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Zelftoegebracht letsel / suÔcide(poging)",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 95800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 85600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 80600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 76100,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 75400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 63800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 63400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Letsel door† privÈ-ongevallenb",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 52600,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 179400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 163400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 125800,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 117300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 112500,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 93000,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 85400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 62900,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 59400,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Ziektelast",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 54300,
    "maat": "DALY's",
    "jaar": 2015
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 1,
    "aantal": 6828,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 2,
    "aantal": 4758,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gebitsafwijkingen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 3,
    "aantal": 3600,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 4,
    "aantal": 2833,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 5,
    "aantal": 2259,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 6,
    "aantal": 2081,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Complicaties van zwangerschap, bevalling en kraambed",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 7,
    "aantal": 1836,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 8,
    "aantal": 1689,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Depressie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 9,
    "aantal": 1592,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Astma en COPD",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 10,
    "aantal": 1525,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 11,
    "aantal": 1305,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Afhankelijkheid van alcohol en drugs",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 12,
    "aantal": 1193,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 13,
    "aantal": 1112,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 14,
    "aantal": 940,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 15,
    "aantal": 916,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Schizofrenie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 16,
    "aantal": 835,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Chronische nierziekte / nierfalen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 17,
    "aantal": 800,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Longontsteking en influenza",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 18,
    "aantal": 711,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Borstkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 19,
    "aantal": 696,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 20,
    "aantal": 626,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "ReumatoÔde artritis (RA)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 21,
    "aantal": 568,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Persoonlijkheidsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 22,
    "aantal": 553,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Dikkedarmkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 23,
    "aantal": 488,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Heupfractuur",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 24,
    "aantal": 472,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Longkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 25,
    "aantal": 401,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Ziekte van Parkinson",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 26,
    "aantal": 267,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Osteoporose",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 27,
    "aantal": 257,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Prostaatkanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 28,
    "aantal": 254,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Epilepsie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 29,
    "aantal": 249,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Non-Hodgkin lymfomen (NHL)",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 30,
    "aantal": 192,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Infectieziekten van het maagdarmkanaal",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 31,
    "aantal": 173,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Aids en hiv-infectie",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 32,
    "aantal": 164,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Constitutioneel eczeem en contacteczeem",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 33,
    "aantal": 150,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 34,
    "aantal": 96,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Soa",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 35,
    "aantal": 56,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Aangeboren afwijkingen van het hartvaatstelsel",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 36,
    "aantal": 54,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Vroeggeboorten",
    "geslacht": "Totaal",
    "leeftijd": "Totaal",
    "positie": 37,
    "aantal": 36,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 1,
    "aantal": 782,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gebitsafwijkingenb",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 2,
    "aantal": 765,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Complicaties van zwangerschap, bevalling en kraambed",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 3,
    "aantal": 299,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gehoorstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 4,
    "aantal": 165,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Longontsteking en influenza",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 5,
    "aantal": 164,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 6,
    "aantal": 92,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Astma en†COPD",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 7,
    "aantal": 65,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Baarmoederhalskanker",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 8,
    "aantal": 54,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Angststoornissen",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 9,
    "aantal": 40,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Vroeggeboorten",
    "geslacht": "Totaal",
    "leeftijd": "0-15 jaar",
    "positie": 10,
    "aantal": 35,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 1,
    "aantal": 5405,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gebitsafwijkingenb",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 2,
    "aantal": 2308,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Complicaties tijdens zwangerschap, bevalling en kraambed",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 3,
    "aantal": 1536,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gezichtsstoornissen",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 4,
    "aantal": 1257,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Afhankelijkheid van alcohol en drugs",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 5,
    "aantal": 1096,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Depressie",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 6,
    "aantal": 1094,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 7,
    "aantal": 850,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Nek- en rugklachten",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 8,
    "aantal": 821,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Schizofrenie",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 9,
    "aantal": 771,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "15-65 jaar",
    "positie": 10,
    "aantal": 690,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Dementie",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 1,
    "aantal": 4595,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Beroerte",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 2,
    "aantal": 1765,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gezichtsstoornissena",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 3,
    "aantal": 1484,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Coronaire hartziekten",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 4,
    "aantal": 1231,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Diabetes mellitus",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 5,
    "aantal": 975,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Astma en†COPD",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 6,
    "aantal": 831,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Artrose",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 7,
    "aantal": 776,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Hartfalen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 8,
    "aantal": 768,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Verstandelijke beperking",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 9,
    "aantal": 641,
    "maat": "Miljoen euro",
    "jaar": 2011
  },
  {
    "indicator": "Zorgkosten",
    "aandoening": "Gebitsafwijkingen",
    "geslacht": "Totaal",
    "leeftijd": "65+",
    "positie": 10,
    "aantal": 52,
    "maat": "Miljoen euro",
    "jaar": 2011
  }
]
