var flagCif = false; 
var flagCrystal = false; 
var flagGromos = false;
var flagGulp = false;
var flagOutcar = false;
var flagGaussian = false;
var flagQuantumEspresso = false;
var flagSiesta = false;
var flagDmol = false;
var flagMolden = false;
var flagCastep = false;

var quantumEspresso = false;


var sampleOptionArr = ["Load a Sample File", 
	"MgO slab", 
	"urea single-point calculation", 
	"benzene single-point calculation", 
	"NH3 geometry optimization", 
	"NH3 vibrations", 
	"quartz CIF", 
	"ice.out", 
	"=AMS/rutile (11 models)"
]

function onChangeLoadSample(value) {
	var fname = null;
	switch(value) {
	case "=AMS/rutile (11 models)":
		fname = "output/rutile.cif";
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
	methodName += "_" + _fileData.fileType;
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
	radiiSlider.setValue(20);
	bondSlider.setValue(15);
	// radiiConnectSlider.setValue(20);
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
	_specData = null;
	_fileData = {
			fileType    : jmolEvaluate("_fileType").toLowerCase(), 
			energyUnits : ENERGY_EV,
			strUnitEnergy : "e",
			hasInputModel : false,
			haveSpecData : false,
			geomData    : [],
			freqInfo 	: [],
			freqData	: [],
			vibLine		: [],
			counterFreq : 0,
			counterMD 	: 0
	};
	resetGraphs();
	counterFreq = 0;
	extractAuxiliaryJmol();
	setFlags(_fileData.fileType);
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
//	formResetAll();
	cleanLists();
	updateElementLists();
	getUnitcell("1");
	setFrameValues("1");
	setTitleEcho();
}

resetLoadFlags = function(isCrystal) {
	if (isCrystal)
		typeSystem = "crystal";
	flagCrystal = 
	flagGromos = 
	flagGulp = 
	flagOutcar = 
	flagGaussian = 
	flagQuantumEspresso = 
	flagCif = 
	flagSiesta = 
	flagDmol = 
	flagMolden =
	flagCastep = false;
}

setFlags = function(type) {
	// BH TODO: missing xmlvasp?
	type = type.replace('load', '').toLowerCase();
	switch (type) {
	default:
	case "xyz":
		break;
	case "shelx":
	case "shel":
		resetLoadFlags(true); // BH 2018 added -- Q: Why no clearing of flags?
		flagCif = true;
		break;
	case "crystal":
		resetLoadFlags();
		flagCrystal = true;
		break;
	case "cube":
		break;
	case "aims":
	case "aimsfhi":
		resetLoadFlags(true);
		flagCif = true;
		break;
	case "castep":
		resetLoadFlags(true);
		flagCif = true;
		break;
	case "vasp":
		resetLoadFlags(true);
		break;
	case "vaspoutcar":
		resetLoadFlags(true);
		flagOutcar = true;
		break;
	case "dmol":
		resetLoadFlags();
		flagDmol = true;
		break;
	case "espresso":
	case "quantum":
		resetLoadFlags(true);
		flagQuantumEspresso = true;
		break;
	case "gulp":
		resetLoadFlags();
		flagGulp = true;
		break;
	case "material":
		resetLoadFlags(); // BH Added
		break;
	case "wien":
		resetLoadFlags(true); // BH Added
		flagCif = true;
		break;
	case "cif":
		resetLoadFlags(true); // BH Added
		flagCif = true;
		break;
	case "siesta":
		resetLoadFlags(true); // BH Added
		flagSiesta = true;
		break;
	case "pdb":
		resetLoadFlags(true); // BH Added
		flagCif = true;
		break;
	case "gromacs":
		resetLoadFlags(); // BH Added
		flagGromos = true;
		break;
	case "gaussian":
	case "gauss":
		resetLoadFlags(); // BH Added
		flagGaussian = true;
		typeSystem = "molecule";
		break;
	case "molden":
		// WE USE SAME SETTINGS AS VASP
		// IT WORKS
		resetLoadFlags(); // BH Added
		typeSystem = "molecule";
		flagOutcar = true;
		break;
	case "crysden":
		resetLoadFlags(true); // BH Added
		flagCif = true;
		break;
	case "castep":
	case "outcastep":
		resetLoadFlags(true); // BH Added
		flagCastep = true;
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
		//flagCrystal = true;
		exportCRYSTAL();
		break;
	case "saveVASP":
		//flagCrystal = false;
		exportVASP();
		break;
	case "saveGROMACS":
		exportGromacs();
		break;
	case "saveCASTEP":
		exportCASTEP();
		break;
	case "saveQuantum":
		quantumEspresso = true;
		//flagCrystal = false;
		exportQuantum();
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
	case "saveGULP":
		flagGulp = true;
		flagCrystal = false;
		exportGULP();
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


