var aandoeningRanglijsten = [], aandoeningFilter = {};

var chartConfig = {
  "ranglijst_male": {
    "chart": {
      "type": "bar",
      "renderTo": "ranglijst_male"
    },
    "colors": [
      "rgba(0,80,149,0.4)"
    ],
    "title": {
      "text": "mannen"
    },
    "xAxis": {
      "visible": true,
      "categories": [],
      "lineWidth": 0,
      "labels": {
        "x": -5,
        "align": "center",
        "step": 1
      },
      "reversed": true
    },
    "yAxis": {
      "opposite": true,
      "title": {
        "text": "Aantal sterfgevallen"
      },
      "labels": {},
      "allowDecimals": false,
      "min": 0,
      "max": 15000,
      "tickInterval": 2000
    },
    "tooltip": {},
    "legend": {
      "enabled": false
    },
    "plotOptions": {
      "bar": {
        "groupPadding": 0,
        "borderWidth": 0.5,
        "grouping": false
      },
      "series": {
        "dataLabels": {
          "enabled": true,
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
        ],
        "pointPadding": 0.05,
        "showInLegend": true,
        point: {
          events: {
            mouseOver: syncHighlight,
            mouseOut: syncHighlight,
            click: function (event) { 
              showInfoTable(this.name); 
            }
          }
        },
      }
    ]
  },
  "ranglijst_female": {
    "chart": {
      "type": "bar",
      "renderTo": "ranglijst_female"
    },
    "colors": [
      "rgba(0,80,149,0.4)"
    ],
    "title": {
      "text": "vrouwen"
    },
    "xAxis": {
      "visible": true,
      "opposite": true,
      "categories": [],
      "labels": {
        "enabled": false,
        "step": 1
      },
      "reversed": true
    },
    "yAxis": {
      "opposite": true,
      "title": {
        "text": "Aantal sterfgevallen"
      },
      "labels": {},
      "allowDecimals": false,
      "min": -15000,
      "max": 0,
      "tickInterval": 2000
    },
    "tooltip": {},
    "legend": {
      "enabled": false
    },
    "plotOptions": {
      "bar": {
        "groupPadding": 0,
        "borderWidth": 0.5,
        "grouping": false
      },
      "series": {
        "dataLabels": {
          "enabled": true,
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
        ],
        "pointPadding": 0.05,
        "showInLegend": true,
        point: {
          events: {
            mouseOver: syncHighlight,
            mouseOut: syncHighlight,
            click: function (event) { 
              showInfoTable(this.name); 
            }
          }
        },
      }
    ],
    "exporting": {
      "enabled": false
    }
  }
};

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
  $.each(Highcharts.charts, function (index,  chart) {
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
  /* Rendering all R Charts by looping all htmlwidget containers, 
  |  find correspondig R-config object (script.json) and render chart 
  
  */
  $('div.chart-container.ranglijst').each(function (index, value) {
    var id = $(this).attr('id');

    console.log('div' + index + ':' + id);
    
    var chart = new Highcharts.Chart(chartConfig[id]);

  });
}

function showInfoTable(aandoening){
  if(aandoeningRanglijsten.length == 0) {

    // jQuery.ajaxSetup({async:true});

    Papa.parse("data/AandoeningenEnRanglijsten.csv", {
        download: true,
        header: true,
        complete: function (results) {
          aandoeningRanglijsten = results.data;

          renderTable(aandoening);
          // jQuery.ajaxSetup({async:false});
        }
      });
  } else {
    renderTable(aandoening);
  }
}

function renderTable(aandoening) {
  var aandoeningFilter = {
    prop: 'Aandoening',
    val: aandoening || 'Dementie'
  }

  var rankInLists = aandoeningRanglijsten.filter(function(item, index, filter){
    if (item[aandoeningFilter.prop] == aandoeningFilter.val) {
      return true;
    } else {
      return false;
    }
  });
  var rows = '', caption = '<caption>Positie in alle ranglijsten <br/>Aandoening: <strong> ' + rankInLists[0].Aandoening + '</strong></caption>';


  $.each(rankInLists[0], function(key, value){
    if(key != 'Aandoening'){
      rows += '<tr><td>' + key + '</td><td class="right">' + value + '</td></tr>';
    }
  });
  console.log(rows);
  $('div.info-table').html('<table>' + caption + rows + '</table>');
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