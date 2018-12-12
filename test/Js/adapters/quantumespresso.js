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

///// QUANTUM ESPRESSO READER

loadDone_espresso = function() {
	
	_file.energyUnits = ENERGY_RYDBERG;
	_file.StrUnitEnergy = "R";
	_file.hasInputModel = true;

	for (var i = 0; i < _file.info.length; i++) {
		var line = _file.info[i].name;

		if (i == 0) {
			_file.geomData[0] = line;
			addOption(getbyID('geom'), "0 initial", 1);
		}
		if (line != null) {
			if (line.search(/E =/i) != -1) {
				addOption(getbyID('geom'), i + 1 + " " + line, i + 1);
				_file.geomData[i + 1] = line;
				_file.counterFreq++;
			} /*
			 * else if (line.search(/cm/i) != -1) { // alert("vibration")
			 * freqData[i - counterFreq] = _file.info[i].name; counterMD++; } else
			 * if (line.search(/Temp/i) != -1) { addOption(getbyID('geom'),
			 * (i - counterMD) + " " + _file.info[i].name, i + 1); }
			 */
		}
	}
	/*
	 * if (freqData != null) { for (var i = 1; i < freqData.length; i++) { if
	 * (freqData[i] != null) var data =
	 * parseFloat(freqData[i].substring(0,freqData[i].indexOf("c") - 1));
	 * addOption(getbyID('vib'), i + " A " + data + " cm^-1", i + counterFreq +
	 * 1 ); } }
	 */
	getUnitcell("1");
	setFrameValues("1");
	getSymInfo();
	loadDone();
}


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

//Main block
function exportQuantum() {
	warningMsg("Make sure you have selected the model you would like to export.");
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
	runJmolScriptWait(finalInputQ);
}

function prepareControlblock() {

	var stringTitle = prompt("Type here the job title:", "");
	(stringTitle == "") ? (stringTitleNew = 'Input prepared with J-ICE ')
			: (stringTitleNew = 'Input prepared with J-ICE ' + stringTitle);

	// stringa = 'title= \'prova\','
	var controlQ = "var controlHeader = '\&CONTROL';"
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
	runJmolScriptWait(controlQ);
	// IMPORTANT THE LAST VARIABLE MUST NOT BE CALL SUCH AS var xxxx
}

function prepareSystemblock() {
	// /here goes the symmetry part

	setUnitCell();

	var numberAtom = jmolEvaluate(_file.frameSelection + ".length");

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

	setUnitCell();
	
	var cellDimString, ibravQ;	
	switch (_file.cell.typeSystem) {
	case "crystal":
		var flagsymmetry = confirm("Do you want to introduce symmetry ?")
		if (!flagsymmetry) {
			cellDimString = "           celldm(1) = "
				+ roundNumber(fromAngstromtoBohr(_file.cell.a))
				+ "  \n           celldm(2) =  "
				+ roundNumber(_file.cell.b / _file.cell.a)
				+ "  \n           celldm(3) =  "
				+ roundNumber(_file.cell.c / _file.cell.a)
				+ "  \n           celldm(4) =  "
				+ (cosRounded(_file.cell.alpha))
				+ "  \n           celldm(5) =  "
				+ (cosRounded(_file.cell.beta))
				+ "  \n           celldm(6) =  "
				+ (cosRounded(_file.cell.gamma));
			ibravQ = "14";
		} else {
			warningMsg("This procedure is not fully tested.");
			// magnetic = confirm("Does this structure have magnetic properties?
			// \n Cancel for NO.")
			figureOutSpaceGroup(true, false, true);
		}
		break;
	case "slab":
		setVacuum();
		scaleModelCoordinates("z", "div", _file.cell.c);
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(_file.cell.a))
			+ "  \n            celldm(2) =  " + roundNumber(_file.cell.b / _file.cell.a)
			+ "  \n            celldm(3) =  " + roundNumber(_file.cell.c / _file.cell.a)
			+ "  \n            celldm(4) =  "
			+ (cosRounded(_file.cell.alpha))
			+ "  \n            celldm(5) =  " + (cosRounded(90))
			+ "  \n            celldm(6) =  " + (cosRounded(90));
		ibravQ = "14";
		break;
	case "polymer":
		setVacuum();
		scaleModelCoordinates("z", "div", _file.cell.c);
		scaleModelCoordinates("y", "div", _file.cell.b);
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(_file.cell.a))
			+ "  \n            celldm(2) =  " + roundNumber(_file.cell.b / _file.cell.a)
			+ "  \n            celldm(3) =  " + roundNumber(_file.cell.b / _file.cell.a)
			+ "  \n            celldm(4) =  " + (cosRounded(90))
			+ "  \n            celldm(5) =  " + (cosRounded(90))
			+ "  \n            celldm(6) =  " + (cosRounded(90));
		ibravQ = "14";
		break;
	case "molecule":
		setVacuum();
		scaleModelCoordinates("x", "div", _file.cell.a);
		scaleModelCoordinates("y", "div", _file.cell.b);
		scaleModelCoordinates("z", "div", _file.cell.c);
		cellDimString = "            celldm(1) = "
			+ roundNumber(fromAngstromtoBohr(_file.cell.a))
			+ "  \n            celldm(2) =  " + roundNumber(1.00000)
			+ "  \n            celldm(3) =  " + roundNumber(1.00000)
			+ "  \n            celldm(4) =  "
			+ (cosRounded(_file.cell.alpha))
			+ "  \n            celldm(5) =  " + (cosRounded(90))
			+ "  \n            celldm(6) =  " + (cosRounded(90));
		ibravQ = "14";
		break;
	}

	var elements = getElementList();

	var systemQ = "var systemHeader = '\&SYSTEM';"
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
		+ elements.length
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
	runJmolScriptWait(systemQ);

}

//to be completed
function prepareElectronblock() {
	var electronQ = "var electronHeader = '\&ELECTRONS';"
		+ 'var electronBeta = "           mixing_beta = \'  \'";'
		+ "var electronClose= '\/';"
		+ ' electron = [electronHeader, electronBeta, electronClose];';
	runJmolScriptWait(electronQ);
}

//ask what algorithm to use window?
//set Tolerance as well!
function prepareIonsblock() {
	var ionsQ = "var ionHeader = '\&IONS';"
		+ 'var ionDyn = "           ion_dynamics= \'  \'";'
		+ "var ionClose= '\/';" + 'ions = [ionHeader, ionDyn, ionClose];';
	runJmolScriptWait(ionsQ);

}

function prepareCellblock() {
	var cellQ = "var cellHeader = '\&CELL';"
		+ 'var cellDyn = "           cell_dynamics= \'  \'";'
		+ "var cellClose= '\/';"
		+ 'cell = [cellHeader, cellDyn, cellClose];'
		+ 'cell = cell.replace("\n\n"," ");';
	runJmolScriptWait(cellQ);
}

//ATOMIC_SPECIES Pb 207.20000 Pb.pbe-d-van.UPF O 15.99400 O.pbe-van_ak.UPF


//To BE COMPLETED
function prepareSpecieblock() {
	setUnitCell();
	var scriptEl = "";
	var stringList = "";
	var sortedElement = getElementList();

	for (var i = 0; i < sortedElement.length; i++) {
		var elemento = sortedElement[i];
		var numeroAtom = jmolEvaluate('{' + _file.frameNum + ' and _' + elemento
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

	var atomspQ = "var atomsHeader = 'ATOMIC_SPECIES';" + 'var atomsList = ['
	+ stringList + '];' + 'atomsList = atomsList.replace("\n", " ");'
	// + 'atomList = atomList.join(" ");'
	+ 'atomsp =  [atomsHeader,atomsList];';
	runJmolScriptWait(atomspQ);
}

function preparePostionblock() {
	setUnitCell();
	var atompositionQ = "var posHeader = 'ATOMIC_POSITIONS crystal';"
		+ 'var posCoord = ' + _file.frameSelection + '.label(\"%e %14.9[fxyz]\");' // '.label(\"%e
		// %16.9[fxyz]\");'
		+ 'posQ = [posHeader,posCoord];';
	runJmolScriptWait(atompositionQ);
}

function prepareKpoint() {
	var kpointQ = "var kpointWh = '\n\n'  ;"
		+ "var kpointHeader = 'K_POINTS automatic';"
		+ "var kpointgr = ' X X X 0 0 0';"
		+ 'kpo = [kpointWh, kpointHeader, kpointgr];';
	runJmolScriptWait(kpointQ);
}

