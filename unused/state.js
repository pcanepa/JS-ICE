//This function saves the current state of Jmol applet
//function saveState() {
//	// BH: Actually, this method was saving the state, then 
//	// reloading the model twice, once in reloadFastModels, and once in restore state.
//	// It was called from the message callback "SAVED"
//	// from refresh() when the Optimize Geometry tab was clicked
//	// and from refreshFreq() when the Spectra tab was clicked
//	// which 
//	runJmolScriptWait("save ORIENTATION orienta; save STATE status;");
//	reloadFastModels();
//	restoreStateAndOrientation_a();
//}

function saveCurrentState() {
	warningMsg("This option only the state temporarily. To save your work, use File...Export...image+state(PNGJ). The image created can be dragged back into Jmol or JSmol or sent to a colleague to reproduce the current state exactly as it appears in the image.");
	runJmolScriptWait('save ORIENTATION orask; save STATE stask; save BOND bask');
}

function reloadCurrentState() {
	runJmolScriptWait('restore ORIENTATION orask; restore STATE stask; restore BOND bask;');
}


function saveStateAndOrientation_a() {
	runJmolScriptWait("save ORIENTATION orienta; save STATE status;");
}

function restoreStateAndOrientation_a() {
	runJmolScriptWait("restore ORIENTATION orienta; restore STATE status;");
}

// BH: This was a duplicate method
////This function reloads the previously saved state after a positive
//function restoreState() {
//	runJmolScriptWait('restore ORIENTATION orienta; restore STATE status;');
//	// BH 2018 note: we might need runJomlScript here -- it will block while loading
//}

//This just saves the orientation of the structure
function saveOrientation_e() {
	runJmolScriptWait("save ORIENTATION oriente;");
}

function restoreOrientation_e() {
	runJmolScriptWait('restore ORIENTATION oriente');
}

