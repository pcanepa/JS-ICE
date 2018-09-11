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

// BH: This was a duplicate method
////This function reloads the previously saved state after a positive
//function restoreState() {
//	runJmolScriptWait('restore ORIENTATION orienta; restore STATE status;');
//	// BH 2018 note: we might need runJomlScript here -- it will block while loading
//}

////This just saves the orientation of the structure for the E&M module
//function saveOrientation_e() {
//	runJmolScriptWait("save ORIENTATION oriente;");
//}
//
//function restoreOrientation_e() {
//	runJmolScriptWait('restore ORIENTATION oriente');
//}
//
