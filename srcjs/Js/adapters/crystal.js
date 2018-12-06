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

////The following functions are to control import/ export, geometry optimization, frequency properties.
/////////
////////////////SAVE INPUT
/////////

///////////////////////// LOAD & ON LOAD functions

loadDone_crystal = function() {
	_file.energyUnits = ENERGY_HARTREE;
	_file.StrUnitEnergy = "H";
	var vib = getbyID('vib');
	for (var i = 0; i < _file.info.length; i++) {
		var line = _file.info[i].name;
		if (line != null) {
			if (line.search(/Energy/i) != -1) { // Energy
//				if (i > 0 && i < _file.info.length)
//					var previous = substringEnergyToFloat(_file.info[i - 1].name);
//				if (_file.info[i].name != null) {
				addOption(getbyID('geom'), i + " " + line, i + 1);
				_file.geomData[i] = line;
				_file.counterFreq++;
//				}
			} else if (line.search(/cm/i) != -1) {
				if (line.search(/LO/) == -1) {
					_file.freqInfo.push(_file.info[i]);
					_file.vibLine.push((i - _file.counterFreq) + " " + line); 
					_file.freqData.push(line);
				}
			}
	
		}
	} 
	getUnitcell("1");
	runJmolScriptWait("echo");
	setTitleEcho();
	loadDone();
}

function exportCRYSTAL() {
	var systemCRYSTAL = null;
	var keywordCRYSTAL = null;
	var symmetryCRYSTAL = null;

	var endCRYSTAL = "TEST', 'END";
	var script = "";
	var flagsymmetry;
	warningMsg("Make sure you have selected the model you would like to export.")

	var titleCRYS = prompt("Type here the job title:", "");
	(titleCRYS == "" || titleCRYS == null) ? (titleCRYS = ' .d12 prepared with J-ICE ')
			: (titleCRYS = titleCRYS + ' .d12 prepared with J-ICE');

	setUnitCell();

	var  numAtomCRYSTAL = _file.frameSelection + ".length";
	var fractionalCRYSTAL = _file.frameSelection + '.label("%l %16.9[fxyz]")';

	switch (_file.cell.typeSystem) {
	case "crystal":
		systemCRYSTAL = "'CRYSTAL'";
		keywordCRYSTAL = "'0 0 0'";
		symmetryCRYSTAL = "'1'";

		if (!_file.exportNoSymmetry)
			flagsymmetry = confirm("Do you want to introduce symmetry ?")
		if (!flagsymmetry) {
			script = "var cellp = ["
					+ roundNumber(_file.cell.a)
					+ ", "
					+ roundNumber(_file.cell.b)
					+ ", "
					+ roundNumber(_file.cell.c)
					+ ", "
					+ roundNumber(_file.cell.alpha)
					+ ", "
					+ roundNumber(_file.cell.beta)
					+ ", "
					+ roundNumber(_file.cell.gamma)
					+ "];"
					+ 'var cellparam = cellp.join(" ");'
					+ 'cellparam = cellparam.replace("\n\n","\n");'
					+ "var crystalArr = ['"
					+ titleCRYS
					+ "', "
					+ systemCRYSTAL
					+ ", "
					+ keywordCRYSTAL
					+ ", "
					+ symmetryCRYSTAL
					+ "];"
					+ "var crystalRestArr = ["
					+ numAtomCRYSTAL
					+ ", "
					+ fractionalCRYSTAL
					+ ", '"
					+ endCRYSTAL
					+ "'];"
					+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
					+ 'finalArr = finalArr.replace("\n\n","\n");'
					+ 'WRITE VAR finalArr "?.d12"';
		} else {
			warningMsg("This procedure is not fully tested.");
			
			// BH: THIS METHOD WILL RELOAD THE FILE!
			figureOutSpaceGroup(true, true);
			var endCRYSTAL = "TEST', 'END";
			var script = "var cellp = [" + stringCellParam + "];"
					+ 'var cellparam = cellp.join(" ");' + "var crystalArr = ['"
					+ titleCRYS + "', " + systemCRYSTAL + ", " + keywordCRYSTAL + ", "
					+ interNumber + "];" + 'crystalArr = crystalArr.replace("\n\n"," ");'
					+ "var crystalRestArr = [" + numAtomCRYSTAL + ", " + fractionalCRYSTAL
					+ ", '" + endCRYSTAL + "'];"
					+ 'crystalRestArr = crystalRestArr.replace("\n\n"," ");'
					+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
					+ 'finalArr = finalArr.replace("\n\n","\n");'
					+ 'WRITE VAR finalArr "?.d12"';
			runJmolScript(script);
		}
		break;
	case "slab":
		systemCRYSTAL = "'SLAB'";
		keywordCRYSTAL = "";
		symmetryCRYSTAL = "'1'";

		warningMsg("Symmetry not exploited!");

		script = "var cellp = [" + roundNumber(_file.cell.a) + ", "
				+ roundNumber(_file.cell.b) + ", " + roundNumber(_file.cell.gamma) + "];"
				+ 'var cellparam = cellp.join(" ");' + "var crystalArr = ['"
				+ titleCRYS + "', " + systemCRYSTAL + ", " + symmetryCRYSTAL
				+ "];" + 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, cellparam , crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	case "polymer":
		systemCRYSTAL = "'POLYMER'";
		keywordCRYSTAL = "";
		symmetryCRYSTAL = "'1'";

		warningMsg("Symmetry not exploited!");

		script = "var cellp = " + roundNumber(_file.cell.a) + ";"
				+ "var crystalArr = ['" + titleCRYS + "', " + systemCRYSTAL
				+ ", " + symmetryCRYSTAL + "];"
				+ 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, cellp , crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	case "molecule":
		// alert("prov")
		systemCRYSTAL = "'MOLECULE'";
		symmetryCRYSTAL = "'1'"; // see how jmol exploits the punctual TODO:
		warningMsg("Symmetry not exploited!");
		script = "var crystalArr = ['" + titleCRYS + "', " + systemCRYSTAL
				+ ", " + symmetryCRYSTAL + "];"
				+ 'crystalArr = crystalArr.replace("\n\n","\n");'
				+ "var crystalRestArr = [" + numAtomCRYSTAL + ", "
				+ fractionalCRYSTAL + ", '" + endCRYSTAL + "'];"
				+ 'crystalRestArr = crystalRestArr.replace("\n\n","\n");'
				+ 'var finalArr = [crystalArr, crystalRestArr];'
				+ 'finalArr = finalArr.replace("\n\n","\n");'
				+ 'WRITE VAR finalArr "?.d12"';
		break;
	}
	script = script.replace("\n\n", "\n");
	runJmolScriptWait(script);
}


////////////////////////END SAVE INPUT


