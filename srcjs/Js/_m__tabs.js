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

// This list is used by callbacks

var TAB_OVER  = 0;
var TAB_CLICK = 1;
var TAB_OUT   = 2;

var TAB_DELAY_MS = 100;

// This list controls the placement of the menu item on the menu.

var MENU_FILE     = 0;
var MENU_CELL     = 1;
var MENU_SHOW     = 2;
var MENU_EDIT     = 3;
var MENU_SYM      = 4;
//var MENU_BUILD  = x;
var MENU_MEASURE  = 5;
var MENU_ORIENT   = 6;
var MENU_POLY     = 7;
var MENU_SURFACE  = 8;
var MENU_OPTIMIZE = 9;
var MENU_SPECTRA  = 10;
var MENU_EM       = 11;
var MENU_OTHER    = 12;

// local variables 

var tabs_thisMenu = -1;
var tabs_jsNames  = [];
var tabs_menu     = [];
var tabs_timeouts = [];

function Menu(name, grp, link) {
	this.name = name;
	this.grp = grp;
	this.link = link;
}

function addTab(index, jsName, menuName, group, link) {
	tabs_menu[index] = new Menu(menuName, group, link);
	tabs_jsNames[index] = jsName;
	
}

function defineMenu() {
	addTab(MENU_FILE, "File", "File", "fileGroup", "Import, Export files.");
	addTab(MENU_CELL, "Cell", "Cell", "cellGroup", "Modify cell features and symmetry.");
	addTab(MENU_SHOW, "Show", "Show", "showGroup", "Change atom, bond colours, and dimensions.");
	addTab(MENU_EDIT, "Edit", "Edit", "editGroup", "Change connectivity and remove atoms.");
	//addTab(MENU_BUILD, "Build", "Build", "builGroup", "Modify and optimize structure.");
	addTab(MENU_SYM, "Symmetry", "Sym Build", "symmetryGroup", "Add atoms to structure following rules of symmetry.");
	addTab(MENU_MEASURE, "Measure", "Measure", "measureGroup", "Measure bond distances, angles, and torsionals.");
	addTab(MENU_ORIENT, "Orient", "Orient", "orientGroup", "Change orientation and views.");
	addTab(MENU_POLY, "Polyhedra", "Poly", "polyGroup", "Create polyhedra.");
	addTab(MENU_SURFACE, "Surface", "Surface", "isoGroup", "Modify and create isosurface maps.");
	addTab(MENU_OPTIMIZE, "Optimize", "Optimize", "geometryGroup", "Geometry optimizations.");
	addTab(MENU_SPECTRA, "Spectra", "Spectra", "freqGroup", "IR/Raman frequencies and spectra.");
	addTab(MENU_EM, "Elec", "E&M", "elecGroup", "Mulliken charges, spin, and magnetic moments.");
	addTab(MENU_OTHER, "Other", "Other", "otherpropGroup", "Change background, light settings and other.");
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
	if (tabs_thisMenu >= 0)
		self["exit" + tabs_jsNames[menu]]();
	tabs_thisMenu = menu;
	exitTab();
	self["enter" + tabs_jsNames[menu]]();
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
	for (var i = tabs_timeouts.length; --i >= 0;) {
		if (tabs_timeouts[i])
			clearTimeout(tabs_timeouts[i]);
		tabs_timeouts = [];
	}	
	for (var i = 0; i < tabs_menu.length; i++){
		$("#menu"+i).removeClass("picked");
	}
	switch(mode) {
	case TAB_OVER:
		tabs_timeouts[n] = setTimeout(function(){grpDispDelayed(n,1)},TAB_DELAY_MS);
		
		break;
	case TAB_CLICK:
		for (var i = 0; i < tabs_menu.length; i++) {
			getbyID(tabs_menu[i].grp).style.display = "none";
			tabs_menu[i].disp = 0;
		}
		getbyID(tabs_menu[n].grp).style.display = "inline";
		tabs_menu[n].disp = 1;
		showMenu(n);
		
		break;
	case TAB_OUT:
		break;
	}
	if (tabs_thisMenu >= 0) {
		$("#menu"+tabs_thisMenu).addClass("picked");
	}
}

function createTabMenu() {
	var strMenu = "<ul class='menu' id='menu'>";
	for (var menuIndex = 0; menuIndex < tabs_menu.length; menuIndex++) {
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
	sTab += tabs_menu[i].name;
	sTab += "<span>" + tabs_menu[i].link + "</span>"
	sTab += "</a></li>"
		return sTab;
}

