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

var counterFreq = 0;

loadDone_molden = function(msg) {

	_fileData.energyUnits = ENERGY_EV;
	_fileData.StrUnitEnergy = "e";
	
	for (var i = 0; i < Info.length; i++) {
		if (Info[i].name != null) {
			var line = Info[i].name;
			if (line.search(/cm/i) != -1) {
				var data = parseFloat(line.substring(0, line.indexOf("cm") - 1));
				_fileData.freqInfo.push(Info[i]);
				_fileData.freqData.push(line);
				_fileData.vibLine.push(i + " A " + data + " cm^-1");
				_fileData.counterMD++;
			}
		}
	}

	disableFreqOpts();
	getSymInfo();
	loadDone();
}
