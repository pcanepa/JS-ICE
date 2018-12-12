
var sampleOptionArr = ["Load a Sample File", 
	"MgO slab", 
	"urea single-point calculation", 
	"benzene single-point calculation", 
	"NH3 geometry optimization", 
	"NH3 vibrations", 
	"Formic acid slab fragment vibrations",
	"quartz CIF", 
	"ice.out", 
	"=AMS/rutile (11 models)",
	"urea VASP test"
]

function onChangeLoadSample(value) {
	var fname = null;
	switch(value) {
	case "urea VASP test":
		fname = "output/vasp/Urea_vasp5.dat"
		break;
	case "=AMS/rutile (11 models)":
		fname = "output/rutile.cif";
		break;
	case "Formic acid slab fragment vibrations":
		fname = "output/vib-freq/formic_on_ha.out";
		break;
	case "quartz CIF":
		fname = "output/quartz.cif";
		break;
	case "quartz CIF":
		fname = "output/quartz.cif";
		break;
	case "ice.out":
		fname = "output/ice.out";
		break;
	case "MgO slab":
		fname = "output/cube_mgo_slab/mgo_slab_100_5l.out";
		break;
	case "urea single-point calculation":
		fname = "output/cube_urea_diff/urea-test12.out";
		break;
	case "benzene single-point calculation":
		fname = "output/single-point/c6h6_b3_631gdp.out";
		break;
	case "NH3 geometry optimization":
		fname = "output/geom-opt/nh3_pbe_631gdp_opt.out";
		break;
	case "NH3 vibrations":
		fname = "output/vib-freq/nh3_pbe_631gdp_freq.out";
		break;
	}
	if (fname) {
		runJmolScriptWait("zap;set echo top left; echo loading " + fname +"...");
		runJmolScript("load '" + fname + "' " + getValue("modelNo") + " packed");
	}
}



function enterFile() {
	
}

function exitFile() {
}

file_method = function(methodName, defaultMethod, params) {
	// Execute a method specific to a given file type, for example:
	// loadDone_crystal
	params || (params = []);
	methodName += "_" + _file.fileType;
	var f = self[methodName] || defaultMethod;
	return (f && f.apply(null, params));
}

reload = function(packing, filter, more) {	
	// no ZAP here
	runJmolScriptWait("set echo top left; echo reloading...;");
	loadFile("", packing, filter, more);
//	runJmolScript("load '' " + packing + filter);
	//+ ";" + more + ';echo;frame all;frame title "@{_modelName}";frame FIRST;');
//	setFileName();
//	getUnitcell(1);
}

loadUser = function(packing, filter) {
	loadFile("?", packing, filter);
}

loadFile = function(fileName, packing, filter, more) {
	packing || (packing = "");
	filter = (filter ? " FILTER '" + filter + "'" : "");
	more || (more = "");
	_fileIsReload = !fileName;
	if (!_fileIsReload) {
		runJmolScriptWait("zap;");
	}
	// ZAP will clear the Jmol file cache
	runJmolScript("load '" + fileName + "' " + packing + filter + ";" + more);
}

function setDefaultJmolSettings() {
	runJmolScriptWait('select all; wireframe 0.15; spacefill 20% ;cartoon off; backbone off;');
	_slider.radii.setValue(20);
	_slider.bond.setValue(15);
	// _slider.radiiConnect.setValue(20);
//	getbyID('radiiMsg').innerHTML = 20 + "%";
//	getbyID('bondMsg').innerHTML = 0.15 + " &#197";

	/*
	 * getbyID('globalAtomicRadii').innerHTML = 20 ;
	 * getbyID('sliderGlobalAtomicRadii').style.left=20+'px';
	 * getbyID('globalBondWidths').innerHTML = 0.20;
	 * getbyID('sliderGlobalBondWidths').style.left=20+'px';
	 * getbyID('sepcLight').innerHTML = 22 + " % ";
	 * getbyID('sliderSepcLight').style.left=20+'px';
	 * getbyID('Ambient').innerHTML = 45 + " % ";
	 * getbyID('sliderAmbient').style.left=45+'px'; getbyID('Diffuse').innerHTML =
	 * 45 + " % "; getbyID('sliderDiffuse').style.left=45+'px';
	 * getbyID('sliderPerspective').style.left= 66+'px';
	 * getbyID('sliderGlobalBond').style.left= 20 + 'px';
	 * getbyID('globalBondCon').innerHTML = 2 + " ";
	 */

	// getbyID("packrange").innerHTML = 0 + " &#197"
	// getbyID('Perspective').innerHTML = 3;
}

function onChangeLoad(load) {
//	formResetAll();
	switch (load) {
	case "loadC":
	case "loadaimsfhi":
	case "loadOutcastep":
	case "loadcastep":
	case "loadDmol":
	case "loadgauss":
	case "loadgromacs":
	case "loadGulp":
	case "loadmaterial":
	case "loadMolden":
	case "loadpdb":
	case "loadShel": //??
	case "loadSiesta":
	case "loadstate":
	case "loadVasp":
	case "loadVASPoutcar":
	case "loadWien":
	case "loadXcrysden":
	case "loadxyz":
		loadUser();
		break;
	case "loadcif":
	case "loadcrystal":
	case "loadQuantum":
		loadUser("packed");
		break;
	case "reload":
		reload();
		break;
// BH 2018 moved to surface
//	case "loadCUBE":
//		cubeLoad();
//		break;
//	case "loadJvxl":
//		loadMapJvxl();
//		break;
	}
	document.fileGroup.reset();
}

function file_loadedCallback(filePath) {
	_file = {
			cell        : {},
			fileType    : jmolEvaluate("_fileType").toLowerCase(), 
			energyUnits : ENERGY_EV,
			strUnitEnergy : "e",
			hasInputModel : false,
			symmetry    : null,
			specData    : null,
			plotFreq    : null,
			geomData    : [],
			freqInfo 	: [],
			freqData	: [],
			vibLine		: [],
			counterFreq : 0,
			counterMD 	: 0,
			fMinim 		: null,
			frameSelection : null,
			frameNum       : null,
			frameValue 	   : null,
			haveGraphOptimize  : false,
			exportModelOne        : false,
			exportFractionalCoord : false
	};
	
	counterFreq = 0;
	_file.info = extractInfoJmol("auxiliaryInfo.models");
	setFlags();
	setFileName();
	getUnitcell(1);
	runJmolScriptWait('unitcell on');
	cleanAndReloadForm();
	setFileName();
	if (!_fileIsReload)
		grpDisp(0);
	_fileIsReload = false;
	file_method("loadDone", loadDone);
}

loadDone = function() {
	setTitleEcho();
}

function cleanAndReloadForm() {
	// this method was called for castep, dmol, molden, quantumespresso, vasp loading	
	setDefaultJmolSettings();
	document.fileGroup.reset();
	cleanList('geom');
	cleanList('colourbyElementList');
	// cleanList('colourbyAtomList');
	cleanList('polybyElementList');
	cleanList("poly2byElementList");
	updateElementLists();
	getUnitcell("1");
	setFrameValues("1");
	setTitleEcho();
}

setFlags = function() {
	// BH TODO: missing xmlvasp?
	switch (_file.fileType) {
	default:
	case "xyz":
	case "cube":
	case "gromacs":
	case "material":
		break;
	case "castep":
	case "outcastep":
		_file.cell.typeSystem = "crystal";
		break;
	case "aims":
	case "aimsfhi":
	case "castep":
	case "cif":
	case "crysden":
	case "pdb":
	case "shelx":
	case "wien":
		_file.cell.typeSystem = "crystal";
		_file.exportModelOne = true;
		break;
	case "siesta":
		_file.cell.typeSystem = "crystal";
		_file.exportNoSymmetry = true;
		break;
	case "dmol":
		_file.plotEnergyType = "dmol";
		break;
	case "gulp":
		_file.plotEnergyType = "gulp";
		break;
	case "vasp":
		_file.cell.typeSystem = "crystal";
		_file.plotEnergyType = "vasp";
		_file.exportNoSymmetry = true;
		break;
	case "vaspoutcar":
		_file.cell.typeSystem = "crystal";
		_file.plotEnergyType = "outcar";
		_file.exportNoSymmetry = true;		
		break;
	case "espresso":
	case "quantum":
		_file.cell.typeSystem = "crystal";
		_file.plotEnergyType = "qespresso";
		break;
	case "gaussian":
	case "gauss":
		_file.cell.typeSystem = "molecule";
		_file.plotEnergyType = "gaussian";
		break;
	case "molden":
		// WE USE SAME SETTINGS AS VASP
		// IT WORKS
		_file.cell.typeSystem = "molecule";
		_file.plotEnergyType = "outcar";
		_file.exportNoSymmetry = true;
		break;
	case "crystal":
		_file.plotEnergyType = "crystal";
		_file.plotEnergyForces = true;
		break;
	}
}

function onChangeSave(save) {
	// see menu.js
	switch (save) {
	case "savePNG":
		runJmolScript('write PNG "jice.png"');
		break;
	case "savePNGJ":
		runJmoLScript('write PNGJ "jice.png"');
		break;
	case "saveXYZ":
		runJmoLScript('write COORDS XYZ jice.xyz');
		break;
	case "saveFrac":
		saveFractionalCoordinate();
		break;
	case "saveCRYSTAL":
		exportCRYSTAL();
		break;
	case "saveVASP":
		exportVASP();
		break;
	case "saveGROMACS":
		exportGromacs();
		break;
	case "saveCASTEP":
		exportCASTEP();
		break;
	case "saveQuantum":
		exportQuantum();
		break;
	case "saveGULP":
		exportGULP();
		break;
	case "savePOV":
		runJmoLScript('write POVRAY jice.pov');
		break;
	case "savepdb":
		runJmoLScript('write PDB jice.pdb');
		break;
	case "saveState":
		runJmoLScript('write STATE jice.spt');
		break;
	case "savefreqHtml":
		newAppletWindowFreq();
		break;
	}
	document.fileGroup.reset();
}


function printFileContent() {
	runJmolScript("console; getProperty fileContents;");
}


function setTitleEcho() {
// BH this is not a generally useful thing to do. Crystal only?
	var titleFile = extractInfoJmolString("fileHeader").split("\n")[0];
	runJmolScriptWait('set echo top right; echo "' + titleFile + ' ";');
}


function setFileName() {
	setStatus(jmolEvaluate("_modelFile"));
}

function saveStateAndOrientation_a() {
	// used in castep, gulp, and vasp output methods, and in symmetry#figureOutSpacegroup
	runJmolScriptWait("save ORIENTATION orienta; save STATE status;");
}

function restoreStateAndOrientation_a() {
	runJmolScriptWait("restore ORIENTATION orienta; restore STATE status;");
}


function createFileGrp() { // Here the order is crucial
	var elOptionArr = new Array("default", "loadC", "reload", "loadcif",
			"loadxyz", "loadOutcastep", "loadcrystal", "loadDmol",
			"loadaimsfhi", "loadgauss", "loadgromacs", "loadGulp",
			"loadmaterial", "loadMolden", "loadpdb", "loadQuantum",
			"loadSiesta", "loadShel", "loadVASPoutcar", "loadVasp", "loadWien",
			"loadXcrysden", "loadstate");
	var elOptionText = new Array("Load New File", "General (*.*)",
			"Reload current", "CIF (*.cif)", "XYZ (*.XYZ)",
			"CASTEP (INPUT, OUTPUT)", "CRYSTAL (*.*)", "Dmol (*.*)",
			"FHI-aims (*.in)", "GAUSSIAN0X (*.*)", "GROMACS (*.gro)",
			"GULP (*.gout)", "Material Studio (*.*)", "Molden, QEfreq (*.*)",
			"PDB (*.pdb)", "QuantumESPRESSO (*.*)", "Siesta (*,*)",
			"ShelX (*.*)", "VASP (OUTCAR, POSCAR)", "VASP (*.xml)",
			"WIEN2k (*.struct)", "Xcrysden (*.xtal)", "Jmol state (*.spt,*.png)");

	var strFile = "<form autocomplete='nope'  id='fileGroup' name='fileGroup' style='display:inline' class='contents'>\n";
	strFile += "<h2>File manager</h2>\n";
	strFile += "<table><tr><td>Drag-drop a file into JSmol or use the menu below.<br>\n";
	strFile += createSelectmenu('Load File', 'onChangeLoad(value)', 0, 1,
			elOptionArr, elOptionText);
	strFile += "</td><td><div style=display:none>model #" +
		createText2("modelNo", "", 7, "")
		+ "</div></td></tr><tr><td>\n";
	strFile += "Sample Files<BR>\n";
	strFile += createSelectmenu('Sample Files', 'onChangeLoadSample(value)', 0, 1,
			sampleOptionArr);
	strFile += "</td></tr></table><BR><BR>\n";
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
	strFile += createSelectmenu('Export File', 'onChangeSave(value)', 0, 1,
			elSOptionArr, elSOptionText);
	strFile += "<p ><img src='images/j-ice.png' alt='logo'/></p>";
	strFile += "<div style='margin-top:50px;width:350px'><p style='color:#000'> <b style='color:#f00'>Please DO CITE:</b>";
	strFile += createCitations();
	strFile += "</p></div>";
	strFile += "</form>\n";
	return strFile;
}

 	createCitations = function() {
		var citations = _global.citations; 
		var s = "";
		for (var i = 0; i < citations.length; i++) {
			var cite = citations[i];
			s += "<blockquote><b>";
			s += cite.title;
			s += "</b><br>";
			s += cite.authors.join(", ");
			s += " <br>";  
			s+= cite.journal;
			s += " <a href='" + cite.link + "' target='_blank'>[doi]</a>";
			s += "</blockquote>"; 
		};
		return s
	}


