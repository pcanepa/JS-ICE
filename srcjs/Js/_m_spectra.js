/*
 *   based on:
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

//This simulates the IR - Raman spectrum given an input 


function enterSpectra() {
//enterSpectra gets information from fileData in order to set up the plot frequency. This includes nmin, nmax and selected 
//frequency values. nMin, nMax and sigma values are also changeable by hitting the enter key.
	if (!_file.plotFreq) {
		_file.plotFreq = {
				yscale: 1,
				minX0: 0,
				maxX0: 4000,
				selectedFreq: -1
		};
		_file.specData = null;
		symmetryModeAdd();	
		onClickModSpec(true, true);	
		if (!_file.specData)
			return;		
		setValue("nMax", _file.specData.maxX);
		setValue("nMin", _file.specData.minX);
	}
	$("#nMin").keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			onClickMinMax();
		}
	});
	$("#nMax").keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			onClickMinMax();
		}
	});
	$("#sigma").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		onClickModSpec(false, true);
		}
	});
}

function exitSpectra() {
//Leaving the spectra page turns off the vibration and vectors.
	stopVibration();
}

function stopVibration() {
	runJmolScriptWait("vibration off; vectors off");	
}

function doSpectraNewWindow() {
//This opens the spectra graph in the new window. 
	var newwin = open("spectrum.html");
}

function onClickSelectVib() {
//Vibration chosen and shown in animation
	var vib = getbyID('vib');
	var model = parseInt(vib.value);
	showFrame(model);	
	updateJmolForFreqParams(true);
	// trigger to make sure selectedIndex has been set.
	setTimeout(function() {selectVib()}, 50);
}

function selectVib(index) {
//When triggered (by a click), the vibration is retrieved from the file data. The graph is then
//updated to show a larger red line at the selected frequency. The correct frame is also shown for the 
//specific vibration.
	var vib = getbyID('vib');
	index || (index = vib.selectedIndex);
	_file.specData.currentModel = (index < 0 ? 0 : parseInt(vib.options[index].value));
	_file.plotFreq.selectedFreq = (index < 0 ? -1 
			: _file.specData.freqs[_file.specData.vibList[index][3]]);
	showFreqGraph("plotareafreq", _file.specData, _file.plotFreq);
}

function selectVibByModel(model) {
	if (model > 0) {
		var vib = getbyID('vib');
		var options = vib.options;
		for (var i = 0; i < options.length; i++) {
			if (options[i].value == model) {
				vib.selectedIndex = i;
				selectVib(i);
				return;
			}
		}
	}
	_file.plotFreq.selectedFreq = -1;
	stopVibration();
}

function setYMax() {
// The maxY value is found from the information taken from the file and put into specData. 
//The max y value of both Raman and IR arrays becomes the ymax value in fileData.
	var specData = setUpSpecData("all", "any"); 
	getFrequencyList(specData);
	createSpectrum(specData);
	 _file.spectraYMax = Math.max(arrayMax(specData.specIR), arrayMax(specData.specRaman));
}

function onClickSymmetry() {
	onClickMinMax();
}

function onClickMinMax() {
	var model = _file.specData.currentModel;
	onClickModSpec();
	selectVibByModel(model);
}

function onClickModSpec(isPageOpen, doSetYMax) {
// Gets information on the symmetry, IR or Raman, etc. in specData that is chosen by the user 
//and/or file data. It then remakes the spectra plot with the updated information.
	if (_file.freqData.length == 0) {
		return;
	}
	if (doSetYMax) {
		setYMax();
	}
	if (isPageOpen) {
		checkBox("radVibrationOff");
		uncheckBox("vectorsON");
	}
	var typeIRorRaman = getRadioSetValue(document.modelsVib.modSpec);
	var irrep = getValueSel('sym');		
	_file.specData = setUpSpecData(typeIRorRaman,irrep);
	getFrequencyList(_file.specData);
	createSpectrum(_file.specData);
	setVibList(_file.specData);
	if (isPageOpen){
		setMaxMinPlot(_file.specData);
	}
	return showFreqGraph("plotareafreq", _file.specData, _file.plotFreq);
}

function setUpSpecData(typeIRorRaman,irrep) {
// This sets up specData, which is used throughout the code as an easy way to store all 
//necessary information in terms of plotting the spectra.
	return {
			typeIRorRaman : typeIRorRaman, 
			typeConvolve  : getRadioSetValue(document.modelsVib.convol), 
			irrep     : irrep,
			sigma     : parseFloat(getValue('sigma')), 
			rescale   : true,
			invertx   : isChecked('invertX'),
			freqCount : _file.freqInfo.length,
			minX      : Math.min(parseInt(getValue("nMin")), parseInt(getValue("nMax"))),
			maxX      : Math.max(parseInt(getValue("nMin")), parseInt(getValue("nMax"))),
			maxY      : _file.spectraYMax,
			maxR      : 3700,
			previousPointFreq : -1,
			currentModel : 1,
			vibList   : [],
			freqInfo  : [],
			irInt     : [],
			irFreq    : [],
			ramanInt  : [],
			ramanFreq : [],
			sortInt   : [],
			specIR    : [],
			specRaman : [],
			model     : [],
			freqs     : [],
			ranges    : [] 
	};
	
}

function createSpectrum(specData) {
//This function creates the spectrum (either stick or cool) based on whether the spectrum includes
//Raman data, IR data, or both (decided on by user and found in specData).
	switch (specData.typeIRorRaman) {
	case "ir":
		extractIRData(specData);
		break;
	case "raman":
		extractRamanData(specData);
		break;
	default:
		extractIRData(specData);
		extractRamanData(specData);
		break;
	}
	
	var create = (specData.typeConvolve == "stick" ? createStickSpectrum : createCoolSpectrum);

	switch (specData.typeIRorRaman) {
	case "ir":
		create(specData, "ir");
		break;
	case "raman":
		create(specData, "raman");
		break;
	default:
		create(specData, "ir");
		create(specData, "raman");
		break;
	}
}

function setMaxMinPlot(specData) {
//This function gets the max and min data for the plot. The max x is defined as being 4000, or 300 
//greater than the last peak if the final peak is at a much lower value.
	var n = specData.freqCount;
	var sum = 0;
	try { 
		for (var i = 0; i < n; i++) {
			
			System.out.println(i + " " + specData.freqInfo[i].modelProperties.Frequency);
			
			sum += roundoff(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency), 0);
		}
		specData.maxR = (isNaN(sum) ? 3700 : sum / n);

	} catch (err){
			specData.maxR = 3700;
	}
		
	_file.plotFreq.minX0 = specData.minX = 0;
	_file.plotFreq.maxX0 = specData.maxX = specData.maxR + 300;

}

function getFrequencyList(specData) {
// This function finds the frequency list and vibration list from modelProperties in fileData, and
//is based on IR or Raman type. These lists are then pushed into specData as the freqInfo and VibList.
	// fill specData.freqInfo[] and specData.vibList[]
	var vibLinesFromIrrep = getVibLinesFromIrrep(specData);
	var prop = (specData.typeIRorRaman == "ir" ? "IRactivity" 
			: specData.typeIRorRaman == "raman" ? "Ramanactivity" 
			: null);
	specData.vibList = [];
	specData.freqInfo = [];
	for (var i = 0; i < specData.freqCount; i++) {
		var label = null;
		if ((vibLinesFromIrrep == null || (label = vibLinesFromIrrep[i]))
			  && (prop == null || _file.freqInfo[i].modelProperties[prop] == "A")) {
			specData.freqInfo.push(_file.freqInfo[i]);
			specData.vibList.push([(label || (i+1) + " " + _file.freqInfo[i].name), _file.freqInfo[i].modelNumber, -1]);
		}
	}
}

function setVibList(specData) {
// This function makes vibList include only frequencies in the xmax and xmin range.
	var vib = getbyID('vib');	
	cleanList('vib');
	console.log("clear vib");
	var xmin = specData.minX;
	var xmax = specData.maxX;	
	for (var i = 0, pt = 0, n = specData.vibList.length; i < n; i++) {
		if (specData.freqs[i] >= xmin && specData.freqs[i] <= xmax) {
			addOption(vib, specData.vibList[i][0], specData.vibList[i][1]);
			console.log("adding vib " + i + " " + specData.vibList[i]);
			specData.vibList[pt][3] = i;  // reverse loop-up
			specData.vibList[i][2] = pt++;
		}
	}
	var script = ";set echo bottom left;echo \"\";";	
	runJmolScriptWait(script)

}

function getVibLinesFromIrrep(specData) {
	var vibLinesFromIrrep = [];
	var irep = specData.irrep;
	if (irep == "any")
		return null;
	
	// check for F, E, or A irreducible representations
	
	if (_file.freqSymm) {
		// gaussian and others
		for (var i = 0, val; i < _file.freqSymm.length; i++) {
			if (irep == _file.freqSymm[i])
				vibLinesFromIrrep[i] = 
					(i+1) + " " + irep + " "+ _file.freqData[i] 
					+ (_file.freqIntens[i] ? " (" + _file.freqIntens[i] + ")" : "");
		}
	} else {
		for (var i = 0, val; i < _file.freqInfo.length; i++) {
			if (irep == _file.freqInfo[i].modelProperties.vibrationalSymmetry)
				vibLinesFromIrrep[i] = (i+1) + " " + _file.freqInfo[i].name;
		}
	}
	return vibLinesFromIrrep;
}

function extractIRData(specData) {
//Returns the file type that the IR data must be extracted from..
 return file_method("extractIRData", function() {}, [specData]);
}

//The next functions extract IR data for a variety of file types.
function extractIRData_crystal(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		if (specData.freqInfo[i].modelProperties.IRactivity != "A") 
			continue;
		specData.freqs[i] = specData.irFreq[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
		specData.irInt[i] = Math.round(substringIntFreqToFloat(specData.freqInfo[i].modelProperties.IRintensity));
		specData.sortInt[i] = specData.irInt[i];
		specData.specIR[specData.irFreq[i]] = specData.irInt[i];
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
		
	}
	System.out.println("crystal extractIRData");
}

function extractIRData_vaspoutcar(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		specData.freqs[i] = specData.irFreq[i] = Math.round(substringFreqToFloat(_file.freqData[i]));
		specData.specIR[specData.irFreq[i]] = 100;
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
		specData.irInt[i] = 100;
		if (i == 0)
			specData.irInt[i] = 0;
	}
}

function extractIRData_gaussian(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		specData.freqs[i] = specData.irFreq[i] = Math.round(substringFreqToFloat(specData.freqData[i]));
		specData.specIR[specData.irFreq[i]] = specData.irInt[i] = rtrim(specData.freqIntens[i], 1, "K", 1);
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
	}
}

function rtrim(s, i0, char, i1) {
	return s.substring(i0,s.indexOf("K") - i1);
}

function extractRamanData(specData) {
//Extracts the Raman data and adds it to specData.
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		if (specData.freqInfo[i].modelProperties.Ramanactivity == "A") {
			specData.freqs[i] = specData.ramanFreq[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
			specData.ramanInt[i] = 100;
			specData.specRaman[specData.ramanFreq[i]] = 100;
			specData.model[specData.ramanFreq[i]] = specData.freqInfo[i].modelNumber;
		} else {
			specData.ramanInt[i] = 0;
		}
	}
	return specData;
}

function createStickSpectrum(specData, type) {
//Scales the data for a stick spectrum.
	var rescale = specData.rescale;
	var spec = (type == "ir" ? specData.specIR : specData.specRaman);
	var maxInt = maxValue(spec);
	var allZero = (maxInt == 0);
	if (allZero) {
		maxInt = 200;
		rescale = true;
	}
	spec[0]= null
	for (var i = 0; i < 4000; i++) {
		if (spec[i] == null) {
			spec[i] = 0;
		} else {
			if (allZero && spec[i] == 0)
				spec[i] = maxInt / 2; 
			if (rescale) {
				if (spec[i] != 0)
					spec[i] = (spec[i] / maxInt) * 100;
			}
		}
	}
}

function createCoolSpectrum(specData, type) {
//scales data for Gaussian or Lorentzian convolutions. 
		var maxInt;
		if (specData.sortInt) {
		 	maxInt = maxValue(specData.sortInt);
		} else if (specData.maxR) {
			maxint = specData.maxR;
		} else {
			maxInt = 100;
		}
		if (maxInt == 0)
			maxInt = 200;
		specData.maxInt = maxInt;
		
		createConvolvedSpectrum(specData, type);
}

function getPlotIntArray() {
	alert("_m_spectra.js#getPlotIntArray has not been implemented.");
}

function createConvolvedSpectrum(specData, type) {
// Based on the typeconvolve given in specData, function creates the Gaussian and Lorentzian convolutions.
	var isGaussian = (specData.typeConvolve == "gaus");
	var spec = (type == "ir" ? specData.specIR : specData.specRaman);
	var freqCount = specData.freqCount;
	var irInt = specData.irInt;
	var irFreq = specData.irFreq;
	var ramanInt = specData.ramanInt;
	var ramanFreq = specData.ramanFreq;
	var sigma = specData.sigma;	
	var maxInt = specData.maxInt;

	var allZero = (maxValue(spec) == 0);

	// Gaussian Convolution
	var cx = 4 * Math.LN2;
	var ssa = sigma * sigma / cx;	

	// Lorentzian Convolution
	var xgamma = specData.sigma;
	var ssc = xgamma * 0.5 / Math.PI;
	var ssd = (xgamma * 0.5) * (xgamma * 0.5);
	
	var sb = Math.sqrt(cx) / (sigma * Math.sqrt(Math.PI));

	var freq = (type == "ir" ? irFreq : ramanFreq);
	var int = (type == "ir" ? irInt : ramanInt);
	
	for (var i = 0; i < 4000; i++) {
		var sp = 0;
		for (var k = 0, n = freqCount; k < n; k++) {
			// discard translation
			if (!freq[k]) 
				continue;
			int[k] || (int[k] = 0);
			v = (allZero ? 100 : int[k]);
			var xnn = i - freq[k];
			sp += (isGaussian ? Math.exp(-xnn * xnn / ssa) : ssc / (xnn * xnn + ssd)) * v * sb;
		}
		spec[i] = sp;
	}
}

function showFreqGraph(plotDiv, specData, plot) {
//This large function creates the spectrum itself. This makes the axes, the clickable and hoverable options, and 
// creates the ability to zoom and open the spectrum in a new window. 
	var isHTMLPage = (!specData);
	if (isHTMLPage) {
		specData = _file.specData = opener._file.specData;
		plot = _file.plotFreq = opener._file.plotFreq;
	}
	var minX = specData.minX;
	var maxX = specData.maxX;
	var maxY = specData.maxY;
	if (maxY == 0)
		maxY = 200;
	maxY *= 1.2;
	var minY = -0.05*maxY;
	var plotArea = $("#" + plotDiv);
	getRanges(specData);
	var A = specData.specIR, B = specData.specRaman;	
	var model = specData.model;
	var nplots = (B && B.length && A && A.length ? 2 : 1);
	var options = {
      series:{
    	  	lines: { show: true, fill: false }
      },
      xaxis: { 
    	  min : minX, 
    	  max : maxX, 
    	  ticks : (maxX - minX < 2000 ? 5 : 10), 
    	  invert : specData.invertx,
    	  tickDecimals: 0 
      },
      yaxis: { ticks: 0, tickDecimals: 0, min: minY, max: maxY },
      selection: { 
    	  	mode: "x", 
    	  	hoverMode: "x" 
      },
      grid: { 
			hoverable: true, 
			clickable: true, 
			hoverDelay: 10, 
		    autoHighlight: false,
			hoverDelayDefault: 10,
      }
	};
	var ir = [];
	var raman = [];
	for (var i = specData.minX, pt = 0; i < specData.maxX; i++, pt++) {
		if (A.length)
			ir[pt] = [i, A[i]*plot.yscale, model[i]];
		if (B.length)
			raman[pt] = [i, B[i]*plot.yscale, model[i]];		
	}

	var data = [];
	if (A.length && B.length) {
		data.push({label:"IR", data:ir, color:"orange"});
		data.push({label:"Raman", data: raman, color:"blue"});
	} else if (A.length) {
		data.push({label:"IR", data:ir, color:"orange"});
	} else if (B.length) {
		data.push({label:"Raman", data: raman, color:"blue"});
	}
	var haveSelected = false;
	for(var i= 0; specData.freqs.length > i; i++){
		var specfreq= specData.freqs[i];
		var y0 = (!isHTMLPage && plot.selectedFreq == specfreq ? minY : maxY * 0.95)
		data.push({data: [[specfreq, y0],[specfreq, maxY]], color:"red", lineWidth:1});
		if (y0 == minY)
			haveSelected = true;
	}
	plotArea.unbind("plothover plotclick plotselected", null)
	plotArea.bind("plothover", plotHoverCallbackFreq);
	if (!isHTMLPage) {
		plotArea.bind("plotclick", plotClickCallbackFreq);
		plotArea.bind( "plotselected", plotSelectCallbackFreq);
	}
	$.plot(plotArea, data, options);	
	_file.specData.previousPointFreq = -1;
	return haveSelected;
}

function plotSelectCallbackFreq(event, ranges) {
//Used to change the min and max x when a large enough range is selected. 
	var x1 = ranges.xaxis.from | 0;
	var x2 = ranges.xaxis.to | 0;
	if (Math.abs(x2-x1) > 100) {
		setValue("nMin", Math.min(x1, x2));
		setValue("nMax", Math.max(x1, x2));
		setTimeout(onClickMinMax,50);
	}
}

function getRanges(specData) {
// Function creates the ranges array in specData. This is used to provide the user a small clickable
//range which facilitates clicking peaks. 
	var freqs = specData.freqs
	var sigma = specData.sigma;
	n = specData.freqs.length;
	
	for (var i = 0, x1, x2, last=n-1; i <= last; i++) { 
		switch (i) {
		case 0:
			x1 = specData.minX;
			x2 = (freqs[i] + freqs[i + 1])/2;
			break;
		case last:
			x1 = (freqs[i] + freqs[i - 1])/2;
			x2 = specData.maxX;
			break;
		default:
			x1 = (freqs[i] + freqs[i - 1])/2;
			x2 = (freqs[i] + freqs[i + 1])/2;
			break;
		}
		specData.ranges.push([Math.max(x1, freqs[i] - sigma/2), Math.min(x2, freqs[i] + sigma/2), freqs[i], i]);
	}
}	

function plotClickCallbackFreq(event, pos, itemFreq) {
//Vibration is selected based on a range clicked. 
	var range = (itemFreq ? getFreqForClick(itemFreq.datapoint) : null);
	// itemFreq is [x,y] so [freq,int]
	// range is [min,max,freq,i]
	var listIndex = (range ? _file.specData.vibList[range[3]][2] : -1);
	if (listIndex < 0) {
		setTimeout(function() { selectVib(-1) }, 50);
		return;		
	}
	
	// saves model index as _file.specData.currentModel
	getbyID('vib').options[listIndex].selected = true;
	setTimeout(function(){onClickSelectVib(0);},50);
}

function plotHoverCallbackFreq(event, pos, itemFreq) {
//Shows the vibrational frequency if user hovers over range. Does not change the frequency 
//unless user hovers along the top red lines.
	hideTooltip();
	if(!itemFreq)return
	if (_file.specData.previousPointFreq != itemFreq.datapoint) {
		previousPointFreq = itemFreq.datapoint;
		var range = getFreqForClick(itemFreq.datapoint);
		if (!range)
			return;
		var freq = range[2];
		var listIndex = _file.specData.vibList[range[3]][2];	
		if (listIndex < 0)
			return;		
		var model = _file.specData.model[freq];
		var x = roundoff(itemFreq.datapoint[0],2);
		var y = roundoff(itemFreq.datapoint[1],1);
		var model = itemFreq.datapoint[2];		
		label = getbyID('vib').options[listIndex].text;
		showTooltipFreq(itemFreq.pageX, itemFreq.pageY + 10, label, pos);
	}
	if (pos.canvasY < 30)setTimeout(function(){plotClickCallbackFreq(event, pos, itemFreq)},50);
}


/*
 * function scaleSpectrum(){
 * 
 * var vecorFreq = []; var vecorChk = []; var counter; for(var i =0 ; i <
 * _file.info.length; i++){ vecorFreq[i] = _file.info[i].name; vecorChk[i] = 0 if(i == 0)
 * vecorChk[i] = 1 counter++ }
 * 
 * var s = " Shift spectrum "; s+= createSelect("Frequencies", "", 0, 1, counter ,
 * vecorFreq, vecorFreq, vecorChk) + "" s+=
 * createText2("rescaleSpectra","0.00","5","") + " cm<sup>-1</sup>"; s+=
 * createButton("rescaleSpectraButton","Shift","","") document.write(s); }
 */

function sortNumber(a, b) {
//Returns value a-b (self-explanatory).
	return a - b;
}

function maxValue(a) {
//This simply finds the maximum value in an array. 
	var max = 0;
	for (var i = a.length; --i >= 0;) {
		if (a[i] > max)
			max = a[i];
	}
	return max;
}

function minValue(irInt) {
	return parseInt(irInt.sort(sortNumber)[0]);
}

function symmetryModeAdd() { 
// extracts vibrational symmetry modes from _file.info
// array and lets one get symmetry operations by ID.
	cleanList('sym');
	var sym = getbyID('sym');
	if (_file.info[3] && _file.info[3].modelProperties) {
		var symm = _file.freqSymm;
		if (!symm) {
			var symm = [];
			for (var i = 1; i < _file.info.length; i++)
				if (_file.info[i].name)
					symm[i] = _file.info[i].modelProperties.vibrationalSymmetry;
		}
		var sortedSymm = unique(symm);
		addOption(sym, "any", "any");
		for (var i = 0; i < sortedSymm.length; i++) {
			var label = sortedSymm[i]; 
			if (label)
				addOption(sym, label, label);
		}
	}	
}

function unique(a) {
// This function removes duplicates.
	var r = [];
	var list = "";
	for (var i = 0, n = a.length; i < n; i++) {
		var item = a[i];
		var key = ";" + item + ";";
		if (list.indexOf(key) >= 0)
			continue;
		list += key;
		r.push(item);
	}
	return r;
}

function onClickFreqParams() {
	updateJmolForFreqParams(false);
}

function updateJmolForFreqParams(isVibClick) {
//This function is used often to update the parameters that are changeable by the user (vibration,
// vectors and their size/width/color).
	var c = jmolColorPickerBoxes["vectorColorPicker"].getJmolColor();
	var vectorsON = isChecked("vectorsON");
	var vibON = isChecked("radVibrationOn");
	var script = "vibration " + vibON
					+ ";vectors " + vectorsON
					+ ";" + getValueSel("vecsamplitude")
					+ ";" + getValueSel("vecscale")
					+ ";color vectors " + (isChecked("vibVectcolor") ? "none" : "white");
	if (vectorsON)
		script += ";" + getValueSel("widthvec");	
	var label = getTextSel('vib');
	script += ";set echo bottom left;echo \""+label+ "\";";	
	runJmolScriptWait(script);
	if (isVibClick && !vectorsON && !vibON) {
		getbyID('radVibrationOn').checked = true;
		runJmolScriptWait("vibration ON"); 
	}
}

function onClickScaleFreq(mode) {
//Makes the up button increase the y scale by 1.414, the down button decrease the y scale by 1.414, 
//and the middle button reset the original yscale, xmax and xmin. 
	switch (mode) {
	case 1:
	case -1:
		_file.plotFreq.yscale *= (mode == 1 ? 1.414 : 1/1.414);
		onClickModSpec();
		return;
	case 0:
		_file.plotFreq.yscale = 1;
		setValue("nMin", _file.plotFreq.minX0);
		setValue("nMax", _file.plotFreq.maxX0);
		onClickMinMax();
		return;
	}
}

function createFreqGrp() { 
// Creates the frequency menu on the web applet.
	var vibAmplitudeValue = new Array("", "vibration Scale 1",
			"vibration Scale 2", "vibration Scale 5", "vibration Scale 7", "vibration Scale 10"); 
	var vecscaleValue = new Array("", "vectors SCALE 1", "vectors SCALE 3",
			"vectors SCALE 5", "vectors SCALE 7", "vectors SCALE 10",
			"vectors SCALE 15", "vectors SCALE 19");
	var vecwidthValue = new Array("", "vectors 1", "vectors  3", "vectors  5",
			"vectors  7", "vectors 10", "vectors 15", "vectors  19");
	var vecscaleText = new Array("select", "1", "3", "5", "7", "10", "15", "19");
	var vibAmplitudeText = new Array("select", "1", "2", "5", "7", "10");

	var smallGraph =  createDiv("plotareafreq", "background:blue;width:300px;height:180px;background-color:#EFEFEF","");  
	var graphButtons = createButtonB("scaleup", "&#x25b2;","onClickScaleFreq(1)' title='increase Y scale",0,"width:40px") + "<br>"
		+ createButtonB("scaleup", "&#x25cf;","onClickScaleFreq(0)' title='reset X and Y",0,"width:40px") + "<br>"
		+ createButtonB("scaleup", "&#x25bc;","onClickScaleFreq(-1)' title='decrease Y scale",0,"width:40px");
	var smallGraphAndButtons = "<table cellpadding=0 cellspacing=0><tr><td valign=top>" 
			+ smallGraph + "</td><td valign=center>" 
			+ graphButtons + "</td></tr></table>";

	var simPanel = createDiv("simPanel", "", "Raman intensities set to 0.0 kmMol<sup>-1</sup>"
		+ "<br>\n"
		+ createLine('blue', '')
		+ "<br>"
		+ "Min freq. " + createText2("nMin", "0", "4", "")
		+ " Max " + createText2("nMax", "4000", "4", "") + "cm<sup>-1</sup>"
		+ createCheck("invertX", "Invert x", "onClickModSpec()", 0, 1, "")
		+ "<br>" + "Band width " + createText2("sigma", "30", "2", "") + "cm<sup>-1</sup>" 
		+ "&nbsp;"
		+ createRadio("convol", "Gaussian", 'onClickModSpec(false, true)', 0, 1, "", "gaus")
		+ createRadio("convol", "Lorentzian", 'onClickModSpec(false, true)', 0, 0, "", "lor") 
		+ createRadio("convol", "Stick", 'onClickModSpec(false, true)', 0, 0, "", "stick")
		+ "&nbsp;" + "&nbsp;" + "&nbsp;"
		+ "<br>" + createButton("simSpectra", "New Window", "doSpectraNewWindow()", 0));

	var strFreq = "<form autocomplete='nope'  id='freqGroup' name='modelsVib' style='display:none'>";
		strFreq += "<table border=0 class='contents'><tr><td valign='bottom'>";
			strFreq += "<h2>IR-Raman Frequencies</h2>\n";
			strFreq += createRadio("modSpec", "Both", "onClickModSpec()", 0, 1, "", "all");
			strFreq += createRadio("modSpec", "IR", "onClickModSpec()", 0, 0, "", "ir");
			strFreq += createRadio("modSpec", "Raman", "onClickModSpec()", 0, 0, "", "raman");
			strFreq += "<BR>\n";
			strFreq += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Symmetry <select id='sym' name='vibSym' onchange='onClickSymmetry()' onkeyup='onClickSymmetry()' CLASS='select' >";
			strFreq += "</select> ";
			strFreq += "<BR>\n";
			strFreq += "<select id='vib' name='models' OnClick='onClickSelectVib()' onkeyup='onClickSelectVib()' class='selectmodels' size=9 style='width:200px; overflow: auto;'></select>";	
		strFreq += "</td>"; // end of the first column
		strFreq += "<td valign='bottom'>";
		strFreq += "<BR>\n" + "<BR>\n";
			strFreq += "vibration ";
			strFreq += createRadio("vibration", "on", 'onClickFreqParams()', 0, 1, "radVibrationOn", "on");
			strFreq += createRadio("vibration", "off", 'onClickFreqParams()', 0, 0, "radVibrationOff", "off");
			strFreq += "<BR>\n";
			strFreq += "view vectors ";
			strFreq += createRadio("vectors", "on", 'onClickFreqParams()', 0, 1, "vectorsON", "on");
			strFreq += createRadio("vectors", "off", 'onClickFreqParams()', 0,0, "vectorsOFF", "off");
			strFreq += "<BR>\n";
			strFreq += createSelect("vecsamplitude", "onClickFreqParams()", 0, 1,
					vibAmplitudeValue, vibAmplitudeText,[0,1])
					+ " vib. amplitude"; 
			strFreq += "<BR>\n";
			strFreq += createSelect("vecscale", "onClickFreqParams()", 0, 1, vecscaleValue, vecscaleText, [0,0,1]) + " vector scale"; 																									// scale
			strFreq += "<BR>\n";
			strFreq += createSelect("widthvec", "onClickFreqParams()", 0, 1, vecwidthValue, vecscaleText,[0,0,0,1]) + " vector width";
			strFreq += "<BR>\n";
			strFreq += "<table border=0 class='contents'> <tr>";
				strFreq += "<td>vector color</td> <td><script>jmolColorPickerBox([setColorWhat,'vectors'],[255,255,255],'vectorColorPicker')</script></td>";
				strFreq += "</tr><tr><td>" + createButton("vibVectcolor", "Default color", 'onClickFreqParams()', 0) + "</td>";
			strFreq += "</tr></table>";					
		strFreq += "</td></tr>";
		strFreq += "<tr><td colspan=2>";
		strFreq += createDiv("graphfreqdiv", // making small graph
				"width:320px;height:200px;background-color:#EFEFEF;margin-left:5px;display:inline", 
				
				
				smallGraphAndButtons 
				
				
				+ simPanel);
		strFreq += "</td></tr>";
	strFreq += "</table></form> ";

	return strFreq;
}

function getFreqForClick(p) {
//This retrieves only the frequencies within range. 
	var freq = p[0];
	var int = p[1];
	var listIndex = -1;
	
	for (var i = 0; i < _file.specData.ranges.length; i++) {
		var range = _file.specData.ranges[i];
		if (freq >= range[0] && freq <= range[1]) {
			return range;
		}
	}
	return null;
}




