function createPolyedra() {

	var vertNo, from, to, distance, style, selected, face;
	vertNo = getValue("polyEdge");
	from = getValue("polybyElementList");
	to = getValue("poly2byElementList");
	style = getValue("polyVert");
	face =  getValue("polyFace");
	if (face.equals("0.0") && !style.equals("collapsed"))
		face = "";
	setV("polyhedra DELETE");

	// if( from == to){
	// errorMsg("Use a different atom as Vertex");
	// return false;
	// }

	distance = getValue("polyDistance");

	if (distance == "") {
		setV("polyhedra 4, 6" + face + " " + style);
		return;
	}

	/*
	 * if(checkID("byselectionPoly")){ setV("polyhedra " + vertNo + " BOND { "+
	 * selected +" } faceCenterOffset " + face + " " + style); }
	 */

	if (checkID("centralPoly")) {
		setV("polyhedra BOND " + "{ " + from + " } " + face
				+ " " + style);
	} else {

		if (checkID("bondPoly")) {
			setV("polyhedra " + vertNo + " BOND " + face + " "
					+ style);		}
		if (checkID("bondPoly1")) {
			setV("polyhedra " + vertNo + " " + distance + " (" + from + ") to "
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
	checkBoxStatus(element, "polybyElementList");
	checkBoxStatus(element, "poly2byElementList");
}
