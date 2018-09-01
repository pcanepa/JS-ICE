createApplet = function() {
	jmolSetAppletColor("white");
	jmolApplet(
			[ "570", "570" ],
			"load 'output/hematite.out' PACKED; script scripts/init.spt; set messageCallback 'myMessageCryCallback';message CRYDONE");
}

