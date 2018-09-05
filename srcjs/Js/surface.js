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

//////////////////////ISOSURFACE FUNCTIONS(LOAD AND PERIODICITY)
function cubeLoad() {
	setV("isosurface delete all");
	var answer = confirm("Is your CUBE periodic?");
	if (answer) {
		var dued = confirm("Do you want to extract a 2D map out of this CUBE? \n Press Ok for 2D, Cancel for 3D");
		if (dued) {
			duedMaps();
		} else {
			var question = confirm("Is/are this/these CUBE file/s going to be superimposed on the current structure?");
			if (question) {
				runJmolScriptWait('frame LAST; ');
				var flag = true;
				potentialProfile(true);
			} else {
				messageMsg("Then, load your structure file first.");				
				runJmolScriptWait('set echo top left; echo loading... ;refresh;load ?; frame LAST');
				var flag = true;
				potentialProfile(true);
			}
		}
	} else {
		messageMsg("Just load the *.CUBE file");
		setMessageMode(MESSAGE_MODE_SAVE_ISO)
		runJmolScript("set echo top left; echo loading...;refresh;load ?; message ISOSAVED;");
	}

}

function potentialProfile(flag) {
	var potential = confirm("Do you want to overalap your potential / spin *.CUBE on it ?");
	if (potential) {
		setMessageMode(MESSAGE_MODE_SAVE_ISO)			
		if (flag) {
			messageMsg("Now load in sequence 1) the *.CUBE density file, 2) the *.CUBE potential / spin file.");
			runJmolScript('set echo top left; echo loading CUBE...;refresh;isosurface ?.CUBE  map ?.CUBE; message ISO;');
		} else {
			messageMsg("Now load the *.CUBE potential file.");			
			runJmolScript('set echo top left; echo loading CUBE...;refresh;isosurface "" map ?.CUBE;message ISO;');
		}
//		saveIsoMessageCallback("POTSAVED");
	//	saveIsoMessageCallback("ISO"); 
		// This
		// callback
		// is to work
		// out the color
		// range of the
		// surface
	} else {
		runJmolScriptWait('set echo top left; echo loading...;refresh;isosurface ?.CUBE; message ISO;');
		sendSurfaceMessage();
		saveIsoJVXL();
	}
}

var dueD_con = false;
var dueD_planeMiller = false;

function duedMaps() {

	var plane = confirm("In order to extract a 2D map from a 3D file you need to  select a plane. \n If you want to select a miller plane press Ok. \n Otherwise you create you own plane selecting three atom press Cancel.");

	if (plane) {
		var miller = prompt(
				"Enter the three Miller's indexes with the follow notation x x x. \n If you have fractional numbers enter for instance: 1/2 1/2 1/2.",
				"1 1 1");
		messageMsg("Miller's plane entered: " + miller);

		var spin = confirm("Now would you only like to slice the density? OK for yes, Cancel if you wish to map SPIN or potential on top.")
		if (spin) {
			dueD_con = true;
			dueD_planeMiller = true;
			runJmolScript('isosurface ID "isosurface1" select ({0:47})  hkl {' + miller
					+ '} map color range 0.0 2.0 ?.CUBE');
		} else {
			messageMsg("Now load the *.CUBE potential / spin file.");
			runJmolScript("isosurface HKL {" + miller + "} MAP ?.CUBE;");
		}
	} else {
		setPlanedued("");
	}

}

// function change

function sendSurfaceMessage() {
	warningMsg("If the surface doesn't look like what you were exceted, go to the menu' voice Isosur. for more options.");
}

function saveIsoJVXL() {
	messageMsg("Now, save your surface in a compact format *.JVXL");	
	runJmolScript("write crystal_map.jvxl;");
}

function saveIsoMessageCallback(msg) {
	if (msg.indexOf("ISOSAVED") == 0) {
		var flag = false;
		setV("echo");
		potentialProfile(flag);
	}
	if (msg.indexOf("POTSAVED") == 0) {
		setV("echo");
		sendSurfaceMessage();
		saveIsoJVXL();
	}
	if (msg.indexOf("ISO") == 0) {
		setV("echo");
		getIsoInfo();
	}

}

function setIsoClassic(value) {
	setV("isosurface delete ALL");
	
	setMessageMode(MESSAGE_MODE_SAVE_ISO)
	if (value == 'load ""; isosurface VDW 2.0') {
		var periodicSurf = confirm("Would you like to periodicize this surface ?");
		if (periodicSurf == true) {			
			runJmolScriptWait('set echo top left;echo creating ISOSURFACE...;refresh;load ""; frame LAST; isosurface slab unitcell VDW; message ISO;');
			msSetPeriodicity();
		} else {
			runJmolScriptWait("set echo top left;echo creating ISOSURFACE...;refresh;" + value + "; message ISO;");
		}
	} else if (value == 'load ""; isosurface resolution 7 SOLVENT map MEP; message ISO;') {
		var periodicSurf = confirm("Would you like to periodicize this surface ?");
		if (periodicSurf == true) {
			runJmolScriptWait('set echo top left;echo creating ISOSURFACE... ;refresh;load ""; frame LAST; isosurface slab unitcell resolution 7 SOLVENT map MEP; message ISO;');
			msSetPeriodicity();
		} else {
			setV("set echo top left; echo creating ISOSURFACE...; refresh;" + value	+ ";message ISO;");
		}
	} else {
		setV("set echo top left; echo creating ISOSURFACE...; refresh;" + value + "; message ISO;");
	}
}

function msSetPeriodicity() {
	messageMsg("Now set the periodicity with the menu below.");
}

// This extracts the maximum and minimum of the color range
function getIsoInfo() {
	var isoInfo = jmolGetPropertyAsString("shapeinfo.isosurface[1].jvxlinfo");
	// if (!isoInfo) {
	// alert ("No value available")
	// return;
	// }
	titleCRYS;
	var dataMinimum = parseFloat(isoInfo.substring(
			isoInfo.indexOf("data") + 14, isoInfo.indexOf("data") + 26)); // dataMinimum
	var dataMaximum = parseFloat(isoInfo.substring(
			isoInfo.indexOf("dataMax") + 14, isoInfo.indexOf("dataMax") + 26)); // dataMaximum

	setVbyID("dataMin", dataMinimum);
	setVbyID("dataMax", dataMaximum);

}

function setIsoColorscheme() {
	var colorScheme = getValue("isoColorScheme");
	setV('color $isosurface1 "' + colorScheme + '"');
}

function setIsoColorRange() {
	if (getbyID("dataMin") == "" || getbyID("dataMax") == "") {
		errorMsg("Please, check values entered in the textboxes");
		return false;
	}

	var min = getValue("dataMin");
	var max = getValue("dataMax");
	var colorScheme = getValue("isoColorScheme");

	if (colorScheme != "bw") {
		runJmolScriptWait('color $isosurface1 "' + colorScheme + '" range ' + min + ' '
				+ max);
	} else {
		warningMsg("Colour-scheme not available for CUBE files!");
		// setV('color $isosurface1 "' + colorScheme + "'")
	}
}

function setColorMulliken(value) {
	runJmolScript('set propertyColorScheme "' + value + '";load "" PACKED; select *;font label 18; frame last; color {*} property partialCharge; label %5.3P');
}

function setIsoColorReverse() {
	if (getbyID("dataMin") == "" || getbyID("dataMax") == "") {
		errorMsg("Please, check values entered in the textboxes");
		return false;
	}

	var min = getValue("dataMin");
	var max = getValue("dataMax");
	var colorScheme = getValue("isoColorScheme");

	runJmolScriptWait('color $isosurface1 reversecolor "' + colorScheme + '" range ' + min
			+ ' ' + max);
}

function pickIsoValue() {
	var check = checkID("measureIso");
	if (check) {
		messageMsg("Value are shown by hovering on the surface. Values are in e- *bohr^-3. Make sure your isosurface is completely opaque.");
		runJmolScriptWait("set drawHover TRUE");
	} else {
		runJmolScriptWait("set drawHover OFF");
	}
}

function removeStructure() {
	var check = checkID("removeStr");
	if (!check) {
		runJmolScriptWait("select *; hide selected");
	} else {
		runJmolScriptWait("display *");
	}
}

function removeCellIso() {
	var check = checkID("removeCellI");
	if (!check) {
		runJmolScriptWait("unitcell OFF");
	} else {
		runJmolScriptWait("unitcell ON");
	}
}

function setIsoPack() {
	if (getValue("iso_a") == "" || getValue("iso_b") == ""
			|| getValue("iso_c") == "") {
		errorMsg("Please, check values entered in the textboxes");
		return false;
	}

	// var question = confirm("Do you want to replicate the structure too?");
	// if(question){
	// saveCurrentState();
	// setV("load '' {" + getValue("iso_a") + " " + getValue("iso_b") +
	// " " + getValue("iso_c") + " }; frame LAST");
	// }
	// reloadCurrentState();
	runJmolScriptWait('isosurface LATTICE {' + getValue("iso_a") + ' ' + getValue("iso_b")
			+ ' ' + getValue("iso_c") + '}');
}

function loadMapJvxl() {
	var question = confirm("Do you want to superimpose this map on a structure?");

	if (question) {
		messageMsg("Then, load the input file first.");
		runJmolScriptWait('zap;  load ?; set defaultDirectory;frame LAST');
		messageMsg("Now load the isosurface *.jvxl file.");
		runJmolScript(' isosurface ?.jvxl');
	} else {
		messageMsg("Then, load the isosurface *.jvxl file.");
		runJmolScript('zap; isosurface ?.jvxl');
	}
}

////////////////END ISOSURFACE FUNCTIONS
