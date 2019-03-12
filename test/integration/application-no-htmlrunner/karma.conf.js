process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
	config.set({

		frameworks: ['qunit', 'ui5'],

		ui5: {
			htmlrunner: false,
			url: 'https://openui5nightly.hana.ondemand.com',
			config: {
				theme: 'sap_belize',
				language: 'EN',
				bindingSyntax: 'complex',
				compatVersion: 'edge',
				async: true,
				resourceroots: {'test.app': './base/webapp'}
			},
			tests: [
				'test/app/test/test.qunit'
			]
		},

		client: {
			qunit: {
				showUI: true
			}
		},

		files: [
			{ pattern: '**', included: false, served: true, watched: true }
		],

		browserConsoleLogOptions: {
			level: 'error'
		},

		plugins: [
			require("../../../lib"),
			require("karma-chrome-launcher"),
			require("karma-qunit")
		],

		browsers: ['ChromeHeadless'],

		singleRun: true

	});
};
