
// Module shape
// Handle the OSLC Resource Shape to HTML table transform

define(
    ["handlebars",
     "utils",
     "n3-browser.min",
     "tmpl!templates/shape.html"],
    function (hb, utils, N3, shapeTmpl) {
        return {
            run: function (conf, doc, cb, msg) {
                msg.pub("start", "shape");
                msg.pub("end", "shape");
                cb();
            },
            shapeToSpec: function(util, content, uri) {
                var prefixMap;

                var quote = function(str) {
                    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                };

                /* See if url begins with namespace, if so replace with prefix from prefixMap */
                var getPrefixedName = function(url) {
                    var prefixedName = null;
                    $.each(prefixMap || [], function(i, it) {
                        var pattern = new RegExp("^"+it+"(.*)$");
                        var matches = pattern.exec(url+'');
                        if (matches) {
                            prefixedName = i + ":" + matches[1];
                        }
                    });
                    return prefixedName;
                };

                var miniMD = function(str) {
                  return str.replace(/{{/g, "<span class='conformance'>").replace(/}}/g, "</span>")
                     .replace(/`([^`]+)`/g, "<code>$1</code>");
                };

                var setDefaults = function(prop) {
                    var propDefaults = {
                        occurs:   {long: "http://open-services.net/ns/core#Zero-or-many", short: "Zero-or-many"},
                        readOnly: {long: "unspecified", short: "unspecified" },
                        valType:  {long: "unspecified", short: "unspecified" },
                        rep:      {long: "http://open-services.net/ns/core#Either", short: "Either"},
                        range:    {long: [], short: []},
                        description: {long: "", short: ""}
                    }

                    $.each(propDefaults, function(attr, value) {
                        prop[attr] = value.short;
                    });
                };
                // For each triple, find the predicate mapping to JSON
                // attribute to make handlebars template easier
                var fillHBJson = function(store, triples, map) {
                    // extract value data and read as literal value if it is
                    function extractHBJson (found,nt) {
                        var o = found.object;
                        if (N3.Util.isLiteral(o)) {
                            o = N3.Util.getLiteralValue(o);
                        }
                        if (nt.getPrefixedName) {
                            o = getPrefixedName(o) || o;
                        } else if (!nt.dontCompact) {
                            var r = /#.*$/.exec(o);
                            if (r && r.length > 0) o = r[0].substring(1);
                        }
                    return o;
                    }

                    $.each(triples || [], function(i, it) {
                        setDefaults(it);
                        $.each(map || [], function(n, nt) {
                            var results = store.find(it.object, nt.predicate, null);
                            if (results.length > 0) {
                                // apply extract function for each of its elements
                                if (nt.multiValue) {
                                    it[nt.name] = results.map(function(cv,i){return extractHBJson(cv,nt);});
                                } else {
                                it[nt.name] = extractHBJson(results[0], nt)
                                }
                            }
                        });
                    });
                };

                var owlOnto = "http://www.w3.org/2002/07/owl#Ontology";
                var rdfsClass = "http://www.w3.org/2000/01/rdf-schema#Class";
                var rdfProp = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";
                var rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
                var rdfsLabel = "http://www.w3.org/2000/01/rdf-schema#label";
                var rdfsComment = "http://www.w3.org/2000/01/rdf-schema#comment";
                var rdfsSeeAlso = "http://www.w3.org/2000/01/rdf-schema#seeAlso";
                var rdfsIsDefinedBy = "http://www.w3.org/2000/01/rdf-schema#isDefinedBy";

                var dcDescription = "http://purl.org/dc/terms/description";
                var dcTitle = "http://purl.org/dc/terms/title";
                var oslcNS = "http://open-services.net/ns/core#";
                var oslcShape = oslcNS + "ResourceShape";
                var oslcDescribes = oslcNS + "describes";
                var oslcOccurs = oslcNS + "occurs";
                var oslcProp = oslcNS + "property";
                var oslcPropClass = oslcNS + "Property";
                var oslcPropDefn = oslcNS + "propertyDefinition";
                var oslcValType = oslcNS + "valueType";
                var oslcReadonly = oslcNS + "readOnly";
                var oslcRep = oslcNS + "representation";
                var oslcRange = oslcNS + "range";
                var oslcName = oslcNS + "name";

                var baseURI = uri;
                if (uri) {
                    /* Resolve uri */
                    var a = document.createElement("a");
                    a.href = uri;
                    uri = a.href;
                    baseURI = uri.split('#')[0]
                }

                var parser = N3.Parser({ documentURI: baseURI });
                var store = N3.Store();

                parser.parse(function (error, triple, prefixes) {
                    if (error) {
                        console.log("Error: "+error);
                    } else {
                        if (triple) store.addTriple(triple);
                        else prefixMap = prefixes;
                    }
                });
                parser.addChunk(content);
                parser.end();


                /* First look for a specific shape */
                var shape = store.find(uri, rdfType, oslcShape);
                var shapeSubject=null;

                if (shape.length == 1) {
                    shapeSubject = shape[0].subject;
                }

                if (!shapeSubject) {
                    shape = store.find(null, rdfType, oslcShape);
                    if (shape.length < 1) {
                        console.log("Can't locate oslc:ResourceShape");
                        return null;
                    }
                    else if (shape.length==1) {
                        shapeSubject = shape[0].subject;
                    }
                    else {
                        /* Look for one with the same name as the one we want */
                        var result = null;
                        var shapeName = /[^/#]*$/.exec(uri)[0];
                        $.each(shape, function(i, it) {
                            var foundName = /[^/#]*$/.exec(it.subject)[0];
                            if (foundName === shapeName) {
                            if (result!==null) { console.log("Found multiple shape definitions, using: " + it.subject); }
                            result = it;
                            }
                        });
                        if (!result) { console.log("Can't locate resource shape for "+uri); return null;}
                        shapeSubject = result.subject;
                    }
                }
                var conf = {};
                conf.subject = shapeSubject;

                var typeURI = store.find(shapeSubject, oslcDescribes, null);
                // Allow missing oslc:describes, or oslc:describes == oslc:Any, to indicate these are common properties
                if (typeURI.length > 0 && typeURI[0].object != "http://open-services.net/ns/core#Any")
                {
                   conf.typeURI = typeURI[0].object;
                   conf.name = /[#/][^#/]*$/.exec(conf.typeURI)[0].substring(1);
                }
                else
                {
                    conf.name = conf.typeURI = "Common Properties";
                }

                var title = store.find(shapeSubject, dcTitle, null);
                conf.title = miniMD(N3.Util.getLiteralValue(title[0].object));

                var desc = store.find(shapeSubject, dcDescription, null);
                if (desc.length > 0) {
                  conf.description = miniMD(N3.Util.getLiteralValue(desc[0].object));
                }

                var props = store.find(shapeSubject, oslcProp, null);
                conf.props = props;

                var oslcLitTypes = {
                            "boolean":true,
                            "dateTime":true,
                            "decimal":true,
                            "double":true,
                            "float":true,
                            "integer":true,
                            "string":true,
                            "XMLLiteral":true};

                var inputMap = [{predicate: oslcOccurs, name: "occurs"},
                                {predicate: oslcReadonly, name: "readOnly"},
                                {predicate: oslcValType, name: "valType"},
                                {predicate: oslcRep, name: "rep"},
                                {predicate: oslcRange, name: "range", multiValue: true, getPrefixedName: true},
                                {predicate: oslcPropDefn, name: "propURI", dontCompact: true},
                                {predicate: dcDescription, name: "description", dontCompact: true},
                                {predicate: oslcName, name: "name"}];

                // Map from object values to text/label entries for the spec tables
                fillHBJson(store, props, inputMap);

                // Need to set the name and prefixedName, and to adjust representation
                $.each(props, function(i, it) {
                    if (!it.name && it.propURI)
                        it.name = /[#/][^/]*$/.exec(it.propURI)[0].substring(1);
                    if (!it.prefixedName && it.propURI)
                        it.prefixedName = getPrefixedName(it.propURI);
                    if (oslcLitTypes[it.valType])
                        it.rep = "N/A";
                    if (it.description) {
                      it.description = miniMD(it.description);
                    }
                });
                props.sort(function(a, b) { return a.prefixedName.localeCompare(b.prefixedName); });

                var html = shapeTmpl(conf);
                return html;
            }
        };
    }
);

