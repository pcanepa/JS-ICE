// not implemented

function enterSymmetry() {
	
}

function exitSymmetry() {
}

//creates symmetry menu 
// doesn't really work yet-A.S. 10.10.18

function createSymmetryGrp() {
	var strSymmetry = "<form autocomplete='nope'  id='symmetryGroup' name='symmetryGroup' style='display:none'>\n";
	strSymmetry += "<table class='contents'>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "<h2>PLACEHOLDER</h2>\n";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "</table>\n";
	strSymmetry += "</form>\n";
	return strSymmetry
} 

function readSymmetryNames() {
	var allSymopInfo = getProperty("spacegroupInfo.operations");
	var numSymops = allSymopInfo.length;
	var symopNameArray = [];
	for (i = 1; i< numSymops+1;i++){
		var symopCurrent = allSymopInfo[i];
		var currentName = symopCurrent[3];
		symopNameArray[i] = currentName;
	}
	return symopNameArray
}

function readSymmetryVectors() {
	var allSymopInfo = getProperty("spacegroupInfo.operations");
	var numSymops = allSymopInfo.length;
	var symopVectorArray = [];
	for (i = 1; i< numSymops+1;i++){
		var symopCurrent = allSymopInfo[i];
		var currentName = symopCurrent[2];
		symopNameArray[i] = currentName;
	}
	return symopVectorArray
}