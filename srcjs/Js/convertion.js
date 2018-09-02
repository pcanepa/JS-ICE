/*  J-ICE library 

    based on:
 *
 * Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 * Contact: pierocanepa@sourceforge.net
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

//////////////////////////////////////VALUE CONVERTION AND ROUNDOFF
function substringEnergyToFloat(value) {
	if (value != null) {
		var grab = parseFloat(
				value.substring(value.indexOf('=') + 1, value.indexOf('H') - 1))
				.toPrecision(12); // Energy = -5499.5123027313 Hartree
		grab = grab * 2625.50;
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function substringFreqToFloat(value) {
	if (value != null) {
		var grab = parseFloat(value.substring(0, value.indexOf('c') - 1));
		// BH 2018 looking out for "F 300.2" in frequencies
		if (isNaN(grab))
			grab= parseFloat(value.substring(1, value.indexOf('c') - 1));
		if (isNaN(grab))
			return NaN;
		else
		grab = Math.round(grab.toPrecision(8) * 100000000) / 100000000;
	}
	return grab;
}

function substringIntGaussToFloat(value) {
	if (value != null) {
		var grab = parseFloat(value.substring(0, value.indexOf('K') - 1))
		.toPrecision(8);
		grab = Math.round(grab * 100000000) / 100000000;
	}
	return grab;
}

function substringIntFreqToFloat(value) {
	if (value != null) {
		var grab = parseFloat(value.substring(0, value.indexOf('k') - 1))
		.toPrecision(5);
		grab = Math.round(grab * 10000) / 10000;
	}
	return grab;
}

/////////////////////////////// LATTICE PARAMETERS AND COORDIANTE CONVERTION
//From fractional to Cartesian
var xx, xy, xz, yx, yy, yz, zx, zy, zz;
function fromfractionaltoCartesian(aparam, bparam, cparam, alphaparam,
		betaparam, gammaparam) {
	if (aparam != null)
		aCell = aparam;
	if (bparam != null)
		bCell = bparam;
	if (cparam != null)
		cCell = cparam;
	if (alphaparam != null)
		alpha = alphaparam;
	if (betaparam != null)
		beta = betaparam;
	if (gammaparam != null)
		gamma = gammaparam;
	var radiant = Math.PI / 180;
	// formula repeated from
	// http://en.wikipedia.org/wiki/Fractional_coordinates
	v = Math.sqrt(1
			- (Math.cos(alpha * radiant) * Math.cos(alpha * radiant))
			- (Math.cos(beta * radiant) * Math.cos(beta * radiant))
			- (Math.cos(gamma * radiant) * Math.cos(gamma * radiant))
			+ 2
			* (Math.cos(alpha * radiant) * Math.cos(beta * radiant) * Math
					.cos(gamma * radiant)));
	xx = aCell * Math.sin(beta * radiant);
	xy = parseFloat(0.000);
	xz = aCell * Math.cos(beta * radiant);
	yx = bCell
	* (((Math.cos(gamma * radiant)) - ((Math.cos(beta * radiant)) * (Math
			.cos(alpha * radiant)))) / Math.sin(beta * radiant));
	yy = bCell * (v / Math.sin(beta * radiant));
	yz = bCell * Math.cos(alpha * radiant);
	zx = parseFloat(0.000);
	zy = parseFloat(0.000);
	zz = cCell;
}

function cosRadiant(value) {
	var radiant = Math.PI / 180;
	if (value != null) {
		var angle = parseFloat(value).toPrecision(7);
		angle = Math.cos(value * radiant);
		angle = Math.round(angle * 10000000) / 10000000;
	}
	return angle;
}

function roundNumber(value) {
	var newval = Math.round(value * 10000000) / 10000000;
	return newval;
}

function roundoff(value, precision) {
	value = "" + value
	precision = parseInt(precision)

	var whole = "" + Math.round(value * Math.pow(10, precision))
	var decPoint = whole.length - precision;

	if (decPoint != 0) {
		result = whole.substring(0, decPoint);
		result += "."
			result += whole.substring(decPoint, whole.length);
	} else {
		result = whole;
	}

	return result;
}

function setVacuum() {
	// This if the file come from crystal output

	switch (typeSystem) {
	case "slab":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(selectedFrame + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		if (fractionalCoord == true) {
			setV(selectedFrame + '.z = for(i;' + selectedFrame + '; ( i.z +'
					+ factor + ') /' + newcell + ')');
			alert("here i'm")
		} else {
			setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z +'
					+ factor + ')');
		}
		fromfractionaltoCartesian(null, null, newcCell, null, 90, 90);
		break;
	case "polymer":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + "  \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(selectedFrame + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z +' + factor
				+ ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y +' + factor
				+ ')');
		fromfractionaltoCartesian(null, newcCell, newcCell, 90, 90, 90);
		break;
	case "molecule":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(selectedFrame + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z +' + factor
				+ ')');
		setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y +' + factor
				+ ')');
		setV(selectedFrame + '.x = for(i;' + selectedFrame + '; i.x +' + factor
				+ ')');
		fromfractionaltoCartesian(newcCell, newcCell, newcCell, 90, 90, 90);
		break;

	}

}

function trasnfromcartTocartnm() {
	setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z/10)');
	setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y/10)');
	setV(selectedFrame + '.x = for(i;' + selectedFrame + '; i.x/10)');
}

function trasnscartfromnmToCart() {
	setV(selectedFrame + '.z = for(i;' + selectedFrame + '; i.z*10)');
	setV(selectedFrame + '.y = for(i;' + selectedFrame + '; i.y*10)');
	setV(selectedFrame + '.x = for(i;' + selectedFrame + '; i.x*10)');

}

/////////////////////////////////END LATTICE PARAMETERS AND COORDIANTE
//CONVERTION

////////////////////////////////ENERGY CONV
var finalGeomUnit = ""
	function convertPlot(value) {
	var unitEnergy = value;

	// ////var vecUnitEnergyVal = new Array ("h", "e", "r", "kj", "kc");
	setConvertionParam();
	switch (unitEnergy) {

	case "h": // Hartree
		finalGeomUnit = " Hartree";
		if (flagQuantum) {
			convertGeomData(fromRydbergtohartree);
		} else if (!flagCryVasp || flagOutcar || flagGulp) {
			convertGeomData(fromevToHartree);
		} else if (flagCryVasp || flagDmol) {
			convertGeomData(fromHartreetoHartree);
		}
		break;
	case "e": // eV
		finalGeomUnit = " eV";
		if (flagCryVasp || flagDmol) {
			convertGeomData(fromHartreetoEv);
		} else if (flagQuantum) {
			convertGeomData(fromRydbergtoEv);
		} else if (!flagCryVasp || flagOutcar || flagGulp) {
			convertGeomData(fromevtoev);
		}

		break;

	case "r": // Rydberg
		finalGeomUnit = " Ry";
		if (flagCryVasp || flagDmol) {
			convertGeomData(fromHartreetoRydberg);
		} else if (!flagCryVasp || flagOutcar || flagGulp) {
			convertGeomData(fromevTorydberg);
		} else if (flagQuantum) {
			convertGeomData(fromRydbergTorydberg);
		}
		break;

	case "kj": // Kj/mol
		finalGeomUnit = " kJ/mol"

			if (flagCryVasp || flagDmol) {
				convertGeomData(fromHartreetokJ);
			} else if (!flagCryVasp || flagOutcar || flagGulp) {
				convertGeomData(fromevTokJ);
			} else if (flagQuantum) {
				convertGeomData(fromRydbergToKj);
			}
		break;

	case "kc": // Kcal*mol
		finalGeomUnit = " kcal/mol"
			
			if (flagCryVasp || flagDmol) {
				convertGeomData(fromHartreetokcalmol);
			} else if (!flagCryVasp || flagOutcar || flagGulp) {
				convertGeomData(fromevtokcalmol);
			} else if (flagQuantum) {
				convertGeomData(fromRytokcalmol);
			}
		break;
	}
}

/*
 * var flagCryVasp = true; // if flagCryVasp = true crystal output var
 * flagGromos = false; var flagGulp = false; var flagOutcar = false; var
 * flagGauss= false; var flagQuantum = false; var flagCif = false;
 */

var unitGeomEnergy = "";
function setConvertionParam() {
	if (flagCryVasp || flagDmol) {
		unitGeomEnergy = "H"; // Hartree
	} else if ((!flagCryVasp && !flagQuantum) || (flagOutcar && !flagQuantum)) {
		unitGeomEnergy = "e"; // VASP
	} else if (flagGulp) {
		unitGeomEnergy = "k";
	} else if (flagQuantum || !flagOutcar) {
		unitGeomEnergy = "R";
	}

}

function convertGeomData(functionName) {
	// The required value is the end of the string Energy = -123.456 Hartree.
	// Hartree
	if (getbyID("geom") != null)
		cleanList("geom");

	var arraynewUnit = new Array();

	var n = 0;
	if (flagQuantum)
		n = 1;
	for ( var i = n; i < geomData.length; i++) {

		arraynewUnit[i] = functionName(geomData[i].substring(geomData[i]
		.indexOf('=') + 1, geomData[i].indexOf(unitGeomEnergy) - 1));
		// /alert(arraynewUnit[i])
		addOption(getbyID("geom"), i + " E = " + arraynewUnit[i]
		+ finalGeomUnit, i + 1);

	}

}

///Hartree
function fromHartreetoEv(value) { // 1 Hartree = 27.211396132eV
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = grab * 27.211396132;
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromHartreetoHartree(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromHartreetokJ(value) { // From hartree to kJmol-1
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = grab * 2625.50;
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

function fromHartreetoRydberg(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = grab * 2;
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromHartreetokcalmol(value) { // 1Hartree == 627.509 kcal*mol-1
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = grab * 627.509;
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

/// end Hartree

////ev

function fromevTokJ(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromevToHartree(grab);
		grab = fromHartreetokJ(grab)
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

function fromevToHartree(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromHartreetoEv(1 / grab);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromevTorydberg(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = grab * 0.073498618;
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromevtoev(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromevtokcalmol(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromevToHartree(grab);
		grab = fromHartreetokcalmol(grab);
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

////end ev

//rydberg

function fromRydbergtohartree(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromHartreetoRydberg(1 / grab);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

function fromRydbergtoEv(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromevTorydberg(1 / grab);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;

}

function fromRydbergToKj(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromHartreetokJ(grab / 2);
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

function fromRytokcalmol(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = fromRydbergtohartree(grab);
		grab = fromHartreetokcalmol(grab);
		grab = Math.round(grab * 1000) / 1000;
	}
	return grab;
}

function fromRydbergTorydberg(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(12);
		grab = Math.round(grab * 1000000000000) / 1000000000000;
	}
	return grab;
}

//1 Angstrom = 1.889725989 Bohr
function fromAngstromtoBohr(value) {
	if (value != null) {
		var grab = parseFloat(value).toPrecision(7);
		grab = grab * 1.889725989;
		grab = Math.round(grab * 10000000) / 10000000;
	}
	return grab;
}

/////////////////////////////////END ENERGY CONVERTION
