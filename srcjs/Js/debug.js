debugSay = function(script) {
	// the debug area at the bottom of each tab
	var div = getbyID("debugdiv");
	var area = getbyID("debugarea");
	if (script === null) {
		script = "";
	} else {
		console.log(script);
		if (isChecked("debugMode")) {
			div.style.display = "block";
			script = area.value + script + "\n";
		} else {
			div.style.display = "none";
			script = "";
		}
	}
	area.value = script;
	area.scrollTop = area.scrollHeight;
}

debugShowCommands = function(isOn) {
	getbyID("debugdiv").style.display = (isOn ? "block" : "none");
}

debugShowHistory = function() {
 	debugSay(jmolEvaluate("show('history')"));
}

addCommandBox = function() {
	// see debug.js
	return "<div id='debugpanel'><hr>"
		+ createCheck("debugMode", "Show Commands", "debugShowCommands(this.checked)", 0,
			0, "")
		+ "&nbsp;" + createButton("removeText", "Clear", 'debugShowCommands(true);debugSay(null)', 0)
		+ "&nbsp;" + createButton("getHelp", "History", 'debugShowCommands(true);debugShowHistory()', 0)
		+ "&nbsp;" + createButton("getHelp", "Help", 'runJmolScriptWait("help")', 0)
		+ "&nbsp;" + createButton("openConsole", "Console", 'runJmolScriptWait("console")', 0)
		+ "<br>\n"
		+ "<div id='debugdiv' style='display:none'>"
		+ "<input type='text' style='font-size:12pt;width:350px' value='' placeHolder='type a command here' onKeydown='event.keyCode === 13&&$(this).select()&&runJmolScriptWait(value)'/>" 
		+ "<br><textarea id='debugarea' style='font-size:12pt;width:350px;height:150px;font-family:monospace;overflow-y:auto'></textarea>" 
		+ "</div></div>"
}


