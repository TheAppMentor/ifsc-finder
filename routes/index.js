"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var handlebars = require('handlebars');
var fs = require('fs');
var WebhookClient = require('dialogflow-fulfillment').WebhookClient;
var Promise = require('bluebird');
var BankCollection_1 = require("../model/BankCollection");
var dialogflow_responseParser_1 = require("../model/dialogflow-responseParser");
var DOM_Generator = require('../templates/dom_gen');
var bankColl = new BankCollection_1.BankCollection();
var dom_gen = new DOM_Generator();
var totalNumberOfBankBranchesInDB = "1.5 L";
var totalNumberOfBanksInDB;
var allBankNamesArr = [];
var popularBankNamesArr = [];
var allSetReadyToLaunch = false;
var bankMetaData = [];
bankColl.loadDataBasesWithDataFromFile()
    .then(function () {
    // Load Meta Data table into memory. This is pretty small and can be stored in memory (Later may be in the cache)
    // db.statebankofindiasbimodels.find({city : /BENGA/}).count()
    return bankColl.getBankMetaData();
})
    .then(function (metaData) {
    bankMetaData = metaData;
    totalNumberOfBanksInDB = bankMetaData.length;
    return Promise.resolve(metaData);
})
    .then(function (metaData) {
    // Get List of all popular banks. (From Meta Data Table)
    popularBankNamesArr = _.reduce(bankMetaData, function (result, value, key) {
        //TODO change this to a boolean.. right now its a string.
        if (value.isPopular == 'true') {
            result.push(value.bankName);
            return result;
        }
        return result;
    }, []);
    return Promise.resolve(metaData);
})
    .then(function (metaData) {
    allBankNamesArr = _.map(bankMetaData, function (eachBankRec) {
        return eachBankRec.bankName;
    });
    return Promise.resolve(true);
})
    .then(function (preProcessingComplete) {
    if (preProcessingComplete == true) {
        allSetReadyToLaunch = true;
    }
});
var appStep = "find_bank";
/* GET home page. */
router.get('/', function (req, res, next) {
    //TODO : Check the allSetReadyToLaunch variable, if we are not yet ready. Show a an appropriate page. 
    console.log("Request Received | Route : / | query : " + JSON.stringify(req.query));
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    res.render('index', {});
});
router.get('/getBanks/', function (req, res, next) {
    var query = req.query;
    console.log("Request Received | Route : /getBanks | query : " + JSON.stringify(query));
    var matchedBanks = _.filter(allBankNamesArr, function (eachValue) {
        if (_.includes(_.toLower(eachValue), _.toLower(query.q)) == true) {
            return eachValue;
        }
    });
    var matchedPopularBanks = _.filter(popularBankNamesArr, function (eachValue) {
        if (_.includes(_.toLower(eachValue), _.toLower(query.q)) == true) {
            return eachValue;
        }
    });
    var resp = {};
    resp['results'] = [];
    var queryReturnedResults = matchedBanks.length > 0 ? true : false;
    resp["success"] = queryReturnedResults;
    // Build Popular Banks Category
    var popularBanksCat = {};
    popularBanksCat['name'] = "Popular Banks";
    //Build Popular bank Items
    var popBankItems = _.map(matchedPopularBanks, function (eachPopBank) {
        var popItem = {};
        popItem['title'] = eachPopBank;
        return popItem;
    });
    popularBanksCat['results'] = popBankItems;
    // If we have found a match, Then dont show popular banks.
    if (matchedBanks.length > 1) {
        resp['results'].push(popularBanksCat);
    }
    // Build Popular Banks Category
    var allBanksCat = {};
    allBanksCat['name'] = "All Banks";
    // Build resp for all banks that match the search
    var allBankItems = _.map(matchedBanks, function (eachBank) {
        var bankItem = {};
        bankItem['title'] = eachBank;
        return bankItem;
    });
    allBanksCat['results'] = allBankItems;
    resp['results'].push(allBanksCat);
    console.log("Response Sent | Route : /getBanks | query : " + JSON.stringify(query) + " | Results : Somethign was sent");
    res.json(resp);
});
router.get('/getLocationList/', function (req, res, next) {
    var bankName = req.query.bankName;
    var searchInput = req.query.searchInput;
    console.log("Request Received | Route : /getLocationList | query : " + JSON.stringify(req.query));
    bankColl.getAllCityNamesForBankMatchingQueryString(bankName, searchInput).then(function (allCityNames) {
        //Form the response.
        var locationStr = allCityNames.length == 1 ? "location" : "locations";
        var resp = {};
        resp['results'] = allCityNames;
        resp['action'] = { "actionText": "Found " + allCityNames.length + " " + locationStr + " matching " + "'<font color=\"green\">" + searchInput + "</font>'" };
        var queryReturnedResults = allCityNames.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        //Matching City Names
        console.log("Response Sent | Route : /getLocationList | query : " + JSON.stringify(req.query) + ": Results : Something Was Sent");
        return res.json(resp);
    });
});
router.get('/getBranchList/', function (req, res, next) {
    var bankName = req.query.bankName;
    var locationName = req.query.locationName;
    var searchInput = req.query.searchInput;
    console.log("Request Received | Route : /getBranchList| query : " + JSON.stringify(req.query));
    bankColl.getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, locationName, searchInput).then(function (branchNameArr) {
        //Form the response.
        var resp = {};
        resp['results'] = branchNameArr;
        var branchStr = branchNameArr.length == 1 ? "branch" : "branches";
        resp['action'] = { "actionText": "Found " + branchNameArr.length + " " + branchStr + " matching " + "'<font color=\"green\">" + searchInput + "</font>'" };
        var queryReturnedResults = branchNameArr.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        //Matching City Names
        console.log("Response Sent | Route : /getBranchList| query : " + JSON.stringify(req.query) + " : Results : " + (resp["results"].length) + "Branches");
        return res.json(resp);
    });
});
// For Bank Name : Get all locations
router.get('/getLocations/', function (req, res, next) {
    var bankName = req.query.bankName;
    console.log("The bank Name is : " + bankName);
    //res.json({message : bankName})
    bankColl.getAllCityNamesForBank(bankName).then(function (allCityNames) {
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: allCityNames.length == 1 ? "Location" : "Locations", value: allCityNames.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
            statiticSubTitle: ""
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Find City", status: "active", description: "Choose Location below" },
                { title: "Find Branch", status: "disabled", description: "Enter Branch Name" }
            ],
        });
        var dropdown_div = dom_gen.getDivForDropDown({
            processStep: "findCity",
            allBankNames: allCityNames,
            dropDownPlaceHolderText: "Search Bank Location",
        });
        res.set('bankName', bankName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div });
    }).catch(function (err) {
        console.log("ERROR! : index.ts : /cities/ => Finding City Name Name " + err);
    });
});
// Generate DOM for final results 
router.get('/getDomForLocationSearch/', function (req, res, next) {
    var bankName = req.query.bankName;
    console.log("Request Received | Route : /getDomForLocationSearch | query : " + JSON.stringify(req.query));
    //TODO : WE dont have to get the search div and the counts for the info div at the same time. If performance is an issue the info div count can be fetched later.
    bankColl.getLocationCountForBankName(bankName, "").then(function (bankLocationCount) {
        var locationSearch_div = dom_gen.getDivForLocationSearch({
            bankName: bankName,
            segmentID: "findLocationSegment",
            searchFieldID: "findLocationSearchField",
            descriptionText: "Enter your bank Location (City/Town/Village)"
        });
        var info_div = dom_gen.getDivForInfoLocationSearch({
            bankName: bankName,
            locationCount: bankLocationCount
        });
        console.log("Response Sent | Route : /getDomForLocationSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_Location Search");
        res.json({ div_locationSearch: locationSearch_div, div_info: info_div });
    });
});
// Generate DOM for final results 
router.get('/getDomForBranchSearch/', function (req, res, next) {
    var bankName = req.query.bankName;
    var locationName = req.query.locationName;
    console.log("Request Received | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query));
    bankColl.getBranchCountForBankNameInCity(bankName, locationName)
        .then(function (branchCountAtLocation) {
        var branchSearch_div = dom_gen.getDivForBranchSearch({
            bankName: bankName,
            locationName: locationName,
            segmentID: "findBranchSegment",
            searchFieldID: "findBranchSearchField",
            descriptionText: "Choose your branch"
        });
        var info_div = dom_gen.getDivForInfoBranchSearch({
            bankName: bankName,
            locationName: locationName,
            branchCount: branchCountAtLocation
        });
        console.log("Response Sent | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_Branch Search");
        res.json({ div_branchSearch: branchSearch_div, div_info: info_div });
    });
});
// Generate DOM for final results 
router.get('/getDomForResults/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.locationName;
    var branchName = req.query.branchName;
    console.log("Request Received | Route : /getDomForResults | query : " + JSON.stringify(req.query));
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        var results_div = dom_gen.getDivForResults({
            bankName: fetchedBranch.bankName,
            bankBranch: fetchedBranch.branch,
            ifsc: fetchedBranch.ifsc,
            address: fetchedBranch.address,
            city: fetchedBranch.city,
            state: fetchedBranch.state
        });
        console.log("Response Sent | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_FINAL_Results");
        res.json({ div_finaResults: results_div });
    });
});
router.get('/getBranches/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    // Find all Branches for Bank name & City Name:
    bankColl.getAllBranchNamesForBankNameInCity(bankName, cityName).then(function (branchNameArr) {
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
            statiticSubTitle: cityName
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Location", status: "completed", description: cityName },
                { title: "Find Branch", status: "active", description: "Choose Branch" }
            ],
        });
        var dropdown_div = dom_gen.getDivForBranchDropDown({
            processStep: "findBranch",
            allBankNames: branchNameArr,
            dropDownPlaceHolderText: "Search Bank Branch",
        });
        res.set('bankName', bankName);
        res.set('cityName', cityName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div });
    }).catch(function (err) {
        console.log("ERROR! : Finding branch Name");
    });
});
router.get('/getBranchDetails/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            statiticSubTitle: cityName
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Location", status: "completed", description: cityName },
                { title: "Branch", status: "completed", description: branchName }
            ],
        });
        var dropdown_div = dom_gen.getDivForDropDown({
            processStep: "findBranch",
            allBankNames: branchNameArr,
        });
        var modal_div = dom_gen.getDivForModal({
            bankName: fetchedBranch.name,
            ifscCode: fetchedBranch.ifsc,
            address: fetchedBranch.address,
            branchName: fetchedBranch.branch
        });
        res.set('bankName', bankName);
        res.set('cityName', cityName);
        res.set('branchName', branchName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div, div_modal: modal_div });
    }).catch(function (err) {
        console.log("ERROR! : index.ts : /branches/ => Finding branch Name " + err);
    });
});
router.get('/allBankNames', function (req, res, next) {
    bankColl.getAllBankNames().then(function (bankList) {
        console.log("All Bank Names are : " + bankList);
        res.render('index', { title: bankList.toString() });
    });
});
router.get('/loadCityNames', function (req, res, next) {
    bankColl.getAllCityNamesForBank("DenA BanK").then(function (matchedCities) {
        res.render('index', { title: matchedCities.toString() });
    });
});
router.get('/loadDistrictNames', function (req, res, next) {
    bankColl.getAllDistrictNamesForBank("DenA BanK").then(function (matchedDistricts) {
        res.render('index', { title: matchedDistricts.toString() });
    });
});
router.get('/loadBranchDetails', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInCity("DenA BanK", "Chennai").then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.get('/loadBranchDetailsInState', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInState("DenA BanK", "Tamil Nadu").then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.get('/loadBranchDetailsEveryThing', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInStateDistrictCity("DenA BanK", "Karnataka", "Bangalore", null).then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.post('/DF', function (req, res, next) {
    //const agent = new WebhookClient({ req, res });
    var agent = new WebhookClient({ request: req, response: res });
    console.log("Holy Cow.. DialogFlow said something.. ");
    console.log("Request is Headers : " + JSON.stringify(req.headers));
    console.log("Request is body : " + JSON.stringify(req.body));
    var respParser = new dialogflow_responseParser_1.DialogFlowRespParser();
    respParser.determineMatchedIntent(JSON.stringify(req.body))
        .then(function (fulfillText) {
        agent.add(fulfillText);
        //res.json(fulfillText)
        //res.render('index', { title: fulfillText});
    });
});
router.get('/simply', function (req, res, next) {
    var respParser = new dialogflow_responseParser_1.DialogFlowRespParser();
    var sampleJSON1 = {
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
    };
    respParser.determineMatchedIntent(JSON.stringify(sampleJSON1))
        .then(function (fulfillText) {
        console.log("Got a Simply Request.... ");
        console.log(fulfillText);
        res.json(fulfillText);
        res.render('index', { title: fulfillText });
    });
});
module.exports = router;
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
