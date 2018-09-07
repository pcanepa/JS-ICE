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

/*&CONTROL
 title = 'alpha_PbO_PBE' ,
 calculation = 'vc-relax' ,
 restart_mode = 'from_scratch' ,
 outdir = '/home/pc229/backup/Counts/PWscf/alpha_PbO/' ,
 wfcdir = '/home/pc229/backup/Counts/PWscf/alpha_PbO/' ,
 pseudo_dir = '/home/pc229/backup/Counts/PWscf/alpha_PbO/pseudo/' ,
 prefix  =' alpha_PbO_PBE' ,
 /
 &SYSTEM
 ibrav = 6,
 celldm(1) = 7.511660805,
 celldm(3) = 1.263647799,
 nat = 4,
 ntyp = 2,
 ecutwfc = 50 ,
 nbnd = 60,
 nelec = 40,
 tot_charge = 0.000000,
 occupations = 'fixed' ,
 /
 &ELECTRONS
 mixing_beta = 0.3D0 ,
 /
 &IONS
 ion_dynamics = 'bfgs' ,
 /
 &CELL
 cell_dynamics = 'bfgs' ,
 /
 ATOMIC_SPECIES
 Pb  207.20000  Pb.pbe-d-van.UPF
 O   15.99400  O.pbe-van_ak.UPF
 ATOMIC_POSITIONS crystal
 Pb      0.000000000    0.500000000    0.238500000
 O      0.000000000    0.000000000    0.000000000
 Pb      0.500000000    0.000000000   -0.238500000
 O      0.500000000    0.500000000    0.000000000
 K_POINTS automatic
 4 4 4   0 0 0
 */

//Following functions are to export file for QuantumEspresso
var controlQ = null;
var systemQ = null;
var electronQ = null;
var ionsQ = null;
var cellQ = null;
var atomspQ = null;
var atompositionQ = null;
var kpointQ = null;

//Main block
function exportQuantum() {
	warningMsg("Make sure you had selected the model you would like to export.");
	prepareControlblock();
	prepareSystemblock();
	prepareElectronblock();
	prepareIonsblock();
	prepareCellblock();
	prepareSpecieblock();
	preparePostionblock();
	prepareKpoint();

	var finalInputQ = "var final = [control, system, electron, ions, cell, atomsp, posQ, kpo];"
		+ 'final = final.replace("\n\n"," ");' + 'WRITE VAR final "?.inp" ';
	setV(finalInputQ);
}

function prepareControlblock() {

	var stringTitle = prompt("Type here the job title:", "");
	(stringTitle == "") ? (stringTitleNew = 'Input prepared with J-ICE ')
			: (stringTitleNew = 'Input prepared with J-ICE ' + stringTitle);

	// stringa = 'title= \'prova\','
	controlQ = "var controlHeader = '\&CONTROL';"
		+ 'var controlTitle = "           title = \''
		+ stringTitleNew
		+ '\'";'
		+ 'var controlJob = "           calculation = \'  \'";'
		+ 'var controlRestart ="           restart = \'from_scratch\'";'
		+ 'var controlOutdir  ="           outdir = \' \'";'
		+ 'var controlWcfdir  ="           wcfdir = \' \'";'
		+ 'var controlPsddir  ="           pseudo_dir = \' \'";'
		+ 'var controlPrefix  ="           prefix = \''
		+ stringTitle
		+ '\'";'
		+ "var controlClose = '\/';"
		+ ' control = [controlHeader,controlTitle,controlJob,controlRestart,controlOutdir,controlWcfdir,controlPsddir,controlPrefix,controlClose];';
	setV(controlQ);
	// IMPORTANT THE LAST VARIABLE MUST NOT BE CALL SUCH AS var xxxx
}

function prepareSystemblock() {
	// /here goes the symmetry part

	setUnitCell();
	// celldim(1) = \' \'\,

	// this returns the number of atom

	atomCRYSTAL();
	var numberAtom = jmolEvaluate(numAtomCRYSTAL);
	var stringCutoff = null;
	var stringCutoffrho = null;
	var stringElec = null;
	var stringBand = null;

	/*
	 * var stringCutoff = prompt("Do you know how much is the cutoff on the wave
	 * function? If YES please enter it in eV.") var stringCutoffrho = null;
	 * 
	 * if(stringCutoff != ""){ stringCutoff = fromevTorydberg(stringCutoff);
	 * stringCutoffrho = stringCutoff * 4; }
	 * 
	 * var stringElec = prompt("How many electron does your system have?");
	 * if(stringElec != ""){ stringElec = parseInt(stringElec); stringBand =
	 * parseInt((stringElec / 2) + (stringElec / 2 * 0.20)); }
	 */
	symmetryQuantum();
	var eleMents = howManytype();
	var eleMentlength = eleMents.length

	systemQ = "var systemHeader = '\&SYSTEM';"
		+ 'var systemIbrav = "           ibrav = '
		+ ibravQ
		+ '";' // This variable is defined in the crystal function
		+ 'var systemCelld = "'
		+ cellDimString
		+ '";'
		// + 'var systemNat = " nat = \' \'\,";'
		+ 'var systemNat = "           nat = '
		+ numberAtom
		+ '";'
		+ 'var systemNty = "           ntyp = '
		+ eleMents.length
		+ '";'
		+ 'var systemCut = "           ecutwfc = 40";'
		+ 'var systemToc = "           tot_charge = 0.000000";'
		+ 'var systemOcc = "           occupation = \' \'";' // #this
		// must be
		// fixed if
		// the
		// structure
		// is an
		// insulator
		+ "var systemClose= '\/';"
		+ ' system = [systemHeader, systemIbrav, systemCelld, systemNat,systemNty,systemCut,systemToc,systemOcc , systemClose];';
	setV(systemQ);

}

//to be completed
function prepareElectronblock() {
	electronQ = "var electronHeader = '\&ELECTRONS';"
		+ 'var electronBeta = "           mixing_beta = \'  \'";'
		+ "var electronClose= '\/';"
		+ ' electron = [electronHeader, electronBeta, electronClose];';
	setV(electronQ);
}

//ask what algorithm to use window?
//set Tolerance as well!
function prepareIonsblock() {
	ionsQ = "var ionHeader = '\&IONS';"
		+ 'var ionDyn = "           ion_dynamics= \'  \'";'
		+ "var ionClose= '\/';" + 'ions = [ionHeader, ionDyn, ionClose];';
	setV(ionsQ);

}

function prepareCellblock() {
	cellQ = "var cellHeader = '\&CELL';"
		+ 'var cellDyn = "           cell_dynamics= \'  \'";'
		+ "var cellClose= '\/';"
		+ 'cell = [cellHeader, cellDyn, cellClose];'
		+ 'cell = cell.replace("\n\n"," ");';
	setV(cellQ);
}

function howManytype() {
	var ele = jmolGetPropertyAsArray("atomInfo");
	var newElement = new Array();

	for ( var i = 0; i < ele.length; i++)
		newElement[i] = ele[i].sym; // Return symbol

	var sortedElement = unique(newElement);
	// alert(sortedElement);
	return sortedElement
}
/*
 * ATOMIC_SPECIES Pb 207.20000 Pb.pbe-d-van.UPF O 15.99400 O.pbe-van_ak.UPF
 */

//To BE COMPLETED
function prepareSpecieblock() {
	var element = new Array();
	var newElement = new Array();
	var scriptEl = "";
	var stringList = "";

	setUnitCell();
	element = jmolGetPropertyAsArray("atomInfo");
	for ( var i = 0; i < element.length; i++)
		newElement[i] = element[i].sym; // Return symbol

	var sortedElement = unique(newElement);
	// alert(sortedElement);

	for ( var i = 0; i < sortedElement.length; i++) {
		var elemento = sortedElement[i];
		elemento = elemento.replace("\n\n", " ");
		var numeroAtom = jmolEvaluate('{' + frameNum + ' and _' + elemento
				+ '}[0].label("%l")'); //tobe changed in atomic mass
		scriptEl = "'" + elemento + " " + eleSymbMass[parseInt(numeroAtom)]
		+ " #Here goes the psudopotential filename e.g.: " + elemento
		+ ".pbe-van_ak.UPF '";
		scriptEl = scriptEl.replace("\n", " ");
		if (i == 0) {
			stringList = scriptEl;
		} else {
			stringList = stringList + "," + scriptEl;
		}

		stringList = stringList.replace("\n", " ")

	}

	atomspQ = "var atomsHeader = 'ATOMIC_SPECIES';" + 'var atomsList = ['
	+ stringList + '];' + 'atomsList = atomsList.replace("\n", " ");'
	// + 'atomList = atomList.join(" ");'
	+ 'atomsp =  [atomsHeader,atomsList];';
	setV(atomspQ);
}

function preparePostionblock() {

	setUnitCell();
	atompositionQ = "var posHeader = 'ATOMIC_POSITIONS crystal';"
		+ 'var posCoord = ' + selectedFrame + '.label(\"%e %14.9[fxyz]\");' // '.label(\"%e
		// %16.9[fxyz]\");'
		+ 'posQ = [posHeader,posCoord];';
	setV(atompositionQ);

}

function prepareKpoint() {
	kpointQ = "var kpointWh = '\n\n'  ;"
		+ "var kpointHeader = 'K_POINTS automatic';"
		+ "var kpointgr = ' X X X 0 0 0';"
		+ 'kpo = [kpointWh, kpointHeader, kpointgr];';
	setV(kpointQ);
}

function symmetryQuantum() {
	setUnitCell();
	switch (typeSystem) {
	case "crystal":
		var flagsymmetry = confirm("Do you want to introduce symmetry ?")
		if (!flagsymmetry) {
			cellDimString = "           celldm(1) = "
				+ roundNumber(fromAngstromtoBohr(aCell))
				+ "  \n           celldm(2) =  "
				+ roundNumber(bCell / aCell)
				+ "  \n           celldm(3) =  "
				+ roundNumber(cCell / aCell)
				+ "  \n           celldm(4) =  "
				+ (cosRadiant(alpha))
				+ "  \n           celldm(5) =  "
				+ (cosRadiant(beta))
				+ "  \n           celldm(6) =  "
				+ (cosRadiant(gamma));
			ibravQ = "14";
		} else {
			warningMsg("This procedure is not fully tested.");
			// magnetic = confirm("Does this structure have magnetic properties?
			// \n Cancel for NO.")
			flagCryVasp = false;
			quantumEspresso = true;
			figureOutSpaceGroup();
		}
		break;
	case "slab":
		setVacuum();
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/' + cCell
				+ ')');
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(aCell))
			+ "  \n            celldm(2) =  " + roundNumber(bCell / aCell)
			+ "  \n            celldm(3) =  " + roundNumber(cCell / aCell)
			+ "  \n            celldm(4) =  "
			+ (cosRadiant(alpha))
			+ "  \n            celldm(5) =  " + (cosRadiant(90))
			+ "  \n            celldm(6) =  " + (cosRadiant(90));
		ibravQ = "14";
		break;
	case "polymer":
		setVacuum();
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/' + cCell
				+ ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y/' + bCell
				+ ')');
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(aCell))
			+ "  \n            celldm(2) =  " + roundNumber(bCell / aCell)
			+ "  \n            celldm(3) =  " + roundNumber(bCell / aCell)
			+ "  \n            celldm(4) =  " + (cosRadiant(90))
			+ "  \n            celldm(5) =  " + (cosRadiant(90))
			+ "  \n            celldm(6) =  " + (cosRadiant(90));
		ibravQ = "14";
		break;
	case "molecule":
		setVacuum();
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/' + cCell
				+ ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y/' + bCell
				+ ')');
		setV(selectedFrame + '.x = for(i;' + selectedFrame + '; i.x/' + aCell
				+ ')');
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(aCell))
			+ "  \n            celldm(2) =  " + roundNumber(1.00000)
			+ "  \n            celldm(3) =  " + roundNumber(1.00000)
			+ "  \n            celldm(4) =  "
			+ (cosRadiant(alpha))
			+ "  \n            celldm(5) =  " + (cosRadiant(90))
			+ "  \n            celldm(6) =  " + (cosRadiant(90));
		ibravQ = "14";
		break;
	}
}

///// QUANTUM ESPRESSO READER

espressoDone = function() {
	loadDone(loadModelsEspresso)
}

function loadModelsEspresso() {

	var counterFreq = 0;
	extractAuxiliaryJmol();
	cleanandReloadfrom();
	getUnitcell("1");
	selectDesireModel("1");
	var counterMD = 0;

	flagQuantum = true;
	flagOutcar = false;

	for (i = 0; i < Info.length; i++) {
		var line = Info[i].name;

		if (i == 0) {
			line = "Initial";
			addOption(getbyID("geom"), i + " " + line, i + 1);
			geomData[0] = Info[0].name;
		}

		// alert(line)
		if (line != null) {

			// alert(line)
			if (line.search(/E =/i) != -1) {
				// alert("geometry")
				addOption(getbyID("geom"), i + 1 + " " + line, i + 1);
				geomData[i + 1] = Info[i].name;

				counterFreq++;
			} /*
			 * else if (line.search(/cm/i) != -1) { // alert("vibration")
			 * freqData[i - counterFreq] = Info[i].name; counterMD++; } else
			 * if (line.search(/Temp/i) != -1) { addOption(getbyID("geom"),
			 * (i - counterMD) + " " + Info[i].name, i + 1); }
			 */
		}
	}
	/*
	 * if (freqData != null) { for (i = 1; i < freqData.length; i++) { if
	 * (freqData[i] != null) var data =
	 * parseFloat(freqData[i].substring(0,freqData[i].indexOf("c") - 1));
	 * addOption(getbyID("vib"), i + " A " + data + " cm^-1", i + counterFreq +
	 * 1 ); } }
	 */
	// disableFreqOpts();
	// symmetryModeAdd();
	// setMaxMinPlot();
	getSymInfo();
	// setName();

}

function substringEnergyQuantumToFloat(value) {
	if (value != null) {
		var grab = parseFloat(
				value.substring(value.indexOf('=') + 1, value.indexOf('R') - 1))
				.toPrecision(8); // E = 100000.0000 Ry
		grab = grab * 96.485 * 0.5; // constant from
		// http://web.utk.edu/~rcompton/constants
		grab = Math.round(grab * 100000000) / 100000000;
	}
	return grab;
}
