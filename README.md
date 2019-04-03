![UI5 icon](https://raw.githubusercontent.com/SAP/ui5-tooling/master/docs/images/UI5_logo_wide.png)

[![NPM Version](https://img.shields.io/npm/v/karma-ui5.svg?style=flat)](https://www.npmjs.org/package/karma-ui5)

**Table of Contents**

- [About](#about)
  - [Quickstart](#quickstart)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Execution](#execution)
  - [Advanced Configuration Options](#advanced-configuration-options)
    - [Project Types](#project-types)
    - [Custom paths](#custom-paths)
    - [UI5 URL](#ui5-url)
    - [UI5 Tooling Middleware](#ui5-tooling-middleware)
    - [Defining Testpage](#defining-testpage)
  - [Advanced usage](#advanced-usage)
    - [Configuration](#configuration-1)
      - [Bootstrap](#bootstrap)
      - [Tests](#tests)
  - [Application constrains](#application-constrains)
    - [QUnit dependency](#qunit-dependency)
    - [OPA5: Component containers instead of iFrames](#opa5-component-containers-instead-of-iframes)
  - [License](#license)

# About
This Karma adapter helps testing your UI5 projects.

**Note:** This project has been renamed from `karma-openui5` to `karma-ui5`.  
The `karma-openui5` documentation can be found on the [0.x branch](https://github.com/SAP/karma-ui5/tree/0.x#readme).

## Quickstart

### Installation

First you need to install the Karma CLI globally

```shell
npm install -g karma-cli
```

You can find more information on installing Karma [here](https://karma-runner.github.io/latest/intro/installation.html).

Next you need to add `karma` and `karma-ui5` as devDependencies:

```shell
npm install --save-dev karma karma-ui5
```

To start a browser you also need to install a launcher, e.g. for Chrome
```shell
npm install --save-dev karma-chrome-launcher
```

### Configuration

To configure this plugin you need to add two things to your `karma.conf.js`:
1. Specify `"ui5"` in the list of `frameworks`
1. Set a URL for serving the UI5 resources
   - **Note:** This can be omitted when [using the UI5 Tooling](#url)

This is an example `karma.conf.js` file that is sufficient for most projects:
```js
module.exports = function(config) {
  config.set({

    frameworks: ["ui5"],

    ui5: {
      url: "https://openui5.hana.ondemand.com"
    },

    browsers: ["Chrome"]

  });
};
```

### Execution

With the above configuration karma will by default run all tests in Chrome and listen for changed files to execute them again (watch mode)
```sh
karma start
```

For CI testing you can run Chrome in headless mode and execute the tests only once using the `singleRun` option:

```js
module.exports = function(config) {
  config.set({

    // ...

    browsers: ["ChromeHeadless"],
    singleRun: true

  });
};
```

The options can also be set via CLI arguments

```sh
karma start --browsers=ChromeHeadless --singleRun=true
```

For more information, see the ["Configuration File" documentation from Karma](https://karma-runner.github.io/latest/config/configuration-file.html).

## Karma configuration requirements

There is an important requirement for this plugin that needs to be respected in order to use this plugin

- `basePath` must point to your project root. This is the default, when your `karma.conf.js` is in the project root.  
It is required for the [type detection](#type) and automatic inclusion of your project files.

## Options

All configuration options need to be defined in an `ui5` object in your Karma configuration:
```js
module.exports = function(config) {
  config.set({

    ui5: {

    }

  });
};
```

### url
Type: `string`  
CLI: `--ui5-url`

The URL where UI5 should be loaded from.

When omitted and the project contains a `ui5.yaml` file, the [UI5 Tooling](https://github.com/SAP/ui5-tooling) will be used as server middleware.

Example:
```js
ui5: {
  url: "https://openui5.hana.ondemand.com"
}
```

### type
Type: `enum` (`"application"` / `"library"`)  

Defines the [project type](https://github.com/SAP/ui5-builder#types).  
If not set, it is automatically detected based on
- type defined in `ui5.yaml` or
- existing folders
  - "webapp" => `application`
  - "src" / "test" => `library`

Example:
```js
ui5: {
  type: "application"
}
```

### paths
Type: `object`

Custom path mappings for project folders based on the `type`.  
Option is only to be used when the automatic type detection does not work as the project uses a different folder structure.

Example `application`:
```js
ui5: {
  type: "application",
  paths: {
    webapp: "src/main/webapp"
  }
}
```

Example `library`:
```js
ui5: {
  type: "library",
  paths: {
    src: "src/main/js",
    test: "src/test/js"
  }
}
```

### mode
Type: `enum` (`"html"` / `"script"`)  
Default: `"html"`

Configures the mode how tests should be executed.

**html**

The HTML mode runs QUnit testsuites and testpages in a separate context.  
It has built-in support for QUnit. The [QUnit adapter](https://github.com/karma-runner/karma-qunit) **must not be used** in combination with this mode. Other framework plugins must also not be used and instead required libraries such as sinon should be loaded within the test.

```js
ui5: {
  mode: "html"
}
```

Specific config options
- [testpage](#testpage)

**script**

The script mode includes the UI5 bootstrap script, allows to pass UI5 config and loads your test modules.  
You need to also install and configure an adapter for your test framework such as [QUnit](https://github.com/karma-runner/karma-qunit), to enable test execution and reporting.

```js
ui5: {
  mode: "script"
}
```

Specific config options
- [config](#config)
- [tests](#tests)

#### testpage
Type: `string`  
CLI: `--ui5-testpage`  
Specific to `"html"` [mode](#mode)

A file path pointing to a testpage or testsuite that should be executed.  
The path needs to be relative to the project root.

If not set, the project is scanned for available testsuites (`testsuite.qunit.html`).  
When exactly one is found, it will be used as `testpage`. Otherwise all found pages are printed out and one needs to be configured manually.

Example:
```js
ui5: {
  mode: "html",
  testpage: "webapp/test/myTestPage.qunit.html"
}
```

#### config
Type: `object`  
Specific to `"script"` [mode](#mode)

Configuration for the [UI5 bootstrap](https://openui5.hana.ondemand.com/#/topic/91f2d03b6f4d1014b6dd926db0e91070.html).

Example:
```js
ui5: {
  mode: "script",
  config: {
    bindingSyntax: "complex",
    compatVersion: "edge",
    async: true,
    resourceRoots: {
      "sap.ui.demo.todo": "./base/webapp"
    }
  }
}
```

#### tests
Type: `Array`  
Specific to [mode](#mode) `"script"`

List of test modules that should be loaded (via `sap.ui.require`).  
If not provided, the test files must be included in the [karma `files` config](https://karma-runner.github.io/latest/config/files.html) to load them with &lt;script&gt; tags.

Example:
```js
ui5: {
  mode: "script",
  tests: [
    "sap/ui/demo/todo/test/unit/AllTests",
    "sap/ui/demo/todo/test/integration/AllJourneys"
  ]
}
```

## Application constrains
### QUnit dependency
Do no require QUnit resources from within the tests. Karma loads its own versions of them in order hook in its reporting at the right places.

Therefore rather load those resources in the non-karma specific test runner HTML pages. Like this:
````html
    <script src="../../resources/sap/ui/thirdparty/qunit.js"></script>
    <script src="../../resources/sap/ui/qunit/qunit-css.js"></script>
````

### OPA5: Component containers instead of iFrames
*Only relevant when using [Istanbul](https://istanbul.js.org/) to create test coverage*

[Istanbul](https://istanbul.js.org/) has problems collecting code coverage results from within iFrames. To gather code coverage from OPA5 tests you need to execute them inside of component containers instead of iFrames. This will also speed up the execution time of your OPA5 tests.

**Notice:** With component containers you will loose the isolation of your single tests. Also, your applications `index.html` won't be executed anymore (as only the applications `Component.js` will be needed).

In your tests, replace `iStartMyAppInAFrame()` with`iStartMyUIComponent()` and `iTeardownMyAppFrame()` with `iTeardownMyUIComponent()`.

For more information see the API reference of [sap.ui.test.Opa5](https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.test.Opa5.html#iStartMyUIComponent)

## License
(c) Copyright 2019 SAP SE or an SAP affiliate company

Licensed under the Apache License, Version 2.0 - see LICENSE.
