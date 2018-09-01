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

/*
 * 
 * Last update 5th 2011 P. Canepa
 * 
 * 
 * */

document.write("<br> ");

document.write(createText5('filename', 'Filename:', '108', '', '', "disab"));
document.write("<br>");
document.write(createButton1("reload", "Reload",
		'setV("script ./scripts/reload.spt") + resetAll() + setName()', 0,
		"specialbutton"));

document.write(createButton1("reset", "Reset",
		'setV("script ./scripts/reset.spt")', 0, "specialbutton"));

document.write(createButton1("Console", "Console", 'setV("console")', 0,
		"specialbutton"));

document.write(createButton("NewWindow", "New window", "newAppletWindow()", 0));

document
		.write(createButton("viewfile", "File content", "printFileContent()", 0));

document.write(createButton1("saveState", 'Save state', 'saveCurrentState()',
		0, "savebutton"));

document.write(createButton1("restoreState", 'Restore state',
		'reloadCurrentState()', 0, "savebutton"));

document
		.write(createButton("Feedback", 'Feedback', 'newAppletWindowFeed()', 0));
