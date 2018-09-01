/*  J-ICE library 
 *
 *  based on:
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

/*
 LAST CHANGES
 22nd 04 - 2012 Piero Canepa
 */

//Common variables 
function defineMenu() {
	var tl;
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "File"; // Name that will appear on the tab
	tabMenu[tl].grp = "fileGroup"; // Name of the form that is displayed
	// If atom picking is active or not (not used)
	tabMenu[tl].link = "Import, Export files.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "App.";
	tabMenu[tl].grp = "apparenceGroup";
	tabMenu[tl].link = "Change atom, bond clours and dimensions.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Edit";
	tabMenu[tl].grp = "editGroup";
	tabMenu[tl].link = "Change connectivity and remove atoms.";

	// added the 11th 11 2010
	// Last removed Sat Jul 5 08:52:31 AST 2014
/*	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Build";
	tabMenu[tl].grp = "builGroup";
	tabMenu[tl].link = "Modify and optimize structure.";*/

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Meas.";
	tabMenu[tl].grp = "measureGroup";
	tabMenu[tl].link = "Measure bond distances, angles and torsionals.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Orient.";
	tabMenu[tl].grp = "orientGroup";
	tabMenu[tl].link = "Change orientations and views.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Cell";
	tabMenu[tl].grp = "cellGroup";
	tabMenu[tl].link = "Modify cell features and simmetry.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Poly.";
	tabMenu[tl].grp = "polyGroup";
	tabMenu[tl].link = "Create polyhedra.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "IsoSur.";
	tabMenu[tl].grp = "isoGroup";
	tabMenu[tl].link = "Modify from CUBE files and create isosurface map.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Geom.";
	tabMenu[tl].grp = "geometryGroup";
	tabMenu[tl].link = "Follow geometry optimizations.";
	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Freq.";
	tabMenu[tl].grp = "freqGroup";
	tabMenu[tl].link = "Animate IR/Raman frequencies and simulate spectra.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "E&M";
	tabMenu[tl].grp = "elecGroup";
	tabMenu[tl].link = "Superimpose Mulliken charges, spin, magnetic moment onto your structure.";

	//
	tl = tabMenu.length;
	tabMenu[tl] = new menu();
	tabMenu[tl].name = "Main";
	tabMenu[tl].grp = "otherpropGroup";
	tabMenu[tl].link = "Change background, light settings and other.";
	/*
	 * tl=tabMenu.length; tabMenu[tl]= new menu(); tabMenu[tl].name="History";
	 * tabMenu[tl].grp="HistoryGroup";
	 */
}

//////////////////////////create Grp functions (for each menu)
///////////////////////////// create File Grp
function createFileGrp() { // Here the order is crucial
	var elOptionArr = new Array("default", "loadC", "reload", "loadcif",
			"loadxyz", "loadOutcastep", "loadcrystal", "loadDmol",
			"loadaimsfhi", "loadgauss", "loadgromacs", "loadGulp",
			"loadmaterial", "loadMolden", "loadpdb", "loadQuantum",
			"loadSiesta", "loadShel", "loadVASPoutcar", "loadVasp", "loadWien",
			"loadXcrysden", "loadCUBE", "loadJvxl", "loadstate");
	var elOptionText = new Array("Load New FILE", "General (*.*)",
			"Reload current", "CIF (*.cif)", "XYZ (*.XYZ)",
			"CASTEP (INPUT, OUTPUT)", "CRYSTAL (*.*)", "Dmol (*.*)",
			"FHI-aims (*.in)", "GAUSSIAN0X (*.*)", "GROMACS (*.gro)",
			"GULP (*.gout)", "Material Studio (*.*)", "Molden, QEfreq (*.*)",
			"PDB (*.pdb)", "QuantumESPRESSO (*.*)", "Siesta (*,*)",
			"ShelX (*.*)", "VASP (OUTCAR, POSCAR)", "VASP (*.xml)",
			"WIEN2k (*.struct)", "Xcrysden (*.xtal)", "map (*.CUBE)",
			"map (*.jvxl)", "Jmol state (*.spt,*.png)");
	var strFile = "<form id='fileGroup' name='fileGroup' style='display:inline' class='contents'>\n";
	strFile += "<h2>File manager</h2>\n";
	strFile += "Load File<BR>\n";
	strFile += createListmenu('Load File', 'onChangeLoad(value)', 0, 1,
			elOptionArr, elOptionText);
	strFile += "<BR><BR>\n";
	strFile += "Export/Save File<BR>\n";
	// Save section
	var elSOptionArr = new Array("default", "saveCASTEP", "saveCRYSTAL",
			"saveGULP", "saveGROMACS", "saveQuantum", "saveVASP", "saveXYZ",
			"saveFrac", /* "savefreqHtml", */"savePNG", "savepdb", "savePOV",
	"saveState", "savePNGJ");
	var elSOptionText = new Array("Export File", "CASTEP (*.cell)",
			"CRYSTAL (*.d12)", "GULP (*.gin)", "GROMACS (*.gro)",
			"PWscf QuantumESPRESSO (*.inp)", "VASP (POSCAR)", "XYZ (*.XYZ)",
			"frac. coord. (*.XYZfrac)",
			// "save Frequencies HTML (*.HTML)",
			"image PNG (*.png)", "coordinates PDB (*.PDB)",
			"image POV-ray (*.pov)", "current state (*.spt)", "image+state (PNGJ)");
	strFile += createListmenu('Export File', 'onChangeSave(value)', 0, 1,
			elSOptionArr, elSOptionText);
	strFile += "<p ><img src='images/j-ice.png' alt='logo'/></p>";
	strFile += "<p style='color:#f00; font-weight:bold'>New readers <br> CASTEP, VASP POSCAR, and XcrysDen</p>";
	strFile += "<div style='margin-top:230px;'><p style='color:#000'> <b style='color:#f00'>Please DO CITE:</b>";
	strFile += "<blockquote>\"J-ICE: a new Jmol interface for handling<br> and visualizing Crystallographic<br> and Electronics properties.<br>"
	strFile += "P. Canepa, R.M. Hanson, P. Ugliengo, M. Alfredsson, <br>  J. Appl. Cryst. 44, 225 (2011). <a href='http://dx.doi.org/10.1107/S0021889810049411' target'blank'>[doi]</a> \"</blockquote> </p></div>";
	
	strFile += "<div style='margin-top:10px;'><b style='color:#f00'>JAVA compatibility:</b><br>User who installed the last Java Virtual Machine (JVM 8.0) ";
	strFile += "<br>please follow these instructions to execute J-ICE. <a href='https://www.java.com/en/download/faq/exception_sitelist.xml' target='blank'>here</a></div>"
	strFile += "</form>\n";
	return strFile;
}

///////////////////////////// create Appearance Grp
function createAppearanceGrp() {
	var colorBondsName = new Array("select", "atom", "bond");
	var dotName = new Array("select", "1", "2", "3", "4");
	var strApp = "<form id='apparenceGroup' name='apparenceGroup' style='display:none' >";
	strApp += "<table class='contents'><tr><td colspan='2'>\n";
	strApp += "<h2>Structure Appearance</h2>\n";
	strApp += "Select atom/s by:</td><tr>\n";
	strApp += "<tr><td colspan='2'>";
	strApp += "by element "
		+ createListKey("colourbyElementList", "elementSelected(value)",
				"elementSelected(value)", "", 1) + "\n";
	// strApp += "&nbsp by atom &nbsp"
	// + createList2('colourbyAtomList', 'atomSelected(value)', '', 1)
	// + "\n";
	strApp += createCheck("byselection", "&nbsp by picking &nbsp",
			'setPicking(this)', 0, 0, "set picking");

	strApp += createCheck("bydistance", "within a sphere (&#197); &nbsp",
			'setDistancehidehide(this)', 0, 0, "");
	strApp += "</td></tr><tr><td colspan='2'>\n";
	strApp += createCheck("byplane", "&nbsp within a plane &nbsp",
			'setPlanehide(this)', 0, 0, "");
	strApp += "</td></tr><tr><td colspan='2'>\n";
	strApp += createButton('select All', 'select All', 'selectAll()', '')
	+ "\n";
	strApp += createButton('unselect', 'unselect All',
			'setV("select *; halos off; label off ; draw off")', '')
			+ "\n";
	strApp += createButton('halooff', 'Halo/s off',
			'setV("halos off; selectionhalos off; draw off" )', '')
			+ "\n";
	strApp += createButton('label All', 'Label All',
			'setV("select *; label on; draw off")', '')
			+ "\n";
	strApp += createButton('label off', 'Label off',
			'setV("select *; label off; draw off")', '')
			+ "\n";
	strApp += createLine('blue', '');
	strApp += "</td></tr><tr><td colspan='2'>\n";
	strApp += "Atom/s & bond/s style</td></tr> \n";
	strApp += "<tr><td > \n";
	strApp += "Atom/s colour: "
		+ createButton("Atomcolor", "Default colour",
				'setV("select *; color Jmol; draw off")', 0);
	strApp += "</td><td align='left'><script type='text/javascript'>\n";
	strApp += "var colorScript = [setAtomColor, 'atomColor'];";
	strApp += 'jmolColorPickerBox(colorScript, "");';
	strApp += "</script> </td></tr>";
	strApp += "<tr><td>Bond colour: "
		+ createButton("bondcolor", "Default colour",
				'setV(" color bonds Jmol")', 0);
	strApp += "</td><td align='left'> <script type='text/javascript'> jmolColorPickerBox('select *; color bond $COLOR$',[255,255,255])</script></td>";
	strApp += "</td></tr>";
	strApp += "<tr><td colspan='2'> Atom/s & bond/s finish \n";
	strApp += createRadio(
			"abFashion",
			"opaque",
			'toggleDivRadioTrans(value,"transulcencyDiv") + setV("color " +  getValue("setFashion") + " OPAQUE")',
			0, 1, "on", "on")
			+ "\n";
	strApp += createRadio(
			"abFashion",
			"translucent",
			'toggleDivRadioTrans(value,"transulcencyDiv") + setV("color " +  getValue("setFashion") + " TRANSLUCENT")',
			0, 0, "off", "off")
			+ "\n";
	strApp += createList('setFashion', '', 0, 1, colorBondsName)
			+ "\n";
	strApp += "</td></tr>"
		strApp += "<tr><td><div id='transulcencyDiv' style='display:none; margin-top:20px'>	";
	strApp += '<div tabIndex="1" class="slider" id="transSlider" style="float:left;width:150px;" >';
	strApp += '<input class="slider-input" id="transSlider-input" name="transSlider-input" />';
	strApp += '</div><div id="transMsg" class="msgSlider"></div></div>';
	strApp += "</td></tr><tr><td>";
	strApp += "Dot surface ";
	strApp += createList('setDot',
			'setV("dots on; set dotScale " + value + "; draw off")', 0, 1,
			dotName);
	strApp += createRadio("dotStyle", "off", 'setV("dots off")', 0, 0, "off",
	"off");
	strApp += createLine('blue', '');
	strApp += "</td></tr>\n";
	strApp += "<tr><td colspan='2'> Atom/s & bond/s Size<br> \n";
	strApp += createButton('Stick & Ball', 'Stick & Ball', 'onClickBS()', '')
	+ " \n";
	strApp += createButton('Stick', 'Stick', 'onStickClick()', '') + " \n";
	strApp += createButton('Ball', 'Ball', 'onClickBall()', '') + "\n";
	strApp += createButton('CPK', 'CPK', 'onClickCPK()', '') + " \n";
	strApp += createButton('ionic', 'Ionic', 'onClickionic()', '') + "\n";
	strApp += createCheck("wireframe", "wire",
			"setVCheckbox(this, this.value)", 0, 1, "wireframe; draw off");

	strApp += "</td></tr>";
	strApp += "<tr><td >";
	strApp += "wireframe";
	strApp += "</td><td>"
		strApp += '<div tabIndex="1" class="slider" id="bondSlider" style="float:left;width:150px;" >';
	strApp += '<input class="slider-input" id="bondSlider-input" name="bondSlider-input" />';
	strApp += '</div><div id="bondMsg" class="msgSlider"></div>';
	strApp += "</td></tr>";
	strApp += "<tr><td >";
	strApp += "vdW radii";
	strApp += "</td><td>";
	strApp += '<div tabIndex="1" class="slider" id="radiiSlider" style="float:left;width:150px;" >';
	strApp += '<input class="slider-input" id="radiiSlider-input" name="radiiSlider-input" />';
	strApp += '</div><div id="radiiMsg" class="msgSlider"></div>';
	strApp += "</td></tr>";
	strApp += "<tr><td colspan='2'>";
	strApp += createLine('blue', '');
	strApp += "H-bonds: "
		+ createRadio("H-bond", "on", 'setV("script ./scripts/hbond.spt")',
				0, 0, "") + "\n";
	strApp += createRadio("H-bond", "off",
			'setV("script ./scripts/hbond_del.spt")', 0, 1, "")
			+ "\n";
	strApp += " / solid H-bond"
		+ createRadio("dash", " on", 'setV("set hbondsSolid TRUE")', 0, 0,
		"") + "\n";
	strApp += createRadio("dash", "off", 'setV("set hbondsSolid FALSE")', 0, 1,
	"")
	+ "\n";
	strApp += "</td></tr><tr><td>H-bond colour: "
		+ createButton("bondcolor", "Default colour",
				'setV("color HBONDS none")', 0) + "</td><td>\n";
	strApp += "<script type='text/javascript' align='left'>jmolColorPickerBox('color HBONDS $COLOR$',[255,255,255])</script>";
	strApp += "</td></tr><tr><td colspan='2'> \n";
	strApp += "View / Hide Hydrogen/s "
		+ createCheck("hydrogenView", "", "setVCheckbox(this, this.value)",
				0, 1, "set showHydrogens") + "\n";
	strApp += "</td></tr></table> \n";
	strApp += createLine('blue', '');
	strApp += "</form>\n";
	return strApp;
}

///////////////////////////// edit Group
function createEditGroup() {
	var bondValue = new Array("select", "single", "partial", "hbond", "double",
			"aromatic", "partialDouble", "triple", "partialTriple",
	"parialTriple2");
	var strEdit = "<form id='editGroup' name='editGroup' style='display:none'>";
	strEdit += "<table class='contents'><tr><td > \n";
	strEdit += "<h2>Edit structure</h2>\n";
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td>\n";
	strEdit += "Select atom/s by:\n";
	strEdit += "</td><tr>\n";
	strEdit += "<tr><td colspan='2'>";
	strEdit += "by element "
		+ createList2(
				"deletebyElementList",
				"elementSelectedDelete(value) + elementSelectedHide(value) ",
				false, 1) + "\n";
	// strEdit += "&nbsp by atom &nbsp"
	// + createList2('deltebyAtomList',
	// 'atomSelectedDelete(value) + atomSelectedHide(value) ', '',
	// 1) + "\n";
	strEdit += createCheck("byselection", "&nbsp by picking &nbsp",
			'setPickingDelete(this) + setPickingHide(this)', 0, 0, "");
	;
	strEdit += createCheck("bydistance", "within a sphere (&#197); &nbsp",
			'setDistancehidehide(this)', 0, 0, "");
	strEdit += "</td></tr><tr><td colspan='2'>\n"
		strEdit += createCheck("byplane", "&nbsp within a plane &nbsp",
				'setPlanehide(this)', 0, 0, "");
	strEdit += "</td></tr><tr><td colspan='2'>\n";
	strEdit += createButton('select All', 'select All',
			'selectAllDelete()  + selectAllHide()', '')
			+ "\n";
	strEdit += createButton('unselect', 'unselect All',
			'setV("select *; halos off; label off")', '')
			+ "\n";
	strEdit += createButton('halooff', 'Halo/s off',
			'setV("halos off; selectionhalos off" )', '')
			+ "\n";
	strEdit += createButton('label All', 'Label All',
			'setV("select *; label on")', '')
			+ "\n";
	strEdit += createButton('label off', 'Label off',
			'setV("select *; label off")', '')
			+ "\n";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += "Rename atom/s<br>";
	strEdit += "Element Name ";
	strEdit += createList('renameEle', 'changeElement(value)', 0, 1,
			eleSymb);
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += "Remove / hide atom/s <br>";
	strEdit += createButton('Delete atom', 'Delete atom/s', 'deleteAtom()', '')
	+ "\n";
	strEdit += createButton('Hide atom/s', 'Hide atom/s', 'hideAtom()', '')
	+ "\n";
	strEdit += createButton('Display atom', 'Display hidden atom/s',
			'setV("select hidden; display")', '')
			+ "\n";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td >";
	strEdit += "Connectivity</a>";
	strEdit += "</td><td>";
	strEdit += '<div tabIndex="1" class="slider" id="radiiConnect" style="float:left;width:150px;" >';
	strEdit += '<input class="slider-input" id="radiiConnect-input" name="radiiConnect-input" />';
	strEdit += '</div><div id="radiiConnectMsg" class="msgSlider"></div>';
	strEdit += '<br>'
		+ createCheck('allBondconnect', 'apply to all structures', '', 0,
				1, '');
	strEdit += "</td></tr>";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += createButton('advanceEdit', '+',
			'toggleDivValue(true,"advanceEditDiv")', '')
			+ " Advanced options <br>"
			strEdit += "<div id='advanceEditDiv' style='display:none; margin-top:20px'>";
	strEdit += "Connect by:\n";
	strEdit += createRadio("connect", "selection", 'checkBondStatus(value)', 0,
			0, "connect", "selection");
	strEdit += createRadio("connect", "by element", 'checkBondStatus(value)',
			0, 0, "connect", "atom");
	strEdit += createRadio("connect", "all", 'checkBondStatus(value)', 0, 0,
			"connect", "all")
			+ "<br>\n";
	strEdit += "From " + createList2("connectbyElementList", "", false, 1) + " ";
	strEdit += "To " + createList2("connectbyElementListone", "", false, 1)
	+ "<br>\n";
	strEdit += "Mode "
		+ createRadio("range", "whithin", 'checkWhithin(value)', 'disab',
				0, "range", "just");
	strEdit += createRadio("range", "whithin a range", 'checkWhithin(value)',
			'disab', 0, "range", "range")
			+ "<br>\n";
	strEdit += "From / whithin "
		+ createText2("radiuscoonectFrom", "", "2", "disab") + " ";
	strEdit += " to " + createText2("radiuscoonectTo", "", "2", "disab")
	+ " &#197;";
	strEdit += "<br> Style bond "
		+ createList('setBondFashion', '', 0, 1, bondValue) + "<br> \n";
	strEdit += createButton('connect2', 'Connect atom', 'connectAtom()', '');
	strEdit += createButton('connect0', 'Delete bond', 'deleteBond()', '')
	+ "<br>\n";
	strEdit += "</div>";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "</table></FORM>\n";
	return strEdit;
}

//////////////////////////////create BuildGroup
function createBuildGroup() {
	var periodicityName = new Array("select", "crystal", "film", "polymer");
	var periodicityValue = new Array("", "crystal", "slab", "polymer");

	var strBuild = "<form id='builGroup' name='builGroup' style='display:none'>";
	strBuild += "<table class='contents'><tr><td> \n";
	strBuild += "<h2>Build and modify</h2>\n";
	strBuild += "</td></tr>\n";
	/*
	 * strBuild += "<tr><td>\n"; strBuild += "Add new atom/s <i>via</i>
	 * internal coordinates (distance, angle and torsional)<br>" strBuild +=
	 * createCheck("addZnew", "Start procedure",
	 * 'toggleDiv(this,"addAtomZmatrix") + addAtomZmatrix(this)', "", "", "");
	 * strBuild += "<div id='addAtomZmatrix' style='display:none;
	 * margin-top:20px'>"; strBuild += "<br> Element: " + createList('addEleZ',
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
		+ createList('addNewFracList', '', 0, 1, eleSymb);
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
		+ createList('typeMole', 'checkIfThreeD(value)', 0, 1,
				periodicityValue, periodicityName);
	strBuild += "<br> Space group: "
		+ createList('periodMole', 'setCellParamSpaceGroup(value)', 0, 1,
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
	// + createListKey("colourbyElementList", "elementSelected(value)",
	// "elementSelected(value)", "", 1) + "\n";
	// strBuild += "&nbsp by atom &nbsp"
	// + createList2('colourbyAtomList', 'atomSelected(value)', '', 1)
	// + "\n";
	strBuild += createCheck("byselection", "by picking &nbsp",
			'setPicking(this)', 0, 0, "set picking");
	strBuild += createCheck("bydistance", "within a sphere (&#197) &nbsp",
			'setDistancehidehide(this)', 0, 0, "");
	strBuild += createCheck("byplane", " within a plane &nbsp",
			'setPlanehide(this)', 0, 0, "");
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

/////////////////////////////Measure Group

function createMeasureGroup() {
	var measureName = new Array("select", "Angstroms", "Bohr", "nanometers",
	"picometers");
	var measureValue = new Array("select", "angstroms", "BOHR", "nm", "pm");
	var textValue = new Array("0", "6", "8", "10", "12", "16", "20", "24", "30");
	var textText = new Array("select", "6 pt", "8 pt", "10 pt", "12 pt",
			"16 pt", "20 pt", "24 pt", "30 pt");
	
	var strMeas = "<form id='measureGroup' name='measureGroup' style='display:none'>";
	strMeas += "<table class='contents'><tr><td > \n";
	strMeas += "<h2>Measure and Info</h2>\n";
	strMeas += "</td></tr>\n";
	strMeas += "<tr><td colspan='2'>\n";
	strMeas += "Measure<br>\n";
	strMeas += createRadio("distance", "distance", 'checkMeasure(value)', '',
			0, "", "distance");
	strMeas += createListFunc('measureDist', 'setMeasureUnit(value)',
			'setTimeout("setMeasureUnit(value) ",50)', 0, 1, measureValue,
			measureName)
			+ " ";
	strMeas += createRadio("distance", "angle", 'checkMeasure(value)', '', 0,
			"", "angle");
	strMeas += createRadio("distance", "torsional", 'checkMeasure(value)', '',
			0, "", "torsional");
	strMeas += "<br><br> Measure value: <br>"
		+ createTextArea("textMeasure", "", 4, 40, "");
	strMeas += "<br>"
		+ createButton('resetMeasure', 'Delete Measure/s', 'mesReset()', '')
		+ "<br>";
	strMeas += "</td></tr>\n";
	strMeas += "<tr><td>Measure colour: "
		+ createButton("colorMeasure", "Default colour",
				'setV("color measures none")', 0) + "</td><td >\n";
	strMeas += "<script type='text/javascript' align='left'>jmolColorPickerBox('color measures $COLOR$',[255,255,255])</script>";
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += "View coordinates: ";
	strMeas += createRadio("coord", "fractional", 'viewCoord(value)', '', 0,
			"", "fractional");
	strMeas += createRadio("coord", "cartesian", 'viewCoord(value)', '', 0, "",
	"cartesian");
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "<tr><td colspan='2'>";
	strMeas += "Font size ";
	strMeas += createList("fSize", "setMeasureSize(value)", 0, 1,
			textValue, textText);
	strMeas += createLine('blue', '');
	strMeas += "</td></tr>";
	strMeas += "</table></FORM>  \n";
	return strMeas;
}

//////////////////////////////create orientationGroup

function createOrientGrp() {
	var motionValueName = new Array("select", "translate", "rotate");
	var strOrient = "<form id='orientGroup' name='orientGroup' style='display:none'>\n";
	strOrient += "<table class='contents' ><tr><td><h2>Orientation and Views</td><tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Spin "
		+ createRadio("spin", "x", 'setV("spin x")', 0, 0, "", "") + "\n";
	strOrient += createRadio("spin", "y", 'setV("spin y")', 0, 0, "", "")
	+ "\n";
	strOrient += createRadio("spin", "z", 'setV("spin z")', 0, 0, "", "")
	+ "\n";
	strOrient += createRadio("spin", "off", 'setV("spin off")', 0, 1, "", "")
	+ "\n";
	strOrient += createLine('blue', '');
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Zoom " + createButton('in', 'in', 'setV("zoom in")', '')
	+ " \n";
	strOrient += createButton('out', 'out', 'setV("zoom out")', '') + " \n";
	strOrient += createLine('blue', '');
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "View from"
		+ createButton('top', 'top', 'setV("moveto  0 1 0 0 -90")', '')
		+ " \n";
	strOrient += createButton('bottom', 'bottom', 'setV("moveto  0 1 0 0 90")',
	'')
	+ " \n";
	strOrient += createButton('left', 'left', 'setV("moveto  0 0 1 0 -90")', '')
	+ " \n";
	strOrient += createButton('right', 'right', 'setV("moveto  0 0 1 0 90")',
	'')
	+ " \n";
	strOrient += "<br> Orient along ";
	strOrient += createButton(
			'a',
			'a',
			'setV("moveto 1.0 front;var axisA = {1/1 0 0};var axisZ = {0 0 1};var rotAxisAZ = cross(axisA,axisZ);var rotAngleAZ = angle(axisA, {0 0 0}, rotAxisAZ, axisZ);moveto 1.0 @rotAxisAZ @{rotAngleAZ};var thetaA = angle({0 0 1}, {0 0 0 }, {1 0 0}, {1, 0, 1/});rotate z @{0-thetaA};")',
	'');
	strOrient += createButton(
			'b',
			'b',
			'setV("moveto 1.0 front;var axisB = {0 1/1 0};var axisZ = {0 0 1};var rotAxisBZ = cross(axisB,axisZ);var rotAngleBZ = angle(axisB, {0 0 0}, rotAxisBZ, axisZ);moveto 1.0 @rotAxisBZ @{rotAngleBZ}")',
	'');
	strOrient += createButton(
			'c',
			'c',
			'setV("moveto 1.0 front;var axisC = {0 0 1/1};var axisZ = {0 0 1};var rotAxisCZ = cross(axisC,axisZ);var rotAngleCZ = angle(axisC, {0 0 0}, rotAxisCZ, axisZ);moveto 1.0 @rotAxisCZ @{rotAngleCZ}")',
	'');
	strOrient += createLine('blue', '');
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Z-Clip functions<br>"
		+ createCheck("slabToggle", "Z-clip", 'toggleSlab()', 0, 0,
		"slabToggle");
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Front";
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += '<div tabIndex="1" class="slider" id="slabSlider" style="float:left;width:150px;" >';
	strOrient += '<input class="slider-input" id="slabSlider-input" name="slabSlider-input" />';
	strOrient += '</div><div id="slabSliderMsg" class="msgSlider"></div>';
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Back";
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += '<div tabIndex="1" class="slider" id="depthSlider" style="float:left;width:150px;" >';
	strOrient += '<input class="slider-input" id="depthSlider-input" name="depthSlider-input" />';
	strOrient += '</div><div id="depthSliderMsg" class="msgSlider"></div>';
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += createLine('blue', '');
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td>\n";
	strOrient += "Fine orientation\n";
	strOrient += "<table class='contents'> \n";
	strOrient += "<tr><td colspan='3'>Motion "
		+ createListFunc('setmotion', 'setKindMotion(value)',
				'setTimeout("setKindMotion(value)",50)', 0, 1,
				motionValueName, motionValueName);
	strOrient += " magnitude\n";
	strOrient += "<input type='text' value='5' class='text' id='fineOrientMagn' size='3'> &#197 / degree;";
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td colspan='2'> ";
	strOrient += createCheck(
			"moveByselection",
			"move only slected atom/s",
			"checkBoxStatus(this, 'byElementAtomMotion')  + checkBoxStatus(this, 'byAtomMotion')",
			0, 0, "moveByselection");
	strOrient += "</td></tr>\n";
	strOrient += "<tr><td colspan='2'> ";
	strOrient += "by element "
		+ createList2("byElementAtomMotion", "elementSelected(value)", false, 1) + "\n";
	// strOrient += "&nbsp by atom &nbsp"
	// + createList2('byAtomMotion', 'atomSelected(value)', '', 1) + "\n";
	strOrient += createCheck("byselectionOrient", "&nbsp by picking &nbsp",
			'setPicking(this)', 0, 0, "set picking");
	strOrient += "</td></tr><tr><td colspan='2'>\n";
	strOrient += createButton('select All', 'select All', 'selectAll()', '')
	+ "\n";
	strOrient += createButton('unselect', 'unselect All',
			'setV("select *; halos off; label off")', '')
			+ "\n";
	strOrient += createButton('halooff', 'Halo/s off',
			'setV("halos off; selectionhalos off" )', '')
			+ "\n";
	strOrient += createButton('label All', 'Label All',
			'setV("select *; label on")', '')
			+ "\n";
	strOrient += createButton('label off', 'Label off',
			'setV("select *; label off")', '')
			+ "\n";
	strOrient += "</td></tr><td ><tr>\n";
	strOrient += "<table >\n";
	strOrient += "<tr><td>"
		+ createButton2('-x', '-x', 'setMotion(id)', '', 'width:40px;')
		+ "</td><td>\n";
	strOrient += createButton2('x', '+x', 'setMotion(id)', '', 'width:40px;')
	+ "</td></tr>\n";
	strOrient += "<tr><td>"
		+ createButton2('-y', '-y', 'setMotion(id)', '', 'width:40px;')
		+ "</td><td>\n";
	strOrient += createButton2('y', '+y', 'setMotion(id)', '', 'width:40px;')
	+ "</td></tr>\n";
	strOrient += "<tr><td>"
		+ createButton2('-z', '-z', 'setMotion(id)', '', 'width:40px;')
		+ "</td><td>\n";
	strOrient += createButton2('z', '+z', 'setMotion(id)', '', 'width:40px;')
	+ "</td></tr>\n";
	strOrient += "</table> \n";
	strOrient += "<tr><td>\n";
	strOrient += "</td></tr>\n";
	strOrient += "</table>\n";
	strOrient += createLine('blue', '');
	strOrient += "</form>\n";
	return strOrient;
}

///////////////////////////// create cellGroup

function createCellGrp() {
	var unitcellName = new Array("0 0 0", "1/2 1/2 1/2", "1/2 0 0", "0 1/2 0",
			"0 0 1/2", "-1/2 -1/2 -1/2", "1 1 1", "-1 -1 -1", "1 0 0", "0 1 0",
	"0 0 1");
	var unitcellSize = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9",
			"10", "11", "12", "13", "14", "15", "16", "17", "18", "19");
	var strCell = "<form id='cellGroup' name='cellGroup' style='display:none'>";
	strCell += "<table class='contents'><tr><td><h2>Cell properties</h2></td></tr>\n";
	strCell += "<tr><td colspan='2'>"
		+ createCheck("cell", "View Cell",
				"setVCheckbox(this, this.value)", 0, 1, "unitcell");
	strCell += createCheck("axes", "View axes",
			"setVCheckbox(this, this.value)", 0, 1, "set showAxes");
	strCell += "</td></tr><tr><td> Cell style:  \n";
	strCell += "size "
		+ createListFunc('offsetCell',
				'setV("set unitcell " + value + ";")',
				'setTimeout("setV("set unitcell " + value +";")",50)', 0,
				1, unitcellSize, unitcellSize) + "\n";
	strCell += " dotted "
		+ createCheck("cellDott", "dotted, ", "setCellDotted()", 0, 0,
		"DOTTED") + "  color ";
	strCell += "</td><td align='left'>\n";
	strCell += "<script type='text/javascript' align='left'>jmolColorPickerBox('set unitCellColor \"$COLOR$\"',[000,000,000])</script>";
	strCell += "</td></tr>\n";
	// strCell += createLine('blue', '');
	strCell += "<tr><td colspan='2'>Set cell:  \n";

	strCell += createRadio("cella", "primitive", 'setCellType(value)', 0, 1,
			"primitive", "primitive")
			+ "\n";
	strCell += createRadio("cella", "conventional", 'setCellType(value)', 0, 0,
			"conventional", "conventional")
			+ "\n";
	strCell += "</td></tr>\n";
	strCell += "<tr><td> \n";
	strCell += createCheck('superPack', 'Auto Pack', 'uncheckPack()', 0, 1, '')
	+ " ";
	strCell += createCheck('chPack', 'Choose Pack Range',
			'checkPack() + toggleDiv(this,"packDiv")', '', '', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td> \n";
	strCell += "<div id='packDiv' style='display:none; margin-top:30px'>";
	strCell += '<div tabIndex="1" class="slider" id="packSlider" style="float:left;width:150px;" >';
	strCell += '<input class="slider-input" id="packSlider-input" name="packSlider-input" />';
	strCell += '</div><div id="packMsg" class="msgSlider"></div></div></div>';
	strCell += "</td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += createLine('blue', '');
	strCell += "Supercell: <br>";
	strCell += "</td></tr><tr><td colspan='2'>\n";
	strCell += "<i>a: </i>";
	strCell += "<input type='text'  name='par_a' id='par_a' size='1' class='text'>";
	strCell += "<i> b: </i>";
	strCell += "<input type='text' name='par_b' id='par_b' size='1' class='text'>";
	strCell += "<i> c: </i>";
	strCell += "<input type='text'  name='par_c' id='par_c' size='1' class='text'> &#197;";
	strCell += createCheck('supercellForce', 'force supercell (P1)', '', '',
			'', '')
			+ "<br>\n";
	strCell += createButton('set_pack', 'pack', 'setPackaging()', '') + " \n";
	strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += "Offset unitcell \n<br>";
	strCell += "Common sets "
		+ createListFunc('offsetCell', 'setUnitCellOrigin(value)',
				'setTimeout("setUnitCellOrigin(value)",50)', 0, 1,
				unitcellName, unitcellName) + "\n";
	strCell += "<br>  \n"
		strCell += createButton('advanceCelloffset', '+',
				'toggleDivValue(true,"advanceCelloff")', '')
				+ " Advanced cell-offset options <br>"
				strCell += "<div id='advanceCelloff' style='display:none; margin-top:20px'>"
					+ createCheck("manualCellset", "Manual set",
							'checkBoxStatus(this, "offsetCell")', 0, 0, "manualCellset")
							+ "\n";
	strCell += " x: ";
	strCell += "<input type='text'  name='par_x' id='par_x' size='3' class='text'>";
	strCell += " y: ";
	strCell += "<input type='text'  name='par_y' id='par_y' size='3' class='text'>";
	strCell += " z: ";
	strCell += "<input type='text'  name='par_z' id='par_z' size='3' class='text'>";
	strCell += createButton('setnewOrigin', 'set', 'setManualOrigin()', '')
	+ " \n";
	strCell += "</div>";
	strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr ><td colspan='2'>\n";
	strCell += "Cell parameters (selected model)<br>\n";
	strCell += "Unit: "
		+ createRadio("cellMeasure", "&#197", 'setCellMeasure(value)', 0,
				1, "", "a") + "\n";
	strCell += createRadio("cellMeasure", "Bohr", 'setCellMeasure(value)', 0,
			0, "", "b")
			+ "\n <br>";
	strCell += "<i>a</i> " + createText2("aCell", "", 7, "");
	strCell += "<i>b</i> " + createText2("bCell", "", 7, "");
	strCell += "<i>c</i> " + createText2("cCell", "", 7, "") + "<br><br>\n";
	strCell += "<i>&#945;</i> " + createText2("alphaCell", "", 7, "");
	strCell += "<i>&#946;</i> " + createText2("betaCell", "", 7, "");
	strCell += "<i>&#947;</i> " + createText2("gammaCell", "", 7, "")
	+ " degrees <br><br>\n";
	strCell += "Voulme cell " + createText2("volumeCell", "", 10, "")
	+ "  &#197<sup>3</sup><br><br>";
	strCell += createButton('advanceCellval', '+',
			'toggleDivValue(true,"advanceCellvalue")', '')
			+ " Advanced cell options <br>"
			strCell += "<div id='advanceCellvalue' style='display:none; margin-top:20px'>"
				strCell += "<i>b/a</i> " + createText2("bovera", "", 8, "") + " ";
	strCell += "<i>c/a</i> " + createText2("covera", "", 8, "");
	strCell += "</div>"
		strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "<tr><td colspan='2'> \n";
	strCell += "Symmetry operators ";
	strCell += "<div id='syminfo'></div>";
	strCell += createLine('blue', '');
	strCell += "</td></tr>\n";
	strCell += "</table></FORM>\n";
	return strCell;
}

///////////////////////////// create polyGroup

function createPolyGrp() {
	var polyEdgeName = new Array("select", "4, 6", "4 ", "6", "8", "10", "12");
	var polyStyleName = new Array("select", "flat", "collapsed edges",
			"no edges", "edges", "frontedges");
	var polyStyleValue = new Array("NOEDGES", "flat edges", "collapsed",
			"noedges", "edges", "frontedges");
	var polyFaceName = new Array("0.0", "0.25", "0.5", "0.9", "1.2");
	var strPoly = "<FORM id='polyGroup' name='polyGroup' style='display:none'>\n";
	strPoly += "<table class='contents'>\n";
	strPoly += "<tr><td>\n";
	strPoly += "<h2>Polyhedron</h2>\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "Make polyhedra: \n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td  colspan='2'>\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp a) Select central atom:  <br>\n";
	strPoly += "&nbsp &nbsp   by element "
		+ createList2('polybyElementList', "", false, 0);
	// strPoly+=createCheck("byselectionPoly", "&nbsp by picking &nbsp",
	// 'setPolybyPicking(this)', 0, 0, "set picking") + "<br>\n";
	strPoly += "<br>&nbsp &nbsp just central atom"
		+ createCheck("centralPoly", "",
				'checkBoxStatus(this, "poly2byElementList")', 0, 0, "");
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp  b) select vertex atoms:  <br>\n";
	strPoly += "&nbsp &nbsp   by element "
		+ createList2('poly2byElementList', "", false, 0) + "\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp  c) based on <br>";
	strPoly += "&nbsp "
		+ createRadio("bondPoly", "bond", 'makeDisable("polyDistance") ',
				0, 0, "bondPoly", "off");
	strPoly += createRadio("bondPoly", " max distance ",
			' makeEnable("polyDistance")', 0, 0, "bondPoly1", "on");
	strPoly += createText2("polyDistance", "2.0", "3", "") + " &#197;";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp d) number of vertex "
		+ createList('polyEdge', '', 0, 0, polyEdgeName) + "\n";
	strPoly += createLine('blue', '');
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "Polyedra style:<br>\n";
	strPoly += "</td></tr><tr><td > &nbsp a) colour polyhedra\n";
	strPoly += createButton("polyColor", "Default colour",
			'setV("set defaultColors Jmol")', 0);
	strPoly += "</td><td align='left'><script type='text/javascript'>\n";
	strPoly += "var Colorscript = [setPolyColor, 'color'];";
	strPoly += "jmolColorPickerBox(Colorscript, '');";
	strPoly += "</script> </td></tr>";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += createButton('advanceEdit', '+',
			'toggleDivValue(true,"advancePolyDiv")', '')
			+ " Advanced style options"
			strPoly += "<div id='advancePolyDiv' style='display:none; margin-top:20px'>"
				strPoly += "<br> &nbsp b)"
					+ createRadio("polyFashion", "opaque",
							'setV("color polyhedra opaque") ', 0, 1, "opaque", "opaque")
							+ "\n";
	strPoly += createRadio("polyFashion", "translucent",
			'setV("color polyhedra translucent") ', 0, 0, "translucent",
	"translucent")
	+ "\n<br><br>";
	strPoly += "&nbsp c) style edges\n"
		+ createList('polyVert', 'checkPolyValue(this.value)', 0, 0,
				polyStyleValue, polyStyleName) + "\n";
	strPoly += "<br>"
		strPoly += "&nbsp &nbsp collapsed faces Offset \n"
			+ createList('polyFace', '', 0, 0, polyFaceName) + "\n";
	strPoly += "</div>";
	strPoly += createLine('blue', '');
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += createButton('createPoly', 'create', 'createPolyedra()', '');
	strPoly += createButton('createpoly', 'create auto',
			'setV("polyhedra 4,6 " + getValue("polyVert"))', '');
	strPoly += createButton('deletePoly', 'delete', 'setV("polyhedra DELETE")',
	'');
	strPoly += "</td></tr>\n";
	strPoly += "</table>\n";
	strPoly += "</FORM>\n";
	return strPoly;
}

///////////////////////////// create isosurfaceGroup

///introduce keypress onkeypress=\"setTimeout('
function createIsoGrp() {
	var isoName = new Array("no isosurface", "Van der Waals",
			"solvent accessible", "molecular", "MEP", "geodesic VdW", "geodesic IONIC",
			"dots VdW", "dots IONIC");
	var isoValue = new Array('load ""; isosurface OFF',
			'load ""; isosurface VDW'/*BH Q: Why was this 2.0? 2.0'*/, 
			'load ""; isosurface SASURFACE',
			'load ""; isosurface MOLSURFACE resolution 0 molecular',
			'load ""; isosurface resolution 7 SOLVENT map MEP',
			'load ""; geoSurface VANDERWAALS', 'load ""; geoSurface IONIC',
			'load "";  dots VANDERWAALS', 'load "";  dots IONIC');
	var colSchemeName = new Array("Rainbow (default)", "Black & White",
			"Blue-White-Red", "Red-Green", "Green-Blue");
	var colSchemeValue = new Array("roygb", "bw", "bwr", "low", "high");
	/*
	 * TODO slab unitcell. /
	 * http://chemapps.stolaf.edu/jmol/docs/examples-11/new.htm isosurface /
	 * lattice {a b c}
	 */
	var strIso = "<FORM id='isoGroup' name='isoGroup' style='display:none'>\n";
	strIso += "<table class='contents'>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "<h2>IsoSurface</h2>\n";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Molecular (classic) isoSurfaces: \n <br>";
	strIso += createList('isoCommon', 'setIsoClassic(this.value)', 0, 0,
			isoValue, isoName)
			+ "&nbsp";
	strIso += createButton('removeIso', 'remove iso', 'setV("isosurface OFF")',
	'');
	strIso += createLine('blue', '');
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Color map settings<br>\n ";
	strIso += "<img src='images/band.png'><br><br>";
	strIso += "- " + createText2("dataMin", "", "12", 0) + " + "
	+ createText2("dataMax", "", "12", 0) + " e- *bohr^-3<br>";
	strIso += "<br> Colour-scheme "
		+ createList('isoColorScheme', 'setIsoColorscheme()', 0, 0,
				colSchemeValue, colSchemeName) + "&nbsp<br>";
	strIso += createButton('up', 'Update map', 'setIsoColorRange()', '');
	// + createButton('reverseColor', 'Reverse colour', 'setIsoColorReverse()',
	// '');
	strIso += createLine('blue', '');
	strIso += "<td><tr>\n";
	// strIso+="Volume isoSurface<br>"
	// strIso+=createButton('volIso', 'calculate', 'setV('isosurface
	// VOLUME')', '') + " \n";
	// strIso+=createText3('isoVol','','','',"");
	// strIso+=createLine('blue' , '');
	// strIso+="</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Expand isoSurface periodically <br>";
	strIso += "<i>a: </i>";
	strIso += "<input type='text'  name='iso_a' id='iso_a' size='1' class='text'>";
	strIso += "<i> b: </i>";
	strIso += "<input type='text'  name='iso_b' id='iso_b' size='1' class='text'>";
	strIso += "<i> c: </i>";
	strIso += "<input type='text'  name='iso_c' id='iso_c' size='1' class='text'>";
	strIso += createButton('set_Isopack', 'packIso', 'setIsoPack()', '')
	+ " \n";
	strIso += createLine('blue', '');
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += "Style isoSurface:<br>";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += createRadio("isofashion", "opaque",
			'setV("color isosurface opaque") ', 0, 1, "", "");
	strIso += createRadio("isofashion", "translucent",
			'setV("color isosurface translucent") ', 0, 0, "", "")
			+ "<br>";
	strIso += createRadio("isofashion", "dots", 'setV("isosurface  dots;") ',
			0, 0, "", "");
	strIso += createRadio("isofashion", "no-fill mesh",
			'setV("isosurface nofill mesh") ', 0, 0, "", "");
	strIso += "</td></tr>\n";
	strIso += "<tr><td>\n";
	strIso += "Color Isosurface:\n";
	strIso += "</td><td><script type='text/javascript'>\n";
	strIso += "var Colorscript = [setIsoColor, 'color'];";
	strIso += "jmolColorPickerBox(Colorscript, '');";
	strIso += "</script>";
	strIso += "</td></tr>";
	strIso += "<tr><td>\n";
	strIso += createLine('blue', '');
	strIso += createCheck("measureIso", "Measure value", "pickIsoValue()", 0,
			0, "measureIso")
			+ "\n";
	// strIso += "<input type='text' name='isoMeasure' id='isoMeasure' size='5'
	// class='text'> a.u.\n";
	strIso += "</td></tr>\n";
	strIso += "<tr><td colspan='2'>\n";
	strIso += createCheck("removeStr", "Show structure beneath",
			"removeStructure()", 0, 1, "")
			+ " \n";
	strIso += createCheck("removeCellI", "Show cell", "removeCellIso()", 0, 1,
	"")
	+ " \n";
	strIso += createLine('blue', '');
	strIso += "</td></tr>\n";
	strIso += "</table>\n";
	strIso += "</FORM>\n";
	return strIso;
}

///////////////////////////// create Geometry Grp
function createGeometryGrp() {
	var vecAnimValue = new Array("", "set animationFps 5",
			"set animationFps 10", "set animationFps 15",
			"set animationFps 20", "set animationFps 25",
			"set animationFps 30", "set animationFps 35");
	var vecAnimText = new Array("select", "5", "10", "15", "20", "25", "30",
	"35");
	var vecUnitEnergyVal = new Array("h", "e", "r", "kj", "kc");
	var vecUnitEnergyText = new Array("Hartree", "eV", "Rydberg", "kJ*mol-1",
	"kcal*mol-1");
	var strGeom = "<form id='geometryGroup' name='modelsGeom' style='display:none'>";
	strGeom += "<table class='contents'><tr><td>";
	strGeom += "<h2>Geometry optimiziation</h2>\n";
	strGeom += "</td></tr>"
		strGeom += "<tr><td>\n";
	strGeom += createButton("<<", "<<",
			'setV("model FIRST");  preselectMyItem("0")', 0)
			+ "\n";
	strGeom += createButton(">", ">", 'setV("animation ON")+ selectFrame()', 0)
	+ "\n";
	strGeom += createButton("||", "||", 'setV("frame PAUSE")', 0) + "\n";
	strGeom += createButton(">>", ">>", 'setV("model LAST")', 0) + "\n";
	strGeom += createButton(
			"loop",
			"loop",
			'setV("frame REWIND; animation off;animation mode loop;animation on")',
			0)
			+ "\n";
	strGeom += createButton(
			"palindrome",
			"palindrome",
			'setV("frame REWIND; animation off;  animation mode palindrome;animation on")',
			0)
			+ "\n";
	strGeom += "<br>"
		+ createList("framepersec", "setV(value)", 0, 1, vecAnimValue,
				vecAnimText) + " motion speed | ";
	strGeom += createCheck('saveFrames', ' save video frames', 'saveFrame()',
			0, 0, "");
	strGeom += "<br> Energy unit measure: ";
	strGeom += createList("unitMeasureEnergy", "convertPlot(value)", 0, 1,
			vecUnitEnergyVal, vecUnitEnergyText);
	strGeom += "</td></tr><tr><td>";
	strGeom += "<select id='geom' name='models' onchange='showFrame(value)'  class='selectmodels' size='10'></select>";
	strGeom += "</td></tr><tr><td style='margin=0px; padding=0px;'><div id='appletdiv' style='display:none'>\n";
	strGeom += createDiv("graphdiv",
	"width:180;height:180;background-color:#EFEFEF; margin-left:0px;display:none")
	+ "\n";
	strGeom += createDiv("plottitle", "display:none")
	+ "&#916E (kJ/mol)</div>\n";
	strGeom += createDiv("plotarea",
	"width:180px;height:180px;background-color:#EFEFEF; display:none")
	+ "</div>\n";
	strGeom += "<div id='appletdiv1' style='display:none'>\n";
	strGeom += createDiv("graphdiv1",
	"width:180;height:180;background-color:#EFEFEF; margin-left:0px;display:none")
	+ "\n";
	strGeom += createDiv("plottitle1", "display:none") + "ForceMax </div>\n";
	strGeom += createDiv("plotarea1",
	"width:180px;height:180px;background-color:#efefEF;display:none")
	+ "</div>\n";
	strGeom += "</div></div></div>\n";
	strGeom += "</table></form>\n";
	return strGeom;
}

///////////////////////////// create FREQUENCIES Grp
function createFreqGrp() {
	var vecscaleValue = new Array("", "vectors SCALE 1", "vectors SCALE 3",
			"vectors SCALE 5", "vectors SCALE 7", "vectors SCALE 10",
			"vectors SCALE 15", "vectors SCALE 19");
	var vecsizeValue = new Array("", "vectors 1", "vectors  3", "vectors  5",
			"vectors  7", "vectors 10", "vectors 15", "vectors  19");
	var vibAmplitudeValue = new Array("", "vibration Scale 1",
			"vibration Scale 2", "vibration Scale 5", "vibration Scale 7",
	"vibration Scale 10");
	var vecscaleText = new Array("select", "1", "3", "5", "7", "10", "15", "19");
	var vibAmplitudeText = new Array("select", "1", "2", "5", "7", "10");

	var strFreq = "<table class='contents'><tr><td valign='top'><form id='freqGroup' name='modelsVib' style='display:none'>";
	strFreq += "<h2>IR-Raman Frequencies</h2>\n";
	strFreq += "<select id='vib' name='models' OnClick='showFrame(value)' class='selectmodels' size=15 style='width:120px; overflow: auto;'></select>";
	strFreq += "<BR>\n";
	strFreq += createRadio("modAct", "All", "onClickModSelLoad()", 0, 1, "",
	"all");
	strFreq += createRadio("modAct", "IR", "onClickModSelLoad()", 0, 0, "",
	"ir");
	strFreq += createRadio("modAct", "Raman", "onClickModSelLoad()", 0, 0, "",
	"raman");
	strFreq += "<BR>\n";
	strFreq += "Symmetry <select id='sym' name='vibSym' onchange='onChangeListDesSymm(value)' onkeypress='onChangeListDesSymm()' CLASS='select' >";
	strFreq += "</select> ";
	// strFreq += createButton("reload", "Reload", "onClickReloadSymm()", 0);
	strFreq += "<BR>\n";
	strFreq += "vibration ";
	strFreq += createRadio("vibration", "on", 'onClickVibrate(value)', 0, 0,
			"", "on");
	strFreq += createRadio("vibration", "off", 'onClickVibrate(value)', 0, 1,
			"", "off");
	strFreq += "<BR>\n";
	strFreq += createList("vecsamplitude", "setV(value)", 0, 1,
			vibAmplitudeValue, vibAmplitudeText)
			+ " vib. amplitude";
	strFreq += "<BR>\n";
	strFreq += createCheck("vectors", "view vectors",
			"setVCheckbox(this, this.value)", 0, 1, "vectors");
	strFreq += "<BR>\n";
	strFreq += createList("vecscale", "setV(value)", 0, 1, vecscaleValue,
			vecscaleText)
			+ " vector scale";
	strFreq += "<BR>\n";
	strFreq += createList("sizevec", "setV(value)", 0, 1, vecsizeValue,
			vecscaleText)
			+ " vector size";
	strFreq += "<BR>\n";
	strFreq += "<table class='contents'> <tr><td>vector color</td> <td><script type='text/javascript'>jmolColorPickerBox('color vectors $COLOR$',[255,255,255])</script></td>";
	strFreq += "</tr><tr><td>"
		+ createButton("vibVectcolor", "Default color",
				'setV("color vectors none")', 0) + "</td></tr></table>";
	strFreq += "</td><td valign='top'><div id='freqdiv' style='display:none'>\n";
	strFreq += createDiv("graphfreqdiv",
	"width:200;height:200;background-color:#EFEFEF; margin-left:5px; display:none")
	+ "\n";
	strFreq += createDiv("plottitlefreq", ";display:none")
	+ "IR - Raman  dispersion </div>\n";
	strFreq += createDiv("plotareafreq",
	"width:210;height:210px;background-color:#EFEFEF;display:none")
	+ "</div>\n";
	strFreq += "Raman intensities set to 0.0 kmMol<sup>-1</sup>";
	strFreq += "<br>\n";
	strFreq += createLine('blue', '');
	strFreq += "Simulate spectrum<br>";
	strFreq += createRadio("kindspectra", "IR", '', 0, 1, "", "ir");
	strFreq += createRadio("kindspectra", "Raman", '', 0, 1, "", "raman");
	strFreq += createRadio("kindspectra", "Both", '', 0, 1, "", "both");
	strFreq += "<br>Convolution with<br>";
	strFreq += createRadio("convol", "Stick", '', 0, 1, "", "stick");
	strFreq += createRadio("convol", "Gaussian", '', 0, 0, "", "gaus");
	strFreq += createRadio("convol", "Lorentzian", '', 0, 0, "", "lor");
	strFreq += "<br>Specrum setting <br>\n";
	strFreq += "band width " + createText2("sigma", "15", "3", "")
	+ " (cm<sup>-1</sup>)<br>";
	strFreq += "Min freq. " + createText2("nMin", "", "4", "");
	strFreq += " Max " + createText2("nMax", "", "4", "")
	+ "(cm<sup>-1</sup>)<br>";
	strFreq += createButton("simSpectra", "Simulate spectrum", "simSpectrum()",
			0)
			+ " ";
	strFreq += createCheck("rescaleSpectra", "Re-scale", "", 0, 1, "");
	strFreq += "</div></div>\n";
	strFreq += "</form></td></tr></table>";

	return strFreq;
}

///////////////////////////// electprop
function createElecpropGrp() {

	var colSchemeName = new Array("Rainbow (default)", "Black & White",
			"Blue-White-Red", "Red-Green", "Green-Blue");
	var colSchemeValue = new Array('roygb', 'bw', 'bwr', 'low', 'high');
	var strElec = "<form id='elecGroup' name='elecGroup' style='display:none'>\n";
	strElec += "<table class='contents'><tr><td ><h2>Electronic - Magnetic properties</h2> \n";
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += "Mulliken population analysis\n <br>";
	strElec += createButton("mulliken", "view Mulliken",
			'setV("script scripts/mulliken.spt")', 0);
	strElec += "<br> Colour-scheme "
		+ createList('chergeColorScheme', 'setColorMulliken(value)', 0, 0,
				colSchemeValue, colSchemeName)
				+ "&nbsp<br>";
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += "Spin arrangment\n <br>";
	strElec += createButton("spin", "view Spin",
			'setV("script scripts/spin.spt")', 0);
	strElec += " ";
	strElec += createButton("magnetiMoment", "view Magnetic Moment",
			'runJmolScript("script scripts/spin.spt")', 0);
	strElec += "<br> View only atoms with spin "
		+ createButton("spindown", "&#8595",
				'setV("display property_spin <= 0")', 0);
	strElec += createButton("spinup", "&#8593",
			'setV("display property_spin >= 0")', 0);
	// strElec+=createButton("magneticMoment","magn. Moment",'',0);
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += createLine('blue', '');
	strElec += createButton("Removeall", "Remove", 'exitElecpropGrp()', 0);
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += createLine('blue', '');
	strElec += "</td></tr>\n";
	strElec += "</table></form> \n";
	return strElec;
}

///////////////////////////// create other properties
function createotherpropGroup() {
	var textValue = new Array("0", "6", "8", "10", "12", "16", "20", "24", "30");
	var textText = new Array("select", "6 pt", "8 pt", "10 pt", "12 pt",
			"16 pt", "20 pt", "24 pt", "30 pt");

	var shadeName = new Array("select", "1", "2", "3")
	var shadeValue = new Array("0", "1", "2", "3")
	var strOther = "<form id='otherpropGroup' name='otherpropGroup' style='display:none' >";
	strOther += "<table class='contents'><tr><td> \n";
	strOther += "<h2>Other properties</h2></td></tr>\n";
	strOther += "<tr><td>Background colour:</td>\n";
	strOther += "<td align='left'><script type='text/javascript'>jmolColorPickerBox('set background $COLOR$',[255,255,255])</script></td></tr> \n";
	strOther += "<tr><td>"
		+ createLine('blue', '')
		+ createCheck(
				"perspective",
				"Perspective",
				'setVCheckbox(this, this.value) + toggleDiv(this,"perspectiveDiv") +initPerspective()',
				0, 0, "set perspectiveDepth");
	strOther += "</td></tr><tr><td>"
		strOther += "<div id='perspectiveDiv' style='display:none; margin-top:20px'>";
	strOther += '<div tabIndex="1" class="slider" id="persSlider" style="float:left;width:150px;" >';
	strOther += '<input class="slider-input" id="persSlider-input" name="persSlider-input" />';
	strOther += '</div><div id="perspMsg" class="msgSlider"></div></div>';
	strOther += "</td></tr>\n";
	strOther += "<tr><td>"
		+ createCheck("z-shade", "Z-Fog", "setVCheckbox(this, this.value)",
				0, 0, "set zShade");
	strOther += " ";
	strOther += createList(
			'setzShadePower ',
			'setV("set zShade; set zShadePower " + value + " ;") + setVCheckbox("z-shade","")',
			0, 1, shadeValue, shadeName)
			+ " Fog level";
	strOther += "</td></tr>\n";
	strOther += "<tr><td colspan='2'> Anti-aliasing"
		+ createRadio("aa", "on",
				'setV("antialiasDisplay = true; set hermiteLevel 5")', 0,
				0, "");
	strOther += createRadio("aa", "off",
			'setV("antialiasDisplay = false;set hermiteLevel 0")', 0, 1, "");
	strOther += createLine('blue', '');
	strOther += "</td></tr>";
	strOther += "<tr><td>";
	strOther += "Light settings";
	strOther += "</td></tr>";
	strOther += "<tr><td>";
	strOther += '<div tabIndex="1" class="slider" id="light1Slider" style="float:left;width:150px;" >';
	strOther += '<input class="slider-input" id="light1Slider-input" name="light1Slider-input" />';
	strOther += '</div>Reflection	<div id="light1Msg" class="msgSlider"></div></div>';
	strOther += "</td></tr><tr><td>";
	strOther += '<div tabIndex="1" class="slider" id="light2Slider" style="float:left;width:150px;" >';
	strOther += '<input class="slider-input" id="light2Slider-input" name="light2Slider-input" />';
	strOther += '</div>Ambient	<div id="light2Msg" class="msgSlider"></div></div>';
	strOther += "</td></tr><tr><td>";
	strOther += '<div tabIndex="1" class="slider" id="light3Slider" style="float:left;width:150px;" >';
	strOther += '<input class="slider-input" id="light3Slider-input" name="light3Slider-input" />';
	strOther += '</div>Diffuse	<div id="light3Msg" class="msgSlider"></div></div>';
	strOther += "</td></tr><tr><td colspan='2'>" + createLine('blue', '');
	strOther += "</tr><tr><td colspan='2'>"
		strOther += "3D settings <br>"
			+ createRadio("stereo", "R&B", 'setV("stereo REDBLUE")', 0, 0, "")
			+ "\n";
	strOther += createRadio("stereo", "R&C", 'setV("stereo REDCYAN")', 0, 0, "")
	+ "\n";
	strOther += createRadio("stereo", "R&G", 'setV("stereo REDGREEN")', 0, 0,
	"")
	+ "<br>\n";
	strOther += createRadio("stereo", "side-by-side", 'setV("stereo ON")', 0,
			0, "")
			+ "\n";
	strOther += createRadio("stereo", "3D off", 'setV("stereo off")', 0, 1, "")
	+ createLine('blue', '') + "</td></tr>\n";
	strOther += "<tr><td colspan='2'>";
	strOther += "Label controls <br>"
		strOther += createCheck("frameName", "Name model", "setNameModel(this)", 0,
				1, "frame title")
				+ " ";
	strOther += createCheck("jmollogo", "Jmol Logo",
			"setVCheckbox(this, this.value)", 0, 1, "set showFrank")
			+ "</td></tr>\n";
	strOther += "<tr><td colspan='2'>";
	strOther += "Font size ";
	strOther += createList("fontSize", "setTextSize(value)", 0, 1,
			textValue, textText);
	strOther += "</td></tr>";
	strOther += "<tr><td colspan='2'>"
		+ createButton("removeText", "Remove messages", 'setV("echo")', 0);
	strOther += createLine('blue', '');
	strOther += "</td></tr></table></FORM>  \n";
	return strOther;
}

///////////////////////////// create Hystory Grp var scriptColor = "'color iron
//$COLOR$'";

function createHistGrp() {
	var strHist = "<FORM id='HistoryGroup' name='HistoryGroup' style='display:none'>";
	strHist += "History<BR>\n";
	strHist += "Work in progress<BR>\n";
	strHist += "</form>";
	return strHist;
}

//////////////LOADING MENUS
function loadTabs() {
	document.write(createMenus());
}

function loadMenus() {
	document.write(createFileGrp());
	document.write(createAppearanceGrp());
	document.write(createEditGroup());
	//document.write(createBuildGroup());
	document.write(createMeasureGroup());
	document.write(createOrientGrp());
	document.write(createCellGrp());
	document.write(createPolyGrp());
	document.write(createIsoGrp());
	document.write(createGeometryGrp());
	document.write(createFreqGrp());
	document.write(createElecpropGrp());
	document.write(createotherpropGroup());
	// document.write(createHistGrp());
}
