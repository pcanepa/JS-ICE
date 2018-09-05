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

var coordinateGromacs = null;

function exportGromacs() {
	warningMsg("Make sure you had selected the model you would like to export.");
	settitleGroomacs();
	setUnitCell();
	// setVacuum();
	// if(!flagGromos)
	trasnfromcartTocartnm();

	setcoordinateGromacs();

	var finalInputGromacs = "var final = [titleg,coordinate];"
			+ 'final = final.replace("\n\n","");' + 'WRITE VAR final "?.gro" ';
	setV(finalInputGromacs);
	// if(!flagGromos)
	trasnscartfromnmToCart();
}

function settitleGroomacs() {
	var titleGromacs = prompt("Type here the job title:", "");
	(titleGromacs == "") ? (titleGromacs = 'Input prepared with J-ICE ')
			: (titleGromacs = 'Input prepared with J-ICE ' + titleGromacs);
	titleGromacs = 'titleg = \"' + titleGromacs + '\"; ';
	setV(titleGromacs);
}

function setcoordinateGromacs() {
	var numatomsGrom = " " + selectedFrame + ".length";
	var coordinateGrom = selectedFrame
			+ '.label("  %i%e %i %e %8.3[xyz] %8.4fy %8.4fz")';
	var cellbox = +roundNumber(aCell) * (cosRadiant(alpha)) + ' '
			+ roundNumber(bCell) * (cosRadiant(beta)) + ' '
			+ roundNumber(cCell) * (cosRadiant(gamma));
	coordinateGromacs = 'var numatomGrom = ' + ' ' + numatomsGrom + ';'
			+ 'var coordGrom = ' + coordinateGrom + ';'
			+ 'var cellGrom = \" \n\t' + cellbox + '\"; '
			+ 'coordinate = [numatomGrom,coordGrom,cellGrom];';
	setV(coordinateGromacs);
}
