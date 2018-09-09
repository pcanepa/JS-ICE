function enterOptimize() {
	plotEnergies();		
}


function saveFrame() {
	messageMsg("This is to save frame by frame your geometry optimization.");
	var value = checkBoxX("saveFrames");
	if (value == "on")
		runJmolScriptWait('write frames {*} "fileName.jpg"');
}

