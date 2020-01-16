
// Module oasis/vocab
// Handle the RDF vocabulary properly.

define(
    ["handlebars",
     "core/utils",
     "n3-browser.min",
     "tmpl!oasis/templates/vocab.html"],
    function (hb, utils, N3, vocabTmpl) {
        return {
            run: function (conf, doc, cb, msg) {
                msg.pub("start", "oasis/vocab");
                msg.pub("end", "oasis/vocab");
                cb();
            },
            vocabToSpec: function(util, content) {
                var fillHBJson = function(store, triples, map) {
    			    $.each(triples || [], function(i, it) {
    			    	$.each(map || [], function(n, nt) {
    				    	var results = store.find(it.subject, nt.predicate, null);
    				    	if (results.length > 0) {
    				    		if (nt.multiValue) {
    				    			it[nt.name] = results;
    				    		} else {
    				    			var o = results[0].object;
    				    			if (N3.Util.isLiteral(o)) {
    				    				o = N3.Util.getLiteralValue(o);
    				    			}
    				    			it[nt.name] = o;
    				    		}
    				    	}
    			    	});
    			    });
                };
            	var parser = N3.Parser();
            	var store = N3.Store();
            	parser.parse(function (error, triple, prefixes) {
				if (error) {
					console.log("Error: "+error);
				} else {
					triple && store.addTriple(triple);
				}
            	});
            	parser.addChunk(content);
            	parser.end();

			    var owlOnto = "http://www.w3.org/2002/07/owl#Ontology";
			    var rdfsClass = "http://www.w3.org/2000/01/rdf-schema#Class";
			    var rdfProp = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";
			    var rdfDesc = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Description";
			    var rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
			    var rdfsLabel = "http://www.w3.org/2000/01/rdf-schema#label";
			    var rdfsComment = "http://www.w3.org/2000/01/rdf-schema#comment";
			    var rdfsSeeAlso = "http://www.w3.org/2000/01/rdf-schema#seeAlso";
			    var rdfsIsDefinedBy = "http://www.w3.org/2000/01/rdf-schema#isDefinedBy";
			    var dcDescription = "http://purl.org/dc/terms/description";
                var termStatus = "http://www.w3.org/2003/06/sw-vocab-status/ns#term_status";

			    var onto = store.find(null, rdfType, owlOnto);
			    if (onto.length != 1) { console.log("Can't locate owl:Ontology"); return null;}
			    var vocabSub = onto[0].subject;
			    var conf = {};
			    conf.vocabURI = vocabSub;

			    var seeAlso = store.find(vocabSub, rdfsSeeAlso, null);
			    conf.seeAlso = seeAlso;

			    var label = store.find(vocabSub, rdfsLabel, null);
			    if (label.length == 1) {
	    			conf.label = N3.Util.getLiteralValue(label[0].object);
			    }
			    var desc = store.find(vocabSub, dcDescription, null);
			    if (desc.length == 1) {
	    			conf.description = N3.Util.getLiteralValue(desc[0].object);
			    }

			    var classes = store.find(null, rdfType, rdfsClass);
			    conf.classes = classes;

			    var inputMap = [{predicate: rdfsLabel, name: "name"},
			                    {predicate: rdfsComment, name: "comment"},
			                    {predicate: rdfsSeeAlso, name: "seeAlso", multiValue: true},
			                    {predicate: rdfsIsDefinedBy, name: "isDefinedBy"},
			                    {predicate: termStatus, name: "termStatus"}
			                    ];
			    fillHBJson(store, classes, inputMap);
                classes.sort(function(a, b) { return a.name.localeCompare(b.name); });
                $.each(classes, function(i, it) {
                    it.archaic = (it.termStatus && (it.termStatus === 'archaic'));
                });

			    var props = store.find(null, rdfType, rdfProp);
			    conf.props = props;
			    fillHBJson(store, props, inputMap);
                props.sort(function(a, b) { return a.name.localeCompare(b.name); });
                $.each(props, function(i, it) {
                    if (it.termStatus) {
                     it.archaic = (it.termStatus && (it.termStatus == 'archaic'));
                    }
                });

			    var desc = store.find(null, rdfType, rdfDesc);
			    conf.desc = desc;
			    fillHBJson(store, desc, inputMap);
                desc.sort(function(a, b) { return a.name.localeCompare(b.name); });

			    //var template = hb.compile(vocabTmpl);
			    var html = vocabTmpl(conf);

				return html;
            }
        };
    }
);

