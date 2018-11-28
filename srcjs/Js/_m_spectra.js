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

	if (!_fileData.haveSpecData) {
		_specData = null;
		_fileData.haveSpecData = true;
		
		symmetryModeAdd();	
		_plot.specyscale = 1;
		onClickModSpec(true, true);	
		if (!_specData)
			return;		
		setValue("nMax", _specData.maxX);
		setValue("nMin", _specData.minX);
	}
	$("#nMin").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		onClickModSpec();
		}
	});
	$("#nMax").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		onClickModSpec();
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
	runJmolScriptWait('vibration off; vectors off');
}

function doSpectraNewWindow() {
	// this opens the window that contains the spectrum
	//var win = "menubar=yes,resizable=1,scrollbars,alwaysRaised,width=800,height=600,left=50";
	var newwin = open("spectrum.html");
}



/////////LOAD FUNCTIONS

function disableFreqOpts() {
	for (var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = true;
	for (var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = true;
}

function enableFreqOpts() {
	for (var i = 0; i < document.modelsVib.modAct.length; i++)
		document.modelsVib.modAct[i].disabled = false;
	for (var i = 0; i < document.modelsVib.kindspectra.length; i++)
		document.modelsVib.kindspectra[i].disabled = false;

}

function onClickSelectVib(isTriggered) {
	var vib = getbyID('vib');
	if (isTriggered) {
		if (vib.selectedIndex < 0)
			return;
		_plot.specSelectedFreq = _specData.freqs[_specData.vibList[vib.selectedIndex][3]];
		showFreqGraph("plotareafreq", _specData, _plot);
		return;
	}	
	var model = parseInt(vib.value);
	showFrame(model);	
	updateJmolForFreqParams(true);
	// trigger to make sure selectedIndex has been set.
	setTimeout(function() {onClickSelectVib(true)}, 50);
}

function setYMax() {
	var specData = setUpSpecData("all", "any"); 
	getFrequencyList(specData);
	createSpectrum(specData);
	 _fileData.spectraYMax = Math.max(arrayMax(specData.specIR), arrayMax(specData.specRaman));
}
function onClickModSpec(isPageOpen, doSetYMax) {
	if (_fileData.freqData.length == 0) {
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
	_specData = setUpSpecData(typeIRorRaman,irrep);
	getFrequencyList(_specData);
	createSpectrum(_specData);
	setVibList(_specData);
	if (isPageOpen){
		setMaxMinPlot(_specData);
	}
	return showFreqGraph("plotareafreq", _specData, _plot);	
}

function setUpSpecData(typeIRorRaman,irrep) {
	return {
			typeIRorRaman : typeIRorRaman, 
			typeConvolve  : getRadioSetValue(document.modelsVib.convol), 
			irrep     : irrep,
			sigma     : parseFloat(getValue('sigma')), 
			rescale   : true,
			invertx   : isChecked('invertX'),
			freqCount : _fileData.freqInfo.length,
			minX      : Math.min(parseInt(getValue("nMin")), parseInt(getValue("nMax"))),
			maxX      : Math.max(parseInt(getValue("nMin")), parseInt(getValue("nMax"))),
			maxY      : _fileData.spectraYMax,
			previousPointFreq : -1,
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
		
	_plot.specminX0 = specData.minX = 0;
	_plot.specmaxX0 = specData.maxX = specData.maxR + 300;

}

function getFrequencyList(specData) {
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
			  && (prop == null || _fileData.freqInfo[i].modelProperties[prop] == "A")) {
			specData.freqInfo.push(_fileData.freqInfo[i]);
			specData.vibList.push([(label || (i+1) + " " + _fileData.freqInfo[i].name), _fileData.freqInfo[i].modelNumber, -1]);
		}
	}
}

function setVibList(specData) {
	var vib = getbyID('vib');	
	cleanList('vib');
	var xmin = specData.minX;
	var xmax = specData.maxX;	
	for (var i = 0, pt = 0, n = specData.vibList.length; i < n; i++) {
		if (specData.freqs[i] >= xmin && specData.freqs[i] <= xmax) {
			addOption(vib, specData.vibList[i][0], specData.vibList[i][1]);
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
	
	if (_fileData.freqSymm) {
		// gaussian and others
		for (var i = 0, val; i < _fileData.freqSymm.length; i++) {
			if (irep == _fileData.freqSymm[i])
				vibLinesFromIrrep[i] = 
					(i+1) + " " + irep + " "+ _fileData.freqData[i] 
					+ (_fileData.freqIntens[i] ? " (" + _fileData.freqIntens[i] + ")" : "");
		}
	} else {
		for (var i = 0, val; i < _fileData.freqInfo.length; i++) {
			if (irep == _fileData.freqInfo[i].modelProperties.vibrationalSymmetry)
				vibLinesFromIrrep[i] = (i+1) + " " + _fileData.freqInfo[i].name;
		}
	}
	return vibLinesFromIrrep;
}

function extractIRData(specData) {
 return file_method("extractIRData", function() {}, [specData]);
}

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
		specData.freqs[i] = specData.irFreq[i] = Math.round(substringFreqToFloat(_fileData.freqData[i]));
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
	var isHTMLPage = (!specData);
	if (isHTMLPage) {
		specData = _specData = opener._specData;
		plot = _plot = opener._plot;
	}
	var specMinX = specData.minX;
	var specMaxX = specData.maxX;
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
    	  min : specMinX, 
    	  max : specMaxX, 
    	  ticks : (specMaxX - specMinX < 2000 ? 5 : 10), 
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
			ir[pt] = [i, A[i]*plot.specyscale, model[i]];
		if (B.length)
			raman[pt] = [i, B[i]*plot.specyscale, model[i]];		
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
		var y0 = (!isHTMLPage && plot.specSelectedFreq == specfreq ? minY : maxY * 0.95)
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
	_specData.previousPointFreq = -1;
	return haveSelected;
}

function plotSelectCallbackFreq(event, ranges) {
	var x1 = ranges.xaxis.from | 0;
	var x2 = ranges.xaxis.to | 0;
	if (Math.abs(x2-x1) > 100) {
		setValue("nMin", Math.min(x1, x2));
		setValue("nMax", Math.max(x1, x2));
		setTimeout(onClickModSpec,50);
	}
}

function getRanges(specData) {
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
	if (!itemFreq) return
	// itemFreq is [x,y] so [freq,int]
	var range = getFreqForClick(itemFreq.datapoint);
	// range is [min,max,freq,i]
	if (!range)
		return;
	var freq = range[2];
	var listIndex = _specData.vibList[range[3]][2];	
	if (listIndex < 0)
		return;		
	var vib = getbyID('vib');
	vib.options[listIndex].selected = true;
	setTimeout(function(){onClickSelectVib();},50);
}

function plotHoverCallbackFreq(event, pos, itemFreq) {
	hideTooltip();
	if(!itemFreq)return
	if (_specData.previousPointFreq != itemFreq.datapoint) {
		previousPointFreq = itemFreq.datapoint;
		var range = getFreqForClick(itemFreq.datapoint);
		if (!range)
			return;
		var freq = range[2];
		var listIndex = _specData.vibList[range[3]][2];	
		if (listIndex < 0)
			return;		
		var model = _specData.model[freq];
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
 * Info.length; i++){ vecorFreq[i] = Info[i].name; vecorChk[i] = 0 if(i == 0)
 * vecorChk[i] = 1 counter++ }
 * 
 * var s = " Shift spectrum "; s+= createSelect("Frequencies", "", 0, 1, counter ,
 * vecorFreq, vecorFreq, vecorChk) + "" s+=
 * createText2("rescaleSpectra","0.00","5","") + " cm<sup>-1</sup>"; s+=
 * createButton("rescaleSpectraButton","Shift","","") document.write(s); }
 */

function sortNumber(a, b) {
	return a - b;
}

function maxValue(a) {
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

function symmetryModeAdd() { // extracts vibrational symmetry modes from Info
								// array and lets one get symmetry operations by
								// ID
	cleanList('sym');
	var sym = getbyID('sym');
	if (Info[3] && Info[3].modelProperties) {
		var symm = _fileData.freqSymm;
		if (!symm) {
			var symm = [];
			for (var i = 1; i < Info.length; i++)
				if (Info[i].name)
					symm[i] = Info[i].modelProperties.vibrationalSymmetry;
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
	// this function removes duplicates
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

function onScale(mode) {
	switch (mode) {
	case 1:
		_plot.specyscale *= 1.414;
		break;
	case 0:
		_plot.specyscale = 1;
		setValue("nMin", _plot.specminX0);
		setValue("nMax", _plot.specmaxX0);
		break;
	case -1:
		_plot.specyscale /= 1.414;
		break;
	}
	onClickModSpec();
	return true;
}

// Creates the frequency menu on the web applet
function createFreqGrp() { 
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
	var graphButtons = createButtonB("scaleup", "&#x25b2;","onScale(1)' title='increase Y scale",0,"width:35px") + "<br>"
		+ createButtonB("scaleup", "&#x25cf;","onScale(0)' title='reset X and Y",0,"width:35px") + "<br>"
		+ createButtonB("scaleup", "&#x25bc;","onScale(-1)' title='decrease Y scale",0,"width:35px");
	var smallGraphAndButtons = "<table cellpadding=0 cellspacing=0><tr><td valign=top>" 
			+ smallGraph + "</td><td valign=center>" 
			+ graphButtons + "</td></tr></table>";

	var simPanel = createDiv("simPanel", "", "Raman intensities set to 0.0 kmMol<sup>-1</sup>"
		+ "<br>\n"
		+ createLine('blue', '')
		+ "<br>"
		+ "Band width " + createText2("sigma", "30", "3", "") + " (cm<sup>-1</sup>)" 
		+ "&nbsp;"
		+ "Min freq. " + createText2("nMin", "onClickModSpec()", "4", "")
		+ " Max " + createText2("nMax", "onClickModSpec()", "4", "") + "(cm<sup>-1</sup>)"
		+ createCheck("invertX", "Invert x", "onClickModSpec()", 0, 1, "") + "<br>"
		+ createRadio("convol", "Stick", 'onClickModSpec(false, true)', 0, 1, "", "stick")
		+ createRadio("convol", "Gaussian", 'onClickModSpec(false, true)', 0, 0, "", "gaus")
		+ createRadio("convol", "Lorentzian", 'onClickModSpec(false, true)', 0, 0, "", "lor") 
		+ "&nbsp;" + "&nbsp;" + "&nbsp;"
		+ createButton("simSpectra", "New Window", "doSpectraNewWindow()", 0));

	var strFreq = "<form autocomplete='nope'  id='freqGroup' name='modelsVib' style='display:none'>";
		strFreq += "<table border=0 class='contents'><tr><td valign='bottom'>";
			strFreq += "<h2>IR-Raman Frequencies</h2>\n";
			strFreq += createRadio("modSpec", "Both", "onClickModSpec()", 0, 1, "", "all");
			strFreq += createRadio("modSpec", "IR", "onClickModSpec()", 0, 0, "", "ir");
			strFreq += createRadio("modSpec", "Raman", "onClickModSpec()", 0, 0, "", "raman");
			strFreq += "<BR>\n";
			strFreq += "Symmetry <select id='sym' name='vibSym' onchange='onClickModSpec()' onkeyup='onClickModSpec()' CLASS='select' >";
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
	var freq = p[0];
	var int = p[1];
	var listIndex = -1;
	
	for (var i = 0; i < _specData.ranges.length; i++) {
		var range = _specData.ranges[i];
		if (freq >= range[0] && freq <= range[1]) {
			return range;
		}
	}
	return null;
}




