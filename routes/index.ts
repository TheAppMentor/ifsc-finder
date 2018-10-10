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


var appStep = "find_bank";


/* GET home page. */
router.get('/', function(req, res, next) {

    let bankName = req.query.bankName 
    let cityName = req.query.cityName
    let branchName = req.query.branchName

    if (_.isEmpty(req.query) == false){
        console.log("We have a query Parm  :  " + req.query)
        if (_.isEmpty(bankName) == false && _.isEmpty(cityName) == true){

            
            console.log("Finding City Name : bankName =>" + bankName)
            
            // Find all Cities for the Bank Name :
            bankColl.getAllCityNamesForBank(bankName).then((allCityNames : [string]) => {
                res.render('index', { 
                    title: 'Finder Boy', 
                    processStep : "findCity",
                    stepStatus : [
                        {title : "Find Bank", status : "completed", description :  bankName},
                        {title : "Find City", status : "active", description : "Enter Bank Name below"},
                        {title : "Find Branch", status : "disabled", description : "Enter Bank Name below"}],

                    allBankNames : allCityNames,

                    statistic: [
                        {label : allCityNames.length == 1 ? "Location" : "Locations", value: allCityNames.length}],

                    statisticCount : "one",
                    statiticTitle : bankName 
                
                });
            })
        } 

        if (_.isEmpty(cityName) == false && _.isEmpty(bankName) == false) { 
            // Find all Branches for Bank name & City Name:
            console.log("Finding Branch Name : City Name => " + cityName + "bankName =>" + bankName)
            bankColl.getAllBranchNamesForBankNameInCity(bankName,cityName).then((branchNameArr: Array<string>) => {

                    console.log("\n\n\n All Branches array is ... ." + branchNameArr)
                    res.render('index', { 
                    title: 'Finder Boy', 
                    processStep : "findBranch",
                    stepStatus : [
                        {title : "Find Bank", status : "completed", description :  bankName},
                        {title : "Find City", status : "completed", description : cityName},
                        {title : "Find Branch", status : "active", description : "Enter Bank Name below"}],

                    allBankNames : branchNameArr,

                    statistic: [
                        {label : branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length}],

                    statisticCount : "one",
                    statiticTitle : bankName + " in " + cityName 
                    
                    });
            }).catch((err) => {
                console.log("ERROR! : Finding branch Name")
            })
        }

        if (_.isEmpty(branchName) == false && _.isEmpty(cityName) == false && _.isEmpty(bankName) == false) { 
            // Find all Branches for Bank name & City Name:
            
            bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName,cityName,branchName).then((branchNameArr: Array<BankBranchDetail>) => {

                    console.log("\n\n\n All Branches array is ... ." + branchNameArr)
                    res.render('index', { 
                    title: 'IFSC Finder', 
                    processStep : "findBranch",
                    stepStatus : [
                        {title : "Find Bank", status : "completed", description :  bankName},
                        {title : "Find City", status : "completed", description : cityName},
                        {title : "Find Branch", status : "completed", description : "Enter Branch Name"}],
                    allBankNames : branchNameArr,
                    statistic: [
                        {label : "Bank Count", value: totalNumberOfBanksInDB},
                        {label : cityName, value: totalNumberOfBankBranchesInDB},{label : "Bank Count", value: 1000},{label : "Bank Count", value: 1000}],
                    statisticCount : "one",
                    statiticTitle : bankName 
                    });
            }).catch((err) => {
                console.log("ERROR! : Finding branch Name")
            })
        }
    }

    if (_.isEmpty(req.query)){
        res.render('index', { 
            title: 'Finder Boy', 
            processStep : "findBank",
            lov: ["one","two","three"], 
            stepStatus : [{title : "Find Bank", status : "active", description :  "Enter Bank Name"},{title : "Find City", status : "disabled", description : "Enter Bank Location"},{title : "Find Bank", status : "disabled", description : "Enter Bank Branch"}],
            allBankNames : allBankNamesArr,
            statistic: [{label : "Banks", value: totalNumberOfBanksInDB},{label : "Bank Branches", value: totalNumberOfBankBranchesInDB}],
            statisticCount : "two",
                    statiticTitle : "Banks in India" 
        
        });
    }
});


router.get('/branches/', function(req, res, next) {
            
    let bankName = req.query.bankName 
    let cityName = req.query.cityName
    let branchName = req.query.branchName
    
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName,cityName,branchName).then((branchNameArr: Array<BankBranchDetail>) => {

        var statistics_div = dom_gen.getDivForStatistics( 
            {
                statistic: [
                    {label : branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length}],
                statisticCount : "one",
                statiticTitle : bankName + " in " + cityName
            })

        var steps_div = dom_gen.getDivForSteps(
            {processStep : "findBranch",
                stepStatus : [
                    {title : "Bank Name", status : "completed", description :  bankName},
                    {title : "Location Name", status : "completed", description : cityName},
                    {title : "Branch", status : "completed", description : branchName}],
            })

        var dropdown_div = dom_gen.getDivForDropDown({
                processStep : "findBranch",
                allBankNames : branchNameArr,
            }) 

        res.json({div_dropdown : dropdown_div, div_stats : statistics_div, div_steps : steps_div})


        /* 
        res.send({ 
            title: 'IFSC Finder', 
            processStep : "findBranch",
            stepStatus : [
                {title : "Find Bank", status : "completed", description :  bankName},
                {title : "Find City", status : "completed", description : cityName},
                {title : "Find Branch", status : "completed", description : "Enter Branch Name"}],
            allBankNames : branchNameArr,
            statistic: [
                {label : "Bank Count", value: totalNumberOfBanksInDB},
                {label : cityName, value: totalNumberOfBankBranchesInDB},{label : "Bank Count", value: 1000},{label : "Bank Count", value: 1000}],
            statisticCount : "one",
            statiticTitle : bankName 
        });
        */
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
