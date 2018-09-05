createApplet = function() {
	jmolSetAppletColor("white");
	jmolApplet(
			[ "570", "570" ],
			"script scripts/init.spt;"
			+ getCallbackSettings()
			+ ";load 'output/hematite.out' PACKED;");
}

