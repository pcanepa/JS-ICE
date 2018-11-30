function setFrameValues(i) {
	if (i == null || i == "") {
		_fileData.frameSelection = "{1.1}";
		_fileData.frameNum = "1.1";
		_fileData.frameValue = 1;
	} else {
		_fileData.frameSelection = "{1." + i + "}";
		_fileData.frameNum = "1." + i;
		_fileData.frameValue = i;
	}
}

function showFrame(model) {
	//BH: Java comment: This shows a frame once clicked on the lateral list
	runJmolScriptWait("frame " + model);
	setFrameValues(model);
	getUnitcell(model);
}
