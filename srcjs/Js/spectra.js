/*  J-ICE library 

    based on:
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
var intTot = new Array();
var irFreq = new Array();
var RamanFreq = new Array();
var intTotNewboth = new Array();
var newRamanInt = new Array();
var newInt = new Array();
var summedInt = new Array();
var sortInt = new Array();

function simSpectrum() {
	var win = "menubar=yes,resizable=1,scrollbars,alwaysRaised,width=800,height=600,left=50";

	var freqCount = Info.length
	if (!flagCryVasp && flagOutcar && !flagGauss) { // VASP outcar
		freqCount = freqData.length - 1;
		// alert(freqCount);
	} else if (!flagCryVasp && !flagOutcar && flagGauss) {
		freqCount = freqGauss.length - 1;
	}

	var irInt = new Array();
	var RamanInt = new Array();
	var freqTot = new Array();
	var convoluzione;
	var flagGaussian = true;
	var sigma = getValue("sigma");
	intTot = [];
	var rescale = null;

	for ( var i = 0; i < document.modelsVib.kindspectra.length; i++) {
		if (document.modelsVib.kindspectra[i].checked)
			radvalue = document.modelsVib.kindspectra[i].value;
	}

	for ( var i = 0; i < document.modelsVib.convol.length; i++) {
		if (document.modelsVib.convol[i].checked)
			convoluzione = document.modelsVib.convol[i].value;
	}

	if (isChecked("rescaleSpectra") == true) {
		rescale = true;

	} else {
		rescale = false;
	}

	switch (convoluzione) {

	case "stick":

		switch (radvalue) {
		case "ir": // IR + Raman

			irInt = [];
			RamanInt = [];

			irInt = extractFreqData(freqCount);
			var maxInt = maxValue(sortInt);
			// alert(maxInt)
			for ( var i = 0; i < 4000; i++) {
				if (intTot[i] == null)
					intTot[i] = 0.000;
				if (rescale) {
					if (intTot[i] != 0.00)
						intTot[i] = (intTot[i] / maxInt) * 100.00;
				}
			}
			// alert(intTot)

			break;

		case "raman":// Raman
			irInt = [];
			RamanInt = [];
			RamanInt = extractRamanData(freqCount);

			for ( var i = 0; i < 4000; i++) {
				for ( var k = 0; k < freqCount - 1; k++) {
					if (RamanFreq[k] == i)
						intTot[i] = 100;
				}
				if (intTot[i] == null)
					intTot[i] = 0;
			}
			break;
		case "both":

			irInt = [];
			RamanInt = [];
			irInt = extractFreqData(freqCount);
			if (flagCryVasp && !flagOutcar && !flagGauss && !flagDmol) {
				RamanInt = extractRamanData(freqCount);
				var maxInt = maxValue(sortInt);
				for ( var i = 0; i < 4000; i++) {

					if (newRamanInt[i] == null)
						newRamanInt[i] = 0;

					if (intTot[i] == null)
						intTot[i] = 0.000;
					if (rescale) {
						if (intTot[i] != 0.00)
							intTot[i] = (intTot[i] / maxInt) * 100.00;
					}

					intTot[i] = newRamanInt[i] + intTot[i];
				}

			} else if ((!flagCryVasp && flagOutcar && !flagGauss && !flagDmol)) {
				var maxInt = 100.00;
				for ( var i = 0; i < 4000; i++) {
					newInt[i] = 100.00;
					if (intTot[i] == null)
						intTot[i] = 0.000;

					if (rescale) {
						if (intTot[i] != 0.00)
							intTot[i] = (intTot[i] / maxInt) * 100.00;
					}

					intTot[i] = intTot[i];

				}

			} else if (!flagCryVasp && !flagOutcar && !flagGauss && flagDmol) {
				var maxInt = 100.00;
				for ( var i = 0; i < 4000; i++) {
					newInt[i] = 100.00;
					if (intTot[i] == null)
						intTot[i] = 0.000;

					if (rescale) {
						if (intTot[i] != 0.00)
							intTot[i] = (intTot[i] / maxInt) * 100.00;
					}

					intTot[i] = intTot[i];

				}

				// alert(intTot)
			} else if (!flagCryVasp && !flagOutcar && flagGauss && !flagDmol) {
				var maxInt = 100.00;
				for ( var i = 0; i < 4000; i++) {

					if (intTot[i] == null)
						intTot[i] = 0.000;

					if (rescale) {
						if (intTot[i] != 0.00)
							intTot[i] = (intTot[i] / maxInt) * 100.00;
					}

					intTot[i] = intTot[i];

				}
				// alert(intTot)
			}

			break;
		} // end switch stick
		break;

	case "gaus":
		flagGaussian = true;

		irInt = [];
		RamanInt = [];
		sortInt = [];
		irInt = extractFreqData(freqCount);
		if (flagCryVasp && !flagOutcar && !flagGauss && !flagDmol) {
			RamanInt = extractRamanData(freqCount);
			var maxInt = maxValue(sortInt);
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && flagOutcar && !flagGauss && !flagDmol) {
			var maxInt = 100.00;
			RamanInt = [];
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && !flagOutcar && flagGauss && !flagDmol) {
			RamanInt = [];
			var maxInt = maxR;
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && !flagOutcar && flagGauss && flagDmol) {
			RamanInt = [];
			var maxInt = maxR;
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		}
		break;

	case "lor":
		flagGaussian = false;

		irInt = [];
		RamanInt = [];
		sortInt = [];
		irInt = extractFreqData(freqCount);
		if (flagCryVasp && !flagOutcar && !flagGauss && !flagDmol) {
			var maxInt = maxValue(sortInt);
			RamanInt = extractRamanData(freqCount);
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && flagOutcar && !flagGauss && !flagDmol) {
			var maxInt = 100.00;
			RamanInt = [];
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && !flagOutcar && flagGauss && !flagDmol) {
			RamanInt = [];
			var maxInt = maxR;
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		} else if (!flagCryVasp && !flagOutcar && flagGauss && flagDmol) {
			RamanInt = [];
			var maxInt = maxR;
			defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
					flagGaussian);
		}

		break;
	}

	// this opens the window that contains the spectrum
	var newwin = open("spectrum.html");

}

function extractIrData(freqCount) {
	var irInt = new Array();
	for ( var i = 0; i < freqCount - 1; i++) { // populate IR array
		if (Info[i].name != null) {
			if (Info[i].modelProperties.IRactivity == "A") {
				irFreq[i] = roundoff(
						substringFreqToFloat(Info[i].modelProperties.Frequency),
						0);
				irInt[i] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				sortInt[i] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				intTot[irFreq[i]] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				intTotNewboth[irFreq[i]] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				// if(irInt[i]== 0.0){
				// irInt[i] = 100.00;
				// intTot[irFreq[i]]= 100.00;
				// intTotNewboth[irFreq[i]] = 100.00;
				// }
			}
		}
	}
	return irInt;
}

function extractFreqData(freqCount) {
	var irInt = new Array();
	if (flagCryVasp && !flagOutcar && !flagGauss) {
		for ( var i = 0; i < freqCount - 1; i++) { // populate IR array
			if (Info[i].name != null) {
				irFreq[i] = roundoff(
						substringFreqToFloat(Info[i].modelProperties.Frequency),
						0);
				irInt[i] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				sortInt[i] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				intTot[irFreq[i]] = roundoff(
						substringIntFreqToFloat(Info[i].modelProperties.IRintensity),
						0);
				// if(irInt[i]== 0.00){
				// irInt[i] = 100.00;
				// intTot[irFreq[i]]= 100.00;
				// }
			}
		}
	} else if (!flagCryVasp && flagOutcar && !flagGauss) {
		for ( var i = 0; i < freqCount; i++) {

			irFreq[i] = roundoff(substringFreqToFloat(freqData[i]), 0);
			intTot[irFreq[i]] = 100.00;
			irInt[i] = 100.00;
			if (i == 0)
				irInt[i] = 0.00;

		}

	} else if (!flagCryVasp && !flagOutcar && flagGauss) {
		for ( var i = 0; i < freqCount; i++) {
			irFreq[i] = roundoff(substringFreqToFloat(freqGauss[i]), 0);
			intTot[irFreq[i]] = freqIntensGauss[i].substring(1,
					freqIntensGauss[i].indexOf("K") - 1);
			irInt[i] = freqIntensGauss[i].substring(1, freqIntensGauss[i]
			.indexOf("K") - 1);
		}
	}
	return irInt;
}

function extractRamanData(freqCount) {
	var RamanInt = new Array();
	for ( var i = 0; i < (freqCount - 1); i++) {
		if (Info[i].name != null) {
			RamanInt[i] = 0.000;
			if (Info[i].modelProperties.Ramanactivity == "A") {
				RamanFreq[i] = roundoff(
						substringFreqToFloat(Info[i].modelProperties.Frequency),
						0);
				RamanInt[i] = 100.00;
				newRamanInt[RamanFreq[i]] = 100;
			}
		}
	}
	return RamanInt;
}

function defineSpectrum(radvalue, freqCount, irInt, RamanInt, maxInt, sigma,
		flagGaussian) {

	var sp = 0.000;
	// Gaussian Convolution
	var cx = 4 * Math.LN2;
	var ssa = sigma * sigma / cx;
	var sb = Math.sqrt(cx) / (sigma * Math.sqrt(Math.PI));

	// Lorentzian Convolution
	var xgamma = sigma;
	var ssc = xgamma * 0.5 / Math.PI; // old ss1
	var ssd = (xgamma * 0.5) ^ 2; // old ss2
	var radvalue;
	var summInt = new Array();
	sortInt = [];
	var rescale = null;

	// alert(maxInt)
	if (isChecked("rescaleSpectra") == true) {
		rescale = true;

	} else {
		rescale = false;
	}

	if (flagGaussian == true) {

		for ( var i = 0; i < 4000; i++) {
			sp = 0.000;
			if (intTot[i] == null)
				intTot[i] = 0;
			for ( var k = 0; k < freqCount - 1; k++) {
				switch (radvalue) {
				case "ir":
					if (irInt[k] == null)
						irInt[k] == 0.00;
					summInt[k] = irInt[k];
					break;
				case "raman":
					if (RamanInt[k] == null)
						RamanInt[k] == 0.00;
					summInt[k] = RamanInt[k];
					break;
				case "both":
					if (irInt[k] == null)
						irInt[k] == 0.00;
					if (flagCryVasp && !flagOutcar && !flagGauss) { // CRYSTAL
						if (RamanInt[k] == null)
							RamanInt[k] == 0.00;
						summInt[k] = irInt[k] + RamanInt[k];
					} else if ((!flagCryVasp && flagOutcar && !flagGauss)
							|| (!flagCryVasp && !flagOutcar && flagGauss)) { // VASP
						summInt[k] = irInt[k]
						// OUTCAR
						// or
						// GAUSSIAN
						// summInt[k]
						// =
						// irInt[k];
					}

					break;
				} // end switch
				if (irFreq[k] != null) {
					var xnn = i - irFreq[k];
					var f1 = Math.exp(-xnn * xnn / ssa) * summInt[k] * sb;
					if (rescale == true)
						var f1 = Math.exp(-xnn * xnn / ssa) * summInt[k]
					/ maxInt * 100 * sb;
					sp = sp + f1;

				}

			}
			intTot[i] = sp;
		}
	} else {

		for ( var i = 0; i < 4000; i++) {
			sp = 0.000;
			if (intTot[i] == null)
				intTot[i] = 0;
			for ( var k = 0; k < freqCount - 1; k++) {
				switch (radvalue) {
				case "ir":
					if (irInt[k] == null)
						irInt[k] == 0.00;
					summInt[k] = irInt[k];
					break;
				case "raman":
					if (RamanInt[k] == null)
						RamanInt[k] == 0.00;
					summInt[k] = RamanInt[k];
					break;
				case "both":
					if (irInt[k] == null)
						irInt[k] == 0.00;
					if (flagCryVasp && !flagOutcar) {
						if (RamanInt[k] == null)
							RamanInt[k] == 0.00;
						summInt[k] = irInt[k] + RamanInt[k];
					} else if ((!flagCryVasp && flagOutcar && !flagGauss)
							|| (!flagCryVasp && !flagOutcar && flagGauss)) { // VASP
						// OUTCAR
						// or
						// GAUSSIAN
						summInt[k] = irInt[k]
					}
					break;
				} // end switch
				if (irFreq[k] != null) {
					var xnn = i - irFreq[k];
					var f1 = ssc * summInt[k] / (xnn * xnn + ssd);
					if (rescale == true)
						var f1 = ssc * summInt[k] / maxInt * 100
						/ (xnn * xnn + ssd);
					sp = sp + f1;
				}

				intTot[i] = sp;
			}
		}
	}
}

function rangeSpectrum() {
	var s = "Min Freq. " + createTextSpectrum("minValue", "", "5", "")
	+ " Max " + createTextSpectrum("maxValue", "", "5", "")
	+ " cm<sup>-1</sup> ";
	s += createButton("rescaleSpectraButton", "Rescale", "replotSpectra()", "");
	s += createButton("savespectra", "Save spectrum", "writeSpectum()", "");
	document.write(s);
}

/*
 * function scaleSpectrum(){
 * 
 * var vecorFreq = new Array(); var vecorChk = new Array(); var counter; for(var
 * i =0 ; i < Info.length; i++){ vecorFreq[i] = Info[i].name; vecorChk[i] = 0
 * if(i == 0) vecorChk[i] = 1 counter++ }
 * 
 * var s = " Shift spectrum "; s+= createList("Frequencies", "", 0, 1, counter ,
 * vecorFreq, vecorFreq, vecorChk) + "" s+=
 * createText2("rescaleSpectra","0.00","5","") + " cm<sup>-1</sup>"; s+=
 * createButton("rescaleSpectraButton","Shift","","") document.write(s); }
 */

function sortNumber(a, b) {
	return a - b;
}

function maxValue(irInt) {
	// BH 2018
	irInt.sort(sortNumber);
	var n = 0;
	while (irInt.length > 0 && isNaN(n = parseInt(irInt.pop()))){}
	return (isNaN(n) ? 0 : n);
}

function minValue(irInt) {
	return parseInt(irInt.sort(sortNumber)[0]);
}
