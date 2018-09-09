/*  J-ICE library 

 based on:
 *
 * Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 * ** Contact: pierocanepa@sourceforge.net
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

//tabmenus.js includes older tabs.js and menu.js
//last modified 16th Mar 2011 
///////////////////////////////// menu object definition
function Menu(name, grp, link) {
	this.name = name;
	this.grp = grp;
	this.link = link;
}

var tabMenu = [];

function addTab(name, group, link) {
	tabMenu.push(new Menu(name, group, link));
}

MENU_FILE     = 0;
MENU_CELL     = 1;
MENU_SHOW     = 2;
MENU_EDIT     = 3;
MENU_MEASURE  = 4;
MENU_ORIENT   = 5;
MENU_POLY     = 6;
MENU_SURFACE  = 7;
MENU_OPTIMIZE = 8;
MENU_SPECTRA  = 9;
MENU_EM       =10;
MENU_OTHER    =11;

//Common variables
function defineMenu() {
	addTab("File", "fileGroup", "Import, Export files.");
	addTab("Cell", "cellGroup", "Modify cell features and symmetry.");
	addTab("Show", "showGroup",
	"Change atom, bond colours, and dimensions.");
	addTab("Edit", "editGroup", "Change connectivity and remove atoms.");
	//addTab("Build", "builGroup", "Modify and optimize structure.");
	addTab("Measure", "measureGroup",
	"Measure bond distances, angles, and torsionals.");
	addTab("Orient", "orientGroup", "Change orientation and views.");
	addTab("Poly", "polyGroup", "Create polyhedra.");
	addTab("Surf.", "isoGroup", "Modify and create isosurface maps.");
	addTab("Optimize", "geometryGroup", "Geometry optimizations.");
	addTab("Spectra", "freqGroup", "IR/Raman frequencies and spectra.");
	addTab("E&M", "elecGroup", "Mulliken charges, spin, and magnetic moments.");
	addTab("Other", "otherpropGroup",
	"Change background, light settings and other.");
}

var tabTimeouts = [];
var tabDelayMS = 1000;

var TAB_OVER  = 0;
var TAB_CLICK = 1;
var TAB_OUT   = 2;

function grpDisp(n) {
	grpDispDelayed(n, TAB_CLICK);
}

var grpDispDelayed = function(n, mode) {
	for (var i = tabTimeouts.length; --i >= 0;) {
		if (tabTimeouts[i])
			clearTimeout(tabTimeouts[i]);
		tabTimeouts = [];
	}	
	switch(mode) {
	case TAB_OVER:
		tabTimeouts[n] = setTimeout(function(){grpDispDelayed(n,1)},tabDelayMS);
		break;
	case TAB_CLICK:
		for (var i = 0; i < tabMenu.length; i++) {
			getbyID(tabMenu[i].grp).style.display = "none";
			tabMenu[i].disp = 0;
		}
		getbyID(tabMenu[n].grp).style.display = "inline";
		tabMenu[n].disp = 1;
		showMenu(n);
		break;
	case TAB_OUT:
		break;
	}
}

var arrayGeomObjects = new Array(
		"appletdiv", 
		"graphdiv", 
		"plottitle",
		"plotarea", 
		"appletdiv1", 
		"graphdiv1", 
		"plottitle1", 
		"plotarea1");
var arrayFreqObjects = new Array(
		"freqdiv", 
		"graphfreqdiv", 
		"plottitlefreq",
		"plotareafreq");

var hideArrays = function(menu) {
	for (var i = 0; i < arrayGeomObjects.length; i++)
		getbyID(arrayGeomObjects[i]).style.display = (menu == MENU_OPTIMIZE ? "block" : "none");
	for (var j = 0; j < arrayFreqObjects.length; j++)
		getbyID(arrayFreqObjects[j]).style.display = (menu == MENU_SPECTRA ? "block" : "none");
}

var enterTab = function() {
	updateListElement();
	hideArrays();
	exitIsosurface();
	exitFreqGroup();
	resetSymmetryView();
}

var showMenu = function(index) {
	resetviewTab();
	resetSymmetryView();
	switch (index) {
	case MENU_FILE:
		enterTab();
		break;
	case MENU_CELL:
		enterTab();
		getUnitcell(frameValue);
		getSymInfo();
		break;
	case MENU_SHOW:
		enterTab();
		enterShow();
		break;
	case MENU_EDIT:
		enterEdit();
		break;
	case MENU_MEASURE:
		enterTab();
		break;
	case MENU_ORIENT:
		//hideArrays();
		// exitIsosurface();
		//exitFreqGroup();
		break;
	case MENU_POLY:
		enterTab();
		break;
	case MENU_SURFACE:
		hideArrays();
		break;
	case MENU_OPTIMIZE:
		hideArrays(MENU_OPTIMIZE);
		exitIsosurface();
		exitFreqGroup();
		enterOptimize();
		plotEnergies();	
		// if(flagCrystal)
//		refresh();
		break;
	case MENU_SPECTRA:
		hideArrays(MENU_SPECTRA);
		exitIsosurface();
		enterSpectra();
//		refreshFreq();
		break;
//	case ???:
//		resetviewTab();
//		for (var i = 0; i < arrayGeomgrp.length; i++)
//			getbyID(arrayGeomgrp[i]).style.display = "none";
//		for (var j = 0; j < freqArrGr.length; j++)
//			getbyID(freqArrGr[j]).style.display = "none";
//		exitIsosurface();
//		exitFreqGroup();
//		resetSymmetryView();
//		break;
	case MENU_EM:
//		// / Mulliken and spin
//		hideArrays();
//		saveOrientation_e();
//		exitIsosurface();
//		exitFreqGroup();
//		resetSymmetryView();
		break;
	case MENU_OTHER:
		enterTab();
		setValuesOther();
		break;
	}

}

/////////////////////////////////////// Menu functions

//////////////LOADING MENUS

function getButtons() {
	return "<br>"
	+ createText('filename', '', 108, null, null, "textwhite", "disab")
	+ "<br>"
	+ createButton(
			"reload",
			"Reload",
			"onChangeLoad('reload')",
			null, "specialbutton")
			+ createButton("reset", "Reset",
					'resetPage()', null,
			"specialbutton")
			+ createButton("Console", "Console", 'runJmolScript("console")', null,
			"specialbutton")
			+ createButton("NewWindow", "New window", "newAppletWindow()")
			+ createButton("viewfile", "File content", "printFileContent()")
			+ createButton("saveState", 'Save state', 'saveCurrentState()',
					null, "savebutton")
					+ createButton("restoreState", 'Restore state',
							'reloadCurrentState()', null, "savebutton")
							+ createButton("Feedback", 'Feedback', 'newAppletWindowFeed()');
}

function createTabMenu() {
	var strMenu = "<ul class='menu' id='menu'>";
	for (var menuIndex = 0; menuIndex < tabMenu.length; menuIndex++) {
		strMenu += createMenuCell(menuIndex);
	}
	strMenu += "</ul>";
	return strMenu;
}

function createMenuCell(i) {

	var sTab = "<li id='menu'+ i +' "; // Space is mandatory between i and "
	sTab += "onClick='grpDispDelayed(" + i + ",TAB_CLICK)' onmouseover='grpDispDelayed("+i+",TAB_OVER)' onmouseout='grpDispDelayed("+i+",TAB_OUT)'"; // BH 2018
	sTab += "class = 'menu' ";
	sTab += ">";
	sTab += "<a class = 'menu'>";
	sTab += tabMenu[i].name;
	sTab += "<span>" + tabMenu[i].link + "</span>"
	sTab += "</a></li>"
		return sTab;
}

function toggleSlab() {
	var ctl = getbyID("slabToggle")
	if (ctl.checked) {
		runJmolScript("spin off; slab on; slab 80;");
		slabSlider.setValue(20);
		applySlab(defaultFront);
		depthSlider.setValue(defaultBack);
		applyDepth(defaultBack);
	} else {
		runJmolScript("slab off; ")
		slabSlider.setValue(0);
		depthSlider.setValue(0);
	}
}

function resetSymmetryView() {
	runJmolScriptWait('select *;color atoms opaque; echo; draw off');
}

var firstTimeBond = true;
function enterShow() {
	if (firstTimeBond) {
		bondSlider.setValue(20);
		radiiSlider.setValue(22);
		getbyID('radiiMsg').innerHTML = 20 + " %";
		getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	}
	firstTimeBond = false;
}

var firstTimeEdit = true;
function enterEdit() {
	// BH 2018: Disabled -- unexpected behavior should not be on tab entry
//	if (firstTimeEdit) {
//		radiiConnectSlider.setValue(50);
//		runJmolScriptWait("set forceAutoBond ON; set bondMode AND");
//	}
//	getbyID("radiiConnectMsg").innerHTML = " " + 2.5 + " &#197";
//	setTimeout("runJmolScriptWait(\"restore BONDS bondEdit\");", 400);
//	firstTimeEdit = false;
}

function resetviewTab() {
	// BH 2018: Why labels off? How would we save this?
	runJmolScriptWait('select all;set selectionHalos off;halos off;set picking OFF; halos off;');
	measureCoord = false;
}

function exitIsosurface() {
	// BH 2018: Q: delete??? off?? How would we save the state?
	//runJmolScriptWait('isosurface off');
}

function exitFreqGroup() {
	runJmolScriptWait('vibration off; vectors off');
}

//function exitMenu() {
//	runJmolScriptWait('label off; select off');
//}

function exitElecpropGrp() {
//	runJmolScriptWait('script scripts/reload.spt');
//	restoreOrientation_e();
}

