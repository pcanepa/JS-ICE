function enterCell() {
	getUnitcell(_file.frameValue);
//	getSymInfo();
}

function exitCell() {
}

function saveFractionalCoordinate() {
	warningMsg("Make sure you have selected the model you would like to export.");

	if (_file.frameSelection == null)
		getUnitcell("1");

	var x = "var cellp = [" + roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.b)
	+ ", " + roundNumber(_file.cell.c) + ", " + roundNumber(_file.cell.alpha) + ", "
	+ roundNumber(_file.cell.beta) + ", " + roundNumber(_file.cell.gamma) + "];"
	+ 'var cellparam = cellp.join(" ");' + 'var xyzfrac = '
	+ _file.frameSelection + '.label("%a %16.9[fxyz]");'
	+ 'var lista = [cellparam, xyzfrac];'
	+ 'WRITE VAR lista "?.XYZfrac" ';
	runJmolScriptWait(x);
}

//This reads out cell parameters given astructure.
function getUnitcell(i) {
	// document.cellGroup.reset();
	_file.cell.typeSystem = "";
	var StringUnitcell = "auxiliaryinfo.models[" + (i || 1) + "].infoUnitCell";
	var cellparam = extractInfoJmol(StringUnitcell);

	_file.cell.a = roundNumber(cellparam[0]);
	_file.cell.b = roundNumber(cellparam[1]);
	_file.cell.c = roundNumber(cellparam[2]);
	_file.cell.dimensionality = parseFloat(cellparam[15]);
	_file.cell.volumeCell = roundNumber(cellparam[16]);

	var bOvera = roundNumber(parseFloat(_file.cell.b / _file.cell.c));
	var cOvera = roundNumber(parseFloat(_file.cell.c / _file.cell.a));

	switch (_file.cell.dimensionality) {
	case 1:
		_file.cell.b = 0.000;
		_file.cell.c = 0.000;
		makeEnable("par_a");
		setValue("par_a", "");
		makeDisable("par_b");
		setValue("par_b", "1");
		makeDisable("par_c");
		setValue("par_c", "1");
		setValue("bovera", "0");
		setValue("covera", "0");
		_file.cell.typeSystem = "polymer";
		break;
	case 2:
		_file.cell.c = 0.000;
		_file.cell.typeSystem = "slab";
		makeEnable("par_a");
		setValue("par_a", "");
		makeEnable("par_b");
		setValue("par_b", "");
		makeDisable("par_c");
		setValue("par_c", "1");
		setValue("bovera", bOvera);
		setValue("covera", "0");
		break;
	case 3:
		_file.cell.typeSystem = "crystal";
		_file.cell.alpha = cellparam[3];
		_file.cell.beta = cellparam[4];
		_file.cell.gamma = cellparam[5];
		makeEnable("par_a");
		setValue("par_a", "");
		makeEnable("par_b");
		setValue("par_b", "");
		makeEnable("par_c");
		setValue("par_c", "");
		setValue("bovera", bOvera);
		setValue("covera", cOvera);
		break;
	default:
	  if (!cellparam[0] && !cellparam[1] && !cellparam[2] && !cellparam[4]) {
		_file.cell.a = 0.00;
		_file.cell.b = 0.00;
		_file.cell.c = 0.00;
		_file.cell.alpha = 0.00;
		_file.cell.beta = 0.00;
		_file.cell.gamma = 0.00;
		_file.cell.typeSystem = "molecule";
		setValue("bovera", "0");
		setValue("covera", "0");
	  }
	}
	setValue("cell.a", roundNumber(_file.cell.a));
	setValue("cell.b", roundNumber(_file.cell.b));
	setValue("cell.c", roundNumber(_file.cell.c));
	setValue("cell.alpha", roundNumber(_file.cell.alpha));
	setValue("cell.beta", roundNumber(_file.cell.beta));
	setValue("cell.gamma", roundNumber(_file.cell.gamma));
	setValue("cell.volumeCell", roundNumber(_file.cell.volumeCell));

}

function setUnitCell() {
	getUnitcell(_file.frameValue);
	if (_file.frameSelection == null || _file.frameSelection == "" || _file.frameValue == ""
		|| _file.frameValue == null) {
		_file.frameSelection = "{1.1}";
		_file.frameNum = "1.1";
		getUnitcell("1");
	}
}
////END OPEN SAVE FUNCTIONS

///////////////
//////////////CELL AND ORIENTATION FUNCTION
/////////////

function setCellMeasure(value) {
	_file.cell.typeSystem = "";
	var i = _file.frameValue;
	var StringUnitcell = "auxiliaryinfo.models[" + (i || 1) + "].infoUnitCell";
	var cellparam = extractInfoJmol(StringUnitcell);
	_file.cell.a = cellparam[0];
	_file.cell.b = cellparam[1];
	_file.cell.c = cellparam[2];
	if (value == "a") {
		setValue("cell.a", roundNumber(_file.cell.a));
		setValue("cell.b", roundNumber(_file.cell.b));
		setValue("cell.c", roundNumber(_file.cell.c));
	} else {
		_file.cell.a *= 1.889725989;
		_file.cell.b *= 1.889725989;
		_file.cell.c *= 1.889725989;
		setValue("cell.a", roundNumber(_file.cell.a));
		setValue("cell.b", roundNumber(_file.cell.b));
		setValue("cell.c", roundNumber(_file.cell.c));
	}
}

function setCellDotted() {
	var cella = checkBoxX('cellDott');
	if (cella == "on") {
		runJmolScriptWait("unitcell DOTTED ;");
	} else {
		runJmolScriptWait("unitcell ON;");
	}
}

getCurrentPacking = function() {
	// BH 2018
	getValue("par_a") || setValue("par_a", 1);
	getValue("par_b") || setValue("par_b", 1);
	getValue("par_c") || setValue("par_c", 1);
	return '{ ' + getValue("par_a") + ' ' + getValue("par_b") + ' ' + getValue("par_c") + '} ';
}

getCurrentUnitCell = function() {
	return '[ ' + parseFloat(getValue('a_frac')) + ' '
		+ parseFloat(getValue('b_frac')) + ' '
		+ parseFloat(getValue('c_frac')) + ' '
		+ parseFloat(getValue('alpha_frac')) + ' '
		+ parseFloat(getValue('beta_frac')) + ' '
		+ parseFloat(getValue('gamma_frac')) + ' ]'
}
//This gets values from textboxes using them to build supercells
function setPackaging(packMode) {
	var filter = getKindCell();
	var cell = getCurrentPacking();
	// BH 2018 adds save/restore orientation
	runJmolScriptWait('save orientation o;');
	var checkboxSuper = checkBoxX("supercellForce");
	if (checkboxSuper == "on") {
		warningMsg("You decided to constrain your original supercell to form a supercell. \n The symmetry was reduced to P1.");
		reload("{1 1 1} SUPERCELL " + cell + packMode, filter);
	} else {
		reload(cell + packMode, filter);
	}
	runJmolScriptWait("restore orientation o;");
	setUnitCell();
}


getKindCell = function() {
	var kindCell = getbyName("cella");
	var kindCellfinal = null;
	for (var i = 0; i < kindCell.length; i++)
		if (kindCell[i].checked)
			return kindCell[i].value;
	return "";
}

function setPackRangeAndReload(val) {
	packRange = val;
	reload("{1 1 1} RANGE " + val, getKindCell());
	cellOperation();
}

function checkPack() {
	uncheckBox("superPack");
	// This initialize the bar
	getbyID("slider.packMsg").innerHTML = 0 + " &#197";
}

function uncheckPack() {
	uncheckBox("chPack");
	getbyID("packDiv").style.display = "none";
	setCellType(getKindCell());
}

function setCellType(value) {
	// BH 2018 Q: logic here?
	var valueConv = checkBoxX("superPack");
	var checkBoxchPack = checkBoxX("chPack");
	if (valueConv == "on" && checkBoxchPack == "off") {
		reload(null, value);
	} else if (valueConv == "off" && checkBoxchPack == "on") {
		reload("{1 1 1} RANGE " + packRange, value);
	} else {
		reload(null, value);
	}
	cellOperation();
}

function applyPack(range) {
	setPackRangeAndReload(parseFloat(range).toPrecision(2));
	getbyID("slider.packMsg").innerHTML = packRange + " &#197";
}

function setManualOrigin() {

	var x = getValue("par_x");
	var y = getValue("par_y");
	var z = getValue("par_z");

	if (x == "" || y == "" || z == "") {
		errorMsg("Please, check values entered in the textboxes");
		return false;
	}
	runJmolScriptWait("unitcell { " + x + " " + y + " " + z + " };");
	cellOperation();
}

function setFashionAB(valueList) {

	var radio = getbyName("abFashion");
	for (var i = 0; i < radio.length; i++) {
		if (radio[i].checked == true)
			var radioValue = radio[i].value;
	}

	var fashion = (radioValue == "on") ? 'OPAQUE' : 'TRANSLUCENT';

	if (valueList != "select")
		runJmolScriptWait('color ' + valueList + ' ' + fashion);
}

function setUnitCellOrigin(value) {
	runJmolScriptWait("unitcell { " + value + " }");
	var aval = value.split(" ");
	setValue("par_x", eval(aval[0]));
	setValue("par_y", eval(aval[1]));
	setValue("par_z", eval(aval[2]));
}





function createCellGrp() {
	var unitcellName = new Array("0 0 0", "1/2 1/2 1/2", "1/2 0 0", "0 1/2 0",
			"0 0 1/2", "-1/2 -1/2 -1/2", "1 1 1", "-1 -1 -1", "1 0 0", "0 1 0",
	"0 0 1");
	var unitcellSize = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9",
			"10", "11", "12", "13", "14", "15", "16", "17", "18", "19");
	var strCell = "<form autocomplete='nope'  id='cellGroup' name='cellGroup' style='display:none'>";
	strCell += "<table class='contents'><tr><td><h2>Cell properties</h2></td></tr>\n";
	strCell += "<tr><td colspan='2'>"
		+ createCheck("cell", "View Cell",
				"setJmolFromCheckbox(this, this.value)", 0, 1, "unitcell");
	strCell += createCheck("axes", "View axes",
			"setJmolFromCheckbox(this, this.value)", 0, 1, "set showAxes");
	strCell += "</td></tr><tr><td> Cell style:  \n";
	strCell += "size "
		+ createSelectFunc('offsetCell',
				'runJmolScriptWait("set unitcell " + value + ";")',
				'setTimeout("runJmolScriptWait("set unitcell " + value +";")",50)', 0,
				1, unitcellSize, unitcellSize) + "\n";
	strCell += " dotted "
		+ createCheck("cellDott", "dotted, ", "setCellDotted()", 0, 0,
		"DOTTED") + "  color ";
	strCell += "</td><td align='left'>\n";
	strCell += "<script align='left'>jmolColorPickerBox([setColorWhat, 'unitCell'],[0,0,0],'unitcellColorPicker')</script>";
	strCell += "</td></tr>\n";
	// strCell += createLine('blue', '');
	strCell += "<tr><td colspan='2'>Set cell:  \n";

	strCell += createRadio("cella", "primitive", 'setCellType(value)', 0, 1,
			"primitive", "primitive")
			+ "\n";
	strCell += createRadio("cella", "conventional", 'setCellType(value)', 0, 0,
			"conventional", "conventional")
			+ "\n";
	strCell += "</td></tr>\n";
	strCell += "<tr><td> \n";
	strCell += createCheck('superPack', 'Auto Pack', 'uncheckPack()', 0, 1, '')
	+ " ";
	strCell += createCheck('chPack', 'Choose Pack Range',
			'checkPack() + toggleDiv(this,"packDiv")', '', '', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td> \n";
	strCell += "<div id='packDiv' style='display:none; margin-top:30px'>";
	strCell += createSlider("pack");
	strCell += "</div></td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += createLine('blue', '');
	strCell += "Supercell: <br>";
	strCell += "</td></tr><tr><td colspan='2'>\n";
	strCell += "<i>a: </i>";
	strCell += "<input type='text'  name='par_a' id='par_a' size='1' class='text'>";
	strCell += "<i> b: </i>";
	strCell += "<input type='text' name='par_b' id='par_b' size='1' class='text'>";
	strCell += "<i> c: </i>";
	strCell += "<input type='text'  name='par_c' id='par_c' size='1' class='text'> &#197;";
	strCell += createCheck('supercellForce', 'force supercell (P1)', '', '',
			'', '')
			+ "<br>\n";
	strCell += createButton('set_pack', 'pack', 'setPackaging("packed")', '') + " \n";
	strCell += createButton('set_pack', 'centroid', 'setPackaging("centroid")', '') + " \n";
	strCell += createButton('set_pack', 'unpack', 'setPackaging("")', '') + " \n";
	strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += "Offset unitcell \n<br>";
	strCell += "Common offsets "
		+ createSelectFunc('offsetCell', 'setUnitCellOrigin(value)',
				'setTimeout("setUnitCellOrigin(value)",50)', 0, 1,
				unitcellName, unitcellName) + "\n";
	strCell += "<br>  \n"
		strCell += createButton('advanceCelloffset', '+',
				'toggleDivValue(true,"advanceCelloffDiv",this)', '')
				+ " Advanced cell-offset options <br>"
				strCell += "<div id='advanceCelloffDiv' style='display:none; margin-top:20px'>"
					+ createCheck("manualCellset", "Manual set",
							'checkBoxStatus(this, "offsetCell")', 0, 0, "manualCellset")
							+ "\n";
	strCell += " x: ";
	strCell += "<input type='text'  name='par_x' id='par_x' size='3' class='text'>";
	strCell += " y: ";
	strCell += "<input type='text'  name='par_y' id='par_y' size='3' class='text'>";
	strCell += " z: ";
	strCell += "<input type='text'  name='par_z' id='par_z' size='3' class='text'>";
	strCell += createButton('setnewOrigin', 'set', 'setManualOrigin()', '')
	+ " \n";
	strCell += "</div>";
	strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr ><td colspan='2'>\n";
	strCell += "Cell parameters (selected model)<br>\n";
	strCell += "Unit: "
		+ createRadio("cellMeasure", "&#197", 'setCellMeasure(value)', 0,
				1, "", "a") + "\n";
	strCell += createRadio("cellMeasure", "Bohr", 'setCellMeasure(value)', 0,
			0, "", "b")
			+ "\n <br>";
	strCell += "<i>a</i> " + createText2("cell.a", "", 7, 1);
	strCell += "<i>b</i> " + createText2("cell.b", "", 7, 1);
	strCell += "<i>c</i> " + createText2("cell.c", "", 7, 1) + "<br><br>\n";
	strCell += "<i>&#945;</i> " + createText2("cell.alpha", "", 7, 1);
	strCell += "<i>&#946;</i> " + createText2("cell.beta", "", 7, 1);
	strCell += "<i>&#947;</i> " + createText2("cell.gamma", "", 7, 1)
	+ " degrees <br><br>\n";
	strCell += "Volume cell " + createText2("cell.volumeCell", "", 10, 1)
	+ "  &#197<sup>3</sup><br><br>";
//	strCell += createButton('advanceCell', '+',
//			'toggleDivValue(true,"advanceCellDiv",this)', '')
//			+ " Advanced cell options <br>";
	strCell += "<div id='advanceCellDiv' style='display:block; margin-top:20px'>"
	strCell += "<i>b/a</i> " + createText2("bovera", "", 8, 1) + " ";
	strCell += "<i>c/a</i> " + createText2("covera", "", 8, 1);
	strCell += "</div>"
		strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += "</td></tr>\n";
	strCell += "</table></FORM>\n";
	return strCell;
}

