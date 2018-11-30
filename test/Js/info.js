
function extractInfoJmol(whatToExtract) {
	return jmolGetPropertyAsArray(whatToExtract);
}

function extractInfoJmolString(whatToExtract) {
	return jmolGetPropertyAsString(whatToExtract);
}

function getElementList(arr) {
	// BH 2018 using element.pivot.keys for easy array creation
	arr || (arr = []);
	var elements = Jmol.evaluateVar(jmolApplet0,"{*}.element.pivot.keys");
	for (var i = 0; i < elements.length; i++)
		arr.push(elements[i]);
	return arr;
}


