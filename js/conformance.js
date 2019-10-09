// Module conformance
// Handle the conformance section outline - details filled in later with conformance-table.js.

define(
    [],
    function() {
        return {
        run : function(conf, doc, cb, msg) {
            msg.pub("start", "conformance");
            var conform = $("#conformance");
            var clauses = $(".conformance");
            conf.conformanceIntro = conform.find(":header ~").length;

            if (!conf.isNoTrack && conf.conformanceIntro <= 0
                && (conf.noConformanceTable || clauses.length <= 0)) {
                msg.pub("error","A conformance paragraph or table is required for your type of document.");
            } else if (conform.find(":header").length <= 0) {
                conform.append("<h2>Conformance</h2>");
            }
            msg.pub("end", "conformance");
            cb();
        }
        };
    });
