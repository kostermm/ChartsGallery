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
    "tooltip": {
      formatter: function () {
        return '<strong><large>' + this.points[0].key + '</large></strong><br>'  + Highcharts.numberFormat(Math.abs(this.y), 0);
      }
    },
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
  $('div.chart-container.ranglijst').each(function (index, value) {
    var id = $(this).attr('id');

    console.log('div' + index + ':' + id);

    var chart = new Highcharts.Chart(chartConfig[id]);

  });
}

function showInfoTable(aandoening) {
  if (aandoeningRanglijsten.length == 0) {

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

  var rankInLists = aandoeningRanglijsten.filter(function (item, index, filter) {
    if (item[aandoeningFilter.prop] == aandoeningFilter.val) {
      return true;
    } else {
      return false;
    }
  });
  var rows = '', caption = '<caption>Positie in alle ranglijsten <br/>Aandoening: <strong> ' + rankInLists[0].Aandoening + '</strong></caption>';


  $.each(rankInLists[0], function (key, value) {
    if (key != 'Aandoening') {
      rows += '<tr><td>' + key + '</td><td class="right">' + value + '</td></tr>';
    }
  });
  // console.log(rows);
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
// chart-functions.js end ***************

console.log(chartConfig);

// Styling of Drupal parent elements
$('div.ranglijst.chart-container').closest('.field-name-field-paragraph-chart').width('100%');

// Render charts
renderCharts();

/*@license
	Papa Parse
	v4.6.0
	https://github.com/mholt/PapaParse
	License: MIT
*/
!function (e, t) { "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t() }(this, function () { "use strict"; var s, e, f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {}, r = !f.document && !!f.postMessage, o = r && /(\?|&)papaworker(=|&|$)/.test(f.location.search), a = !1, h = {}, u = 0, k = { parse: function (e, t) { var i = (t = t || {}).dynamicTyping || !1; M(i) && (t.dynamicTypingFunction = i, i = {}); if (t.dynamicTyping = i, t.transform = !!M(t.transform) && t.transform, t.worker && k.WORKERS_SUPPORTED) { var n = function () { if (!k.WORKERS_SUPPORTED) return !1; if (!a && null === k.SCRIPT_PATH) throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually."); var e = k.SCRIPT_PATH || s; e += (-1 !== e.indexOf("?") ? "&" : "?") + "papaworker"; var t = new f.Worker(e); return t.onmessage = v, t.id = u++ , h[t.id] = t }(); return n.userStep = t.step, n.userChunk = t.chunk, n.userComplete = t.complete, n.userError = t.error, t.step = M(t.step), t.chunk = M(t.chunk), t.complete = M(t.complete), t.error = M(t.error), delete t.worker, void n.postMessage({ input: e, config: t, workerId: n.id }) } var r = null; { if (e === k.NODE_STREAM_INPUT) return (r = new g(t)).getStream(); "string" == typeof e ? r = t.download ? new l(t) : new _(t) : !0 === e.readable && M(e.read) && M(e.on) ? r = new m(t) : (f.File && e instanceof File || e instanceof Object) && (r = new p(t)) } return r.stream(e) }, unparse: function (e, t) { var n = !1, f = !0, d = ",", c = "\r\n", r = '"'; !function () { if ("object" != typeof t) return; "string" != typeof t.delimiter || k.BAD_DELIMITERS.filter(function (e) { return -1 !== t.delimiter.indexOf(e) }).length || (d = t.delimiter); ("boolean" == typeof t.quotes || t.quotes instanceof Array) && (n = t.quotes); "string" == typeof t.newline && (c = t.newline); "string" == typeof t.quoteChar && (r = t.quoteChar); "boolean" == typeof t.header && (f = t.header) }(); var s = new RegExp(r, "g"); "string" == typeof e && (e = JSON.parse(e)); if (e instanceof Array) { if (!e.length || e[0] instanceof Array) return a(null, e); if ("object" == typeof e[0]) return a(i(e[0]), e) } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), e.data instanceof Array && (e.fields || (e.fields = e.meta && e.meta.fields), e.fields || (e.fields = e.data[0] instanceof Array ? e.fields : i(e.data[0])), e.data[0] instanceof Array || "object" == typeof e.data[0] || (e.data = [e.data])), a(e.fields || [], e.data || []); throw "exception: Unable to serialize unrecognized input"; function i(e) { if ("object" != typeof e) return []; var t = []; for (var i in e) t.push(i); return t } function a(e, t) { var i = ""; "string" == typeof e && (e = JSON.parse(e)), "string" == typeof t && (t = JSON.parse(t)); var n = e instanceof Array && 0 < e.length, r = !(t[0] instanceof Array); if (n && f) { for (var s = 0; s < e.length; s++)0 < s && (i += d), i += l(e[s], s); 0 < t.length && (i += c) } for (var a = 0; a < t.length; a++) { for (var o = n ? e.length : t[a].length, h = 0; h < o; h++) { 0 < h && (i += d); var u = n && r ? e[h] : h; i += l(t[a][u], h) } a < t.length - 1 && (i += c) } return i } function l(e, t) { if (null == e) return ""; if (e.constructor === Date) return JSON.stringify(e).slice(1, 25); e = e.toString().replace(s, r + r); var i = "boolean" == typeof n && n || n instanceof Array && n[t] || function (e, t) { for (var i = 0; i < t.length; i++)if (-1 < e.indexOf(t[i])) return !0; return !1 }(e, k.BAD_DELIMITERS) || -1 < e.indexOf(d) || " " === e.charAt(0) || " " === e.charAt(e.length - 1); return i ? r + e + r : e } } }; if (k.RECORD_SEP = String.fromCharCode(30), k.UNIT_SEP = String.fromCharCode(31), k.BYTE_ORDER_MARK = "\ufeff", k.BAD_DELIMITERS = ["\r", "\n", '"', k.BYTE_ORDER_MARK], k.WORKERS_SUPPORTED = !r && !!f.Worker, k.SCRIPT_PATH = null, k.NODE_STREAM_INPUT = 1, k.LocalChunkSize = 10485760, k.RemoteChunkSize = 5242880, k.DefaultDelimiter = ",", k.Parser = C, k.ParserHandle = i, k.NetworkStreamer = l, k.FileStreamer = p, k.StringStreamer = _, k.ReadableStreamStreamer = m, k.DuplexStreamStreamer = g, f.jQuery) { var d = f.jQuery; d.fn.parse = function (o) { var i = o.config || {}, h = []; return this.each(function (e) { if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length) return !0; for (var t = 0; t < this.files.length; t++)h.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i) }) }), e(), this; function e() { if (0 !== h.length) { var e, t, i, n, r = h[0]; if (M(o.before)) { var s = o.before(r.file, r.inputElem); if ("object" == typeof s) { if ("abort" === s.action) return e = "AbortError", t = r.file, i = r.inputElem, n = s.reason, void (M(o.error) && o.error({ name: e }, t, i, n)); if ("skip" === s.action) return void u(); "object" == typeof s.config && (r.instanceConfig = d.extend(r.instanceConfig, s.config)) } else if ("skip" === s) return void u() } var a = r.instanceConfig.complete; r.instanceConfig.complete = function (e) { M(a) && a(e, r.file, r.inputElem), u() }, k.parse(r.file, r.instanceConfig) } else M(o.complete) && o.complete() } function u() { h.splice(0, 1), e() } } } function c(e) { this._handle = null, this._finished = !1, this._completed = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function (e) { var t = E(e); t.chunkSize = parseInt(t.chunkSize), e.step || e.chunk || (t.chunkSize = null); this._handle = new i(t), (this._handle.streamer = this)._config = t }.call(this, e), this.parseChunk = function (e, t) { if (this.isFirstChunk && M(this._config.beforeFirstChunk)) { var i = this._config.beforeFirstChunk(e); void 0 !== i && (e = i) } this.isFirstChunk = !1; var n = this._partialLine + e; this._partialLine = ""; var r = this._handle.parse(n, this._baseIndex, !this._finished); if (!this._handle.paused() && !this._handle.aborted()) { var s = r.meta.cursor; this._finished || (this._partialLine = n.substring(s - this._baseIndex), this._baseIndex = s), r && r.data && (this._rowCount += r.data.length); var a = this._finished || this._config.preview && this._rowCount >= this._config.preview; if (o) f.postMessage({ results: r, workerId: k.WORKER_ID, finished: a }); else if (M(this._config.chunk) && !t) { if (this._config.chunk(r, this._handle), this._handle.paused() || this._handle.aborted()) return; r = void 0, this._completeResults = void 0 } return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r.data), this._completeResults.errors = this._completeResults.errors.concat(r.errors), this._completeResults.meta = r.meta), this._completed || !a || !M(this._config.complete) || r && r.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), a || r && r.meta.paused || this._nextChunk(), r } }, this._sendError = function (e) { M(this._config.error) ? this._config.error(e) : o && this._config.error && f.postMessage({ workerId: k.WORKER_ID, error: e, finished: !1 }) } } function l(e) { var n; (e = e || {}).chunkSize || (e.chunkSize = k.RemoteChunkSize), c.call(this, e), this._nextChunk = r ? function () { this._readChunk(), this._chunkLoaded() } : function () { this._readChunk() }, this.stream = function (e) { this._input = e, this._nextChunk() }, this._readChunk = function () { if (this._finished) this._chunkLoaded(); else { if (n = new XMLHttpRequest, this._config.withCredentials && (n.withCredentials = this._config.withCredentials), r || (n.onload = R(this._chunkLoaded, this), n.onerror = R(this._chunkError, this)), n.open("GET", this._input, !r), this._config.downloadRequestHeaders) { var e = this._config.downloadRequestHeaders; for (var t in e) n.setRequestHeader(t, e[t]) } if (this._config.chunkSize) { var i = this._start + this._config.chunkSize - 1; n.setRequestHeader("Range", "bytes=" + this._start + "-" + i), n.setRequestHeader("If-None-Match", "webkit-no-cache") } try { n.send() } catch (e) { this._chunkError(e.message) } r && 0 === n.status ? this._chunkError() : this._start += this._config.chunkSize } }, this._chunkLoaded = function () { 4 === n.readyState && (n.status < 200 || 400 <= n.status ? this._chunkError() : (this._finished = !this._config.chunkSize || this._start > function (e) { var t = e.getResponseHeader("Content-Range"); if (null === t) return -1; return parseInt(t.substr(t.lastIndexOf("/") + 1)) }(n), this.parseChunk(n.responseText))) }, this._chunkError = function (e) { var t = n.statusText || e; this._sendError(new Error(t)) } } function p(e) { var n, r; (e = e || {}).chunkSize || (e.chunkSize = k.LocalChunkSize), c.call(this, e); var s = "undefined" != typeof FileReader; this.stream = function (e) { this._input = e, r = e.slice || e.webkitSlice || e.mozSlice, s ? ((n = new FileReader).onload = R(this._chunkLoaded, this), n.onerror = R(this._chunkError, this)) : n = new FileReaderSync, this._nextChunk() }, this._nextChunk = function () { this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk() }, this._readChunk = function () { var e = this._input; if (this._config.chunkSize) { var t = Math.min(this._start + this._config.chunkSize, this._input.size); e = r.call(e, this._start, t) } var i = n.readAsText(e, this._config.encoding); s || this._chunkLoaded({ target: { result: i } }) }, this._chunkLoaded = function (e) { this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e.target.result) }, this._chunkError = function () { this._sendError(n.error) } } function _(e) { var i; c.call(this, e = e || {}), this.stream = function (e) { return i = e, this._nextChunk() }, this._nextChunk = function () { if (!this._finished) { var e = this._config.chunkSize, t = e ? i.substr(0, e) : i; return i = e ? i.substr(e) : "", this._finished = !i, this.parseChunk(t) } } } function m(e) { c.call(this, e = e || {}); var t = [], i = !0, n = !1; this.pause = function () { c.prototype.pause.apply(this, arguments), this._input.pause() }, this.resume = function () { c.prototype.resume.apply(this, arguments), this._input.resume() }, this.stream = function (e) { this._input = e, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError) }, this._checkIsFinished = function () { n && 1 === t.length && (this._finished = !0) }, this._nextChunk = function () { this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i = !0 }, this._streamData = R(function (e) { try { t.push("string" == typeof e ? e : e.toString(this._config.encoding)), i && (i = !1, this._checkIsFinished(), this.parseChunk(t.shift())) } catch (e) { this._streamError(e) } }, this), this._streamError = R(function (e) { this._streamCleanUp(), this._sendError(e) }, this), this._streamEnd = R(function () { this._streamCleanUp(), n = !0, this._streamData("") }, this), this._streamCleanUp = R(function () { this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError) }, this) } function g(e) { var t = require("stream").Duplex, i = E(e), n = !0, r = !1, s = [], a = null; this._onCsvData = function (e) { for (var t = e.data, i = 0; i < t.length; i++)a.push(t[i]) || this._handle.paused() || this._handle.pause() }, this._onCsvComplete = function () { a.push(null) }, i.step = R(this._onCsvData, this), i.complete = R(this._onCsvComplete, this), c.call(this, i), this._nextChunk = function () { r && 1 === s.length && (this._finished = !0), s.length ? s.shift()() : n = !0 }, this._addToParseQueue = function (e, t) { s.push(R(function () { if (this.parseChunk("string" == typeof e ? e : e.toString(i.encoding)), M(t)) return t() }, this)), n && (n = !1, this._nextChunk()) }, this._onRead = function () { this._handle.paused() && this._handle.resume() }, this._onWrite = function (e, t, i) { this._addToParseQueue(e, i) }, this._onWriteComplete = function () { r = !0, this._addToParseQueue("") }, this.getStream = function () { return a }, (a = new t({ readableObjectMode: !0, decodeStrings: !1, read: R(this._onRead, this), write: R(this._onWrite, this) })).once("finish", R(this._onWriteComplete, this)) } function i(m) { var a, o, h, n = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i, r = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/, t = this, i = 0, s = 0, u = !1, e = !1, f = [], d = { data: [], errors: [], meta: {} }; if (M(m.step)) { var c = m.step; m.step = function (e) { if (d = e, p()) l(); else { if (l(), 0 === d.data.length) return; i += e.data.length, m.preview && i > m.preview ? o.abort() : c(d, t) } } } function g(e) { return "greedy" === m.skipEmptyLines ? "" === e.join("").trim() : 1 === e.length && 0 === e[0].length } function l() { if (d && h && (v("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + k.DefaultDelimiter + "'"), h = !1), m.skipEmptyLines) for (var e = 0; e < d.data.length; e++)g(d.data[e]) && d.data.splice(e--, 1); return p() && function () { if (!d) return; for (var e = 0; p() && e < d.data.length; e++)for (var t = 0; t < d.data[e].length; t++) { var i = d.data[e][t]; m.trimHeaders && (i = i.trim()), f.push(i) } d.data.splice(0, 1) }(), function () { if (!d || !m.header && !m.dynamicTyping && !m.transform) return d; for (var e = 0; e < d.data.length; e++) { var t, i = m.header ? {} : []; for (t = 0; t < d.data[e].length; t++) { var n = t, r = d.data[e][t]; m.header && (n = t >= f.length ? "__parsed_extra" : f[t]), m.transform && (r = m.transform(r, n)), r = _(n, r), "__parsed_extra" === n ? (i[n] = i[n] || [], i[n].push(r)) : i[n] = r } d.data[e] = i, m.header && (t > f.length ? v("FieldMismatch", "TooManyFields", "Too many fields: expected " + f.length + " fields but parsed " + t, s + e) : t < f.length && v("FieldMismatch", "TooFewFields", "Too few fields: expected " + f.length + " fields but parsed " + t, s + e)) } m.header && d.meta && (d.meta.fields = f); return s += d.data.length, d }() } function p() { return m.header && 0 === f.length } function _(e, t) { return i = e, m.dynamicTypingFunction && void 0 === m.dynamicTyping[i] && (m.dynamicTyping[i] = m.dynamicTypingFunction(i)), !0 === (m.dynamicTyping[i] || m.dynamicTyping) ? "true" === t || "TRUE" === t || "false" !== t && "FALSE" !== t && (n.test(t) ? parseFloat(t) : r.test(t) ? new Date(t) : "" === t ? null : t) : t; var i } function v(e, t, i, n) { d.errors.push({ type: e, code: t, message: i, row: n }) } this.parse = function (e, t, i) { var n = m.quoteChar || '"'; if (m.newline || (m.newline = function (e, t) { e = e.substr(0, 1048576); var i = new RegExp(y(t) + "([^]*?)" + y(t), "gm"), n = (e = e.replace(i, "")).split("\r"), r = e.split("\n"), s = 1 < r.length && r[0].length < n[0].length; if (1 === n.length || s) return "\n"; for (var a = 0, o = 0; o < n.length; o++)"\n" === n[o][0] && a++; return a >= n.length / 2 ? "\r\n" : "\r" }(e, n)), h = !1, m.delimiter) M(m.delimiter) && (m.delimiter = m.delimiter(e), d.meta.delimiter = m.delimiter); else { var r = function (e, t, i, n) { for (var r, s, a, o = [",", "\t", "|", ";", k.RECORD_SEP, k.UNIT_SEP], h = 0; h < o.length; h++) { var u = o[h], f = 0, d = 0, c = 0; a = void 0; for (var l = new C({ comments: n, delimiter: u, newline: t, preview: 10 }).parse(e), p = 0; p < l.data.length; p++)if (i && g(l.data[p])) c++; else { var _ = l.data[p].length; d += _, void 0 !== a ? 1 < _ && (f += Math.abs(_ - a), a = _) : a = _ } 0 < l.data.length && (d /= l.data.length - c), (void 0 === s || f < s) && 1.99 < d && (s = f, r = u) } return { successful: !!(m.delimiter = r), bestDelimiter: r } }(e, m.newline, m.skipEmptyLines, m.comments); r.successful ? m.delimiter = r.bestDelimiter : (h = !0, m.delimiter = k.DefaultDelimiter), d.meta.delimiter = m.delimiter } var s = E(m); return m.preview && m.header && s.preview++ , a = e, o = new C(s), d = o.parse(a, t, i), l(), u ? { meta: { paused: !0 } } : d || { meta: { paused: !1 } } }, this.paused = function () { return u }, this.pause = function () { u = !0, o.abort(), a = a.substr(o.getCharIndex()) }, this.resume = function () { u = !1, t.streamer.parseChunk(a, !0) }, this.aborted = function () { return e }, this.abort = function () { e = !0, o.abort(), d.meta.aborted = !0, M(m.complete) && m.complete(d), a = "" } } function y(e) { return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } function C(e) { var S, x = (e = e || {}).delimiter, T = e.newline, O = e.comments, I = e.step, D = e.preview, P = e.fastMode, L = S = void 0 === e.quoteChar ? '"' : e.quoteChar; if (void 0 !== e.escapeChar && (L = e.escapeChar), ("string" != typeof x || -1 < k.BAD_DELIMITERS.indexOf(x)) && (x = ","), O === x) throw "Comment character same as delimiter"; !0 === O ? O = "#" : ("string" != typeof O || -1 < k.BAD_DELIMITERS.indexOf(O)) && (O = !1), "\n" !== T && "\r" !== T && "\r\n" !== T && (T = "\n"); var A = 0, F = !1; this.parse = function (n, t, i) { if ("string" != typeof n) throw "Input must be a string"; var r = n.length, e = x.length, s = T.length, a = O.length, o = M(I), h = [], u = [], f = [], d = A = 0; if (!n) return E(); if (P || !1 !== P && -1 === n.indexOf(S)) { for (var c = n.split(T), l = 0; l < c.length; l++) { if (f = c[l], A += f.length, l !== c.length - 1) A += T.length; else if (i) return E(); if (!O || f.substr(0, a) !== O) { if (o) { if (h = [], y(f.split(x)), R(), F) return E() } else y(f.split(x)); if (D && D <= l) return h = h.slice(0, D), E(!0) } } return E() } for (var p, _ = n.indexOf(x, A), m = n.indexOf(T, A), g = new RegExp(L.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&") + S, "g"); ;)if (n[A] !== S) if (O && 0 === f.length && n.substr(A, a) === O) { if (-1 === m) return E(); A = m + s, m = n.indexOf(T, A), _ = n.indexOf(x, A) } else if (-1 !== _ && (_ < m || -1 === m)) f.push(n.substring(A, _)), A = _ + e, _ = n.indexOf(x, A); else { if (-1 === m) break; if (f.push(n.substring(A, m)), w(m + s), o && (R(), F)) return E(); if (D && h.length >= D) return E(!0) } else for (p = A, A++; ;) { if (-1 === (p = n.indexOf(S, p + 1))) return i || u.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h.length, index: A }), b(); if (p === r - 1) return b(n.substring(A, p).replace(g, S)); if (S !== L || n[p + 1] !== L) { if (S === L || 0 === p || n[p - 1] !== L) { var v = C(-1 === m ? _ : Math.min(_, m)); if (n[p + 1 + v] === x) { f.push(n.substring(A, p).replace(g, S)), A = p + 1 + v + e, _ = n.indexOf(x, A), m = n.indexOf(T, A); break } var k = C(m); if (n.substr(p + 1 + k, s) === T) { if (f.push(n.substring(A, p).replace(g, S)), w(p + 1 + k + s), _ = n.indexOf(x, A), o && (R(), F)) return E(); if (D && h.length >= D) return E(!0); break } u.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h.length, index: A }), p++ } } else p++ } return b(); function y(e) { h.push(e), d = A } function C(e) { var t = 0; if (-1 !== e) { var i = n.substring(p + 1, e); i && "" === i.trim() && (t = i.length) } return t } function b(e) { return i || (void 0 === e && (e = n.substr(A)), f.push(e), A = r, y(f), o && R()), E() } function w(e) { A = e, y(f), f = [], m = n.indexOf(T, A) } function E(e) { return { data: h, errors: u, meta: { delimiter: x, linebreak: T, aborted: F, truncated: !!e, cursor: d + (t || 0) } } } function R() { I(E()), h = [], u = [] } }, this.abort = function () { F = !0 }, this.getCharIndex = function () { return A } } function v(e) { var t = e.data, i = h[t.workerId], n = !1; if (t.error) i.userError(t.error, t.file); else if (t.results && t.results.data) { var r = { abort: function () { n = !0, b(t.workerId, { data: [], errors: [], meta: { aborted: !0 } }) }, pause: w, resume: w }; if (M(i.userStep)) { for (var s = 0; s < t.results.data.length && (i.userStep({ data: [t.results.data[s]], errors: t.results.errors, meta: t.results.meta }, r), !n); s++); delete t.results } else M(i.userChunk) && (i.userChunk(t.results, r, t.file), delete t.results) } t.finished && !n && b(t.workerId, t.results) } function b(e, t) { var i = h[e]; M(i.userComplete) && i.userComplete(t), i.terminate(), delete h[e] } function w() { throw "Not implemented." } function E(e) { if ("object" != typeof e || null === e) return e; var t = e instanceof Array ? [] : {}; for (var i in e) t[i] = E(e[i]); return t } function R(e, t) { return function () { e.apply(t, arguments) } } function M(e) { return "function" == typeof e } return o ? f.onmessage = function (e) { var t = e.data; void 0 === k.WORKER_ID && t && (k.WORKER_ID = t.workerId); if ("string" == typeof t.input) f.postMessage({ workerId: k.WORKER_ID, results: k.parse(t.input, t.config), finished: !0 }); else if (f.File && t.input instanceof File || t.input instanceof Object) { var i = k.parse(t.input, t.config); i && f.postMessage({ workerId: k.WORKER_ID, results: i, finished: !0 }) } } : k.WORKERS_SUPPORTED && (e = document.getElementsByTagName("script"), s = e.length ? e[e.length - 1].src : "", document.body ? document.addEventListener("DOMContentLoaded", function () { a = !0 }, !0) : a = !0), (l.prototype = Object.create(c.prototype)).constructor = l, (p.prototype = Object.create(c.prototype)).constructor = p, (_.prototype = Object.create(_.prototype)).constructor = _, (m.prototype = Object.create(c.prototype)).constructor = m, (g.prototype = Object.create(c.prototype)).constructor = g, k });