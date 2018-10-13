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
	selectListItem(document.isoGroup.createIso, '');
}

function exitSurface() {
	cancelPicking();
}

SURFACE_VDW   			 = "isosurface VDW"; // BH Q: Why was this VDW + 2.0 ?
SURFACE_VDW_PERIODIC     = "isosurface lattice _CELL_ VDW";
//SURFACE_VDW_MEP			 = "isosurface resolution 7 VDW map MEP"; // why SOLVENT, which is VDW + 1.2?
//SURFACE_VDW_MEP_PERIODIC = "isosurface lattice _CELL_ resolution 7 VDW map MEP";

function onClickCreateIso(value) {
	if (!value)
		return;
	if (value.indexOf("?") >= 0)
		messageMsg("Select or drag-drop your density cube or JVXL file onto the 'browse' button, then press the 'load' button.");
	createSurface(value, true);
}

var canMapIsosurface = function() {
	if (jmolEvaluate("isosurface list").trim())
		return true;	
	messageMsg("First create an isosurface.")
	return false;
}
function onClickMapCube() {
	if (!canMapIsosurface())
		return;
	messageMsg("Select or drag-drop your potential cube file onto the 'browse' button, then press the 'load' button.");
	createSurface("isosurface map '?'", false);	
}

function onClickMapMEP() {
	if (!canMapIsosurface())
		return;
	createSurface("isosurface map mep;isosurface cache;", false)
}

function onClickMapPlane() {
	pickPlane(null, surfacePickPlaneCallback);
}

function surfacePickPlaneCallback() {
	createSurface('isosurface PLANE $plane1 MAP color range 0.0 2.0 "?";', true);
}

var createSurface = function(cmd, doClear) {
	if (cmd.indexOf("_CELL_") >= 0)
		cmd = cmd.replace("_CELL_", getCurrentCell()); 
	runJmolScript((doClear ? "isosurface delete;" : "") 
			+ "set echo top left; echo creating ISOSURFACE...; refresh;" + cmd + '; echo;javascript getIsoInfo()');
}

//function sendSurfaceMessage() {
//	warningMsg("If the surface doesn't look like what you were expected, go to the menu' voice Isosur. for more options.");
//}
//
//function saveIsoJVXL() {
//	messageMsg("Now, save your surface in a compact format *.JVXL");	
//	runJmolScript("write crystal_map.jvxl;");
//}

function getIsoInfo() {
	if (!jmolEvaluate("isosurface list").trim())
		return;
	
	// generate JVXL equivalent immediately
//	runJmolScriptWait("isosurface cache");
	
	// Extract the maximum and minimum of the color range
	
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
		warningMsg("Colorscheme not available for CUBE files!");
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


function createIsoGrp() {
	var isoName = new Array("select a surface type",
			"from CUBE or JVXL file",
			"isosurface OFF",
			"isosurface ON",
			"Van der Waals", 
			"periodic VdW",
			"solvent accessible", 
			"molecular"
			// BH: TODO: Note that these do not allow mapping
//			,"geodesic VdW", "geodesic IONIC", "dots VdW", "dots IONIC"
			);
	var isoValue = new Array('',
			'isosurface "?"',
			'isosurface OFF',
			'isosurface ON',
			SURFACE_VDW, 
			SURFACE_VDW_PERIODIC,
//			SURFACE_VDW_MEP,
//			SURFACE_VDW_MEP_PERIODIC,
			'isosurface SASURFACE',
			'isosurface MOLSURFACE resolution 0 molecular'
//			,
//			'geoSurface VANDERWAALS', 
//			'geoSurface IONIC',
//			'dots VANDERWAALS', 
//			'dots IONIC'
			);
	var colSchemeName = new Array("Rainbow (default)", "Black & White",
			"Blue-White-Red", "Red-Green", "Green-Blue");
	var colSchemeValue = new Array("roygb", "bw", "bwr", "low", "high");
	/*
	 * TODO slab unitcell. /
	 * http://chemapps.stolaf.edu/jmol/docs/examples-11/new.htm isosurface /
	 * lattice {a b c}
	 */
	var strIso = "<form autocomplete='nope'  id='isoGroup' name='isoGroup' style='display:none'>\n";
	strIso += "<table class='contents'>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "<h2>IsoSurface</h2>\n";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	//strIso += "Molecular (classic) isoSurfaces: \n <br>";
	strIso += createSelect('createIso', 'onClickCreateIso(this.value)', 0, 0,
			isoValue, isoName)
			+ "&nbsp;";
	strIso += createButton('removeIso', 'remove iso', 'runJmolScriptWait("isosurface OFF")','');
	strIso += createLine('blue', '');
	strIso += "</td></tr><tr><td colspan='2'>\n";
	strIso += createButton('mapMEP', 'map charges', 'onClickMapMEP()','');
	strIso += createButton('mapCube', 'map from CUBE file', 'onClickMapCube()','');
	strIso += createButton('mapPlane', 'map plane', 'onClickPickPlane(null, surfacePickPlaneCallback)','');
	strIso += "<br>Color map settings<br>\n ";
	strIso += "<img src='images/band.png'><br><br>";
	strIso += "- " + createText2("dataMin", "", "12", 0) + " + "
	+ createText2("dataMax", "", "12", 0) + " e- *bohr^-3<br>";
	strIso += "<br> Colour-scheme "
		+ createSelect('isoColorScheme', 'setIsoColorscheme()', 0, 0,
				colSchemeValue, colSchemeName) + "&nbsp<br>";
	strIso += createButton('up', 'Update map', 'setIsoColorRange()', '');
	// + createButton('reverseColor', 'Reverse colour', 'setIsoColorReverse()',
	// '');
	strIso += createLine('blue', '');
	strIso += "<td><tr>\n";
	// strIso+="Volume isoSurface<br>"
	// strIso+=createButton('volIso', 'calculate', 'runJmolScriptWait('isosurface
	// VOLUME')', '') + " \n";
	// strIso+=createText3('isoVol','','','',"");
	// strIso+=createLine('blue' , '');
	// strIso+="</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Expand isoSurface periodically <br>";
	strIso += "<i>a: </i>";
	strIso += "<input type='text'  name='iso_a' id='iso_a' size='1' class='text'>";
	strIso += "<i> b: </i>";
	strIso += "<input type='text'  name='iso_b' id='iso_b' size='1' class='text'>";
	strIso += "<i> c: </i>";
	strIso += "<input type='text'  name='iso_c' id='iso_c' size='1' class='text'>";
	strIso += createButton('set_Isopack', 'packIso', 'setIsoPack()', '')
	+ " \n";
	strIso += createLine('blue', '');
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Style isoSurface:<br>";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += createRadio("isofashion", "opaque",
			'runJmolScriptWait("color isosurface opaque") ', 0, 1, "", "");
	strIso += createRadio("isofashion", "translucent",
			'runJmolScriptWait("color isosurface translucent") ', 0, 0, "", "")
			+ "<br>";
	strIso += createRadio("isofashion", "dots", 'runJmolScriptWait("isosurface  dots;") ',
			0, 0, "", "");
	strIso += createRadio("isofashion", "no-fill mesh",
			'runJmolScriptWait("isosurface nofill mesh") ', 0, 0, "", "");
	strIso += "</td></tr>\n";
	strIso += "<tr><td>\n";
	strIso += "Color Isosurface:\n";
	strIso += "</td><td><script>\n";
	strIso += "jmolColorPickerBox([setColorWhat,'isosurface'], '','surfaceColorPicker');";
	strIso += "</script>";
	strIso += "</td></tr>";
	strIso += "<tr><td>\n";
	strIso += createLine('blue', '');
	strIso += createCheck("measureIso", "Measure value", "pickIsoValue()", 0,
			0, "measureIso")
			+ "\n";
	// strIso += "<input type='text' name='isoMeasure' id='isoMeasure' size='5'
	// class='text'> a.u.\n";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += createCheck("removeStr", "Show structure beneath",
			"removeStructure()", 0, 1, "")
			+ " \n";
	strIso += createCheck("removeCellI", "Show cell", "removeCellIso()", 0, 1,
	"")
	+ " \n";
	strIso += createLine('blue', '');
	strIso += "</td></tr>\n";
	strIso += "</table>\n";
	strIso += "</FORM>\n";
	return strIso;
}


