// ==UserScript==
// @name         Update Oprojekt with Infocompte
// @namespace    https://openuserjs.org/scripts/Choubakawa/Update_Oprojekt_with_Infocompte
// @version      1
// @description  Update mines of Oprojekt with the export of mines of Infocompte
// @author       Choubakawa (Ogame.fr uni Fornax)
// @include      https://*.oprojekt.net/mines/?id=*
// @supportURL   https://github.com/Choubakawa/Update-Oprojekt-with-Infocompte
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @updateURL    https://openuserjs.org/meta/Choubakawa/Update_Oprojekt_with_Infocompte.meta.js
// @downloadURL  https://openuserjs.org/install/Choubakawa/Update_Oprojekt_with_Infocompte.user.js
// ==/UserScript==

var addPlanetRow = window.unsafeWindow.addPlanetRow;
var title = document.getElementsByClassName("cont_bg4 box")[0].getElementsByTagName("h3")[0];
var mines = [];
var plasma;
var sizeRowInPage = $('#planetTable tbody tr').length;
var maxPlanetInOprojekt = 15;
var language = {
    title: "Infocompte:",
    buttonLabel: $("button[class='bigbutton button default'][name='mines_submit']").text()
};

/*
* GENERATE FORM
*/
function createForm() {
    let form = $(`
					<h3>` + language.title + `</h3>
					<table width="100%" align="center">
						<tr>
							<td style='width:75%; height:100%' align="center">
								<textarea id='infoCompte' style='width:100%; resize:vertical'></textarea>
							</td>
							<td style='width:25%; vertical-align:middle;' align="center">
								<button id='update'>` + language.buttonLabel + `</button>
							</td>
						</tr>
					</table>
					`).insertAfter(title);
}

/*
* GET VALUE FROM THE EXPORT
*/
function getValue(arrayValues) {

    for (let i = 2; i < arrayValues.length - 14; i++) {
        let line = arrayValues[i].split(" ");
        let planet = {
            name: line[0] + " " + line[1],
            metal: line[4],
            cristal: line[7],
            deut: line[10],
            temp: line[12].replace("°C", "")
        };
        mines.push(planet);
    }
    plasma = arrayValues[arrayValues.length - 9].split(" ")[3];
}

/*
* CALL THE METHOD addPlanetRow OF OPROJEKT SITE
*/
function callAddPlanetRow() {
    return addPlanetRow();
}

/*
* ADD IF NEEDED A NEW ROW IN OPROJEKT TABLE
*/
function addRowInOproket() {
    if (mines.length > sizeRowInPage) {
        while (maxPlanetInOprojekt > sizeRowInPage && mines.length > sizeRowInPage) {
            callAddPlanetRow();
            sizeRowInPage = $('#planetTable tbody tr').length;
        }
    }
}

/*
* UPDATE TABLE
*/
function updateOprojekt() {
    $("tr[id^='planet'],tr[id^='newPlanet']").each(function (i) {
        $("td", this).each(function (j) {
            if (i < mines.length) {
                switch (j) {
                    case 0:
                        $("input", this).val(mines[i].name);
                        break;
                    case 1:
                        $("input", this).val(mines[i].metal);
                        break;
                    case 2:
                        $("input", this).val(mines[i].cristal);
                        break;
                    case 3:
                        $("input", this).val(mines[i].deut);
                        break;
                    case 5:
                        $("input", this).val(mines[i].temp);
                        break;
                }
            }
        });
    });
    $("input[name='plasmaSt']").val(plasma);
}

createForm();

/*
* LISTENER
*/
$("#update").click(function () {
    let exportVal = $("textarea").val();
    if (exportVal.length > 0 && exportVal !== 'undefined' && exportVal.indexOf("\n") != -1) {
        getValue(exportVal.split("\n"));
        addRowInOproket();
        updateOprojekt();
    }
});