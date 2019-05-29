
// Module style
// Inserts a link to the appropriate OASIS style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    ["utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "oasis-style");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for OASIS");
                var css = "https://www.oasis-open.org/spectools/css/spec.css";
                utils.linkCSS(doc, css);
                utils.linkCSS(doc, 'https://raw.githack.com/oasis-tcs/tab-respec/master/js/oasis/css/default.css');
                msg.pub("end", "oasis-style");
                cb();
            }
        };
    }
);
