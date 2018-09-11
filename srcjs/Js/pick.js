function setPicking(form) {
	if (form.checked) {
		runJmolScriptWait('showSelections TRUE; select none; set picking on; set picking LABEL; set picking SELECT atom;halos on; ');
		colorWhat = "color atom";
	} else {
		runJmolScriptWait('select none;');
	}
	return colorWhat;
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
var selectedAtoms = [];
var sortquestion = null;
var selectCheckbox = null;
var menuCallback = null;

function onClickPickPlane(checkbox, callback) {
	menuCallback = callback;
	selectCheckbox = checkbox;
	if (checkbox.checked) {
		selectPlane();
	} else {
		runJmolScriptWait('select none; halos off;draw off; showSelections TRUE; select none; set picking off;');
	}
}

function selectPlane() {
	var miller = prompt("In order to extract a 2D map from a 3D file you need to select a plane. \n" +
			" If you want to select a Miller plane, enter the plane's Miller indices here. \n" +
			" If you want to pick three atoms to define the plane, clear the indices.").trim();
	if (miller === null)
		return;
	if (miller) {
		runJmolScriptWait('draw delete; draw plane1 HKL {' + miller + '};draw off;');
		menuCallback && menuCallback();
		return true;			
	} else {
		runJmolScriptWait("draw off; showSelections TRUE; select none; set picking on; set picking SELECT atom; halos on;");
		messageMsg('Select in sequence three atoms to define the plane.');
		startPicking();
	}
}

function startPicking() {
	selectedAtoms = [];
	counterHide = 0;
	counterClick = true;
	setPickingCallbackFunction(pickPlaneCallback);
}

function cancelPicking() {
	setPickingCallbackFunction(null);
	counterClick = false;
	runJmolScriptWait('select none; halos off;'
			+"draw off; showSelections TRUE; select none; set picking OFF;");
	if (selectCheckbox)
		uncheckBox(selectCheckbox);
}

function setDistanceHide(checkbox) {
	selectCheckbox = checkbox;
	if (checkbox.checked) {
		setStatus('Select the central atom around which you want to select atoms.');
		counterClick = true;
		setPickingCallbackFunction(pickDistanceCallback);
		runJmolScriptWait("showSelections TRUE; select none; set picking on; set picking SELECT atom; halos on;");
	} else {
		runJmolScriptWait('select none; halos off;');
	}
}

function pickPlaneCallback(b, c, d, e) {
	console.log(arguments);
	if (counterClick) {
		selectedAtoms[counterHide] = parseInt(b.substring(
				b.indexOf('#') + 1, b.indexOf('.') - 2));
		setStatus('Atom selected: ' + selectedAtoms[counterHide] + '.');
		if (++counterHide == 3) {
			counterClick = false;
			cancelPicking();
			runJmolScriptWait('draw delete; draw plane1 (atomno=' + selectedAtoms[0]
				+ ') (atomno=' + selectedAtoms[1] + ') (atomno='
				+ selectedAtoms[2] + ');draw off;');
			menuCallback && menuCallback();
			return true;			
		}
		setStatus('Select next atom.');
	}
}

function pickDistanceCallback(b, c, d, e) {
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
			colorWhat = "color atoms";
			cancelPicking();
			return true;
		}
	}

}

