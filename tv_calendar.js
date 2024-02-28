// ==UserScript==
// @name         TradingView Economic Calendar Grabber
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Get interesting events from economic calendar
// @author       You
// @match        https://www.tradingview.com/chart/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let seconds = 10;
var i = 0;
while(i <= 10){
    setInterval(() => {
        console.log("Waiting on page load...");
    }, seconds * 1000);
    i++;
    try {
        let loaded = document.querySelector("div[class$='widgetbar-widget-reuters_calendar']");
        console.log(loaded.textContent.slice(0, 10));
    } catch(err) {
        console.log(err)
    }
    if (loaded) {
        i = 100;
    };
};

function mainish() {
    'use strict';

    function hasClass(classes, search_str) {
        let re = new RegExp(search_str);
        for (let i = 0; i < classes.length; i++) {
            if (re.test(classes[i])) {
                return true;
            };
        };
        return false;
    };

    function addCheckBox(node, name, value) {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = name;
        checkbox.value = value;
        checkbox.id = "tv_cal_checkbox";
        node.appendChild(checkbox);
    };

    function addCheckBoxes(calender_entries) {
        let found_today = null
        for (let i = 0; i < calender_entries.length; i++) {
            let node = calender_entries[i]
            if (hasClass(node.classList, "spinnerContainer") || hasClass(node.classList, "timelineDivider")) {
                continue;
            } else if (hasClass(node.classList, "separator")) {
                let element_date = new Date (node.querySelector("div[class^='innerWrapper']").querySelector("span").textContent);
                let current_date = new Date();

                if (element_date.getMonth() == current_date.getMonth() && element_date.getDate() < current_date.getDate()) {
                    continue;
                } else if (element_date.getMonth() == current_date.getMonth() && element_date.getDate() == current_date.getDate()) {
                    found_today = true
                    continue;
                } else {
                    break;
                };
            } else {
                if (Boolean(found_today)) {
                    let title = node.querySelector("div[class^='title']").querySelector("span").textContent;
                    let time = node.querySelector("div[class^='time']").querySelector("span").textContent;
                    let icons = node.querySelector("div[class^='icons']");
                    addCheckBox(icons, title, time);
                };
            };
        };
    };

    function addCopyButton(node) {
        let copy_button = document.createElement("button");
        copy_button.textContent = "Copy Events";
        copy_button.addEventListener('click', copyButtonClick);
        node.prepend(copy_button)
    };

    function copyButtonClick() {
        let checkboxes = document.querySelectorAll("input[type='checkbox']:checked[id^='tv_cal_checkbox']")
        let combined = []
        checkboxes.forEach(function (node) {combined.push(node.name + "|" + node.value)});
        navigator.clipboard.writeText(combined);
    };

    var elem = document.querySelector("div[class$='widgetbar-widget-reuters_calendar']");
    var calender_entries = elem.querySelector("div[class^='economicCalendarItem']").parentElement.childNodes;

    let header = elem.querySelector("div[class^='widgetHeader']");
    let rh = header.querySelector("div[class^='rightSlot']");

    addCopyButton(rh)
    addCheckBoxes(calender_entries)
};

