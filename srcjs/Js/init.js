createApplet = function() {
	Jmol.Info || (Jmol.Info = {});
	Jmol.Info.serverUrl = "https://chemapps.stolaf.edu/jmol/jsmol/php/jmol.php"
	jmolSetAppletColor("white");
	jmolApplet(
			[ "570", "570" ],
			"script scripts/init.spt;"
			+ getCallbackSettings()
			+ ";script scripts/reset.spt;"
			);
}

resetPage = function() {
	runJmolScript("script ./scripts/reset.spt");
	grpDisp(MENU_FILE);
}
