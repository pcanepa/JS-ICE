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
LOADING_MODE_PLOT_ENERGIES = 1;
LOADING_MODE_PLOT_GRADIENT = 2;
LOADING_MODE_PLOT_FREQUENCIES = 3;

loadingMode = LOADING_MODE_NONE;

setLoadingMode = function(mode) {
	loadingMode = mode;	
}

myLoadStructCallback = function(applet,b,c,d) {
	switch(loadingMode) {
	case LOADING_MODE_PLOT_ENERGIES:
		plotEnergies(b,c,d);
		setLoadingMode(LOADING_MODE_PLOT_GRADIENT);
		break;
	case LOADING_MODE_PLOT_GRADIENT:
		plotGradient(b,c,d);
		break;
	case LOADING_MODE_PLOT_FREQUENCIES:
		plotFrequencies(b,c,d);
		break;
	default:
	case LOADING_MODE_NONE:
		switch(messageMode) {
		case MESSAGE_MODE_SAVE_ISO:
			messageMode = MESSAGE_MODE_NONE;
			saveIsoMessageCallback(lastIsoMsg);
			break;
		}

		// run xxxDone() if it exists, otherwise just loadDone()
		var type = jmolEvaluate("_fileType").toLowerCase();
		postLoad(type);
		if (window[type+"Done"])
			window[type+"Done"]();
		else
			loadDone();
	}
	loadingMode = LOADING_MODE_NONE;
}

loadDone = function(fDone) {
	setV("echo");
	fDone && fDone();
	setName();
	setTitleEcho();
}

MESSAGE_MODE_NONE                    = 0;
MESSAGE_MODE_SAVE_ISO               = 101;

messageMode = MESSAGE_MODE_NONE;
lastIsoMsg = null;

setMessageMode = function(mode) {
	messageMode = mode;
	switch(messageMode) {
	case MESSAGE_MODE_SAVE_ISO:
		lastIsoMsg = mode;
		break;
	}
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

