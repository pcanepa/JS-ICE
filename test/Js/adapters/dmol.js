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

//3rd-Sept-2010 CANEPA

loadDone_dmol = function() {
	_file.energyUnits = ENERGY_HARTREE;
	_file.StrUnitEnergy = "H";
	for (var i = 0; i < _file.info.length; i++) {
		var line = _file.info[i].name;
		if (line != null) {
			if (line.search(/E =/i) != -1) {
				addOption(getbyID('geom'), i + " " + line, i + 1);
				_file.geomData[i] = line;
				_file.counterFreq++;
			} else if (line.search(/cm/i) != -1) {
				_file.freqInfo.push(_file.info[i]);
				_file.freqData.push(line);
				var data = parseFloat(line.substring(0, line.indexOf("cm") - 1));
				_file.vibLine.push(i + " A " + data + " cm^-1");
				_file.counterMD++;
			}
		}
	}

	getUnitcell("1");
	setFrameValues("1");
	getSymInfo();
	loadDone();
}
