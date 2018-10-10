(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['statistics.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <div class=\"statistic\">\n                    <div class=\"value\">\n                        "
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + " \n                    </div>\n                    <div class=\"label\">\n                        "
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "\n                    </div>\n                </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"row\" id=\"statistics-row\">\n    <div class=\"center aligned column\">\n        <div class=\"ui "
    + container.escapeExpression(((helper = (helper = helpers.statisticCount || (depth0 != null ? depth0.statisticCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"statisticCount","hash":{},"data":data}) : helper)))
    + " statistics\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.statistic : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</div>\n\n";
},"useData":true});
})();