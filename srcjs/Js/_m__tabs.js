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

function addTab(name, group, link) {
	tabMenu.push(new Menu(name, group, link));
}

// Note: These numbers must reflect the order of addition in defineMenu()

MENU_FILE     = 0;
MENU_CELL     = 1;
MENU_SHOW     = 2;
MENU_EDIT     = 3;
MENU_SYM      = 4;
//MENU_BUILD  = x;
MENU_MEASURE  = 5;
MENU_ORIENT   = 6;
MENU_POLY     = 7;
MENU_SURFACE  = 8;
MENU_OPTIMIZE = 9;
MENU_SPECTRA  = 10;
MENU_EM       = 11;
MENU_OTHER    = 12;


var TAB_OVER  = 0;
var TAB_CLICK = 1;
var TAB_OUT   = 2;

var menuNames = [
	"File", "Cell", "Show" ,"Edit" /*, "Build"*/, "Symmetry",
	"Measure", "Orient", "Polyhedra", "Surface", 
	"Optimize", "Spectra", "Elec", "Other",
	];
function defineMenu() {
	/* 0 */ addTab("File", "fileGroup", "Import, Export files.");
	/* 1 */ addTab("Cell", "cellGroup", "Modify cell features and symmetry.");
	/* 2 */ addTab("Show", "showGroup", "Change atom, bond colours, and dimensions.");
	/* 3 */ addTab("Edit", "editGroup", "Change connectivity and remove atoms.");
	/* x */ //addTab("Build", "builGroup", "Modify and optimize structure.");
	/* 4 */ addTab("Sym Build", "symmetryGroup", "Add atoms to structure following rules of symmetry.");
	/* 5 */ addTab("Measure", "measureGroup", "Measure bond distances, angles, and torsionals.");
	/* 6 */ addTab("Orient", "orientGroup", "Change orientation and views.");
	/* 7 */ addTab("Poly", "polyGroup", "Create polyhedra.");
	/* 8 */ addTab("Surface", "isoGroup", "Modify and create isosurface maps.");
	/* 9 */ addTab("Optimize", "geometryGroup", "Geometry optimizations.");
	/* 10 */ addTab("Spectra", "freqGroup", "IR/Raman frequencies and spectra.");
	/* 11 */ addTab("E&M", "elecGroup", "Mulliken charges, spin, and magnetic moments.");
	/* 12 */ addTab("Other", "otherpropGroup", "Change background, light settings and other.");
  
}

function createAllMenus() {
	var s = createFileGrp()
		+ createShowGrp()
		+ createEditGrp()
		+ createSymmetryGrp() 
		//+ createBuildGrp()
		+ createMeasureGrp()
		+ createOrientGrp()
		+ createCellGrp()
		+ createPolyGrp()
		+ createIsoGrp()
		+ createOptimizeGrp()
		+ createFreqGrp()
		+ createElecpropGrp()
		+ createOtherGrp()
		+ addCommandBox()
		//+ createHistGrp()
		;
	return s
}
var showMenu = function(menu) {
	if (thisMenu >= 0)
		self["exit" + menuNames[menu]]();
	thisMenu = menu;
	exitTab();
//	hideArrays(menu);
	self["enter" + menuNames[menu]]();
	$("#menu"+menu).addClass("picked");
}


var exitTab = function() {
	cancelPicking();
	runJmolScriptWait('select *;color atoms opaque; echo; draw off;set selectionHalos off;halos off;');
}

function grpDisp(n) {
	grpDispDelayed(n, TAB_CLICK);
}

var grpDispDelayed = function(n, mode) {
	for (var i = tabTimeouts.length; --i >= 0;) {
		if (tabTimeouts[i])
			clearTimeout(tabTimeouts[i]);
		tabTimeouts = [];
	}	
	for (var i = 0; i < tabMenu.length; i++){
		$("#menu"+i).removeClass("picked");
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
	if (thisMenu >= 0) {
		$("#menu"+thisMenu).addClass("picked");
	}
}

//var arrayGeomObjects = new Array(
//		"appletdiv", 
//		"graphdiv", 
//		"plottitle",
//		"plotarea", 
//		"appletdiv1", 
//		"graphdiv1", 
//		"plottitle1", 
//		"plotarea1");
//var arrayFreqObjects = new Array(
//		"freqdiv", 
//		"graphfreqdiv", 
//		"plottitlefreq",
//		"plotareafreq");
//
//var hideArrays = function(menu) {
//	for (var i = 0; i < arrayGeomObjects.length; i++)
//		getbyID(arrayGeomObjects[i]).style.display = (menu == MENU_OPTIMIZE ? "block" : "none");
//	for (var j = 0; j < arrayFreqObjects.length; j++)
//		getbyID(arrayFreqObjects[j]).style.display = (menu == MENU_SPECTRA ? "block" : "none");
//}

function createTabMenu() {
	var strMenu = "<ul class='menu' id='menu'>";
	for (var menuIndex = 0; menuIndex < tabMenu.length; menuIndex++) {
		strMenu += createMenuCell(menuIndex);
	}
	strMenu += "</ul>";
	return strMenu;
}

function createMenuCell(i) {
	var sTab = "<li id='menu"+ i +"' "; // Space is mandatory between i and "
	sTab += "onClick='grpDispDelayed(" + i + ",TAB_CLICK)' onmouseover='grpDispDelayed("+i+",TAB_OVER)' onmouseout='grpDispDelayed("+i+",TAB_OUT)'"; // BH 2018
	sTab += "class = 'menu' ";
	sTab += ">";
	sTab += "<a class = 'menu'>";
	sTab += tabMenu[i].name;
	sTab += "<span>" + tabMenu[i].link + "</span>"
	sTab += "</a></li>"
		return sTab;
}

