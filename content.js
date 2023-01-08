let startTime = 0,
	submitTime,
	reviewTime,
	totalTime = 0,
	submitBtn,
	queueName;

// chrome.storage.sync.clear();

const hourglassInit = function () {
	chrome.storage.sync.get(["total"], function (e) {
		if (e.total) {
			totalTime = e.total;
			return;
		}
		chrome.storage.sync.set({ total: totalTime });
	});

	submitBtn = document.querySelector("#submit");
	queueName = document.querySelector(".queue-info");

	if (queueName /*true*/) {
		nextDay();
		if (!startTime /*= 0 */) {
			startTime = Date.now();
		}
		submitBtn.onclick = function () {
			submitTime = Date.now();
			reviewTime = submitTime - startTime;
			queueName = queueName;
			if (!queueName.textContent.includes("Bluechip")) {
				totalTime += reviewTime;
				chrome.storage.sync.set({ total: totalTime });
			}
		};
	}
	if (!queueName) {
		startTime = 0;
		submitTime = 0;
	}
	chrome.storage.sync.get(["revTime"], function (e) {
		if (queueName /*true*/) {
			if (!e.revTime) chrome.storage.sync.set({ revTime: new Date().toJSON() });
		}
		if (!queueName) {
			chrome.storage.sync.set({ revTime: 0 });
		}
	});
};

//before that export to google sheets
function nextDay() {
	chrome.storage.sync.get(["nextDayRunning"], function (e) {
		if (!e.nextDayRunning /*false*/) {
			chrome.storage.sync.set({ nextDayRunning: true });

			setTimeout(() => {
				chrome.storage.sync.clear();
				chrome.storage.sync.set({ nextDayRunning: false });
				chrome.storage.sync.set({ total: 0 });
				totalTime = 0; //not sure if necessary
			}, 72_000_000); // 20 hours
		}
	});
}

const mainObserver = new MutationObserver((entries) => {
	setTimeout(() => hourglassInit(), 50);
});

const mainClass = document.querySelector("#main");
mainObserver.observe(mainClass, { childList: true });

hourglassInit();
// nextDay();
