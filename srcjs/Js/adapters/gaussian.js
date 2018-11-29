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

loadDone_gaussian = function() {

	warningMsg("This is a molecular reader. Therefore not all properties will be available.")

	_fileData.energyUnits = ENERGY_HARTREE;
	_fileData.StrUnitEnergy = "H";

	setTitleEcho();
	setFrameValues("1");
	disableFreqOpts();

	var geom = getbyID('geom');
	var vib = getbyID('vib');
	for (var i = 0; i < _fileData.info.length; i++) {
		if (_fileData.info[i].name != null) {
			var line = _fileData.info[i].name;
			// alert(line)
			if (line.search(/E/i) != -1) {
				_fileData.geom[i] = _fileData.info[i].name;
				addOption(geom, i + " " + _fileData.geom[i], i + 1);
				if (_fileData.info[i].modelProperties.Energy != null
						|| _fileData.info[i].modelProperties.Energy != "")
					_fileData.energy[i] = _fileData.info[i].modelProperties.Energy;
				_fileData.counterGauss++;
			} else if (line.search(/cm/i) != -1) {
				_fileData.vibLine.push(i + " " + _fileData.info[i].name + " (" + _fileData.info[i].modelProperties.IRIntensity + ")");
				_fileData.freqInfo.push(_fileData.info[i]);
				_fileData.freqData.push(_fileData.info[i].modelProperties.Frequency);
				_fileData.freqSymm.push(_fileData.info[i].modelProperties.FrequencyLabel);
				_fileData.freqIntens.push(_fileData.info[i].modelProperties.IRIntensity);
			}
		}
	}
	loadDone();
}

