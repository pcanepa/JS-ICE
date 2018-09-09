// BH 2018

getCallbackSettings = function() {
	return  "set messageCallback 'myMessageCallback';" +
			"set errorCallback 'myErrorCallback';" +
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

LOADING_MODE_NONE = 0;

loadingMode = LOADING_MODE_NONE;

setLoadingMode = function(mode) {
	loadingMode = mode;	
}

myLoadStructCallback = function(applet,b,c,d) {
	// run xxxDone() if it exists, otherwise just loadDone()
	var type = jmolEvaluate("_fileType").toLowerCase();
	postLoad(type);
	if (window[type+"Done"])
		window[type+"Done"]();
	else
		loadDone();
}

loadDone = function(fDone) {
	runJmolScriptWait("echo");
	fDone && fDone();
	setName();
	setTitleEcho();
}

MESSAGE_MODE_NONE                   = 0;
MESSAGE_MODE_SAVE_ISO               = 101;

lastIsoMsg = null;

setMessageMode = function(mode) {
	switch(mode) {
	case MESSAGE_MODE_SAVE_ISO:
		saveIsoMessageCallback(lastIsoMsg);
		break;
	}
	messageMode = MESSAGE_MODE_NONE;
}

myMessageCallback = function (applet, msg) {
}

myErrorCallback = function(applet, b, msg, d) {
	errorMsg(msg);
}

fPick = null;

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

