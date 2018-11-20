_frame = {
	frameSelection : null,
	frameNum : null,
	frameValue : null
}


function setFrameValues(i) {
	_frame.frameSelection = null;
	_frame.frameNum = null;
	_frame.frameValue = null;
	_frame.frameSelection = "{1." + i + "}";
	_frame.frameNum = "1." + i;
	_frame.frameValue = i;
	if (i == null || i == "") {
		_frame.frameSelection = "{1.1}";
		_frame.frameNum = "1.1";
		_frame.frameValue = 1;
	}
}

function showFrame(model) {
	//BH: Java comment: This shows a frame once clicked on the lateral list
	runJmolScriptWait("frame " + model);
	setFrameValues(model);
	getUnitcell(model);
}
