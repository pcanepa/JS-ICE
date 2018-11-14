
_measure = {
	kindCoord: "",
	measureCoord : false,
	unitMeasure : "",
	mesCount : 0
}

function enterMeasure() {

}

function exitMeasure() {
	measureCoord = false;
}

function viewCoord(value) {
	_measure.kindCoord = value;
	measureCoord = true;
	messageMsg("Pick the atom you are interested in, please.");
	setPickingCallbackFunction(showCoord);
	runJmolScriptWait("select *; label off;"
			+ 'set defaultDistanceLabel "%2.7VALUE %UNITS";'
			+ 'showSelections TRUE; select none; set picking ON;set picking LABEL; set picking SELECT atom; halos on; set LABEL on;');
}

function showCoord() {
	if (measureCoord) {
		if (_measure.kindCoord == "fractional") {
			runJmolScriptWait('Label "%a: %.2[fX] %.2[fY] %.2[fZ]"');
		} else {
			runJmolScriptWait('Label "%a: %1.2[atomX] %1.2[atomY] %1.2[atomZ]"');
		}
	}
}

function setMeasureUnit(value) {
	unitMeasure = value;
	runJmolScriptWait("set measurements " + value);
}

function setMeasurement() {
	runJmolScriptWait("set measurements ON");
}

function checkMeasure(value) {
	var radiobutton = value;
	var unit = getbyID('measureDist').value;
	mesReset();
	runJmolScriptWait('set pickingStyle MEASURE ON; set MeasureCallback "measuramentCallback";');
	if (radiobutton == "distance") {
		if (unit == 'select') {
			measureHint('Select the desired measure unit.');
			uncheckRadio("distance");
			return false;
		}
		measureHint('Pick two atoms');
		runJmolScriptWait('set defaultDistanceLabel "%2.3VALUE %UNITS";'
				+ 'showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking DISTANCE;'
				+ "measure ON; set measurements ON; set showMeasurements ON; set measurements ON; set measurementUnits "
				+ unit + ";set picking MEASURE DISTANCE;" + "set measurements "
				+ unit + ";" + 'label ON;');

	} else if (radiobutton == "angle") {
		measureHint('Pick three atoms');
		runJmolScriptWait('set defaultAngleLabel "%2.3VALUE %UNITS";'
				+ 'showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking ANGLE;'
				+ "measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE ANGLE;"
				+ 'set measurements ' + unitMeasure + ';label ON');
	} else if (radiobutton == "torsional") {
		measureHint('Pick four atoms');
		runJmolScriptWait('set defaultTorsionLabel "%2.3VALUE %UNITS";'
				+ 'showSelections TRUE; select none;  label on ; set picking on; set picking TORSION; set picking SELECT atom; set picking ANGLE;'
				+ 'measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE TORSION;label ON');
	}
	setMeasureText()

}

var measureHint = function(msg) {
	// BH 2018
	document.measureGroup.textMeasure.value = msg + "...";
}

function setMeasureSize(value) {
	runJmolScriptWait("select *; font label " + value + " ; font measure "
			+ value + " ; select none;");
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

function measuramentCallback(a, b, c, d, e) {
	setMeasureText(b);
}

function createMeasureGrp() {
	var measureName = new Array("select", "Angstroms", "Bohr", "nanometers",
	"picometers");
	var measureValue = new Array("select", "angstroms", "BOHR", "nm", "pm");
	var textValue = new Array("0", "6", "8", "10", "12", "16", "20", "24", "30");
	var textText = new Array("select", "6 pt", "8 pt", "10 pt", "12 pt",
			"16 pt", "20 pt", "24 pt", "30 pt");
	
	var strMeas = "<form autocomplete='nope'  id='measureGroup' name='measureGroup' style='display:none'>";
	strMeas += "<table class='contents'><tr><td > \n";
	strMeas += "<h2>Measure and Info</h2>\n";
	strMeas += "</td></tr>\n";
	strMeas += "<tr><td colspan='2'>\n";
	strMeas += "Measure<br>\n";
	strMeas += createRadio("distance", "distance", 'checkMeasure(value)', '',
			0, "", "distance");
	strMeas += createSelectFunc('measureDist', 'setMeasureUnit(value)',
			'setTimeout("setMeasureUnit(value) ",50)', 0, 1, measureValue,
			measureName)
			+ " ";
	strMeas += createRadio("distance", "angle", 'checkMeasure(value)', '', 0,
			"", "angle");
	strMeas += createRadio("distance", "torsional", 'checkMeasure(value)', '',
			0, "", "torsional");
	strMeas += "<br><br> Measure value: <br>"
		+ createTextArea("textMeasure", "", 10, 60, "");
	strMeas += "<br>"
		+ createButton('resetMeasure', 'Delete Measure/s', 'mesReset()', '')
		+ "<br>";
	strMeas += "</td></tr>\n";
	strMeas += "<tr><td>Measure colour: "
		+ createButton("colorMeasure", "Default colour",
				'runJmolScriptWait("color measures none")', 0) + "</td><td >\n";
	strMeas += "<script align='left'>jmolColorPickerBox([setColorWhat, 'measures'],[255,255,255],'measureColorPicker')</script>";
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += "View coordinates: ";
	strMeas += createRadio("coord", "fractional", 'viewCoord(value)', '', 0, "", "fractional");
	strMeas += createRadio("coord", "cartesian", 'viewCoord(value)', '', 0, "", "cartesian");
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += "Font size ";
	strMeas += createSelect("fSize", "setMeasureSize(value)", 0, 1,
			textValue, textText);
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "</table></FORM>  \n";
	return strMeas;
}

