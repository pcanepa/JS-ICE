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

//CASTEP Js.
/*! Al metal in non-primitive FCC Unit cell

 %block LATTICE_CART ! In Angstroms
 4.0495 0.0    0.00
 0.00   4.0495 0.00
 0.00   0.00   4.0495
 %endblock LATTICE_CART
 %block POSITIONS_FRAC
 Al  0.0000000000    0.0000000000    0.0000000000
 Al  0.0000000000    0.5000000000    0.5000000000
 Al  0.5000000000    0.5000000000    0.0000000000
 Al  0.5000000000    0.0000000000    0.5000000000
 %endblock POSITIONS_FRAC
 kpoints_mp_grid 4 4 4
 fix_all_ions true
 fix_all_cell true
 %BLOCK SPECIES_POT
 %ENDBLOCK SPECIES_POT
 */

// /// FUNCTION LOAD

loadDone_castep = function() {
	_file.energyUnits = ENERGY_EV;
	_file.counterFreq = 0;
	_file.counterMD = 0;
	for (var i = 0; i < _file.info.length; i++) {
		if (_file.info[i].name != null) {
			var line = _file.info[i].name;
			if (line.search(/Energy =/i) != -1) {
				addOption(getbyID('geom'), i + " " + line, i + 1);
				_file.geomData[i] = line;
				_file.counterFreq++;
			} else if (line.search(/cm-1/i) != -1) {
				var data = parseFloat(line.substring(0, line.indexOf("cm") - 1));
				_file.freqInfo.push(_file.info[i]);
				_file.freqData.push(line);
				_file.vibLine.push(i + " A " + data + " cm^-1");
				_file.counterMD++;
			}
		}
	}
	getUnitcell("1");
	setFrameValues("1");
	disableFreqOpts();
	getSymInfo();
	loadDone();
}

function exportCASTEP() {
	warningMsg("Make sure you have selected the model you would like to export.");
	setUnitCell();
	saveStateAndOrientation_a();
	var lattice = fromfractionaltoCartesian();
	setVacuum();
	switch (_file.cell.typeSystem) {
	case "slab":
		scaleModelCoordinates("z", "div", roundNumber(_file.cell.c));
		break;
	case "polymer":
		scaleModelCoordinates("z", "div", roundNumber(_file.cell.c));
		scaleModelCoordinates("y", "div", roundNumber(_file.cell.b));
		break;
	case "molecule":
		scaleModelCoordinates("z", "div", roundNumber(_file.cell.c));
		scaleModelCoordinates("y", "div", roundNumber(_file.cell.b));
		scaleModelCoordinates("x", "div", roundNumber(_file.cell.a));
		break;
	}

	var cellCastep = "var latticeHeader = '\%block LATTICE_CART';"
		+ "var latticeOne = [" + lattice[0] +"].join(' ');"
		+ "var latticeTwo = [" + lattice[1] + "].join(' ');"
		+ "var latticeThree = [" + lattice[2] + "].join(' ');"
		+ "var latticeClose = '\%endblock LATTICE_CART';"
		+ "latticeCastep = [latticeHeader, latticeOne, latticeTwo,latticeThree, latticeClose];";
	runJmolScriptWait(cellCastep);
	
	var positionCastep = "var positionHeader = '\%block POSITIONS_FRAC';"
		+ 'var xyzCoord = ' + _file.frameSelection + '.label("%e %16.9[fxyz]");'
		+ 'xyzCoord = xyzCoord.replace("\n\n","\n");'
		+ "var positionClose = '\%endblock POSITIONS_FRAC';"
		+ "positionCastep = [positionHeader, xyzCoord, positionClose];"
		+ 'positionCastep = positionCastep.replace("\n\n","\n");';
	runJmolScriptWait(positionCastep);
	
	restoreStateAndOrientation_a();

	var finalInputCastep = 'var final = [latticeCastep, positionCastep].replace("\n\n","\n");'
			+ 'WRITE VAR final "?.cell"';
	runJmolScript(finalInputCastep);
}

