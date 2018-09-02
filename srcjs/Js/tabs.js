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

//Common variables
function defineMenu() {
	addTab("File", "fileGroup", "Import, Export files.");
	addTab("Show", "apparenceGroup",
	"Change atom, bond colours, and dimensions.");
	addTab("Edit", "editGroup", "Change connectivity and remove atoms.");
	//addTab("Build", "builGroup", "Modify and optimize structure.");
	addTab("Measure", "measureGroup",
	"Measure bond distances, angles, and torsionals.");
	addTab("Orient", "orientGroup", "Change orientation and views.");
	addTab("Cell", "cellGroup", "Modify cell features and symmetry.");
	addTab("Poly", "polyGroup", "Create polyhedra.");
	addTab("Surf.", "isoGroup", "Modify and create isosurface maps.");
	addTab("Optimize", "geometryGroup", "Geometry optimizations.");
	addTab("Spectra", "freqGroup", "IR/Raman frequencies and spectra.");
	addTab("E&M", "elecGroup", "Mulliken charges, spin, and magnetic moments.");
	addTab("Main", "otherpropGroup",
	"Change background, light settings and other.");
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
			'runJmolScript("script ./scripts/reload.spt") + resetAll() + setName()',
			null, "specialbutton")
			+ createButton("reset", "Reset",
					'runJmolScript("script ./scripts/reset.spt")', null,
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

function getMenus() {
	return createFileGrp() + createAppearanceGrp() + createEditGroup()
	+ createBuildGroup() + createMeasureGroup() + createOrientGrp()
	+ createCellGrp() + createPolyGrp() + createIsoGrp()
	+ createGeometryGrp() + createFreqGrp() + createElecpropGrp()
	+ createotherpropGroup();
	// + createHistGrp();
}

function createMenus() {

	// strMenu = "<TABLE style='border-collapse: collapse;'><TR>";
	var strMenu = "<ul class='menu' id='menu'>";
	for ( var menuIndex = 0; menuIndex < tabMenu.length; menuIndex++) {
		strMenu += createMenuCell(menuIndex);
	}
	strMenu += "</ul>";
	// strMenu += "</TR></TABLE>";

	return strMenu;
}

var tabTimeouts = [];
var tabDelayMS = 1000;
var grpDispDelayed = function(n, isClick) {
	for (var i = tabTimeouts.length; --i >= 0;) {
		if (tabTimeouts[i])
			clearTimeout(tabTimeouts[i]);
		tabTimeouts = [];
	}	
	switch(isClick) {
	case 1:
		grpDisp(n);	
		break;
	case 2:
		return;
	default:
		tabTimeouts[n] = setTimeout(function(){grpDispDelayed(n,1)},tabDelayMS);
	}
}

function createMenuCell(i) {

	var sTab = "<li id='menu'+ i +' "; // Space is mandatory between i and "
	sTab += "onClick='grpDispDelayed(" + i + ",1)' onmouseover='grpDispDelayed("+i+",0)' onmouseout='grpDispDelayed("+i+",2)'"; // BH 2018
	sTab += "class = 'menu' ";
	sTab += ">";
	sTab += "<a class = 'menu'>";
	sTab += tabMenu[i].name;
	sTab += "<span>" + tabMenu[i].link + "</span>"
	sTab += "</a></li>"
		// sTab += "</TD>";
		return sTab;
}

/*
 * function menuIn(i){ var str = 'menu' + i ; var id= getbyID(str); id.class =
 * 'menuIn'; }
 * 
 * function menuOut(i){ var str = 'menu' + i; id.class = 'menuOut'; }
 */

function toggleElement(disp, me, index) {
	if (disp == 1) {
		getbyID(me).style.display = "inline";
	} else {
		getbyID(me).style.display = "none";
	}
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

function grpDisp(i) {
	for ( var j = 0; j < tabMenu.length; j++) {
		if (j == i) {
			toggleElement(1, tabMenu[j].grp, i);
			tabMenu[j].disp = 1;
			showDiv(i);
		} else {
			toggleElement(0, tabMenu[j].grp, i);
			tabMenu[j].disp = 0;
		}
	}
	/*
	 * if (tabMenu[i].picking) { runJmolScript("set picking on;") } else {
	 * runJmolScript("set picking off;") }
	 */
}

var widget = null;

function showDiv(index) {
	var arrayGeomgrp = new Array("appletdiv", "graphdiv", "plottitle",
			"plotarea", "appletdiv1", "graphdiv1", "plottitle1", "plotarea1");
	var freqArrGr = new Array("freqdiv", "graphfreqdiv", "plottitlefreq",
	"plotareafreq");

	switch (index) {
	case 0:
		resetviewTab();
		widget = true;
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitFreqGroup();
		break;
	case 1:
		resetviewTab();
		widget = true;
		enterAppreance();
		enterTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
	case 2:
		resetviewTab();
		widget = true;
		enterEdit();
		enterTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
/*	case 3: // Build
		resetviewTab();
		widget = true;
		enterTab();
		// removeDiv();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;*/
	case 3:
		resetviewTab();
		widget = true;
		enterTab();
		// removeDiv();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
	case 4:
		widget = true;
		resetviewTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		// exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
	case 5:
		widget = true;
		resetviewTab();
		enterTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";

		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		getUnitcell(frameValue);
		getSymInfo();
		break;
	case 6:
		widget = true;
		resetviewTab();
		enterTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
		// isosurface group
	case 7:
		widget = false;
		resetviewTab();
		// removeDiv();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		resetSymmetryView();
		break;
		// Geometry group
	case 8:
		widget = false;
		resetviewTab();
		resetSymmetryView();
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "block";
		exitIsosurface();
		exitFreqGroup();
		// if(flagCryVasp)
		refresh();
		break;
		// Freq group
	case 9:
		widget = true;
		resetviewTab();
		resetSymmetryView();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "block";
		exitIsosurface();
		refreshFreq();
		break;
	case 10:
		widget = true;
		resetviewTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
		// / Mulliken and spin
	case 11:

		widget = true;
		resetviewTab();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		saveOrientation();
		exitIsosurface();
		exitFreqGroup();
		resetSymmetryView();
		break;
	case 12:
		resetviewTab();
		widget = true;
		enterOther();
		for ( var i = 0; i < arrayGeomgrp.length; i++)
			getbyID(arrayGeomgrp[i]).style.display = "none";
		for ( var j = 0; j < freqArrGr.length; j++)
			getbyID(freqArrGr[j]).style.display = "none";
		exitIsosurface();
		exitFreqGroup();

		break;
	}

}
var firstTimeBond = true;
function enterAppreance() {
	if (firstTimeBond) {
		bondSlider.setValue(20);
		radiiSlider.setValue(22);
		getbyID('radiiMsg').innerHTML = 20 + " %";
		getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	}
	firstTimeBond = false;
}

function enterOther() {
	light1Slider.setValue(50);
	light2Slider.setValue(50);
	light3Slider.setValue(50);
	getbyID("light1Msg").innerHTML = 40 + " %";
	getbyID("light2Msg").innerHTML = 40 + " %";
	getbyID("light3Msg").innerHTML = 40 + " %";

}

var firstTime = true;
function enterEdit() {
	if (firstTime) {
		radiiConnect.setValue(50);
		setV("set forceAutoBond ON; set bondMode AND");
	}
	getbyID("radiiConnectMsg").innerHTML = " " + 2.5 + " &#197";
	setTimeout("setV(\"restore BONDS bondEdit\");", 400);
	firstTime = false;
}

function resetviewTab() {
	setV('select all; label off; halos off');
	setV('showSelections FALSE; select none; set picking OFF; halos off; set LABEL off;');
	measureCoord = false;
}
