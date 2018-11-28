
function setVacuum() {
	switch (typeSystem) {
	case "slab":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		if (fractionalCoord == true) {
			runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; ( i.z +'
					+ factor + ') /' + newcell + ')');
		} else {
			runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +'
					+ factor + ')');
		}
		fromfractionaltoCartesian(null, null, new_cell.c, null, 90, 90);
		break;
	case "polymer":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + "  \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.y = for(i;' + _frame.frameSelection + '; i.y +' + factor
				+ ')');
		fromfractionaltoCartesian(null, new_cell.c, new_cell.c, 90, 90, 90);
		break;
	case "molecule":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		new_cell.c = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.y = for(i;' + _frame.frameSelection + '; i.y +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.x = for(i;' + _frame.frameSelection + '; i.x +' + factor
				+ ')');
		fromfractionaltoCartesian(new_cell.c, new_cell.c, new_cell.c, 90, 90, 90);
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
		_cell.a = aparam;
	if (bparam != null)
		_cell.b = bparam;
	if (cparam != null)
		_cell.c = cparam;
	if (alphaparam != null)
		_cell.alpha = alphaparam;
	if (betaparam != null)
		_fileData.cell.beta = betaparam;
	if (gammaparam != null)
		_cell.gamma = gammaparam;
	// formula repeated from
	// http://en.wikipedia.org/wiki/Fractional_coordinates
	var v = Math.sqrt(1
			- (Math.cos(_cell.alpha * _conversion.radiant) * Math.cos(_cell.alpha * _conversion.radiant))
			- (Math.cos(_fileData.cell.beta * _conversion.radiant) * Math.cos(_fileData.cell.beta * _conversion.radiant))
			- (Math.cos(_cell.gamma * _conversion.radiant) * Math.cos(_cell.gamma * _conversion.radiant))
			+ 2
			* (Math.cos(_cell.alpha * _conversion.radiant) * Math.cos(_fileData.cell.beta * _conversion.radiant) * Math
					.cos(_cell.gamma * _conversion.radiant)));
	xx = _cell.a * Math.sin(_fileData.cell.beta * _conversion.radiant);
	xy = parseFloat(0.000);
	xz = _cell.a * Math.cos(_fileData.cell.beta * _conversion.radiant);
	yx = _cell.b
	* (((Math.cos(_cell.gamma * _conversion.radiant)) - ((Math.cos(_fileData.cell.beta * _conversion.radiant)) * (Math
			.cos(_cell.alpha * _conversion.radiant)))) / Math.sin(_fileData.cell.beta * _conversion.radiant));
	yy = _cell.b * (v / Math.sin(_fileData.cell.beta * _conversion.radiant));
	yz = _cell.b * Math.cos(_cell.alpha * _conversion.radiant);
	zx = parseFloat(0.000);
	zy = parseFloat(0.000);
	zz = _cell.c;
	return [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]];

}

