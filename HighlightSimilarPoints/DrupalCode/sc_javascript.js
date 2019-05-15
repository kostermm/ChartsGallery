// highchartstheme.js

// Function for synchronized highlighting of data points with equal property
function syncHighlight(event) {
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

}

// chart-functions.js
var aandoeningRanglijsten = [], aandoeningFilter = {};

var chartConfig = {
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
            "mouseOver": syncHighlight,
            "mouseOut": syncHighlight,
            "click": function (event) {
              showInfoTable(this.name);
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
      "enabled": false
    }
  }
};

var strInfoTable = "Aandoening;Incidentie;Doodsoorzaken;Verloren levensjaren;verlies van gezonde levensjaren;ziektelast;zorgkosten\nLongkanker;1;1;4;2;9;1\nDementie;8;2;6;5;4;2\nCoronaire hartziekten;6;7;2;10;8;3\nBeroerte;7;6;10;8;7;7\nCOPD;4;8;1;7;2;9\nHartfalen;9;9;5;9;6;5\nProstaatkanker;3;10;3;6;5;6\nDikkedarmkanker;5;5;7;3;10;4\nInfecties van de onderste luchtwegen;2;4;8;4;1;8\nAccidentele val;10;3;9;1;3;10"

// Function for synchronized highlighting of data points with equal property
function syncHighlight(event) {
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

}

function renderCharts() {
  /* 
    Rendering Charts by looping all containers
  */
  $('div.ranglijst .chart-container').each(function (index, value) {
    var id = $(this).attr('id');

    console.log('div' + index + ':' + id);

    $.extend(true, chartConfig[id], chartConfig['general']);
    var chart = new Highcharts.Chart(chartConfig[id]);

  });
}

function showInfoTable(aandoening) {
  if (aandoeningRanglijsten.length == 0) {
    aandoeningRanglijsten = CSVToArray(strInfoTable, ';');
  }
  renderTable(aandoening);
}
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
function renderTable(aandoening) {
  var indicators = aandoeningRanglijsten[0].slice(1);
  var arrAandoeningen = aandoeningRanglijsten.slice(1);

  // Filter row of 'aandoening'
  var rankInLists = arrAandoeningen.filter(function (item, index, filter) {
    return (item[0] == aandoening);
  });
  var rows = '', strCaption = '';

  console.log('renderTable - selected', rankInLists[0]);

  if (rankInLists.length > 0) {
    strCaption = 'Positie in alle ranglijsten van <strong> ' + aandoening + '</strong>'
    // Loop ranking of selected aandoening
    $.each(rankInLists[0].slice(1), function (index, value) {
      rows += '<tr title="' + value + '"><td>' + indicators[index] + '</td><td class="right">' + value + '</td><td class="slider"><hr /><span class="circle" style="left:' + value + '0%"></span></td></tr>';
    });
  } else {
    strCaption = 'Positie in alle ranglijsten van <strong> ' + aandoening + '</strong>: Geen data gevonden';
  }

  $('div.info-table').html('<table><caption>' + strCaption + '</caption>' + rows + '</table>');
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
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
}
// chart-functions.js end ***************

console.log(chartConfig);

// Styling of Drupal parent elements
$('div.ranglijst.chart-container').closest('.field-name-field-paragraph-chart').width('100%');

// Render charts
renderCharts();
