//initialization upon entry into symmetry tab 
function enterSymmetry() {
	if (! _fileData.symmetryOperationList){
	 	var symopSelection = createSelect('addSymSymop', 'doSymopSelection(value)', 0, 1, createSymopSet());
		 _fileData.symmetryOperationList = createSymopSet();
		 getbyID("symmetryOperationSet").innerHTML = symopSelection;
	}
	var activateSymmetry = createButton("activateSymmetryButton", "Activate applied symmetry:", 'doActivateSymmetry()', 0);
	getbyID("activateSymmetryDiv").innerHTML = activateSymmetry;
	var activateAllSymmetry = createButton("activateAllSymmetryButton", "Activate all symmetry:", 'doActivateAllSymmetry()', 0); 
	getbyID("activateAllSymmetryDiv").innerHTML = activateAllSymmetry;
}	

function exitSymmetry() {
}

//this appends new atoms by chosen symop
function doActivateSymmetry(){
	appendSymmetricAtoms(chosenSymElement,getValue("initPoint"),chosenSymop,getValue("symIterations"));
}

//this only shows every point for a given point for all symops 
function doActivateAllSymmetry(){
	drawAllSymmetricPoints(getValue("initPoint"));
}

function doSymopSelection(symop){
	setSymop(symop);
	displaySymmetryDrawObjects(symop);
}

var chosenSymElement = ""; 
function setSymElement(elementName){
	chosenSymElement = elementName;
}

var chosenSymop = "";
function setSymop(symop){
	chosenSymop = symop;
}

function createSymopSet(){
	var symopSet = [];
	runJmolScriptWait("getProperty spacegroupInfo.symmetryInfo");
	runJmolScriptWait("symVectors = readSymmetryVectors()");
	symopSet = Jmol.evaluateVar(jmolApplet0,"symVectors"); 
	return symopSet
}
//function createSymopSet(){
//	var symopSet = [];
//	var allSymopsString = jmolEvaluate('script("print readSymmetryVectors()")'); 
//	var totalSymops = allSymopsString.match(/\n/g).length-1; //this should work in all cases
//	for (var i = 1; i<= totalSymops;i++){
//		var symopInt = parseInt(i)+"";
//		var scriptToRun = 'script("var infor = readSymmetryVectors();print infor['+symopInt+']")';
//		var symopString = jmolEvaluate(scriptToRun);
//		symopString = symopString.trim();
//		symopSet[i-1] = symopString;
//	}
//	return symopSet
//}

function setOpacity(){
	var opacityString = getbyID("selopacity2");
	var opacity = parseFloat(opacityString[opacityString.selectedIndex].value);
	if (opacity < 0){
		opacity = 1;
	}
	opacityScript = "select *;color atoms translucent " + (1 - opacity)
	runJmolScript(opacityScript);
}
//creates symmetry menu 
function createSymmetryGrp() {
	
	var strSymmetry = "<form autocomplete='nope'  id='symmetryGroup' name='symmetryGroup' style='display:none'>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Write points in the form '{x y z}'";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Add element:"
	strSymmetry += createSelect('addSymEle', 'setSymElement(value)', 0, 1,
			eleSymb);
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Enter initial point:";
	strSymmetry += "<input type='text'  name='initPoint' id='initPoint' size='10' class='text'>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Choose symmetry operation:";
	strSymmetry += "<div id='symmetryOperationSet'></div>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Symmetry Operation Origin:";
	strSymmetry += "<input type='text'  name='symCenterPoint' id='symCenterPoint' size='10' class='text'>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Symmetry Iterations:"; 
	strSymmetry += "<input type='text'  name='symIterations' id='symIterations' size='2' class='text'>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "<div id='activateSymmetryDiv'></div>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "<div id='activateAllSymmetryDiv'></div>";
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n";
	strSymmetry += "</form>\n";
	strSymmetry += "set opacity:<select id=selopacity2 onchange=setOpacity() onkeypress=\"setTimeout('setOpacity()',50)\"  class='select'>"
			+ "<option value=0.2 selected>20%</option>"
			+ "<option value=0.4>40%</option>"
			+ "<option value=0.6>60%</option>"
			+ "<option value=1.0>100%</option>" + "</select>";
	return strSymmetry
}

// draws the axis lines for rotation axes and mirror planes for mirror symops 
function displaySymmetryDrawObjects(symop){
	var centerPoint = 	getValue("symCenterPoint") ;
	if (! centerPoint){
		centerPoint= "{0 0 0}"; 
	}
	runJmolScriptWait("draw symop '"+symop+"' "+centerPoint); 
} 

// takes a given point and add the elements provided to it by a symmetry operation
// symmetry operations with multiple outputs (e.g. C3) will produce multiple symmetry atoms 

function appendSymmetricAtoms(elementName,point,symopSelected,iterations){
	if (elementName == ""){
		console.log("ERROR: empty element name");
	}
	if (symopSelected == ""){
		console.log("ERROR: empty symmetry operation");
	}
	else {
		point = point-getValue("symCenterPoint");
		var newAtomArray = Jmol.evaluateVar(jmolApplet0,"getSymmetricAtomArray('"+symopSelected+"', "+point+","+iterations+")") ;
		var numberOfNewAtoms = newAtomArray.length; 
		for (i = 1; i <= numberOfNewAtoms; i++){
			recenteredPosition = newAtomArray[i-1]+getValue("symCenterPoint");
			runJmolScriptWait("appendNewAtom('"+elementName+"', {"+recenteredPosition+"})"); //this is a jmol script in functions.spt
		}
	}
}
function drawAllSymmetricPoints(point){
	var pointValue = point;
	if (getValue("symCenterPoint")){
		var pointValue = pointValue-getValue("symCenterPoint")
	}
	runJmolScriptWait("allSymPoints = getSymmetryAtomArrayAllSymops("+pointValue+")");
	runJmolScriptWait("allSymPoints = allSymPoints"+getValue('symCenterPoint'));
	runJmolScriptWait("draw points @allSymPoints");
}

//Additional functions: yet unused 

//checks to see if there is a symmetry axis currently drawn
//function hasAxis(symop){
//	runJmolScriptWait("firstPoint = $sym_rotvector1[0]");
//	if (Jmol.evaluateVar(jmolApplet0,"firstPoint")){
//		runJmolScriptwait("secondPoint = $sym_rotvector2[0]");
//		if (Jmol.evaluateVar(jmolApplet0,"secondPoint")){
//			return true 
//		}
//		else { 
//			return false
//		}
//	}
//	else {
//		return false
//	}
//}

//function displaySymmetryDrawObjects(symop){
//	centerPoint = 	getValue("symCenterPoint") ;
//	if (! centerPoint){
//		centerPoint= "{0 0 0}"; 
//	}
//	runJmolScriptWait("draw symop '"+symop+"' "+centerPoint); 
//	if(hasAxis(symop)){
//		runJmolScriptWait("select *;color opaque;draw sym_* delete");
//		runJmolScriptWait("drawCleanSymmetryAxisVectors('"+symop+"', 3)");
//	}
//} 


