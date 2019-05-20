var vzinfo = {
  aandoeningRanglijsten: [],
  aandoeningFilter: {},
  strInfoTable:  "Aandoening;Incidentie;Doodsoorzaken;Verloren levensjaren;verlies van gezonde levensjaren;ziektelast;zorgkosten\nLongkanker;1;1;4;2;9;1\nDementie;8;2;6;5;4;2\nCoronaire hartziekten;6;7;2;10;8;3\nBeroerte;7;6;10;8;7;7\nCOPD;4;8;1;7;2;9\nHartfalen;9;9;5;9;6;5\nProstaatkanker;3;10;3;6;5;6\nDikkedarmkanker;5;5;7;3;10;4\nInfecties van de onderste luchtwegen;2;4;8;4;1;8\nAccidentele val;10;3;9;1;3;10",

  chartConfig: {
    "general":
    {
      "chart": {
        "type": "bar",
      },
      "colors": [
        "rgba(0,80,149,0.4)"
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
          return '<strong><large>' + this.point.name + '</large></strong><br>' + Highcharts.numberFormat(Math.abs(this.y), 0);
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
          "groupPadding": 0,
          "borderWidth": 0.5,
          "grouping": false
        },
        "series": {
          "pointPadding": 0.05,
          "dataLabels": {
            "enabled": true,
            "formatter": function () {
              return this.point.name; // + ': ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
          },
          "animation": {
            "duration": 500
          },
          "point": {
            "events": {
              "mouseOver": this.syncHighlight,
              "mouseOut": this.syncHighlight,
              "click": function (event) {
                vzinfo.showInfoTable(this.name);
              }
            }
          }
        }
      }
    },
  
    // ***** male *****
    "ranglijst_male": {
      "chart": {
        "renderTo": "ranglijst_male"
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
      },
      "series": [
        {
          "id": "Mannen",
          "name": "mannen",
          "data": [
            {
              "y": 6134,
              "name": "Longkanker"
            },
            {
              "y": 5259,
              "name": "Dementie"
            },
            {
              "y": 4983,
              "name": "Coronaire hartziekten"
            },
            {
              "y": 3935,
              "name": "Beroerte"
            },
            {
              "y": 3759,
              "name": "COPD"
            },
            {
              "y": 3180,
              "name": "Hartfalen"
            },
            {
              "y": 2862,
              "name": "Prostaatkanker"
            },
            {
              "y": 2771,
              "name": "Dikkedarmkanker"
            },
            {
              "y": 1684,
              "name": "Infecties van de onderste luchtwegen"
            },
            {
              "y": 1623,
              "name": "Accidentele val"
            }
          ]
        }
      ]
    },
  
    // ***** female *****
    "ranglijst_female": {
      "chart": {
        "renderTo": "ranglijst_female"
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
      "series": [
        {
          "id": "Vrouwen",
          "name": "vrouwen",
          "data": [
            {
              "y": -10719,
              "name": "Dementie"
            },
            {
              "y": -5421,
              "name": "Beroerte"
            },
            {
              "y": -4509,
              "name": "Hartfalen"
            },
            {
              "y": -4257,
              "name": "Longkanker"
            },
            {
              "y": -3363,
              "name": "COPD"
            },
            {
              "y": -3350,
              "name": "Coronaire hartziekten"
            },
            {
              "y": -3106,
              "name": "Borstkanker"
            },
            {
              "y": -2408,
              "name": "Accidentele val"
            },
            {
              "y": -2326,
              "name": "Dikkedarmkanker"
            },
            {
              "y": -2085,
              "name": "Infecties van de onderste luchtwegen"
            }
          ]
        }
      ],
      "exporting": {
        "enabled": true
      }
    }
  },
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
    })

  },


  renderCharts: function () {
    /* Rendering all R Charts by looping all htmlwidget containers, 
    |  find correspondig R-config object (script.json) and render chart 
    
    */
    $('div.ranglijst .chart-container').each(function (index, value) {
      var id = $(this).attr('id');

      console.log('div' + index + ':' + id);

      $.extend(true, vzinfo.chartConfig[id], vzinfo.chartConfig['general']);
      var chart = new Highcharts.Chart(vzinfo.chartConfig[id]);

    });
  },

  showInfoTable: function (aandoening) {
    if (vzinfo.aandoeningRanglijsten.length == 0) {
      vzinfo.aandoeningRanglijsten = this.CSVToArray(vzinfo.strInfoTable, ';');
    }
    this.renderTable(aandoening);
  },

  /*
  0: (7) ["Aandoening", "Incidentie", "Doodsoorzaken", "Verloren levensjaren", "verlies van gezonde levensjaren", "ziektelast", "zorgkosten"]
1: (7) ["Longkanker", "1", "1", "4", "2", "9", "1"]
2: (7) ["Dementie", "8", "2", "6", "5", "4", "2"]
3: (7) ["Coronaire hartziekten", "6", "7", "2", "10", "8", "3"]
4: (7) ["Beroerte", "7", "6", "10", "8", "7", "7"]
5: (7) ["COPD", "4", "8", "1", "7", "2", "9"]
6: (7) ["Hartfalen", "9", "9", "5", "9", "6", "5"]
7: (7) ["Prostaatkanker", "3", "10", "3", "6", "5", "6"]
8: (7) ["Dikkedarmkanker", "5", "5", "7", "3", "10", "4"]
9: (7) ["Infecties van de onderste luchtwegen", "2", "4", "8", "4", "1", "8"]
10: (7) ["Accidentele val", "10", "3", "9", "1", "3", "10"]
*/

  renderTable: function (aandoening) {
    var vzinfo = this;
    var indicators = vzinfo.aandoeningRanglijsten[0].slice(1);
    var arrAandoeningen = vzinfo.aandoeningRanglijsten.slice(1);

    // Filter row of 'aandoening'
    var rankInLists = arrAandoeningen.filter(function (item, index, filter) {
      return (item[0] == aandoening);
    });
    var rows = '', strCaption = '';

    console.log('RenderTable - selected', rankInLists[0]);

    if (rankInLists.length > 0) {
      strCaption = 'Positie in alle ranglijsten van <strong> ' + aandoening + '</strong>'
      // Loop ranking of selected aandoening
      $.each(rankInLists[0].slice(1), function (index, value) {
        rows += '<tr title="' + value + '"><td>' + indicators[index] +
          '</td><td class="slider">' + vzinfo.renderSlider(value) + '</td></tr>';
      });
    } else {
      strCaption = 'Positie in alle ranglijsten van <strong> ' + aandoening + '</strong>: Geen data gevonden';
    }

    $('div.info-table').html('<table><caption>' + strCaption + '</caption>' + rows + '</table>');
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

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  CSVToArray: function (strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);

      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
  },

  /* Chart object definition
  |   Params: dataSet, chart
  |   Properties: name, chart, chartOptions, dataSet, series
  |   Methods:    getData, createChart
  */
 Chart: function (chart, dataSet) {
    this.name = chart.name;
    this.type = chart.type || 'chart';
    this.chartOptions = chart.options;
    this.chartOptions.chart.renderTo = chart.options.chart.renderTo || this.name; // Use chart name if renderTo not set
    this.dataSet = dataSet || appConfig.dataSets[this.name]; // Use chart name for dataset if dataset undefined
    this.dataSet.data = [], this.series = [];
    this.zones = chart.type != 'map' && (chart.zones != undefined ? chart.zones : true); // Use zones on xAxis for projection data?
    this.benchmarkIndex = chart.benchmarkIndex; // Used for bevolkingsPiramide
    this.paramColorAxis = chart.paramColorAxis;

    // console.log('Chart.init - renderTo:', this.chartOptions.chart.renderTo, ' using dataset', this.dataSet.name);

    // Get data from dataSet config to load data array
    this.getData = function (refresh) {
      var chart = this, ds = chart.dataSet, chartSeries = chart.series, strSelect = '', params = ds.params();
      var chartOptions = chart.chartOptions;
      var chartType = chart.type || 'chart';

      // Reset series/data if refresh
      if (refresh != undefined && refresh) {
        chartSeries = [];
        ds.data = [];
      }

      // Check data should be retreived first time or retreived
      if (ds.data.length == 0) {

        // Get Url based on ds.type
        url = (ds.type == 'local' ? ds.url : ds.buildOdataUrl());
        // console.log('Chart.getData; url:', url);

        jQuery.getJSON(url, function (data) {
          var seriesColumn = ds.columnUseAs('series');
          var valueColumn = ds.columnUseAs('value').parseName != undefined ? ds.columnUseAs('value').parseName() : ds.columnUseAs('value');
          var xAxisColumn = ds.columnUseAs('xAxis');
          var filterColumn = ds.columnUseAs('filter');
          var categoryColumn = ds.columnUseAs('category');
          var props = ds.columnUseAs('props');

          var series = {};
          var seriesCode = '', seriesName = '', seriesIndex = 0;
          var category = '', categoryItems = [];
          var seriesZones = ((chartType == 'chart' && chart.zones) ? [{ value: 2017 }, { dashStyle: 'shortdash' }] : null)

          if (data['odata.metadata'] != undefined) {
            data = data.value;
          }

          // If a resultFilter is present apply it
          if (filterColumn != undefined && filterColumn.filter != undefined) {
            data = data.filter(filterColumn.filter);
          }

          // For motion get labels 
          if (chartType == 'motion') {
            chartOptions.motion.labels = GetUniqueValues(data, xAxisColumn.name);
          }

          // Fill data array with x,y for each row
          $.each(data, function (index, item) {
            // if (data.length > 500) {
            //   console.error('Too many data');
            //   return false;
            // }
            if (seriesColumn.parse != undefined) {
              item[seriesColumn.name] = seriesColumn.parse(item[seriesColumn.name]);
            }
            if (seriesCode != item[seriesColumn.name]) { // If seriesCode has changed, start new series (or at very begin)

              // console.log('Old series:', seriesCode, '; New series:', item[seriesColumn.name], series, 'category: ', category, categoryItems);

              // Add last categoryItems to previous series, and reset array
              if (series.data != undefined && categoryItems.length > 0) {
                series.data.push({ sequence: categoryItems });
                categoryItems = [];
              }

              seriesCode = item[seriesColumn.name];
              if (isNaN(seriesCode)) {
                // Lookup name if neccesary
                switch (seriesCode.substr(0, 2)) {
                  case 'NL':
                    seriesName = 'Nederland';
                    break;
                  case 'BU':
                    seriesName = 'Buurten';
                    break;
                  case 'GM':  // Gemeente
                    var findItem = findItemByValue(seriesCode, appConfig.dataSets.gemeenten.data, appConfig.dataSets.gemeenten.dataValue);
                    seriesName = findItem != undefined ? findItem[appConfig.dataSets.gemeenten.dataLabel] : seriesCode;
                    break;
                  case 'GG':
                  case 'CR':
                  case 'PV':
                  case 'AR':
                  case 'LD':
                    var findItem = app.regioIndeling.getItem();
                    seriesName = findItem != undefined ? findItem.label : seriesCode;
                    break;
                  default:
                    if (seriesColumn.items != undefined) {
                      var findItem = findItemByValue(seriesCode, seriesColumn.items);
                      seriesName = findItem != undefined ? findItem['Title'] : seriesCode;
                    } else { seriesName = seriesCode; }
                }
              } else {
                seriesName = seriesColumn.name + '-' + seriesCode
              }

              // Which index in chart to use?
              var param = findItemByValue(seriesCode, appParams, 'value') || findItemByValue(seriesName, appParams, 'label');
              seriesIndex = (param != undefined && param.index != undefined) ? (param.index || null) : (seriesIndex + 1);

              if (series.data != undefined) { // if a series is finished by starting a new one, the result should be added to chartsSeries
                chartSeries.push(series);
              }
              // Start new series object
              series = {
                name: seriesName.trim(), data: [],
                index: (seriesIndex != null) ? (chartOptions.chart.type == 'column' ? 100 - seriesIndex : seriesIndex) : null,
                zIndex: (seriesIndex != null) ? 10 - seriesIndex : null,
                _colorIndex: (seriesIndex != null) ? seriesIndex - 1 : null,
                // Define zones for trend charts
                zoneAxis: (chartType == 'chart' && chart.zones) ? 'x' : null,
                zones: seriesZones
              };

              if (chartType == 'map') { // Add mapData if chartType == 'map'
                // Get map shapes and filter for gemeente
                // Highcharts.maps.Buurten.features[0].properties.GMC
                // var mapFilterProperty = 'GMC';
                series.mapData = Highcharts.geojson(Highcharts.maps['Buurten'], 'map');
                // series.mapData.features =   series.mapData.features.filter(function (feature, index) {
                //   return feature.properties[mapFilterProperty] == appParams.gemeente.value;
                // })
                // The joinBy option can also be an array of two values, where the first points to a key in the mapData, and the second points to another key in the data.
                /*
                  Data: {
                    "buurtcode": "BU00030000",
                    "buurtnaam": "Appingedam-Centrum",
                    "gemnr": "GM0003",
                    "gemnaam": "Appingedam",
                    "Bevolking": 2335,
                    "Goed/zeer goed ervaren gezondheid": 67
                  }
                  Feature: 
                    geometry: {{type: "MultiPolygon", coordinates: Array(1)}
                    properties: {BUC: "BU16990000", BUN: "Roden", GMC: "GM1699", GMN: "Noordenveld"}
                    type: "Feature"}
                */
                series.joinBy = ['BUC', 'geocode']; // data: code: "BU16990000"   map:  {BUC: "BU16990000", BUN: "Roden", GMC: "GM1699", GMN: "Noordenveld"}
                series.keys = ['BUC', 'value'];
                series.allAreas = false;
              }
            }

            switch (chartType) {
              case 'chart': {
                // Create data array for charts
                if (valueColumn != undefined) {
                  var xValue = (xAxisColumn.parse != undefined) ? xAxisColumn.parse(item[xAxisColumn.name]) : item[xAxisColumn.name],
                    yValue = (valueColumn.parse != undefined) ? valueColumn.parse(item[valueColumn.name]) : item[valueColumn.name],
                    datapoint = {};

                  // Create datapoint depending on xAxis type
                  var xKey;
                  switch (chartOptions.xAxis.type) {
                    case 'category':
                      xKey = 'name';
                      break;
                    default:
                      xKey = 'x';
                  }
                  datapoint[xKey] = xValue;
                  datapoint.y = yValue;

                  if (props != undefined) {
                    datapoint[props.name] = item[props.name];
                  }
                  if (yValue != undefined) series.data.push(datapoint);
                } else {
                  series.data.push(item);
                }
                break;
              }
              case 'motion': {
                // https://github.com/TorsteinHonsi/Motion-Highcharts-Plugin/wiki
                // Data: {GemNr: 772, RegioS: "GM0772", Geslacht: 2, LeeftijdKlasse: 15, Perioden: 2010, …}
                // console.log('Motion.....', item)

                // Test whether to start new sequence; add finished sequence to series.data
                if (category != item[categoryColumn.name]) {
                  // New category
                  category = item[categoryColumn.name];
                  // Push sequence to series.data and start new one
                  if (categoryItems.length > 0) {
                    series.data.push({ sequence: categoryItems });
                  }
                  categoryItems = [];
                }

                categoryItems.push(valueColumn.parse(item));

                break;
              }
              case 'map': {
                // Create data array for maps
                datapoint = {
                  geocode: item[xAxisColumn.name],
                  x: item[xAxisColumn.name], // shows as xAxis in first column in datatable
                  // name: item.buurtnaam,
                  value: (item[valueColumn.name] != null) ? item[valueColumn.name] : null
                }
                series.data.push(datapoint);
                break;
              }
            }

          });

          // After processing all data add last series to chartSeries array
          if (series.data != undefined) {
            // For motion before adding series, add the last sequence
            if (chartType == 'motion' && categoryItems.length > 0) {
              series.data.push({ sequence: categoryItems });
            }

            // Push series.data
            chartSeries.push(series);
            // console.log('Chart.getData - push series', series);
          }
        })
      }

      // All data is processed and added to chartsSeries; now add to chartOptions
      // But for mation charts of bevolkingspiramide extra series must be created
      if (chartType == 'motion') {
        var chart = this;
        var seriesCount = chartSeries.length;

        $.each(chartSeries, function (index, series) { // Process series
          var seriesData = [];
          $.each(series.data, function (index, category) {
            seriesData.push(category.sequence[chart.benchmarkIndex || 0]);
          });

          chartSeries.push(
            {
              name: series.name + ' ' + chartOptions.motion.labels[chart.benchmarkIndex || 0],
              type: 'line',
              step: 'center', // stepping line
              data: seriesData,
              zIndex: 10,
              _colorIndex: index + seriesCount
            }
          )
        })
      }
      chartOptions.series = chartSeries;
      console.log('Chart.getData', chartSeries, '  -> url:', url);
    }

    // create chart
    this.createChart = function () {

      // Load corresponding theme
      Highcharts.setOptions(Highcharts[this.type + 'Theme']);

      // Set title with parameters if present
      if (this.chartOptions.title.textParam != undefined) {
        titleText = this.chartOptions.title.textParam;
        $.each(appParams, function (key, param) {
          titleText = titleText.replace('{' + key + '}', param.label);
        })
        this.chartOptions.title.text = titleText;
      }
      // Use parameter dependent colorAxis if present
      if (this.paramColorAxis != undefined) {
        var param = appParams[this.paramColorAxis.paramName];
        // Use specific colorAxis config 
        this.chartOptions.colorAxis = this.paramColorAxis[param.value] || this.chartOptions.colorAxis
      }

      // Create chartmap depending on type
      switch (this.type) {
        case 'map':
          this.chart = new Highcharts.Map(this.chartOptions);
          break;
        default:
          this.chart = new Highcharts.Chart(this.chartOptions);
      }
    }
  }
}







