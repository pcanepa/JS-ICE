function enterOther() {
	setValuesOther();	
}

function exitOther() {
}


function setValuesOther() {
// show lighting
//	  set ambientPercent 45;
//	  set diffusePercent 84;
//	  set specular true;
//	  set specularPercent 22;
//	  set specularPower 40;
//	  set specularExponent 6;
//	  set celShading false;
//	  set celShadingPower 10;
//	  set zShadePower 3;
//	  set zDepth 0;
//	  set zSlab 50;
//	  set zShade false;
	
	_slider.cameraDepth.setValue(jmolEvaluate("cameraDepth") * 25);
	_slider.specularPercent.setValue(jmolEvaluate("specularPercent"));
	_slider.ambientPercent.setValue(jmolEvaluate("ambientPercent"));
	_slider.diffusePercent.setValue(jmolEvaluate("diffusePercent"));
//	getbyID("SpecularPercentMsg").innerHTML = 40 + " %";
//	getbyID("AmbientPercentMsg").innerHTML = 40 + " %";
//	getbyID("DiffusePercentMsg").innerHTML = 40 + " %";

}

function applyCameraDepth(depth) {
	runJmolScriptWait("set cameraDepth " + depth + ";")
	getbyID("slider.cameraDepthMsg").innerHTML = depth
}

function applySpecularPercent(x) {
	runJmolScriptWait(" set specularPercent " + x + ";");
	getbyID("slider.specularPercentMsg").innerHTML = x + "%";
}

function applyAmbientPercent(x) {
	runJmolScriptWait(" set ambientPercent " + x + ";");
	getbyID("slider.ambientPercentMsg").innerHTML = x + "%";
}

function applyDiffusePercent(x) {
	runJmolScriptWait(" set diffusePercent " + x + ";");
	getbyID("slider.diffusePercentMsg").innerHTML = x + "%";
}

function setTextSize(value) {
	runJmolScriptWait("select *; font label " + value + " ;");
}

function setFrameTitle(chkbox) {
	runJmolScriptWait(chkbox.checked ? "frame title" : "frame title ''");
}


function createOtherGrp() {
	var textValue = new Array("0", "6", "8", "10", "12", "16", "20", "24", "30");
	var textText = new Array("select", "6 pt", "8 pt", "10 pt", "12 pt",
			"16 pt", "20 pt", "24 pt", "30 pt");

	var shadeName = new Array("select", "1", "2", "3")
	var shadeValue = new Array("0", "1", "2", "3")
	var strOther = "<form autocomplete='nope'  id='otherpropGroup' name='otherpropGroup' style='display:none' >";
	strOther += "<table class='contents'><tr><td> \n";
	strOther += "<h2>Other properties</h2></td></tr>\n";
	strOther += "<tr><td>Background colour:</td>\n";
	strOther += "<td align='left'><script>jmolColorPickerBox([setColorWhat,'background'],[255,255,255],'backgroundColorPicker')</script></td></tr> \n";
	strOther += "<tr><td>"
		+ createLine('blue', '')
		+ createCheck(
				"perspective",
				"Perspective",
				'setJmolFromCheckbox(this, this.value)+toggleDiv(this,"perspectiveDiv")',
				0, 0, "set perspectiveDepth");
	strOther += "</td></tr><tr><td>"
	strOther += "<div id='perspectiveDiv' style='display:none; margin-top:20px'>";
	strOther += createSlider("cameraDepth");
	strOther += "</div></td></tr>\n";
	strOther += "<tr><td>"
		+ createCheck("z-shade", "Z-Fog", "setJmolFromCheckbox(this, this.value)",
				0, 0, "set zShade");
	strOther += " ";
	strOther += createSelect(
			'setzShadePower ',
			'runJmolScriptWait("set zShade; set zShadePower " + value + ";") + setJmolFromCheckbox("z-shade"," "+value)',
			0, 1, shadeValue, shadeName)
			+ " Fog level";
	strOther += "</td></tr>\n";
	strOther += "<tr><td colspan='2'> Antialiasing"
		+ createRadio("aa", "on",
				'setAntialias(true)', 0,
				0, "");
	strOther += createRadio("aa", "off",
			'setAntiAlias(false)', 0, 1, "");
	strOther += createLine('blue', '');
	strOther += "</td></tr>";
	strOther += "<tr><td>";
	strOther += "Light settings";
	strOther += "</td></tr>";
	strOther += "<tr><td>";
	strOther += createSlider("specularPercent", "Reflection");
	strOther += "</td></tr><tr><td>";
	strOther += createSlider("ambientPercent", "Ambient");
	strOther += "</td></tr><tr><td>";
	strOther += createSlider("diffusePercent", "Diffuse");
	strOther += "</td></tr><tr><td colspan='2'>" + createLine('blue', '');
	strOther += "</tr><tr><td colspan='2'>"
		strOther += "3D stereo settings <br>"
			+ createRadio("stereo", "R&B", 'runJmolScriptWait("stereo REDBLUE")', 0, 0, "")
			+ "\n";
	strOther += createRadio("stereo", "R&C", 'runJmolScriptWait("stereo REDCYAN")', 0, 0, "")
	+ "\n";
	strOther += createRadio("stereo", "R&G", 'runJmolScriptWait("stereo REDGREEN")', 0, 0,
	"")
	+ "<br>\n";
	strOther += createRadio("stereo", "side-by-side", 'runJmolScriptWait("stereo ON")', 0,
			0, "")
			+ "\n";
	strOther += createRadio("stereo", "3D off", 'runJmolScriptWait("stereo off")', 0, 1, "")
	+ createLine('blue', '') + "</td></tr>\n";
	strOther += "<tr><td colspan='2'>";
	strOther += "Label controls <br>"
		strOther += createCheck("frameName", "Name model", "setFrameTitle(this)", 0,
				1, "frame title")
				+ " ";
	strOther += createCheck("jmollogo", "Jmol Logo",
			"setJmolFromCheckbox(this, this.value)", 0, 1, "set showFrank")
			+ "</td></tr>\n";
	strOther += "<tr><td colspan='2'>";
	strOther += "Font size ";
	strOther += createSelect("fontSize", "setTextSize(value)", 0, 1,
			textValue, textText);
	strOther += "</td></tr>";
	strOther += "<tr><td colspan='2'>"
		+ createButton("removeText", "Remove Messages", 'runJmolScriptWait("echo")', 0);
	strOther += createLine('blue', '')
		+ "</td></tr>\n";
	strOther += "</td></tr></table></FORM>  \n";
	return strOther;
}




