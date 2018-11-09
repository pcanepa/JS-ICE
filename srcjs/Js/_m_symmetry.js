// not implemented

function enterSymmetry() {
	if (! _fileData.symmetryOperationList){
	 	var symopSelection = createSelect('addSymSymop', 'setSymop(value)', 0, 1, createSymopSet());
		 _fileData.symmetryOperationList = createSymopSet();
		 getbyID("symmetryOperationSet").innerHTML = symopSelection;
		 getSymInfo();
	}
	var activateSymmetry = createButton("activateSymmetryButton", "Activate applied symmetry:", 'appendSymmetricAtoms(chosenSymElement,getValue("initPoint"),chosenSymop)', 0);
	getbyID("activateSymmetryDiv").innerHTML = activateSymmetry; 
}	

function exitSymmetry() {
}


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
	var allSymopsString = jmolEvaluate('script("print readSymmetryVectors()")'); 
	var totalSymops = allSymopsString.match(/\n/g).length-1; //this should work in all cases
	for (var i = 1; i<= totalSymops;i++){
		var symopInt = parseInt(i)+"";
		var scriptToRun = 'script("var infor = readSymmetryVectors();print infor['+symopInt+']")';
		var symopString = jmolEvaluate(scriptToRun);
		symopString = symopString.trim();
		symopSet[i-1] = symopString;
	}
	return symopSet
}
//creates symmetry menu 
// minor functionality A.S. 10.26.18 
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
			0, 0, 0, 0);
	strSymmetry += "</td></tr>\n";	
	strSymmetry += "<BR>\n"; 
	strSymmetry += "<tr><td>\n";
	strSymmetry += createCheck("copyOpaque", "Make atom copies opaque?",
			0, 0, 0, 0);
	strSymmetry += "</td></tr>\n";
	strSymmetry += "<BR>\n"; 
	strSymmetry += "<tr><td>\n";
	strSymmetry += "Add element:"
	strSymmetry += createSelect('addSymEle', 'setSymElement(value)', 0, 1,
			eleSymb);
	//strSymmetry +=  createSelect();
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
//	strSymmetry += "<div id='activateSymmetryDiv'></div>;
	strSymmetry += "</td></tr>\n";
	strSymmetry += "</form>\n";
	return strSymmetry;
}
// draws the axis lines for rotation axes and mirror planes for mirror symops 
function displaySymmetryDrawObjects(symopNumber){
	symopNameArray = readSymmetryVectors();
	if (symopNameArray[i].includes("identity")){
		runJmolScriptWait("draw symop @"+symNumber); 
	}
	else if (symopNameArray[i].includes("axis")){
		//INSERT CODE HERE
	}
	else if (symopNameArray[i].includes("mirror")){
		runJmolScriptWait("draw symop @"+symNumber) ;
	}
} 
function appendSymmetricAtoms(elementName,point,symopSelected){
	if (elementName == ""){
		console.log("ERROR: empty inputs");
	}
	else {
		iterations = 1 ;
		newAtomArray = Jmol.evaluateVar(jmolApplet0,"getSymmetricAtomArray('"+symopSelected+"', "+point+","+iterations+")") ;
		numberOfNewAtoms = newAtomArray.length; 
		for (i = 1; i <= numberOfNewAtoms; i++){
			runJmolScriptWait("appendNewAtom('"+elementName+"', "+newAtomArray[i]+")"); //this is a jmol script in functions.spt
		}
	}
}


