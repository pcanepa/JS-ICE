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


function exportGromacs() {
	warningMsg("Make sure you have selected the model you would like to export.");
	setTitleGromacs();
	setUnitCell();
	runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; i.z/10);'
		+ _fileData.frameSelection + '.y = for(i;' + _fileData.frameSelection + '; i.y/10);'
		+ _fileData.frameSelection + '.x = for(i;' + _fileData.frameSelection + '; i.x/10);');
	setCoordinatesGromacs();
	runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; i.z*10);'
			+ _fileData.frameSelection + '.y = for(i;' + _fileData.frameSelection + '; i.y*10);'
			+ _fileData.frameSelection + '.x = for(i;' + _fileData.frameSelection + '; i.x*10);');
	var finalInputGromacs = "var final = [titleg,coordinate];"
			+ 'final = final.replace("\n\n","");' + 'WRITE VAR final "?.gro" ';
	runJmolScriptWait(finalInputGromacs);
}

function setTitleGromacs() {
	var titleGromacs = prompt("Type here the job title:", "");
	(titleGromacs == "") ? (titleGromacs = 'Input prepared with J-ICE ')
			: (titleGromacs = 'Input prepared with J-ICE ' + titleGromacs);
	titleGromacs = 'titleg = \"' + titleGromacs + '\"; ';
	runJmolScriptWait(titleGromacs);
}

function setCoordinatesGromacs() {
	var numatomsGrom = " " + _fileData.frameSelection + ".length";
	var coordinateGrom = _fileData.frameSelection
			+ '.label("  %i%e %i %e %8.3[xyz] %8.4fy %8.4fz")';
	var cellbox = +roundNumber(_fileData.cell.a) * (cosRadiant(alpha)) + ' '
			+ roundNumber(_fileData.cell.b) * (cosRadiant(beta)) + ' '
			+ roundNumber(_fileData.cell.c) * (cosRadiant(gamma));
	var coordinateGromacs = 'var numatomGrom = ' + ' ' + numatomsGrom + ';'
			+ 'var coordGrom = ' + coordinateGrom + ';'
			+ 'var cellGrom = \" \n\t' + cellbox + '\"; '
			+ 'coordinate = [numatomGrom,coordGrom,cellGrom];';
	runJmolScriptWait(coordinateGromacs);
}
