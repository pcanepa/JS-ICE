// BH 2018

LOADING_MODE_NONE = 0;
LOADING_MODE_PLOT_ENERGIES = 1;
LOADING_MODE_PLOT_GRADIENT = 2;
LOADING_MODE_PLOT_FREQUENCIES = 3;

loadingMode = LOADING_MODE_NONE;

setLoadingMode = function(mode) {
	loadingMode = mode;	
}

myLoadStructCallback = function(applet,b,c,d) {
	switch(loadingMode) {
	case LOADING_MODE_NONE:
		break;
	case LOADING_MODE_PLOT_ENERGIES:
		plotEnergies();
		setLoadingMode(LOADING_MODE_PLOT_GRADIENT);
		break;
	case LOADING_MODE_PLOT_GRADIENT:
		plotGradient();
		break;
	case LOADING_MODE_PLOT_FREQUENCIES:
		plotFrequencies();
		break;
	}
}

MESSAGE_MODE_NONE                    = 0;
MESSAGE_MODE_CRYSTAL_DONE            = 1;
MESSAGE_MODE_CRYSTAL_SAVE_SPACEGROUP = 2;
MESSAGE_MODE_CASTEP_DONE             = 3;
MESSAGE_MODE_DMOL_DONE               = 4;
MESSAGE_MODE_GULP_DONE               = 5;
MESSAGE_MODE_MOLDEN_DONE             = 6;
MESSAGE_MODE_VASP_OUTCAR_DONE        = 7;
MESSAGE_MODE_VASP_XML_DONE           = 8;
MESSAGE_MODE_QESPRESSO_DONE          = 9;
MESSAGE_MODE_GAUSSIAN_DONE           = 10;
MESSAGE_MODE_GROMACS_DONE            = 11;

messageMode = MESSAGE_MODE_NONE;

setMessageMode = function(mode) {
	messageMode = mode;
}

myMessageCallback = function (applet, msg) {
	switch(mode) {
	case MESSAGE_MODE_CRYSTAL_DONE:
		crystalDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_CRYSTAL_SAVE_SPACEGROUP:
		crystalSaveSpacegroupCallback(msg);
		break;
	case MESSAGE_MODE_CASTEP_DONE:
		castepDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_DMOL_DONE:
		dmolDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_GAUSSIAN_DONE:
		gaussianDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_GROMACS_DONE:
		gromacsDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_MOLDEN_DONE:
		moldenDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_QESPRESSO_DONE:
		qespressoDoneMessageCallback(msg);
		break;			
	case MESSAGE_MODE_VASP_OUTCAR_DONE:
		vaspOutcarDoneMessageCallback(msg);
		break;
	case MESSAGE_MODE_VASP_XML_DONE:
		vaspXmlDoneMessageCallback(msg);
		break;
	}
}

loadDone = function(fDone) {
	setV("echo");
	fDone();
	setName();
	setTitleEcho();
}

myErrorCallback = function(applet, b, msg, d) {
	errorMsg(msg);
}
