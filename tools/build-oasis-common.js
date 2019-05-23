#!/usr/local/bin/node

var fs   = require("fs")
,   pth  = require("path")
,   b    = require("./builder")
,   version = JSON.parse(fs.readFileSync(pth.join(__dirname, "./package-oasis.json"), "utf-8")).version
,   builds = pth.join(__dirname, "../builds")
,   latest = pth.join(builds, "respec-oasis-common.js")
;

function buildOASIS (versionSnapshot, cb) {
    var opts = { out: latest };
    if (versionSnapshot === true) {
        opts.version = version;
    }
    else if (typeof versionSnapshot === "string") {
        opts.version = versionSnapshot;
    }
    var versioned = pth.join(builds, "respec-oasis-common-" + opts.version + ".js");
    console.log("Preparing build to: "+builds);
    console.log("Preparing to write: "+versioned);
    b.build(opts, function () {
        if (versionSnapshot) fs.writeFileSync(versioned, fs.readFileSync(latest, "utf8"), { encoding: "utf8" });
        cb();
    });
}

if (require.main === module) {
    buildOASIS(true, function () {
        console.log("OK!");
    });
}

exports.buildW3C = buildOASIS;
