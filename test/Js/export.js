
function scaleModelCoordinates(xyz, op1, f1, op2, f2, etc) {
	// e.g. {1.1}.xyz.all.mul(2);
	var atomArray = _file.frameSelection + '.' + xyz;
	var s = "";
	for (int i = 1; i < arguments.length;) {
		s += atomArray + " = " + atomArray + ".all." + arguments[i++] + "(" + arguments[i++] + ");";
	}
	runJmolScriptWait(s);
	
}

function setVacuum() {
	var newCell_c;
	var vacuum;
	switch (_file.cell.typeSystem) {
	case "slab":
		vacuum = prompt("Please enter the vacuum thickness (\305).", "");
		(vacuum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vacuum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_file.frameSelection + '.fz.max'));
		vacuum = parseFloat(vacuum);
		newCell_c = (zMaxCoord * 2) + vacuum;
		var factor = roundNumber(zMaxCoord + vacuum);
		if (_file._exportFractionalCoord) { // from VASP only?
			scaleModelCoordinates("z", "add", factor, "div", newcell_c);
		} else {
			scaleModelCoordinates("z", "add", factor);
		}
		fromfractionaltoCartesian(null, null, newCell_c, null, 90, 90);
		break;
	case "polymer":
		vacuum = prompt("Please enter the vacuum thickness (\305).", "");
		(vacuum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vacuum + "  \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_file.frameSelection + '.fz.max'));
		vacuum = parseFloat(vacuum);
		newCell_c = (zMaxCoord * 2) + vacuum;
		var factor = roundNumber(zMaxCoord + vacuum);
		scaleModelCoordinates("z", "add", factor);
		scaleModelCoordinates("y", "add", factor);
		fromfractionaltoCartesian(null, newCell_c, newCell_c, 90, 90, 90);
		break;
	case "molecule":
		vacuum = prompt("Please enter the vacuum thickness (\305).", "");
		(vacuum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vacuum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_file.frameSelection + '.fz.max'));
		vacuum = parseFloat(vacuum);
		newCell_c = (zMaxCoord * 2) + vacuum;
		var factor = roundNumber(zMaxCoord + vacuum);
		scaleModelCoordinates("xyz", "add", factor);
		fromfractionaltoCartesian(newCell_c, newCell_c, newCell_c, 90, 90, 90);
		break;

	}
}

function fromfractionaltoCartesian(aparam, bparam, cparam, alphaparam,
		betaparam, gammaparam) {
	//From fractional to Cartesian -- returns a 3x3 matrix
	var xx, xy, xz, 
	    yx, yy, yz, 
	    zx, zy, zz;
	if (aparam != null)
		_file.cell.a = aparam;
	if (bparam != null)
		_file.cell.b = bparam;
	if (cparam != null)
		_file.cell.c = cparam;
	if (alphaparam != null)
		_file.cell.alpha = alphaparam;
	if (betaparam != null)
		_file.cell.beta = betaparam;
	if (gammaparam != null)
		_file.cell.gamma = gammaparam;
	// formula repeated from
	// http://en.wikipedia.org/wiki/Fractional_coordinates
	var v = Math.sqrt(1
			- (cosDeg(_file.cell.alpha) * cosDeg(_file.cell.alpha))
			- (cosDeg(_file.cell.beta) * cosDeg(_file.cell.beta))
			- (cosDeg(_file.cell.gamma) * cosDeg(_file.cell.gamma))
			+ 2	* (cosDeg(_file.cell.alpha) * cosDeg(_file.cell.beta) * cosDeg(_file.cell.gamma)));
	xx = _file.cell.a * sinDeg(_file.cell.beta);
	xy = parseFloat(0.000);
	xz = _file.cell.a * cosDeg(_file.cell.beta);
	yx = _file.cell.b
	* (((cosDeg(_file.cell.gamma)) - ((cosDeg(_file.cell.beta)) * (cosDeg(_file.cell.alpha)))) / sinDeg(_file.cell.beta));
	yy = _file.cell.b * (v / sinDeg(_file.cell.beta));
	yz = _file.cell.b * cosDeg(_file.cell.alpha);
	zx = parseFloat(0.000);
	zy = parseFloat(0.000);
	zz = _file.cell.c;
	return [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]];

}


//prevframeSelection needs because of the conventional
//var prevframeSelection = null;
//var prevFrame = null;
	

function figureOutSpaceGroup(doReload, isConv, quantumEspresso) {
	var stringCellParam;
	var cellDimString = null;
	var ibravQ = "";
	saveStateAndOrientation_a();
	//prevframeSelection = _file.frameSelection;
	if (_file.frameValue == null || _file.frameValue == "" || _file.exportModelOne)
		_file.frameValue = 1; // BH 2018 fix: was "framValue" in J-ICE/Java crystalFunction.js
	var prevFrame = _file.frameValue;
	var magnetic = confirm('It\'s the primitive cell ?')
	// crystalPrev = confirm('Does the structure come from a previous CRYSTAL
	// calculation?')
	reload(null, 
			isConv ? "conv" : null, 
			magnetic ? "delete not cell=555;" : null
	);
	var s = ""
	var info = jmolEvaluate('show("spacegroup")')
	if (info.indexOf("x,") < 0) {
		s = "no space group"
	} else {
		var S = info.split("\n")
		for (var i = 0; i < S.length; i++) {
			var line = S[i].split(":")
			if (line[0].indexOf("international table number") == 0)
				s = parseInt(S[i]
						.replace(/international table number:/, ""));
		}
	}
	var interNumber = parseInt(s);
	getUnitcell(prevFrame);
	// /from crystal manual http://www.crystal.unito.it/Manuals/crystal09.pdf
	switch (true) {
	case ((interNumber <= 2)): // Triclinic lattices
		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.b) + ", "
				+ roundNumber(_file.cell.c) + ", " + roundNumber(_file.cell.alpha) + ", "
				+ roundNumber(_file.cell.beta) + ", " + roundNumber(_file.cell.gamma);
		cellDimString = " celdm(1) =  " + fromAngstromtoBohr(_file.cell.a)
				+ " \n celdm(2) =  " + roundNumber(_file.cell.b / _file.cell.a)
				+ " \n celdm(3) =  " + roundNumber(_file.cell.c / _file.cell.a)
				+ " \n celdm(4) =  " + cosRounded(_file.cell.alpha) + " \n celdm(5) =  "
				+ (cosRounded(_file.cell.beta)) + " \n celdm(6) =  "
				+ (cosRounded(_file.cell.gamma)) + " \n\n";
		ibravQ = "14";
		break;

	case ((interNumber > 2) && (interNumber <= 15)): // Monoclinic lattices
		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.b) + ", "
				+ roundNumber(_file.cell.c) + ", " + roundNumber(_file.cell.alpha);
		if (quantumEspresso) {
			cellDimString = " celdm(1) =  " + fromAngstromtoBohr(_file.cell.a)
					+ " \n celdm(2) =  " + roundNumber(_file.cell.b / _file.cell.a)
					+ " \n celdm(3) =  " + roundNumber(_file.cell.c / _file.cell.a)
					+ " \n celdm(4) =  " + (cosRounded(_file.cell.alpha))
					+ " \n\n";
			ibravQ = "12"; // Monoclinic base centered

			var question = confirm("Is this a Monoclinic base centered lattice?")
			if (question)
				ibravQ = "13";
		}
		break;

	case ((interNumber > 15) && (interNumber <= 74)): // Orthorhombic lattices
		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.b) + ", "
				+ roundNumber(_file.cell.c);
		if (quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a)
					+ " \n celdm(2) =  " + roundNumber(_file.cell.b / _file.cell.a)
					+ " \n celdm(3) =  " + roundNumber(_file.cell.c / _file.cell.a) + " \n\n";
			ibravQ = "8";

			var question = confirm("Is this a Orthorhombic base-centered lattice?")
			if (question) {
				ibravQ = "9";
			} else {
				var questionfcc = confirm("Is this a Orthorhombic face-centered (fcc) lattice?");
				if (questionfcc) {
					ibravQ = "10";
				} else {
					ibravQ = "11";// Orthorhombic body-centered
				}
			}

		}
		break;

	case ((interNumber > 74) && (interNumber <= 142)): // Tetragonal lattices

		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.c);
		if (quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a)
					+ " \n celdm(3) =  " + roundNumber(_file.cell.c / _file.cell.a) + " \n\n";
			ibravQ = "6";
			var question = confirm("Is this a Tetragonal I body centered (bct) lattice?");
			if (question)
				ibravQ = "7";
		}
		break;

	case ((interNumber > 142) && (interNumber <= 167)): // Trigonal lattices
		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.alpha) + ", "
				+ roundNumber(_file.cell.beta) + ", " + roundNumber(_file.cell.gamma);
		cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a)
				+ " \n celdm(4) =  " + (cosRounded(_file.cell.alpha))
				+ " \n celdm(5) = " + (cosRounded(_file.cell.beta))
				+ " \n celdm(6) =  " + (cosRounded(_file.cell.gamma));
		ibravQ = "5";
		var question = confirm("Is a romboheadral lattice?")
		if (question) {
			stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.c);
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a)
					+ " \n celdm(4) =  " + (cosRounded(_file.cell.alpha))
					+ " \n celdm(5) = " + (cosRounded(_file.cell.beta))
					+ " \n celdm(6) =  " + (cosRounded(_file.cell.gamma))
					+ " \n\n";
			ibravQ = "4";
		}
		break;
	case ((interNumber > 167) && (interNumber <= 194)): // Hexagonal lattices
		stringCellParam = roundNumber(_file.cell.a) + ", " + roundNumber(_file.cell.c);
		if (quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a)
					+ " \n celdm(3) = " + roundNumber(_file.cell.c / _file.cell.a) + " \n\n";
			ibravQ = "4";
		}
		break;
	case ((interNumber > 194) && (interNumber <= 230)): // Cubic lattices
		stringCellParam = roundNumber(_file.cell.a);
		if (quantumEspresso) {
			cellDimString = " celdm(1) = " + fromAngstromtoBohr(_file.cell.a);
			// alert("I am here");
			ibravQ = "1";
			var question = confirm("Is a face centered cubic lattice?")
			if (question) {
				var questionBase = confirm("Is a body centered cubic lattice?")
				if (questionBase) {
					ibravQ = "3";
				} else {
					ibravQ = "2";
				}
			}
	
		}
		break;
	default:
		errorMsg("SpaceGroup not found in range.");
		return false;
		break;
	}// end switch
	
//	stringCellparamgulp = roundNumber(_file.cell.a) + ' ' + roundNumber(_file.cell.b) + ' '
//			+ roundNumber(_file.cell.c) + ' ' + roundNumber(_file.cell.alpha) + ' '
//			+ roundNumber(_file.cell.beta) + ' ' + roundNumber(_file.cell.gamma);
	//	alert(stringCellparamgulp)
	if (doReload) {
		reload("primitive");
		restoreStateAndOrientation_a();
	}
}


