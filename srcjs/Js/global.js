// global variables used in JS-ICE
// Geoff van Dover 2018.10.26

var version = "3.0.0"; // BH 2018


// from _m_spectra.js

var _specData;

// from _m_file.js

_fileData = {};
_cell = {
		a : 0,
		b : 0,
		c : 0,
		alpha : 0,
		beta : 0,
		gamma : 0,
		typeSystem : ''
};
var _fileIsReload = false;

// from symmetry.js

var prevframeSelection = null;
var prevFrame = null;

// from _m_build.js

// from _m_cell.js
//var _cell = {};
	
// from _m_symmetry.js

var _symmetry = {
		chosenSymElement: "", 
		chosenSymop: "",
		symOffset: "{0/1,0/1,0/1}"
}; 

// from plotgraph.js

var _plot = {};

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
