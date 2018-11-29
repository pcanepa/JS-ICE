
function setVacuum() {
	switch (typeSystem) {
	case "slab":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_fileData.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_fileData.cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		if (fractionalCoord == true) {
			runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; ( i.z +'
					+ factor + ') /' + newcell + ')');
		} else {
			runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; i.z +'
					+ factor + ')');
		}
		fromfractionaltoCartesian(null, null, new_fileData.cell.c, null, 90, 90);
		break;
	case "polymer":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + "  \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_fileData.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_fileData.cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_fileData.frameSelection + '.y = for(i;' + _fileData.frameSelection + '; i.y +' + factor
				+ ')');
		fromfractionaltoCartesian(null, new_fileData.cell.c, new_fileData.cell.c, 90, 90, 90);
		break;
	case "molecule":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_fileData.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_fileData.cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_fileData.frameSelection + '.z = for(i;' + _fileData.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_fileData.frameSelection + '.y = for(i;' + _fileData.frameSelection + '; i.y +' + factor
				+ ')');
		runJmolScriptWait(_fileData.frameSelection + '.x = for(i;' + _fileData.frameSelection + '; i.x +' + factor
				+ ')');
		fromfractionaltoCartesian(new_fileData.cell.c, new_fileData.cell.c, new_fileData.cell.c, 90, 90, 90);
		break;

	}
}

function fromfractionaltoCartesian(aparam, bparam, cparam, alphaparam,
		betaparam, gammaparam) {
	//From fractional to Cartesian -- returns a 3x3 matrix
	var xx, xy, xz, 
	    yx, yy, yz, 
	    zx, zy, zz;
	if (aparam != null)
		_fileData.cell.a = aparam;
	if (bparam != null)
		_fileData.cell.b = bparam;
	if (cparam != null)
		_fileData.cell.c = cparam;
	if (alphaparam != null)
		_fileData.cell.alpha = alphaparam;
	if (betaparam != null)
		_fileData.cell.beta = betaparam;
	if (gammaparam != null)
		_fileData.cell.gamma = gammaparam;
	// formula repeated from
	// http://en.wikipedia.org/wiki/Fractional_coordinates
	var v = Math.sqrt(1
			- (Math.cos(_fileData.cell.alpha * _conversion.radiant) * Math.cos(_fileData.cell.alpha * _conversion.radiant))
			- (Math.cos(_fileData.cell.beta * _conversion.radiant) * Math.cos(_fileData.cell.beta * _conversion.radiant))
			- (Math.cos(_fileData.cell.gamma * _conversion.radiant) * Math.cos(_fileData.cell.gamma * _conversion.radiant))
			+ 2
			* (Math.cos(_fileData.cell.alpha * _conversion.radiant) * Math.cos(_fileData.cell.beta * _conversion.radiant) * Math
					.cos(_fileData.cell.gamma * _conversion.radiant)));
	xx = _fileData.cell.a * Math.sin(_fileData.cell.beta * _conversion.radiant);
	xy = parseFloat(0.000);
	xz = _fileData.cell.a * Math.cos(_fileData.cell.beta * _conversion.radiant);
	yx = _fileData.cell.b
	* (((Math.cos(_fileData.cell.gamma * _conversion.radiant)) - ((Math.cos(_fileData.cell.beta * _conversion.radiant)) * (Math
			.cos(_fileData.cell.alpha * _conversion.radiant)))) / Math.sin(_fileData.cell.beta * _conversion.radiant));
	yy = _fileData.cell.b * (v / Math.sin(_fileData.cell.beta * _conversion.radiant));
	yz = _fileData.cell.b * Math.cos(_fileData.cell.alpha * _conversion.radiant);
	zx = parseFloat(0.000);
	zy = parseFloat(0.000);
	zz = _fileData.cell.c;
	return [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]];

}

