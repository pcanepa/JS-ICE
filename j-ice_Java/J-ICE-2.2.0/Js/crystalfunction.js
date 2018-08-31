/*  J-ICE library 

    based on:
 *
 * Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 * Contact: pierocanepa@sourceforge.net
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307  USA.
 */

////The following functions are to control import/ export, geometry optimization, frequency properties.
/////////
////////////////SAVE INPUT
/////////
var titleCRYS = null;
function titleCRYSTAL() {
	titleCRYS = prompt("Type here the job title:", "");
	(titleCRYS == "" || titleCRYS == null) ? (titleCRYS = ' .d12 prepared with J-ICE ')
			: (titleCRYS = titleCRYS + ' .d12 prepared with J-ICE')
}

var numAtomCRYSTAL = null;
var fractionalCRYSTAL = null;
function atomCRYSTAL() {
	if (typeSystem == "molecule")
		fractionalCRYSTAL = selectedFrame + '.label("%l %16.9[xyz]")';
	setV("print " + fractionalCRYSTAL)
	// alert(typeSystem);

	numAtomCRYSTAL = selectedFrame + ".length";
	fractionalCRYSTAL = selectedFrame + '.label("%l %16.9[fxyz]")';
	// alert(typeSystem);
}

var systemCRYSTAL = null;
var keywordCRYSTAL = null;
var symmetryCRYSTAL = null;
function exportCRYSTAL() {
	// alert("CRYSTAL")
	var endCRYSTAL = "TEST', 'END";
	var script = "";

	warningMsg("Make sure you had selected the model you would like to export.")
	titleCRYSTAL();
	setUnitCell();
	atomCRYSTAL();

	switch (typeSystem) {
	case "crystal":
		systemCRYSTAL = "'CRYSTAL'";
		keywordCRYSTAL = "'0 0 0'";
		symmetryCRYSTAL = "'1'";

		if (!flagSiesta && !flagOutcar && !flagCryVasp)
			var flagsymmetry = confirm("Do you want to introduce symmetry ?")
		if (!flagsymmetry) {
			script = "var cellp = ["
					+ roundNumber(aCell)
					+ ", "
					+ roundNumber(bCell)
					+ ", "
					+ roundNumber(cCell)
					+ ", "
					+ roundNumber(alpha)
					+ ", "
					+ roundNumber(beta)
					+ ", "
					+ roundNumber(gamma)
					+ "];"
					+ 'var cellparam = cellp.join(" ");'
					+ 'cellparam = cellparam.replace("\n\n","\n");'
					+ "var crystalArr = ['"
					+ titleCRYS
					+ "', "
					+ systemCRYSTAL
					+ ", "
					+ keywordCRYSTAL
					+ ", "
					+ symmetryCRYSTAL
					+ "];"
					+ "var crystalRestArr = ["
					+ numAtomCRYSTAL
					+ ", "
					+ fractionalCRYSTAL
					+ ", '"
					+ endCRYSTAL
					+ "'];"
					+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
					+ 'finalArr = finalArr.replace("\n\n","\n");'
					+ 'WRITE VAR finalArr "?.d12"';
		} else {
			warningMsg("This procedure is not fully tested.");
			figureOutSpaceGroup();
		}
		break;
	case "slab":
		systemCRYSTAL = "'SLAB'";
		keywordCRYSTAL = "";
		symmetryCRYSTAL = "'1'";

		warningMsg("Symmetry not exploited!");

		script = "var cellp = [" + roundNumber(aCell) + ", "
				+ roundNumber(bCell) + ", " + roundNumber(gamma) + "];"
				+ 'var cellparam = cellp.join(" ");' + "var crystalArr = ['"
				+ titleCRYS + "', " + systemCRYSTAL + ", " + symmetryCRYSTAL
				+ "];" + 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	case "polymer":
		systemCRYSTAL = "'POLYMER'";
		keywordCRYSTAL = "";
		symmetryCRYSTAL = "'1'";

		warningMsg("Symmetry not exploited!");

		script = "var cellp = " + roundNumber(aCell) + ";"
				+ "var crystalArr = ['" + titleCRYS + "', " + systemCRYSTAL
				+ ", " + symmetryCRYSTAL + "];"
				+ 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, cellp , crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	case "molecule":
		// alert("prov")
		systemCRYSTAL = "'MOLECULE'";
		symmetryCRYSTAL = "'1'"; // see how jmol exploits the punctual TODO:
		// show POINTGROUP
		// symmetry
		fractionalCRYSTAL
		warningMsg("Symmetry not exploited!");
		script = "var crystalArr = ['" + titleCRYS + "', " + systemCRYSTAL
				+ ", " + symmetryCRYSTAL + "];"
				+ 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	}// end switch
	script = script.replace("\n\n", "\n");
	setV(script);
}

//prevSelectedframe needs because of the conventional
var prevSelectedframe = null;
var prevFrame = null;
function figureOutSpaceGroup() {
	saveStatejust();
	prevSelectedframe = selectedFrame;
	if (frameValue == null || frameValue == "" || flagCif)
		framValue = 1;
	prevFrame = frameValue;
	setV('set errorCallback "errCallback";')
	magnetic = confirm('It\'s the primitive cell ?')
	// crystalPrev = confirm('Does the structure come from a previous CRYSTAL
	// calcultion?')
	if (magnetic) { // This option is for quantum espresso
		if (flagCryVasp) {
			setV("load '' FILTER 'conv'; delete not cell=555; set messageCallback 'saveSpacegroup'; message SAVESPACE;");
		} else {
			setV("load ''; delete not cell=555; set messageCallback 'saveSpacegroup'; message SAVESPACE;");
		}
	} else {
		if (flagCryVasp) {
			setV("load '' FILTER 'conv'; set messageCallback 'saveSpacegroup'; message SAVESPACE;");
		} else {
			setV("load ''; set messageCallback 'saveSpacegroup'; message SAVESPACE;");
		}
	}
}

var interNumber = "";
function saveSpacegroup(a, m) {

	m = "" + m
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("SAVESPACE") == 0) {
		var s = ""
		var info = jmolEvaluate('script("show spacegroup")')
		if (info.indexOf("x,") < 0) {
			s = "no space group"
		} else {
			var S = info.split("\n")
			for ( var i = 0; i < S.length; i++) {
				var line = S[i].split(":")
				if (line[0].indexOf("international table number") == 0)
					s = parseInt(S[i]
							.replace(/international table number:/, ""));
			}
		}
		interNumber = parseInt(s);
		getUnitcell(prevFrame);

		findCellParameters()

	}

}

var stringCellParam;
//cellDimString and ibravQ is for quantum espresso
var cellDimString = null;
var ibravQ = "";
function findCellParameters() {
	// /from crystal manual http://www.crystal.unito.it/Manuals/crystal09.pdf
	switch (true) {

	case ((interNumber <= 2)): // Triclinic lattices

		stringCellParam = roundNumber(aCell) + ", " + roundNumber(bCell) + ", "
				+ roundNumber(cCell) + ", " + roundNumber(alpha) + ", "
				+ roundNumber(beta) + ", " + roundNumber(gamma);
		cellDimString = " celdm(1) =  " + fromAngstromtoBohr(aCell)
				+ " \n celdm(2) =  " + roundNumber(bCell / aCell)
				+ " \n celdm(3) =  " + roundNumber(cCell / aCell)
				+ " \n celdm(4) =  " + cosRadiant(alpha) + " \n celdm(5) =  "
				+ roundNumber(cosRadiant(beta)) + " \n celdm(6) =  "
				+ roundNumber(cosRadiant(gamma)) + " \n\n";
		ibravQ = "14";
		break;

	case ((interNumber > 2) && (interNumber <= 15)): // Monoclinic lattices
		stringCellParam = roundNumber(aCell) + ", " + roundNumber(bCell) + ", "
				+ roundNumber(cCell) + ", " + roundNumber(alpha);
		if (!flagCryVasp && quantumEspresso) {
			cellDimString = " celdm(1) =  " + fromAngstromtoBohr(aCell)
					+ " \n celdm(2) =  " + roundNumber(bCell / aCell)
					+ " \n celdm(3) =  " + roundNumber(cCell / aCell)
					+ " \n celdm(4) =  " + roundNumber(cosRadiant(alpha))
					+ " \n\n";
			ibravQ = "12"; // Monoclinic base centered

			var question = confirm("Is this a Monoclinic base centered lattice?")
			if (question)
				ibravQ = "13";
		}
		break;

	case ((interNumber > 15) && (interNumber <= 74)): // Orthorhombic lattices
		stringCellParam = roundNumber(aCell) + ", " + roundNumber(bCell) + ", "
				+ roundNumber(cCell);
		if (!flagCryVasp && quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell)
					+ " \n celdm(2) =  " + roundNumber(bCell / aCell)
					+ " \n celdm(3) =  " + roundNumber(cCell / aCell) + " \n\n";
			ibravQ = "8";

			var question = confirm("Is this a Orthorhombic base-centered lattice?")
			if (question) {
				ibravQ = "9";
			} else {
				var questionfcc = confirm("Is this a Orthorhombic face-centered (fcc) lattice?");
				if (questionfcc) {
					ibravQ = "10";
				} else {
					ibravQ = "11";// Orthorhombic body-centered
				}
			}

		}
		break;

	case ((interNumber > 74) && (interNumber <= 142)): // Tetragonal lattices

		stringCellParam = roundNumber(aCell) + ", " + roundNumber(cCell);
		if (!flagCryVasp && quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell)
					+ " \n celdm(3) =  " + roundNumber(cCell / aCell) + " \n\n";
			ibravQ = "6";
			var question = confirm("Is this a Tetragonal I body centered (bct) lattice?");
			if (question)
				ibravQ = "7";
		}
		break;

	case ((interNumber > 142) && (interNumber <= 167)): // Trigonal lattices
		stringCellParam = roundNumber(aCell) + ", " + roundNumber(alpha) + ", "
				+ roundNumber(beta) + ", " + roundNumber(gamma);
		cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell)
				+ " \n celdm(4) =  " + roundNumber(cosRadiant(alpha))
				+ " \n celdm(5) = " + roundNumber(cosRadiant(beta))
				+ " \n celdm(6) =  " + roundNumber(cosRadiant(gamma));
		ibravQ = "5";
		var question = confirm("Is a romboheadral lattice?")
		if (question) {
			stringCellParam = roundNumber(aCell) + ", " + roundNumber(cCell);
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell)
					+ " \n celdm(4) =  " + roundNumber(cosRadiant(alpha))
					+ " \n celdm(5) = " + roundNumber(cosRadiant(beta))
					+ " \n celdm(6) =  " + roundNumber(cosRadiant(gamma))
					+ " \n\n";
			ibravQ = "4";
		}
		break;

	case ((interNumber > 167) && (interNumber <= 194)): // Hexagonal lattices
		stringCellParam = roundNumber(aCell) + ", " + roundNumber(cCell);
		if (!flagCryVasp && quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell)
					+ " \n celdm(3) = " + roundNumber(cCell / aCell) + " \n\n";
			ibravQ = "4";
		}
		break;
	titleCRYS == ""
case ((interNumber > 194) && (interNumber <= 230)): // Cubic lattices
	stringCellParam = roundNumber(aCell);
	if (!flagCryVasp && quantumEspresso) {
		cellDimString = " celdm(1) = " + fromAngstromtoBohr(aCell);
		// alert("I am here");
		ibravQ = "1";
		var question = confirm("Is a face centered cubic lattice?")
		if (question) {
			var questionBase = confirm("Is a body centered cubic lattice?")
			if (questionBase) {
				ibravQ = "3";
			} else {
				ibravQ = "2";
			}
		}

	}
	break;

default:
	errorMsg("SpaceGroup not found in range.");
	return false;
	break;

}// end switch

stringCellparamgulp = roundNumber(aCell) + ' ' + roundNumber(bCell) + ' '
		+ roundNumber(cCell) + ' ' + roundNumber(alpha) + ' '
		+ roundNumber(beta) + ' ' + roundNumber(gamma);
//	alert(stringCellparamgulp)
if (flagCryVasp)
	savCRYSTALSpace();

if (!flagGulp) {
	setV('set errorCallback "errCallback"');
	setV("load '' filter 'primitive'");
	loadStatejust();
}
}

function savCRYSTALSpace() {
var endCRYSTAL = "TEST', 'END";
//	alert(aCell + " " + bCell);
script = "var cellp = [" + stringCellParam + "];"
		+ 'var cellparam = cellp.join(" ");' + "var crystalArr = ['"
		+ titleCRYS + "', " + systemCRYSTAL + ", " + keywordCRYSTAL + ", "
		+ interNumber + "];" + 'crystalArr = crystalArr.replace("\n\n"," ");'
		+ "var crystalRestArr = [" + numAtomCRYSTAL + ", " + fractionalCRYSTAL
		+ ", '" + endCRYSTAL + "'];"
		+ 'crystalRestArr = crystalRestArr.replace("\n\n"," ");'
		+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
		+ 'finalArr = finalArr.replace("\n\n","\n");'
		+ 'WRITE VAR finalArr "?.d12"';
setV(script);

}

////////////////////////END SAVE INPUT

/////////////////////////
///////////////////////// LOAD & ON LOAD functions

function onClickLoadStruc() {
setV("load ? PACKED; set messageCallback 'myMessageCryCallback'; message CRYDONE; set echo top left; echo loading... HOLD ON;refresh; echo;");
//	alert("Geometry/ies and frequencies loaded!");
setName();
setTitleEcho();
//	alert("I am here")
}

function onClickReloadSymm() {
setV('set errorCallback "errCallback";');
jmolScriptWait("load ''; set echo top left; echo reloading... HOLD ON;refresh; set messageCallback 'myMessageCryCallback'; message CRYDONE; echo;");
if (!flagGauss) {
	setName();
} else {
	reLoadGaussFreq();
}
}

function myMessageCryCallback(a, m) {
m = "" + m
//	important to do this to change from Java string to JavaScript string
if (m.indexOf("CRYDONE") == 0) {
	// refresh();
	// refreshFreq();
	setV("echo");
	loadModels();
	setName();
	// alert("I am here")
	// setTitleEcho();
}
}

var freqData = new Array;
var geomData = new Array;
//This is called each time a new file is loaded
function loadModels() {

extractAuxiliaryJmol();

//	setName();
//	cleanandReloadfrom();
//	getUnitcell("1");
//	selectDesireModel("1");
//	alert(geomData);
//	counterModel = 0;
if (getbyID("sym") != null)
	cleanList("sym");
if (getbyID("geom") != null)
	cleanList("geom");
getUnitcell("1");
setV("echo");
//	last changed Thu Jul 3 2014
counterFreq = 0;

for (i = 0; i < Info.length; i++) {
	if (Info[i].name != null) {
		var line = Info[i].name;
		// alert(line)

		if (line.search(/Energy/i) != -1) { // Energy
			if (i > 0 && i < Info.length)
				var previous = substringEnergyToFloat(Info[i - 1].name);
			if (Info[i].name != null) {
				addOption(getbyID("geom"), i + " " + Info[i].name, i + 1);
				geomData[i] = Info[i].name;
				counterFreq++;
			}
		} else if (line.search(/cm/i) != -1) {
			// onLoadparam();
			// last changed Thu Jul 3 2014
			 addOption(getbyID("vib"), (i + counterFreq +1) + " " + Info[i].name, i + 1);
			if (line.search(/LO/) == -1)
				freqData[i - counterFreq] = Info[i].name;
		}

	}
	// enableFreqOpts();

	// symmetryModeAdd();
	setMaxMinPlot();
	// getSymInfo();
	setTitleEcho();
}
}

//var counterFreq = 0;
//last changed Thu Jul 3 2014
var counterFreq = 0;
function reloadFastModels() {
extractAuxiliaryJmol();

setName();
unLoadall();
if (flagCryVasp) {
	if (getbyID("sym") != null)
		cleanList("sym");
	if (getbyID("geom") != null)
		cleanList("geom");
	if (getbyID("vib") != null)
		cleanList("vib");
	getUnitcell("1");
	setV("echo");
	counterFreq = 0;
	setTitleEcho();
	nullValues = countNullModel(Info);

	for (i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var line = Info[i].name;

			if (line.search(/Energy/i) != -1) { // Energy
				if (i > 0 && i < Info.length)
					var previous = substringEnergyToFloat(Info[i - 1].name);
				if (Info[i].name != null) {
					addOption(getbyID("geom"), i + " " + Info[i].name, i + 1);
					geomData[i] = Info[i].name;
					counterFreq++;
				}
			} else if (line.search(/cm/i) != -1) {
				// onLoadparam();
				// last changed Thu Jul 3 2014
				 addOption(getbyID("vib"), (i - counterFreq) +1 + " "
				 + Info[i].name, i + 1);
				if (line.search(/LO/) == -1)
					freqData[i - counterFreq] = Info[i].name;
			}
		}
	}

	enableFreqOpts();
	symmetryModeAdd();
	setMaxMinPlot();
	//getSymInfo();
	setName();
}
}
function cleanandReloadfrom() {
unLoadall();
resetAll();
removeAll();
fillElementlist();

if (getbyID("sym") != null)
	cleanList("sym");
if (getbyID("geom") != null)
	cleanList("geom");
if (getbyID("vib") != null)
	cleanList("vib");
getUnitcell("1");
selectDesireModel("1");
setTitleEcho();
}

function countNullModel(arrayX) {
var valueNullelement = 0;
for ( var i = 0; i < arrayX.length; i++) {
	if (arrayX[i].name == null || arrayX[i].name == "")
		valueNullelement = valueNullelement + 1;
}
return valueNullelement;

}

function refresh() {
saveState();
setV('set errorCallback "errCallback";');
setV("set echo top left; echo loading plots... HOLD ON;refresh;");
setV("set loadStructCallback 'plotEnergies'; load; set loadStructCallback 'plotGradient';");
reloadState();
}

function enterTab() {
updateListElement();
//	updateListAtomApp();
}

function refreshFreq() {
saveState();
setV('set errorCallback "errCallback";');
setV('set echo top left; echo loading plot... HOLD ON;refresh;');
setV("set loadStructCallback 'plotFrequencies';");
}

/////////////////////////////////// END LOAD

/////////////////////////
/////////////////////////////// FREQUENCY

//This works out the symmetry classification on the frequency modes
function symmetryModeAdd() {

if (Info[3].modelProperties) {
	var symm = new Array();
	for ( var i = 1; i < Info.length; i++)
		if (Info[i].name != null)
			symm[i] = Info[i].modelProperties.vibrationalSymmetry;

	var sortedSymm = unique(symm);
}

for ( var i = 0; i < Info.length; i++) {
	if (Info[i].modelProperties) {
		if (sortedSymm[i] != null)
			addOption(getbyID("sym"), sortedSymm[i], sortedSymm[i])
	}
}
}

function loadAllFreq() {
removeAll();

var Info = extractAuxiliaryJmol()
//alert('length '+ Info.length)
for ( var i = 0; i < Info.length; i++)
	addOption(getbyID("vib"), i + " " + Info[i].name, i + 1);

}

function onClickVibrate(select) {
for ( var i = 0; i < document.modelsVib.vibration.length; i++) {
	if (document.modelsVib.vibration[i].checked)
		var radioval = document.modelsVib.vibration[i].value;
}

switch (radioval) {
case "on":
	jmolScript("vibration on; vectors SCALE 15; vector 5; vibration SCALE 7;");
	break;
case "off":
	jmolScript("vibration off;");
	break;
}
}

//This is to load either IR or Raman modes
function onClickModSelLoad(selectbox) {
var Info = extractAuxiliaryJmol()
for ( var i = 0; i < document.modelsVib.modAct.length; i++) {
	// if(Info[i].name != null){
	if (document.modelsVib.modAct[i].checked)
		var rad_val = document.modelsVib.modAct[i].value;
	// }
}

if (!Info[2].modelProperties.Frequency) {
	errorMsg("No vibrations available")
	return;
}

removeAll();
resetFreq();

switch (rad_val) {
case "all":
	for ( var i = 0; i < Info.length; i++) {
		if (Info[i].name != null)
			addOption(getbyID("vib"), i + " " + Info[i].name, i + 1);
	}
	cleanList("sym");
	symmetryModeAdd();
	break;

case "ir":
	for ( var i = 1; i < Info.length; i++) {
		if (Info[i].modelProperties.Frequency != null) {
			if (Info[i].modelProperties.IRactivity == "A") {
				addOption(getbyID("vib"), i + " " + Info[i].name, i + 1);
			}
		}
	}
	cleanList("sym");
	symmetryModeAdd();
	break;

case "raman":
	for ( var i = 1; i < Info.length; i++) {
		if (Info[i].modelProperties.Frequency != null) {
			if (Info[i].modelProperties.Ramanactivity == "A") {
				addOption(getbyID("vib"), i + " " + Info[i].name, i + 1);
			}
		}
	}
	cleanList("sym");
	symmetryModeAdd();
	break;
}
}

//This listens the action change the irep
function onChangeListDesSymm(irep) {
resetFreq();
removeAll()
var sym = Info;
if (!flagGauss) {
	for ( var i = 1; i < sym.length; i++) {
		if (Info[i].modelProperties.vibrationalSymmetry != null) {
			var value = sym[i].modelProperties.vibrationalSymmetry;
			if (irep == value)
				addOption(Jmol.outgetbyID("vib"), i + " " + sym[i].name, i + 1);
		}
	}
} else {
	changeIrepGauss(irep);
}
}

//This resets the frequency state
function resetFreq() {
	setV("vibration off; vectors on");
}
var maxR = 0;
function setMaxMinPlot() {
var localInfo = extractAuxiliaryJmol()
var loacalFreqCount = localInfo.length
var irFrequency = new Array();

try { 
	for ( var i = 0; i < loacalFreqCount; i++) { // populate IR array
		if (localInfo[i].name != null) {
			irFrequency[i] = roundoff(substringFreqToFloat(localInfo[i].modelProperties.Frequency), 0);
		}
		//alert(irFrequency)
		maxR = maxValue(irFrequency);
	}
} catch (err){
		maxR = 3700
}

var max = maxR + 300;
min = 0;
setVbyID("nMax", max)
setVbyID("nMin", min)
}

/////////////////////////////// END FREQUENCY

function toogleFormObject(status, elements) {

if (status == "on") {
	for ( var i = 0; i < elements.length; i++)
		makeEnable(elements[i]);
}
if (status == "off") {
	for ( var i = 0; i < elements.length; i++)
		makeDisable(elements[i]);
}

}
