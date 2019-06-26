// create or use existing global dojoConfig
var dojoConfig = this.dojoConfig || {};

(function() {
    var config = dojoConfig;

    // set default properties
    if (!config.hasOwnProperty("async")) {
        config.async = true;
    }
    if (!config.hasOwnProperty("isDebug")) {
        config.isDebug = true;
    }

    // add packages for libs that are not siblings to dojo
    (function() {
        var packages = config.packages || [];

        function addPkgIfNotPresent(newPackage) {
            for (var i = 0; i < packages.length; i++) {
                var pkg = packages[i];
                if (pkg.name === newPackage.name) {
                    return;
                }
            }

            packages.push(newPackage);
        }
        addPkgIfNotPresent({
            name: "app",
            location: "./../../src/app"
        });
        addPkgIfNotPresent({
            name: "util",
            location: "./../../src/util"
        });
        addPkgIfNotPresent({
            name: "widget",
            location: "./../../src/widget_dev"
        });
        addPkgIfNotPresent({
            name: "lib",
            location: "./../../lib"
        });
        addPkgIfNotPresent({
            name: "esri",
            location: "../arcgis-js-api"
        });
        addPkgIfNotPresent({
            name: "@dojo",
            location: "../@dojo"
        });
        addPkgIfNotPresent({
            name: "dstore",
            location: "../dojo-dstore"
        });
        addPkgIfNotPresent({
            name: "dgrid",
            location: "../dgrid"
        });
        addPkgIfNotPresent({
            name: "cldrjs",
            location: "../cldrjs",
            main: "dist/cldr"
        });
        addPkgIfNotPresent({
            name: "globalize",
            location: "../globalize",
            main: "dist/globalize"
        });
        addPkgIfNotPresent({
            name: "maquette",
            location: "../maquette",
            main: "dist/maquette.umd"
        });
        addPkgIfNotPresent({
            name: "maquette-css-transitions",
            location: "../maquette-css-transitions",
            main: "dist/maquette-css-transitions.umd"
        });
        addPkgIfNotPresent({
            name: "maquette-jsx",
            location: "../maquette-jsx",
            main: "dist/maquette-jsx.umd"
        });
        addPkgIfNotPresent({
            name: "tslib",
            location: "../tslib",
            main: "tslib"
        });

        config.packages = packages;
    })();

    // configure map.globalize
    var map = config.map || {};
    if (!map.globalize) {
        map.globalize = {
            cldr: "cldrjs/dist/cldr",
            "cldr/event": "cldrjs/dist/cldr/event",
            "cldr/supplemental": "cldrjs/dist/cldr/supplemental",
            "cldr/unresolved": "cldrjs/dist/cldr/unresolved"
        };
        config.map = map;
    }
})();
