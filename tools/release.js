#!/usr/local/bin/node
/*jshint es5:true*/

var prompt = require("prompt")
,   async = require("async")
,   fs = require("fs")
,   pth = require("path")
,   bwc = require("./build-oasis-common")
,   exec = require("child_process").exec
,   rfs = function (f) { return fs.readFileSync(f, { encoding: "utf8" }); }
,   wfs = function (f, data) { return fs.writeFileSync(f, data, { encoding: "utf8" }); }
,   rel = function (f) { return pth.join(__dirname, f); }
,   targetVersion
;

prompt.start();

// 1. Make sure you are up to date and on the right branch (git up; git checkout b-issue-rsXXX)
function upToDateAndDev (cb) {
    exec("git status");
    prompt.get(
        {
            description:    "Are you up to date and on the right branch?"
        ,   pattern:        /^[yn]$/i
        ,   message:        "Values can be 'y' or 'n'."
        ,   default:        "y"
        }
    ,   function (err, res) {
            var val = res.question.toLowerCase();
            if (err) return cb(err);
            if (val === "n") return cb("Make sure to run git up; git checkout b-issue-rsXXX");
            cb();
        }
    );
}

// 2. Bump the version in `package-oasis.json`, if wanted
function bumpVersion (cb) {
    var pack = rfs(rel("./package-oasis.json"))
    ,   version = pack.match(/"version"\s*:\s*"([\d\.]+)"/)[1]
    ;
    if (!version) cb("Version string not found in package-oasis.json");
    var newVersion = version.split(".");
    newVersion[2]++;
    newVersion = newVersion.join(".");
    prompt.get(
        {
            description:    "Current version is " + version + ", bump it to"
        ,   pattern:        /^(\d+\.\d+\.\d+)|n$/i
        ,   message:        "Values must be x.y.z"
        ,   default:        newVersion
        }
    ,   function (err, res) {
            targetVersion = res.question;
            if (err) return cb(err);
            if (targetVersion === "n") {
               targetVersion = version;
            } else {
               pack = pack.replace(/("version"\s*:\s*")[\d\.]+(")/, "$1" + targetVersion + "$2");
               wfs(rel("./package-oasis.json"), pack);
            }
            cb();
        }
    );
}

// 3. Run the build script (node tools/build-oasis-common.js). This should respond "OK!" (if not, fix the
//    issue).
// 4. Add the new build (git add builds/respec-oasis-common-3.x.y.js).
// 5. Commit your changes (git commit -am vX.Y.Z)
// 7. Tag the release (git tag vX.Y.Z) and be sure that git is pushing tags.
function buildAddCommitTag (cb) {
    prompt.get(
        {
            description:    "Are you ready to build, add, commit, and tag"
        ,   pattern:        /^[yn]$/i
        ,   message:        "Values can be 'y' or 'n'."
        ,   default:        "y"
        }
    ,   function (err, res) {
            var val = res.question.toLowerCase();
            if (err) return cb(err);
            if (val === "n") return cb("User not ready!");
            cb();
        }
    );
}

function build (cb) {
    console.log("About to build "+targetVersion);
    bwc.buildW3C(targetVersion, cb);
}

function add (cb) {
    var path = rel("../builds/respec-oasis-common-" + targetVersion + ".js");
    console.log("About to add "+path);
    exec("git add " + path, cb);
}

function commit (cb) {
    console.log("About to commit ");
    exec("git commit -am v" + targetVersion, cb);
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

// 8. Push everything back to the server (make sure you are pushing the master branch).
function pushAll (cb) {
    prompt.get(
        {
            description:    "Are you ready to push everything? This is your last chance"
        ,   pattern:        /^[yn]$/i
        ,   message:        "Values can be 'y' or 'n'."
        ,   default:        "y"
        }
    ,   function (err, res) {
            var val = res.question.toLowerCase();
            if (err) return cb(err);
            if (val === "n") return cb("User not ready!");
            cb();
        }
    );
}

function pushCommits (cb) {
    console.log("About to push");
    exec("git push --all", cb);
}

function pushTags (cb) {
    console.log("About to push tags");
    exec("git push --tags", cb);
}

async.series([
        upToDateAndDev
    ,   bumpVersion
    ,   buildAddCommitTag
    ,   build
    ,   add
    ,   commit
    ,   tag
    ,   pushAll
    ,   pushCommits
    ,   pushTags
    ]
,   function (err) {
        if (err) console.error("ERROR:", err);
        else console.log("OK!");
    }
);
