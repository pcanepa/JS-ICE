/* J-ICE 0.1 script library Piero Canepa 

    based on: http://chemapps.stolaf.edu/jmol/docs/examples-11/flot/ Bob Hanson
 *
 * Copyright (C) 2010-2014  Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 * Contact: pc229@kent.ac.uk
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

// var itemEnergy
// var previousPoint = null
// var itemForce
// var previousPointForce = null

// var theplot; // global, mostly for testing.

// var haveGraphOptimize;


//	var label = "";
//	var previous = 0;
	
//	var data = [];
//  var A = [];
//    var nplots = 1;
//	var modelCount = _file.info.length;
//var stringa = _file.info[3].name;
    
//	var nullValues;
    
//    var minY = 999999;

//	var dataSpectrum = [];
//	var spectrum = [];


//var appletPrintable = (navigator.appName != "Netscape"); // Sorry, I don't
////know how to check
////for this
//
////This has changed
//function $() {
//	// document ready function
//	if (!appletPrintable)$("#appletdiv").addClass("noprint"); 
//}

function arrayMax(a) {
		if (a.length == 0)
			return 0;
		var max = -1e9;
		var len = a.length;
		for (var i = a.length; --i >= 0;)
			if (a[i] > max)
				max = a[i];
		return max;
}

function arrayMin(a) {
	if (a.length == 0)
		return 0;
	var min = 1e9;
	var len = a.length;
	for (var i = a.length; --i >= 0;)
		if (a[i] < min)
			min = a[i];
	return min;
}


function plotEnergies(){
	var modelCount = _file.info.length;
	if (_file.haveGraphOptimize || modelCount < 3)
		return false;
	_file.haveGraphOptimize = true;
	_plot = {
		theplot : null,
		itemEnergy : 0,
		itemForce : 0,
		previousPoint : null,
		previousPointForce : null
	};
	var last = modelCount - 1;
	var previous = null;
	var energy = 0;
	var label = "";
	var data = [];
	var A = [];
	var nplots = 1;
	var stringa = _file.info[3].name;
	var f = null;
	var pattern = null;

	switch (_file.plotEnergyType) {
	case "crystal":
		if(stringa.search(/Energy/i) < 0)
			return false;
		f = substringEnergyToFloat;
		break;
	case "dmol":
		if(stringa.search(/E/i) < 0) 
			return false;
		f = substringEnergyToFloat;
		break;
	case "outcar":
		pattern = new RegExp("G =", "i");
		f = substringEnergyVaspToFloat;
		break;
	case "qespresso":
		pattern = new RegExp("E =", "i");
		f = substringEnergyQuantumToFloat;
		break;
	case "gulp":
		pattern = new RegExp("E =", "i");
		f = substringEnergyGulpToFloat;
		break;
	case "gaussian":
		// special case
		break;
	default:
		f = substringEnergyVaspToFloat;
		break;
	}
	
	if (f) {
		// not Gaussian
		for (var i = 0; i < last; i++) {
			var name = _file.info[i].name;
			if (!name || pattern && !pattern.exec(name) || name.search(/cm/i) >= 0)
				continue;
			var modelnumber = 0+ _file.info[i].modelNumber;
			if(i > 0)
				previous = i - 1;
			var e = f(name);
//			if(i == 0 || _file.info[i - 1].name == null) {
				energy = Math.abs(e - f(_file.info[last].name));
//			} else if (previous > 0 && e != f(_file.info[i - 1].name)) {
//				energy = Math.abs(e - f(_file.info[i - 1].name));
//			}
			label = 'Model = ' + modelnumber + ', &#916 E = ' + energy + ' kJmol^-1';
			A.push([i+1,energy,modelnumber,label]);
		}
	} else {
		// Gaussian
		last = _file.energy.length;
		for (var i = 1; i < last; i++) {
			var name = _file.energy[i];
			if (!name || pattern && !pattern.exec(name) || name.search(/cm/i) >= 0)
				continue;
			var modelnumber = _file.energy.length - 1;		
			if(i > 0 && i < _file.info.length)
				var previous = i - 1;
			var e = fromHartreetokJ(name);
			var e1;
//			if(i == 0 || (e1 = energyGauss[i - 1]) == null) {
				energy = Math.abs(e - fromHartreetokJ(_file.energy[last]));
//			} else if (previous > 0) {
//				if (e != e1)
//					energy = Math.abs(e - e1);
//			}
			label = 'Model = ' + modelnumber + ', &#916 E = ' + energy + ' kJmol^-1';
			A.push([i+1,energy,modelnumber,label]);
		}
	}
	data.push(A)
	var options = {
		lines: { show: true },
		points: {show: true, fill: true},
		xaxis: { ticks: 8, tickDecimals: 0 },
		yaxis: { ticks: 6,tickDecimals: 1 },
		selection: { mode: (nplots == 1 ? "x" : "xy"), hoverMode: (nplots == 1 ? "x" : "xy") },
		grid: { hoverable: true, clickable: true, hoverDelay: 10, hoverDelayDefault: 10 }
	}
	_plot.energyPlot = $.plot($('#plotarea'), data, options);
	_plot.previousPoint = null;
	$("#plotarea").unbind("plothover plotclick", null);
	$("#plotarea").bind("plotclick", plotClickCallback);
	_plot.itemEnergy = {datapoint:A[0]}
	setTimeout(function(){plotClickCallback(null,null,_plot.itemEnergy)},100);

	//function plotGradient(){


	if(!_file.plotEnergyForces)
		return;
	var data = [];
	var A = [];
		
	var maxGra;
	if(stringa.search(/Energy/i) != -1){
		last = modelCount - 1;
		for (var i = 0; i < last; i++) {
			var name = _file.info[i].name;
			if (name == null)
				continue;
			var modelnumber = 0 + _file.info[i].modelNumber;
			// first gradient will be for model 1
			// This is if is to check if we are dealing with an optimization
			// or
			// a
			// frequency calculation
			if (!name || pattern && !pattern.exec(name) || name.search(/cm/i) >= 0)
				continue;
				maxGra = parseFloat(_file.info[i].modelProperties.maxGradient);
//			else if(name && previous > 0) {
//				if (substringEnergyToFloat(_file.info[i].name) != substringEnergyToFloat(_file.info[i - 1].name))
//					maxGra = parseFloat(_file.info[i].modelProperties.maxGradient);
//			}
			if (isNaN(maxGra))
				continue;
			label = 'Model = ' + modelnumber + ', ForceMAX = ' + maxGra;
			A.push([i+1,maxGra,modelnumber,label]);
		}
	}	
	data.push(A);
	var options = {
		lines: { show: true },
		points: {show: true, fill: true},
		xaxis: { ticks: 8, tickDecimals: 0 },
		yaxis: { ticks: 6,tickDecimals: 5 },
		selection: { mode: (nplots == 1 ? "x" : "xy"), hoverMode: (nplots == 1 ? "x" : "xy") },
		grid: { hoverable: true, clickable: true, hoverDelay: 10, hoverDelayDefault: 10 }
		// hoverMode, hoverDelay, and hoverDelayDefault are not in the original
		// Flot package
	}
	_plot.forcePlot = $.plot($("#plotarea1"), data, options);
	_plot.previousPointForce = null
	$("#plotarea1").unbind("plothover plotclick", null);
	$("#plotarea1").bind("plothover", plotHoverCallbackforce);
	$("#plotarea1").bind("plotclick", plotClickCallbackForce);
	_plot.itemForce = { datapoint:A[0] };
	setTimeout(function(){plotClickCallbackForce(null,null,_plot.itemForce)},100);
}

function plotClickCallback(event, pos, itemEnergy) {

	if (!itemEnergy)
		return
	var model = itemEnergy.datapoint[2];
	var label = itemEnergy.datapoint[3];
	runJmolScriptWait('model '+ model);
	// This select the element from the list of the geometry models
	// +1 keeps the right numeration of models
	getbyID('geom').value = model + 1;

}

function plotClickCallbackForce(event, pos, itemForce) {
	if (!itemForce)return
	var model = itemForce.datapoint[2];
	var label = itemForce.datapoint[3];
	runJmolScriptWait('model '+model);
	// This select the element from the list of the geometry models
	// +1 keeps the right numeration of models
	getbyID('geom').value = model + 1;

}

function plotHoverCallback(event, pos, itemEnergy) {
	hideTooltip();
	if(!itemEnergy)return
	if (_plot.previousPoint != itemEnergy.datapoint) {
		_plot.previousPoint = itemEnergy.datapoint ;
		var y = roundoff(itemEnergy.datapoint[1],4);
		var model = itemEnergy.datapoint[2];
		var label = "&nbsp;&nbsp;Model "+ model + ", &#916 E = " + y +" kJmol^-1";
		showTooltipEnergy(itemEnergy.pageX, itemEnergy.pageY + 10, label, pos)
	}
	if (pos.canvasY > 350)plotClickCallback(event, pos, itemEnergy);
}


function plotHoverCallbackforce(event, pos, itemForce) {
	hideTooltip();
	if(!itemForce)return
	if (_plot.previousPointForce != itemForce.datapoint) {
		_plot.previousPointForce = itemForce.datapoint;
		var y = roundoff(itemForce.datapoint[1],6);
		var model = itemForce.datapoint[2];
		var label = "&nbsp;&nbsp;Model "+ model + ", MAX Force = " + y;
		showTooltipForce(itemForce.pageX, itemForce.pageY + 10, label, pos);
	}
	if (pos.canvasY > 350)plotClickCallback(event, pos, itemForce);
}

function hideTooltip() {
	$("#tooltip").remove();
}

function showTooltipEnergy(x, y, contents, pos) {

	if (pos.canvasY > 340) y += (340 - pos.canvasY)
	$('<div id="tooltip">' + contents + '</div>').css( {
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#6a86c4',
		'color': '#FFFFCC',
		'font-weight': 'bold',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);

}

function showTooltipForce(x, y, contents, pos) {
	if (pos.canvasY > 340) y += (340 - pos.canvasY);
	$('<div id="tooltip">' + contents + '</div>').css( {
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#6a86c4',
		'color': '#FFFFCC',
		'font-weight': 'bold',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);

}

function showTooltipFreq(x, y, contents, pos) {
	if (pos.canvasY > 340) y += (340 - pos.canvasY);
	$('<div id="tooltip">' + contents + '</div>').css( 
	{
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#6a86c4',
		'color': '#FFFFCC',
		'font-weight': 'bold',
		opacity: 0.80}
	).appendTo("body").fadeIn(200);

}

//function jmolLoadStructCallback() {
//	alert("calling plotgraph#jmolLoadStructCallback??")
//	setTimeout('doPlot()');
//}

//code that fakes an applet print by creating an image in its place! :)

//function setImage() {
//	if (appletPrintable)return
//	var image = jmolGetPropertyAsString("image")
//	var html = '<img src="data:image/jpeg;base64,'+image+'" />'
//	getbyID("imagediv").innerHTML = html
//}

//function doHighlight(app, modelIndex) {
//	if (!iamready)return;
//	theplot.unhighlight(0,-1)
//	theplot.highlight(0, modelIndex);
//	var label = data[0][modelIndex][3];
//    setTimeout('runJmolScript("set echo top left; echo ' + label+'")',100);
//}


//function doPrintAll() {
//	setImage()
//	window.print()
//}

//function countNullModel(arrayX) {
//	var valueNullelement = 0;
//	for (var i = 0; i < arrayX.length; i++) {
//		if (arrayX[i].name == null || arrayX[i].name == "")
//			valueNullelement = valueNullelement + 1;
//	}
//	return valueNullelement;
//}

//for spectrum.html or new dynamic cool spectrum simulation

// var plotOptionsHTML = {
//		   series: { lines: { show: true, fill: false } },
//		   xaxis: { ticks: 10, tickDecimals: 0 },
//		   yaxis: { ticks: 0, tickDecimals: 0 },
//		   grid: { hoverable: true, autoHighlight: false},
//		   //crosshair: { mode: "x" }
//		};

