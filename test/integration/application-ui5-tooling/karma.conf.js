module.exports = function(config) {
	"use strict";

	require("../karma-base.conf")(config);
	config.set({

		ui5: {
			type: "application"
		},

		frameworks: ["ui5"],

		plugins: [
			require("../../../lib"),
			require("karma-chrome-launcher")
		],

		browsers: ["Chrome"],
		singleRun: false

		// FIXME: Serve testrunner.html from CDN as it's not part of the npm dependencies (no test-resources)
		// proxies: {
		// 	"/base/webapp/test-resources/sap/ui/qunit/": {
		// 		target: "https://openui5nightly.hana.ondemand.com/test-resources/sap/ui/qunit/",
		// 		changeOrigin: true
		// 	}
		// }

	});
};
