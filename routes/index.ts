var express = require('express');
var router = express.Router();
var _ = require('lodash');
var handlebars = require('handlebars')
const fs = require('fs');

const { WebhookClient } = require('dialogflow-fulfillment')
var Promise = require('bluebird')

import { BankCollection } from '../model/BankCollection'
import { BankDB } from '../data/dbHandler'
import { BankBranchDetail } from '../model/BankBranchDetail'
import { DialogFlowRespParser } from '../model/dialogflow-responseParser'
var DOM_Generator = require('../templates/dom_gen')

let bankColl = new BankCollection()
let dom_gen = new DOM_Generator()

var totalNumberOfBankBranchesInDB
var totalNumberOfBanksInDB 
var allBankNamesArr = ["PlaceHolder1","PlaceHolder2"] 

var allSetReadyToLaunch : Boolean = false


bankColl.getAllBranchesCount()
    .then((totalCountAllBranches : number) => {
        totalNumberOfBankBranchesInDB = totalCountAllBranches
    }).then(() => {
        bankColl.getAllBankNamesCount().then((totalBanksCount : number) =>{
            totalNumberOfBanksInDB = totalBanksCount
        })
    }).then(() => {
        bankColl.getAllBankNames().then((allBankNames : [string]) =>{
            allBankNamesArr = allBankNames 
        }) 
    }).then(() => {
        allSetReadyToLaunch = true
    })

/*
bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv")
    .then(() : Promise<boolean> => {
        return bankColl.loadDataBasesWithDataFromFile()
    }).then(() => {
        bankColl.getAllBranchesCount()
            .then((totalCountAllBranches : number) => {
                totalNumberOfBankBranchesInDB = totalCountAllBranches
            })
    }).then(() => {
        bankColl.getAllBankNamesCount().then((totalBanksCount : number) =>{
            totalNumberOfBanksInDB = totalBanksCount
        })
    }).then(() => {
        bankColl.getAllBankNames().then((allBankNames : [string]) =>{
            allBankNamesArr = allBankNames 
        }) 
    }).then(() => {
        allSetReadyToLaunch = true
    })
*/

var appStep = "find_bank";

/* GET home page. */
router.get('/', function(req, res, next) {
//TODO : Check the allSetReadyToLaunch variable, if we are not yet ready. Show a an appropriate page. 

    let bankName = req.query.bankName 
    let cityName = req.query.cityName
    let branchName = req.query.branchName

    if (_.isEmpty(req.query)){
        res.render('index', { 
            title: 'IFSC Search', 
            processStep : "findBank",
            dropDownPlaceHolderText : "Search Bank Name", 
            stepStatus : [
                {title : "Find Bank", status : "active", description :  "Enter Bank Name"},
                {title : "Find City", status : "disabled", description : "Enter Bank Location"},
                {title : "Find Branch", status : "disabled", description : "Enter Bank Branch"}],
            allBankNames : allBankNamesArr,
            statistic: [{label : "Banks", value: totalNumberOfBanksInDB},{label : "Bank Branches", value: totalNumberOfBankBranchesInDB}],
            statisticCount : "two",
            statiticTitle : "All Banks", 
            statiticSubTitle : "India" 
        });
    }
});


// For Bank Name : Get all locations
router.get('/getLocations/', function(req, res, next) {
    let bankName = req.query.bankName 
    
    bankColl.getAllCityNamesForBank(bankName).then((allCityNames : [string]) => {

        var statistics_div = dom_gen.getDivForStatistics( 
            {
                statistic: [
                    {label : allCityNames.length == 1 ? "Location" : "Locations", value: allCityNames.length}],
                statisticCount : "one",
                statiticTitle : bankName, 
                //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
                statiticSubTitle : "" 
            })

        var steps_div = dom_gen.getDivForSteps(
            {
                stepStatus : [
                    {title : "Bank", status : "completed", description :  bankName},
                    {title : "Find City", status : "active", description : "Choose Location below"},
                    {title : "Find Branch", status : "disabled", description : "Enter Branch Name"}],
            })

        var dropdown_div = dom_gen.getDivForDropDown({
            processStep : "findCity",
            allBankNames : allCityNames,
            dropDownPlaceHolderText : "Search Bank Location", 
        }) 

        res.set('bankName',bankName)
        res.json({div_dropdown : dropdown_div, div_stats : statistics_div, div_steps : steps_div})

    }).catch((err) => {
        console.log("ERROR! : index.ts : /cities/ => Finding City Name Name " + err)
    })
});


router.get('/getBranches/', function(req, res, next) {

    let bankName = req.query.bankName 
    let cityName = req.query.cityName

    // Find all Branches for Bank name & City Name:
    bankColl.getAllBranchNamesForBankNameInCity(bankName,cityName).then((branchNameArr: Array<string>) => {

        var statistics_div = dom_gen.getDivForStatistics( 
            {
                statistic: [
                    {label : branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length}],
                statisticCount : "one",
                statiticTitle : bankName, 
                //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
                statiticSubTitle : cityName 
            })

        var steps_div = dom_gen.getDivForSteps(
            {
                stepStatus : [
                    {title : "Bank", status : "completed", description :  bankName},
                    {title : "Location", status : "completed", description : cityName},
                    {title : "Find Branch", status : "active", description : "Choose Branch"}],
            })

        var dropdown_div = dom_gen.getDivForBranchDropDown({
            processStep : "findBranch",
            allBankNames : branchNameArr,
            dropDownPlaceHolderText : "Search Bank Branch", 
        }) 

        res.set('bankName',bankName)
        res.set('cityName',cityName)
        res.json({div_dropdown : dropdown_div, div_stats : statistics_div, div_steps : steps_div})
    }).catch((err) => {
        console.log("ERROR! : Finding branch Name")
    })

})

router.get('/getBranchDetails/', function(req, res, next) {
    let bankName = req.query.bankName 
    let cityName = req.query.cityName
    let branchName = req.query.branchName
    
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName,cityName,branchName).then((branchNameArr: Array<BankBranchDetail>) => {

        var fetchedBranch = _.first(branchNameArr)
        console.log("Fetched Branch is..." + fetchedBranch) 

        var statistics_div = dom_gen.getDivForStatistics( 
            {
                statistic: [
                    {label : branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length}],
                statisticCount : "one",
                statiticTitle : bankName,
                    statiticSubTitle : cityName 
            })

        var steps_div = dom_gen.getDivForSteps(
            {
                stepStatus : [
                    {title : "Bank", status : "completed", description :  bankName},
                    {title : "Location", status : "completed", description : cityName},
                    {title : "Branch", status : "completed", description : branchName}],
            })

        var dropdown_div = dom_gen.getDivForDropDown({
                processStep : "findBranch",
                allBankNames : branchNameArr,
            }) 

        var modal_div = dom_gen.getDivForModal({ 
            bankName : fetchedBranch.name,
            ifscCode : fetchedBranch.ifsc,
            address : fetchedBranch.address,
            branchName : fetchedBranch.branch
        })
        res.set('bankName', bankName)        
        res.set('cityName', cityName)        
        res.set('branchName', branchName)        
        res.json({div_dropdown : dropdown_div, div_stats : statistics_div, div_steps : steps_div, div_modal : modal_div})
    
    }).catch((err) => {
        console.log("ERROR! : index.ts : /branches/ => Finding branch Name " + err)
    })

});



/* GET home page. */
/*
router.get('/loadDB', function(req, res, next) {
    bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv").then(() : Promise<boolean> => {
        return bankColl.loadDataBasesWithDataFromFile()
    }).then(() : Promise<Array<string>> => {
        return bankColl.getAllStateNamesForBank("DenA BanK")
    }).then((matchedStates : Array<string>) => {
        res.render('index', { title: matchedStates.toString() });
    })
});
 */

router.get('/allBankNames', function(req, res, next) {
    bankColl.getAllBankNames().then((bankList : Array<string>) => {
        console.log("All Bank Names are : " + bankList)
        res.render('index', { title: bankList.toString() });
    })
});

router.get('/loadCityNames', function(req, res, next) {
    bankColl.getAllCityNamesForBank("DenA BanK").then((matchedCities : Array<string>) => {
        res.render('index', { title: matchedCities.toString() });
    })
});

router.get('/loadDistrictNames', function(req, res, next) {
    bankColl.getAllDistrictNamesForBank("DenA BanK").then((matchedDistricts : Array<string>) => {
        res.render('index', { title: matchedDistricts.toString() });
    })
});

router.get('/loadBranchDetails', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInCity("DenA BanK","Chennai").then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});

router.get('/loadBranchDetailsInState', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInState("DenA BanK","Tamil Nadu").then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});

router.get('/loadBranchDetailsEveryThing', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInStateDistrictCity("DenA BanK","Karnataka","Bangalore",null).then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});

router.post('/DF', function(req, res, next) {
    //const agent = new WebhookClient({ req, res });
    const agent = new WebhookClient({request: req, response: res});

    console.log("Holy Cow.. DialogFlow said something.. ")
    console.log("Request is Headers : " + JSON.stringify(req.headers))
    console.log("Request is body : " + JSON.stringify(req.body))
    let respParser = new DialogFlowRespParser()

    respParser.determineMatchedIntent(JSON.stringify(req.body))
        .then((fulfillText : string) => {
            agent.add(fulfillText)
            //res.json(fulfillText)
            //res.render('index', { title: fulfillText});
        })
});

router.get('/simply', function(req, res, next) {

    let respParser = new DialogFlowRespParser()


    let sampleJSON1 = {
        "responseId": "63847c5d-72de-4073-8cbd-80a1081fe603",
        "queryResult": {
            "queryText": "icici",
            "parameters": {
                "bankName": "icici",
                "geo-country1": "",
                "geo-country": "",
                "geo-city": []
            },
            "allRequiredParamsPresent": true,
            "fulfillmentText": "Found your Bank Prashanth !!!",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "Found your Bank Prashanth !!!"
                        ]
                    }
                }
            ],
            "outputContexts": [
                {
                    "name": "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup",
                    "lifespanCount": 2,
                    "parameters": {
                        "geo-country1.original": "",
                        "geo-country": "",
                        "bankName": "icici",
                        "geo-country1": "",
                        "geo-city.original": "",
                        "geo-city": [],
                        "geo-country.original": "",
                        "bankName.original": "icici"
                    }
                }
            ],
            "intent": {
                "name": "projects/ifsc-finder-a3f6d/agent/intents/6754d62c-ba0b-410f-89fb-8e70359f079b",
                "displayName": "getBankName"
            },
            "intentDetectionConfidence": 1,
            "diagnosticInfo": {
                "webhook_latency_ms": 580
            },
            "languageCode": "en"
        },
        "webhookStatus": {
            "code": 3,
            "message": "Webhook call failed. Error: Failed to parse webhook JSON response: Cannot find field: outputContexts.parameters.bankName in message google.cloud.dialogflow.v2beta1.WebhookResponse."
        }
    }


    respParser.determineMatchedIntent(JSON.stringify(sampleJSON1))
        .then((fulfillText : string) => {
            console.log("Got a Simply Request.... ")
            console.log(fulfillText)
            res.json(fulfillText); 
            res.render('index', { title: fulfillText});
        })
});

module.exports = router;
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
