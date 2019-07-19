/*jshint
    forin: false
*/
/*global Handlebars*/

// Module headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION -- TODO: bring this list of variables up to date
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - label: the revision label used in the generated URIs and in the document header
//  - shortName: the small name that is used as the directory name in the repo (required)
//  - citationLabel: the citation label for the spec. If missing, no citation section is generated.
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - chairs: an array of people who are chairing the group producing this document.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - errata: the URI of the errata document, if any
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//          - lang: optional language
//          - type: optional MIME type
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - noStdTrack: set to true if this document is not intended to be on the Recommendation track
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - overrideCopyright: provides markup to completely override the copyright
//  - copyrightStart: the year from which the copyright starts running
//  - prevED: the URI of the previous Editor's Draft if it has moved
//  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
//  - prevRecURI: the URI of the previous Recommendation if not directly generated from
//    prevRecShortname.
//  - wg: the name of the project or working group in charge of the document.
//  - wgShortName: the name of the project or working group that is seen in the URL for publications
//  - wgURI: the URI to the group's page
//  - wgPublicList: the name of the mailing list where discussion takes place

//  - charterDisclosureURI: used for IGs (when publishing IG-NOTEs) to provide a link to the IPR commitment
//      defined in their charter.
//  - addPatentNote: used to add patent-related information to the SotD, for instance if there's an open
//      PAG on the document.
//  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - latestVersion: the URI to the latest (undated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - subjectPrefix: the string that is expected to be used as a subject prefix when posting to the mailing
//      list of the group.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"http://b"}, {key: "bar", href:"http://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "http://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: one of "apache", "bsd", "cc-by", cc-by-4", "eclipse", "mit"

define(
    ["handlebars"
    ,"utils"
    ,"tmpl!templates/headers.html"
    ,"tmpl!templates/sotd.html"
    ,"tmpl!templates/notices.html"
    ],
    function (hb, utils, headersTmpl, sotdTmpl, noticesTmpl) {
        Handlebars.registerHelper("showPeople", function (name, items) {
            // stuff to handle RDFa
            var re = "", rp = "", rm = "", rn = "", rwu = "", rpu = "";
            if (this.doRDFa !== false) {
                if (name === "Editor") {
                    re = " rel='bibo:editor'";
                    if (this.doRDFa !== "1.0") re += " inlist=''";
                }
                else if (name === "Author") {
                    re = " rel='dcterms:contributor'";
                }
                rn = " property='foaf:name'";
                rm = " rel='foaf:mbox'";
                rp = " typeof='foaf:Person'";
                rwu = " rel='foaf:workplaceHomepage'";
                rpu = " rel='foaf:homepage'";
            }
            var ret = "";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (this.doRDFa !== false ) ret += "<dd class='p-author h-card vcard' " + re +"><span" + rp + ">";
                else             ret += "<dd class='p-author h-card vcard'>";
                if (p.url) {
                    if (this.doRDFa !== false ) {
                        ret += "<a class='u-url url p-name fn' " + rpu + rn + " content='" + p.name +  "' href='" + p.url + "'>" + p.name + "</a>";
                    }
                    else {
                        ret += "<a class='u-url url p-name fn' href='" + p.url + "'>"+ p.name + "</a>";
                    }
                }
                else {
                    ret += "<span" + rn + " class='p-name fn'>" + p.name + "</span>";
                }
                if (p.mailto) {
                    ret += " (<span class='ed_mailto'><a class='u-email email' " + rm + " href='mailto:" + p.mailto + "'>" + p.mailto + "</a></span>)";
                }
                if (p.company) {
                    ret += ", ";
                    if (p.companyURL) ret += "<a" + rwu + " class='p-org org h-org h-card' href='" + p.companyURL + "'>" + p.company + "</a>";
                    else ret += p.company;
                }
                if (p.note) ret += " (" + p.note + ")";
                if (this.doRDFa !== false ) ret += "</span>\n";
                ret += "</dd>\n";
            }
            return new Handlebars.SafeString(ret);
        });


        return {
            status2maturity:    {
                WD:             "WD"
            ,   PSD:            "PSD"
            ,   PS:             "PS"
            ,   COS:            "COS"
            ,   OS:             "OS"
            ,   Errata:         "Errata"
            ,   PND:            "PND"
            ,   PN:             "PN"
            }
        ,   status2rdf: {
                WD:             "oasis:WD",
                PSD:            "oasis:PSD",
                PS:             "oasis:PS",
                COS:            "oasis:COS",
                OS:             "oasis:OS",
                Errata:         "oasis:Errata",
                PND:            "oasis:PND",
                PN:             "oasis:PN"
            }
        ,   status2text: {
                    WD:             "Working Draft"
                ,   PSD:            "Project Specification Draft"
                ,   PS:             "Project Specification"
                ,   COS:            "Candidate OASIS Standard"
                ,   OS:             "OASIS Standard"
                ,   Errata:         "Approved Errata"
                ,   PND:            "Project Note Draft"
                ,   PN:             "Project Note"
                ,   PRD:            "Public Review Draft"
            }
        ,   stdTrackStatus: ["WD", "PSD", "PS", "COS", "OS", "Errata"]
        ,   noTrackStatus:  ["PND", "PN"]
        ,   unPublished:    ["WD"]

        ,   run:    function (conf, doc, cb, msg) {
                msg.pub("start", "headers");

                if (conf.doRDFa !== false) {
                    if (conf.doRDFa === undefined) {
                        conf.doRDFa = '1.1';
                    }
                }
                // validate configuration and derive new configuration values

                // Start with license
                if (!conf.licenseName || !conf.licenseURI) {
                    if (!conf.license) {
                        msg.pub("error", "conf.license must be set");
                        conf.license = "cc-by-4";
                    }
                    if (conf.license === "apache") {
                        conf.licenseName = "Apache License 2.0";
                        conf.licenseURI = "https://www.apache.org/licenses/LICENSE-2.0";
                    }
                    else if (conf.license === "bsd") {
                        conf.licenseName = "3-Clause BSD License";
                        conf.licenseURI = "https://opensource.org/licenses/BSD-3-Clause";
                    }
                    else if (conf.license === "cc-by") {
                        conf.licenseName = "Attribution 2.0 (CC BY 2.0)";
                        conf.licenseURI = "https://creativecommons.org/licenses/by/2.0/legalcode";
                    }

                    else if (conf.license === "cc-by-4") {
                        conf.licenseName = "Attribution 4.0 International (CC BY 4.0)";
                        conf.licenseURI = "https://creativecommons.org/licenses/by/4.0/legalcode";
                    }
                    else if (conf.license === "eclipse") {
                        conf.licenseName = "Eclipse Public License – v 1.0";
                        conf.licenseURI = "https://www.eclipse.org/legal/epl-v10.html";
                    }
                    else if (conf.license === "mit") {
                        conf.licenseName = "MIT License";
                        conf.licenseURI = "https://opensource.org/licenses/MIT";
                    }
                    else {
                        msg.pub("error", "Unknown license - use licenseName and licenseURI - CC BY 4.0 assumed");
                        conf.licenseName = "Attribution 4.0 International (CC BY 4.0)";
                        conf.licenseURI = "https://creativecommons.org/licenses/by/4.0/legalcode";
                    }
                }

                if (!conf.wg)           conf.wg = "OASIS Open Services for Lifecycle Integration (OSLC) Open Project";
                if (!conf.wgShortName)  conf.wgShortName = "oslc-op";
                if (!conf.wgURI)        conf.wgURI = "https://open-services.net/about/";
                if (!conf.wgPublicList) conf.wgPublicList = conf.wgShortName + "@lists.oasis-open-projects.org";

                if (!conf.specStatus) msg.pub("error", "Missing required configuration: specStatus");
                if (!conf.shortName) msg.pub("error", "Missing required configuration: shortName");
                if (!conf.label) msg.pub("error", "Missing required configuration: label");
                conf.title = doc.title || "No Title";
                if (!conf.subtitle) conf.subtitle = "";

                conf.isNoTrack = $.inArray(conf.specStatus, this.noTrackStatus) >= 0;
                conf.isStdTrack = conf.noRecTrack ? false : $.inArray(conf.specStatus, this.stdTrackStatus) >= 0;
                conf.anOrA = $.inArray(conf.specStatus, this.precededByAn) >= 0 ? "an" : "a";
                conf.maturity = (this.status2maturity[conf.specStatus]) ? this.status2maturity[conf.specStatus] : conf.specStatus;

                conf.isWD = (conf.specStatus === "WD");
                conf.isPSD = (conf.specStatus === "PSD");
                conf.isPS = (conf.specStatus === "PS");
                conf.isCOS = (conf.specStatus === "COS");
                conf.isOS = (conf.specStatus === "OS");
                conf.isAE = (conf.specStatus === "Errata");

                conf.showThisVersion =  !conf.isNoTrack;
                conf.showPDF = !conf.isNoTrack && !conf.isWD && !conf.isPSD;
                conf.showPreviousVersion = (!conf.isNoTrack);
                conf.notYetStd = (conf.isStdTrack && conf.specStatus !== "OS");
                conf.isStd = (conf.isStdTrack && conf.specStatus === "OS");
                conf.notStd = (conf.specStatus !== "OS");
                conf.prependOASIS = true;

                // Derive specification URIs
                if (!conf.thisVersion) {
                    var base = window.location.href.replace(/.*\//, "");
                    var shortname = conf.shortName.replace(/^oslc-/, "");
                    conf.thisVersion = "https://www.open-services.net/specifications/"
                        + shortname
                        + "/"
                        + conf.label
                        + "/"
                        + base;
                }
                if (!conf.latestVersion) conf.latestVersion = conf.thisVersion.replace("/" + conf.label + "/","/");
                conf.thisPDFVersion = conf.thisVersion.replace('.html', '.pdf');
                conf.latestPDFVersion = conf.latestVersion.replace('.html', '.pdf')
                if (!conf.prevVersion) {
                    conf.prevVersion = "";
                    if (conf.prevLabel)
                        conf.prevVersion = conf.thisVersion.replace("/" + conf.label + "/","/" + conf.prevLabel + "/");
                }
                conf.prevPDFVersion = conf.prevVersion.replace('.html', '.pdf');
                if (!conf.projectURI) conf.projectURI = "https://open-services.net/about/";

                if (!conf.editors || conf.editors.length === 0) msg.pub("error", "At least one editor is required");
                var peopCheck = function (i, it) {
                    if (!it.name) msg.pub("error", "All authors and editors must have a name.");
                };
                $.each(conf.editors, peopCheck);
                $.each(conf.authors || [], peopCheck);
                $.each(conf.chairs || [], peopCheck);
                conf.multipleEditors = conf.editors.length > 1;
                conf.multipleAuthors = conf.authors && conf.authors.length > 1;
                conf.multipleChairs = conf.chairs && conf.chairs.length > 1;
                conf.editorsHTML = utils.joinAnd($.isArray(conf.editors) ? conf.editors : [conf.editors], function(ed) {return ed.name;});
                $.each(conf.alternateFormats || [], function (i, it) {
                    if (!it.uri || !it.label) msg.pub("error", "All alternate formats must have a uri and a label.");
                });
                conf.multipleAlternates = conf.alternateFormats && conf.alternateFormats.length > 1;
                conf.alternatesHTML = utils.joinAnd(conf.alternateFormats, function (alt) {
                    var optional = (alt.hasOwnProperty('lang') && alt.lang) ? " hreflang='" + alt.lang + "'" : "";
                    optional += (alt.hasOwnProperty('type') && alt.type) ? " type='" + alt.type + "'" : "";
                    return "<a rel='alternate' href='" + alt.uri + "'" + optional + ">" + alt.label + "</a>";
                });
                if (conf.copyrightStart && conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
                conf.textStatus = this.status2text[conf.specStatus];
                if (this.status2rdf[conf.specStatus]) {
                    conf.rdfStatus = this.status2rdf[conf.specStatus];
                }
                conf.noProjectStatus = "";
                if (conf.textStatus) {
                    conf.noProjectStatus = conf.textStatus.replace(/^Project /,'');
                }

                if (conf.isWD && !conf.publishDate) {
                    conf.publishDate = false;
                    conf.docTime = false;
                }
                // Cannot rely on document modify time - git content negotiators get it wrong!
                // if (!conf.publishDate || conf.isWD) {
                //     conf.publishDate = utils.parseLastModified(doc.lastModified);
                //     conf.docTime = null;
                // }
                else {
                    if (!(conf.publishDate instanceof Date)) conf.publishDate = utils.parseSimpleDate(conf.publishDate);
                    if(conf.publishDate instanceof Date) {
                        conf.publishYear = conf.publishDate.getFullYear();
                        if (conf.isWD || conf.isNoTrack) {
                            conf.publishHumanDate = "last modified on ";
                        }
                        else {
                            conf.publishHumanDate = "published on ";
                        }
                        conf.publishHumanDate = conf.publishHumanDate + utils.humanDate(conf.publishDate);
                        conf.dashDate = utils.concatDate(conf.publishDate, "-");
                        conf.publishISODate = utils.isoDate(conf.publishDate) ;
                    }
                }
                conf.docStatus = conf.textStatus + " " + conf.label;

                msg.pub("error", "start looking at PM");
                if (conf.previousMaturity) {
                   conf.previousDocStatus = this.status2text[conf.previousMaturity];
                   if (conf.previousPublishDate) {
                      if (!(conf.previousPublishDate instanceof Date)) conf.previousPublishDate = utils.parseSimpleDate(conf.previousPublishDate);
                      conf.previousPublishHumanDate = utils.humanDate(conf.previousPublishDate);
                   }
                }
                msg.pub("error", "done looking at PM");

                // configuration done!

                // annotate html element with RFDa
                if (conf.doRDFa) {
                    if (conf.rdfStatus) {
                        $("html").attr("typeof", "bibo:Document "+conf.rdfStatus ) ;
                    } else {
                        $("html").attr("typeof", "bibo:Document ") ;
                    }
                    $("html").attr("about", "") ;
                    $("html").attr("property", "dcterms:language") ;
                    $("html").attr("content", "en") ;
                    var prefixes = "bibo: http://purl.org/ontology/bibo/ oasis: http://docs.oasis-open.org/ns/spec";
                    if (conf.doRDFa != '1.1') {
                        $("html").attr("version", "XHTML+RDFa 1.0") ;
                        prefixes += " dcterms: http://purl.org/dc/terms/ foaf: http://xmlns.com/foaf/0.1/ xsd: http://www.w3.org/2001/XMLSchema#";
                    }
                    $("html").attr("prefix", prefixes);
                }

                // handle abstract
                var $shortAbstract = $("#abstract");
                if (!$shortAbstract.length)
                    msg.pub("error", "A short abstract is required.");
                conf.shortAbstract = $shortAbstract.html();
                $shortAbstract.remove();

                conf.stdNotExpected = (!conf.isStdTrack && conf.maturity == "WD");

                // handle SotD
                var $sotd = $("#sotd");
                if ((!conf.isNoTrack) && !$sotd.length)
                    msg.pub("error", "A custom SotD paragraph is required for your type of document.");
                conf.sotdCustomParagraph = $sotd.html();
                $sotd.remove();
                conf.status = sotdTmpl(conf);
                // insert into document and mark with microformat
                $("body", doc).prepend($(headersTmpl(conf)))
                              .addClass("h-entry");
                var $notices = $("#notices");

                $(noticesTmpl(conf)).insertBefore($("#toc"));
                msg.pub("end", "headers");
                cb();
            }
        };
    }
);
