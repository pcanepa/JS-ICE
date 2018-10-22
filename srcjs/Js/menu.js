/*  J-ICE library 
 *
 *  based on:
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



addCommandBox = function() {
	// see debug.js
	return "<div id='debugpanel'>"
		+ createCheck("debugMode", "Show Commands", "debugShowCommands(this.checked)", 0,
			0, "")
		+ "&nbsp;" + createButton("removeText", "Clear", 'debugShowCommands(true);debugSay(null)', 0)
		+ "&nbsp;" + createButton("getHelp", "History", 'debugShowCommands(true);debugShowHistory()', 0)
		+ "&nbsp;" + createButton("getHelp", "Scripting Help", 'runJmolScriptWait("help")', 0)
		+ "<br>\n"
		+ "<div id='debugdiv' style='display:none'>"
		+ "<input type='text' style='font-size:12pt;width:350px' value='' placeHolder='type a command here' onKeydown='event.keyCode === 13&&$(this).select()&&runJmolScriptWait(value)'/>" 
		+ "<br><textarea id='debugarea' style='font-size:12pt;width:350px;height:150px;font-family:monospace;overflow-y:auto'></textarea>" 
		+ "</div></div>"
}

function cleanLists() {
	// was "removeAll()"
	cleanList('geom');
	cleanList('vib');
	cleanList('colourbyElementList');
	// cleanList('colourbyAtomList');
	cleanList('polybyElementList');
	cleanList("poly2byElementList");
	// BH 2018 -- does not belong here: setValue("fineOrientMagn", "5");
}

