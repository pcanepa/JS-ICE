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

function createButton(name, text, onclick, disab) {
	var s = "<INPUT TYPE='BUTTON'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='button'";
	if (disab) {
		s += "DISABLED "
	}
	s += "OnClick='" + onclick + "'> ";
	return s;
}

//This includes the class
function createButton1(name, text, onclick, disab, style) {
	var s = "<INPUT TYPE='BUTTON'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='" + style + "'";
	if (disab) {
		s += "DISABLED "
	}
	s += "OnClick='" + onclick + "'> ";
	return s;
}

//This includes the style
function createButton2(name, text, onclick, disab, style) {
	var s = "<INPUT TYPE='BUTTON'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "style='" + style + "'";
	s += "CLASS='button'";
	if (disab) {
		s += "DISABLED "
	}
	s += "OnClick='" + onclick + "'> ";
	return s;
}

function createText(name, text, onclick, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='text'";
	if (disab) {
		s += "DISABLED "
	}
	s += "OnChange='" + onclick + "'> ";
	return s;
}
function createCheck(name, text, onclick, disab, def, value) {
	var s = "<INPUT TYPE='CHECKBOX' ";
	s += " NAME='" + name + "' ";
	s += " ID='" + name + "' ";
	s += " VALUE='" + value + "' ";
	s += " CLASS='checkbox'";
	if (def) {
		s += " CHECKED "
	}
	if (disab) {
		s += " DISABLED "
	}
	s += "OnClick='" + onclick + "'> ";
	s += text;
	// var i=tabForm.length;
	// tabForm[i]=new formItem();
	// tabForm[i].Id=name;
	// tabForm[i].def=def;
	return s;
}
function createRadio(name, text, onclick, disab, def, id, value) {
	var s = "<INPUT TYPE='RADIO' ";
	s += " NAME='" + name + "' ";
	s += " ID='" + id + "' ";
	s += " VALUE='" + value + "'";
	s += " CLASS='checkbox'";
	if (def) {
		s += " CHECKED "
	}
	if (disab) {
		s += " DISABLED "
	}
	s += "OnClick='" + onclick + "'> ";
	s += text;
	// var i=tabForm.length;
	// tabForm[i]=new formItem();
	// tabForm[i].Id=id;
	// tabForm[i].def=def;
	return s;
}

function createList(name, onclick, disab, size, optionN, optionValue,
		optionText, optionCheck) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='select'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnChange='" + onclick + "'>";
	for ( var n = 0; n < optionN; n++) {
		s += "<OPTION VALUE='" + optionValue[n] + "'";
		if (optionCheck[n] == 1) {
			s += "checked";
		}
		;
		s += ">";
		s += optionText[n];
		s += "</OPTION>";
	}
	s += "</SELECT>";
	return s;
}

function createListFunc(name, onclick, onkey, disab, size, optionN,
		optionValue, optionText, optionCheck) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='select'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnChange='" + onclick + "' ";
	s += "OnKeypress='" + onkey + "'>";
	for ( var n = 0; n < optionN; n++) {
		s += "<OPTION VALUE='" + optionValue[n] + "'";
		if (optionCheck[n] == 1) {
			s += "checked";
		}
		;
		s += ">";
		s += optionText[n];
		s += "</OPTION>";
	}
	s += "</SELECT>";
	return s;
}

function createList2(name, onclick, disab, size) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='select'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnChange='" + onclick + "'>";
	s += "</SELECT>";
	return s;
}

function createListKey(name, onclick, onkey, disab, size) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='select'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnKeypress='" + onkey + "' ";
	s += "OnChange='" + onclick + "'>";
	s += "</SELECT>";
	return s;
}

function createListElement(name, onclick, onkey, disab, size) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='select'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnKeypress='" + onkey + "' ";
	s += "OnChange='" + onclick + "'>";
	s += "<option value=0>select</option>";
	s += "</SELECT>";
	return s;
}

function createTextArea(name, text, rows, cols, disab) {
	var s = "<TEXTAREA ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='text'";
	if (disab) {
		s += "DISABLED "
	}
	s += " ROWS=" + rows + " ";
	s += " COLS=" + cols + " >";
	s += text;
	s += "</TEXTAREA> ";
	return s;
}

function createText2(name, text, size, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='text'";
	if (disab) {
		s += "DISABLED "
	}
	s += "SIZE=" + size + "> ";
	return s;
}

function createTextSpectrum(name, text, size, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "style='background-color:6a86c4;'"
	if (disab) {
		s += "DISABLED ";
	}
	s += "SIZE=" + size + "> ";
	return s;
}

function createText3(name, text, value, onchange, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='text'";
	s += "onChange='" + onchange + "'";
	if (disab) {
		s += "DISABLED "
	}
	s += "> ";
	return s;
}

function createText4(name, text, size, value, onchange, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='text'";
	s += "SIZE=" + size;
	s += "onChange='" + onchange + "'";
	if (disab) {
		s += "DISABLED "
	}
	s += "> ";
	return s;
}

function createText5(name, text, size, value, onchange, disab) {
	var s = "<INPUT TYPE='TEXT'";
	s += "NAME='" + name + "' ";
	s += "VALUE='" + text + "' ";
	s += "ID='" + name + "' ";
	s += "CLASS='textwhite'";
	s += "SIZE=" + size;
	s += "onChange='" + onchange + "'";
	if (disab) {
		s += "DISABLED "
	}
	s += "> ";
	return s;
}

function createDiv(name, style) {
	var s = "<DIV ";
	s += "NAME='" + name + "'";
	s += "ID='" + name + "'";
	s += "STYLE='" + style + "'>";
	return s;
}

function createLine(color, style) {
	var s = "<HR ";
	s += "COLOR='#D8E4F8' "
	s += "STYLE='" + style + "' >";
	return s;
}

function createListmenu(name, onclick, disab, size, optionN, optionValue,
		optionText, optionCheck) {
	var s = "<SELECT ";
	s += "NAME='" + name + "' ";
	s += "ID='" + name + "' ";
	s += "SIZE='" + size + "' ";
	s += " CLASS='selectmenu'";
	s += " resizable='yes'";
	if (disab) {
		s += "DISABLED ";
	}
	s += "OnChange='" + onclick + "'>";
	for ( var n = 0; n < optionN; n++) {
		s += "<OPTION VALUE='" + optionValue[n] + "'";
		if (optionCheck[n] == 1) {
			s += "checked";
		}
		;
		s += ">";
		s += optionText[n];
		s += "</OPTION>";
	}
	s += "</SELECT>";
	return s;
}
