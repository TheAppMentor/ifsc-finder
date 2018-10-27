var handlebars = require('handlebars')
var fs = require('fs');

let statistics_template 
let dropdown_template 
let modal_template 
let steps_template
let dropdown_branch 
let results_segment 
let locationSearch_segment 
let branchSearch_segment


fs.readFile('./templates/statistics.hbs', function read(err, data) {
        if (err) {throw err;}
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

fs.readFile('./templates/branch-dropdown.hbs', function read(err, data) {
        if (err) {throw err;}
        dropdown_branch = handlebars.compile(data.toString())
    })

fs.readFile('./templates/results_segment.hbs', function read(err, data) {
        if (err) {throw err;}
        results_segment = handlebars.compile(data.toString())
    })

fs.readFile('./templates/location_search.hbs', function read(err, data) {
        if (err) {throw err;}
        locationSearch_segment = handlebars.compile(data.toString())
    })

fs.readFile('./templates/branch_search.hbs', function read(err, data) {
        if (err) {throw err;}
        branchSearch_segment = handlebars.compile(data.toString())
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
    
    getDivForBranchDropDown(data) {
        return dropdown_branch(data)
    }
    
    getDivForModal(data) {
        return modal_template(data)
    }

    getDivForResults(data) {
        return results_segment(data)
    }
    
    getDivForLocationSearch(data) {
        return locationSearch_segment(data)
    }
    
    getDivForBranchSearch(data) {
        return branchSearch_segment(data)
    }

}

module.exports = DOM_Generator;
