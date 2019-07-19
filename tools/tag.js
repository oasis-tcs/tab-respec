#!/usr/local/bin/node
/*jshint es5:true*/

var prompt = require("prompt")
,   async = require("async")
,   fs = require("fs")
,   pth = require("path")
,   rfs = function (f) { return fs.readFileSync(f, { encoding: "utf8" }); }
,   exec = require("child_process").exec
,   targetVersion
;

prompt.start();

// 1. Make sure you are up to date and on the master branch (git up; git checkout master)
function upToDateAndDev (cb) {
    prompt.get(
        {
            description:    "Are you up to date and on the master branch?"
        ,   pattern:        /^[yn]$/i
        ,   message:        "Values can be 'y' or 'n'."
        ,   default:        "y"
        }
    ,   function (err, res) {
            var val = res.question.toLowerCase();
            if (err) return cb(err);
            if (val === "n") return cb("Make sure to run git up; git checkout master");
            cb();
        }
    );
}

// 2. Find the version in `package-oasis.json`.
function setVersion (cb) {
    var pack = rfs(rel("./package-oasis.json"))
    ,   version = pack.match(/"version"\s*:\s*"([\d\.]+)"/)[1]
    ;
    if (!version) cb("Version string not found in package-oasis.json");
    targetVersion = version;
    cb();
}

function tag (cb) {
    console.log("About to tag "+targetVersion);
    var tagMsg = "Tagging release "+targetVersion;
    prompt.get(
        {
            description:    "Enter a message for tag "+targetVersion
        ,   type:           "string"
        ,   required:       true
        ,   default:        tagMsg
        }
    ,   function (err, res) {
            tagMsg = res.question;
            if (err) return cb(err);
            console.log("Tagging "+targetVersion+" with message "+tagMsg);
            exec("git tag -f -m \""+tagMsg+"\" v" + targetVersion, cb);
        }
    );
}

function pushTags (cb) {
    console.log("About to push tags");
    exec("git push --tags", cb);
}

async.series([
        upToDateAndDev
    ,   setVersion
    ,   tag
    ,   pushTags
    ]
,   function (err) {
        if (err) console.error("ERROR:", err);
        else console.log("OK!");
    }
);
