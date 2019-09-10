process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
	config.set({

		plugins: [
			require("../../"),
			require("karma-coverage"),
			require("karma-chrome-launcher"),
			require("karma-ie-launcher"),
			require("karma-sauce-launcher"),
			require("karma-qunit")
		],

		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",
				flags: [
					"--no-sandbox"
				]
			}
		},

		browsers: ["ChromeHeadlessNoSandbox"],

		browserConsoleLogOptions: {
			level: "error"
		},

		reporters: ["progress", "coverage"],

		singleRun: true

	});

	require("./saucelabs").setup(config);
};
