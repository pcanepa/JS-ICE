/*  J-ICE library 

    based on:
 *
 * Copyright (C) 2010-2014 Pieremanuele Canepa http://j-ice.sourceforge.net/
 *
 * Contact: pierocanepa@sourceforge.net
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

function createFeedback() {
	var feedback = "<form id='feedback' name='feedback' >\n";
	feedback += "<b>This page is to send the developers suggestions or to highlight bugs you faced using J-ICE.</b> <br>";
	feedback += "<p> <b '>A mailing list service is also set.</b> ";
	feedback += "<b >We warmly recommend you to choose this service rather than that below.</b>";
	feedback += "<br> <b>Click <a href='https://lists.sourceforge.net/lists/listinfo/j-ice-users' target='blank'>here</a> to sign it. </b> </p>";
	feedback += "<b>Enter here a complete description about what experienced.</b><br>";
	feedback += " <p><b style='color:red; font-size:14px'>E-mail address (*)</b><br>"
			+ createText2("feedMail", "", 44, '') + "</p>";
	feedback += "<p><b style='color:red; font-size:14px'>Subject (*)</b> <br>"
			+ createText2("feedSub", "", 44, '') + "</p>";
	feedback += "<p><b style='color:red; font-size:14px'>Text (*)</b> <br>"
			+ createTextArea("feedText", "", 10, 50, '') + "</p>";
	feedback += createButton("feedSub", "Submit", "submitOnClick()", '') + " "
			+ createButton("feedCle", "Clear", "feedClearOnClick()", '');
	feedback += "<br>(*) Compulsory fields";
	feedback += "</form>\n";
	document.write(feedback);
}

function feedClearOnClick() {
	document.feedback.reset();
}

function submitOnClick() {
	var status = validateFields();
	if (status == true) {
		var toaddy = 'pc229@kent.ac.uk';
		var subject = getValue("feedSub");
		var mailer = 'mailto:' + toaddy + '?subject=' + subject + '&body='
				+ 'Email%20%20%20is\n\t' + getValue("feedMail") + '\n\n'
				+ 'Message:\n\n' + getValue("feedText") + '\n\n';
		parent.location = mailer;
	}
}

function validateFields() {
	if (getValue("feedSub") == "") {
		alert("Please enter the subject of your message.");
		feedSub.focus();
		return false;
	}
	if (getValue("feedText") == "") {
		alert("Plese enter the description of your problem.");
		feedText.focus();
		return false;
	}
	if (getValue("feedMail") == "") {
		alert("Please enter your E-mail address");
		feedMail.focus();
		return false;
	} else {
		var mail = getValue("feedMail");
		apos = mail.indexOf("@");
		dotpos = mail.lastIndexOf(".");
		if (apos < 1 || dotpos - apos < 2) {
			alert("Your E-mail address is mispelled");
			feedMail.focus();
			return false;
		} else {
			return true;
		}
	}

}
