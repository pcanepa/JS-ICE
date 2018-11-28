function enterPolyhedra() {
	
}
function exitPolyhedra() {
}

function createPolyedra() {

	var vertNo, from, to, distance, style, selected, face;
	vertNo = getValue("polyEdge");
	from = getValue('polybyElementList');
	to = getValue("poly2byElementList");
	style = getValue("polyVert");
	face =  getValue("polyFace");
	if (face.equals("0.0") && !style.equals("collapsed"))
		face = "";
	runJmolScriptWait("polyhedra DELETE");

	// if( from == to){
	// errorMsg("Use a different atom as Vertex");
	// return false;
	// }

	distance = getValue("polyDistance");

	if (distance == "") {
		runJmolScriptWait("polyhedra 4, 6" + face + " " + style);
		return;
	}

	/*
	 * if(isChecked("byselectionPoly")){ runJmolScriptWait("polyhedra " + vertNo + " BOND { "+
	 * selected +" } faceCenterOffset " + face + " " + style); }
	 */

	if (isChecked("centralPoly")) {
		runJmolScriptWait("polyhedra BOND " + "{ " + from + " } " + face
				+ " " + style);
	} else {

		if (isChecked("bondPoly")) {
			runJmolScriptWait("polyhedra " + vertNo + " BOND " + face + " "
					+ style);		}
		if (isChecked("bondPoly1")) {
			runJmolScriptWait("polyhedra " + vertNo + " " + distance + " (" + from + ") to "
					+ "(" + to + ") " + face + " " + style);
		}

	}

}

function checkPolyValue(value) {
	(value == "collapsed") ? (makeEnable("polyFace"))
			: (makeDisable("polyFace"));
}

function setPolyString(value) {
	runJmolScriptWait("polyhedra 4, 6" + "  faceCenterOffset " + face + " " + value);
}

function setPolybyPicking(element) {
	setPicking(element);
	checkBoxStatus(element, 'polybyElementList');
	checkBoxStatus(element, "poly2byElementList");
}


function createPolyGrp() {
	var polyEdgeName = new Array("select", "4, 6", "4 ", "6", "8", "10", "12");
	var polyStyleName = new Array("select", "flat", "collapsed edges",
			"no edges", "edges", "frontedges");
	var polyStyleValue = new Array("NOEDGES", "noedges", "collapsed",
			"noedges", "edges", "frontedges");
	var polyFaceName = new Array("0.0", "0.25", "0.5", "0.9", "1.2");
	var strPoly = "<form autocomplete='nope'  id='polyGroup' name='polyGroup' style='display:none'>\n";
	strPoly += "<table class='contents'>\n";
	strPoly += "<tr><td>\n";
	strPoly += "<h2>Polyhedron</h2>\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "Make polyhedra: \n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td  colspan='2'>\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp;a) Select central atom:  <br>\n";
	strPoly += "&nbsp;&nbsp;  by element "
		+ createSelect2('polybyElementList', "", false, 0);
	// strPoly+=createCheck("byselectionPoly", "&nbsp;by picking &nbsp;",
	// 'setPolybyPicking(this)', 0, 0, "set picking") + "<br>\n";
	strPoly += "<br>&nbsp;&nbsp;just central atom"
		+ createCheck("centralPoly", "",
				'checkBoxStatus(this, "poly2byElementList")', 0, 0, "");
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp; b) select vertex atoms:  <br>\n";
	strPoly += "&nbsp;&nbsp;  by element "
		+ createSelect2('poly2byElementList', "", false, 0) + "\n";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp; c) based on <br>";
	strPoly += "&nbsp;"
		+ createRadio("bondPoly", "bond", 'makeDisable("polyDistance") ',
				0, 0, "bondPoly", "off");
	strPoly += createRadio("bondPoly", " max distance ",
			' makeEnable("polyDistance")', 0, 0, "bondPoly1", "on");
	strPoly += createText2("polyDistance", "2.0", "3", "") + " &#197;";
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "&nbsp;d) number of vertex "
		+ createSelect('polyEdge', '', 0, 0, polyEdgeName) + "\n";
	strPoly += createLine('blue', '');
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += "Polyedra style:<br>\n";
	strPoly += "</td></tr><tr><td > &nbsp;a) colour polyhedra\n";
	strPoly += createButton("polyColor", "Default colour",
			'runJmolScriptWait("set defaultColors Jmol")', 0);
	strPoly += "</td><td align='left'><script>\n";
	strPoly += "jmolColorPickerBox([setColorWhat,'polyhedra'],'','polyColorPicker');";
	strPoly += "</script> </td></tr>";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += createButton('advancePoly', '+',
			'toggleDivValue(true,"advancePolyDiv",this)', '')
			+ " Advanced style options"
			strPoly += "<div id='advancePolyDiv' style='display:none; margin-top:20px'>"
				strPoly += "<br> &nbsp;b)"
					+ createRadio("polyFashion", "opaque",
							'runJmolScriptWait("color polyhedra opaque") ', 0, 1, "opaque", "opaque")
							+ "\n";
	strPoly += createRadio("polyFashion", "translucent",
			'runJmolScriptWait("color polyhedra translucent") ', 0, 0, "translucent",
	"translucent")
	+ "\n<br><br>";
	strPoly += "&nbsp;c) style edges\n"
		+ createSelect('polyVert', 'checkPolyValue(this.value)', 0, 0,
				polyStyleValue, polyStyleName) + "\n";
	strPoly += "<br>"
		strPoly += "&nbsp;&nbsp;collapsed faces Offset \n"
			+ createSelect('polyFace', '', 0, 0, polyFaceName) + "\n";
	strPoly += "</div>";
	strPoly += createLine('blue', '');
	strPoly += "</td></tr>\n";
	strPoly += "<tr><td colspan='2'>\n";
	strPoly += createButton('createPoly', 'create', 'createPolyedra()', '');
	strPoly += createButton('createpoly', 'create auto',
			'runJmolScriptWait("polyhedra 4,6 " + getValue("polyVert"))', '');
	strPoly += createButton('deletePoly', 'delete', 'runJmolScriptWait("polyhedra DELETE")',
	'');
	strPoly += "</td></tr>\n";
	strPoly += "</table>\n";
	strPoly += "</FORM>\n";
	return strPoly;
}

