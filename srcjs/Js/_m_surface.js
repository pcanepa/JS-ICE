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

function enterSurface() {
	
}

function exitSurface() {
	// BH 2018: Q: delete??? off?? How would we save the state?
	//runJmolScriptWait('isosurface off');
}

function cubeLoad() {
	// TODO BH 2018 this needs reworking
	runJmolScriptWait("isosurface delete all");
	var answer = confirm("Is your CUBE periodic?");
	// BH 2018: Why this logic? Couldn't we map a nonperiodic 
	// if it is periodic, then we need to se the lattice here
	// what is so special about periodic here?
	if (!answer) {
		messageMsg("Just load the *.CUBE file");
		loadCube(LOAD_ISO_ONLY, "ISOSAVED");
		return;
	}
	var dued = confirm("Do you want to extract a 2D map out of this CUBE? \n Press Ok for 2D, Cancel for 3D");
	if (dued) {
		duedMaps();
	} else {
		potentialProfile(true);
	}

}

function potentialProfile() {
	var haveIso = !!jmolEvaluate("isosurface list").trim();
	var withMap = (prompt("Do you want to map surface data with potential or spin *.CUBE data?", "yes") == "yes");
	var mapOnly = haveIso && (prompt("Do you want to use the current surface?", "yes") == "yes");
	if (!withMap) {
		loadCube(LOAD_ISO_ONLY, "ISO");
		sendSurfaceMessage();
		saveIsoJVXL();
	} else if (mapOnly) {
		messageMsg("Now load the potential or spin CUBE file.");			
		loadCube(LOAD_ISO_MAP_ONLY, "ISO");
	} else {
		messageMsg("Now load in sequence (1) the *.CUBE density file, and (2) the *.CUBE potential / spin file.");
		loadCube(LOAD_ISO_WITH_MAP, "ISO");
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
		runJmolScriptWait("echo");
		potentialProfile(flag);
	}
	if (msg.indexOf("POTSAVED") == 0) {
		runJmolScriptWait("echo");
		sendSurfaceMessage();
		saveIsoJVXL();
	}
	if (msg.indexOf("ISO") == 0) {
		runJmolScriptWait("echo");
		getIsoInfo();
	}

}

SURFACE_VDW   			 = "isosurface delete; isosurface VDW"; // BH Q: Why was this VDW + 2.0 ?
SURFACE_VDW_PERIODIC     = "isosurface delete; isosurface lattice VDW";
SURFACE_VDW_MEP			 = "isosurface resolution 7 VDW map MEP"; // why SOLVENT, which is VDW + 1.2?
SURFACE_VDW_MEP_PERIODIC = "isosurface lattice _CELL_ resolution 7 VDW map MEP";

function setIsoClassic(value) {
	 if (value.indexOf("_CELL_") >= 0)
		 value = value.replace("_CELL_", getCurrentCell()); 
	runJmolScriptWait("isosurface delete ALL");	
	setMessageMode(MESSAGE_MODE_SAVE_ISO)
	runJmolScriptWait("set echo top left; echo creating ISOSURFACE...; refresh;" + value + "; message ISO;");
}

// BH not called
//function msSetPeriodicity() {
//	messageMsg("Now set the periodicity with the menu below.");
//}

// This extracts the maximum and minimum of the color range
function getIsoInfo() {
	var isoInfo = jmolGetPropertyAsString("shapeinfo.isosurface[1].jvxlinfo");
	var dataMinimum = parseFloat(isoInfo.substring(
			isoInfo.indexOf("data") + 14, isoInfo.indexOf("data") + 26)); // dataMinimum
	var dataMaximum = parseFloat(isoInfo.substring(
			isoInfo.indexOf("dataMax") + 14, isoInfo.indexOf("dataMax") + 26)); // dataMaximum
	setValue("dataMin", dataMinimum);
	setValue("dataMax", dataMaximum);
}

function setIsoColorscheme() {
	runJmolScriptWait('color $isosurface1 "' + getValue("isoColorScheme") + '"');
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
	}
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
	var check = isChecked("measureIso");
	if (check) {
		messageMsg("Value are shown by hovering on the surface. Values are in e- *bohr^-3. Make sure your isosurface is completely opaque.");
		runJmolScriptWait("set drawHover TRUE");
	} else {
		runJmolScriptWait("set drawHover OFF");
	}
}

function removeStructure() {
	var check = isChecked("removeStr");
	if (!check) {
		runJmolScriptWait("select *; hide selected");
	} else {
		runJmolScriptWait("display *");
	}
}

function removeCellIso() {
	var check = isChecked("removeCellI");
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
