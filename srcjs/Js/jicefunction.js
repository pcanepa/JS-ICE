/*  J-ICE library 

 based on:
 *
 *  Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 *  Contact: pierocanepa@sourceforge.net
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


//TODO: isosurface ?.CUBE  plane {0 1 0 1} contour 40   map ?.CUBE 

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////COMMON FUNCTIONS  
//Common functions to manipulate data of forms and objects

runJmolScript = function(script) {
	debugSay(script);
	jmolScript(script);	
}

debugSay = function(script) {
	// BH 2018
	var area = getbyID("debugarea");
	if (script === null) {
		script = "";
	} else {
		console.log(script);
		if (checkID("debugMode")) {
			area.style.display = "block";
			script = area.value + script + "\n";
		} else {
			area.style.display = "none";
			script = "";
		}
	}
	area.value = script;
	area.scrollTop = area.scrollHeight;
}

showCommands = function(d) {
	getbyID("debugarea").style.display = (d.checked ? "block" : "none");
}

runJmolScriptAndWait = function(script) {
	debugSay(script);
	jmolScriptWait(script);	
}

function getbyID(id) {
	return document.getElementById(id);
}

function setVbyID(id, val) {
	getbyID(id).value = val;
}

function getbyName(na) {
	return document.getElementsByName(na);
}

function getValue(id) {
	return getbyID(id).value;
}

function getValueSel(id) {
	return getbyID(id)[getbyID(id).selectedIndex].value;
}

function checkID(id) {
	return getbyID(id).checked;
}

function unCheckID(id) {
	return getbyID(id).unchecked;
}

function checkBox(id) {
	getbyID(id).checked = true;
}

function uncheckBox(id) {
	getbyID(id).checked = false;
}

function resetByID(form) {
	var element = "document." + form + ".reset";
	return element;
}

//These functions are used to enabled and disabled an element
function makeDisable(element) {
	var x = getbyID(element);
	x.disabled = true;
}

function makeEnable(element) {
	var x = getbyID(element);
	x.disabled = false;
}

function checkBoxStatus(form, element) {
	if (form.checked == true)
		makeDisable(element);
	if (form.checked == false)
		makeEnable(element);
}

function checkBoxX(form) {
	var value = "";
	var test = getbyID(form);
	value = (test.checked) ? ("on") : ("off");
	return value;
}

function setTextboxValue(nametextbox, valuetextbox) {
	var tbox = getbyID(nametextbox);
	tbox.value = "";
	if (tbox)
		tbox.value = valuetextbox;
}

function uncheckRadio(radio) {
	var radioId = getbyName(radio);
	for ( var i = 0; i < radioId.length; i++)
		radioId[i].checked = false;
}

//this function sorts value given an array and removes duplicates too
function unique(a) {
	var r = new Array();
	o: for ( var i = 0, n = a.length; i < n; i++) {
		for ( var x = 0, y = r.length; x < y; x++)
			if (r[x] == a[i])
				continue o;
		r[r.length] = a[i];
	}
	return r;
}

//This is meant to add new element to a list
function addOption(selectbox, text, value) {
	var optn = document.createElement("OPTION");
	optn.text = text;
	optn.value = value;
	selectbox.options.add(optn);
}

//This is to clean a list
function cleanList(listname) {
	for ( var i = (getbyID(listname).options.length - 1); i >= 0; i--)
		getbyID(listname).remove(i);
}

function toggleDiv(form, me) {
	if (form.checked == true)
		getbyID(me).style.display = "inline";
	if (form.checked == false)
		getbyID(me).style.display = "none";
}

function toggleDivValue(value, me) {
	if (value == true)
		getbyID(me).style.display = "inline";
	if (value == false)
		getbyID(me).style.display = "none";
}

function untoggleDiv(form, me) {
	if (form.checked == true)
		getbyID(me).style.display = "none";
	if (form.checked == false)
		getbyID(me).style.display = "inline";
}

function toggleDivRadioTrans(value, me) {
	if (value == "off") {
		getbyID(me).style.display = "inline";
	} else {
		getbyID(me).style.display = "none";
	}
}

Array.prototype.max = function() {
	var max = this[0];
	var len = this.length;
	for ( var i = 1; i < len; i++)
		if (this[i] > max)
			max = this[i];
	return max;
}

Array.prototype.min = function() {
	var min = this[0];
	var len = this.length;
	for ( var i = 1; i < len; i++)
		if (this[i] < min)
			min = this[i];
	return min;
}

////////////////////////////////END COMMON FUNCTIONS

/////////////////////////////////////////////////////////////////////////////
/////MESSAGE , ERROR and WARNING

function warningMsg(msg) {
	alert("WARNING: " + msg);
}

function errorMsg(msg) {
	alert("ERROR: " + msg);
	return false;
}

function messageMsg(msg) {
	alert("MESSAGE: " + msg);
}


/////////////////////////////// END MESSAGE , ERROR and WARNING

/////////////////////////////////////////////////////////////////////////////

////////////////////////////////Jmol COMMON FUNCTIONS

//This grabs the value given form the form
function setV(value) {
	runJmolScript(value);
}

//This set the value on or off depending on the Checkbox status
function setVTrueFalse(form, value) {
	(form.checked == true) ? setV(value + " TRUE") : setV(value + " FALSE");
}

function setVCheckbox(form, value) {
	if (form.checked == true)
		var stringa = value + " ON";
	if (form.checked == false)
		var stringa = value + " OFF";
	setV(stringa);
}

//These functions extract values form the model load in Jmol
function extractInfoJmol(whatToExtract) {
	var data = jmolGetPropertyAsArray(whatToExtract);
	return data;
}

function extractInfoJmolString(whatToExtract) {
	var data = jmolGetPropertyAsString(whatToExtract);
	return data;
}

var Info = new Array();
function extractAuxiliaryJmol(path) {
	Info = extractInfoJmol("auxiliaryInfo.models");
	if (path) {
		for (var i = Info.length; --i >= 0;)
			if (!Info[i] || !Info[i].modelProperties || Info[i].modelProperties.PATH != path)
				Info.splice(i, 1);		
	}
	return Info;
}

var InfoAtom = new Array();
function extractAtomInfo() {
	InfoAtom = extractInfoJmol("atomInfo");
	return InfoAtom;
}

//This function saves the current state of Jmol applet
function saveState() {
	//setErrorCallback
	setV("save ORIENTATION orienta; save STATE status;");
	setV("set messageCallback 'saveMessageCallback'; message SAVED;");
}

function saveStatejust() {
	setV("save ORIENTATION orienta; save STATE status;");
	// setV("set messageCallback 'saveMessageCallback'; message SAVED;")
}

function loadStatejust() {
	//setErrorCallback
	setV("restore ORIENTATION orienta; restore STATE status;");
	// setV("set messageCallback 'saveMessageCallback'; message SAVED;")
}

//This function reloads the previously saved state after a positive
//saveMessageCallback() == SAVED
function restoreState() {
	//setErrorCallback
	setV('restore ORIENTATION orienta; restore STATE status;');
}

function saveMessageCallback(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("SAVED") == 0) {
		setV("echo;");
		reloadFastModels();
		restoreState();
	}
}

//This just saves the orientation of the structure
function saveOrientation() {
	//setErrorCallback
	setV('save ORIENTATION oriente');
	setV("set messageCallback 'saveOrientaMessageCallback'; message SAVEDORIENTA;");
}

function saveOrientaMessageCallback(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("SAVEDORIENTA") == 0) {
	}
}

function restoreOrientation_e() {
	//setErrorCallback
	setV('restore ORIENTATION oriente');
}

function setNameModel(form) {
	if (form.checked == true)
		var stringa = "frame title";
	if (form.checked == false)
		var stringa = "frame title ''";
	setV(stringa);
}

function setTitleEcho() {
	var titleFile = "";
	titleFile = extractInfoJmolString("fileHeader");
	setV('set echo top right; echo "' + titleFile + ' ";');
}

function saveCurrentState() {
	warningMsg("This option only the state temporarily. To save your work, use File...Export...image+state(PNGJ). The image created can be dragged back into Jmol or JSmol or sent to a colleague to reproduce the current state exactly as it appears in the image.");
	//setErrorCallback
	setV('save ORIENTATION orask; save STATE stask; save BOND bask');
	setV("set messageCallback 'saveCurrentAsk'; message SAVEDASK; set echo top left;echo saving state...;refresh;");
}

function saveCurrentAsk(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("SAVEDASK") == 0) {
		setV("echo;");
	}
}

function reloadCurrentState() {
	//setErrorCallback
	setV('restore ORIENTATION orask; restore STATE stask; restore BOND bask;');
	setV("set messageCallback 'reloadCurrentAsk'; message RELOADASK; set echo top left;echo reloading previosu state...;refresh;");
}

function reloadCurrentAsk(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("RELOADASK") == 0) {
		setV("echo;");
	}
}

////////////////////////////////END Jmol COMMON FUNCTIONS

/////////FUNCTION TO FILL LIST

////This is to select the atom by element

function fillElementlist() {
	var element = new Array();
	element = null;
	element = jmolGetPropertyAsArray("atomInfo");

	var newElement = new Array();
	newElement[0] = "select";
	for ( var i = 1; i < element.length; i++)
		newElement[i] = element[i].element;

	var sortedElement = unique(newElement);

	for ( var i = 0; i < sortedElement.length; i++) {
		addOption(getbyID("colourbyElementList"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("polybyElementList"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("poly2byElementList"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("byElementAtomMotion"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("deletebyElementList"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("connectbyElementList"), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID("connectbyElementListone"), sortedElement[i],
				sortedElement[i]);
	}
}



function updateListElement(x) {
	for ( var i = (getbyID("colourbyElementList").options.length - 1); i >= 0; i--)
		getbyID("colourbyElementList").remove(i);
	for ( var i = (getbyID("polybyElementList").options.length - 1); i >= 0; i--)
		getbyID("polybyElementList").remove(i);
	for ( var i = (getbyID("poly2byElementList").options.length - 1); i >= 0; i--)
		getbyID("poly2byElementList").remove(i);
	for ( var i = (getbyID("byElementAtomMotion").options.length - 1); i >= 0; i--)
		getbyID("byElementAtomMotion").remove(i);
	for ( var i = (getbyID("deletebyElementList").options.length - 1); i >= 0; i--)
		getbyID("deletebyElementList").remove(i);
	for ( var i = (getbyID("connectbyElementList").options.length - 1); i >= 0; i--)
		getbyID("connectbyElementList").remove(i);
	for ( var i = (getbyID("connectbyElementListone").options.length - 1); i >= 0; i--)
		getbyID("connectbyElementListone").remove(i);
	fillElementlist();
}
///////////END LIST

/////////////////////////////// SHOW

var modelNumber;
//This shows a frame once clicked on the lateral list
function showFrame(i) {
	ModelNumber = null;
	if (counterFreq != 0) {
		var model = i;
		setV("frame " + model);
		selectDesireModel(model);
		getUnitcell(model);
	} else {
		setV("frame " + i);
		modelNumber = i;
		selectDesireModel(i);
		getUnitcell(i);

	}

}

var selectedFrame = null;
var frameNum = null;
var frameValue = null;
function selectDesireModel(i) {
	selectedFrame = null;
	frameNum = null;
	frameValue = null;
	selectedFrame = "{1." + i + "}";
	frameNum = "1." + i;
	frameValue = i;
	if (i == null || i == "") {
		selectedFrame = "{1.1}";
		frameNum = "1.1";
		frameValue = 1;
	}
}
/////////////////////////////// END SHOW

////////////////LOAD And SAVE functions
//export list
var flagCryVasp = true; // if flagCryVasp = true crystal output
var flagGromos = false;
var flagGulp = false;
var flagOutcar = false;
var flagGauss = false;
var flagQuantum = false;
var flagCif = false;
var flagSiesta = false;
var flagDmol = false;
var flagMolde = false;
var flagCast = false;
function onChangeLoad(load) {
	// This is to reset all function
	resetAll();

	switch (load) {
	case "loadC":
		setV('set errorCallback "errCallback";load ?; set defaultDirectory; script ../scripts/name.spt');
		setName();
		break;
	case "loadShel":
		setName();
		typeSystem = "crystal";
		flagCif = true;
		getUnitcell();
		break;
	case "loadxyz":
		setV('set errorCallback "errCallback";load ?.xyz; set defaultDirectory; script ../scripts/name.spt');
		setName();
		break;
	case "loadcrystal":
		flagCryVasp = true;
		flagGulp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickLoadStruc();
		getUnitcell(1);
		break;
	case "loadCUBE":
		cubeLoad();
		break;
	case "loadaimsfhi":
		setV('set errorCallback "errCallback";load ?.in ; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		flagCif = true;
		typeSystem = "crystal";
		getUnitcell();
		break;
	case "loadcastep":
		setV('set errorCallback "errCallback"; load ?.cell ; set defaultDirectory');
		setName();
		flagCif = true;
		typeSystem = "crystal";
		getUnitcell();
		break;
	case "loadVasp":
		typeSystem = "crystal";
		flagCryVasp = false;
		flagOutcar = false;
		flagGauss = false;
		flagQuantum = false;
		flagGulp = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickLoadVaspStruct();
		setName();
		getUnitcell();
		break;
	case "loadVASPoutcar":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = true;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickLoadOutcar();
		setName();
		getUnitcell(1);
		break;
	case "loadDmol":
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = true;
		flagCast = false;
		onClickLoadDmolStruc();
		setName();
		getUnitcell(1);
		break;
	case "loadQuantum":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = true;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickQuantum();
		setName();
		getUnitcell(1);
		break;
	case "loadGulp":
		flagGulp = true;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickLoadGulpStruct();
		setName();
		getUnitcell(1);
		break;
	case "loadmaterial":
		setV('set errorCallback "errCallback"; load ?; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		getUnitcell(1);
		break;
	case "loadWien":
		setV('set errorCallback "errCallback"; load ?.struct; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		flagCif = true;
		typeSystem = "crystal";
		getUnitcell(1);
		break;
	case "loadcif":
		setV('set errorCallback "errCallback"; load ?.cif PACKED; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		flagCif = true;
		typeSystem = "crystal";
		getUnitcell(1);
		break;

	case "loadSiesta":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = false;
		flagSiesta = true;
		flagDmol = false;
		flagCast = false;
		loadSiesta();
		setName();
		getUnitcell(1);
		break;
	case "loadpdb":
		setV('set errorCallback "errCallback";load ?.pdb; set defaultDirectory ; script ../scripts/name.spt;');
		setName();
		flagCif = true;
		setV('unitcell on');
		typeSystem = "crystal";
		getUnitcell(1);
		break;
	case "reload":
		setName();
		var reloadStr = "script ./scripts/reload.spt"
			setV(reloadStr);
		resetAll();
		setName();
		getUnitcell(1);
		break;
	case "loadJvxl":
		loadMapJvxl();
		// setV('set errorCallback "errCallback"; zap; isosurface ?.jvxl');
		setName();
		break;
	case "loadstate":
		setV('set errorCallback "errCallback"; zap; load ?.spt; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		break;

	case "loadgromacs":
		setV('set errorCallback "errCallback";load ?.gro; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		getUnitcell(1);
		setV('unitcell on');
		flagGromos = true;
		break;
	case "loadgauss":
		flagCryVasp = false;
		flagGromos = false;
		flagGulp = false;
		flagOutcar = false;
		flagGauss = true;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		typeSystem = "molecule";
		loadGaussian();
		setName();
		break;
	case "loadMolden":
		// WE USE SAME SETTINGS AS VASP
		// IT WORKS
		typeSystem = "molecule";
		flagGulp = false;
		flagOutcar = true;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		onClickLoadMoldenStruct();
		break;
	case "loadXcrysden":
		setV('set errorCallback "errCallback"; load ?.xsf ; set defaultDirectory');
		setName();
		flagCif = true;
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		typeSystem = "crystal";
		getUnitcell();
		break;
	case "loadOutcastep":
		setName();
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = true;
		onClickLoadCastep();
		setName();
		getUnitcell(1);
		break;
	}
	document.fileGroup.reset();
}

function setName() {
	setTextboxValue("filename", "Filename:");
	var name = jmolGetPropertyAsJSON("filename");
	name = "Filename: "
		+ name
		.substring(name.indexOf('\"') + 13,
				name.lastIndexOf('}') - 1);
	setTextboxValue("filename", name);
}

var quantumEspresso = false;
function onChangeSave(save) {
	// see menu.js

	if (save == "savePNG")
		setV('set errorCallback "errCallback";write PNG "jice.png"');
	if (save == "savePNGJ")
		setV('set errorCallback "errCallback";write PNGJ "jice.png"');
	if (save == "saveXYZ")
		setV('set errorCallback "errCallback";write COORDS XYZ jice.xyz');
	if (save == "saveFrac")

		saveFractionalCoordinate();
	if (save == "saveCRYSTAL") {
		flagCryVasp = true;
		// magnetic = false;
		exportCRYSTAL();
	}
	if (save == "saveGROMACS")
		exportGromacs();
	if (save == "saveCASTEP")
		exportCASTEP();
	if (save == "saveQuantum") {
		// magnetic = false;
		quantumEspresso = true;
		flagCryVasp = false;
		exportQuantum();
	}
	if (save == "savePOV")
		setV('set errorCallback "errCallback"; write POVRAY jice.pov');
	if (save == "savepdb")
		setV('set errorCallback "errCallback"; write PDB jice.pdb');
	if (save == "saveVASP") {
		// magnetic = false;
		flagCryVasp = false;
		exportVASP();
	}
	if (save == "saveState")
		setV('set errorCallback "errCallback";write STATE jice.spt');
	if (save == "saveGULP") {
		flagGulp = true;
		flagCryVasp = false;
		exportGULP();
	}
	if (save == "savefreqHtml") {
		newAppletWindowFreq();
	}

	document.fileGroup.reset();
}

/////////////// END OPEN AND SAVE FUNCTIONS

///////////////
/////////////// EDIT FUNCTION
///////////////

function deleteAtom() {
	setV(deleteMode);
	setV('draw off');
}

function hideAtom() {
	setV(hideMode);
	setV('draw off');
}

function connectAtom() {
	var styleBond = getValue("setBondFashion");
	if (styleBond == "select") {
		errorMsg("Please select type of bond!");
		return false;
	}

	if (radbondVal == "all") {
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				errorMsg("Please, check values entered in the textboxes");
				return false;
			}
			// alert(bondRadFrom)
			setV("connect (all) (all) DELETE; connect " + bondRadFrom
					+ " (all) (all) " + styleBond + " ModifyOrCreate;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				errorMsg("Please, check values entered in the textboxes.");
				return false;
			}
			if (bondRadTo <= bondRadFrom) {
				errorMsg("Please, check the range value entered.");
				return false;
			}
			setV("connect (all) (all) DELETE; connect " + bondRadFrom + " "
					+ bondRadTo + " (all) (all) " + styleBond
					+ " ModifyOrCreate;");
		}
	} else if (radbondVal == "atom") {
		var atomFrom = getValue("connectbyElementList");
		var atomTo = getValue("connectbyElementListone");
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				errorMsg("Please, check values entered in the textboxes");
				return false;
			}
			// alert(bondRadFrom)
			setV("connect (" + atomFrom + ") (" + atomTo + ") DELETE; connect "
					+ bondRadFrom + " (" + atomFrom + ") (" + atomTo + ") "
					+ styleBond + " ModifyOrCreate;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				errorMsg("Please, check values entered in the textboxes.");
				return false;
			}
			if (bondRadTo <= bondRadFrom) {
				errorMsg("Please, check the range value entered.");
				return false;
			}
			setV("connect (" + atomFrom + ") (" + atomTo + ") DELETE; connect "
					+ bondRadFrom + " " + bondRadTo + " (" + atomFrom + ") ("
					+ atomTo + ") " + styleBond + " ModifyOrCreate;");
		}

	} else if (radbondVal == "selection") {
		setV("connect (selected) (selected) " + styleBond + " ModifyOrCreate;");
	}
}

function deleteBond() {
	var styleBond = getValue("setBondFashion");

	if (radbondVal == "all") {
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				setV("connect (all) (all)  DELETE;");
				return false;
			}
			// alert(bondRadFrom)
			setV("connect " + bondRadFrom + " (all) (all)  DELETE;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				setV("connect (all) (all)  DELETE;");
				return false;
			}
			setV("connect " + bondRadFrom + " " + bondRadTo
					+ " (all) (all)  DELETE;");
		}
	} else if (radbondVal == "atom") {
		var atomFrom = getValue("connectbyElementList");
		var atomTo = getValue("connectbyElementListone");
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				setV("connect (" + atomFrom + ") (" + atomTo + ") DELETE;");
				return false;
			}
			// alert(bondRadFrom)
			setV(" connect " + bondRadFrom + " (" + atomFrom + ") (" + atomTo
					+ ") DELETE;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				setV("connect (" + atomFrom + ") (" + atomTo + ") DELETE;");
				return false;
			}
			setV("connect " + bondRadFrom + " " + bondRadTo + " (" + atomFrom
					+ ") (" + atomTo + ") DELETE;");
		}

	} else if (radbondVal == "selection") {
		setV("connect (selected) (selected) " + styleBond + " DELETE;");
	}
}

var radbondVal;
function checkBondStatus(radval) {
	setV("select *; halos off; label off; select none;");
	radbondVal = radval;
	if (radbondVal == "selection") {
		for ( var i = 0; i < document.editGroup.range.length; i++)
			document.editGroup.range[i].disabled = true;
		setV('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;');
		getbyID("connectbyElementList").disabled = true;
		getbyID("connectbyElementListone").disabled = true;
	} else {
		for ( var i = 0; i < document.editGroup.range.length; i++)
			document.editGroup.range[i].disabled = false;

		getbyID("radiuscoonectFrom").disabled = true;
		getbyID("radiuscoonectTo").disabled = true;
		getbyID("connectbyElementList").disabled = true;
		getbyID("connectbyElementListone").disabled = true;

		if (radbondVal == "atom") {
			getbyID("connectbyElementList").disabled = false;
			getbyID("connectbyElementListone").disabled = false;
		}
	}

}

var radBondRange;
function checkWhithin(radVal) {
	radBondRange = radVal;
	if (radBondRange == "just") {
		getbyID("radiuscoonectFrom").disabled = false;
		getbyID("radiuscoonectTo").disabled = true;
	} else {
		getbyID("radiuscoonectFrom").disabled = false;
		getbyID("radiuscoonectTo").disabled = false;
	}

}

//Fix .AtomName
function changeElement(value) {
	setV('{selected}.element = "' + value + '";');
	setV('{selected}.ionic = "' + value + '";');
	setV('label "%e";font label 16;')
	setV("draw off; set messageReList 'saveIsoCallback'; message LIST; ");
	updateListElement(null);
}

function messageReList(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("LIST") == 0) {
		var flag = false;
		setV("echo");
		enterTab();
	}
}
/////////////// END EDIT FUNCTION

//////////////POLYHEDRA FUNCT
/////////////
var polyString = "";
function createPolyedra() {

	var vertNo, from, to, distance, style, selected, face;
	vertNo = getValue("polyEdge");
	from = getValue("polybyElementList");
	to = getValue("poly2byElementList");
	style = getValue("polyVert");
	face = getValue("polyFace");

	setV("polyhedra DELETE");

	// if( from == to){
	// errorMsg("Use a different atom as Vertex");
	// return false;
	// }

	distance = getValue("polyDistance");

	if (distance == "") {
		setV("polyhedra 4, 6" + " faceCenterOffset " + face + " " + style);
		return;
	}

	/*
	 * if(checkID("byselectionPoly")){ setV("polyhedra " + vertNo + " BOND { "+
	 * selected +" } faceCenterOffset " + face + " " + style); }
	 */

	if (checkID("centralPoly")) {
		setV("polyhedra BOND " + "{ " + from + " } faceCenterOffset " + face
				+ " " + style);
	} else {

		if (checkID("bondPoly")) {
			setV("polyhedra " + vertNo + " BOND faceCenterOffset " + face + " "
					+ style);
			// polyString = "polyhedra "+ vertNo + " BOND faceCenterOffset " +
			// face + " " + style;
		}
		if (checkID("bondPoly1")) {
			setV("polyhedra " + vertNo + " " + distance + " (" + from + ") to "
					+ "(" + to + ")   faceCenterOffset " + face + " " + style);
			// polyString = "polyhedra "+ vertNo + " " + distance + " (" +from +
			// ") to " + "(" + to + ") faceCenterOffset " + face + " ";
		}

	}

}

function checkPolyValue(value) {
	(value == "collapsed") ? (makeEnable("polyFace"))
			: (makeDisable("polyFace"));
}

function setPolyString(value) {
	polyString = "";
	polyString = "polyhedra 4, 6" + "  faceCenterOffset " + face + " " + value;
	setV(polyString);
}

function setPolybyPicking(element) {
	setPicking(element);
	checkBoxStatus(element, "polybyElementList");
	checkBoxStatus(element, "poly2byElementList");
}
///// END POLYHEDRA FUNCT

/////////
///////////////////// MEASUREMENT FUNCTIONS

var unitMeasure = "";
function setMeasureUnit(value) {
	unitMeasure = value;
	setV("set measurements " + value);
}

function setMeasurement() {
	setV("set measurements ON");
}

var mesCount = 0;
function checkMeasure(value) {
	var radiobutton = value;
	var unit = getbyID('measureDist').value;
	mesReset();
	setV('set pickingStyle MEASURE ON;');
	if (radiobutton == "distance") {
		if (unit == 'select') {
			measureHint('Select the desired measure unit.');
			uncheckRadio("distance");
			return false;
		}
		measureHint('Pick two atoms');
		setV('set defaultDistanceLabel "%10.2VALUE %UNITS"');
		setV('showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking DISTANCE;');
		setV("measure ON; set measurements ON; set showMeasurements ON; set measurements ON; set measurementUnits "
				+ unit
				+ ";set picking MEASURE DISTANCE; set MeasureCallback 'measuramentCallback';");
		setV('set measurements ' + unitMeasure + ';')
		setV('label ON');

	} else if (radiobutton == "angle") {
		measureHint('Pick three atoms');
		setV('set defaultAngleLabel "%10.2VALUE %UNITS"');
		setV('showSelections TRUE; select none;  label on ; set picking on; set picking LABEL; set picking SELECT atom; set picking ANGLE;');
		setV("measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE ANGLE; set MeasureCallback 'measuramentCallback';");
		setV('set measurements ' + unitMeasure + ';')
		setV('label ON');

	} else if (radiobutton == "torsional") {
		measureHint('Pick four atoms');
		setV('set defaultTorsionLabel "%10.2VALUE %UNITS"');
		setV('showSelections TRUE; select none;  label on ; set picking on; set picking TORSION; set picking SELECT atom; set picking ANGLE;');
		setV("measure ON; set measurements ON; set showMeasurements ON; set picking MEASURE TORSION; set MeasureCallback 'measuramentCallback';");
		// setV('set measurements ' + unitMeasure + ';')
		setV('label ON');

	}

}


var measureHint = function(msg) {	
	// BH 2018
	document.measureGroup.textMeasure.value = msg + "...";
}

function measuramentCallback(app, msg, type, state, value) {
	// BH 2018
	if (state == "measurePicked")
		setMeasureText(msg);
}

function setMeasureText(value) {
	setV("show measurements");
	var init = "\n";
	// BH 2018
	if (mesCount == 0)
		document.measureGroup.textMeasure.value = init = '';
	document.measureGroup.textMeasure.value += init + ++mesCount + " " + value;
}

function mesReset() {
	mesCount = 0;
	// setV ('showSelections TRUE; select none; halos on;')
	getbyID("textMeasure").value = "";
	setV('set pickingStyle MEASURE OFF; select *; label off; halos OFF; selectionHalos OFF; measure OFF; set measurements OFF; set showMeasurements OFF;  measure DELETE;');
	// document.measureGroup.reset();
}

///////////END MEASURAMENT FUNCTIONS

/////////// CELL FUNCTIONS

function saveFrame() {
	messageMsg("This is to save frame by frame your geometry optimization.");
	var value = checkBoxX("saveFrames");
	if (value == "on")
		setV('write frames {*} "fileName.jpg"');
}

//This saves fractional coordinates
function saveFractionalCoordinate() {
	warningMsg("Make sure you had selected the model you would like to export.");

	if (selectedFrame == null)
		getUnitcell(1);

	var x = "var cellp = [" + roundNumber(aCell) + ", " + roundNumber(bCell)
	+ ", " + roundNumber(cCell) + ", " + roundNumber(alpha) + ", "
	+ roundNumber(beta) + ", " + roundNumber(gamma) + "];"
	+ 'var cellparam = cellp.join(" ");' + 'var xyzfrac = '
	+ selectedFrame + '.label("%a %16.9[fxyz]");'
	+ 'var lista = [cellparam, xyzfrac];'
	+ 'WRITE VAR lista "?.XYZfrac" ';
	setV(x);
}

//This reads out cell parameters given astructure.
var aCell, bCell, cCell, alpha, beta, gamma, typeSystem;
function getUnitcell(i) {
	// document.cellGroup.reset();
	typeSystem = "";
	i || (i = 1);
	var StringUnitcell = "auxiliaryinfo.models[" + i + "].infoUnitCell";

	var cellparam = extractInfoJmol(StringUnitcell);

	aCell = roundNumber(cellparam[0]);
	bCell = roundNumber(cellparam[1]);
	cCell = roundNumber(cellparam[2]);
	dimensionality = parseFloat(cellparam[15]);
	volumeCell = roundNumber(cellparam[16]);

	var bOvera = roundNumber(parseFloat(bCell / cCell));
	var cOvera = roundNumber(parseFloat(cCell / aCell));

	if (dimensionality == 1) {
		bCell = 0.000;
		cCell = 0.000;
		makeEnable("par_a");
		setVbyID("par_a", "");
		makeDisable("par_b");
		setVbyID("par_b", "1");
		makeDisable("par_c");
		setVbyID("par_c", "1");
		setVbyID("bovera", "0");
		setVbyID("covera", "0");
		typeSystem = "polymer";
	} else if (dimensionality == 2) {
		cCell = 0.000;
		typeSystem = "slab";
		makeEnable("par_a");
		setVbyID("par_a", "");
		makeEnable("par_b");
		setVbyID("par_b", "");
		makeDisable("par_c");
		setVbyID("par_c", "1");
		setVbyID("bovera", bOvera);
		setVbyID("covera", "0");
	} else if (dimensionality == 3) {
		typeSystem = "crystal";
		alpha = cellparam[3];
		beta = cellparam[4];
		gamma = cellparam[5];
		makeEnable("par_a");
		setVbyID("par_a", "");
		makeEnable("par_b");
		setVbyID("par_b", "");
		makeEnable("par_c");
		setVbyID("par_c", "");
		setVbyID("bovera", bOvera);
		setVbyID("covera", cOvera);
	} else if (!cellparam[0] && !cellparam[1] && !cellparam[2] && !cellparam[4]) {
		aCell = 0.00;
		bCell = 0.00;
		cCell = 0.00;
		alpha = 0.00;
		beta = 0.00;
		gamma = 0.00;
		typeSystem = "molecule";
		setVbyID("bovera", "0");
		setVbyID("covera", "0");
	}
	setVbyID("aCell", roundNumber(aCell));
	setVbyID("bCell", roundNumber(bCell));
	setVbyID("cCell", roundNumber(cCell));
	setVbyID("alphaCell", roundNumber(alpha));
	setVbyID("betaCell", roundNumber(beta));
	setVbyID("gammaCell", roundNumber(gamma));
	setVbyID("volumeCell", roundNumber(volumeCell));

}

function setUnitCell() {
	getUnitcell(frameValue);
	if (selectedFrame == null || selectedFrame == "" || frameValue == ""
		|| frameValue == null) {
		selectedFrame = "{1.1}";
		frameNum = 1.1;
		getUnitcell("1");
	}
}
////END OPEN SAVE FUNCTIONS

///////////////
//////////////CELL AND ORIENTATION FUNCTION
/////////////

function setCellMeasure(value) {
	typeSystem = "";
	var StringUnitcell = "auxiliaryinfo.models[" + i + "].infoUnitCell";

	if (i == null || i == "")
		StringUnitcell = " auxiliaryInfo.models[1].infoUnitCell ";

	var cellparam = extractInfoJmol(StringUnitcell);
	aCell = cellparam[0];
	bCell = cellparam[1];
	cCell = cellparam[2];
	if (value == "a") {
		setVbyID("aCell", roundNumber(aCell));
		setVbyID("bCell", roundNumber(bCell));
		setVbyID("cCell", roundNumber(cCell));
	} else {
		aCell = aCell * 1.889725989;
		bCell = bCell * 1.889725989;
		cCell = cCell * 1.889725989;
		setVbyID("aCell", roundNumber(aCell));
		setVbyID("bCell", roundNumber(bCell));
		setVbyID("cCell", roundNumber(cCell));
	}

}
function setCellDotted() {
	var cella = checkBoxX('cellDott');
	if (cella == "on") {
		setV("unitcell DOTTED ;");
	} else {
		setV("unitcell ON;");
	}
}

//This gets values from textboxes using them to build supercells
function setPackaging(packMode) {
	var kindCell = null;
	kindCell = getbyName("cella");
	var checkboxSuper = checkBoxX("supercellForce");
	var kindCellfinal = null;
	var typePack = null;

	for ( var i = 0; i < kindCell.length; i++) {
		if (kindCell[i].checked)
			kindCellfinal = kindCell[i].value;
	}

	typePack = packMode + " " + (kindCellfinal == "conventional" ? ' filter "conventional" '
			: ' filter "primitive" ');
	
	// BH 2018
	getValue("par_a") || setVbyID("par_a", 1);
	getValue("par_b") || setVbyID("par_b", 1);
	getValue("par_c") || setVbyID("par_c", 1);
	
	// BH 2018 adds save/restore orientation
	if (checkboxSuper == "on") {
		warningMsg("You decided to constrain your original supercell to form a supercell. \n The symmetry was reduced to P1.");
		setV('save orientation o;load "" {1 1 1} SUPERCELL {' + getValue("par_a") + ' '
				+ getValue("par_b") + ' ' + getValue("par_c") + '}' + typePack + ";restore orientation o;");
		setV("set messageCallback 'superCellParams'; message SUPERCELL;");
	} else {
		setV('save orientation o;load "" {' + getValue("par_a") + ' ' + getValue("par_b") + ' '
				+ getValue("par_c") + '}' + typePack + ";restore orientation o;");
	}
}

function setPackRange() {

	kindCell = getbyName("cella");
	var kindCellfinal = null;
	for ( var i = 0; i < kindCell.length; i++) {
		if (kindCell[i].checked)
			kindCellfinal = kindCell[i].value;
	}
	stringa = "load '' {1 1 1} RANGE " + packRange + " FILTER '"
	+ kindCellfinal
	+ "'; set messageCallback 'cellOperation'; message CELL;";
	setV(stringa);
}

function checkPack() {
	uncheckBox("superPack");
	// This initialize the bar
	getbyID("packMsg").innerHTML = 0 + " &#197";
}

function uncheckPack() {
	uncheckBox("chPack");
	getbyID("packDiv").style.display = "none";
	kindCell = getbyName("cella");
	var kindCellfinal = null;
	for ( var i = 0; i < kindCell.length; i++) {
		if (kindCell[i].checked)
			kindCellfinal = kindCell[i].value;
	}
	setCellType(kindCellfinal);
}

function setCellType(value) {
	var valueConv = checkBoxX("superPack");
	var checkBoxchPack = checkBoxX("chPack");
	var stringa = "load '' FILTER '" + value
	+ "'; set messageCallback 'cellOperation'; message CELL;";
	if (valueConv == "on" && checkBoxchPack == "off") {
		stringa = "load '' FILTER '" + value
		+ "'; set messageCallback 'cellOperation'; message CELL;";
		(value == "primitive") ? (setV(stringa)) : (setV(stringa));
	} else if (valueConv == "off" && checkBoxchPack == "on") {
		stringa = "load '' {1 1 1} RANGE " + packRange + " FILTER '" + value
		+ "'; set messageCallback 'cellOperation'; message CELL;";
		(value == "primitive") ? (setV(stringa)) : (setV(stringa));
	}
}

function setManualOrigin() {

	var x = getValue("par_x");
	var y = getValue("par_y");
	var z = getValue("par_z");

	if (x == "" || y == "" || z == "") {
		errorMsg("Please, check values entered in the textboxes");
		return false;
	}

	setV("unitcell { " + x + " " + y + " " + z
			+ " }; set messageCallback 'cellOperation'; message CELL;");

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

	(!getbyID("moveByselection").checked) ? setV(motion + " " + axis + " "
			+ magnitudeMotion) : setV(motion + stringa);

}

function setFashionAB(valueList) {

	var radio = getbyName("abFashion");
	for ( var i = 0; i < radio.length; i++) {
		if (radio[i].checked == true)
			var radioValue = radio[i].value;
	}

	var fashion = (radioValue == "on") ? 'OPAQUE' : 'TRANSLUCENT';

	if (valueList != "select")
		setV('color ' + valueList + ' ' + fashion);
}

function setUnitCellOrigin(value) {
	setV("unitcell { " + value + " }");
}

function getSymInfo() {

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
		for ( var i = 0; i < S.length; i++) {
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
		for ( var i = 0; i < nPoints; i++)
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
	setV("display " + (showatoms ? "all" : "none"));
	var d = getbyID("symselect");
	var iop = parseInt(d[d.selectedIndex].value);
	// if (!iop && !symop) symop = getbyID("txtop").value
	if (!symop) {
		if (!iop) {
			setV("select *;color opaque;draw sym_* delete");
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
	setV(script);
}
function resetSymmetryView() {
	setV('select *;color atoms opaque; echo; draw off');
}

function deleteSymmetry() {
	getbyID("syminfo").removeChild;
}

function cellOperation(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("CELL") == 0) {
		deleteSymmetry();
		getSymInfo();
		for ( var i = 0; i < 2; i++)
			setUnitCell();
	}
}

function superCellParams(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("SUPERCELL") == 0)
		setUnitCell();
}

var kindCoord;
var measureCoord = false;
function viewCoord(value) {
	kindCoord = value;
	measureCoord = true;
	setV("select *; label off");
	messageMsg("Pick the atom your interested, please.");
	setV('set defaultDistanceLabel "%10.7VALUE %UNITS"');
	setV('showSelections TRUE; select none; set picking ON;set picking LABEL; set picking SELECT atom; halos on; set LABEL on; set PickCallback "showCoord"');
}

function showCoord(a, b, c, d, e, f) {
	// setMeasureText(b);
	if (measureCoord) {
		if (kindCoord == "fractional") {
			setV('Label "%a: %.2[fX] %.2[fY] %.2[fZ]"');
		} else {
			setV('Label "%a: %1.2[atomX] %1.2[atomY] %1.2[atomZ]"');
		}
	}
}
////////////END CELL and MOTION FUNCTIONS

////////////////////BUILD FUNCTIONS

function addAtomfrac() {
	var value = checkBoxX("addNewFrac");
	if (value == "on") {
		messageMsg("Enter the three fractional positions of the atom you would like to add. \n ADVICE: use the functions view fractional/Cartesian coordinates of of neighbor atom/s. ");
		makeEnable("x_frac");
		makeEnable("y_frac");
		makeEnable("z_frac");
		makeEnable("addNewFracList");
		makeEnable("addNewFracListBut");
	} else {
		makeDisable("x_frac");
		makeDisable("y_frac");
		makeDisable("z_frac");
		makeDisable("addNewFracList");
		makeDisable("addNewFracListBut");
	}
}

function addNewatom() {
	var type = getValue("addNewFracList");
	var x, y, z;
	x = parseFloat(getValue("x_frac"));
	y = parseFloat(getValue("y_frac"));
	z = parseFloat(getValue("z_frac"));

	if (x == null || y == null || z == null) {
		errorMsg("You didn't properly set the coordinate");
		return false;
	} else {

		var question = confirm("Would you like to add the atom to the current structure (OK) or create a new structure (Cancel)?");
		if (!question) {
			// setV('var mol = \"' + atomString + ' \" ;');
			messageMsg("Your coordinate will be treated as Cartesian.")
			var atomString = "1\n\n" + type + " " + parseFloat(x) + " "
			+ parseFloat(y) + " " + parseFloat(z);
			setV('set appendNew TRUE; DATA "model"' + atomString
					+ ' end "model"');
		} else {
			var fractional = confirm("Are these coordinates fractionals (OK) or Cartesians (Cancel)?");
			getUnitcell(frameValue);
			setUnitCell();
			setV('var noatoms =' + selectedFrame + '.length  + 1;');
			if (!fractional) {
				var atomString = "\n 1\n\n" + type + " " + parseFloat(x) + " "
				+ parseFloat(y) + " " + parseFloat(z);
				setV('set appendNew FALSE; DATA "append"' + atomString
						+ '\n end "append"');
			} else {
				setV("set appendNew FALSE;");
				var script = "script inline @{'DATA \"append\"1\\n\\n TE ' + format('%12.3p',{X,Y,Z}.xyz) +'\\nend \"append\" '}"
					setV(script.replace(/X/, parseFloat(x)).replace(/Y/,
							parseFloat(y)).replace(/Z/, parseFloat(z)).replace(
									/TE/, type));
			}
			// alert(atomString)

		}
		setVbyID("x_frac", "");
		setVbyID("y_frac", "");
		setVbyID("z_frac", "");
		getbyID("addAtomCrystal").style.display = "none";
	}
}

function addAtomZmatrix(form) {
	loadScriptZMatrix();
	selectElementZmatrix(form);
}

function loadScriptZMatrix() {

	// here we must check for crystal surface oo polymer because the routine
	// it's shlighthly different
	setV("function zAdd(type, dist, a, ang, b, tor, c) {\n"
			+ "var vbc = c.xyz - b.xyz\n" + "var vba = a.xyz - b.xyz\n"
			+ "var p = a.xyz - (vba/vba) * dist\n"
			+ 'var mol = "1 \n\n" + type + " " + p.x + " " + p.y + " " + p.z\n'
			+ "var p = a.xyz + cross(vbc, vba) \n" + "set appendNew FALSE \n"
			+ 'DATA "append" \\n\\n' + '+ mol + ' + '\\n end "append" \n'
			+ 'var newAtom = {*}[0]\n' + 'connect @a @newAtom\n'
			+ 'rotate Selected molecular @a @p @ang @newAtom \n'
			+ 'rotate Selected molecular @b @a @tor @newAtom \n' + '}');
}

var counterClicZ = 0;
function selectElementZmatrix(form) {

	if (form.checked) {
		counterClicZ = 0;
		for ( var i = 0; i < 3; i++) {

			if (i == 0) {
				messageMsg("This procedure allows the user to introduce a new atom (or more), \n just by knowing its relationship with its neighbour atoms.")
				messageMsg("Select the 1st atom where to attach the new atom.");
			}

			if (counterClicZ == 1) {
				messageMsg("Select the 2nd atom to form the angle.");
			} else if (counterClicZ == 2) {
				messageMsg("Select the 3rd atom to form the torsional angle.");
			}
			setV("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; set PickCallback 'pickZmatrixCallback'");
		}
	}
}

var distanceZ, angleZ, torsionalZ
var arrayAtomZ = new Array(3);
function pickZmatrixCallback(a, b, c, d, e) {
	if (counterClicZ == 0) { // distance
		var valuedist = prompt(
				"Now enter the distance (in \305) from which you want to add the new atom. \n Seletion is done by symply clikking ont the desire atom",
		"1.0");
		distanceZ = parseFloat(valuedist);
		arrayAtomZ[0] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));

	}
	if (counterClicZ == 1) { // angle

		var valueangle = prompt(
				"Now the enter the angle (in degrees) formed between the new atom, the 1st and the 2nd ones. \n Seletion is done by symply clikking ont the desire atoms",
		"109.7");
		angleZ = parseFloat(valueangle);
		arrayAtomZ[1] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));

	}
	if (counterClicZ == 2) {// torsional

		var valuetorsion = prompt(
				"Enter the torsional angle(in degrees) formed between the new atom, the 1st, the 2nd and the 3rd ones. \n Seletion is done by symply clikking ont the desire atoms",
		"180.0");
		torsionalZ = parseFloat(valuetorsion);
		setV("set messageCallback 'elementZcallback'; message ELEMENTZ;")
		arrayAtomZ[2] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));
	}
	counterClicZ++;
}

function elementZcallback(a, m) {
	m = "" + m;
	// important to do this to change from Java string to JavaScript string
	if (m.indexOf("ELEMENTZ") == 0) {
		messageMsg("distance: " + distanceZ + " from atom " + arrayAtomZ[0]
		+ " angle: " + angleZ + " formed by atoms: new, "
		+ arrayAtomZ[0] + ", " + arrayAtomZ[1] + "\n and torsional: "
		+ torsionalZ + " formed by atoms: new, " + arrayAtomZ[0] + ", "
		+ arrayAtomZ[1] + ", " + arrayAtomZ[2])
		messageMsg("Now, select the desire element.");
	}
}

function addZatoms() {
	setV('zAdd(\"' + getValue('addEleZ') + '\",' + distanceZ + ',{'
			+ arrayAtomZ[0] + '}, ' + angleZ + ', {' + arrayAtomZ[1] + '},'
			+ torsionalZ + ', {' + arrayAtomZ[2] + '})')
}

function createCrystalStr(form) {
	if (form.checked) {
		makeDisable("periodMole");
		// messageMsg("Do you want to create a Crystal?");

	} else {

	}
}

var makeCrystalSpaceGroup = null;
function checkIfThreeD(value) {
	makeEnablePeriodicityMol()
	if (value == "crystal") {

		makeEnable("periodMole");
		setVbyID("a_frac", "");
		setVbyID("b_frac", "");
		setVbyID("c_frac", "");
	} else if (value == "slab") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setVbyID("a_frac", "");
		setVbyID("b_frac", "");
		setVbyID("c_frac", "0");
		makeDisable("c_frac");
		setVbyID("alpha_frac", "");
		setVbyID("beta_frac", "");
		setVbyID("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "polymer") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setVbyID("a_frac", "");
		setVbyID("b_frac", "0");
		makeDisable("b_frac");
		setVbyID("c_frac", "0");
		makeDisable("c_frac");
		setVbyID("alpha_frac", "90");
		makeDisable("alpha_frac");
		setVbyID("beta_frac", "90");
		makeDisable("beta_frac");
		setVbyID("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "") {
		setVbyID("a_frac", "");
		makeDisable("a_frac");
		setVbyID("b_frac", "");
		makeDisable("b_frac");
		setVbyID("c_frac", "");
		makeDisable("c_frac");
		setVbyID("alpha_frac", "");
		makeDisable("alpha_frac");
		setVbyID("beta_frac", "");
		makeDisable("beta_frac");
		setVbyID("gamma_frac", "");
		makeDisable("gamma_frac");
	}
}

function setCellParamSpaceGroup(spaceGroup) {
	// /from crystal manual http://www.crystal.unito.it/Manuals/crystal09.pdf
	var trimSpaceGroup = null;

	if (spaceGroup.search(/:/) == -1) {
		if (spaceGroup.search(/\*/) == -1) {
			trimSpaceGroup = spaceGroup;
		} else {
			trimSpaceGroup = spaceGroup.substring(0, spaceGroup.indexOf('*'));
		}
	} else {
		trimSpaceGroup = spaceGroup.substring(0, spaceGroup.indexOf(':'));
	}
	switch (true) {

	case ((trimSpaceGroup <= 2)): // Triclinic lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "");
	setVbyID("beta_frac", "");
	setVbyID("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 2) && (trimSpaceGroup <= 15)): // Monoclinic
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "");
	setVbyID("beta_frac", "90.000");
	setVbyID("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");
	break;

	case ((trimSpaceGroup > 15) && (trimSpaceGroup <= 74)): // Orthorhombic
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "90.000");
	setVbyID("beta_frac", "90.000");
	setVbyID("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 74) && (trimSpaceGroup <= 142)): // Tetragonal
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "90.000");
	setVbyID("beta_frac", "90.000");
	setVbyID("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 142) && (trimSpaceGroup <= 167)): // Trigonal
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "");
	setVbyID("beta_frac", "");
	setVbyID("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 167) && (trimSpaceGroup <= 194)): // Hexagonal
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "90.000");
	setVbyID("beta_frac", "90.000");
	setVbyID("gamma_frac", "120.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDiable("beta_frac");
	makeDisable("gamma_frac");

	break;
	case ((trimSpaceGroup > 194) && (trimSpaceGroup <= 230)): // Cubic
		// lattices
		setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "90.000");
	setVbyID("beta_frac", "90.000");
	setVbyID("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");
	break;

	default:
		errorMsg("SpaceGroup not found in range.");
	return false;
	break;

	}// end switch
}

function createMolecularCrystal() {
	var value = getValue('typeMole')
	if (value == "") {
		errorMsg("You must select which sort of structure you would like to build.")
	} else if (value == "crystal") {
		makeCrystalSpaceGroup = getValue('periodMole');
		getValueMakeCrystal();
	} else {
		getValueMakeCrystal();
	}
}

///TODO SAVE state before creating crystal
function getValueMakeCrystal() {
	setV('load \'\' {1 1 1} spacegroup "' + makeCrystalSpaceGroup
			+ '" unitcell [ ' + parseFloat(getValue('a_frac')) + ' '
			+ parseFloat(getValue('b_frac')) + ' '
			+ parseFloat(getValue('c_frac')) + ' '
			+ parseFloat(getValue('alpha_frac')) + ' '
			+ parseFloat(getValue('beta_frac')) + ' '
			+ parseFloat(getValue('gamma_frac')) + ' ];unitcell ');
	messageMsg("Now save you structure and reaload it!");
	getbyID("createmolecularCrystal").style.display = "none";
	// setV("write COORDS SPT ?.spt; set defaultdirectory");
	// setV("load ?");
}

function makeEnablePeriodicityMol() {
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");
	setVbyID("a_frac", "");
	setVbyID("b_frac", "");
	setVbyID("c_frac", "");
	setVbyID("alpha_frac", "");
	setVbyID("beta_frac", "");
	setVbyID("gamma_frac", "");
}

function cleanCreateCrystal() {
	setVbyID("a_frac", "");
	makeDisable("a_frac");
	setVbyID("b_frac", "");
	makeDisable("b_frac");
	setVbyID("c_frac", "");
	makeDisable("c_frac");
	setVbyID("alpha_frac", "");
	makeDisable("alpha_frac");
	setVbyID("beta_frac", "");
	makeDisable("beta_frac");
	setVbyID("gamma_frac", "");
	makeDisable("gamma_frac");
	document.builGroup.reset();
}
///////////////////END BUILD FUNCTIONS

/////////
////////////////////FUNCTIONS TO DEAL WITH SELECTION
/////////
var atomColor = "";
var deleteMode = "";
var hideMode = "";
var displayMode = "";
function elementSelected(element) {
	// updateListElement();
	setV("select all; halo off; label off");
	setV("select " + element + "; halo on; label on; ");
	atomColor = "color atom ";
	return atomColor;
}

function elementSelectedDelete(element) {
	setV("select all; halo off; label off");
	setV("select " + element + "; halo on; label on");
	deleteMode = "delete " + element;
	return deleteMode;
}

function elementSelectedHide(element) {
	setV("select all; halo off; label off");
	setV("select " + element + "; halo on; label on");
	hideMode = "hide " + element;
	return hideMode;
}

function elementSelectedDisplay(element) {
	// updateListAtomApp();
	setV("select all; halo off; label off");
	setV("select " + element + "; halo on; label on");
	displayMode = "display " + element;
	return displayMode;
}

function atomSelected(atom) {
	// updateListAtomApp();
	setV("select all; halo off; label off");
	setV("select {atomno=" + atom + "}; halo on; label on");
	atomColor = "color atom ";
	return atomColor;
}

function atomSelectedDelete(atom) {
	setV("select all; halo off; label off");
	setV("select {atomno=" + atom + "}; halo on; label on");
	deleteMode = "delete {atomno=" + atom + "}";
	return deleteMode;
}

function atomSelectedHide(atom) {
	setV("select all; halo off; label off");
	setV("select {atomno=" + atom + "}; halo on; label on");
	hideMode = "hide {atomno=" + atom + "}";
	return hideMode;
}

function atomSelectedDisplay(atom) {
	setV("select all; halo off; label off");
	setV("select {atomno=" + atom + "}; halo on; label on");
	displayMode = "display {atomno=" + atom + "}";
	return displayMode;
}

function setPicking(form) {
	if (form.checked == true) {
		setV('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom;halos on; ');
		atomColor = "color atom";
	}
	if (form.checked == false)
		setV('select none;');
	return atomColor;
}

function setPickingDelete(form) {
	setV('select none; halos off;');
	setV("draw off; showSelections TRUE; select none; set picking off;");
	setV('set PickCallback OFF');
	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			setV('set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		} else {
			setV('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;');
			deleteMode = "delete selected";
		}
	}
	if (!form.checked)
		setV('select none; halos off; label off;');
	return deleteMode;
}

function setPickingHide(form) {
	setV('select none; halos off;');
	setV("draw off; showSelections TRUE; select none; set picking off;");
	setV('set PickCallback OFF');

	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			setV('showSelections TRUE; set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		} else {
			setV('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		}
		hideMode = " hide selected";
	} else {
		setV('select none; halos off; label off;');
	}
	return hideMode;
}

/*
 * display within(0,plane,@{plane({atomno=3}, {0 0 0}, {0 1/2 1/2})})
 * 
 * The parametric equation ax + by + cz + d = 0 is expressed as {a b c d}.
 * 
 * Planes based on draw and isosurface objects are first defined with an ID
 * indicated, for example:
 * 
 * draw plane1 (atomno=1) (atomno=2) (atomno=3)
 * 
 * After that, the reference $plane1 can be used anywhere a plane expression is
 * required. For instance,
 * 
 * select within(0,plane, $plane1)
 */

var counterClick = false;
var counterHide = 0;
var selectedatomPlane = new Array(3);
var sortquestion = null
function setPlanehide(form) {
	if (form == null)
		sortquestion = true;

	if (form.checked) {
		messageMsg('Now select in sequence 3 atoms to define the plane.');
		selectedatomPlane = [];
		counterHide = 0;
		counterClick = true;
		for ( var i = 0; i < 3; i++) {
			setV("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; set PickCallback 'pickPlanecallback'");
		}

		if (form != null)
			uncheckBox(form);

	} else {
		setV('select none; halos off;');
		setV("draw off; showSelections TRUE; select none; set picking off;");
		setV("set picking OFF");
	}
}

function setPlanedued(form) {
	if (form == null)
		sortquestion = true;

	messageMsg('Now select in sequence 3 atoms to define the plane.');
	selectedatomPlane = [];
	counterHide = 0;
	counterClick = true;
	for ( var i = 0; i < 3; i++)
		setV("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; set PickCallback 'pickPlane2dcallback'");

}

function pickPlane2dcallback(a, b, c, d, e) {
	if (counterClick == true) {
		selectedatomPlane[counterHide] = parseInt(b.substring(
				b.indexOf('#') + 1, b.indexOf('.') - 2));
		messageMsg('Atom selected: ' + selectedatomPlane[counterHide] + '.');

		if (counterHide == '2') {
			counterClick = false;
			setV('draw on; draw plane1 (atomno=' + selectedatomPlane[0]
			+ ') (atomno=' + selectedatomPlane[1] + ') (atomno='
			+ selectedatomPlane[2] + ');');
			// setV('select none; halos off;');
			// setV("draw off; showSelections TRUE; select none; set picking
			// off;");
			setV("set picking OFF");
			var spin = confirm("Now would you only like to slice the density? OK for yes, Cancel if you wish to map SPIN or potential on top.")
			if (spin) {
				dueD_con = true;
				dueD_planeMiller = false;
				setV('isosurface ID "isosurface1" select ({0:47}) PLANE $plane1 MAP color range 0.0 2.0 ?.CUBE');
			} else {
				messageMsg("Now load the *.CUBE potential / spin file.");
				setV("isosurface PLANE $plane1 MAP ?.CUBE;");
			}
			setV("draw off;");
			return true;
		}

		messageMsg('Select next atom.');
		counterHide++;
	}
}

function pickPlanecallback(a, b, c, d, e) {
	if (counterClick == true) {
		selectedatomPlane[counterHide] = parseInt(b.substring(
				b.indexOf('#') + 1, b.indexOf('.') - 2));
		messageMsg('Atom selected: ' + selectedatomPlane[counterHide] + '.');

		if (counterHide == '2') {
			counterClick = false;
			setV('draw on; draw plane1 (atomno=' + selectedatomPlane[0]
			+ ') (atomno=' + selectedatomPlane[1] + ') (atomno='
			+ selectedatomPlane[2] + ');');
			if (!sortquestion) {
				var distance = prompt('Now enter the distance (in \305) within you want to select atoms. \n Positive values mean from the upper face on, negative ones the opposite.');
				if (distance != null && distance != "") {
					setV('select within(' + distance + ',plane, $plane1)');
					hideMode = " hide selected";
					deleteMode = " delete selected";
					atomColor = "color atoms";
					setV('set PickCallback OFF');
					counterClick = false;
					return true;
				}
			}
			setV('select none; halos off;');
			setV("draw off; showSelections TRUE; select none; set picking off;");
			setV("set picking OFF");
		}

		messageMsg('Select next atom.');
		counterHide++;
	}
}

var selectHideForm = null;
function setDistancehidehide(form) {
	selectHideForm = form;
	if (form.checked) {
		messageMsg('Now select the central atom around which you want to select atoms.');
		counterClick = true;
		setV("showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; set PickCallback 'pickDistancecallback'");
		// messageMsg('If you don\'t want to remove/hide atoms in the plane,
		// unselect them by using the option: select by picking.')
	} else {
		setV('select none; halos off;');
	}
}

function pickDistancecallback(a, b, c, d, e) {
	if (counterClick == true) {
		var coordinate = b
		.substring(b.indexOf('#') + 2, b.lastIndexOf('.') + 9);
		messageMsg('Atom selected: ' + coordinate + '.');
		var distance = prompt('Now enter the distance (in \305) within you want to select atoms.');
		if (distance != null && distance != "") {
			setV('select within(' + distance + ',{' + coordinate
					+ ' }); draw sphere1 width ' + distance + '  { '
					+ coordinate + '} translucent');
			// messageMsg('If you don\'t want to remove/hide the atom used for
			// the
			// selection, unselect it by using the option: select by picking.')
			hideMode = " hide selected";
			deleteMode = " delete selected";
			atomColor = "color atoms";
			setV("set PickCallback 'pickDistancecallback' OFF");
			counterClick = false;
			uncheckBox(selectHideForm);
			return true;
		}
	}

}

function selectAll() {
	setV("select *; halos on; label on;");
	atomColor = "draw off ;select *; color atom ";
	return atomColor;
}

function selectAllDelete() {
	setV("select *; halos on; label on;");
	deleteMode = "select *; delete; select none ; halos off; draw off;";
	return deleteMode;
}

function selectAllHide() {
	setV("select *; halos on; label on;");
	hideMode = "select *; hide selected; select none; halos off; draw off;";
	return hideMode;
}

function setTextSize(value) {
	setV("select *; font label " + value + " ;");
}

function setMeasureSize(value) {
	setV("select *; font label " + value + " ; font measure " + value + " ; select none;");
}


function unselAtom() {
	setV("select none; halos off; draw off;");
}
/////////////////////// END SELECTION FUNCTIONS

/////////////////
//////////////////////COLOR FUNCTION

function setAtomColor(rgbCodeStr, Colorscript) {
	var finalColor = " " + atomColor + " " + rgbCodeStr + " ";
	setV(finalColor);
	setV("draw off");
}

function setPolyColor(rgbCodeStr, Colorscript) {
	var stringa = "color polyhedra";
	var finalColor = " " + stringa + " " + rgbCodeStr + " ";
	setV(finalColor);
}

function setIsoColor(rgbCodeStr, Colorscript) {
	var stringa = "color isosurface";
	var finalColor = " " + stringa + " " + rgbCodeStr + " ";
	setV(finalColor);
}

//////////////////////END COLOR FUNCTION

/////////////////
////////////////////EXTERNAL WINDOWS

var windowoptions = "menubar=yes,resizable=1,scrollbars,alwaysRaised,width=600,height=600,left=50";
function newAppletWindow() {
	var sm = "" + Math.random();
	sm = sm.substring(2, 10);
	var newwin = open("OutputResized.html", "jmol_" + sm, windowoptions);
}

var windowfreq = "menubar=no,resizable=no,scrollbars=yes,resizable=yes;alwaysRaised,width=1024,height=768";
function newAppletWindowFreq() {
	var sm = "" + Math.random();
	sm = sm.substring(2, 10);
	var newwin = open("exportfreq.html", sm, windowfreq);
}

function onClickAcknow() {
	var woption = "menubar=no, toolbar=no scrollbar=no, status=no, resizable=no, alwaysRaised,width=360, height=200, top=10, left=10,";
	var sm = "" + Math.random();
	sm = sm.substring(2, 10);
	var newwin = open("acn.html", sm, woption);
}

var windowfeed = "menubar=no,resizable=no,scrollbars=yes,resizable=yes;alwaysRaised,width=1024,height=768";
function newAppletWindowFeed() {
	var sm = "" + Math.random();
	sm = sm.substring(2, 10);
	var newwin = open("http://j-ice.sourceforge.net/?page_id=9", sm, windowfeed);
}
//////////////////////////////////////END EXTERNAL WINOWS

///////////////// RESET FUNCTIONS
/////////////////

function resetAll() {

	setTextboxValue("filename", "Filename:");
	setUnitCell();
	document.fileGroup.reset();
	document.apparenceGroup.reset();
	document.orientGroup.reset();
	document.measureGroup.reset();
	document.cellGroup.reset();
	document.polyGroup.reset();
	document.isoGroup.reset();
	document.modelsGeom.reset();
	document.modelsVib.reset();
	document.elecGroup.reset();
	document.otherpropGroup.reset();
	document.editGroup.reset();
	// document.HistoryGroup.reset();
	// this disables antialias option BH: NOT - or at least not generally. We need a switch for this
	setV('antialiasDisplay = true;set hermiteLevel 0');
	resetFreq();
}

function exitIsosurface() {
	setV('isosurface delete all');
}

function exitFreqGroup() {
	setV('vibration off; vectors FALSE');
}

function exitMenu() {
	setV('label off; select off');
}

function exitElecpropGrp() {
	setV('script scripts/reload.spt');
	restoreOrientation_e();
}

//These remove all values from a list
function removeAll() {
	cleanList("geom");
	cleanList("vib");
	cleanList("colourbyElementList");
	// cleanList("colourbyAtomList");
	cleanList("polybyElementList");
	cleanList("poly2byElementList");
	setVbyID("fineOrientMagn", "5");
}

function unLoadall() {

	setV('select visible; wireframe 0.15; spacefill 20% ;cartoon off; backbone off;');
	radiiSlider.setValue(20);
	bondSlider.setValue(15);
	// radiiConnect.setValue(20);
	getbyID('radiiMsg').innerHTML = 20 + "%";
	getbyID('bondMsg').innerHTML = 0.15 + " &#197";

	/*
	 * getbyID('globalAtomicRadii').innerHTML = 20 ;
	 * getbyID('sliderGlobalAtomicRadii').style.left=20+'px';
	 * getbyID('globalBondWidths').innerHTML = 0.20;
	 * getbyID('sliderGlobalBondWidths').style.left=20+'px';
	 * getbyID('sepcLight').innerHTML = 22 + " % ";
	 * getbyID('sliderSepcLight').style.left=20+'px';
	 * getbyID('Ambient').innerHTML = 45 + " % ";
	 * getbyID('sliderAmbient').style.left=45+'px'; getbyID('Diffuse').innerHTML =
	 * 45 + " % "; getbyID('sliderDiffuse').style.left=45+'px';
	 * getbyID('sliderPerspective').style.left= 66+'px';
	 * getbyID('sliderGlobalBond').style.left= 20 + 'px';
	 * getbyID('globalBondCon').innerHTML = 2 + " ";
	 */

	// getbyID("packrange").innerHTML = 0 + " &#197"
	// getbyID('Perspective').innerHTML = 3;
}

//////////////////////////////////////END RESET FUNCTIONS

function preselectMyItem(itemToSelect) {
	// Get a reference to the drop-down
	var myDropdownList = document.modelsGeom.models;

	// Loop through all the items
	for (iLoop = 0; iLoop < myDropdownList.options.length; iLoop++) {
		if (myDropdownList.options[iLoop].value == itemToSelect) {
			// Item is found. Set its selected property, and exit the loop
			myDropdownList.options[iLoop].selected = true;
			break;
		}
	}

}

//////////////////////These functions set the values on the two scrollbars

function onClickCPK() {
	getbyID('radiiMsg').innerHTML = "100%";
	getbyID('bondMsg').innerHTML = 0.3 + " &#197";
	radiiSlider.setValue(100);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.30; spacefill 100% ;cartoon off;backbone off; draw off");
}

function onClickWire() {

	getbyID('radiiMsg').innerHTML = parseFloat(0).toPrecision(2) + " %";
	getbyID('bondMsg').innerHTML = 0.01 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(1);
	runJmolScript('wireframe 0.01; spacefill 1%;ellipsoids off;cartoon off;backbone off;');
}

function onClickionic() {

	getbyID('radiiMsg').innerHTML = parseFloat(0).toPrecision(2) + " %";
	// getbyID('sliderGlobalAtomicRadii').style.left=0+'px';
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	// getbyID('sliderGlobalBondWidths').style.left= 30+'px';
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("spacefill IONIC; wireframe 0.15; draw off");
}

function onStickClick() {

	getbyID('radiiMsg').innerHTML = "1%";
	// getbyID('sliderGlobalAtomicRadii').style.left=0+'px';
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	// /getbyID('sliderGlobalBondWidths').style.left=30+'px';
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.15;spacefill 1%;cartoon off;backbone off; draw off");
}

function onClickBS() {

	getbyID('radiiMsg').innerHTML = "20%";
	// getbyID('sliderGlobalAtomicRadii').style.left=20+'px';
	getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	// getbyID('sliderGlobalBondWidths').style.left=20+'px';
	radiiSlider.setValue(20);
	bondSlider.setValue(20);
	runJmolScript("wireframe 0.15; spacefill 20%;cartoon off;backbone off; draw off");

}

function onClickBall() {

	getbyID('radiiMsg').innerHTML = "20%";
	// getbyID('sliderGlobalAtomicRadii').style.left=20+'px';
	getbyID('bondMsg').innerHTML = 0.00 + " &#197";
	// getbyID('sliderGlobalBondWidths').style.left=0+'px';
	radiiSlider.setValue(20);
	bondSlider.setValue(0);
	runJmolScript("select *; spacefill 20%; wireframe off ; draw off");
}

function initPerspective() {
	persSlider.setValue(35);
	getbyID('perspMsg').innerHTML = "1.4";
	getbyID('perspMsg').innerHTML = "1.4";
}

function printFileContent() {
	runJmolScript("console; getProperty fileContents;");
}
