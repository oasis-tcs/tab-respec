/*jshint
    forin: false
*/
/*global Handlebars*/

// Module headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - revision: the revision number of the document at its given stage (required)
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
//  - chairs: an array of people who are chairing the TC producing this document.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
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
//  - wg: the name of the WG in charge of the document. This may be an array in which case wgURI
//      and wgPatentURI need to be arrays as well, of the same length and in the same order
//  - wgURI: the URI to the group's page, or an array of such
//  - wgPatentURI: the URI to the group's patent information page, or an array of such. NOTE: this
//      is VERY IMPORTANT information to provide and get right, do not just paste this without checking
//      that you're doing it right
//  - wgPublicList: the name of the mailing list where discussion takes place. Note that this cannot
//      be an array as it is assumed that there is a single list to discuss the document, even if it
//      is handled by multiple groups
//  - wgShortName: the name of the TC that is seen in the URL for publications
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
            ,   PSPRD:          "PSPRD"
            ,   PS:             "PS"
            ,   COS:            "COS"
            ,   OS:             "OS"
            ,   Errata:         "Errata"
            ,   PND:            "PND"
            ,   PNPRD:          "PNPRD"
            ,   PN:             "PN"
            }
        ,   status2rdf: {
                WD:             "oasis:WD",
                PSD:            "oasis:PSD",
                PSPRD:          "oasis:PSPRD",
                PS:             "oasis:PS",
                COS:            "oasis:COS",
                OS:             "oasis:OS",
                Errata:         "oasis:Errata",
                PND:            "oasis:PND",
                PNPRD:          "oasis:PNPRD",
                PN:             "oasis:PN"
            }
        ,   status2text: {
                    WD:             "Working Draft"
                ,   PSD:            "Project Specification Draft"
                ,   PSPRD:          "Project Specification Public Review Draft"
                ,   PS:             "Project Specification"
                ,   COS:            "Candidate OASIS Standard"
                ,   OS:             "OASIS Standard"
                ,   Errata:         "Approved Errata"
                ,   PND:            "Project Note Draft"
                ,   PNPRD:          "Project Note Public Review Draft"
                ,   PN:             "Project Note"
                ,   PRD:            "Public Review Draft"
            }
        ,   stdTrackStatus: ["WD", "PSD", "PSPRD", "PS", "COS", "OS", "Errata"]
        ,   noTrackStatus:  ["PND", "PNPRD", "PN"]
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
                        conf.license = "cc-by";
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
                        msg.pub("error", "Unknown license - use licenseName and licenseURI");
                        conf.licenseName = "Attribution 2.0 (CC BY 2.0)";
                        conf.licenseURI = "https://creativecommons.org/licenses/by/2.0/legalcode";
                    }
                }

                if (!conf.specStatus) msg.pub("error", "Missing required configuration: specStatus");
                if (!conf.shortName) msg.pub("error", "Missing required configuration: shortName");
                if (!conf.revision) msg.pub("error", "Missing required configuration: revision");
                conf.title = doc.title || "No Title";
                if (!conf.subtitle) conf.subtitle = "";
                if (!conf.publishDate) {
                    conf.publishDate = utils.parseLastModified(doc.lastModified);
                }
                else {
                    if (!(conf.publishDate instanceof Date)) conf.publishDate = utils.parseSimpleDate(conf.publishDate);
                }
                conf.publishYear = conf.publishDate.getFullYear();
                conf.publishHumanDate = utils.humanDate(conf.publishDate);
                conf.isNoTrack = $.inArray(conf.specStatus, this.noTrackStatus) >= 0;
                conf.isStdTrack = conf.noRecTrack ? false : $.inArray(conf.specStatus, this.stdTrackStatus) >= 0;
                conf.anOrA = $.inArray(conf.specStatus, this.precededByAn) >= 0 ? "an" : "a";
                conf.maturity = (this.status2maturity[conf.specStatus]) ? this.status2maturity[conf.specStatus] : conf.specStatus;
                if (!conf.thisVersion) conf.thisVersion = "";
                // TODO - see issue #47
                conf.thisPDFVersion = conf.thisVersion.replace('.html', '.pdf');
                // TODO: Determine right URI production
                // conf.latestVersion = "http://docs.oasis-open.org/" + conf.wgShortName + "/";
                conf.latestPDFVersion = "";
                // TODO - see above
                if (conf.latestVersion) conf.latestPDFVersion = conf.latestVersion.replace('.html', '.pdf')
                if (!conf.tcBaseURI) conf.tcBaseURI = "https://www.oasis-open.org/committees";
                if (conf.previousPublishDate) {
                    if (!conf.previousMaturity)
                        msg.pub("error", "previousPublishDate is set, but not previousMaturity");
                    if (!(conf.previousPublishDate instanceof Date))
                        conf.previousPublishDate = utils.parseSimpleDate(conf.previousPublishDate);
                    var pmat = (this.status2maturity[conf.previousMaturity]) ? this.status2maturity[conf.previousMaturity] :
                                                                               conf.previousMaturity;
                    conf.prevVersion = "http://docs.oasis-open.org/" + conf.wgShortName + "/" + conf.previousPublishDate.getFullYear() + "/" + pmat + "-" +
                              conf.shortName + "-" + utils.concatDate(conf.previousPublishDate) + "/";
                }
                if (!conf.prevVersion) conf.prevVersion = "";
                conf.prevPDFVersion = conf.prevVersion.replace('.html', '.pdf');
                if (conf.prevRecShortname && !conf.prevRecURI) conf.prevRecURI = "http://docs.oasis-open.org/" + conf.prevRecShortname;
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
                conf.showThisVersion =  !conf.isNoTrack;
                conf.showPreviousVersion = (conf.specStatus !== "WD"  &&
                                           !conf.isNoTrack);
                conf.notYetStd = (conf.isStdTrack && conf.specStatus !== "OS");
                conf.isStd = (conf.isStdTrack && conf.specStatus === "OS");
                conf.notStd = (conf.specStatus !== "OS");
                conf.prependOASIS = true;
                conf.isWD = (conf.specStatus === "WD");
                conf.isPS = (conf.specStatus === "PS");
                conf.isPSPR = (conf.specStatus === "PSPRD");
                conf.isPNPR = (conf.specStatus === "PNPRD");
                conf.isCOS = (conf.specStatus === "COS");
                conf.isOS = (conf.specStatus === "OS");
                conf.isAE = (conf.specStatus === "Errata");
                conf.dashDate = utils.concatDate(conf.publishDate, "-");
                conf.publishISODate = utils.isoDate(conf.publishDate) ;

                if ($.inArray(conf.specStatus, this.unPublished) < 0) {
                   if (conf.isPSPR) {
                      conf.docStatus = [
                        this.status2text["PSD"] + " " + conf.revision,
                        this.status2text["PRD"] + " " + conf.revision
                      ];
                      conf.textStatus1 = this.status2text["PSD"];
                      conf.textStatus2 = this.status2text["PRD"];
                   }
                   else if (conf.isPNPR) {
                      conf.docStatus = [
                        this.status2text["PND"] + " " + conf.revision,
                        this.status2text["PRD"] + " " + conf.revision
                      ];
                      conf.textStatus1 = this.status2text["PND"];
                      conf.textStatus2 = this.status2text["PRD"];
                   }
                   else {
                      conf.docStatus = [conf.textStatus + " " + conf.revision];
                   }
                }

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

                if ($.isArray(conf.wg)) {
                    conf.multipleWGs = conf.wg.length > 1;
                    conf.wgHTML = utils.joinAnd($.isArray(conf.wg) ? conf.wg : [conf.wg], function (wg, idx) {
                        return "<a href='" + conf.wgURI[idx] + "'>" + wg + "</a>";
                    });
                    var pats = [];
                    for (var i = 0, n = conf.wg.length; i < n; i++) {
                        pats.push("<a href='" + conf.wgPatentURI[i] + "' rel='disclosure'>" + conf.wg[i] + "</a>");
                    }
                    conf.wgPatentHTML = pats.join(", ");
                }
                else {
                    conf.multipleWGs = false;
                    conf.wgHTML = "<a href='" + conf.wgURI + "'>" + conf.wg + "</a>";
                }

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
