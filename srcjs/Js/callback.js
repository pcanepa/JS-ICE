// BH 2018

_callback = {
	fPick : null
}

getCallbackSettings = function() {
//	return  "set messageCallback 'myMessageCallback';" +
	return	"set errorCallback 'myErrorCallback';" +
			"set loadStructCallback 'myLoadStructCallback';" +
			"set measureCallback 'myMeasurementCallback';" +
			"set pickCallback 'myPickCallback';" +
			"set minimizationCallback 'myMinimizationCallback';"
}

function myMeasuramentCallback(app, msg, type, state, value) {
	// BH 2018
	if (state == "measurePicked")
		setMeasureText(msg);
}

myLoadStructCallback = function(applet,filePath,c,d) {
	if (filePath)
		file_loadedCallback(filePath);
}

myErrorCallback = function(applet, b, msg, d) {
	errorMsg(msg);
}



setPickingCallbackFunction = function(f) {
	_callback.fPick = f;
}

myPickCallback = function(applet, b, c, d) {
	_callback.fPick && _callback.fPick(b,c,d);
}

setMinimizationCallbackFunction = function(f) {
	_fileData.fMinim = f;
}

myMinimizationCallback = function(applet,b,c,d) {
	_fileData.fMinim && _fileData.fMinim(b, c, d);
}

