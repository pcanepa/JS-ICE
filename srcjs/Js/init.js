createApplet = function() {
	jmolSetAppletColor("white");
	setMessageMode(MESSAGE_MODE_CRYSTAL_DONE);
	jmolApplet(
			[ "570", "570" ],
			"script scripts/init.spt;set messageCallback 'myMessageCallback';set errorCallback 'myErrorCallback';set loadStructCallback 'myLoadStructCallback';"
			+ "load 'output/hematite.out' PACKED; message CRYDONE");
}

