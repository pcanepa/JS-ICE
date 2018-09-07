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

function getbyName(na) {
	return document.getElementsByName(na);
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
	runJmolScriptWait("save ORIENTATION orienta; save STATE status;");
	reloadFastModels();
	restoreState();
}

function saveStatejust() {
	runJmolScriptWait("save ORIENTATION orienta; save STATE status;");
}

function loadStatejust() {
	runJmolScriptWait("restore ORIENTATION orienta; restore STATE status;");
}

//This function reloads the previously saved state after a positive
function restoreState() {
	runJmolScriptWait('restore ORIENTATION orienta; restore STATE status;');
	// BH 2018 note: we might need runJomlScript here -- it will block while loading
}

//This just saves the orientation of the structure
function saveOrientation_e() {
	runJmolScriptWait("save ORIENTATION oriente;");
}

function restoreOrientation_e() {
	runJmolScriptWait('restore ORIENTATION oriente');
}

function setNameModel(form) {
	if (form.checked == true)
		var stringa = "frame title";
	if (form.checked == false)
		var stringa = "frame title ''";
	runJmolScriptWait(stringa);
}

function setTitleEcho() {
	var titleFile = "";
	titleFile = extractInfoJmolString("fileHeader");
	runJmolScriptWait('set echo top right; echo "' + titleFile + ' ";');
}

function saveCurrentState() {
	warningMsg("This option only the state temporarily. To save your work, use File...Export...image+state(PNGJ). The image created can be dragged back into Jmol or JSmol or sent to a colleague to reproduce the current state exactly as it appears in the image.");
	runJmolScriptWait('save ORIENTATION orask; save STATE stask; save BOND bask');
}

function reloadCurrentState() {
	runJmolScriptWait('restore ORIENTATION orask; restore STATE stask; restore BOND bask;');
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


var quantumEspresso = false;
function onChangeSave(save) {
	// see menu.js

	if (save == "savePNG")
		setV('write PNG "jice.png"');
	if (save == "savePNGJ")
		setV('write PNGJ "jice.png"');
	if (save == "saveXYZ")
		setV('write COORDS XYZ jice.xyz');
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
		setV('write POVRAY jice.pov');
	if (save == "savepdb")
		setV('write PDB jice.pdb');
	if (save == "saveVASP") {
		// magnetic = false;
		flagCryVasp = false;
		exportVASP();
	}
	if (save == "saveState")
		setV('write STATE jice.spt');
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
	var script = '{selected}.element = "' + value + '";'
	+'{selected}.ionic = "' + value + '";'
	+'label "%e";font label 16;draw off';
	runJmolScriptWait(script);
	var flag = false;
	setV("echo");
	updateListElement();
}

function saveFrame() {
	messageMsg("This is to save frame by frame your geometry optimization.");
	var value = checkBoxX("saveFrames");
	if (value == "on")
		setV('write frames {*} "fileName.jpg"');
}

/////////// CELL FUNCTIONS



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
		setValue("x_frac", "");
		setValue("y_frac", "");
		setValue("z_frac", "");
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
			setPickingCallbackFunction(pickZmatrixCallback)
			runJmolScriptWait("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;");
		}
	}
}

var distanceZ, angleZ, torsionalZ
var arrayAtomZ = new Array(3);
function pickZmatrixCallback(b, c, d, e) {
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
		arrayAtomZ[2] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));
		messageMsg("distance: " + distanceZ + " from atom " + arrayAtomZ[0]
		+ " angle: " + angleZ + " formed by atoms: new, "
		+ arrayAtomZ[0] + ", " + arrayAtomZ[1] + "\n and torsional: "
		+ torsionalZ + " formed by atoms: new, " + arrayAtomZ[0] + ", "
		+ arrayAtomZ[1] + ", " + arrayAtomZ[2])
		messageMsg("Now, select the desire element.");
	}
	counterClicZ++;
}

function addZatoms() {
	runJmolScriptWait('zAdd(\"' + getValue('addEleZ') + '\",' + distanceZ + ',{'
			+ arrayAtomZ[0] + '}, ' + angleZ + ', {' + arrayAtomZ[1] + '},'
			+ torsionalZ + ', {' + arrayAtomZ[2] + '})')
}

function createCrystalStr(form) {
	if (form.checked) {
		makeDisable("periodMole");
	} else {

	}
}

var makeCrystalSpaceGroup = null;
function checkIfThreeD(value) {
	makeEnablePeriodicityMol()
	if (value == "crystal") {

		makeEnable("periodMole");
		setValue("a_frac", "");
		setValue("b_frac", "");
		setValue("c_frac", "");
	} else if (value == "slab") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setValue("a_frac", "");
		setValue("b_frac", "");
		setValue("c_frac", "0");
		makeDisable("c_frac");
		setValue("alpha_frac", "");
		setValue("beta_frac", "");
		setValue("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "polymer") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setValue("a_frac", "");
		setValue("b_frac", "0");
		makeDisable("b_frac");
		setValue("c_frac", "0");
		makeDisable("c_frac");
		setValue("alpha_frac", "90");
		makeDisable("alpha_frac");
		setValue("beta_frac", "90");
		makeDisable("beta_frac");
		setValue("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "") {
		setValue("a_frac", "");
		makeDisable("a_frac");
		setValue("b_frac", "");
		makeDisable("b_frac");
		setValue("c_frac", "");
		makeDisable("c_frac");
		setValue("alpha_frac", "");
		makeDisable("alpha_frac");
		setValue("beta_frac", "");
		makeDisable("beta_frac");
		setValue("gamma_frac", "");
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
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 2) && (trimSpaceGroup <= 15)): // Monoclinic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");
	break;

	case ((trimSpaceGroup > 15) && (trimSpaceGroup <= 74)): // Orthorhombic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 74) && (trimSpaceGroup <= 142)): // Tetragonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 142) && (trimSpaceGroup <= 167)): // Trigonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 167) && (trimSpaceGroup <= 194)): // Hexagonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "120.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;
	case ((trimSpaceGroup > 194) && (trimSpaceGroup <= 230)): // Cubic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
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
	reload('{1 1 1} spacegroup "' + makeCrystalSpaceGroup
			+ '" unitcell ' + getCurrentUnitCell() + ';');
	getbyID("createmolecularCrystal").style.display = "none";
}

function makeEnablePeriodicityMol() {
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");
	setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
}

function cleanCreateCrystal() {
	setValue("a_frac", "");
	makeDisable("a_frac");
	setValue("b_frac", "");
	makeDisable("b_frac");
	setValue("c_frac", "");
	makeDisable("c_frac");
	setValue("alpha_frac", "");
	makeDisable("alpha_frac");
	setValue("beta_frac", "");
	makeDisable("beta_frac");
	setValue("gamma_frac", "");
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
	selectElement(element);
	atomColor = "color atom ";
	return atomColor;
}

function elementSelectedDelete(element) {
	selectElement(element);
	deleteMode = "delete " + element;
	return deleteMode;
}

function elementSelectedHide(element) {
	selectElement(element);
	hideMode = "hide " + element;
	return hideMode;
}

function elementSelectedDisplay(element) {
	selectElement(element);
	displayMode = "display " + element;
	return displayMode;
}

function selectElement(element) {
	setV("select " + element + ";selectionhalos on");

}
function atomSelectedColor(atom) {
	setV("select {atomno=" + atom + "};");
	atomColor = "color atom ";
	return atomColor;
}

function atomSelectedDelete(atom) {
	setV("select {atomno=" + atom + "};");
	deleteMode = "delete {atomno=" + atom + "}";
	return deleteMode;
}

function atomSelectedHide(atom) {
	setV("select {atomno=" + atom + "};");
	hideMode = "hide {atomno=" + atom + "}";
	return hideMode;
}

function atomSelectedDisplay(atom) {
	setV("select all; halo off; label off");
	setV("select {atomno=" + atom + "}; halo on; label on");
	displayMode = "display {atomno=" + atom + "}";
	return displayMode;
}

function selectAll() {
	setV("select *;halos on;");
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

function setColorMulliken(value) {
	runJmolScript('set propertyColorScheme "' + value + '";load "" PACKED; select *;font label 18; frame last; color {*} property partialCharge; label %5.3P');
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

function setName() {
	setTextboxValue("filename", "Filename:");
	var name = jmolGetPropertyAsJSON("filename");
	name = "Filename: "
		+ name
		.substring(name.indexOf('\"') + 13,
				name.lastIndexOf('}') - 1);
	setTextboxValue("filename", name);
}

//These remove all values from a list
function removeAll() {
	cleanList("geom");
	cleanList("vib");
	cleanList("colourbyElementList");
	// cleanList("colourbyAtomList");
	cleanList("polybyElementList");
	cleanList("poly2byElementList");
	setValue("fineOrientMagn", "5");
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


function onWireClick() {
	runJmolScript("wireframe only;");
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
