_pick = {
	pickingEnabled 	: false,
	counterHide 	: 0,
	selectedAtoms	: [],
	sortquestion 	: null,
	selectCheckbox 	: null,
	menuCallback 	: null,
	colorWhat		: "color atom" 
}

function setPicking(form) {
	if (form.checked) {
		runJmolScriptWait('showSelections TRUE; select none;halos on; ');
		_pick.colorWhat = "color atom";
	} else {
		runJmolScriptWait('select none;');
	}
	return _pick.colorWhat;
}

function setPickingDelete(form) {
	runJmolScriptWait("select none; halos off;" +
			"draw off; showSelections TRUE; select none;");
	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			runJmolScriptWait('halos on; ');
		} else {
			runJmolScriptWait('showSelections TRUE; halos on;');
			_edit.deleteMode = "delete selected";
		}
	}
	if (!form.checked)
		runJmolScriptWait('select none; halos off;');
	return _edit.deleteMode;
}

function setPickingHide(form) {
	runJmolScriptWait("select none; halos off;" +
			"draw off; showSelections TRUE; select none;");

	var plane = checkBoxX('byplane');
	var sphere = checkBoxX('bydistance');
	if (form.checked) {
		if (plane == 'on' || sphere == 'on') {
			runJmolScriptWait('showSelections TRUE; halos on; ');
		} else {
			runJmolScriptWait('showSelections TRUE; select none; halos on; ');
		}
		_edit.hideMode = " hide selected";
	} else {
		runJmolScriptWait('select none; halos off; label off;');
	}
	return _edit.hideMode;
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


function onClickPickPlane(checkbox, callback) {
	_pick.menuCallback = callback;
	_pick.selectCheckbox = checkbox;
	if (!checkbox || checkbox.checked) {
		selectPlane();
	} else {
		runJmolScriptWait('select none; halos off;draw off; showSelections TRUE; select none;');
	}
}

function selectPlane() {
	var miller = prompt("In order to extract a 2D map from a 3D file you need to select a plane. \n" +
			" If you want to select a Miller plane, enter three Miller indices here. \n" +
			" If you want to pick three atoms to define the plane, leave this blank.", "").trim();
	if (miller === null)
		return;
	if (miller) {
		runJmolScriptWait('draw delete; draw plane1 HKL {' + miller + '};draw off;');
		_pick.menuCallback && _pick.menuCallback();
		return true;			
	} else {
		runJmolScriptWait("draw off; showSelections TRUE; select none; halos on;");
		messageMsg('Select in sequence three atoms to define the plane.');
		startPicking();
	}
}

function startPicking() {
	_pick.selectedAtoms = [];
	_pick.counterHide = 0;
	_pick.pickingEnabled = true;
	runJmolScriptWait("pickedlist = []");
	setPickingCallbackFunction(pickPlaneCallback);
}

function cancelPicking() {
	setPickingCallbackFunction(null);
	_pick.pickingEnabled = false;
	runJmolScriptWait("select none; halos off; draw off; showSelections TRUE; select none;");
	if (_pick.selectCheckbox)
		uncheckBox(_pick.selectCheckbox);
}

function setDistanceHide(checkbox) {
	_pick.selectCheckbox = checkbox;
	if (checkbox.checked) {
		setStatus('Select the central atom around which you want to select atoms.');
		_pick.pickingEnabled = true;
		setPickingCallbackFunction(pickDistanceCallback);
		runJmolScriptWait("showSelections TRUE; select none; halos on;");
	} else {
		runJmolScriptWait('select none; halos off;');
	}
}

function pickPlaneCallback() {
	if (_pick.pickingEnabled) {
		runJmolScriptWait("select pickedList");
		var picklist = Jmol.evaluateVar(jmolApplet0, "pickedlist");
		if (picklist.length < 3) {
			setStatus('Select another atom.');
			return false;
		}
		cancelPicking();
		runJmolScriptWait('draw delete; draw plane1 PLANE @pickedlist;draw off');
		_pick.menuCallback && _pick.menuCallback();
		return true;			
	}
}

function pickDistanceCallback() {
	if (_pick.pickingEnabled == true) {
		runJmolScriptWait("select picked");
		var distance = prompt('Enter the distance (in \305) within you want to select atoms.', '2.0');
		if (distance != null && distance != "") {
			runJmolScriptWait('select within(' + distance + ',picked); draw sphere1 width ' + distance + '  {picked} translucent;');
			_edit.hideMode = " hide selected";
			_edit.deleteMode = " delete selected";
			_pick.colorWhat = "color atoms";
			cancelPicking();
			return true;
		}
	}

}

