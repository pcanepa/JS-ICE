function enterShow() {
	if (firstTimeBond) {
		bondSlider.setValue(20);
		radiiSlider.setValue(22);
		getbyID('radiiMsg').innerHTML = 20 + " %";
		getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	}
	firstTimeBond = false;
}

function exitShow() {
}


var firstTimeBond = true;

var colorWhat = "";


function setColorWhat(rgb, colorscript) {
	var colorcmd = (colorscript[1] == "colorwhat" ? colorWhat : "color " + colorscript[1]);
	runJmolScriptWait(colorcmd + " " + rgb);// BH?? should be elsewhere + ";draw off");
}

function elementSelected(element) {
	selectElement(element);
	colorWhat = "color atom ";
	return colorWhat;
}

function applyTrans(t) {
	getbyID('transMsg').innerHTML = t + " %"
	runJmolScript("color " + getValueSel("setFashion") + " TRANSLUCENT " + (t/100));
}

function applyRadii(rpercent) {
	getbyID('radiiMsg').innerHTML = rpercent.toPrecision(2) + " %"
	runJmolScript("cpk " + rpercent + " %;");
}

function onClickCPK() {
	getbyID('radiiMsg').innerHTML = "100%";
	getbyID('bondMsg').innerHTML = 0.3 + " &#197";
	radiiSlider.setValue(100);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.30; spacefill 100% ;cartoon off;backbone off; draw off");
}

function onClickWire() {
	getbyID('radiiMsg').innerHTML = "0.0 %";
	getbyID('bondMsg').innerHTML = 0.01 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(1);
	// BH Q: why spacefill 1%?
	runJmolScript('wireframe 0.01; spacefill off;ellipsoids off;cartoon off;backbone off;');
}

function onClickIonic() {
	getbyID('radiiMsg').innerHTML = parseFloat(0).toPrecision(2) + " %";
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("spacefill IONIC; wireframe 0.15; draw off");
}

function onStickClick() {
	getbyID('radiiMsg').innerHTML = "1%";
	getbyID('bondMsg').innerHTML = 0.30 + " &#197";
	radiiSlider.setValue(0);
	bondSlider.setValue(30);
	runJmolScript("wireframe 0.15;spacefill 1%;cartoon off;backbone off; draw off");
}

function onClickBallAndStick() {
	getbyID('radiiMsg').innerHTML = "20%";
	getbyID('bondMsg').innerHTML = 0.20 + " &#197";
	radiiSlider.setValue(20);
	bondSlider.setValue(20);
	runJmolScript("wireframe 0.15; spacefill 20%;cartoon off;backbone off; draw off");

}

function onClickBall() {
	getbyID('radiiMsg').innerHTML = "20%";
	getbyID('bondMsg').innerHTML = 0.00 + " &#197";
	radiiSlider.setValue(20);
	bondSlider.setValue(0);
	runJmolScript("select *; spacefill 20%; wireframe off ; draw off");
}

