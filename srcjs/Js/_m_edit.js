function enterEdit() {
	
}

function exitEdit() {
}

function showPickPlaneCallback() {
	var distance = prompt('Enter the distance (in \305) within you want to select atoms. \n Positive values mean from the upper face on, negative ones the opposite.', '1');
	if (distance != null && distance != "") {
		runJmolScriptWait('select within(' + distance + ',plane,$plane1)');
//		hideMode = " hide selected";
//		deleteMode = " delete selected";
//		colorWhat = "color atoms";
	}
}


var deleteMode = "";
var hideMode = "";
var displayMode = "";

var firstTimeEdit = true;
function enterEdit() {
	// BH 2018: Disabled -- unexpected behavior should not be on tab entry
//	if (firstTimeEdit) {
//		radiiConnectSlider.setValue(50);
//		runJmolScriptWait("set forceAutoBond ON; set bondMode AND");
//	}
//	getbyID("radiiConnectMsg").innerHTML = " " + 2.5 + " &#197";
//	setTimeout("runJmolScriptWait(\"restore BONDS bondEdit\");", 400);
//	firstTimeEdit = false;
}


function applyConnect(r) {
	if (firstTime) {
		runJmolScriptWait("connect (*) (*) DELETE; connect 2.0 (*) (*) single ModifyOrCreate;");
	} else {
		var flagBond = checkBoxX("allBondconnect");
		// alert(flagBond);
		// alert(frameNum);
		if (frameNum == null || frameNum == '') {
			getUnitcell("1");
			frameNum = 1.1;
		} else {

		}
		if (flagBond == 'off') {
			runJmolScriptWait("select " + frameNum
					+ "; connect  (selected) (selected)  DELETE");
			runJmolScriptWait("connect " + r
					+ " (selected) (selected) single ModifyOrCreate;");
		} else {
			runJmolScriptWait("connect (*) (*) DELETE; connect " + r
					+ " (*) (*) single ModifyOrCreate;");
		}
		runJmolScriptWait("save BONDS bondEdit");
	}
	getbyID('radiiConnectMsg').innerHTML = " " + r.toPrecision(2) + " &#197";
}

function deleteAtom() {
	runJmolScriptWait(deleteMode);
	runJmolScriptWait('draw off');
}

function hideAtom() {
	runJmolScriptWait(hideMode);
	runJmolScriptWait('draw off');
}

function connectAtom() {
	var styleBond = getValue("setBondFashion");
	if (styleBond == "select") {
		errorMsg("Please select type of bond!");
		return false;
	}

	if (radbondVal == "all") {
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				errorMsg("Please, check values entered in the textboxes");
				return false;
			}
			// alert(bondRadFrom)
			runJmolScriptWait("connect (all) (all) DELETE; connect " + bondRadFrom
					+ " (all) (all) " + styleBond + " ModifyOrCreate;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				errorMsg("Please, check values entered in the textboxes.");
				return false;
			}
			if (bondRadTo <= bondRadFrom) {
				errorMsg("Please, check the range value entered.");
				return false;
			}
			runJmolScriptWait("connect (all) (all) DELETE; connect " + bondRadFrom + " "
					+ bondRadTo + " (all) (all) " + styleBond
					+ " ModifyOrCreate;");
		}
	} else if (radbondVal == "atom") {
		var atomFrom = getValue("connectbyElementList");
		var atomTo = getValue("connectbyElementListone");
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				errorMsg("Please, check values entered in the textboxes");
				return false;
			}
			// alert(bondRadFrom)
			runJmolScriptWait("connect (" + atomFrom + ") (" + atomTo + ") DELETE; connect "
					+ bondRadFrom + " (" + atomFrom + ") (" + atomTo + ") "
					+ styleBond + " ModifyOrCreate;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				errorMsg("Please, check values entered in the textboxes.");
				return false;
			}
			if (bondRadTo <= bondRadFrom) {
				errorMsg("Please, check the range value entered.");
				return false;
			}
			runJmolScriptWait("connect (" + atomFrom + ") (" + atomTo + ") DELETE; connect "
					+ bondRadFrom + " " + bondRadTo + " (" + atomFrom + ") ("
					+ atomTo + ") " + styleBond + " ModifyOrCreate;");
		}

	} else if (radbondVal == "selection") {
		runJmolScriptWait("connect (selected) (selected) " + styleBond + " ModifyOrCreate;");
	}
}

function deleteBond() {
	var styleBond = getValue("setBondFashion");

	if (radbondVal == "all") {
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				runJmolScriptWait("connect (all) (all)  DELETE;");
				return false;
			}
			// alert(bondRadFrom)
			runJmolScriptWait("connect " + bondRadFrom + " (all) (all)  DELETE;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				runJmolScriptWait("connect (all) (all)  DELETE;");
				return false;
			}
			runJmolScriptWait("connect " + bondRadFrom + " " + bondRadTo
					+ " (all) (all)  DELETE;");
		}
	} else if (radbondVal == "atom") {
		var atomFrom = getValue("connectbyElementList");
		var atomTo = getValue("connectbyElementListone");
		if (radBondRange == "just") {
			var bondRadFrom = getValue("radiuscoonectFrom");
			if (bondRadFrom == "") {
				runJmolScriptWait("connect (" + atomFrom + ") (" + atomTo + ") DELETE;");
				return false;
			}
			// alert(bondRadFrom)
			runJmolScriptWait(" connect " + bondRadFrom + " (" + atomFrom + ") (" + atomTo
					+ ") DELETE;");
		} else {
			var bondRadFrom = getValue("radiuscoonectFrom");
			var bondRadTo = getValue("radiuscoonectTo");
			if (bondRadFrom == "" && bondRadTo == "") {
				runJmolScriptWait("connect (" + atomFrom + ") (" + atomTo + ") DELETE;");
				return false;
			}
			runJmolScriptWait("connect " + bondRadFrom + " " + bondRadTo + " (" + atomFrom
					+ ") (" + atomTo + ") DELETE;");
		}

	} else if (radbondVal == "selection") {
		runJmolScriptWait("connect (selected) (selected) " + styleBond + " DELETE;");
	}
}

var radbondVal;
function checkBondStatus(radval) {
	runJmolScriptWait("select *; halos off; label off; select none;");
	radbondVal = radval;
	if (radbondVal == "selection") {
		for (var i = 0; i < document.editGroup.range.length; i++)
			document.editGroup.range[i].disabled = true;
		runJmolScriptWait('showSelections TRUE; select none; set picking identify; halos on;');
		getbyID("connectbyElementList").disabled = true;
		getbyID("connectbyElementListone").disabled = true;
	} else {
		for (var i = 0; i < document.editGroup.range.length; i++)
			document.editGroup.range[i].disabled = false;

		getbyID("radiuscoonectFrom").disabled = true;
		getbyID("radiuscoonectTo").disabled = true;
		getbyID("connectbyElementList").disabled = true;
		getbyID("connectbyElementListone").disabled = true;

		if (radbondVal == "atom") {
			getbyID("connectbyElementList").disabled = false;
			getbyID("connectbyElementListone").disabled = false;
		}
	}

}

var radBondRange;
function checkWhithin(radVal) {
	radBondRange = radVal;
	if (radBondRange == "just") {
		getbyID("radiuscoonectFrom").disabled = false;
		getbyID("radiuscoonectTo").disabled = true;
	} else {
		getbyID("radiuscoonectFrom").disabled = false;
		getbyID("radiuscoonectTo").disabled = false;
	}

}

//Fix .AtomName
function changeElement(value) {
	var script = '{selected}.element = "' + value + '";'
	+'{selected}.ionic = "' + value + '";'
	+'label "%e";font label 16;draw off';
	runJmolScriptWait(script);
	updateElementLists();
}

function elementSelectedDelete(element) {
	selectElement(element);
	deleteMode = "delete _" + element;
	return deleteMode;
}

function elementSelectedHide(element) {
	selectElement(element);
	hideMode = "hide _" + element;
	return hideMode;
}

//function elementSelectedDisplay(element) {
//	selectElement(element);
//	displayMode = "display _" + element;
//	return displayMode;
//}

function selectElement(element) {
	runJmolScriptWait("select _" + element + ";selectionhalos on");

}

function selectAll() {
	runJmolScriptWait("select *;halos on;");
}

//function selectAllDelete() {
//	selectAll();
//	// BH: REALLY?
//	runJmolScriptWait("select *; halos on; label on;");
//	deleteMode = "select *; delete; select none ; halos off; draw off;";
//	return deleteMode;
//}
//
//function selectAllHide() {
//	runJmolScriptWait("select *; halos on; label on;");
//	hideMode = "select *; hide selected; select none; halos off; draw off;";
//	return hideMode;
//}



function createEditGrp() {
	var bondValue = new Array("select", "single", "partial", "hbond", "double",
			"aromatic", "partialDouble", "triple", "partialTriple",
	"parialTriple2");
	var strEdit = "<form autocomplete='nope'  id='editGroup' name='editGroup' style='display:none'>";
	strEdit += "<table class='contents'><tr><td > \n";
	strEdit += "<h2>Edit structure</h2>\n";
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td>\n";
	strEdit += "Select atom/s by:\n";
	strEdit += "</td><tr>\n";
	strEdit += "<tr><td colspan='2'>";
	strEdit += "by element "
		+ createSelect2(
				"deletebyElementList",
				"elementSelectedDelete(value) + elementSelectedHide(value) ",
				false, 1) + "\n";
	// strEdit += "&nbsp;by atom &nbsp;"
	// + createSelect2('deltebyAtomList',
	// 'atomSelectedDelete(value) + atomSelectedHide(value) ', '',
	// 1) + "\n";
	//strEdit += createCheck("byselection", "by picking &nbsp;",
	//		'setPickingDelete(this) + setPickingHide(this)', 0, 0, "");
//	;
//	strEdit += createCheck("bydistance", "within a sphere (&#197); &nbsp;",
//			'setDistanceHide(this)', 0, 0, "");
	strEdit += "</td></tr><tr><td colspan='2'>\n"
		strEdit += createCheck("byplane", "within a plane &nbsp;",
				'onClickPickPlane(this,editPickPlaneCallback)', 0, 0, "");
	strEdit += "</td></tr><tr><td colspan='2'>\n";
	strEdit += createButton('edit_selectAll', 'select All',
			'selectAll()', '')
			+ "\n";
	strEdit += createButton('unselect', 'unselect All',
			'runJmolScriptWait("select *; halos off; label off")', '')
			+ "\n";
	strEdit += createButton('halooff', 'Halo/s off',
			'runJmolScriptWait("halos off; selectionhalos off" )', '')
			+ "\n";
	strEdit += createButton('label All', 'Label All',
			'runJmolScriptWait("select *; label on")', '')
			+ "\n";
	strEdit += createButton('label off', 'Label off',
			'runJmolScriptWait("select *; label off")', '')
			+ "\n";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += "Rename atom/s<br>";
	strEdit += "Element Name ";
	strEdit += createSelect('renameEle', 'changeElement(value)', 0, 1,
			eleSymb);
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += "Remove / hide atom/s <br>";
	strEdit += createButton('Delete atom', 'Delete atom/s', 'deleteAtom()', '')
	+ "\n";
	strEdit += createButton('Hide atom/s', 'Hide atom/s', 'hideAtom()', '')
	+ "\n";
	strEdit += createButton('Display atom', 'Display hidden atom/s',
			'runJmolScriptWait("select hidden; display")', '')
			+ "\n";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "<tr><td >";
	strEdit += "Connectivity</a>";
	strEdit += "</td><td>";
	strEdit += createSlider("radiiConnect");
	strEdit += '<br>'
		+ createCheck('allBondconnect', 'apply to all structures', '', 0,
				1, '');
	strEdit += "</td></tr>";
	strEdit += "<tr><td colspan='2'>\n";
	strEdit += createButton('advanceEdit', '+',
			'toggleDivValue(true,"advanceEditDiv",this)', '')
			+ " Advanced options <br>"
			strEdit += "<div id='advanceEditDiv' style='display:none; margin-top:20px'>";
	strEdit += "Connect by:\n";
	strEdit += createRadio("connect", "selection", 'checkBondStatus(value)', 0,
			0, "connect", "selection");
	strEdit += createRadio("connect", "by element", 'checkBondStatus(value)',
			0, 0, "connect", "atom");
	strEdit += createRadio("connect", "all", 'checkBondStatus(value)', 0, 0,
			"connect", "all")
			+ "<br>\n";
	strEdit += "From " + createSelect2("connectbyElementList", "", false, 1) + " ";
	strEdit += "To " + createSelect2("connectbyElementListone", "", false, 1)
	+ "<br>\n";
	strEdit += "Mode "
		+ createRadio("range", "whithin", 'checkWhithin(value)', 'disab',
				0, "range", "just");
	strEdit += createRadio("range", "whithin a range", 'checkWhithin(value)',
			'disab', 0, "range", "range")
			+ "<br>\n";
	strEdit += "From / whithin "
		+ createText2("radiuscoonectFrom", "", "2", "disab") + " ";
	strEdit += " to " + createText2("radiuscoonectTo", "", "2", "disab")
	+ " &#197;";
	strEdit += "<br> Style bond "
		+ createSelect('setBondFashion', '', 0, 1, bondValue) + "<br> \n";
	strEdit += createButton('connect2', 'Connect atom', 'connectAtom()', '');
	strEdit += createButton('connect0', 'Delete bond', 'deleteBond()', '')
	+ "<br>\n";
	strEdit += "</div>";
	strEdit += createLine('blue', '');
	strEdit += "</td></tr>\n";
	strEdit += "</table></FORM>\n";
	return strEdit;
}
