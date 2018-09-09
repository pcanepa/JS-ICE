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

//BH: Deprecated -- Was asynchronous, causing all sorts of issues in JavaScript
//function setV(value) {
//	jmolScript(value);
//}

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
