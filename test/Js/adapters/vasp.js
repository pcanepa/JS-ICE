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


loadDone_vaspoutcar = function() {
	_fileData.energyUnits = ENERGY_EV;
	_fileData.StrUnitEnergy = "e";
	_fileData.counterFreq = 1; 
	for (var i = 0; i < _fileData.info.length; i++) {
		if (_fileData.info[i].name != null) {
			var line = _fileData.info[i].name;
			if (line.search(/G =/i) != -1) {
				addOption(getbyID('geom'), i + " " + line, i + 1);
				_fileData.geomData[i] = line;
				_fileData.counterFreq++;
			} else if (line.search(/cm/i) != -1) {
				var data = parseFloat(line.substring(0, line.indexOf("cm") - 1));	
				_fileData.freqInfo.push(_fileData.info[i]);
				_fileData.freqData.push(line);
				_fileData.vibLine.push(i + " A " + data + " cm^-1");
				_fileData.counterMD++;
			} else if (line.search(/Temp/i) != -1) {
				addOption(getbyID('geom'), (i - _fileData.counterMD) + " " + line, i + 1);
			}
		}
	}

	getUnitcell("1");
	setFrameValues("1");
	disableFreqOpts();
	getSymInfo();
	loadDone();
}

loadDone_xmlvasp = function() {

	warningMsg("This reader is limited in its own functionalities\n  It does not recognize between \n geometry optimization and frequency calculations.")

	// _fileData.... ? 
	
	for (var i = 0; i < _fileData.info.length; i++) {
		if (_fileData.info[i].name != null) {
			var valueEnth = _fileData.info[i].name.substring(11, 24);
			var gibbs = _fileData.info[i].name.substring(41, 54);
			var stringa = "Enth. = " + valueEnth + " eV, Gibbs E.= " + gibbs
			+ " eV";
			
			addOption(getbyID('geom'), i + " " + stringa, i + 1);
		}
	}
	getUnitcell("1");
	setTitleEcho();
	loadDone();
}

////EXPORT FUNCTIONS
function exportVASP() {
	var newElement = [];
	var scriptEl = "";
	var stringTitle = "";
	var stringList = "";
	var stringElement = "";
	numAtomelement = null;
	getUnitcell(_fileData.frameValue);
	setUnitCell();
	var sortedElement = getElementList();
	for (var i = 0; i < sortedElement.length; i++) {
		// scriptEl = "";
		scriptEl = "{" + _fileData.frameNum + " and _" + sortedElement[i] + "}.length";

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

	var lattice = fromfractionaltoCartesian();

	warningMsg("Make sure you have selected the model you would like to export.");
	vaspFile = prompt("Type here the job title:", "");
	(vaspFile == "") ? (vaspFile = 'POSCAR prepared with J-ICE whose atoms are: ')
			: (vaspFile = 'POSCAR prepared with J-ICE ' + vaspFile
					+ ' whose atoms are:');
	saveStateAndOrientation_a();
	// This if the file come from crystal output

	_measure.kindCoord = null;
	var fractString = null;
	var exportType = confirm("Would you like to export the structure in fractional coordinates? \n If you press Cancel those will be exported as normal Cartesian.");

	if (exportType) {
		_measure.kindCoord = "Direct"
			fractString = "[fxyz]";
		_fileData._exportFractionalCoord = true;
	} else {
		_measure.kindCoord = "Cartesian"
			fractString = "[xyz]";
		_fileData._exportFractionalCoord = false;
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
		+ 'var vaspCellX = [' + lattice[0] + '].join(" ");'
		+ 'var vaspCellY = [' + lattice[1] + '].join(" ");'
		+ 'var vaspCellZ = [' + lattice[2] + '].join(" ");'
		+ 'var listEle  = [atomLab.replace(",","")];'
		+ 'var listLabel  = listEle.join("  ");'
		+ "var listInpcar = ["
		+ stringList
		+ "];"// imp
		+ 'var listAtom  = listInpcar.join("  ");'
		+ 'var cartString = "'
		+ _measure.kindCoord
		+ '";' // imp
		+ 'var xyzCoord = '
		+ _fileData.frameSelection
		+ '.label(" %16.9'
		+ fractString
		+ '");' // imp
		+ 'var lista = [titleLin, scaleFact, vaspCellX, vaspCellY, vaspCellZ, listLabel, listAtom, cartString, xyzCoord];' // misses
		// listInpcar
		+ 'var cleaned  = lista.replace("[","");'
		+ 'WRITE VAR cleaned "POSCAR.vasp" ';
	runJmolScriptWait(stringVasp);
	restoreStateAndOrientation_a();
}

/////// END EXPORT VASP

