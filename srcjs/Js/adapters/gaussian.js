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

function loadGaussian() {
	setMessageMode(MESSAGE_MODE_GAUSSIAN_DONE)
	setV("set echo top left; echo loading...;refresh;load ?;message GAUSSIANDONE; ");
}

gaussianDoneMessageCallback = function(msg) {
	if (msg.indexOf("GAUSSIAN") == 0) {
		loadDone(loadGaussianModels);
	}
}

var geomGauss = new Array;
var freqSymmGauss = new Array;
var freqIntensGauss = new Array;
var freqGauss = new Array;
var energyGauss = new Array;
var counterGauss = 0;

function loadGaussianModels() {
	warningMsg("This is a molecular reader. Therefore not all properties will be available.")
	// Reset program and set filename if available
	// This also extract the auxiliary info
	intizializeJiceGauss();

	for (i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var line = Info[i].name;
			// alert(line)
			if (line.search(/E/i) != -1) {
				// alert("geometry")
				addOption(getbyID("geom"), i + " " + Info[i].name, i + 1);
				geomGauss[i] = Info[i].name;
				if (Info[i].modelProperties.Energy != null
						|| Info[i].modelProperties.Energy != "")
					energyGauss[i] = Info[i].modelProperties.Energy;
				//alert(energyGauss[i])
				counterGauss++;
			} else if (line.search(/cm/i) != -1) {
				// alert("vibration")
				addOption(getbyID("vib"), i + " " + Info[i].name + " ("
						+ Info[i].modelProperties.IRIntensity + ")", i);
				freqGauss[i - counterGauss] = Info[i].modelProperties.Frequency;
				freqSymmGauss[i - counterGauss] = Info[i].modelProperties.FrequencyLabel;
				freqIntensGauss[i - counterGauss] = Info[i].modelProperties.IRIntensity;
			}
		}
	}

	setMaxMinPlot();
	symmetryModeAddGauss();

}

function intizializeJiceGauss() {
	info = [];
	extractAuxiliaryJmol();
	var name = jmolGetPropertyAsJSON("filename");
	setTitleEcho();
	selectDesireModel("1");

	cleanArrayGauss();
	if (getbyID("sym") != null)
		cleanList("sym");
	if (getbyID("geom") != null)
		cleanList("geom");
	if (getbyID("vib") != null)
		cleanList("vib");
	disableFreqOpts();
}

function cleanArrayGauss() {
	geomGauss = [];
	freqSymmGauss = [];
	freqIntensGauss = [];
	counterGauss = 0;
}

function symmetryModeAddGauss() {
	sortedSymm = new Array;
	sortedSymm = [];
	sortedSymm = unique(freqSymmGauss);
	//alert(sortedSymm)
	for ( var i = 0; i < freqSymmGauss.length; i++) {
		if (sortedSymm[i] != null)
			addOption(getbyID("sym"), freqSymmGauss[i], freqSymmGauss[i])
	}
}

function changeIrepGauss(irep) {
	for ( var i = 0; i < freqGauss.length; i++) {
		var value = freqSymmGauss[i];
		if (irep == value)
			addOption(getbyID("vib"), i + " " + freqSymmGauss[i] + " "
					+ freqGauss[i] + " (" + freqIntensGauss[i] + ")", i
					+ counterGauss + 1);
	}
}

function reloadGaussFreq() {
	if (getbyID("vib") != null)
		cleanList("vib");
	for ( var i = 0; i < freqGauss.length; i++)
		addOption(getbyID("vib"), i + " " + freqSymmGauss[i] + " "
				+ freqGauss[i] + " (" + freqIntensGauss[i] + ")", i
				+ counterGauss + 1);

}
