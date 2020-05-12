<html>

<head>
  <title>Ranglijst - Drupal javascript</title>
  <style>
    textarea.code {
      width: 100%;
      min-height: 100px;
    }
    h3 { 
      margin-bottom: 0
    }
  </style>
</head>

<h1>Drupal HTML and Javascript code to use in supercharts for </h1>

<h3>VZinfo.Ranglijst.Supercharts.HTMLcode: algemeen</h3>

<textarea class="code">
<?php $ranglijst_naam = "algemeen"; ?>
<?php include "Drupal-html.php" ?>

<!-- ranglijst.css start -->

<style type="text/css">
<?php include "css/ranglijst.css" ?>

</style>

<!-- ranglijst.css end -->
</textarea>

<h3>VZinfo.Ranglijst.Supercharts.HTMLcode: geslacht</h3>

<textarea class="code">
<?php $ranglijst_naam = "geslacht"; ?>
<?php include "Drupal-html.php" ?>

<!-- ranglijst.css start -->

<style type="text/css">
<?php include "css/ranglijst.css" ?>

</style>

<!-- ranglijst.css end -->
</textarea>

<h3>VZinfo.Ranglijst.Supercharts.HTMLcode: leeftijd</h3>

<textarea class="code">
<?php $ranglijst_naam = "leeftijd"; ?>
<?php include "Drupal-html.php" ?>

<!-- ranglijst.css start -->

<style type="text/css">
<?php include "css/ranglijst.css" ?>

</style>

<!-- ranglijst.css end -->
</textarea>

<h3>VZinfo.Ranglijst.Supercharts.Javascript</h3>
<textarea class="code" rows="20" style="background:#e3dce7">
// chart-functions.js start ***************

<?php include "js/chart-functions.js" ?>

  // ***** Data ***** 
  vzinfo.ranglijsten.data = <?php include "data/ranglijst-data.json" ?>

  // chart-functions.js end ***************

  // Initialize ranglijsten and render charts
vzinfo.init();
</textarea>

</html>