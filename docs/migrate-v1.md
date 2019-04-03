# Migrate to v1.0.0

The first major version of the Karma UI5 plugin comes with several new features and some breaking changes.
It requires less configuration and has a new "html" mode to seamlessly execute your testsuites and testpages.

## Breaking changes

### Rename from karma-openui5 to karma-ui5

The plugin has been renamed from `karma-openui5` to `karma-ui5`.

### No built-in MockServer support

The `useMockServer` option has been removed.
A MockServer needs to be started from the test code.


## How to upgrade

### Rename plugin

The plugin has been renamed from `karma-openui5` to `karma-ui5`.
Make sure to uninstall the old plugin and install the new one.

```sh
npm uninstall karma-openui5
npm install --save-dev karma-ui5
```

And rename the framework in your `karma.conf.js` from `openui5` to `ui5`
```diff
 {
-  frameworks: ["openui5"]
+  frameworks: ["ui5"]
 }
```

### Option 1 - Switch to "html" mode

Using the new built-in QUnit HTML Runner makes most of the karma configuration obsolete and instead runs your existing QUnit testsuites and testpages. This is the recommended way as it eases the configuration and uses the same setup as opening the HTML pages manually in the browser.

In case you would like to stick with the previous script-based approach from v0.x, see [Option 2 - Keep using "script" mode](#option-2---keep-using-script-mode) below.

#### Remove "openui5" config

Remove the existing `openui5` related configuration. It is not needed anymore.
```diff
 // karma.conf.js
 {

-   openui5: {
-     path: "https://example.com/resources/sap-ui-core.js"
-   }

-   client: {
-    openui5: {
-      config: { ... },
-      tests: [ ... ],
-      mockserver: { ... }
-    },
-    clearContext: false,
-    qunit: {
-      showUI: true
-    }
-   }

 }
```

#### Uninstall other frameworks

Uninstall the following devDependencies (if existing) as they are also not required anymore
- `karma-qunit` + `qunit` / `qunitjs`
  QUnit is supported out of the box and loaded from UI5 within your test.
  ```sh
  npm uninstall karma-qunit qunit qunitjs
  ```
- `karma-sinon` / `sinon`
  Sinon should be loaded from the test instead.
	```sh
  npm uninstall karma-sinon sinon
  ```

Remove them also from the `frameworks` config. `ui5` must be the only framework
```diff
 {
-  frameworks: ["qunit", "sinon", "ui5"]
+  frameworks: ["ui5"]
 }
```

#### Remove "files" config

The plugin automatically sets the "files" config when running in "html" mode.
Therefore you must remove the defined "files" from your karma config
```diff
 {
-  files: [ ... ]
 }
```

#### Configure a URL

When **using the [UI5 Tooling](https://github.com/SAP/ui5-tooling)**, this plugin will automatically use the installed dependencies to make them available within Karma. This means that there is no need to start a separate server.

But when **not using** the [UI5 Tooling](https://github.com/SAP/ui5-tooling) you need to specify an URL where to load UI5 from.
Compared to the previous `path` configuration, it must **not** include the `resources/sap-ui-core.js` path segment:
```diff
 {

-  openui5: {
-    path: "https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
-  }

+  ui5: {
+    url: "https://openui5.hana.ondemand.com"
+  }

 }
```

Those steps should be sufficent for most application and library projects.
In case your project uses a different stucture, you will get an error pointing you to what needs to be adopted.
Also, in case your project contains multiple testsuites, you need to define one of them to start from.

Please also see the general documentation for more information about this individual options:  
https://github.com/SAP/karma-ui5#readme

<hr/>

### Option 2 - Keep using "script" mode

You can also keep using the script-based approach from v0.x.

#### Remove MockServer config

Remove the `useMockServer` / `mockserver` config as it's not supported anymore. Instead make sure to start up the MockServer from your test code.

```diff
 // karma.conf.js
 {
   openui5: {
-    useMockServer: true
   },

   client: {
     openui5: {
-      mockserver: {
-        metadataURL: '...'
-      }
     }
   }
 }
```

#### Move openui5 config to ui5 section

The previous `openui5` and `client.openui5` sections have been merged into a new `ui5` configuration.

**Note:** The `path` option has been renamed to `url`. Compared to the previous `path` configuration, it must **not** include the `resources/sap-ui-core.js` path segment.  
When using the [UI5 Tooling](https://github.com/SAP/ui5-tooling) you can also remove the `url` option. The plugin will automatically use the installed dependencies to make them available within Karma. This means that there is no need to start a separate server.

```diff
 {
   ui5: {
+    mode: "script",
+    url: "https://example.com",
+    config: { ... },
+    tests: [ ... ]
   },

-  openui5: {
-    path: "https://example.com/resources/sap-ui-core.js"
-  }

   client: {
-    openui5: {
-      config: { ... },
-      tests: [ ... ]
-    }
   }

 }
```

#### Remove "files" config

The plugin automatically sets the "files" config to make your project files available.

When using the `tests` config to load your test modules, you must completely remove the `files` section
```diff
 {
-  files: [
-     { pattern: "**", included: false, served: true, watched: true },
-  ]
 }
```

When **not** using the `tests` config you still need to add the files to be included, but must remove the glob pattern to make all project files available.
```diff
 {
  files: [
-   { pattern: "**", included: false, served: true, watched: true },
    "webapp/test/karma-main.js"
  ]
 }
```


Those steps should be sufficent for most application and library projects.
In case your project uses a different stucture, you will get an error pointing you to what needs to be adopted.

Please also see the general documentation for more information about this individual options:  
https://github.com/SAP/karma-ui5#readme
