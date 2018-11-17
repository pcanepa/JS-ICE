function enterShow() {
	if (firstTimeBond) {
		bondSlider.setValue(20);
		radiiSlider.setValue(22);
		getbyID('radiiMsg').innerHTML = 20 + " %";
		getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	}
	firstTimeBond = false;
}

function exitShow() {
}

function showPickPlaneCallback() {
	var distance = prompt('Enter the distance (in \305) within you want to select atoms. \n Positive values mean from the upper face on, negative ones the opposite.', '1');
	if (distance != null && distance != "") {
		runJmolScriptWait('select within(' + distance + ',plane,$plane1)');
//			_edit.hideMode = " hide selected";
//			_edit.deleteMode = " delete selected";
		colorWhat = "color atoms";
	}
}



function setColorWhat(rgb, colorscript) {
	var colorcmd = (colorscript[1] == "colorwhat" ? colorWhat : "color " + colorscript[1]);
	runJmolScriptWait(colorcmd + " " + rgb);// BH?? should be elsewhere + ";draw off");
}

function elementSelected(element) {
	selectElement(element);
	colorWhat = "color atom ";
	return colorWhat;
}

//function showSelected(chosenSelection) {
//	var selection = "element";
//	if (chosenSelection == 'by picking' || chosenSelection == 'by distance') {
//		selection = chosenSelection;  
//	}
//	switch(selection){
//		case "element":
//			elementSelected(element); 
//			break;
//		case "by picking":
//			setPicking(this); //placeholder function--does not work as of 10.1.18 A.Salij
//			break;
//		case "by distance":
//			'setDistanceHide(this)'; //placeholder function--does not work as of 10.1.18 A.Salij
//			break;
//	}	
//}

function applyTrans(t) {
	getbyID('transMsg').innerHTML = t + " %"
	runJmolScript("color " + getValueSel("setFashion") + " TRANSLUCENT " + (t/100));
}

function applyRadii(rpercent) {
	getbyID('radiiMsg').innerHTML = rpercent.toPrecision(2) + " %"
	runJmolScript("cpk " + rpercent + " %;");
}

function onClickCPK() {
	getbyID('radiiMsg').innerHTML = "100%";
	getbyID('bondMsg').innerHTML = 0.3 + " &#197";
	radiiSlider.setValue(100);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.30; spacefill 100% ;cartoon off;backbone off; draw off");
}

function onClickWire() {
	getbyID('radiiMsg').innerHTML = "0.0 %";
	getbyID('bondMsg').innerHTML = 0.01 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(1);
	// BH Q: why spacefill 1%?
	runJmolScript('wireframe 0.01; spacefill off;ellipsoids off;cartoon off;backbone off;');
}

function onClickIonic() {
	getbyID('radiiMsg').innerHTML = parseFloat(0).toPrecision(2) + " %";
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("spacefill IONIC; wireframe 0.15; draw off");
}

function onStickClick() {
	getbyID('radiiMsg').innerHTML = "1%";
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.15;spacefill 1%;cartoon off;backbone off; draw off");
}

function onClickBallAndStick() {
	getbyID('radiiMsg').innerHTML = "20%";
	getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	radiiSlider.setValue(20);
	bondSlider.setValue(20);
	runJmolScript("wireframe 0.15; spacefill 20%;cartoon off;backbone off; draw off");

}

function onClickBall() {
	getbyID('radiiMsg').innerHTML = "20%";
	getbyID('bondMsg').innerHTML = 0.00 + " &#197";
	radiiSlider.setValue(20);
	bondSlider.setValue(0);
	runJmolScript("select *; spacefill 20%; wireframe off ; draw off");
}

function createShowGrp() {
	//var showList = createShowList('colourbyElementList');
	var colorBondsName = new Array("select", "atom", "bond");
	var dotName = new Array("select", "1", "2", "3", "4");
	var strShow = "<form autocomplete='nope'  id='showGroup' name='showGroup' style='display:none' >";
	strShow += "<table class='contents'><tr><td colspan='2'>\n";
	strShow += "<h2>Structure Appearance</h2>\n";
	strShow += "Select atom/s by:</td><tr>\n";
	strShow += "<tr><td colspan='2'>";
	strShow += "by element "
		+ createSelectKey('colourbyElementList', "elementSelected(value)",
				"elementSelected(value)", "", 1) + "\n";
//   	    + createSelectKey('showList', "showSelected(value)",
//	      "showSelected(value)", "", 1) + "\n";
	// strShow += "&nbsp;by atom &nbsp;"
	// + createSelect2('colourbyAtomList', 'atomSelectedColor(value)', '', 1)
	// + "\n";
//	strShow += createCheck("byselection", "by picking &nbsp;",
//		'setPicking(this)', 0, 0, "set picking");
//
//	strShow += createCheck("bydistance", "within a sphere (&#197); &nbsp;",
//			'setDistanceHide(this)', 0, 0, "");
	strShow += "</td></tr><tr><td colspan='2'>\n";
	strShow += createCheck("byplane", "within a plane &nbsp;",
			'onClickPickPlane(this,showPickPlaneCallback)', 0, 0, "");
	strShow += "</td></tr><tr><td colspan='2'>\n";
	strShow += createButton('show_selectAll', 'select All', 'selectAll()', '')
	+ "\n";
	strShow += createButton('unselect', 'unselect All',
			'runJmolScriptWait("select *; halos off; selectionhalos off;draw off")', '')
			+ "\n";
	strShow += createButton('halooff', 'Halo/s off',
			'runJmolScriptWait("halos off; selectionhalos off; draw off" )', '')
			+ "\n";
	strShow += createButton('label on', 'Label On',
			'runJmolScriptWait("label on;label display; draw off")', '')
			+ "\n";
	strShow += createButton('label off', 'Label Off',
			'runJmolScriptWait("label hide; draw off")', '')
			+ "\n";
	strShow += createLine('blue', '');
	strShow += "</td></tr><tr><td colspan='2'>\n";
	strShow += "Atom/s & bond/s style</td></tr> \n";
	strShow += "<tr><td > \n";
	strShow += "Atom/s colour: "
		+ createButton("colorAtoms", "Default colour",
				'runJmolScriptWait("select *; color Jmol;")', 0);
	strShow += "</td><td align='left'><script>\n";
	strShow += 'jmolColorPickerBox([setColorWhat,"atoms"], "","atomColorPicker");';
	strShow += "</script> </td></tr>";
	strShow += "<tr><td>Bond colour: "
		+ createButton("bondcolor", "Default colour",
				'runJmolScriptWait(" color bonds Jmol")', 0);
	strShow += "</td><td align='left'> <script> jmolColorPickerBox([setColorWhat, 'bonds'],[255,255,255],'bondColorPicker')</script></td>";
	strShow += "</td></tr>";
	strShow += "<tr><td colspan='2'> Atom/s & bond/s finish \n";
	strShow += createRadio(
			"abFashion",
			"opaque",
			'toggleDivRadioTrans(value,"transulcencyDiv") + runJmolScriptWait("color " +  getValue("setFashion") + " OPAQUE")',
			0, 1, "on", "on")
			+ "\n";
	strShow += createRadio(
			"abFashion",
			"translucent",
			'toggleDivRadioTrans(value,"transulcencyDiv") + runJmolScriptWait("color " +  getValue("setFashion") + " TRANSLUCENT")',
			0, 0, "off", "off")
			+ "\n";
	strShow += createSelect('setFashion', '', 0, 1, colorBondsName)
			+ "\n";
	strShow += "</td></tr>"
		strShow += "<tr><td><div id='transulcencyDiv' style='display:none; margin-top:20px'>";
	strShow += createSlider("trans");
	strShow += "</div></td></tr><tr><td>";
	strShow += "Dot surface ";
	strShow += createSelect('setDot',
			'runJmolScriptWait("dots on; set dotScale " + value + "; draw off")', 0, 1,
			dotName);
	strShow += createRadio("dotStyle", "off", 'runJmolScriptWait("dots off")', 0, 0, "off",
	"off");
	strShow += createLine('blue', '');
	strShow += "</td></tr>\n";
	strShow += "<tr><td colspan='2'> Atom/s & bond/s Size<br> \n";
	strShow += createButton('Stick & Ball', 'Stick & Ball', 'onClickBallAndStick()', '')
	+ " \n";
	strShow += createButton('Stick', 'Stick', 'onStickClick()', '') + " \n";
	strShow += createButton('Wire', 'Wire', 'onClickWire()', '') + " \n";
	strShow += createButton('Ball', 'Ball', 'onClickBall()', '') + "\n";
	strShow += createButton('CPK', 'CPK', 'onClickCPK()', '') + " \n";
	strShow += createButton('ionic', 'Ionic', 'onClickIonic()', '') + "\n";
	strShow += "</td></tr>";
	strShow += "<tr><td>";
	strShow += "wireframe ";
	strShow += "</td><td>"
	strShow += createSlider("bond");
	strShow += "</td></tr>";
	strShow += "<tr><td >";
	strShow += "vdW radii";
	strShow += "</td><td>";
	strShow += createSlider("radii");
	strShow += "</td></tr>";
	strShow += "<tr><td colspan='2'>";
	strShow += createLine('blue', '');
	strShow += "H-bonds: "
		+ createRadio("H-bond", "on", 'runJmolScriptWait("script ./scripts/hbond.spt")',
				0, 0, "") + "\n";
	strShow += createRadio("H-bond", "off",
			'runJmolScriptWait("script ./scripts/hbond_del.spt")', 0, 1, "")
			+ "\n";
	strShow += " / solid H-bond"
		+ createRadio("dash", " on", 'runJmolScriptWait("set hbondsSolid TRUE")', 0, 0,
		"") + "\n";
	strShow += createRadio("dash", "off", 'runJmolScriptWait("set hbondsSolid FALSE")', 0, 1,
	"")
	+ "\n";
	strShow += "</td></tr><tr><td>H-bond colour: "
		+ createButton("bondcolor", "Default colour",
				'runJmolScriptWait("color HBONDS none")', 0) + "</td><td>\n";
	strShow += "<script align='left'>jmolColorPickerBox([setColorWhat,'hbonds'],[255,255,255],'hbondColorPicker')</script>";
	strShow += "</td></tr><tr><td colspan='2'> \n";
	strShow += "View / Hide Hydrogen/s "
		+ createCheck("hydrogenView", "", "setJmolFromCheckbox(this, this.value)",
				0, 1, "set showHydrogens") + "\n";
	strShow += "</td></tr></table> \n";
	strShow += createLine('blue', '');
	strShow += "</form>\n";
	return strShow;
}

