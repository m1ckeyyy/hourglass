let timeReview = document.getElementById("timeReview");
let timeTotal = document.getElementById("timeTotal");
let revHr, revMin, revSec, totHr, totMin, totSec;
let value = 0; //ms
let totalValue = 0;
let interval;
let started;
//timeReview = "00:00:00";
//timeTotal = "00:00:00";

setInterval(update, 200);
chrome.storage.sync.get(["total"], function (e) {
	setInterval(() => {
		console.log(e.total);
	}, 3000);
});

function update() {
	chrome.storage.sync.get(["revTime"], function (e) {
		if (e.revTime === 0) return;
		value = new Date() - new Date(e.revTime);
	});
	if (value + "" === "NaN") {
		value = 0;
	}
	if (totalValue === undefined) {
		totalValue = 0;
	}

	revSec = (value / 1000) % 60;
	revMin = (value / 1000 / 60) % 60;
	revHr = value / 1000 / 60 / 60;
	// using date.nows
	timeReview.innerHTML = `${format(revHr)}:${format(revMin)}:${format(revSec)}`;

	totSec = (totalValue / 1000) % 60;
	totMin = (totalValue / 1000 / 60) % 60;
	totHr = totalValue / 1000 / 60 / 60;
	timeTotal.innerHTML = `${format(totHr)}:${format(totMin)}:${format(totSec)}`;
}

function resetTime() {
	clearInterval(interval);
	value = 0;
	update();
}
function submitTime() {
	totalValue += value;
	resetTime();
	timeReview.innerHTML = "00:00:00";
}
// function startTime(){

// 	if
// }

//
function getTime() {
	console.log("getTime()");
	chrome.storage.sync.get(["total", "revTime"], function (e) {
		totalValue = e.total;
		console.log(e.revTime, totalValue);

		if (e.revTime === 0) return;
		value = new Date() - new Date(e.revTime);
		console.log(value, "=value");
		update();
	});
}

function format(val) {
	return val < 10 ? "0" + Math.trunc(val) : Math.trunc(val);
}
window.onload = getTime();
chrome.storage.onChanged.addListener(getTime);
chrome.storage.onChanged.addListener(update);
//test commit
