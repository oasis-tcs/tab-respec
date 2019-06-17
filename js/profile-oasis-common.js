/*global respecVersion */

// this is only set in a build, not at all in the dev environment
var requireConfig = {
    shim:   {
        "shortcut": {
            exports:    "shortcut"
        },
        "n3-browser.min": {
            exports: "N3"
        }
    }
};


require.config(requireConfig);

define([
            "domReady"
        ,   "base-runner"
        ,   "ui"
        ,   "override-configuration"
        ,   "default-root-attr"
        ,   "markdown"
        ,   "core-style"
        ,   "oasis-style"
        ,   "headers"
        ,   "conventions"
        ,   "conformance"
        ,   "data-transform"
        ,   "data-include"
        ,   "inlines"
        ,   "examples"
        ,   "issues-notes"
        ,   "requirements"
        ,   "highlight"
        ,   "best-practices"
        ,   "figures"
        ,   "biblio"
        ,   "rdfa"
        ,   "webidl-oldschool"
        ,   "dfn"
        ,   "fix-headers"
        ,   "structure"
        ,   "informative"
        ,   "id-headers"
        ,   "conformance-table"
        ,   "aria"
        ,   "vocab"
        ,   "shape"
        ,   "shiv"
        ,   "remove-respec"
        ,   "location-hash"
        ,   "about-respec"
        ,   "save-html"
        ,   "search-specref"
        ],
        function (domReady, runner, ui) {
            var args = Array.prototype.slice.call(arguments);
            domReady(function () {
                ui.addCommand("Save Snapshot", "save-html", "Ctrl+Shift+Alt+S");
                ui.addCommand("About ReSpec", "about-respec", "Ctrl+Shift+Alt+A");
                runner.runAll(args);
            });
        }
);

function vocabToSpec(util, content, uri) {
    var vocab = require("vocab");
    return vocab.vocabToSpec(util, content, uri);
}

function shapeToSpec(util, content, uri) {
    var shape = require("shape");
    return shape.shapeToSpec(util, content, uri);
}
