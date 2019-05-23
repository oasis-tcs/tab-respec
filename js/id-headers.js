
// Module id-headers
// All headings are expected to have an ID, unless their immediate container has one.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "id-headers");
                $("h2, h3, h4, h5, h6").each(function () {
                    var $h = $(this);
                    if (!$h.attr("id")) {
                        if ($h.parent("section").attr("id") && $h.prev().length === 0) return;
                        $h.makeID();
                    }
                });
                msg.pub("end", "id-headers");
                cb();
            }
        };
    }
);
