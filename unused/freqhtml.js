/*  J-ICE library 

    based on:
 *
 *  Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 *  Contact: pierocanepa@sourceforge.net
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307  USA.
 */

//Last Modified 5nd 03 2011
function createHTML() {
	var stringWebPage;

	initialMessages();
	createTitle();
	createAuthors();
	saveOutputFreq();
	saveOutputStatefreq();

	// <HTML>

	stringWebPage = 'var webpage = \" ' + createTag("HTML", "", "", false);

	// <HEAD>
	stringWebPage += createTag("HEAD", "", "", false);

	// <Title>
	stringWebPage += createTag("title", "", namePage, true);

	// Here goes the Java script tab
	// <script language="JavaScript" type="text/javascript">
	stringWebPage += "<script  src='jmol/Jmol.js'></script>\n";

	// / this defines the style
	stringWebPage += createTag("link",
			"rel=\'stylesheet\' href=\'style.css\' type=\'text\/css\'", "",
			false);

	// <style type="text/css">
	stringWebPage += createTag("style", "type='text/css'", "", false);

	stringWebPage += createSaveStyle();

	// </style>
	stringWebPage += closeTag("style");

	stringWebPage += "\n <script language='JavaScript'>";

	stringWebPage += "\n function activateVib(){ \n if(document.butopt.vibration.checked){ \n runJmolScript(\' select all;vibration On; vibration scale 7;\') \n}else{ runJmolScript(\' vibration off\') \n} \n\n }";
	stringWebPage += "\n function vectorsOn(){ \n if(document.butopt.vectors.checked){ \n runJmolScript(\' select all;vectors on;color vector yellow;vector scale 14;vector 0.08;\') \n} else{ runJmolScript(\'vector off\') \n} } \n\n";
	stringWebPage += "\n function cellOn(){ \n if(document.butopt.cell.checked){ \n runJmolScript(\' unitcell on \') \n} else{ runJmolScript(\'unitcell off\') \n} \n}\n\n";
	stringWebPage += "\n  function perspOn(){ \n if(document.butopt.persp.checked){ \n runJmolScript(\' set perspectiveDepth on \') \n} else{ runJmolScript(\'set perspectiveDepth off\') \n} \n} \n\n";
	stringWebPage += "\n function polyOn(){ \n  if(document.butopt.poly.checked){ \n runJmolScript(\' polyhedra on;\') \n} else{ \n runJmolScript(\' polyhedra off; \') \n } \n} \n\n";
	stringWebPage += "\n function persptraspOn(){ \n if(document.butopt.polytrans.checked){ \n runJmolScript(\'select *; color polyhedra translucent orange; \') \n }else{ \n runJmolScript(\'select *; color polyhedra opaque orange; \') \n  } \n } \n\n";
	stringWebPage += "\n function sbOn(){ \n  runJmolScript(\' wireframe 0.15;spacefill 20%;cartoon off;backbone off; draw off ;\')  \n} \n\n";
	stringWebPage += "\n function sOn(){ \n  runJmolScript(\' wireframe 0.15;spacefill 0%;cartoon off;backbone off; draw off ;\')  \n} \n\n";
	stringWebPage += "\n function bOn(){ \n  runJmolScript(\' select *; spacefill 20%; wireframe off ; draw of ;\')  \n} \n\n";
	stringWebPage += "\n function cpkOn(){ \n  runJmolScript(\' wireframe 0.30;spacefill 100%;cartoon off;backbone off; draw off\')  \n} \n\n";
	stringWebPage += "\n function wifiOn(){ \n if(document.butopt.wifi.checked){ \n runJmolScript(\'select *; wireframe .05;\') \n }else{ \n runJmolScript(\'select *; wireframe 0;\') \n  } \n } \n\n";
	// += "\n function bondOn(){ \n if(document.butopt.wifi.checked){ \n
	// runJmolScript(\'select *; wireframe .05;\') \n }else{ \n runJmolScript(\'select
	// *; wireframe 0;\') \n } \n } \n\n";
	stringWebPage += "\n function showFrame(i){ \n runJmolScript(\'frame \' + i); \n  runJmolScript('select all;vibration On; vibration scale 7;');}";
	stringWebPage += "\n </script>";
	// Close Head
	stringWebPage += closeTag("HEAD");

	// Open body
	stringWebPage += createTag("BODY", "", "", false);
	// ////////////Here goes the HTML content

	// / Create main <div> id whole
	stringWebPage += createTag("div", "id=\'whole\'", "", false);

	stringWebPage += createTag("div", "id=\'middle\'", "", false);

	stringWebPage += createTag("div", "class=\'title\'", "", false);
	stringWebPage += createTag("H2", "", authorPage, true);
	stringWebPage += createTag("H1", "", namePage, true);
	stringWebPage += closeTag("div");

	// div lateral frame
	stringWebPage += createTag("div", "class=\'leftframe\'", "", false);

	stringWebPage += "<form name='butopt'>";
	/*
	 * //<table> stringWebPage += createTag("table", "" , "", false)
	 * stringWebPage += createTag("tr", "", "", false); stringWebPage +=
	 * createTag("td", "", "", false);
	 */

	stringWebPage += closeTag("td");
	stringWebPage += createTag("td", "", "", false);
	stringWebPage += "<select id='vib' name='models' OnClick='showFrame(value)' class='selectmodels' size='15' style='width:280px; overflow: auto;'>";
	for (i = 0; i < freqData.length + 1; i++)
		if (freqData[i] != null || freqData[i] != ""
			|| freqData[i] == "undefined") {
			stringWebPage += createTag("option", "value='"
					+ (i + counterFreq + 1) + "' id='" + (i + counterFreq)
					+ "' name='" + (i + counterFreq + 1) + "'", freqData[i],
					true);
		}
	stringWebPage += "</select>";
	/*
	 * stringWebPage += closeTag("td"); stringWebPage += closeTag("tr");
	 * stringWebPage += closeTag("table");
	 */
	stringWebPage += "<br><br> ";
	stringWebPage += "Vibration <br>";

	stringWebPage += "<input type='checkbox' name='vibration'  checked  OnClick='activateVib()'>Animation";
	stringWebPage += "<input type='checkbox' name='vectors'  checked  OnClick='vectorsOn()'>Vectors <br>";
	stringWebPage += "<br>View <br>";
	stringWebPage += "<input type='checkbox' name='cell' checked   OnClick='cellOn()'>Cell";
	stringWebPage += "<input type='checkbox' name='persp'    OnClick='perspOn()'>Perspective <br>";
	stringWebPage += "<br>Polyhedron<br>";
	stringWebPage += "<input type='checkbox' name='poly'    OnClick='polyOn()'>active";
	stringWebPage += "<input type='checkbox' name='polytrans'    OnClick='persptraspOn()'>translucency <br>";
	stringWebPage += "<br>Atom and bond style<br>";
	stringWebPage += "<input type='button' name='sb'  value='S&B'  OnClick='sbOn()'> ";
	stringWebPage += "<input type='button' name='s' value='Stick'   OnClick='sOn()'> ";
	stringWebPage += "<input type='button' name='b' value='Ball'   OnClick='bOn()'> ";
	stringWebPage += "<input type='button' name='cpk' value='CPK'   OnClick='cpkOn()'> <br>";
	stringWebPage += "<input type='checkbox' name='wifi'    OnClick='wifiOn()'>Wireframe <br><br>";
	stringWebPage += " ";
	stringWebPage += "</form>";

	// close div lateral
	stringWebPage += closeTag("div");

	// create jmol tag
	stringWebPage += createTag("div", "class=\'japplet\' ", "", false);

	stringWebPage += "<script>"

		stringWebPage += '\n jmolInitialize\(\'.\', \'jmol/JmolAppletSigned0.jar\'\) ; \n'; // To
	// change
	// to
	// propper
	// java
	stringWebPage += '\njmolApplet\(\[ \'430\', \'430\'\],\'load output.dat; script current.spt; select all;vibration On; vibration scale 7; vectors on;color vector yellow;vector scale 14;vector 0.08;\'\) ; \n';

	// </script> jmol
	stringWebPage += closeTag("script");

	// close jmol tag
	stringWebPage += closeTag("div");

	// close middle tag
	stringWebPage += closeTag("div");

	// Close whole dive
	stringWebPage += closeTag("div");

	// //////////Here stops html
	// Close body
	stringWebPage += closeTag("BODY");
	// Close HTML </HTML>
	stringWebPage += closeTag("HTML");

	stringWebPage += '\"; write VAR webpage "?webpage.html"';
	// alert(stringWebPage)
	saveHtml(stringWebPage);

}

///Save the page
function saveHtml(stringWeb) {
	runJmolScript(stringWeb);
}

/// Example <title>kaolinite vibration modes</title>
//tagName = title

function createTag(tagName, tagOptions, tagCont, tagClosure) {
	var newTag;
	if (tagClosure) {
		newTag = " \n <" + tagName + " " + tagOptions + " >" + tagCont + "</"
		+ tagName + ">\n";
	} else {
		newTag = "\n <" + tagName + " " + tagOptions + ">\n"
	}

	return newTag;
}

function createTable(tableOptinos, tableClass, tagClose) {
	tagOptions = tableOptinos + " " + tableClass;
	if (tagClose) {
		createTag("Table", tagOptions, "", false);
	} else {
		closeTag("Table");
	}

}

function createRow(rowOptions, numColumn, colCont) {
	createTag("tr", rowOptions, "", false);
	for (i = 0; i < numColumn; i++) {
		createTag("td", "", colCont[i], true);
	}
	closeTag("tr")
}

function closeTag(tagName) {
	var oldTag = "\n </" + tagName + ">\n";
	return oldTag;
}

function initialMessages() {
	messageMsg("This function allows you to prepare HTML page showing frequencies. \n Follow the multi-step procedure!");
	messageMsg("Is it this one going to be the final look of your structure? \n Make sure it is.");
}

var namePage = "No title was given"
	function createTitle() {

	namePage = prompt("Please, enter the page title", " ");

	// /if(namePage == null)
	// /namePage = "No title was given"
}

var authorPage;
function createAuthors() {
	authorPage = prompt(
			"Please, enter Authors' names \n e.g.: E. Fermi, A. Einstein, etc.",
	"");
	authorPage = authorPage
	+ " "
	+ prompt(
			"Please, enter the pubblication details \n (e.g.:(1901), Annalen der Physik 4: 513.",
	"");

}

var outputNamefreq = null;
function saveOutputFreq() {
	messageMsg("Please save the output files as: output.dat. \n DON'T change its NAME");
	runJmolScript("write FILE ?output.dat");
}

function saveOutputStatefreq() {
	messageMsg("Now please save the file containing the style and orientation of your file; \n DON'T change its NAME");
	runJmolScript('write STATE LOCALPATH "." "current.spt"');
}

function createSaveStyle() {
	var styleStr;
	// messageMsg("Now save in the same directory of the index.html file. \n
	// Don't save its name.");
	styleStr = '*{ \n font-family: Arial, Helvetica, Verdana; \n font-size: 12px; \n} \n\n';
	styleStr += '#whole{ \n width: 800px; \n background-color: white; \n border:none; \n margin: 20px auto 20px auto; \n padding: 0px 20px 0 20px; \n } \n\n';
	styleStr += '#middle{ \n float:left; \n border: \n #E5E5E5 2px solid; width: 800px; \n } \n\n';
	styleStr += '.japplet {  \n border:none;  \n padding: 0px; \n margin: 0px; \n margin-left:370px; \n background-color: #fff; \n width:400px; } \n\n';
	styleStr += '.leftframe {  \n float:left; \n color:#3456f3; \n border:none; \n border-left:none; \n margin: 0px; \n min-height:400px; \n padding:10px; \n max-width:400px; \n} \n\n';
	styleStr += '.title{ \n margin-left:5px; padding:10px; \n } \n\n';
	styleStr += '.select, .selectmodels { \nborder: 1px solid #d8d8d8; \n padding: 0px; \n margin-top: 5px; \n overflow: hidden; \n } \n\n';
	styleStr += 'h1 { \n text-transform: uppercase; \n  color:black; font-family: Arial, Helvetica, Verdana; \n font-size: 16px;\n } \n\n';
	styleStr += 'h3 { \n text-transform: uppercase; \n } \n\n';
	styleStr += 'h2, h3, h4 { \n  \n  color:black; \n } \n\n';

	return styleStr;
	// alert(styleStr)
}
