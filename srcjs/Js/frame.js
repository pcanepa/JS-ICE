function setFrameValues(i) {
	if (i == null || i == "") {
		_file.frameSelection = "{1.1}";
		_file.frameNum = "1.1";
		_file.frameValue = 1;
	} else {
		_file.frameSelection = "{1." + i + "}";
		_file.frameNum = "1." + i;
		_file.frameValue = i;
	}
}

function showFrame(model) {
	//BH: Java comment: This shows a frame once clicked on the lateral list
	runJmolScriptWait("frame " + model);
	setFrameValues(model);
	getUnitcell(model);
}
