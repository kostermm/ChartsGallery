<!DOCTYPE HTML>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Algemeen - VZinfo ranglijst</title>

  <link rel="stylesheet" href="css/vzinfo.css" />
  <link rel="stylesheet" href="css/ranglijst.css" />

  <script src="js/jquery/jquery-1.4.4.min.js"></script>
  <script src="js/highcharts/highcharts.src.js"></script>
  <script src="js/highcharts/modules/exporting.js"></script>
  <script src="js/highcharts/modules/export-csv.js"></script>

  <!-- Ranglijsten theme & script -->
  <!-- <script type="text/javascript" src="js/chart-functions.js?20190215"></script> -->
  <script type="text/javascript" src="totaal-functions-data.php"></script>
  <script src="js/themes/vzinfo_highchartstheme.js?20190215"></script>
</head>

<body>

  <article class="venz_paragraph">

    <ul>
      <li><a href="algemeen.php">Algemeen</a></li>
      <li><a href="geslacht.html">Geslacht</a></li>
      <li><a href="leeftijd.html">Leeftijd</a></li>
    </ul>

    <h2 class="title" id="page-title">Ranglijst</h2>

<?php $ranglijst_naam = "algemeen"; 
  require "Drupal-html.php"
?>


  </article>

  <script type="text/javascript">
  vzinfo.init();
  </script>
</body>

</html>