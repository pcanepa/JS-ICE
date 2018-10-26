// not implemented

function enterSymmetry() {
	
}

function exitSymmetry() {
}

//creates symmetry menu 
// doesn't really work yet-A.S. 10.10.18
function getSymInfo() { //parses data file and provides symmetry operations

	// update all of the model-specific page items

	SymInfo = {};
	var s = "";
	var info = jmolEvaluate('script("show spacegroup")');
	if (info.indexOf("x,") < 0) {
		s = "no space group";
	} else {
		var S = info.split("\n");
		var hm = "?";
		var itcnumber = "?";
		var hallsym = "?";
		var latticetype = "?";
		var nop = 0;
		var slist = "";
		for (var i = 0; i < S.length; i++) {
			var line = S[i].split(":");
			if (line[0].indexOf("Hermann-Mauguin symbol") == 0)
				s += "<br>"
					+ S[i]
			.replace(
					/Hermann\-Mauguin/,
			"<a href=http://en.wikipedia.org/wiki/Hermann%E2%80%93Mauguin_notation target=_blank>Hermann-Mauguin</a>");
			else if (line[0].indexOf("international table number") == 0)
				s += "<br>"
					+ S[i]
			.replace(
					/international table number/,
			"<a href=http://it.iucr.org/ target=_blank id='prova'>international table</a> number");
			else if (line[0].indexOf("lattice type") == 0)
				s += "<br>"
					+ S[i]
			.replace(
					/lattice type/,
			"<a href=http://cst-www.nrl.navy.mil/bind/static/lattypes.html target=_blank>lattice type</a>");
			else if (line[0].indexOf(" symmetry operation") >= 0)
				nop = parseInt(line[0]);
			else if (nop > 0 && line[0].indexOf(",") >= 0)
				slist += "\n" + S[i];

		}

		s += "<br> Symmetry operators: " + nop;

		var S = slist.split("\n");
		var n = 0;
		var i = -1;
		while (++i < S.length && S[i].indexOf(",") < 0) {
		}
		s += "<br><select id='symselect' onchange=getSelect() onkeypress=\"setTimeout('getSelect()',50)\" class='select'><option value=0>select a symmetry operation</option>";
		for (; i < S.length; i++)
			if (S[i].indexOf("x") >= 0) {
				var sopt = S[i].split("|")[0].split("\t");
				SymInfo[sopt[1]] = S[i].replace(/\t/, ": ").replace(/\t/, "|");
				sopt = sopt[0] + ": " + sopt[2] + " (" + sopt[1] + ")";
				s += "<option value='" + parseInt(sopt) + "'>" + sopt
				+ "</option>";
			}
		s += "</select>";

		var info = jmolEvaluate('{*}.label("#%i %a {%[fxyz]/1}")').split("\n");
		var nPoints = info.length;
		var nBase = jmolEvaluate('{symop=1555}.length');
		s += "<br><select id='atomselect' onchange=getSelect() onkeypress=\"setTimeout('getSelect()',50)\"  class='select'><option value=0>base atoms</option>";
		s += "<option value='{0 0 0}'>{0 0 0}</option>";
		s += "<option value='{1/2 1/2 1/2}'>{1/2 1/2 1/2}</option>";
		for (var i = 0; i < nPoints; i++)
			s += "<option value=" + i + (i == 0 ? " selected" : "") + ">"
			+ info[i] + "</option>";
		s += "</select>";

		s += "</br><input type=checkbox id=chkatoms onchange=getSelect() checked=true />superimpose atoms";
		s += " opacity:<select id=selopacity onchange=getSelect() onkeypress=\"setTimeout('getSelect()',50)\"  class='select'>"
			+ "<option value=0.2 selected>20%</option>"
			+ "<option value=0.4>40%</option>"
			+ "<option value=0.6>60%</option>"
			+ "<option value=1.0>100%</option>" + "</select>";

	}
	getbyID("syminfo").innerHTML = s;
}
function getSelect(symop) {
	var d = getbyID("atomselect");
	var atomi = d.selectedIndex;
	var pt00 = d[d.selectedIndex].value;
	var showatoms = (getbyID("chkatoms").checked || atomi == 0);
	runJmolScriptWait("display " + (showatoms ? "all" : "none"));
	var d = getbyID("symselect");
	var iop = parseInt(d[d.selectedIndex].value);
	// if (!iop && !symop) symop = getbyID("txtop").value
	if (!symop) {
		if (!iop) {
			runJmolScriptWait("select *;color opaque;draw sym_* delete");
			return

		}
		symop = d[d.selectedIndex].text.split("(")[1].split(")")[0];
		// getbyID("txtop").value
		// = symop
	}
	if (pt00.indexOf("{") < 0)
		pt00 = "{atomindex=" + pt00 + "}";
	var d = getbyID("selopacity");
	var opacity = parseFloat(d[d.selectedIndex].value);
	if (opacity < 0)
		opacity = 1;
	var script = "select *;color atoms translucent " + (1 - opacity);
	script += ";draw symop \"" + symop + "\" " + pt00 + ";";
	if (atomi == 0) {
		script += ";select symop=1555 or symop=" + iop + "555;color opaque;";
	} else if (atomi >= 3) {
		script += ";pt1 = "
			+ pt00
			+ ";pt2 = all.symop(\""
			+ symop
			+ "\",pt1).uxyz.xyz;select within(0.2,pt1) or within(0.2, pt2);color opaque;";
	}
	secho = SymInfo[symop];
	if (!secho) {
		secho = jmolEvaluate("all.symop('" + symop + "',{0 0 0},'draw')")
		.split("\n")[0];
		if (secho.indexOf("//") == 0) {
			secho = secho.substring(2);
		} else {
			secho = symop;
		}
	}
	script = "set echo top right;echo " + secho + ";" + script;
	runJmolScriptWait(script);
}

function deleteSymmetry() {
	getbyID("syminfo").removeChild;
}

cellOperation = function(){
	deleteSymmetry();
	getSymInfo();
	setUnitCell();
}

function createSymmetryGrp() {
	var strSymmetry = "<form autocomplete='nope'  id='symmetryGroup' name='symmetryGroup' style='display:none'>\n";
	strSymmetry += "<table class='contents'>\n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Symmetry operators ";
	strSymmetry += "<div id='syminfo'></div>";
	strSymmetry += createLine('blue', '');
	strSymmetry += "</td></tr>\n";
	strSymmetry += "</td></tr></table> \n";
	strSymmetry += "<tr><td>\n";
	strSymmetry += createCheck("symLock", "Lock Added Atoms to Symmetry Operation?",
			0, 0, 1, 0);
	strSymmetry += "</td></tr>\n";	
	strSymmetry += "<BR>\n"; 
	strSymmetry += "<tr><td>\n";
	strSymmetry += createCheck("copyOpaque", "Make atom copies opaque?",
			0, 0, 1, 0);
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n"; 
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Add element:"
	//strSymmetry +=  createSelect();
	strSymmetry += "</td></tr>\n";
	strSymmetry += "</form>\n";
	return strSymmetry;
}
// gets and returns the symmetry operation names (e.g. "identity") 
function readSymmetryNames() {
	var allSymopInfo = getProperty("spacegroupInfo.operations");
	var numSymops = allSymopInfo.length;
	var symopNameArray = [];
	for (var i = 1; i< numSymops+1;i++){
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
	for (var i = 1; i< numSymops+1;i++){
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
	if (symopNameArray[i].includes("identity")){
		runJmolScriptWait("draw symop \{i}"); 
	}
	else if (symopNameArray[i].includes("axis")){
		//INSERT CODE HERE
	}
	else if (symopNameArray[i].includes("mirror")){
		runJmolScriptWait("draw symop \{i}") ;
	}
} 
// returns the points given after performing a symmetry operation a chosen number of times (one point per operation
function getSymmetricAtomArray(symopSelected,point,iterations){
	var symAtomArray = [];
	for (var i = 1; i<= iterations;i++) {
		if (i=1){
			var output = all.symop(symopSelected,point)
			symAtomArray[i] =  output; 
			}
		else {
			var output = all.symop(symopSelected[i-1],point)
			symAtomArray[i] = output;
		}	

	}
	return symAtomArray 

}
// adds new element by appending a hydrogen, deleting the bond to the hydrogen, and then changing the hydrogen to chosen element
// needs significant work such that elements that should be strings are strings and that code runs out of javascript and not just jmol script editor
// A.S. 10.24.18 
//
/*
function appendNewAtom(elementName, point) {
	assign atom ({0}) "H" pointValue;
	bondNumber =  getProperty("modelInfo.models[1].bondCount")-1;
	atomNumber = getProperty("modelInfo.models[1].atomCount")-1; 
	assign bond [{bondNumber}] "0";
	{atomNumber}.element = elementName;
} 
// takes a given point and add the elements provided to it by a symmetry operation
// symmetry operations with multiple outputs (e.g. C3) will produce multiple symmetry atoms 
function appendSymmetricAtoms(elementName, point,symopNumber,symopNameArray){
	symopName = symopNameArray[symopNumber];
	iterations = 1 
	if (symopName.includes("C") {
		indexOfC = symopName.indexOf("C");
		iterationString = symopName.substring(indexOfC,indexOfC+1) ;
		iterations = parseInt(iterationString)	
	}
	newAtomArray = getSymmetricAtomArray(symopNumber,point,iterations) ;
	numberOfNewAtoms = newAtomArray.length(); 
	for (i = 1; i <= numberOfNewAtoms; i++){
		appendNewAtom(elementName, newAtomArray[i];
	}
}
*/


