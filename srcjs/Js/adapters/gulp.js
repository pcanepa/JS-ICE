
 /*   based on:
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

// ////////////GULP READER

loadDone_gulp = function() {
	_fileData.energyUnits = ENERGY_EV;
	_fileData.StrUnitEnergy = "e";
	_fileData.counterFreq = 0;
	for (var i = 0; i < _fileData.info.length; i++) {
		var line = _fileData.info[i].name;
		if (i == 0) {
			line = "Intial";
		}
		addOption(getbyID('geom'), i + " " + line, i + 1);
		_fileData.geomData[i] = line;
		_fileData.counterFreq++;
	}

	runJmolScriptWait("script scripts/gulp_name.spt"); 
	getUnitcell("1");
	setFrameValues("1");
	getSymInfo();
	loadDone();
}

///THIS ROUTINE IS TO EXPORT INPUT FOR GULP

function exportGULP() {
	
	var stringCellparamgulp;
	var coordinateAddgulp = "";
	var cellHeadergulp = "cell";
	var flagsymmetryGulp = false;

	warningMsg("Make sure you have selected the model you would like to export.");
	saveStateAndOrientation_a();
	if (_fileData.cell.typeSystem != "crystal")
		setUnitCell();
	
	var titleGulpinput = prompt("Type here the job title:", "");
	(titleGulpinput == "") ? (titleGulpinput = 'Input prepared with J-ICE ')
			: (titleGulpinput = '#Input prepared with J-ICE \n'
					+ titleGulpinput);
	var titleGulp = 'var optiongulp = \"opti conp propr #GULP options\";'
			+ 'var titleheader = \"title \"; ' + 'var title = \"'
			+ titleGulpinput + '\"; ' + 'var titleend = \"end \";'
			+ 'titlegulp = [optiongulp, titleheader, title, titleend];';
	runJmolScriptWait(titleGulp);

	switch (_fileData.cell.typeSystem) {
	case "crystal":
		setUnitCell();
		flagsymmetryGulp = confirm("Do you want to introduce symmetry ?");

		if (flagsymmetryGulp) {
			warningMsg("This procedure is not fully tested.");
			figureOutSpaceGroup(false, false);
		} else {
			stringCellparamgulp = roundNumber(_fileData.cell.a) + ' ' + roundNumber(_fileData.cell.b)
					+ ' ' + roundNumber(_fileData.cell.c) + ' ' + roundNumber(_fileData.cell.alpha) + ' '
					+ roundNumber(_fileData.cell.beta) + ' ' + roundNumber(_fileData.cell.gamma);
		}
		break;

	case "surface":
		cellHeadergulp = "scell";
		coordinateAddgulp = "s";
		stringCellparamgulp = roundNumber(_fileData.cell.a) + ", " + roundNumber(_fileData.cell.b)
				+ ", " + roundNumber(_fileData.cell.gamma);
		break;

	case "polymer":
		cellHeadergulp = "pcell";
		coordinateAddgulp = "";
		stringCellparamgulp = roundNumber(_fileData.cell.a);
		break;

	case "molecule":
		// TODO

		break;
	}


	var cellGulp = 'var cellheader = \"' + cellHeadergulp + '\";'
		+ 'var cellparameter = \"' + stringCellparamgulp + '\";'
		+ 'cellgulp = [cellheader, cellparameter];';
	runJmolScriptWait(cellGulp);

	var coordinateString;
	var coordinateShel;
	var sortofCoordinateGulp;
	if (_fileData.cell.typeSystem == 'crystal') {
		var sortofCoordinate = confirm("Do you want the coordinates in Cartesian or fractional? \n OK for Cartesian, Cancel for fractional.")
		sortofCoordinateGulp = (sortofCoordinate == true) ? (coordinateAddgulp + "cartesian")
				: (coordinateAddgulp + "fractional");
	} else {
		messageMsg("Coordinate will be exported in Cartesian");
	}
	var flagShelgulp = confirm("Is the inter-atomic potential a core/shel one? \n Cancel stands for NO core/shel potential.");
	if (sortofCoordinateGulp && _fileData.cell.typeSystem == 'crystal') {
		coordinateString = _fileData.frameSelection + '.label("%e core %16.9[fxyz]")';
		coordinateShel = _fileData.frameSelection + '.label("%e shel %16.9[fxyz]")';
	} else {
		coordinateString = _fileData.frameSelection + '.label("%e core %16.9[xyz]")';
		coordinateShel = _fileData.frameSelection + '.label("%e shel %16.9[xyz]")';
	}
	var coordinateGulp;
	if (flagShelgulp) {
		coordinateGulp = 'var coordtype = \"' + sortofCoordinateGulp + '\";'
				+ 'var coordcore = ' + coordinateString + ';'
				+ 'var coordshel = ' + coordinateShel + ';'
				+ 'coordgulp = [coordtype, coordcore, coordshel];';
	} else {
		coordinateGulp = 'var coordtype = \"' + sortofCoordinateGulp + '\";'
				+ 'var coordcore = ' + coordinateString + ';'
				+ 'coordgulp = [coordtype, coordcore];';
	}
	runJmolScriptWait(coordinateGulp);

	if (_fileData.cell.typeSystem == "crystal") {
		// interNumber from crystalfunction .. BH??? interNumber is only defined locally in figureOutSpaceGroup
		if (!flagsymmetryGulp)
			interNumber = "P 1"
		var spacegroupGulp = 'var spaceheader = \"spacegroup\";'
				+ 'var spacegroup = \"' + interNumber + '\";'// TBC
				+ 'spacegulp = [spaceheader, spacegroup];';
		runJmolScriptWait(spacegroupGulp);
	}

	var restGulp;
	if (flagShelgulp) {
		restGulp = 'var species= \"species \" \n\n;'
				+ 'var restpot = \"#here the user should enter the inter-atomic potential setting\";'
				+ 'var spring = \"spring \"  \n\n;'
				+ 'restgulp = [species, restpot, spring];';
	} else {
		restGulp = 'var species= \"species \" \n\n;'
				+ 'var restpot = \"#here the user should enter the inter-atomic potential setting\";'
				+ 'restgulp = [species, restpot];';
	}
	runJmolScriptWait(restGulp);

	var finalInputGulp;
	if (_fileData.cell.typeSystem == "crystal") {
		finalInputGulp = "var final = [titlegulp,cellgulp,coordgulp,spacegulp,restgulp];"
				+ 'final = final.replace("\n\n","\n");'
				+ 'WRITE VAR final "?.gin" ';
	} else {
		finalInputGulp = "var final = [titlegulp,cellgulp,coordgulp,restgulp];"
				+ 'final = final.replace("\n\n","\n");'
				+ 'WRITE VAR final "?.gin" ';
	}
	run(finalInputGulp);
	restoreStateAndOrientation_a();

}

