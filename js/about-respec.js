// Module about-respec
// A simple about dialogue with pointer to the help

define(
    ["jquery"],
    function ($) {
        return {
            show:   function (ui) {
                var $halp = $("<p>ReSpec is a document production toolchain. This version has a focus on OASIS specifications.</p>");
                $("<p>You can find more information in the <a href='http://w3.org/respec/'>documentation</a>.</p>").appendTo($halp);
                $("<p>Found a bug in ReSpec? <a href='https://github.com/ndjc/respec/issues'>File it!</a>.</p>").appendTo($halp);
                ui.freshModal("About ReSpec " + respecVersion, $halp);
            }
        };
    }
);
