
function setVacuum() {
	switch (typeSystem) {
	case "slab":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		if (fractionalCoord == true) {
			runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; ( i.z +'
					+ factor + ') /' + newcell + ')');
		} else {
			runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +'
					+ factor + ')');
		}
		fromfractionaltoCartesian(null, null, newcCell, null, 90, 90);
		break;
	case "polymer":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + "  \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.y = for(i;' + _frame.frameSelection + '; i.y +' + factor
				+ ')');
		fromfractionaltoCartesian(null, newcCell, newcCell, 90, 90, 90);
		break;
	case "molecule":
		vaccum = prompt("Please enter the vacuum thickness (\305).", "");
		(vaccum == "") ? (errorMsg("Vacuum not entered!"))
				: (messageMsg("Vacuum set to: " + vaccum + " \305."));

		var zMaxCoord = parseFloat(jmolEvaluate(_frame.frameSelection + '.fz.max'));
		vaccum = parseFloat(vaccum);
		newcCell = (zMaxCoord * 2) + vaccum;
		var factor = roundNumber(zMaxCoord + vaccum);
		runJmolScriptWait(_frame.frameSelection + '.z = for(i;' + _frame.frameSelection + '; i.z +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.y = for(i;' + _frame.frameSelection + '; i.y +' + factor
				+ ')');
		runJmolScriptWait(_frame.frameSelection + '.x = for(i;' + _frame.frameSelection + '; i.x +' + factor
				+ ')');
		fromfractionaltoCartesian(newcCell, newcCell, newcCell, 90, 90, 90);
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
		aCell = aparam;
	if (bparam != null)
		bCell = bparam;
	if (cparam != null)
		cCell = cparam;
	if (alphaparam != null)
		alpha = alphaparam;
	if (betaparam != null)
		beta = betaparam;
	if (gammaparam != null)
		gamma = gammaparam;
	// formula repeated from
	// http://en.wikipedia.org/wiki/Fractional_coordinates
	var v = Math.sqrt(1
			- (Math.cos(alpha * _conversion.radiant) * Math.cos(alpha * _conversion.radiant))
			- (Math.cos(beta * _conversion.radiant) * Math.cos(beta * _conversion.radiant))
			- (Math.cos(gamma * _conversion.radiant) * Math.cos(gamma * _conversion.radiant))
			+ 2
			* (Math.cos(alpha * _conversion.radiant) * Math.cos(beta * _conversion.radiant) * Math
					.cos(gamma * _conversion.radiant)));
	xx = aCell * Math.sin(beta * _conversion.radiant);
	xy = parseFloat(0.000);
	xz = aCell * Math.cos(beta * _conversion.radiant);
	yx = bCell
	* (((Math.cos(gamma * _conversion.radiant)) - ((Math.cos(beta * _conversion.radiant)) * (Math
			.cos(alpha * _conversion.radiant)))) / Math.sin(beta * _conversion.radiant));
	yy = bCell * (v / Math.sin(beta * _conversion.radiant));
	yz = bCell * Math.cos(alpha * _conversion.radiant);
	zx = parseFloat(0.000);
	zy = parseFloat(0.000);
	zz = cCell;
	return [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]];

}

