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

// from vaspoutcar
//	if (fileData.vibLine) {
//		var vib = getbyID('vib');
//		for (var i = 1; i < _fileData.fileData.vibLine.length; i++) {
//			 addOption(vib, _fileData.vibLine[i], i + 1);
//		}
//	}
	
	if (!_fileData.haveSpecData) {
		_specData = null;
		_fileData.haveSpecData = true;
		symmetryModeAdd();	
		onClickModSpec(true);
	}
}

function exitSpectra() {
	runJmolScriptWait('vibration off; vectors off');
}

function doSpectraNewWindow() {
	// this opens the window that contains the spectrum
	//var win = "menubar=yes,resizable=1,scrollbars,alwaysRaised,width=800,height=600,left=50";
	var newwin = open("spectrum.html");
}

//This resets the frequency state
function resetFreq() {
	checkBox("radVibrationOff");
	uncheckBox("vectors");
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

function onClickSelectVib(value) {
	showFrame(value);	
	updateJmolForFreqParams();
}


function onClickModSpec(isPageOpen) {
	if (_fileData.freqData.length == 0) {
		return;
	}
	simSpectrum(isPageOpen);
}

function simSpectrum(isPageOpen) {
	cleanList('vib');
	resetFreq();
	var typeIRorRaman = getRadioSetValue(document.modelsVib.modSpec);
	var typeConvolve = getRadioSetValue(document.modelsVib.convol);
	var irrep = getValueSel('sym');		
	var specData = _specData = {
			typeIRorRaman : typeIRorRaman, 
			typeConvolve  : typeConvolve, 
			irrep     : irrep,
			sigma     : getValue('sigma'), 
			rescale   : isChecked('rescaleSpectra'),
			freqCount : _fileData.freqInfo.length,
			minX      : 0,
			maxX      : 4000,
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
	setFrequencyList(specData);
	switch (typeIRorRaman) {
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
	if (isPageOpen)
		setMaxMinPlot(specData);
	
	specData.minX = getValue("nMin");
	specData.maxX = getValue("nMax");

	var create = (typeConvolve == "stick" ? createStickSpectrum : createCoolSpectrum);

	switch (typeIRorRaman) {
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

	showFreqGraph(specData);
}

function setFrequencyList(specData) {
	var vib = getbyID('vib');			
	var vibLinesFromIrrep = getVibLinesFromIrrep(specData);
	var prop = (specData.typeIRorRaman == "ir" ? "IRactivity" 
			: specData.typeIRorRaman == "raman" ? "Ramanactivity" 
			: null);

	for (var i = 0; i < specData.freqCount; i++) {
		var label = null;
		if ((vibLinesFromIrrep == null || (label = vibLinesFromIrrep[i]))
			  && (prop == null || _fileData.freqInfo[i].modelProperties[prop] == "A")) {
			specData.freqInfo.push(_fileData.freqInfo[i]);
			addOption(vib, (label || i + " " + _fileData.freqInfo[i].name), _fileData.freqInfo[i].modelNumber);
		}
	}
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
					i + " " + irep + " "+ _fileData.freqData[i] 
					+ (_fileData.freqIntens[i] ? " (" + _fileData.freqIntens[i] + ")" : "");
		}
	} else {
		for (var i = 1, val; i < _fileData.freqInfo.length; i++) {
			if (irep == _fileData.freqInfo[i].modelProperties.vibrationalSymmetry)
				vibLinesFromIrrep[i] = i + " " + _fileData.freqInfo[i].name;
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
		specData.irFreq[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
		specData.irInt[i] = Math.round(substringIntFreqToFloat(specData.freqInfo[i].modelProperties.IRintensity));
		specData.sortInt[i] = specData.irInt[i];
		specData.specIR[specData.irFreq[i]] = specData.irInt[i];
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
		specData.freqs[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
	}
	System.out.println("crystal extractIRData");
}

function extractIRData_vaspoutcar(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		specData.irFreq[i] = Math.round(substringFreqToFloat(_fileData.freqData[i]));
		specData.specIR[specData.irFreq[i]] = 100;
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
		specData.freqs[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
		specData.irInt[i] = 100;
		if (i == 0)
			specData.irInt[i] = 0;
	}
}

function extractIRData_gaussian(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		specData.irFreq[i] = Math.round(substringFreqToFloat(specData.freqData[i]));
		specData.specIR[specData.irFreq[i]] = specData.irInt[i] = rtrim(specData.freqIntens[i], 1, "K", 1);
		specData.model[specData.irFreq[i]] = specData.freqInfo[i].modelNumber;
		specData.freqs[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
	}
}

function rtrim(s, i0, char, i1) {
	return s.substring(i0,s.indexOf("K") - i1);
}

function extractRamanData(specData) {
	var n = specData.freqInfo.length;
	for (var i = 0; i < n; i++) {
		if (specData.freqInfo[i].modelProperties.Ramanactivity == "A") {
			specData.ramanFreq[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
			specData.ramanInt[i] = 100;
			specData.specRaman[specData.ramanFreq[i]] = 100;
			specData.model[specData.ramanFreq[i]] = specData.freqInfo[i].modelNumber;
			specData.freqs[i] = Math.round(substringFreqToFloat(specData.freqInfo[i].modelProperties.Frequency));
		} else {
			specData.ramanInt[i] = 0;
		}
	}
	return specData;
}

function getModelForSpec(specData){
	var freqs = specData.freqs
	var sigma = specData.sigma;
	n = specData.freqs.length;
	for (var i = 1; i < n-1; i++) { 
			var x1 = (freqs[i] + freqs[i - 1])/2;
			var x2 = (freqs[i] + freqs[i + 1])/2;
			specData.ranges.push([Math.max(x1, freqs[i] - sigma/2), Math.min(x2, freqs[i] + sigma/2)]);
		}
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
	var fscale = (specData.rescale && !allZero ? 100 * 0.3 / maxInt : 1);

	if (!isGaussian)
		fscale *= 100;
	
	// Gaussian Convolution
	var cx = 4 * Math.LN2;
	var ssa = sigma * sigma / cx;	

	// Lorentzian Convolution
	var xgamma = specData.sigma;
	var ssc = xgamma * 0.5 / Math.PI;
	var ssd = (xgamma * 0.5) * (xgamma * 0.5);
	
	var sb = Math.sqrt(cx) / (sigma * Math.sqrt(Math.PI)) * fscale;

	var freq = (type == "ir" ? irFreq : ramanFreq);
	var int = (type == "ir" ? irInt : ramanInt);
	
	for (var i = 0; i < 4000; i++) {
		var sp = 0;
		for (var k = 0, n = freqCount; k < n; k++) {
			// discard translation
			if (!freq[k]) 
				continue;
			int[k] || (int[k] = 0);
			v = (allZero ? maxInt / 4 : int[k]);
			var xnn = i - freq[k];
			sp += (isGaussian ? Math.exp(-xnn * xnn / ssa) : ssc / (xnn * xnn + ssd)) * v * sb;
		}
		spec[i] = sp;
	}
}

function showFreqGraph(specData, specMinX, specMaxX) {
	if (specData) {
		specMinX = specData.minX;
		specMaxX = specData.maxX;
	} else {
		specData = opener._specData;
	}
	
	var A = specData.specIR, B = specData.specRaman;	
	var model = specData.model;
	var nplots = (B && B.length && A && A.length ? 2 : 1);
	var minY = 999999;
	var maxY = 0;
	for (var i = 0; i < A.length; i++) {
		if (A[i] > maxY)
			maxY = A[i];
		if (A[i] < minY)
			minY = A[i];
	}
	for (var i = 0; i < B.length; i++) {
		if (B[i] > maxY)
			maxY = B[i];	
		if (B[i] < minY)
			minY = B[i];
	}
	if (minY == maxY)
		maxY = (maxY == 0 ? 200 : maxY * 2);
	maxY *= 1.2;
	
	var options = {
      series:{
    	  	lines: { show: true, fill: false }
      },
      xaxis: { 
    	  min : specMinX, 
    	  max : specMaxX, 
    	  ticks : 10, 
    	  tickDecimals: 0 
      },
      yaxis: { ticks: 0, tickDecimals: 0, min: -0.1, max: maxY },
      selection: { 
    	  	mode: (nplots == 1 ? "x" : "xy"), 
    	  	hoverMode: (nplots == 1 ? "x" : "xy") 
      },
      grid: { 
			hoverable: true, 
			clickable: true, 
			hoverDelay: 10, 
		    autoHighlight: false,
			hoverDelayDefault: 10
      }
	};
	
	var ir = [];
	var raman = [];
	for (var i = specData.minX, pt = 0; i < specData.maxX; i++, pt++) {
		if (A.length)
			ir[pt] = [i, A[i], model[i]];
		if (B.length)
			raman[pt] = [i, B[i], model[i]];		
	}
	if (A.length && B.length) {
		theplot = $.plot($("#plotareafreq"), [{label:"IR", data:ir}, {label:"Raman", data: raman}], options)
	} else if (A.length) {
		theplot = $.plot($("#plotareafreq"), [{data: ir}], options)
	} else if (B.length) {
		theplot = $.plot($("#plotareafreq"), [{data: raman}], options)
	}
	
	previousPointFreq = null;
	
	$("#plotareafreq").unbind("plothover plotclick", null)
	$("#plotareafreq").bind("plothover", plotHoverCallbackFreq);
	$("#plotareafreq").bind("plotclick", plotClickCallbackFreq);
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
	if (Info[3].modelProperties) {
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


function setVibrationOn(isON) {
	if (isON)
		checkBox("radVibrationOn");
	else
		checkBox("radVibrationOff");
	updateJmolForFreqParams();
}

function onClickFreqParams() {
	updateJmolForFreqParams();
}

function updateJmolForFreqParams() {
	var c = jmolColorPickerBoxes["vectorColorPicker"].getJmolColor();
	var vectorsON = isChecked("vectors");
	var script = "vibration " + isChecked("radVibrationOn")
					+ ";vectors " + vectorsON
					+ ";" + getValueSel("vecsamplitude")
					+ ";" + getValueSel("vecscale")
					+ ";color vectors " + (isChecked("vibVectcolor") ? "none" :  c);
	if (vectorsON)
		script += ";" + getValueSel("sizevec");
	runJmolScriptWait(script)
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
	
	
	specData.maxX = specData.maxR + 300;
	specData.minX = 0;
	
	setValue("nMax", specData.maxX);
	setValue("nMin", specData.minX);
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

	var smallGraph =  createDiv("plotareafreq", "background:blue;width:350px;height:180px;background-color:#EFEFEF","");  
	
	var simPanel = createDiv("simPanel", "", "Raman intensities set to 0.0 kmMol<sup>-1</sup>"
		+ "<br>\n"
		+ createLine('blue', '')
		+ "<br>"
		+ "Band width " + createText2("sigma", "15", "3", "") + " (cm<sup>-1</sup>)" 
		+ "&nbsp;"
		+ "Min freq. " + createText2("nMin", "onClickModSpec()", "4", "")
		+ " Max " + createText2("nMax", "onClickModSpec()", "4", "") + "(cm<sup>-1</sup>)"
		+ createCheck("rescaleSpectra", "Re-scale", "", 0, 1, "") + "<br>"
		+ createRadio("convol", "Stick", 'onClickModSpec()', 0, 1, "", "stick")
		+ createRadio("convol", "Gaussian", 'onClickModSpec()', 0, 0, "", "gaus")
		+ createRadio("convol", "Lorentzian", 'onClickModSpec()', 0, 0, "", "lor") 
		+ "&nbsp;" + "&nbsp;" + "&nbsp;"
		+ createButton("simSpectra", "New Window", "doSpectraNewWindow()", 0));

	var strFreq = "<form autocomplete='nope'  id='freqGroup' name='modelsVib' style='display:none'>";
		strFreq += "<table border=0 class='contents'><tr><td valign='bottom'>";
			strFreq += "<h2>IR-Raman Frequencies</h2>\n";
			strFreq += createRadio("modSpec", "Both", "onClickModSpec()", 0, 1, "", "all");
			strFreq += createRadio("modSpec", "IR", "onClickModSpec()", 0, 0, "", "ir");
			strFreq += createRadio("modSpec", "Raman", "onClickModSpec()", 0, 0, "", "raman");
			strFreq += "<BR>\n";
			strFreq += "Symmetry <select id='sym' name='vibSym' onchange='onClickModSpec()' onkeypress='onClickModSpec()' CLASS='select' >";
			strFreq += "</select> ";
			strFreq += "<BR>\n";
			strFreq += "<select id='vib' name='models' OnClick='onClickSelectVib(value)' class='selectmodels' size=9 style='width:200px; overflow: auto;'></select>";	
		strFreq += "</td>"; // end of the first column
		strFreq += "<td valign='bottom'>";
		strFreq +="<BR>\n" + "<BR>\n";
			strFreq += "vibration ";
			strFreq += createRadio("vibration", "on", 'onClickFreqParams()', 0, 1, "radVibrationOn", "on");
			strFreq += createRadio("vibration", "off", 'onClickFreqParams()', 0, 0, "radVibrationOff", "off");
			strFreq += "<BR>\n";
			strFreq += createSelect("vecsamplitude", "onClickFreqParams()", 0, 1,
					vibAmplitudeValue, vibAmplitudeText,[0,1])
					+ " vib. amplitude"; 
			strFreq += "<BR>\n";
			strFreq += createCheck("vectors", "view vectors", "onClickFreqParams()", 0, 1, "vectors");
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
				"width:350px;height:200px;background-color:#EFEFEF;margin-left:5px;display:inline", smallGraph + simPanel);
		strFreq += "</td></tr>";
	strFreq += "</table></form> ";

	return strFreq;
}



