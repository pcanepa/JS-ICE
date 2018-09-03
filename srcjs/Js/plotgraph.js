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



var appletPrintable = (navigator.appName != "Netscape"); // Sorry, I don't
//know how to check
//for this

//This has changed
function $() {
	// document ready function
	if (!appletPrintable)$("#appletdiv").addClass("noprint"); 
}


var itemEnergy
var previousPoint = null
var itemForce
var previousPointForce = null
var itemFreq
var previousPointFreq = null


var theplot ; // global, mostly for testing.

function plotEnergies( a, b, c, d){

	// setImage()
	var data = [];
	var A = [];
	var nplots = 1;
	var modelCount = Info.length;
	var stringa = Info[3].name;
	var energy ="";
	var label = "";
	

	if(flagCryVasp  && !flagOutcar && !flagGauss && !flagQuantum && !flagGulp && !flagDmol  && !flagCast){
		// alert("crystal");
		if(stringa.search(/Energy/i) != -1){
			for (var i = 0; i < (modelCount - 1) ; i++) {
				var modelnumber = 0+ Info[i].modelNumber;
				// This is to check wheather we are dealing with an
				// optimization or a
				// frequency calculation
				var last = modelCount - 1;

				if(i > 0 && i < Info.length)
					var previous = i - 1 ;

				if((i == 0 && Info[i].name != null) ||
						(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
					energy = (substringEnergyToFloat(Info[i].name) - substringEnergyToFloat(Info[last].name)) ;
					if (energy < 0) energy = +- energy;
				}
				if((Info[i].name != null) && (previous > 0) ){
					if (substringEnergyToFloat(Info[i].name) != substringEnergyToFloat(Info[i - 1].name))
						energy = (substringEnergyToFloat(Info[i-1].name) - substringEnergyToFloat(Info[i].name));
					if (energy < 0) energy = +- energy;			
				}

				label = 'Model = ' + modelnumber
				+ ', &#916 E = ' + energy + ' kJmol^-1';
				A.push([i+1,energy,modelnumber,label]);
			}
		}
		
		
	}else if (flagDmol && !flagCryVasp  && !flagOutcar && !flagGauss && !flagQuantum && !flagGulp  && !flagCast){ //Dmol
		// alert("crystal");
		if(stringa.search(/E/i) != -1){
			for (var i = 0; i < (modelCount - 1) ; i++) {
				var modelnumber = 0 + Info[i].modelNumber;
				// This is to check wheather we are dealing with an
				// optimization or a
				// frequency calculation
				var last = modelCount - 1;

				if(i > 0 && i < Info.length)
					var previous = i - 1 ;

				if((i == 0 && Info[i].name != null) ||
						(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
					energy = (substringEnergyToFloat(Info[i].name) - substringEnergyToFloat(Info[last].name)) ;
					if (energy < 0) energy = +- energy;
				}
				if((Info[i].name != null) && (previous > 0) ){
					if (substringEnergyToFloat(Info[i].name) != substringEnergyToFloat(Info[i - 1].name))
						energy = (substringEnergyToFloat(Info[i-1].name) - substringEnergyToFloat(Info[i].name));
					if (energy < 0) energy = +- energy;			
				}

				label = 'Model = ' + modelnumber
				+ ', &#916 E = ' + energy + ' kJmol^-1';
				A.push([i+1,energy,modelnumber,label]);
			}
		}
	} else if (!flagCryVasp && !flagOutcar && !flagGauss && !flagQuantum && !flagGulp && !flagDmol  && !flagCast){ // VASP XML
		// alert("vasp r");
		for (var i = 0; i < (modelCount - 1) ; i++) {

			var modelnumber = 0 + Info[i].modelNumber;
			var last = modelCount - 1;
			if(i > 0 && i < Info.length)
				var previous = i - 1 ;
			if((i == 0 && Info[i].name != null) ||
					(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
				energy = (substringEnergyVaspToFloat(Info[i].name) - substringEnergyVaspToFloat(Info[last].name)) ;
				if (energy < 0) energy = +- energy;
			}
			if((Info[i].name != null) && (previous > 0) ){
				if (substringEnergyVaspToFloat(Info[i].name) != substringEnergyVaspToFloat(Info[i - 1].name))
					energy = (substringEnergyVaspToFloat(Info[i-1].name) - substringEnergyVaspToFloat(Info[i].name));
				if (energy < 0) energy = +- energy;			
			}

			label = 'Model = ' + modelnumber
			+ ', &#916 E = ' + energy + ' kJmol^-1';
			A.push([i+1,energy,modelnumber,label]);
		}
	}else if (!flagCryVasp && flagOutcar && !flagGauss && !flagQuantum && !flagGulp && !flagDmol  && !flagCast){ // VASP OUTCAR
		// loader
		for (var i = 0; i < (modelCount - 1) ; i++) {
			var line = Info[i].name;
			if(line != null){
				if(line.search(/G =/i) != -1){
					var modelnumber = 0 + Info[i].modelNumber;
					var last = modelCount - 1;
					if(Info[i].name.search(/cm/i) == -1){
						if(i > 0 && i < Info.length)
							var previous = i - 1 ;
						if((i == 0 && Info[i].name != null) ||
								(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
							energy = (substringEnergyVaspToFloat(Info[i].name) - substringEnergyVaspToFloat(Info[last].name)) ;
							if (energy < 0) energy = +- energy;
						}
						if((Info[i].name != null) && (previous > 0) ){
							if (substringEnergyVaspToFloat(Info[i].name) != substringEnergyVaspToFloat(Info[i - 1].name))
								energy = (substringEnergyVaspToFloat(Info[i-1].name) - substringEnergyVaspToFloat(Info[i].name));
							if (energy < 0) energy = +- energy;			
						}
					}

					label = 'Model = ' + modelnumber
					+ ', &#916 E = ' + energy + ' kJmol^-1';
					A.push([i+1,energy,modelnumber,label]);
				}
			}
		}
		
	}else if (!flagCryVasp && !flagOutcar && !flagGauss && flagQuantum && !flagGulp && !flagDmol  && !flagCast){ 
		//QuantumEspresso
		//alert("Quantum");
		for (var i = 0; i < (modelCount - 1) ; i++) {
			var line = Info[i].name;
			if(line != null){
				if(line.search(/E =/i) != -1){
					var modelnumber = 0 + Info[i].modelNumber;
					var last = modelCount - 1;
					if(Info[i].name.search(/cm/i) == -1){
						if(i > 0 && i < Info.length)
							var previous = i - 1 ;
						if((i == 0 && Info[i].name != null) ||
								(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
							energy = (substringEnergyQuantumToFloat(Info[i].name) - substringEnergyQuantumToFloat(Info[last].name)) ;
							if (energy < 0) energy = +- energy;
						}
						if((Info[i].name != null) && (previous > 0) ){
							if (substringEnergyQuantumToFloat(Info[i].name) != substringEnergyQuantumToFloat(Info[i - 1].name))
								energy = (substringEnergyQuantumToFloat(Info[i-1].name) - substringEnergyQuantumToFloat(Info[i].name));
							if (energy < 0) energy = +- energy;			
						}
					}
					

					label = 'Model = ' + modelnumber
					+ ', &#916 E = ' + energy + ' kJmol^-1';
					A.push([i+1,energy,modelnumber,label]);
				}
			}
		}
		
	}else if (!flagCryVasp && !flagOutcar && !flagGauss && !flagQuantum && flagGulp && !flagDmol  && !flagCast){ //Gulp
		//alert("Gulp");
		for (var i = 0; i < (modelCount - 1) ; i++) {
			var line = Info[i].name;
			if(line != null){
				if(line.search(/E =/i) != -1){
					var modelnumber = 0 + Info[i].modelNumber;
					var last = modelCount - 1;
					if(Info[i].name.search(/cm/i) == -1){
						if(i > 0 && i < Info.length)
							var previous = i - 1 ;
						if((i == 0 && Info[i].name != null) ||
								(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
							energy = (substringEnergyGulpToFloat(Info[i].name) - substringEnergyGulpToFloat(Info[last].name)) ;
							if (energy < 0) energy = +- energy;
						}
						if((Info[i].name != null) && (previous > 0) ){
							if (substringEnergyGulpToFloat(Info[i].name) != substringEnergyGulpToFloat(Info[i - 1].name))
								energy = (substringEnergyGulpToFloat(Info[i-1].name) - substringEnergyGulpToFloat(Info[i].name));
							if (energy < 0) energy = +- energy;			
						}
					}
					

					label = 'Model = ' + modelnumber
					+ ', &#916 E = ' + energy + ' kJmol^-1';
					A.push([i+1,energy,modelnumber,label]);
				}
			}
		}
	}else if (!flagCryVasp && !flagOutcar && flagGauss && !flagQuantum && !flagGulp && !flagDmol && !flagCast){ //GAussian

		for (var i = 1; i < energyGauss.length; i++) {

			var line = energyGauss[i];
			if(line != null){
				// alert(fromHartreetokJ(energyGauss[i]) + " " + i)

				var modelnumber = energyGauss.length -1;
				var last = energyGauss.length;

				if(i > 0 && i < Info.length)
					var previous = i - 1 ;
				if((i == 0 && energyGauss[i] != null) ||
						(i > 0 && energyGauss[i - 1] == null &&  energyGauss[i] != null)){
					energy = (fromHartreetokJ(energyGauss[i]) - fromHartreetokJ(energyGauss[last])) ;
					if (energy < 0) energy = +- energy;
				}
				if((energyGauss[i] != null) && (previous > 0) ){
					if (fromHartreetokJ(energyGauss[i]) != fromHartreetokJ(energyGauss[i - 1]))
						energy = (fromHartreetokJ(energyGauss[i-1]) - fromHartreetokJ(energyGauss[i]));
					if (energy < 0) energy = +- energy;			
				}
			}

			label = 'Model = ' + modelnumber
			+ ', &#916 E = ' + energy + ' kJmol^-1';
			A.push([i+1,energy,modelnumber,label]);
		}

	} /*else if ( !flagCast && !flagCryVasp && !flagOutcar && !flagGauss && !flagQuantum && !flagGulp && !flagDmol){
		// castep output
		//alert("Castep");
		for (var i = 0; i < (modelCount - 1) ; i++) {
			var line = Info[i].name;
			if(line != null){
				if(line.search(/Energy/i) != -1){
					var modelnumber = 0 + Info[i].modelNumber;
					var last = modelCount - 1;
					if(Info[i].name.search(/cm/i) == -1){
						if(i > 0 && i < Info.length)
							var previous = i - 1 ;
						if((i == 0 && Info[i].name != null) ||
								(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
							energy = (substringEnergyCastepToFloat(Info[i].name) - substringEnergyCastepToFloat(Info[i].name)) ;
							alert(energy + "test1")
							if (energy < 0) energy = +- energy;
						}
						if((Info[i].name != null) && (previous > 0) ){
							if (substringEnergyCastepToFloat(Info[i].name) != substringEnergyCastepToFloat(Info[i - 1].name))
								energy = (substringEnergyCastepToFloat(Info[i-1].name) - substringEnergyCastepToFloat(Info[i].name));
							if (energy < 0) energy = +- energy;
							//alert( Info[i].name)
							alert(energy + "test2")
						}
					}
					

					label = 'Model = ' + modelnumber
					+ ', &#916 E = ' + energy + ' kJ/mol';
					A.push([i+1,energy,modelnumber,label]);
				}
			}
	
	}
	}*/





	data.push(A)
	var options = {
		lines: { show: true },
		points: {show: true, fill: true},
		xaxis: { ticks: 8, tickDecimals: 0 },
		yaxis: { ticks: 6,tickDecimals: 1 },
		selection: { mode: (nplots == 1 ? "x" : "xy"), hoverMode: (nplots == 1 ? "x" : "xy") },
		grid: { hoverable: true, clickable: true, hoverDelay: 10, hoverDelayDefault: 10 }
	}
	theplot = $.plot($('#plotarea'), data, options);


	previousPoint = null
	$("#plotarea").unbind("plothover plotclick", null);
	$("#plotarea").bind("plothover", plotHoverCallback);
	$("#plotarea").bind("plotclick", plotClickCallback);
	itemEnergy = {datapoint:A[0]}
	setTimeout('plotClickCallback(null,null,itemEnergy)',100);
	iamready = true;

}

//This prin the graph of the gradient
function plotGradient( a, b, c, d){

	// setImage()
	var data = [];
	            var A = [];
	                     var nplots = 1;
	                     var modelCount = Info.length;
	                     var stringa = Info[3].name;

	if(flagCryVasp  && !flagOutcar && !flagGauss  && !flagGulp && !flagCast ){
		if(stringa.search(/Energy/i) != -1){

			for (var i = 0; i < (modelCount - 1); i++) {
				var modelnumber = 0 + Info[i].modelNumber;
				// This is if is to check if we are dealing with an optimization
				// or
				// a
				// frequency calculation
				var last = modelCount - 1;

				if(i > 0 && i < Info.length)
					var previous = i - 1 ;

				if((i == 0 && Info[i].name != null) ||
						(i > 0 && Info[i - 1].name == null &&  Info[i].name != null))
					var  maxGra = parseFloat(Info[i].atomProperties.maxGradient) ;

				if((Info[i].name != null) && (previous > 0) ){
					if (substringEnergyToFloat(Info[i].name) != substringEnergyToFloat(Info[i - 1].name))
						var maxGra = parseFloat(Info[i].atomProperties.maxGradient);

				}


				var label = 'Model = ' + modelnumber
				+ ', ForceMAX = ' + maxGra;
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
	theplot = $.plot($("#plotarea1"), data, options);

	previousPointForce = null
	$("#plotarea1").unbind("plothover plotclick", null);
	$("#plotarea1").bind("plothover", plotHoverCallbackforce);
	$("#plotarea1").bind("plotclick", plotClickCallbackForce);
	itemForce = {datapoint:A[0]}
	setTimeout('plotClickCallbackForce(null,null,itemForce)',100);
	iamready = true;
	}

}

var nullValues;
//This print the IR spectrum
function plotFrequencies(a, b, c, d){
	var data = [];
	var data2 =[];
	var A = [];
	var B =[];
	var nplots = 1;
	var modelCount = Info.length;
	var irFreq ;
	var irInt ;
	var ramanFreq;
	var ramanInt;
	var stringa = Info[4].name;
	
	if(flagCryVasp  && !flagOutcar){
		//This for crystal frequencies after geometry optimizations
		
		if(counterFreq != 0){
			stringa = Info[counterFreq + 1].name;
			if (stringa == null)
				stringa = Info[counterFreq + 2].name;
		}
		
		// This is a frequency calculation
		if(stringa.search(/Energy/i) == -1){
			nullValues = countNullModel(Info);
			var index = 0;
			if(counterFreq != 0)
				index = counterFreq +1;
			
			for (var i = index; i < (modelCount); i++) {
				//var modelnumber = Info[i].modelNumber - nullValues -1 ;
				// changed by Piero Sat Sep 20 09:25:18 EDT 2014
				var modelnumber = Info[i].modelNumber - nullValues -1 ;
				
				var last = modelCount - 1;
				
				if(i > 0 && i < Info.length)
					var previous = i - 1 ;

				if((i == 0 && Info[i].name != null) ||
						(i > 0 && Info[i - 1].name == null &&  Info[i].name != null)){
					var  freqValue = substringFreqToFloat(Info[i].modelProperties.Frequency) ;
					var  intValue = substringIntFreqToFloat(Info[i].modelProperties.IRintensity) ;
					
					if(intValue != 0)  {
						var irFreq = substringFreqToFloat(Info[i].modelProperties.Frequency);
						var irInt = substringIntFreqToFloat(Info[i].modelProperties.IRintensity);
						if(Info[i].modelProperties.Ramanactivity == "A"){ // This
							// is if
							// the frequency
							// is both raman
							// and IR active
							var ramanFreq =  substringFreqToFloat(Info[i].modelProperties.Frequency);
							var ramanInt = [100];
						}
					} else {
						var ramanFreq =  substringFreqToFloat(Info[i].modelProperties.Frequency);
						var ramanInt = [100];
					}
				}

				if((Info[i].name != null) && (previous > 0) ){
					if (substringEnergyToFloat(Info[i].name) != substringEnergyToFloat(Info[i - 1].name))
						var freqValue = substringFreqToFloat(Info[i].modelProperties.Frequency);
					var intValue = substringIntFreqToFloat(Info[i].modelProperties.IRintensity); 
					if(intValue != 0){
						var irFreq = substringFreqToFloat(Info[i].modelProperties.Frequency);
						var irInt = substringIntFreqToFloat(Info[i].modelProperties.IRintensity);
						if(Info[i].modelProperties.Ramanactivity == "A"){ 
							// This is when
							// the frequency
							// is both raman
							// and IR active
							var ramanFreq =  substringFreqToFloat(Info[i].modelProperties.Frequency);
							var ramanInt = [100];
						}
					} else {
						var ramanFreq =  substringFreqToFloat(Info[i].modelProperties.Frequency);
						var ramanInt = [100];
					}
				}

				var labelIr = 'Model = Frequency ' +   irFreq  + ', Intensity = ' + irInt + ' kmMol^-1';
				var labelRaman = 'Model = Frequency ' +   ramanFreq  + ', Intensity = ' + ramanInt + ' kmMol^-1';
				A.push([irFreq,irInt,modelnumber,labelIr]);
				B.push([ramanFreq,ramanInt,modelnumber,labelRaman]);
			}
			
		}




	} else if (!flagCryVasp && flagOutcar) {
		
		stringa = Info[4].name
		
		if(counterFreq != 0){
			stringa = Info[counterFreq + 1].name;
			if (stringa == null)
				stringa = Info[counterFreq + 2].name;
		}
		
		if(stringa.search(/G =/i) == -1){
			nullValues = countNullModel(Info);
		}
		
		for (var i = 0; i < freqData.length ; i++) {
			// freqData array defined in crystalfunction
			if(Info[i].name != null){
				var irFreq = substringFreqToFloat(freqData[i]);
				// alert(irFreq);
				var irInt = [0.00];
				var ramanFreq = [0.00];
				var ramanInt = [0.00];
				// Piero last modified Sat Sep 20 10:38:00 EDT 2014
				var modelnumber = Info[i].modelNumber + counterFreq  - nullValues -1 
				var labelIr = 'Model = Frequency ' +   irFreq  + ', Intensity = ' + irInt + ' kmMol^-1';
				// var labelRaman = 'Model = Frequency ' + ramanFreq + ',
				// Intensity
				// = ' + ramanInt + ' km/Mol';
				// alert("counterfreq" + counterFreq)
				A.push([irFreq,irInt,modelnumber,labelIr]);
				// B.push([ramanFreq,ramanInt,modelnumber,labelRaman]);
			}
		}
	}else if (!flagCryVasp && flagGauss){
		for (var i = 0; i < freqGauss.length ; i++) {
			// freqData array defined in crystalfunction
			if(Info[i].name != null){
				var irFreq = substringFreqToFloat(freqGauss[i]);
				// alert(irFreq);
				var irInt = substringIntGaussToFloat(freqIntensGauss[i]);
				var ramanFreq = [0.00];
				var ramanInt = [0.00];
				var modelnumber = counterGauss + i; 
				var labelIr = 'Model = Frequency ' +   irFreq  + ', Intensity = ' + irInt + ' kmMol^-1';
				// var labelRaman = 'Model = Frequency ' + ramanFreq + ',
				// Intensity
				// = ' + ramanInt + ' km/Mol';
				A.push([irFreq,irInt,modelnumber,labelIr]);
				// B.push([ramanFreq,ramanInt,modelnumber,labelRaman]);
			}
		}
	}

	// data.push(A)
	// data.push(B)

	var options = {
			lines: { show: false },
			points: {show: true, fill: true},
			xaxis: { ticks: 8, tickDecimals: 0 },
			yaxis: { ticks: 6,tickDecimals: 0 },
			selection: { mode: (nplots == 1 ? "x" : "xy"), hoverMode: (nplots == 1 ? "x" : "xy") },
			grid: { 
				hoverable: true, 
				clickable: true, 
				hoverDelay: 10, 
				hoverDelayDefault: 10
			}
	}

	if(flagCryVasp  && !flagOutcar  && !flagGauss){
		theplot = $.plot($("#plotareafreq"), [{label:"IR", data: A}, {label:"Raman", data: B}] , options)
	} else if((!flagCryVasp  && flagOutcar)  || (!flagCryVasp  && flagGauss) ){
		theplot = $.plot($("#plotareafreq"), [{label:"IR-Raman", data: A}], options)
	}

	previousPointFreq = null;

	$("#plotareafreq").unbind("plothover plotclick", null)
	$("#plotareafreq").bind("plothover", plotHoverCallbackFreq);
	$("#plotareafreq").bind("plotclick", plotClickCallbackFreq);
	itemFreq = {datapoint:A[0]}
	setTimeout('plotClickCallbackFreq(null,null,itemFreq)',100);
	iamready = true;
}


function plotClickCallback(event, pos, itemEnergy) {

	if (!itemEnergy)return
	var model = itemEnergy.datapoint[2];
	var label = itemEnergy.datapoint[3];
	runJmolScriptAndWait('model '+ model);
	// This select the element from the list of the geometry models
	// +1 keeps the right numeration of models
	getbyID('geom').value = model + 1 ;

}

function plotClickCallbackForce(event, pos, itemForce) {

	if (!itemForce)return
	var model = itemForce.datapoint[2];
	var label = itemForce.datapoint[3];
	runJmolScriptAndWait('model '+model);
	// This select the element from the list of the geometry models
	// +1 keeps the right numeration of models
	getbyID('geom').value = model + 1 ;

}


function plotHoverCallback(event, pos, itemEnergy) {
	if(!itemEnergy)return
	if (previousPoint != itemEnergy.datapoint) {
		$("#tooltip").remove();
		previousPoint = itemEnergy.datapoint  ;
		var y = roundoff(itemEnergy.datapoint[1],4);
		var model = itemEnergy.datapoint[2];
		var label = "&nbsp;&nbsp;Model "+ model + ", &#916 E = " + y +" kJmol^-1";
		showTooltip(itemEnergy.pageX, itemEnergy.pageY + 10, label, pos)
	}

	if (pos.canvasY > 350)plotClickCallback(event, pos, itemEnergy);


}


function plotHoverCallbackforce(event, pos, itemForce) {
	if(!itemForce)return
	if (previousPointForce != itemForce.datapoint) {
		$("#tooltip").remove();
		previousPointForce = itemForce.datapoint;
		var y = roundoff(itemForce.datapoint[1],6);
		var model = itemForce.datapoint[2];
		var label = "&nbsp;&nbsp;Model "+ model + ", MAX Force = " + y ;
		showTooltipForce(itemForce.pageX, itemForce.pageY + 10, label, pos);
	}

	if (pos.canvasY > 350)plotClickCallback(event, pos, itemForce);


}

function showTooltip(x, y, contents, pos) {

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

function plotClickCallbackFreq(event, pos, itemFreq) {

	if (!itemFreq) return
	var model = itemFreq.datapoint[2];
	var label = itemFreq.datapoint[3];
	// loadAllFreq();
	var vibrationProp = 'vibration on; ' +  getValue("vecscale") + '; '+ getValue("vectors") + ';  '+ getValue("vecsamplitude") ; 
	if (flagCryVasp && !flagOutcar && !flagGauss){
		// Last Changed Thu Jul  3 08:37:51 AST 2014 //counterFreq
		var script = ' model '+ (model + nullValues ) +  '; ' + vibrationProp ;  // 'set
		if(counterFreq != 0)
			// Last Changed Thu Jul  3 08:37:51 AST 2014
			var script = ' model '+ (model + nullValues +1 ) +  '; ' + vibrationProp ;  // 'set
	}else{
		var script = ' model '+ ( model + 1 ) +  '; ' + vibrationProp ;  // 'set
	}
	runJmolScriptAndWait(script);
	onClickVibrate("on");
	// This select the element from the list of the geometry models
	// +1 keeps the right numeration of models
	if(counterFreq != 0 && (flagCryVasp && !flagOutcar && !flagGauss)){
		//getbyID('vib').value = model + counterFreq - nullValues - 1;
		// Last Changed Thu Jul  3 08:37:51 AST 2014
		getbyID('vib').value = model + counterFreq - nullValues  ;
	}else {
		getbyID('vib').value = model + 1;
	}

}

function plotHoverCallbackFreq(event, pos, itemFreq) {
	if(!itemFreq)return
	if (previousPointFreq != itemFreq.datapoint) {
		$("#tooltip").remove();
		previousPointFreq = itemFreq.datapoint  ;
		var x = roundoff(itemFreq.datapoint[0],2);
		var y = roundoff(itemFreq.datapoint[1],1);
		var model = itemFreq.datapoint[2];
		if (flagCryVasp && !flagOutcar && !flagGauss){
			var label = "&nbsp;&nbsp;Model "+ (model + 3 + nullValues)+ ", Freq (cm^-1) " + x + ", Int. (kmMol^-1) " + y ;
			
			if(counterFreq != 0)
				label = "&nbsp;&nbsp;Model "+ (model - counterFreq + nullValues+1) + ", Freq (cm^-1) " + x + ", Int. (kmMol^-1) " + y ;
				
		}else{
			var label = "&nbsp;&nbsp;Model "+ (model)  + ", Freq (cm^-1) " + x + ", Int. (kmMol^-1) " + y ;
		}
		showTooltipFreq(itemFreq.pageX, itemFreq.pageY + 10, label, pos);
	}

	if (pos.canvasY > 350)plotClickCallback(event, pos, itemFreq);

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

function jmolLoadStructCallback() {
	alert("calling plotgraph#jmolLoadStructCallback??")
	setTimeout('doPlot()');
}

//code that fakes an applet print by creating an image in its place! :)

function setImage() {
	if (appletPrintable)return
	var image = jmolGetPropertyAsString("image")
	var html = '<img src="data:image/jpeg;base64,'+image+'" />'
	getbyID("imagediv").innerHTML = html
}

var iamready = false;

function doHighlight(app, modelIndex) {
	if (!iamready)return;
	theplot.unhighlight(0,-1)
	theplot.highlight(0, modelIndex);
	var label = data[0][modelIndex][3];
        setTimeout('runJmolScript("set echo top left; echo ' + label+'")',100);
}


function doPrintAll() {
	setImage()
	window.print()
}
