function setPicking(form) {
	if (form.checked) {
		runJmolScriptWait('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom;halos on; ');
		atomColor = "color atom";
	} else {
		runJmolScriptWait('select none;');
	}
	return atomColor;
}

function setPickingDelete(form) {
	runJmolScriptWait("select none; halos off;" +
			"draw off; showSelections TRUE; select none; set picking off;" +
			"set PickCallback OFF");
	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			runJmolScriptWait('set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		} else {
			runJmolScriptWait('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;');
			deleteMode = "delete selected";
		}
	}
	if (!form.checked)
		runJmolScriptWait('select none; halos off; label off;');
	return deleteMode;
}

function setPickingHide(form) {
	runJmolScriptWait("select none; halos off;" +
			"draw off; showSelections TRUE; select none; set picking off;" +
			"set PickCallback OFF");

	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			runJmolScriptWait('showSelections TRUE; set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		} else {
			runJmolScriptWait('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on; ');
		}
		hideMode = " hide selected";
	} else {
		runJmolScriptWait('select none; halos off; label off;');
	}
	return hideMode;
}


/*
 * display within(0,plane,@{plane({atomno=3}, {0 0 0}, {0 1/2 1/2})})
 * 
 * The parametric equation ax + by + cz + d = 0 is expressed as {a b c d}.
 * 
 * Planes based on draw and isosurface objects are first defined with an ID
 * indicated, for example:
 * 
 * draw plane1 (atomno=1) (atomno=2) (atomno=3)
 * 
 * After that, the reference $plane1 can be used anywhere a plane expression is
 * required. For instance,
 * 
 * select within(0,plane, $plane1)
 */

var counterClick = false;
var counterHide = 0;
var selectedatomPlane = new Array(3);
var sortquestion = null
function setPlanehide(form) {
	if (form == null)
		sortquestion = true;

	if (form.checked) {
		messageMsg('Now select in sequence 3 atoms to define the plane.');
		selectedatomPlane = [];
		counterHide = 0;
		counterClick = true;
		setPickingCallbackFunction(pickPlanecallback);
		runJmolScriptWait("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;");
		if (form != null)
			uncheckBox(form);
	} else {
		runJmolScriptWait('select none; halos off;draw off; showSelections TRUE; select none; set picking off;');
	}
}

function setPlanedued(form) {
	if (form == null)
		sortquestion = true;
	messageMsg('Now select in sequence 3 atoms to define the plane.');
	selectedatomPlane = [];
	counterHide = 0;
	counterClick = true;
	setPickingCallbackFunction(pickPlane2dcallback);
	runJmolScriptWait("draw off; showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;");
}

var selectHideForm = null;
function setDistancehidehide(form) {
	selectHideForm = form;
	if (form.checked) {
		messageMsg('Now select the central atom around which you want to select atoms.');
		counterClick = true;
		setPickingCallbackFunction(pickDistancecallback);
		runJmolScriptWait("showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom; halos on;");
		// messageMsg('If you don\'t want to remove/hide atoms in the plane,
		// unselect them by using the option: select by picking.')
	} else {
		runJmolScriptWait('select none; halos off;');
	}
}

function pickPlanecallback(b, c, d, e) {
	if (counterClick == true) {
		selectedatomPlane[counterHide] = parseInt(b.substring(
				b.indexOf('#') + 1, b.indexOf('.') - 2));
		messageMsg('Atom selected: ' + selectedatomPlane[counterHide] + '.');

		if (counterHide == '2') {
			counterClick = false;
			runJmolScriptWait('draw on; draw plane1 (atomno=' + selectedatomPlane[0]
			+ ') (atomno=' + selectedatomPlane[1] + ') (atomno='
			+ selectedatomPlane[2] + ');');
			if (!sortquestion) {
				var distance = prompt('Now enter the distance (in \305) within you want to select atoms. \n Positive values mean from the upper face on, negative ones the opposite.');
				if (distance != null && distance != "") {
					runJmolScriptWait('select within(' + distance + ',plane, $plane1)');
					hideMode = " hide selected";
					deleteMode = " delete selected";
					atomColor = "color atoms";
					runJmolScriptWait('set PickCallback OFF');
					counterClick = false;
					return true;
				}
			}
			runJmolScriptWait('select none; halos off;'
					+"draw off; showSelections TRUE; select none; set picking off;"
					+"set picking OFF");
		}

		messageMsg('Select next atom.');
		counterHide++;
	}
}

function pickPlane2dcallback(b, c, d, e) {
	if (counterClick == true) {
		selectedatomPlane[counterHide] = parseInt(b.substring(
				b.indexOf('#') + 1, b.indexOf('.') - 2));
		messageMsg('Atom selected: ' + selectedatomPlane[counterHide] + '.');

		if (counterHide == '2') {
			counterClick = false;
			runJmolScriptWait('draw on; draw plane1 (atomno=' + selectedatomPlane[0]
			+ ') (atomno=' + selectedatomPlane[1] + ') (atomno='
			+ selectedatomPlane[2] + ');set picking OFF');
			var spin = confirm("Now would you only like to slice the density? OK for yes, Cancel if you wish to map SPIN or potential on top.")
			if (spin) {
				dueD_con = true;
				dueD_planeMiller = false;
				runJmolScript('draw off;isosurface ID "isosurface1" select ({0:47}) PLANE $plane1 MAP color range 0.0 2.0 "?.CUBE";set pickCallback ""');
			} else {
				messageMsg("Now load the *.CUBE potential / spin file.");
				runJmolScript("draw off;isosurface PLANE $plane1 MAP '?.CUBE';set pickCallback ''");
			}
			return true;
		}
		messageMsg('Select next atom.');
		counterHide++;
	}
}

function pickDistancecallback(b, c, d, e) {
	if (counterClick == true) {
		var coordinate = b
		.substring(b.indexOf('#') + 2, b.lastIndexOf('.') + 9);
		messageMsg('Atom selected: ' + coordinate + '.');
		var distance = prompt('Now enter the distance (in \305) within you want to select atoms.');
		if (distance != null && distance != "") {
			runJmolScriptWait('select within(' + distance + ',{' + coordinate
					+ ' }); draw sphere1 width ' + distance + '  { '
					+ coordinate + '} translucent;set pickCallback OFF');
			// messageMsg('If you don\'t want to remove/hide the atom used for
			// the
			// selection, unselect it by using the option: select by picking.')
			hideMode = " hide selected";
			deleteMode = " delete selected";
			atomColor = "color atoms";
			counterClick = false;
			uncheckBox(selectHideForm);
			return true;
		}
	}

}

