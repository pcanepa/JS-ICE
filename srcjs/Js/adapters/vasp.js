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

function onClickLoadVaspStruct() {
	//setErrorCallback
	setMessageMode(MESSAGE_MODE_VASP_XML_DONE);
	runJmolScript("set echo top left; echo loading... ;refresh;load ?.xml; message VASPXMLDONE;");
}

vaspXmlMessageCallback = function(msg) {
	if (msg.indexOf("VASPXMLDONE") == 0) {
		loadDone(loadVASPModels);
	}
}

function loadVASPModels() {
	warningMsg("This reader is limited in its own functionalities\n  It does not recognize between \n geometry optimization and frequency calculations.")
	extractAuxiliaryJmol();
	getUnitcell("1");
	var name = jmolGetPropertyAsJSON("filename");
	cleanandReloadfrom();
	setTitleEcho();

	for ( var i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var valueEnth = Info[i].name.substring(11, 24);
			var gibbs = Info[i].name.substring(41, 54);
			var stringa = "Enth. = " + valueEnth + " eV, Gibbs E.= " + gibbs
			+ " eV";
			
			addOption(getbyID("geom"), i + " " + stringa, i + 1);
		}
	}

}

function substringEnergyVaspToFloat(value) {
	if (value != null) {
		var grab = parseFloat(
				value.substring(value.indexOf('=') + 1, value.indexOf('e') - 1))
				.toPrecision(8); // Enthaply = -26.45132096 eV
		grab = grab * 96.485; // constant from
		// http://web.utk.edu/~rcompton/constants
		grab = Math.round(grab * 100000000) / 100000000;
	}
	return grab;
}

////EXPORT FUNCTIONS
var fractionalCoord = false;
function exportVASP() {
	var element = new Array();
	var newElement = new Array();
	var scriptEl = "";
	var stringTitle = "";
	var stringList = "";
	var stringElement = "";
	element = null;
	element = jmolGetPropertyAsArray("atomInfo");

	numAtomelement = null;
	getUnitcell(frameValue);

	setUnitCell();

	for ( var i = 0; i < element.length; i++)
		newElement[i] = element[i].sym; // Return symbol

	var sortedElement = unique(newElement);
	// alert(sortedElement)
	for ( var i = 0; i < sortedElement.length; i++) {
		// scriptEl = "";
		scriptEl = "{" + frameNum + " and _" + sortedElement[i] + "}.length";

		if (i != (sortedElement.length - 1)) {
			stringList = stringList + " " + scriptEl + ", ";
			stringTitle = stringTitle + " " + scriptEl + ", ";
			stringElement = stringElement + " " + sortedElement[i] + ", ";
		} else {
			stringList = stringList + " " + scriptEl;
			stringTitle = stringTitle + " " + scriptEl;
			stringElement = stringElement + " " + sortedElement[i];
		}
	}

	// alert(stringTitle)
	// alert(stringElement)

	fromfractionaltoCartesian();

	warningMsg("Make sure you had selected the model you would like to export.");
	vaspFile = prompt("Type here the job title:", "");
	(vaspFile == "") ? (vaspFile = 'POSCAR prepared with J-ICE whose atoms are: ')
			: (vaspFile = 'POSCAR prepared with J-ICE ' + vaspFile
					+ ' whose atoms are:');
	saveStatejust();
	// This if the file come from crystal output

	var kindCoord = null;
	var fractString = null;
	var exportType = confirm("Would you like to export the structure in fractional coordinates? \n If you press Cancel those will be exported as normal Cartesian.");

	if (exportType) {
		kindCoord = "Direct"
			fractString = "[fxyz]";
		fractionalCoord = true;
	} else {
		kindCoord = "Cartesian"
			fractString = "[xyz]";
		fractionalCoord = false;
	}

	setVacuum();

	var stringVasp = "var titleVasp = ["
		+ stringTitle
		+ "];"
		+ 'var title  = titleVasp.join("  ");'
		+ "var head  ='"
		+ vaspFile
		+ "';"
		+ "var atomLab ='"
		+ stringElement
		+ "';"
		+ 'var titleArr =[head, title, atomLab];'
		+ 'var titleLin = titleArr.join(" ");'
		+ 'var scaleFact = 1.000000;' // imp
		+ "var vaspCellOne = ["
		+ xx
		+ ", "
		+ xy
		+ ", "
		+ xz
		+ "];"
		+ "var vaspCellTwo = ["
		+ yx
		+ ", "
		+ yy
		+ ", "
		+ yz
		+ "];"
		+ "var vaspCellThree = ["
		+ zx
		+ ", "
		+ zy
		+ ", "
		+ zz
		+ "];"
		+ 'var vaspCellX = vaspCellOne.join(" ");' // imp
		+ 'var vaspCellY = vaspCellTwo.join(" ");' // imp
		+ 'var vaspCellZ = vaspCellThree.join(" ");' // imp
		+ 'var listEle  = [atomLab.replace(",","")];'
		+ 'var listLabel  = listEle.join("  ");'
		+ "var listInpcar = ["
		+ stringList
		+ "];"// imp
		+ 'var listAtom  = listInpcar.join("  ");'
		+ 'var cartString = "'
		+ kindCoord
		+ '";' // imp
		+ 'var xyzCoord = '
		+ selectedFrame
		+ '.label(" %16.9'
		+ fractString
		+ '");' // imp
		+ 'var lista = [titleLin, scaleFact, vaspCellX, vaspCellY, vaspCellZ, listLabel, listAtom, cartString, xyzCoord];' // misses
		// listInpcar
		+ 'WRITE VAR lista "POSCAR" ';
	setV(stringVasp);
	loadStatejust();
}

/////// END EXPORT VASP

/////////// IMPORT OUTCAR

function onClickLoadOutcar() {
	setMessageMode(MESSAGE_MODE_VASP_OUTCAR_DONE)
	runJmolScript("set echo top left; echo loading...; refresh;load ?; message VASPOUTCARDONE;");
}

vaspOutcarMessageCallback = function(msg) {
	// important to do this to change from Java string to JavaScript string
	if (msg.indexOf("VASPOUTCARDONE") == 0) {
		loadDone(loadModelsOutcar);
	}
}

var counterFreq = 0;
function loadModelsOutcar() {
	extractAuxiliaryJmol();
	cleanandReloadfrom();
	getUnitcell("1");
	selectDesireModel("1");
	var counterMD = 0;
	counterFreq = 1;
	for (i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var line = Info[i].name;
			if (line.search(/G =/i) != -1) {
				addOption(getbyID("geom"), i + " " + line, i + 1);
				geomData[i] = line;
				counterFreq++;
			} else if (line.search(/cm/i) != -1) {
				freqData[i - counterFreq] = line;
				counterMD++;
			} else if (line.search(/Temp/i) != -1) {
				addOption(getbyID("geom"), (i - counterMD) + " " + line, i + 1);
			}
		}
	}

	if (freqData != null) {
		for (i = 1; i < freqData.length; i++) {
			if (freqData[i] != null)
				var data = parseFloat(freqData[i].substring(0, freqData[i]
				.indexOf("c") - 1));
			 addOption(getbyID("vib"), i + counterFreq  + " A " + data + " cm^-1", i +
			 counterFreq + 1 );
		}
	}
	disableFreqOpts();
	setMaxMinPlot();
	getSymInfo();
	setName();
}

/////////LOAD FUNCTIONS

function disableFreqOpts() {
	for ( var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = true;
	for ( var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = true;
}

function enableFreqOpts() {
	for ( var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = false;
	for ( var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = false;

}

/////END FUNCTIONS
