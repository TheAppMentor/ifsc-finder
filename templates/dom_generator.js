"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var handlebars = require('@types/handlebars')
var handlebars = require('@types/handlebars');
var fs = require('fs');
var DOM_Generator = /** @class */ (function () {
    //steps_template : TemplateSpecification 
    function DOM_Generator() {
        fs.readFile('./templates/steps.hbs', function read(err, data) {
            if (err) {
                throw err;
            }
            // Generate - statitics div 
            // Prashanth : this is wrong.. need to use the precompile here.. no point compiling each time you get a request..
            // https://handlebarsjs.com/reference.html
            this._statistics_template = Handlebars.compile(data.toString());
        });
        fs.readFile('./templates/statistics.hbs', function read(err, data) {
            if (err) {
                throw err;
            }
            // Generate - statitics div 
            // Prashanth : this is wrong.. need to use the precompile here.. no point compiling each time you get a request..
            // https://handlebarsjs.com/reference.html
            //this.steps_template = handlebars.precompile(data.toString())
        });
    }
    DOM_Generator.prototype.getDivForStatistics = function (data) {
        return this._statistics_template(data);
    };
    DOM_Generator.prototype.getDivForSteps = function (data) {
        return; //this.steps_template(data)
    };
    return DOM_Generator;
}());
exports.DOM_Generator = DOM_Generator;
