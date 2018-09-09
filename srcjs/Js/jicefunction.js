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


/////////////////////////////////////////////////////////////////////////////
////////////////////////////////COMMON FUNCTIONS  
//Common functions to manipulate data of forms and objects

function getbyID(id) {
	return document.getElementById(id);
}

function getbyName(na) {
	return document.getElementsByName(na);
}

function unique(a) {
	//this function removes duplicates
	var r = [];
	var list = "";
	for (var i = 0, n = a.length; i < n; i++) {
		var item = a[i];
		var key = ";" + item + ";";
		if (list.indexOf(key) >= 0)
			continue;
		list += key;
		r.push(item);
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

function cleanList(listname) {
	var d = getbyID(listname)
	if (d)
		for (var i = d.options.length; --i >= 0;)
			d.remove(i);
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
	runJmolScriptWait(value);
}

function setVTrueFalse(form, value) {
	runJmolScriptWait(value + " " + !!form.checked);
}

function setVCheckbox(form, value) {
	if (form.checked == true)
		var stringa = value + " ON";
	if (form.checked == false)
		var stringa = value + " OFF";
	runJmolScriptWait(stringa);
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

////////////////////////////////END Jmol COMMON FUNCTIONS

/////////FUNCTION TO FILL LIST

////This is to select the atom by element

function fillElementlist() {
	var sortedElement = getElementList(["select"]);
	for (var i = 0; i < sortedElement.length; i++) {
		addOption(getbyID('colourbyElementList'), sortedElement[i],
				sortedElement[i]);
		addOption(getbyID('polybyElementList'), sortedElement[i],
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
	for (var i = (getbyID('colourbyElementList').options.length - 1); i >= 0; i--)
		getbyID('colourbyElementList').remove(i);
	for (var i = (getbyID('polybyElementList').options.length - 1); i >= 0; i--)
		getbyID('polybyElementList').remove(i);
	for (var i = (getbyID("poly2byElementList").options.length - 1); i >= 0; i--)
		getbyID("poly2byElementList").remove(i);
	for (var i = (getbyID("byElementAtomMotion").options.length - 1); i >= 0; i--)
		getbyID("byElementAtomMotion").remove(i);
	for (var i = (getbyID("deletebyElementList").options.length - 1); i >= 0; i--)
		getbyID("deletebyElementList").remove(i);
	for (var i = (getbyID("connectbyElementList").options.length - 1); i >= 0; i--)
		getbyID("connectbyElementList").remove(i);
	for (var i = (getbyID("connectbyElementListone").options.length - 1); i >= 0; i--)
		getbyID("connectbyElementListone").remove(i);
	fillElementlist();
}
///////////END LIST

////////////////LOAD And SAVE functions


var quantumEspresso = false;
function onChangeSave(save) {
	// see menu.js
	switch (save) {
	case "savePNG":
		runJmolScript('write PNG "jice.png"');
		break;
	case "savePNGJ":
		runJmoLScript('write PNGJ "jice.png"');
		break;
	case "saveXYZ":
		runJmoLScript('write COORDS XYZ jice.xyz');
		break;
	case "saveFrac":
		saveFractionalCoordinate();
		break;
	case "saveCRYSTAL":
		//flagCrystal = true;
		exportCRYSTAL();
		break;
	case "saveVASP":
		//flagCrystal = false;
		exportVASP();
		break;
	case "saveGROMACS":
		exportGromacs();
		break;
	case "saveCASTEP":
		exportCASTEP();
		break;
	case "saveQuantum":
		quantumEspresso = true;
		//flagCrystal = false;
		exportQuantum();
		break;
	case "savePOV":
		runJmoLScript('write POVRAY jice.pov');
		break;
	case "savepdb":
		runJmoLScript('write PDB jice.pdb');
		break;
	case "saveState":
		runJmoLScript('write STATE jice.spt');
		break;
	case "saveGULP":
		flagGulp = true;
		flagCrystal = false;
		exportGULP();
		break;
	case "savefreqHtml":
		newAppletWindowFreq();
		break;
	}
	document.fileGroup.reset();
}

/////////////// END OPEN AND SAVE FUNCTIONS


var colorWhat = "";

function elementSelected(element) {
	selectElement(element);
	colorWhat = "color atom ";
	return colorWhat;
}

function selectAll() {
	runJmolScriptWait("select *;halos on;");
}

function selectAllHide() {
	runJmolScriptWait("select *; halos on; label on;");
	hideMode = "select *; hide selected; select none; halos off; draw off;";
	return hideMode;
}

function setTextSize(value) {
	runJmolScriptWait("select *; font label " + value + " ;");
}

function setMeasureSize(value) {
	runJmolScriptWait("select *; font label " + value + " ; font measure " + value + " ; select none;");
}


function unselAtom() {
	runJmolScriptWait("select none; halos off; draw off;");
}

/////////////////////// END SELECTION FUNCTIONS

/////////////////
//////////////////////COLOR FUNCTION

function setColorMulliken(value) {
	runJmolScript('set propertyColorScheme "' + value + '";load "" PACKED; select *;font label 18; frame last; color {*} property partialCharge; label %5.3P');
}

//////////////////////END COLOR FUNCTION

/////////////////
////////////////////EXTERNAL WINDOWS

//////////////////////////////////////END EXTERNAL WINDOWS

///////////////// RESET FUNCTIONS
/////////////////

function setName() {
	setTextboxValue("filename", "Filename:");
	var name = jmolGetPropertyAsJSON("filename");
	name = "Filename: "
		+ name
		.substring(name.indexOf('\"') + 13,
				name.lastIndexOf('}') - 1);
	setTextboxValue("filename", name);
}

//////////////////////////////////////END RESET FUNCTIONS

//////////////////////These functions set the values on the two scrollbars

function printFileContent() {
	runJmolScript("console; getProperty fileContents;");
}
