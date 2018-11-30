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
_slider = {
	defaultFront	: 20,
	defaultBack 	: 100,
	bond 			: null,
	radii 			: null,
	radiiConnect	: null,
	trans			: null,
	pack			: null,
	cameraDepth		: null,
	specularPercent : null,
	ambientPercent	: null,
	diffusePercent	: null,
	slab 			: null,
	depth			: null
}	
function applyBond(angstroms) {
	if (_show.firstTimeBond) {
		runJmolScriptWait("wireframe .2;");
	} else {
		runJmolScriptWait("wireframe " + angstroms + ";");
		getbyID('slider.bondMsg').innerHTML = angstroms.toPrecision(1) + " &#197";
		runJmolScriptWait("save BONDS bondEdit");
	}
}


loadSliders = function() {
	_slider.bond = new Slider(getbyID("slider.bond-div"), getbyID("slider.bond-input"), "horizontal");
	_slider.bond.setMaximum(100);
	_slider.bond.setMinimum(0);
	_slider.bond.setUnitIncrement(5);
	//amount to increment the value when using the arrow keys
	_slider.bond.setValue(15);
	_slider.bond.onchange = function() {
		applyBond(_slider.bond.getValue() / 100)
	}
	
	_slider.radii = new Slider(getbyID("slider.radii-div"), getbyID("slider.radii-input"), "horizontal");
	_slider.radii.setMaximum(100);
	_slider.radii.setMinimum(0);
	_slider.radii.setUnitIncrement(5);
	//amount to increment the value when using the arrow keys
	_slider.radii.setValue(26);
	_slider.radii.onchange = function() {
		applyRadii(_slider.radii.getValue())
	}
	
	_slider.radiiConnect = new Slider(getbyID("slider.radiiConnect-div"), getbyID("slider.radiiConnect-input"), "horizontal");
	_slider.radiiConnect.setMaximum(100);
	//does not work with values < 1
	_slider.radiiConnect.setMinimum(0);
	_slider.radiiConnect.setUnitIncrement(1);
	//amount to increment the value when using the arrow keys
	_slider.radiiConnect.setValue(80);
	_slider.radiiConnect.onchange = function() {
		applyConnect(_slider.radiiConnect.getValue() / 20)
	}
	
	_slider.trans = new Slider(getbyID("slider.trans-div"), getbyID("slider.trans-input"), "horizontal");
	_slider.trans.setMaximum(100);
	_slider.trans.setMinimum(0);
	_slider.trans.setUnitIncrement(4);
	//amount to increment the value when using the arrow keys
	_slider.trans.setValue(100);
	_slider.trans.onchange = function() {
		applyTrans(_slider.trans.getValue())
	}
	
	_slider.pack = new Slider(getbyID("slider.pack-div"), getbyID("slider.pack-input"), "horizontal");
	_slider.pack.setMaximum(100);
	_slider.pack.setMinimum(0);
	_slider.pack.setUnitIncrement(0.5);
	//amount to increment the value when using the arrow keys
	_slider.pack.setValue(1);
	_slider.pack.onchange = function() {
		applyPack(_slider.pack.getValue() / 20)
	}
	
	
	_slider.cameraDepth = new Slider(getbyID("slider.cameraDepth-div"), getbyID("slider.cameraDepth-input"), "horizontal");
	_slider.cameraDepth.setMaximum(100);
	_slider.cameraDepth.setMinimum(1);
	_slider.cameraDepth.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	_slider.cameraDepth.setValue(5);
	_slider.cameraDepth.onchange = function() {
		applyCameraDepth(_slider.cameraDepth.getValue()/25)
	}
	
	_slider.specularPercent = new Slider(getbyID("slider.specularPercent-div"), getbyID("slider.specularPercent-input"), "horizontal");
	_slider.specularPercent.setMaximum(100);
	_slider.specularPercent.setMinimum(0);
	_slider.specularPercent.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	_slider.specularPercent.setValue(5);
	_slider.specularPercent.onchange = function() {
		applySpecularPercent(_slider.specularPercent.getValue())
	}
	
	_slider.ambientPercent = new Slider(getbyID("slider.ambientPercent-div"), getbyID("slider.ambientPercent-input"), "horizontal");
	_slider.ambientPercent.setMaximum(100);
	_slider.ambientPercent.setMinimum(0);
	_slider.ambientPercent.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	_slider.ambientPercent.setValue(5);
	_slider.ambientPercent.onchange = function() {
		applyAmbientPercent(_slider.ambientPercent.getValue())
	}
	
	_slider.diffusePercent = new Slider(getbyID("slider.diffusePercent-div"), getbyID("slider.diffusePercent-input"), "horizontal");
	_slider.diffusePercent.setMaximum(100);
	_slider.diffusePercent.setMinimum(0);
	_slider.diffusePercent.setUnitIncrement(2);
	//amount to increment the value when using the arrow keys
	_slider.diffusePercent.setValue(5);
	_slider.diffusePercent.onchange = function() {
		applyDiffusePercent(_slider.diffusePercent.getValue())
	}
	
	_slider.slab = new Slider(getbyID("slider.slab-div"), getbyID("slider.slab-input"), "horizontal");
	_slider.slab.setMaximum(100)
	_slider.slab.setMinimum(0)
	_slider.slab.setUnitIncrement(2) 
	// amount to increment the value when using the
	// arrow keys
	_slider.slab.setValue(_slider.defaultFront)
	_slider.slab.onchange = function() {
		applySlab(_slider.slab.getValue())
	}
	
	_slider.depth = new Slider(getbyID("slider.depth-div"), getbyID("slider.depth-input"), "horizontal");
	_slider.depth.setMaximum(100);
	_slider.depth.setMinimum(0);
	_slider.depth.setUnitIncrement(2); // amount to increment the value when using
	// the arrow keys
	_slider.depth.setValue(_slider.defaultBack);
	_slider.depth.onchange = function() { // onchange MUST BE all lowercase
		applyDepth(_slider.depth.getValue())
	}
}

