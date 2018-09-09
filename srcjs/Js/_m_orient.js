function enterOrient() {
	
}

function exitOrient() {
}

function applySlab(x) {
	getbyID('slabSliderMsg').innerHTML = x + "%" // display
	runJmolScript("slab " + (100 - x) + ";")
}

function applyDepth(x) { // alternative displays:
	getbyID('depthSliderMsg').innerHTML = (100 - x) + "%" // 100%
	runJmolScript("depth " + (100 - x) + ";")
}

function toggleSlab() {
	var ctl = getbyID("slabToggle")
	if (ctl.checked) {
		runJmolScriptWait("spin off; slab on; slab 80;");
		slabSlider.setValue(20);
		applySlab(defaultFront);
		depthSlider.setValue(defaultBack);
		applyDepth(defaultBack);
	} else {
		runJmolScriptWait("slab off; ")
		slabSlider.setValue(0);
		depthSlider.setValue(0);
	}
}

//This controls the refined motion of the structure
var motion = "";
function setKindMotion(valueList) {
	motion = valueList;
	if (motion == "select")
		errorMsg("Please select the motion");
	return motion;
}

function setMotion(axis) {
	var magnitudeMotion = getbyID("fineOrientMagn").value;

	if (motion == "select" || motion == "") {
		errorMsg("Please select the motion");
		return false;
	}

	// /(motion == "translate" )? (makeDisable("-z") + makeDisable("z")) :
	// (makeEnable("-z") + makeEnable("z"))

	if (magnitudeMotion == "") {
		errorMsg("Please, check value entered in the textbox");
		return false;
	}

	var stringa = "Selected" + " " + axis + " " + magnitudeMotion;
	if (motion == "translate" && (axis == "-x" || axis == "-y" || axis == "-z")) {
		axis = axis.replace("-", "");
		stringa = "Selected" + " " + axis + " -" + magnitudeMotion;
	}

	(!getbyID("moveByselection").checked) ? runJmolScriptWait(motion + " " + axis + " "
			+ magnitudeMotion) : runJmolScriptWait(motion + stringa);

}

