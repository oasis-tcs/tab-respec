#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   r    = require("requirejs")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "./package.json"), "utf-8")).version
// ,   builds = pth.join(__dirname, "../builds")
// ,   versioned = pth.join(builds, "respec-oasis-common-" + version + ".js")
;

// options:
//  optimize:   none || uglify || uglify2
//  out:        /path/to/output
function build (options, cb) {
    // optimisation settings
    // note that the paths/includes below will need to change in when we drop those
    // older dependencies
    version = options.version || version;
    var config = {
        baseUrl:    pth.join(__dirname, "../js")
    ,   optimize:   options.optimize || "uglify2"
    ,   paths:  {
            requireLib: "./require"
        }
    ,   shim:   {
            "shortcut": {
                exports:    "shortcut"
            },
            "n3-browser.min" : {
                exports: "N3"
            }
        }
    ,   name:       "profile-oasis-common"
    ,   include:    "requireLib".split(" ")
    ,   out:        options.out
    ,   inlineText: true
    ,   preserveLicenseComments:    false
    };
    console.log("Starting build ...");
    r.optimize(config, function () {
        // add header
        try {
            console.log("Completing build ...");
            fs.writeFileSync(config.out
                        ,   "/* ReSpec " + version +
                            " - Robin Berjon, http://berjon.com/ (@robinberjon)\n" +
                            " - Steve Speicher, http://stevespeicher.me/ (@sspeiche)\n" +
                            " - Nick Crossley (@ndjc) */\n" +
                            "/* Documentation: http://w3.org/respec/. */\n" +
                            "/* See original source for licenses: https://github.com/oasis-tcs/tab-respec. */\n" +
                            "respecVersion = '" + version + "';\n" +
                            fs.readFileSync(config.out, "utf8") + "\nrequire(['profile-oasis-common']);\n");
        }
        catch (e) {
            console.log("ERROR", e);
        }
        cb();
    });
}

exports.build = build;
