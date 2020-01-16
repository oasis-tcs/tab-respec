
// Module oasis/style
// Inserts a link to the appropriate OASIS style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "oasis/style");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for oasis/style");
            	var css = "https://www.oasis-open.org/spectools/css/spec.css";
                utils.linkCSS(doc, css);
                utils.linkCSS(doc, 'https://ndjc.github.io/respec/js/oasis/css/default.css');
                msg.pub("end", "oasis/style");
                cb();
            }
        };
    }
);
