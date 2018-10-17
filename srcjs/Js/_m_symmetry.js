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
// gets and returns the symmetry operation names (e.g. "identity") 
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
// gets and returns the symmetry operation vector names 
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
// draws the axis lines for rotation axes and mirror planes for mirror symops  
function displaySymmetryDrawObjects(symopNumber){
	var i = symopNumber
	symopNameArray = readSymmetryVectors();
	if (symopNameArray[i].includes("identity"){
		runJmolScriptWait("draw symop \{i}"); 
	}
	else if (symopNameArray[i].includes("axis"){
		//INSERT CODE HERE
	}
	else if (symopNameArray[i].includes("mirror"){
		runJmolScriptWait("draw symop \{i}") ;
	}
} 