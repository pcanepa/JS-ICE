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

var cellCastep = null;
var positionCastep = null;

function exportCASTEP() {
	warningMsg("Make sure you had selected the model you would like to export.");

	setUnitCell();
	fromfractionaltoCartesian();
	saveStatejust();
	setVacuum();

	switch (typeSystem) {
	case "slab":
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/'
				+ roundNumber(cCell) + ')');
		break;
	case "polymer":
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/'
				+ roundNumber(cCell) + ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y/'
				+ roundNumber(bCell) + ')');
		break;
	case "molecule":
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/'
				+ roundNumber(cCell) + ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y/'
				+ roundNumber(bCell) + ')');
		setV(selectedFrame + '.x = for(i;' + selectedFrame + '; i.x/'
				+ roundNumber(aCell) + ')');
		break;
	}

	prepareLatticeblockcastep();
	prepareCoordinateblockCastep();

	var finalInputCastep = "var final = [latticeCastep, positionCastep];"
			+ 'final = final.replace("\n\n","\n");'
			+ 'WRITE VAR final "?.cell"';
	setV(finalInputCastep);
	loadStatejust();
}

function prepareLatticeblockcastep() {
	cellCastep = "var latticeHeader = '\%block LATTICE_CART';"
			+ "var latticeOne = ["
			+ xx
			+ ", "
			+ xy
			+ ", "
			+ xz
			+ "];"
			+ "var latticeOne = latticeOne.join(' ');"
			+ "var latticeTwo = ["
			+ yx
			+ ", "
			+ yy
			+ ", "
			+ yz
			+ "];"
			+ "var latticeTwo = latticeTwo.join(' ');"
			+ "var latticeThree = ["
			+ zx
			+ ", "
			+ zy
			+ ", "
			+ zz
			+ "];"
			+ "var latticeThree = latticeThree.join(' ');"
			+ "var latticeClose = '\%endblock LATTICE_CART';"
			+ "latticeCastep = [latticeHeader, latticeOne, latticeTwo,latticeThree, latticeClose];"
	setV(cellCastep);
}

// /Frac coordinates
function prepareCoordinateblockCastep() {
	positionCastep = "var positionHeader = '\%block POSITIONS_FRAC';"
			+ 'var xyzCoord = ' + selectedFrame + '.label("%e %16.9[fxyz]");'
			+ 'xyzCoord = xyzCoord.replace("\n\n","\n");'
			+ "var positionClose = '\%endblock POSITIONS_FRAC';"
			+ "positionCastep = [positionHeader, xyzCoord, positionClose];"
			+ 'positionCastep = positionCastep.replace("\n\n","\n");'
	setV(positionCastep);
}

// /// FUNCTION LOAD

function onClickLoadCastep() {
	runJmolScript("set echo top left; echo loading...; refresh; load ?");
}

castepDone = function() {
	loadDone(loadModelsCastep);
}

function loadModelsCastep() {
	var counterFreq = 0;
	var counterMD = 0;
	extractAuxiliaryJmol();
	cleanandReloadfrom();
	getUnitcell("1");
	selectDesireModel("1");

	for (i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var line = Info[i].name;
			// alert(line)
			if (line.search(/Energy =/i) != -1) {
				addOption(getbyID("geom"), i + " " + line, i + 1);
				geomData[i] = line;
				counterFreq++;
			} else if (line.search(/cm-1/i) != -1) {
				alert("here")
				freqData[i - counterFreq] = line;
				counterMD++;
			}
		}
	}

	if (freqData != null) {
		for (i = 1; i < freqData.length; i++) {
			if (freqData[i] != null)
				var data = parseFloat(freqData[i].substring(0, freqData[i]
						.indexOf("c") - 1));
			addOption(getbyID("vib"), i + " A " + data + " cm^-1", i
					+ counterFreq + 1);
		}
	}
	disableFreqOpts();
	symmetryModeAdd();
	setMaxMinPlot();
	getSymInfo();
	setName();
}

// ///////LOAD FUNCTIONS

function disableFreqOpts() {
	for ( var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = true;
	for ( var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = true;

	// getbyID("modAct").enable = false;
	// makeDisable("modAct");
	// makeDisable("vibSym");
	// makeDisable("reload");
}

function enableFreqOpts() {
	for ( var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = false;
	for ( var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = false;

}

// /// COVERT FUNCTION

function substringEnergyCastepToFloat(value) {
	if (value != null) {
		var grab = parseFloat(
				value.substring(value.indexOf('=') + 1, value.indexOf('e') - 1))
				.toPrecision(8); // Enthaply = -26.45132096 eV
		grab = grab * 96.485; // constant from
		// http://web.utk.edu/~rcompton/constants
		grab = Math.round(grab * 100000000) / 100000000;
		//alert(grab)
	}
	return grab;
}

/////END FUNCTIONS
