
// Module oasis/conventions
// Handle the typographical conventions section properly.

define(
    ["tmpl!oasis/templates/conventions.html"],
    function (conventionsTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "oasis/conventions");
                var $conventions = $("#conventions");
                if ($conventions.length) $conventions.prepend(conventionsTmpl(conf));
                msg.pub("end", "oasis/conventions");
                cb();
            }
        };
    }
);
