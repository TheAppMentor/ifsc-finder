var handlebars = require('handlebars')
var fs = require('fs');

let statistics_template 
let dropdown_template 
let modal_template 
let steps_template

fs.readFile('./templates/statistics.hbs', function read(err, data) {
        if (err) {throw err;}
        // Generate - statitics div 
        // Prashanth : this is wrong.. need to use the precompile here.. no point compiling each time you get a request..
        // https://handlebarsjs.com/reference.html
        statistics_template =  handlebars.compile(data.toString())
    })

fs.readFile('./templates/steps.hbs', function read(err, data) {
        if (err) {throw err;}
        steps_template = handlebars.compile(data.toString())
    })

fs.readFile('./templates/dropdown.hbs', function read(err, data) {
        if (err) {throw err;}
        dropdown_template  = handlebars.compile(data.toString())
    })

fs.readFile('./templates/modal.hbs', function read(err, data) {
        if (err) {throw err;}
        modal_template  = handlebars.compile(data.toString())
    })

class DOM_Generator{
    
    constructor(){
    }
    
    getDivForStatistics(data){
        return statistics_template(data)
    }

    getDivForSteps(data) {
        return steps_template(data)
    }
    
    getDivForDropDown(data) {
        return dropdown_template(data)
    }
    
    getDivForModal(data) {
        return modal_template(data)
    }
}

module.exports = DOM_Generator;
