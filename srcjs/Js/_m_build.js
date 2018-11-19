_build = {
	_build.counterClicZ : 0
}

function enterBuild() {
	// not implemented
}

function exitBuild() {
}

function buildPickPlaneCallback() {
 // TODO	
}

function atomSelectedColor(atom) {
	runJmolScriptWait("select {atomno=" + atom + "};");
	colorWhat = "color atom ";
	return colorWhat;
}

function atomSelectedDelete(atom) {
	runJmolScriptWait("select {atomno=" + atom + "};");
	_edit.deleteMode = "delete {atomno=" + atom + "}";
	return _edit.deleteMode;
}

function atomSelectedHide(atom) {
	runJmolScriptWait("select {atomno=" + atom + "};");
	_edit.hideMode = "hide {atomno=" + atom + "}";
	return _edit.hideMode;
}


function atomSelectedDisplay(atom) {
	runJmolScriptWait("select all; halo off; label off");
	runJmolScriptWait("select {atomno=" + atom + "}; halo on; label on");
	_edit.displayMode = "display {atomno=" + atom + "}";
	return _edit.displayMode;
}

function addAtomfrac() {
	var value = checkBoxX("addNewFrac");
	if (value == "on") {
		messageMsg("Enter the three fractional positions of the atom you would like to add. \n ADVICE: use the functions view fractional/Cartesian coordinates of of neighbor atom/s. ");
		makeEnable("x_frac");
		makeEnable("y_frac");
		makeEnable("z_frac");
		makeEnable("addNewFracList");
		makeEnable("addNewFracListBut");
	} else {
		makeDisable("x_frac");
		makeDisable("y_frac");
		makeDisable("z_frac");
		makeDisable("addNewFracList");
		makeDisable("addNewFracListBut");
	}
}

function addNewatom() {
	var type = getValue("addNewFracList");
	var x, y, z;
	x = parseFloat(getValue("x_frac"));
	y = parseFloat(getValue("y_frac"));
	z = parseFloat(getValue("z_frac"));

	if (x == null || y == null || z == null) {
		errorMsg("You didn't properly set the coordinate");
		return false;
	} else {

		var question = confirm("Would you like to add the atom to the current structure (OK) or create a new structure (Cancel)?");
		if (!question) {
			// runJmolScriptWait('var mol = \"' + atomString + ' \" ;');
			messageMsg("Your coordinate will be treated as Cartesian.")
			var atomString = "1\n\n" + type + " " + parseFloat(x) + " "
			+ parseFloat(y) + " " + parseFloat(z);
			runJmolScriptWait('set appendNew TRUE; DATA "model"' + atomString
					+ ' end "model"');
		} else {
			var fractional = confirm("Are these coordinates fractionals (OK) or Cartesians (Cancel)?");
			getUnitcell(frameValue);
			setUnitCell();
			runJmolScriptWait('var noatoms =' + _frame.frameSelection + '.length  + 1;');
			if (!fractional) {
				var atomString = "\n 1\n\n" + type + " " + parseFloat(x) + " "
				+ parseFloat(y) + " " + parseFloat(z);
				runJmolScriptWait('set appendNew FALSE; DATA "append"' + atomString
						+ '\n end "append"');
			} else {
				runJmolScriptWait("set appendNew FALSE;");
				var script = "script inline @{'DATA \"append\"1\\n\\n TE ' + format('%12.3p',{X,Y,Z}.xyz) +'\\nend \"append\" '}"
					runJmolScriptWait(script.replace(/X/, parseFloat(x)).replace(/Y/,
							parseFloat(y)).replace(/Z/, parseFloat(z)).replace(
									/TE/, type));
			}
			// alert(atomString)

		}
		setValue("x_frac", "");
		setValue("y_frac", "");
		setValue("z_frac", "");
		getbyID("addAtomCrystal").style.display = "none";
	}
}

function addAtomZmatrix(form) {
	loadScriptZMatrix();
	selectElementZmatrix(form);
}

function loadScriptZMatrix() {

	// here we must check for crystal surface oo polymer because the routine
	// it's shlighthly different
	runJmolScriptWait("function zAdd(type, dist, a, ang, b, tor, c) {\n"
			+ "var vbc = c.xyz - b.xyz\n" + "var vba = a.xyz - b.xyz\n"
			+ "var p = a.xyz - (vba/vba) * dist\n"
			+ 'var mol = "1 \n\n" + type + " " + p.x + " " + p.y + " " + p.z\n'
			+ "var p = a.xyz + cross(vbc, vba) \n" + "set appendNew FALSE \n"
			+ 'DATA "append" \\n\\n' + '+ mol + ' + '\\n end "append" \n'
			+ 'var newAtom = {*}[0]\n' + 'connect @a @newAtom\n'
			+ 'rotate Selected molecular @a @p @ang @newAtom \n'
			+ 'rotate Selected molecular @b @a @tor @newAtom \n' + '}');
}

function selectElementZmatrix(form) {

	if (form.checked) {
		_build.counterClicZ = 0;
		for (var i = 0; i < 3; i++) {

			if (i == 0) {
				messageMsg("This procedure allows the user to introduce a new atom (or more), \n just by knowing its relationship with its neighbour atoms.")
				messageMsg("Select the 1st atom where to attach the new atom.");
			}

			if (_build.counterClicZ == 1) {
				messageMsg("Select the 2nd atom to form the angle.");
			} else if (_build.counterClicZ == 2) {
				messageMsg("Select the 3rd atom to form the torsional angle.");
			}
			setPickingCallbackFunction(pickZmatrixCallback)
			runJmolScriptWait("draw off; showSelections TRUE; select none; halos on;");
		}
	}
}

function pickZmatrixCallback(b, c, d, e) {
	if (_build.counterClicZ == 0) { // distance
		var valuedist = prompt(
				"Now enter the distance (in \305) from which you want to add the new atom. \n Seletion is done by symply clikking ont the desire atom",
		"1.0");
		distanceZ = parseFloat(valuedist);
		arrayAtomZ[0] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));

	}
	if (_build.counterClicZ == 1) { // angle

		var valueangle = prompt(
				"Now the enter the angle (in degrees) formed between the new atom, the 1st and the 2nd ones. \n Seletion is done by symply clikking ont the desire atoms",
		"109.7");
		angleZ = parseFloat(valueangle);
		arrayAtomZ[1] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));

	}
	if (_build.counterClicZ == 2) {// torsional

		var valuetorsion = prompt(
				"Enter the torsional angle(in degrees) formed between the new atom, the 1st, the 2nd and the 3rd ones. \n Seletion is done by symply clikking ont the desire atoms",
		"180.0");
		torsionalZ = parseFloat(valuetorsion);
		arrayAtomZ[2] = parseInt(b.substring(b.indexOf('#') + 1,
				b.indexOf('.') - 2));
		messageMsg("distance: " + distanceZ + " from atom " + arrayAtomZ[0]
		+ " angle: " + angleZ + " formed by atoms: new, "
		+ arrayAtomZ[0] + ", " + arrayAtomZ[1] + "\n and torsional: "
		+ torsionalZ + " formed by atoms: new, " + arrayAtomZ[0] + ", "
		+ arrayAtomZ[1] + ", " + arrayAtomZ[2])
		messageMsg("Now, select the desire element.");
	}
	_build.counterClicZ++;
}

function addZatoms() {
	runJmolScriptWait('zAdd(\"' + getValue('addEleZ') + '\",' + distanceZ + ',{'
			+ arrayAtomZ[0] + '}, ' + angleZ + ', {' + arrayAtomZ[1] + '},'
			+ torsionalZ + ', {' + arrayAtomZ[2] + '})')
}

function createCrystalStr(form) {
	if (form.checked) {
		makeDisable("periodMole");
	} else {

	}
}

function checkIfThreeD(value) {
	makeEnablePeriodicityMol()
	if (value == "crystal") {

		makeEnable("periodMole");
		setValue("a_frac", "");
		setValue("b_frac", "");
		setValue("c_frac", "");
	} else if (value == "slab") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setValue("a_frac", "");
		setValue("b_frac", "");
		setValue("c_frac", "0");
		makeDisable("c_frac");
		setValue("alpha_frac", "");
		setValue("beta_frac", "");
		setValue("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "polymer") {
		makeDisable("periodMole");
		makeCrystalSpaceGroup = "P-1"; // / set P-1 as symmetry for film and
		// polymer
		setValue("a_frac", "");
		setValue("b_frac", "0");
		makeDisable("b_frac");
		setValue("c_frac", "0");
		makeDisable("c_frac");
		setValue("alpha_frac", "90");
		makeDisable("alpha_frac");
		setValue("beta_frac", "90");
		makeDisable("beta_frac");
		setValue("gamma_frac", "90");
		makeDisable("gamma_frac");
	} else if (value == "") {
		setValue("a_frac", "");
		makeDisable("a_frac");
		setValue("b_frac", "");
		makeDisable("b_frac");
		setValue("c_frac", "");
		makeDisable("c_frac");
		setValue("alpha_frac", "");
		makeDisable("alpha_frac");
		setValue("beta_frac", "");
		makeDisable("beta_frac");
		setValue("gamma_frac", "");
		makeDisable("gamma_frac");
	}
}

function setCellParamSpaceGroup(spaceGroup) {
	// /from crystal manual http://www.crystal.unito.it/Manuals/crystal09.pdf
	var trimSpaceGroup = null;

	if (spaceGroup.search(/:/) == -1) {
		if (spaceGroup.search(/\*/) == -1) {
			trimSpaceGroup = spaceGroup;
		} else {
			trimSpaceGroup = spaceGroup.substring(0, spaceGroup.indexOf('*'));
		}
	} else {
		trimSpaceGroup = spaceGroup.substring(0, spaceGroup.indexOf(':'));
	}
	switch (true) {

	case ((trimSpaceGroup <= 2)): // Triclinic lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 2) && (trimSpaceGroup <= 15)): // Monoclinic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");
	break;

	case ((trimSpaceGroup > 15) && (trimSpaceGroup <= 74)): // Orthorhombic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 74) && (trimSpaceGroup <= 142)): // Tetragonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;

	case ((trimSpaceGroup > 142) && (trimSpaceGroup <= 167)): // Trigonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");

	break;

	case ((trimSpaceGroup > 167) && (trimSpaceGroup <= 194)): // Hexagonal
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "120.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");

	break;
	case ((trimSpaceGroup > 194) && (trimSpaceGroup <= 230)): // Cubic
		// lattices
		setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "90.000");
	setValue("beta_frac", "90.000");
	setValue("gamma_frac", "90.000");
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeDisable("alpha_frac");
	makeDisable("beta_frac");
	makeDisable("gamma_frac");
	break;

	default:
		errorMsg("SpaceGroup not found in range.");
	return false;
	break;

	}// end switch
}

function createMolecularCrystal() {
	var value = getValue('typeMole')
	if (value == "") {
		errorMsg("You must select which sort of structure you would like to build.")
	} else if (value == "crystal") {
		makeCrystalSpaceGroup = getValue('periodMole');
		getValueMakeCrystal();
	} else {
		getValueMakeCrystal();
	}
}

///TODO SAVE state before creating crystal
function getValueMakeCrystal() {
	reload('{1 1 1} spacegroup "' + makeCrystalSpaceGroup
			+ '" unitcell ' + getCurrentUnitCell() + ';');
	getbyID("createmolecularCrystal").style.display = "none";
}

function makeEnablePeriodicityMol() {
	makeEnable("a_frac");
	makeEnable("b_frac");
	makeEnable("c_frac");
	makeEnable("alpha_frac");
	makeEnable("beta_frac");
	makeEnable("gamma_frac");
	setValue("a_frac", "");
	setValue("b_frac", "");
	setValue("c_frac", "");
	setValue("alpha_frac", "");
	setValue("beta_frac", "");
	setValue("gamma_frac", "");
}

function cleanCreateCrystal() {
	setValue("a_frac", "");
	makeDisable("a_frac");
	setValue("b_frac", "");
	makeDisable("b_frac");
	setValue("c_frac", "");
	makeDisable("c_frac");
	setValue("alpha_frac", "");
	makeDisable("alpha_frac");
	setValue("beta_frac", "");
	makeDisable("beta_frac");
	setValue("gamma_frac", "");
	makeDisable("gamma_frac");
	document.builGroup.reset();
}

function createBuildGrp() {
	var periodicityName = new Array("select", "crystal", "film", "polymer");
	var periodicityValue = new Array("", "crystal", "slab", "polymer");

	var strBuild = "<form autocomplete='nope'  id='builGroup' name='builGroup' style='display:none'>";
	strBuild += "<table class='contents'><tr><td> \n";
	strBuild += "<h2>Build and modify</h2>\n";
	strBuild += "</td></tr>\n";
	/*
	 * strBuild += "<tr><td>\n"; strBuild += "Add new atom/s <i>via</i>
	 * internal coordinates (distance, angle and torsional)<br>" strBuild +=
	 * createCheck("addZnew", "Start procedure",
	 * 'toggleDiv(this,"addAtomZmatrix") + addAtomZmatrix(this)', "", "", "");
	 * strBuild += "<div id='addAtomZmatrix' style='display:none;
	 * margin-top:20px'>"; strBuild += "<br> Element: " + createSelect('addEleZ',
	 * '', 0, 1, 100, eleSymb, eleSymb); strBuild += "<br>"; strBuild +=
	 * createButton("addAtom", "add Atom", "addZatoms()", ""); strBuild += "</div>"
	 * strBuild += createLine('blue', ''); strBuild += "</td></tr>\n";
	 */
	strBuild += "<tr><td>\n";
	strBuild += "Add new atom/s<br>";
	strBuild += createCheck("addNewFrac", "Start procedure",
			'addAtomfrac()  + toggleDiv(this,"addAtomCrystal")', "", "", "");
	strBuild += "<div id='addAtomCrystal' style='display:none; margin-top:20px'>";
	strBuild += "<br> \n ";
	strBuild += "x <input type='text'  name='x_frac' id='x_frac' size='1' class='text'> ";
	strBuild += "y <input type='text'  name='y_frac' id='y_frac' size='1' class='text'> ";
	strBuild += "z <input type='text'  name='z_frac' id='z_frac' size='1' class='text'> ";
	strBuild += ", Element: "
		+ createSelect('addNewFracList', '', 0, 1, eleSymb);
	strBuild += createButton("addNewFracListBut", "add Atom", "addNewatom()",
	"");
	strBuild += "<br><br> Read out coordinates of neighbor atom/s";
	strBuild += createRadio("coord", "fractional", 'viewCoord(value)', '', 0,
			"", "fractional");
	strBuild += createRadio("coord", "cartesian", 'viewCoord(value)', '', 0,
			"", "cartesian");
	strBuild += "</div>";
	strBuild += createLine('blue', '');
	strBuild += "</td></tr>\n";
	strBuild += "<tr><td>\n";
	strBuild += "Create a molecular CRYSTAL, FILM, POLYMER<br>";

	strBuild += createCheck(
			"createCrystal",
			"Start procedure",
			'createCrystalStr(this) + toggleDiv(this,"createmolecularCrystal")  + cleanCreateCrystal()',
			"", "", "");
	strBuild += "<div id='createmolecularCrystal' style='display:none; margin-top:20px'>";
	strBuild += "<br> Periodicity: "
		+ createSelect('typeMole', 'checkIfThreeD(value)', 0, 1,
				periodicityValue, periodicityName);
	strBuild += "<br> Space group: "
		+ createSelect('periodMole', 'setCellParamSpaceGroup(value)', 0, 1,
				spaceGroupValue, spaceGroupName)
				+ " <a href=http://en.wikipedia.org/wiki/Hermann%E2%80%93Mauguin_notation target=_blank>Hermann-Mauguin</a>"; // space
	// group
	// list
	// spageGroupName
	strBuild += "<br> Cell parameters: <br><br>";
	strBuild += "<i>a</i> <input type='text'  name='a_frac' id='a_frac' size='7' class='text'> ";
	strBuild += "<i>b</i> <input type='text'  name='b_frac' id='b_frac' size='7' class='text'> ";
	strBuild += "<i>c</i> <input type='text'  name='c_frac' id='c_frac' size='7' class='text'> ";
	strBuild += " &#197; <br>";
	strBuild += "<i>&#945;</i> <input type='text'  name='alpha_frac' id='alpha_frac' size='7' class='text'> ";
	strBuild += "<i>&#946;</i> <input type='text'  name='beta_frac' id='beta_frac' size='7' class='text'> ";
	strBuild += "<i>&#947;</i> <input type='text'  name='gamma_frac' id='gamma_frac' size='7' class='text'> ";
	strBuild += " degrees <br><br> "
		+ createButton("createCrystal", "Create structure",
				"createMolecularCrystal()", "") + "</div>";
	strBuild += createLine('blue', '');
	strBuild += "</td></tr>\n";
	strBuild += "<tr><td>\n";
	strBuild += "Optimize (OPT.) structure  UFF force filed<br>";
	strBuild += "Rappe, A. K., <i>et. al.</i>; <i>J. Am. Chem. Soc.</i>, 1992, <b>114</b>, 10024-10035. <br><br>";
	strBuild += createButton("minuff", "Optimize", "minimizeStructure()", "");
	strBuild += createCheck("fixstructureUff", "fix fragment",
			'fixFragmentUff(this) + toggleDiv(this,"fragmentSelected")', "",
			"", "")
			+ " ";
	strBuild += createButton("stopuff", "Stop Opt.", "stopOptimize()", "");
	strBuild += createButton("resetuff", "Reset Opt.", "resetOptimize()", "");
	strBuild += "</td></tr><tr><td><div id='fragmentSelected' style='display:none; margin-top:20px'>Fragment selection options:<br>";
	// strBuild += "by element "
	// + createSelectKey('colourbyElementList', "elementSelected(value)",
	// "elementSelected(value)", "", 1) + "\n";
	// strBuild += "&nbsp;by atom &nbsp;"
	// + createSelect2('colourbyAtomList', 'atomSelected(value)', '', 1)
	// + "\n";
	strBuild += createCheck("byselection", "by picking &nbsp;",
			'setPicking(this)', 0, 0, "set picking");
	strBuild += createCheck("bydistance", "within a sphere (&#197) &nbsp;",
			'setDistanceHide(this)', 0, 0, "");
	strBuild += createCheck("byplane", " within a plane &nbsp;",
			'onClickPickPlane(this,buildPickPlaneCallback)', 0, 0, "");
	strBuild += "</div>";
	strBuild += "</td></tr><tr><td>\n";
	strBuild += "<br> Structural optimization criterion: <br>";
	strBuild += "Opt. threshold <input type='text'  name='optciteria' id='optciteria' size='7'  value='0.001' class='text'> kJ*mol<sup>-1</sup> (Def.: 0.001, Min.: 0.0001) <br>";
	strBuild += "Max. No. Steps <input type='text'  name='maxsteps' id='maxsteps' size='7'  value='100' class='text'> (Def.: 100)";
	strBuild += "<tr><td>";
	strBuild += "<br> Optimization Output: <br>";
	strBuild += createTextArea("textUff", "", 4, 50, "");
	strBuild += createLine('blue', '');
	strBuild += "</td></tr>\n";
	strBuild += "</table>\n";
	strBuild += "</form>\n";
	return strBuild;
}


