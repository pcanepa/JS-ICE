var unitMeasure = "";
function setMeasureUnit(value) {
	unitMeasure = value;
	runJmolScriptWait("set measurements " + value);
}

function setMeasurement() {
	runJmolScriptWait("set measurements ON");
}

var mesCount = 0;
function checkMeasure(value) {
	var radiobutton = value;
	var unit = getbyID('measureDist').value;
	mesReset();
	runJmolScriptWait('set pickingStyle MEASURE ON;');
	if (radiobutton == "distance") {
		if (unit == 'select') {
			measureHint('Select the desired measure unit.');
			uncheckRadio("distance");
			return false;
		}
		measureHint('Pick two atoms');
		runJmolScriptWait('set defaultDistanceLabel "%10.2VALUE %UNITS";'
		+ 'showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking DISTANCE;'
		+ "measure ON; set measurements ON; set showMeasurements ON; set measurements ON; set measurementUnits "
				+ unit
				+ ";set picking MEASURE DISTANCE;" +
				  "set measurements ' + unitMeasure + ';"
				+ 'label ON;');

	} else if (radiobutton == "angle") {
		measureHint('Pick three atoms');
		runJmolScriptWait('set defaultAngleLabel "%10.2VALUE %UNITS";'
		+'showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking ANGLE;'
		+"measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE ANGLE;"
		+'set measurements ' + unitMeasure + ';label ON');
	} else if (radiobutton == "torsional") {
		measureHint('Pick four atoms');
		runJmolScriptWait('set defaultTorsionLabel "%10.2VALUE %UNITS";'
				+'showSelections TRUE; select none;  label on ; set picking on; set picking TORSION; set picking SELECT atom; set picking ANGLE;'
				+'measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE TORSION;label ON');
	}

}

var measureHint = function(msg) {	
	// BH 2018
	document.measureGroup.textMeasure.value = msg + "...";
}

function setMeasureText(value) {
	runJmolScriptWait("show measurements");
	var init = "\n";
	// BH 2018
	if (mesCount == 0)
		document.measureGroup.textMeasure.value = init = '';
	document.measureGroup.textMeasure.value += init + ++mesCount + " " + value;
}

function mesReset() {
	mesCount = 0;
	getbyID("textMeasure").value = "";
	runJmolScriptWait('set pickingStyle MEASURE OFF; select *; label off; halos OFF; selectionHalos OFF; measure OFF; set measurements OFF; set showMeasurements OFF;  measure DELETE;');
}
