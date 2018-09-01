/*  J-ICE library 

    based on: A toolkit for publishing enhanced figures; B. McMahon and R. M. Hanson; J. Appl. Cryst. (2008). 41, 811-814
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

function applyBond(x) {
	if (firstTimeBond) {
		setV("wireframe .2;");
	} else {
		setV("wireframe " + (x / 100) + ";");
		getbyID('bondMsg').innerHTML = parseFloat(x / 100)
		.toPrecision(1)
		+ " &#197";
		setV("save BONDS bondEdit");
	}
}

function applyRadii(x) {
	setV("cpk " + x + " %;");
	getbyID('radiiMsg').innerHTML = parseFloat(x)
	.toPrecision(2)
	+ " %"
}

function applyConnect(x) {
	if (firstTime) {
		setV("connect (*) (*) DELETE; connect 2.0 (*) (*) single ModifyOrCreate;");
	} else {
		var flagBond = checkBoxX("allBondconnect");
		// alert(flagBond);
		// alert(frameNum);
		if (frameNum == null || frameNum == '') {
			getUnitcell("1");
			frameNum = 1.1;
		} else {

		}
		if (flagBond == 'off') {
			setV("select " + frameNum
					+ "; connect  (selected) (selected)  DELETE");
			setV("connect " + parseFloat(x / 20)
					+ " (selected) (selected) single ModifyOrCreate;");
		} else {
			setV("connect (*) (*) DELETE; connect " + parseFloat(x / 20.0)
					+ " (*) (*) single ModifyOrCreate;");
		}
		setV("save BONDS bondEdit");
	}
	getbyID('radiiConnectMsg').innerHTML = " "
		+ parseFloat(x / 20.0).toPrecision(2) + " &#197";
}

function applyTrans(x) {
	var dull = parseFloat(x);
	setV("color " + getValueSel("setFashion") + " TRANSLUCENT " + dull + ";");
	getbyID('transMsg').innerHTML = x + " %"
}

function applyPack(x) {
	packRange = parseFloat(x / 20.0).toPrecision(2);
	setPackRange();
	getbyID("packMsg").innerHTML = packRange + " &#197";
}

function applyPers(x) {
	var perp = x / 25;
	setV("set cameraDepth " + perp + ";")
	getbyID("perspMsg").innerHTML = perp
}

function applyLight1(x) {
	setV(" set specularPercent " + x + ";");
	getbyID("light1Msg").innerHTML = x + "%";
}

function applyLight2(x) {
	setV(" set ambient " + x + ";");
	getbyID("light2Msg").innerHTML = x + "%";
}

function applyLight3(x) {
	setV(" set diffusePercent " + x + ";");
	getbyID("light3Msg").innerHTML = x + "%";
}

var defaultFront = 20, defaultBack = 100;

function applySlab(x) {
	getbyID('slabSliderMsg').innerHTML = x + "%" // display
	// 0% for
	// frontplane,
	// 100% for
	// backplane:
	runJmolScript("slab " + (100 - x) + ";")
}

function applyDepth(x) { // alternative displays:
	// getbyID('backValue').innerHTML = x + "%" // 0% for
	// frontplane, 100% for backplane
	getbyID('depthSliderMsg').innerHTML = (100 - x) + "%" // 100%
	// for
	// frontplane,
	// 0%
	// for
	// backplane
	runJmolScript("depth " + (100 - x) + ";")
}

function toggleSlab() {
	var ctl = getbyID("slabToggle")
	if (ctl.checked) {
		setV("spin off; slab on; slab 80;");
		slabSlider.setValue(20);
		applySlab(defaultFront);
		depthSlider.setValue(defaultBack);
		applyDepth(defaultBack);
	} else {
		setV("slab off; ")
		slabSlider.setValue(0);
		depthSlider.setValue(0);
	}
}

loadSliders = function() {

	bondSlider = new Slider(getbyID("bondSlider-div"), getbyID("bondSlider-input"), "horizontal");
	bondSlider.setMaximum(100);
	//does not work with values < 1
	bondSlider.setMinimum(0);
	bondSlider.setUnitIncrement(5);
	//amount to increment the value when using the arrow keys
	bondSlider.setValue(15);
	bondSlider.onchange = function() { // onchange MUST BE all lowercase
		applyBond(getbyID("bondSlider-input").value)
	}
	
	radiiSlider = new Slider(getbyID("radiiSlider-div"), getbyID("radiiSlider-input"), "horizontal");
	radiiSlider.setMaximum(100);
	//does not work with values < 1
	radiiSlider.setMinimum(0);
	radiiSlider.setUnitIncrement(5);
	//amount to increment the value when using the arrow keys
	radiiSlider.setValue(26);
	radiiSlider.onchange = function() { // onchange MUST BE all lowercase
		applyRadii(getbyID("radiiSlider-input").value)
	}
	
	radiiConnect = new Slider(getbyID("radiiConnect-div"), getbyID("radiiConnect-input"), "horizontal");
	radiiConnect.setMaximum(100);
	//does not work with values < 1
	radiiConnect.setMinimum(0);
	radiiConnect.setUnitIncrement(1);
	//amount to increment the value when using the arrow keys
	radiiConnect.setValue(80);
	radiiConnect.onchange = function() { // onchange MUST BE all lowercase
		applyConnect(getbyID("radiiConnect-input").value)
	}
	
	transSlider = new Slider(getbyID("transSlider-div"), getbyID("transSlider-input"), "horizontal");
	transSlider.setMaximum(100);
	//does not work with values < 1
	transSlider.setMinimum(0);
	transSlider.setUnitIncrement(4);
	//amount to increment the value when using the arrow keys
	transSlider.setValue(100);
	transSlider.onchange = function() { // onchange MUST BE all lowercase
		applyTrans(getbyID("transSlider-input").value)
	}
	
	packSlider = new Slider(getbyID("packSlider-div"), getbyID("packSlider-input"), "horizontal");
	packSlider.setMaximum(100);
	//does not work with values < 1
	packSlider.setMinimum(0);
	packSlider.setUnitIncrement(0.5);
	//amount to increment the value when using the arrow keys
	packSlider.setValue(10);
	packSlider.onchange = function() { // onchange MUST BE all lowercase
		applyPack(getbyID("packSlider-input").value)
	}
	
	persSlider = new Slider(getbyID("persSlider-div"), getbyID("persSlider-input"), "horizontal");
	persSlider.setMaximum(100);
	//does not work with values < 1
	persSlider.setMinimum(0);
	persSlider.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	persSlider.setValue(5);
	persSlider.onchange = function() { // onchange MUST BE all lowercase
		applyPers(getbyID("persSlider-input").value)
	}
	
	light1Slider = new Slider(getbyID("light1Slider-div"), getbyID("light1Slider-input"), "horizontal");
	light1Slider.setMaximum(100);
	//does not work with values < 1
	light1Slider.setMinimum(0);
	light1Slider.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	light1Slider.setValue(5);
	light1Slider.onchange = function() { // onchange MUST BE all lowercase
		applyLight1(getbyID("light1Slider-input").value)
	}
	
	light2Slider = new Slider(getbyID("light2Slider-div"), getbyID("light2Slider-input"), "horizontal");
	light2Slider.setMaximum(100);
	//does not work with values < 1
	light2Slider.setMinimum(0);
	light2Slider.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	light2Slider.setValue(5);
	light2Slider.onchange = function() { // onchange MUST BE all lowercase
		applyLight2(getbyID("light2Slider-input").value)
	}
	
	light3Slider = new Slider(getbyID("light3Slider-div"), getbyID("light3Slider-input"), "horizontal");
	light3Slider.setMaximum(100);
	//does not work with values < 1
	light3Slider.setMinimum(0);
	light3Slider.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	light3Slider.setValue(5);
	light3Slider.onchange = function() { // onchange MUST BE all lowercase
		applyLight3(getbyID("light3Slider-input").value)
	}
	
	slabSlider = new Slider(getbyID("slabSlider-div"), getbyID("slabSlider-input"), "horizontal");
	slabSlider.setMaximum(100)
	slabSlider.setMinimum(0)
	slabSlider.setUnitIncrement(2) // amount to increment the value when using the
	// arrow keys
	slabSlider.setValue(defaultFront)
	slabSlider.onchange = function() { // onchange MUST BE all lowercase
		applySlab(getbyID("slabSlider-input").value)
	}
	
	depthSlider = new Slider(getbyID("depthSlider-div"), getbyID("depthSlider-input"), "horizontal");
	depthSlider.setMaximum(100);
	depthSlider.setMinimum(0);
	depthSlider.setUnitIncrement(2); // amount to increment the value when using
	// the arrow keys
	depthSlider.setValue(defaultBack);
	depthSlider.onchange = function() { // onchange MUST BE all lowercase
		applyDepth(getbyID("depthSlider-input").value)
	}
}

