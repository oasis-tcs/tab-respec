// Module conformance
// Complete the conformance section by adding a table of conformance clauses, if wanted.

define(
    [ "text!css/conformance.css" ,
    "tmpl!templates/conformance-table.html" ],
    function(css, confoTmpl) {
        return {
        run : function(conf, doc, cb, msg) {
            msg.pub("start", "conformance-table");
            let ccPrefix = conf.conformanceLabelPrefix || "CC";
            var conform = $("#conformance");
            var clauses = $(".conformance");
            if (conform.length <= 0 || clauses.length <= 0) {
                // No conformance section, or no clauses - no action
            } else {
                var num = 0;
                conf.conformanceClauses = {};

                // Process each conformance clause
                clauses.each(function() {
                    var clause = $(this);
                    let title = (clause.attr("title") || clause.html());

                    // Add anchor in front of clause
                    let id = clause.makeID("cc");
                    clause.prepend("<a id='#" + id + "' />");

                    // Add clause number in brackets after clause
                    let clauseNum = ccPrefix + "-" + ++num;
                    let ccLabel = $("<span />").attr("class","conformance-label").text("[" + clauseNum + "]");
                    clause.append(" ").append(ccLabel);

                    // Remove conformance class if styling not wanted
                    if (conf.noConformanceStyling) clause.removeClass("conformance");

                    // Record info about clause
                    conf.conformanceClauses[id] = {
                        number : num,
                        clause : clauseNum,
                        id : id,
                        label : ccLabel.clone(),
                        strength : clause.attr("strength"),
                        text : title,
                    };
                });

                // Update all refs from conformance intro to add clause number
                conform.find("a[href^='#']:not(.tocxref)").each(function () {
                            var $a = $(this);
                            if ($a.html() == "") return;
                            var id = $a.attr("href").slice(1);
                            if (conf.conformanceClauses[id]) {
                                $a.after(" ",conf.conformanceClauses[id].label);
                            }
                        });

                // Add conformance clause table unless suppressed by config option
                if (!conf.noConformanceTable) {
                    conf.conformanceClauseList = [];
                    var keys = Object.keys(conf.conformanceClauses);
                    keys.sort(function(a, b) { return conf.conformanceClauses[a].number - conf.conformanceClauses[b].number; });
                    keys.forEach(function(kid) {
                    conf.conformanceClauseList.push(conf.conformanceClauses[kid]);
                    });
                    conform.append(confoTmpl(conf));
                }

                // Add stylesheet
                $(doc).find("head link").first().before($("<style/>").text(css));
            }
            msg.pub("end", "conformance-table");
            cb();
        }
    };
});
