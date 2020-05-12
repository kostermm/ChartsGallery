<!-- VZinfo.Ranglijst.Supercharts.html - start -->

<div class="ranglijst indicator">
  <label for="ranglijst_indicator">Kies een ranglijst</label>
  <select id="ranglijst_indicator">
    <option value="Doodsoorzaak">Doodsoorzaak - 2017</option>
    <option value="Verloren levensjaren">Verloren levensjaren - 2017</option>
    <option value="Verlies gezonde levensjaren">Verlies gezonde levensjaren - 2015</option>
    <option value="Voorkomen">Voorkomen - 2015</option>
    <option value="Ziektelast">Ziektelast - 2011</option>
    <?php   if ($ranglijst_naam != "geslacht") {
      echo "<option value='Zorgkosten'>Zorgkosten - 2011</option>";
    } 
?>
    
  </select>
</div>

<?php echo $_GET['fragment']; ?>

<p class="ranglijst help-text">Klik op de balk van een aandoening om de positie te zien in andere ranglijsten.</p>

<!-- data-ranglijst attribute should be one of: algemeen, geslacht, leeftijd -->
<div class="ranglijst wrapper" data-ranglijst="<?php echo $ranglijst_naam ?>"></div>

<!-- VZinfo.Ranglijst.Supercharts.html - end -->
