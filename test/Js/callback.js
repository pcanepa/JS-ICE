// BH 2018

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
	if (!filePath)
		return;
	// run xxxDone() if it exists, otherwise just loadDone()
	var type = jmolEvaluate("_fileType").toLowerCase();
	postLoad(type, filePath);
}

myErrorCallback = function(applet, b, msg, d) {
	errorMsg(msg);
}

var fPick = null;

setPickingCallbackFunction = function(f) {
	fPick = f;
}

myPickCallback = function(applet, b, c, d) {
	fPick && fPick(b,c,d);
}

fMinim = null;
setMinimizationCallbackFunction = function(f) {
	fMinim = f;
}

myMinimizationCallback = function(applet,b,c,d) {
	fMinim && fMinim(b, c, d);
}

