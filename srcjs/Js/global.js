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
var distanceZ, angleZ, torsionalZ
var arrayAtomZ = new Array(3);

var makeCrystalSpaceGroup = null;

// from _m_cell.js

var aCell, bCell, cCell, alpha, beta, gamma, typeSystem


// from _m_show.js


// from constant.js

var version = "3.0.0"; // BH 2018

// from conversion.js

var finalGeomUnit = ""
var unitGeomEnergy = "";

var radiant = Math.PI / 180;

// from frame.js

var frameSelection = null;
var frameNum = null;
var frameValue = null;

//from pick.js

var pickingEnabled = false;
var counterHide = 0;
var selectedAtoms = [];
var sortquestion = null;
var selectCheckbox = null;
var menuCallback = null;

// from plotgraph.js

var itemEnergy
var previousPoint = null
var itemForce
var previousPointForce = null
var itemFreq

var theplot; // global, mostly for testing.

var haveGraphSpectra, haveGraphOptimize;

var energy = 0;
	var label = "";
	var previous = 0;
// var last = modelCount - 1;
	
	var data = [];
    var A = [];
    var nplots = 1;
// var modelCount = Info.length;
//var stringa = Info[3].name;
    
    var nullValues;
    
    var minY = 999999;

    var dataSpectrum = [];
	var spectrum = [];
	
// from uff.js

var counterUff = 0

// from windows.js

var windowoptions = "menubar=yes,resizable=1,scrollbars,alwaysRaised,width=600,height=600,left=50";

// for citations:

var _global = {
	citations : [
	   { title:				
		'J-ICE: a new Jmol interface for handling and visualizing crystallographic and electronic properties' 
		, authors: ['P. Canepa', 'R.M. Hanson', 'P. Ugliengo', '& M. Alfredsson']
		, journal: 'J.Appl. Cryst. 44, 225 (2011)' 
		, link: 'http://dx.doi.org/10.1107/S0021889810049411'
	   }
	   
	 ]  
};
