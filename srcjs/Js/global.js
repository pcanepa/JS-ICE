// global variables used in JS-ICE
// Geoff van Dover 2018.10.26

// from _m__tabs.js

var tabMenu = [];


// from _m_spectra.js

var _specData;

// from _m_file.js

var _fileData = {};
var _fileIsReload = false;

// from symmetry.js

var prevframeSelection = null;
var prevFrame = null;

// from _m__tabs

var TAB_OVER  = 0;
var TAB_CLICK = 1;
var TAB_OUT   = 2;

var thisMenu = -1;
var tabTimeouts = [];
var tabDelayMS = 100;

var menuNames = [
	"File", "Cell", "Show" ,"Edit" /*, "Build"*/, "Symmetry",
	"Measure", "Orient", "Polyhedra", "Surface", 
	"Optimize", "Spectra", "Elec", "Other",
	];