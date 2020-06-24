const path = require("path");

module.exports.setTestName = function(config, karmaConfPath) {
	if (!config.useSauceLabs) {
		return;
	}
	const relativeKarmaConfPath = path.relative(__dirname, karmaConfPath);
	config.set({
		sauceLabs: {
			testName: "SAP/karma-ui5 - " + relativeKarmaConfPath
		}
	});
};

module.exports.setup = function(config) {
	if (config.useSauceLabs) {
		config.set({

			customLaunchers: {
				SauceLabs_firefox: {
					base: "SauceLabs",
					browserName: "firefox",
					platformName: "Windows 10"
				},
				SauceLabs_ie11: {
					base: "SauceLabs",
					browserName: "internet explorer",
					browserVersion: "11",
					platformName: "Windows 10"
				}
			},

			sauceLabs: {
				testName: "karma-ui5",
				region: "eu"
			},

			browsers: ["SauceLabs_firefox", "SauceLabs_ie11"],

			captureTimeout: 0,
			browserDisconnectTimeout: 0,

			reporters: ["progress", "coverage", "saucelabs"]

		});
	}
};
