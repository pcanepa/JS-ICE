
//export list
var flagCryVasp = true; // if flagCryVasp = true crystal output
var flagGromos = false;
var flagGulp = false;
var flagOutcar = false;
var flagGauss = false;
var flagQuantum = false;
var flagCif = false;
var flagSiesta = false;
var flagDmol = false;
var flagMolde = false;
var flagCast = false;

function preload(type) {
	type = type.replace('load', '').toLowerCase();
	switch (type) {
	default:
	case "xyz":
		break;
	case "shelx":
	case "shel":
		typeSystem = "crystal";
		flagCif = true;
		break;
	case "crystal":
		flagCryVasp = true;
		flagGulp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "cube":
		break;
	case "aims":
	case "aimsfhi":
		flagCif = true;
		typeSystem = "crystal";
		break;
	case "castep":
		flagCif = true;
		typeSystem = "crystal";
		break;
	case "vasp":
		typeSystem = "crystal";
		flagCryVasp = false;
		flagOutcar = false;
		flagGauss = false;
		flagQuantum = false;
		flagGulp = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "vaspoutcar":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = true;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "dmol":
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = true;
		flagCast = false;
		break;
	case "espresso":
	case "quantum":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = true;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "gulp":
		flagGulp = true;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "material":
		break;
	case "wien":
		flagCif = true;
		typeSystem = "crystal";
		break;
	case "cif":
		flagCif = true;
		typeSystem = "crystal";
		break;
	case "siesta":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagGauss = false;
		flagQuantum = false;
		flagSiesta = true;
		flagDmol = false;
		flagCast = false;
		break;
	case "pdb":
		flagCif = true;
		typeSystem = "crystal";
		break;
	case "gromacs":
		flagGromos = true;
		break;
	case "gaussian":
	case "gauss":
		flagCryVasp = false;
		flagGromos = false;
		flagGulp = false;
		flagOutcar = false;
		flagGauss = true;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		typeSystem = "molecule";
		break;
	case "molden":
		// WE USE SAME SETTINGS AS VASP
		// IT WORKS
		typeSystem = "molecule";
		flagGulp = false;
		flagOutcar = true;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		break;
	case "crysden":
		flagCif = true;
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = false;
		typeSystem = "crystal";
		break;
	case "castep":
	case "outcastep":
		typeSystem = "crystal";
		flagGulp = false;
		flagOutcar = false;
		flagCryVasp = false;
		flagQuantum = false;
		flagGauss = false;
		flagSiesta = false;
		flagDmol = false;
		flagCast = true;
		break;
	}
}

function onChangeLoad(load) {
	// This is to reset all function
	resetAll();
	preload(load);
	switch (load) {
	case "loadC":
		runJmolScript('load ?; set defaultDirectory; script ../scripts/name.spt');
		break;
	case "loadShel": //??
		runJmolScript('load ?; set defaultDirectory; script ../scripts/name.spt');
		break;
	case "loadxyz":
		runJmolScript('load ?.xyz;script ../scripts/name.spt');
		break;
	case "loadcrystal":
		onClickLoadStruc();
		break;
	case "loadCUBE":
		cubeLoad();
		break;
	case "loadaimsfhi":
		runJmolScript('load ?.in; script ../scripts/name.spt;');
		break;
	case "loadcastep":
		setV('load ?.cell');
		break;
	case "loadVasp":
		onClickLoadVaspStruct();
		break;
	case "loadVASPoutcar":
		onClickLoadOutcar();
		break;
	case "loadDmol":
		onClickLoadDmolStruc();
		break;
	case "loadQuantum":
		onClickQuantum();
		break;
	case "loadGulp":
		onClickLoadGulpStruct();
		break;
	case "loadmaterial":
		setV('load ?; set defaultDirectory; script ../scripts/name.spt;');
		break;
	case "loadWien":
		setV('load ?.struct; set defaultDirectory; script ../scripts/name.spt;');
		break;
	case "loadcif":
		setV('load ?.cif PACKED; set defaultDirectory; script ../scripts/name.spt;');
		break;
	case "loadSiesta":
		loadSiesta();
		break;
	case "loadpdb":
		setV('load ?.pdb; set defaultDirectory ; script ../scripts/name.spt;');
		break;
	case "reload":
		setName();
		var reloadStr = "script ./scripts/reload.spt"
			setV(reloadStr);
		resetAll();
		setName();
		getUnitcell(1);
		break;
	case "loadJvxl":
		loadMapJvxl();
		break;
	case "loadstate":
		setV('zap; load ?.spt; set defaultDirectory; script ../scripts/name.spt;');
		setName();
		break;
	case "loadgromacs":
		setV('load ?.gro; set defaultDirectory; script ../scripts/name.spt;');
		break;
	case "loadgauss":
		loadGaussian();
		break;
	case "loadMolden":
		onClickLoadMoldenStruct();
		break;
	case "loadXcrysden":
		setV('load ?.xsf ; set defaultDirectory');
		break;
	case "loadOutcastep":
		setName();
		onClickLoadCastep();
		break;
	}
	document.fileGroup.reset();
}

function postLoad(type) {
	preload(type);
	setName();
	getUnitcell();
	runJmolScriptWait('unitcell on');
	document.fileGroup.reset();
}

var sampleOptionArr = ["Load a Sample File", 
	"MgO slab", 
	"urea single-point calculation", 
	"benzene single-point calculation", 
	"NH3 geometry optimization", 
	"NH3 vibrations", 
	"quartz CIF", 
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
	if (fname)
		runJmolScript("load '" + fname + "' " + getValue("modelNo") + " packed");
}


function setName() {
	setTextboxValue("filename", "Filename:");
	var name = jmolGetPropertyAsJSON("filename");
	name = "Filename: "
		+ name
		.substring(name.indexOf('\"') + 13,
				name.lastIndexOf('}') - 1);
	setTextboxValue("filename", name);
}
