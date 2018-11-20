function renderCharts() {
  /* Rendering all R Charts by looping all htmlwidget containers, 
  |  find correspondig R-config object (script.json) and render chart 
  
  */
  $('div[id|="htmlwidget"').each(function (index, value) {
    var container = this;
    var id = $(this).attr('id');
    var scriptTag = $('script[data-for="' + id + '"');
    var strConfig = '', objConfig = {}, hcConfig = {};

    console.log('div' + index + ':' + id);

    // download json if src attribute is present, otherwise use text content of script tag
    if (scriptTag.attr('src') != undefined) {
      $.getJSON(scriptTag.attr('src'), function (objConfig) {
        if (objConfig.x != undefined) {
          hcConfig = objConfig.x.hc_opts;
          hcConfig = objRConfig.x.hc_opts;
        } else {
          hcConfig = objConfig;
        }

        // Add categroy numbers if no categories exist
        if (hcConfig.xAxis.categories != undefined && hcConfig.xAxis.categories.length == 0) {
          hcConfig.xAxis.categories = [];
          $.each(hcConfig.series[0].data, function (item) {
            hcConfig.xAxis.categories.push(item + 1);
          });
        }
        Highcharts.chart(id, hcConfig);
      });
    } else {
      strConfig = scriptTag.text();
      objConfig = JSON.parse(strConfig);

      console.log(objConfig);
      if (objConfig.x != undefined) {
        hcConfig = objConfig.x.hc_opts;
        hcConfig = objRConfig.x.hc_opts;
      } else {
        hcConfig = objConfig;
      }

      Highcharts.chart(id, hcConfig);
    }


  });
}
