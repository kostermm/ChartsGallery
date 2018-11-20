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

colorPalettes = {
  //color palettes supercharts
  categorien: ['#42145f', '#ffb612', '#a90061', '#777c00', '#007bc7', '#673327', '#e17000', '#39870c', '#94710a', '#01689b', '#f9e11e', '#76d2b6', '#d52b1e', '#8fcae7', '#ca005d', '#275937', '#f092cd'],
  // 1)paars, 2)donkergeel, 3)robijnrood, 4)mosgroen, 5)hemelblauw, 6)donkerbruin, 7)oranje, 8)groen, 9)bruin, 10)donkerblauw, 11)geel, 12)mintgroen, 13)rood, 14)lichtblauw, 15violet), 16)donkergroen, 17)roze
  geslacht: ['#007bc7', '#ca005d', '#42145f'], // 1)men, 2)women, 3)total
  internationaal: ['#42145f', '#e17000', '#ffb612'],
  ses: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#CB2326', '#6AF9C4', '#8FCAE7', '#F092CD'],
};

// Specific theming for supercharts
Highcharts.galleryTheme = {
  colorPalettes: colorPalettes,

  lang: {
    decimalPoint: ',',
    thousandsSep: '.',
    numericSymbols: null,

    months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    shortMonths: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    weekdays: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
    shortWeekdays: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
    loading: 'Laden...',
    noData: 'Geen gegevens beschikbaar',
    contextButtonTitle: 'Exporteer grafiek',
    printChart: 'Grafiek afdrukken',
    downloadJPEG: 'Downloaden als JPEG',
    downloadPNG: 'Downloaden als PNG',
    downloadPDF: 'Downloaden als PDF',
    downloadSVG: 'Downloaden als SVG',
    downloadCSV: 'CSV downloaden',
    downloadXLS: 'XLS downloaden',
    viewData: 'Tabel tonen',

    zoomIn: 'Inzoomen',
    zoomOut: 'Uitzoomen',
  },
  chart: {
    width: 400,
    height: 400,
    // Edit chart spacing
    spacingBottom: 0,
    spacingTop: 10,
    spacingLeft: 0,
    spacingRight: 10,
    style: {
      color: '#333333',
      fontFamily: '"RO Sans", Verdana',
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },
  title: {
    style: {
      color: '#333333',
      fontSize: '13pt',
      fontWeight: 'bold'
    },
    align: 'center',
    x: 0,
    y: 25
  },
  subtitle: {
    style: {
      fontSize: '9pt',
      color: '#333333',
      fontWeight: 'normal'
    },
    align: 'center',
    x: 2,
    y: 40
  },
  colors: colorPalettes.categorien,
  xAxis: {
    lineColor: '#c0d0e0',
    lineWidth: 1,
    tickLength: 0,
    tickmarkPlacement: 'on'
  },
  yAxis: {
    visible: false,
    title: {
      rotation: '0',
      // align: 'high',
      // textAlign: 'left',
      // y: -10,
      margin: 0,
      style: {
        fontSize: '11px',
        fontWeight: 'normal'
      },
      y: -10
    },
    labels: {
      formatter: function () { return Highcharts.numberFormat(Math.abs(this.value), 0); }
    },
    lineColor: '#c0d0e0',
    lineWidth: 1,
    gridLineColor: '#c0d0e0',
    gridLineDashStyle: 'dash',
    reversedStacks: false
  },
  legend: {
    useHTML: true,
    itemWidth: 150,
    itemStyle: {
      fontSize: '11px',
      fontWeight: 'normal',
      color: 'black'
    },
    itemHoverStyle: {
      fontWeight: 'bold',
      color: 'gray'
    },
    // itemCheckboxStyle: {
    //   height: '13px',
    //   position: 'absolute',
    //   width: '13px'
    // },

    squareSymbol: true,
    symbolWidth: 10,
    symbolHeight: 12,
    symbolRadius: 0,
    x: 50,
    y: -10,

    itemHoverStyle: {
      color: '#007bc7'
    },
    itemHiddenStyle: {
      color: '#c8c8c8'
    }
  },
  tooltip: {
    enabled: false,
    headerFormat: '<strong><large>{point.key}</large></strong><br>',
    pointFormat: '<span style="color:{point.color}">\u25A0</span> {series.name}: <b>{point.y}</b><br/>',
    shared: true,
    borderColor: '#007bc7',
    markerRadius: 0,
    style: {
      fontSize: '10pt',
      color: '#000000'
    }
  },
  credits: {
    enabled: false,
    href: 'https://www.rivm.nl',
    text: 'RIVM'
  },
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: [
          {
            textKey: 'printChart',
            onclick: function () { this.print(); }
          }, {
            separator: true
          }, {
            textKey: 'downloadPNG',
            onclick: function () {
              this.exportChart({ filename: (this.userOptions.title != undefined ? (this.userOptions.title.text.replace(/["',]/g, '')).replace(/[^a-zA-Z0-9]/g, '-') : 'chart') });
            }
          }, {
            // textKey: 'downloadJPEG',
            // onclick: function() { this.exportChart( { type: 'image/jpeg' } ); }
            // }, {
            textKey: 'downloadPDF',
            onclick: function () {
              this.exportChart({ type: 'application/pdf', filename: (this.userOptions.title.text.replace(/["',]/g, '')).replace(/[^a-zA-Z0-9]/g, '-') });
            }
          }, {
            textKey: 'downloadSVG',
            onclick: function () {
              this.exportChart({ type: 'image/svg+xml', filename: (this.userOptions.title.text.replace(/["',]/g, '')).replace(/[^a-zA-Z0-9]/g, '-') });
            }
          }, {
            separator: true
          }, {
            textKey: 'viewData',
            onclick: function () {
              var btnClose = '<button type="button" class="close icon-kruis" title="Verberg tabel" aria-label="Close"><span class="sr-only">Sluiten</span></button>';
              // show table and append close button if necessary
              var dataTableContainer = jQuery(this.container.closest('.ec')).next('.ec.sr-only');
              dataTableContainer.removeClass('sr-only');

              var table = jQuery('.highcharts-data-table table', dataTableContainer);
              if (table.find('button.close').length == 0) {
                table.find('caption').append(btnClose).click(function () {
                  table.closest('.ec').addClass('sr-only');
                });
              }
              table.find('button.close').focus();

            }
          }, {
            textKey: 'downloadCSV',
            onclick: function () { this.downloadCSV(); }
            // }, {
            //   textKey: 'downloadXLS',
            //   onclick: function () { this.downloadXLS(); }
          }
        ]
      }
    },
    csv: {
      itemDelimiter: ';',
      lineDelimiter: '\r\n'
    }
  },
  plotOptions: {
    line: {
      lineWidth: 2,
      marker: {
        enabled: false
      }
    },
    area: {
      marker: {
        enabled: false
      },
      lineWidth: 0
    },
    column: {
      pointPadding: 0.1,
      groupPadding: 0.1,
      borderWidth: 0
    },
    bar: {
      pointPadding: 0,
      groupPadding: 0.1,
      borderWidth: 0
    },
    bubble: {
      lineWidth: 0
    },
    series: {
      showCheckbox: true,
      selected: true,
      // negativeColor: 'orange',  
      dataLabels: {
        formatter: function () {
          return this.point.name + ': ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);

        }
      },
      animation: {
        duration: 100
      },
      events: {
        checkboxClick: function (event) {
          // toggle series by clicking legend checkboxes
          if (event.checked) {
            this.chart.series[event.target.index].show();
          } else {
            this.chart.series[event.target.index].hide();
          }
        },
        legendItemClick: function (event) {
          // toggle legend checkboxes
          this.chart.series[event.target.index].select();
        },

      },
      point: {
        events: {
          mouseOver: syncHighlight,
          mouseOut: syncHighlight
        }
      },
      stickyTracking: false,
      // states: {
      // 	hover: {
      // 		lineWidth: 3,
      //     brightness: 0.15,
      //     fillColor: 'yellow',
      //     marker: {
      //       fillColor: 'orange',
      //     }
      // 	}
      // },
      animation: {
        duration: 2000
      }
    }
  },
  // , responsive: {
  //   rules: [{
  //     condition: {
  //       maxWidth: 500
  //     },
  //     chartOptions: {
  //       legend: {
  //         align: 'center',
  //         verticalAlign: 'bottom',
  //         layout: 'horizontal'
  //       }
  //     }
  //   }]
  // }
};
Highcharts.setOptions(Highcharts.galleryTheme);

// Wrapping function for creating checkbox with title attribute
Highcharts.wrap(Highcharts.Legend.prototype, 'renderItem', function (proceed) {
  // Slice off this original argument of prototype function
  var legendItem = Array.prototype.slice.call(arguments, 1);

  // Apply the original function with the original arguments
  proceed.apply(this, legendItem);

  legendItem = legendItem[0];
  var checkbox = legendItem.checkbox
  // Check checkbox is present. e.g. for export no checkbox is rendered.
  if (checkbox != undefined) {
    // Add title, id and style attribute to checkbox
    // checkbox.setAttribute('title',Drupal.t('Controlling visibility') + ' ' + legendItem.name);
    // checkbox.setAttribute('style','margin-left: -15px;');

    var legendLabel = jQuery(legendItem.legendGroup.div).prepend(legendItem.checkbox);
  }
});

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
  console.log(eventType + ' chart: ' + chartIndex + ' series: ' + seriesIndex + ' point: ' + pointIndex);

  // Highlight points in all series with same 'name'
  if (seriesCount > 1) {
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

}
