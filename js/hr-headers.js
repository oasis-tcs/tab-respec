define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "hr-headers");
                $("h2").each(function () {
                    var $h = $(this);
                    $("<hr/>").insertBefore($h.parent("section"))
                        .addClass("print");
                });
                msg.pub("end", "hr-headers");
                cb();
            }
        };
    }
);
