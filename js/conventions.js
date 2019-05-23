
// Module conventions
// Handle the typographical conventions section properly.

define(
    ["tmpl!templates/conventions.html"],
    function (conventionsTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "conventions");
                var $conventions = $("#conventions");
                if ($conventions.length) $conventions.prepend(conventionsTmpl(conf));
                msg.pub("end", "conventions");
                cb();
            }
        };
    }
);
