// global variables used in JS-ICE
// Geoff van Dover 2018.10.26


// from _m_spectra.js

var _specData;

// from _m_file.js

var _fileData = {};
var _fileIsReload = false;

// from symmetry.js

var prevframeSelection = null;
var prevFrame = null;

// from _m_build.js
var counterClicZ = 0;

var distanceZ, angleZ, torsionalZ
var arrayAtomZ = new Array(3);

var makeCrystalSpaceGroup = null;

// from _m_cell.js

var aCell, bCell, cCell, alpha, beta, gamma, typeSystem; 

// from _m_edit.js

var deleteMode = "";
var hideMode = "";
var displayMode = "";
var firstTimeEdit = true;

var radBondRange;
