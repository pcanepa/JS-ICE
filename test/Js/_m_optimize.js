function enterOptimize() {
	plotEnergies();		
}

function exitOptimize() {
}

function doConvertPlotUnits(unitEnergy) {
	switch (unitEnergy) {
	case "h": // Hartree
		switch (_fileData.energyUnits) {
		case ENERGY_RYDBERG:
			convertGeomData(fromRydbergtohartree, "Hartree");
			break;
		case ENERGY_EV:
			convertGeomData(fromevToHartree, "Hartree");
			break;
		case ENERGY_HARTREE:
			convertGeomData(fromHartreetoHartree, "Hartree");
			break;
		}
		break;
	case "e": // eV
		switch (_fileData.energyUnits) {
		case ENERGY_RYDBERG:
			convertGeomData(fromRydbergtoEV, "eV");
			break;
		case ENERGY_EV:
			convertGeomData(fromevToev, "eV");
			break;
		case ENERGY_HARTREE:
			convertGeomData(fromHartreetoEv, "eV");
			break;
		}
		break;

	case "r": // Rydberg
		switch (_fileData.energyUnits) {
		case ENERGY_RYDBERG:
			convertGeomData(fromRydbergtorydberg, "Ry");
			break;
		case ENERGY_EV:
			convertGeomData(fromevTorydberg, "Ry");
			break;
		case ENERGY_HARTREE:
			convertGeomData(fromHartreetoRydberg, "Ry");
			break;
		}
		break;

	case "kj": // Kj/mol
			switch (_fileData.energyUnits) {
			case ENERGY_RYDBERG:
				convertGeomData(fromRydbergtoKj, "kJ/mol");
				break;
			case ENERGY_EV:
				convertGeomData(fromevTokJ, "kJ/mol");
				break;
			case ENERGY_HARTREE:
				convertGeomData(fromHartreetoKj, "kJ/mol");
				break;
			}
		break;

	case "kc": // Kcal*mol
		switch (_fileData.energyUnits) {
		case ENERGY_RYDBERG:
			convertGeomData(fromRydbergtokcalmol, "kcal/mol");
			break;
		case ENERGY_EV:
			convertGeomData(fromevTokcalmol, "kcal/mol");
			break;
		case ENERGY_HARTREE:
			convertGeomData(fromHartreetokcalmol, "kcal/mol");
			break;
		}
		break;
	}
}

function convertGeomData(f, toUnits) {
	
	var geom = getbyID('geom');
	if (geom != null)
		cleanList('geom');

	toUnits = " " + toUnits;
	
	var u = _fileData.unitGeomEnergy;
	switch (_fileData.energyUnits) {
	case ENERGY_RYDBERG:
		u = "R";
		break;
	case ENERGY_EV:
		u = "e";
		break;
	case ENERGY_HARTREE:
		u = "H";
		break;
//	case ENERGY_KJ_PER_MOLE:
//		u = "k";
//		break;
	}

	// The required value is the end of the string Energy = -123.456 Hartree.
	
	for (var i = (_fileData.hasInputModel ? 1 : 0); i < geomData.length; i++) {
		var data = _fileInfo.geomData[i];
		var val = f(data.substring(data.indexOf('=') + 1, 
				data.indexOf(u) - 1));
		addOption(geom, i + " E = " + val + toUnits, i + 1);
	}

}


//function saveFrame() {
// TODO: Not something we can do in JavaScript -- too many files, unless we zip them up (which we can do)
//	messageMsg("This is to save frame by frame your geometry optimization.");
//	var value = checkBoxX("saveFrames");
//	if (value == "on")
//		runJmolScriptWait('write frames {*} "fileName.jpg"');
//}

function createOptimizeGrp() {
	var vecAnimValue = new Array("", "set animationFps 5",
			"set animationFps 10", "set animationFps 15",
			"set animationFps 20", "set animationFps 25",
			"set animationFps 30", "set animationFps 35");
	var vecAnimText = new Array("select", "5", "10", "15", "20", "25", "30", "35");
	var vecUnitEnergyVal = new Array("h", "e", "r", "kj", "kc");
	var vecUnitEnergyText = new Array("Hartree", "eV", "Rydberg", "kJ*mol-1", "kcal*mol-1");

	var graphdiv = "<table><tr><td>&#916E (kJ/mol)<br>"
		  + createDiv("plotarea", "width:170px;height:180px;background-color:#EFEFEF;", "")
		  + "</td><td>Force<br>"
		  + createDiv("plotarea1", "width:170px;height:180px;background-color:#efefEF;","")
		  + "</td></tr></table>";

	var strGeom = "<form autocomplete='nope'  id='geometryGroup' name='modelsGeom' style='display:none'>";
	strGeom += "<table class='contents'><tr><td>";
	strGeom += "<h2>Geometry optimization</h2>\n";
	strGeom += "</td></tr>"
		strGeom += "<tr><td>\n";
	strGeom += createButton("<<", "<<",
			'runJmolScriptWait("model FIRST");  selectListItem(document.modelsGeom.models, "0")', 0)
			+ "\n";
	strGeom += createButton(">", ">", 'runJmolScriptWait("animation ON")'/* + selectFrame'*/, 0) + "\n";
	// BH: note that "selectFrame()" does not exist in the Java, either
	strGeom += createButton("||", "||", 'runJmolScriptWait("frame PAUSE")', 0) + "\n";
	strGeom += createButton(">>", ">>", 'runJmolScriptWait("model LAST")', 0) + "\n";
	strGeom += createButton(
			"loop",
			"loop",
			'runJmolScriptWait("frame REWIND; animation off;animation mode loop;animation on")',
			0)
			+ "\n";
	strGeom += createButton(
			"palindrome",
			"palindrome",
			'runJmolScriptWait("frame REWIND; animation off;  animation mode palindrome;animation on")',
			0)
			+ "\n";
	strGeom += "<br>"
		+ createSelect("framepersec", "runJmolScriptWait(value)", 0, 1, vecAnimValue,
				vecAnimText) + " _orient.motion speed | ";
// this is problematic in JavaScript -- too many files created
//	strGeom += createCheck('saveFrames', ' save video frames', 'saveFrame()',
//			0, 0, "");
	strGeom += "<br> Energy unit measure: ";
	strGeom += createSelect("unitMeasureEnergy", "doConvertPlotUnits(value)", 0, 1,
			vecUnitEnergyVal, vecUnitEnergyText);
	strGeom += "</td></tr><tr><td>";
	strGeom += "<select id='geom' name='models' onchange='showFrame(value)'  class='selectmodels' size='10'></select>";
	strGeom += "</td></tr><tr><td style='margin=0px; padding=0px;'>\n";	
	strGeom += graphdiv;
	strGeom += "</td></tr></table></form>\n";
	return strGeom;
}

