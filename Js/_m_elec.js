function enterElec() {
//	saveOrientation_e();
}

function exitElec() {
}


function setColorMulliken(value) {
	runJmolScriptWait('set propertyColorScheme "' + value + '";select *;font label 18; color {*} property partialCharge; label %5.3P');
}



//function exitMenu() {
//runJmolScriptWait('label off; select off');
//}

function removeCharges() {
}
// BH TODO - need to clear this without reloading
//runJmolScriptWait('script scripts/reload.spt');
//restoreOrientation_e();



function createElecpropGrp() {

	var colSchemeName = new Array("Rainbow (default)", "Black & White",
			"Blue-White-Red", "Red-Green", "Green-Blue");
	var colSchemeValue = new Array('roygb', 'bw', 'bwr', 'low', 'high');
	var strElec = "<form autocomplete='nope' style='display:none' id='elecGroup' name='elecGroup'";
	strElec += "<table class='contents'><tr><td ><h2>Electronic - Magnetic properties</h2> \n";
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += "Mulliken population analysis\n <br>";
	strElec += createButton("mulliken", "view Mulliken",
			'runJmolScriptWait("script scripts/mulliken.spt")', 0);
	strElec += "<br> Colour-scheme "
		+ createSelect('chergeColorScheme', 'setColorMulliken(value)', 0, 0,
				colSchemeValue, colSchemeName)
				+ "&nbsp<br>";
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += "Spin arrangment\n <br>";
	strElec += createButton("spin", "view Spin",
			'runJmolScriptWait("script scripts/spin.spt")', 0);
	strElec += " ";
	strElec += createButton("magnetiMoment", "view Magnetic Moment",
			'runJmolScript("script scripts/spin.spt")', 0);
	strElec += "<br> View only atoms with spin "
		+ createButton("spindown", "&#8595",
				'runJmolScriptWait("display property_spin <= 0")', 0);
	strElec += createButton("spinup", "&#8593",
			'runJmolScriptWait("display property_spin >= 0")', 0);
	// strElec+=createButton("magneticMoment","magn. Moment",'',0);
	//strElec += "</td></tr>\n";
	//strElec += "<tr><td>\n";
	strElec += createLine('blue', '');
	strElec += createButton("Removeall", "Remove", 'removeCharges()', 0);
	strElec += "</td></tr>\n";
	strElec += "<tr><td>\n";
	strElec += createLine('blue', '');
	strElec += "</td></tr>\n";
	strElec += "</table></form> \n";
	return strElec;
}





