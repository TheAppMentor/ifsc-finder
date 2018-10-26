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
var totalNumberOfBankBranchesInDB;
var totalNumberOfBanksInDB;
var allBankNamesArr = [];
var popularBankNamesArr = ["ICICI BANK LIMITED", "HDFC BANK", "STATE BANK OF INDIA", "CANARA BANK"];
var allSetReadyToLaunch = false;
bankColl.getAllBranchesCount()
    .then(function (totalCountAllBranches) {
    console.log("Step 1 : Done.");
    totalNumberOfBankBranchesInDB = totalCountAllBranches;
}).then(function () {
    bankColl.getAllBankNamesCount().then(function (totalBanksCount) {
        console.log("Step 2 : Done.");
        totalNumberOfBanksInDB = totalBanksCount;
    });
}).then(function () {
    bankColl.getAllBankNames().then(function (allBankNames) {
        console.log("Step 3 : Done.");
        console.log("We now have all bank... " + allBankNames);
        allBankNamesArr = allBankNames;
    });
}).then(function () {
    console.log("Step x : Done.");
    allSetReadyToLaunch = true;
});
bankColl.getAllBankNames().then(function (allBankNames) {
    console.log("Step 3 : Done.");
    console.log("We now have all bank... " + allBankNames);
    allBankNamesArr = allBankNames;
});
var appStep = "find_bank";
/* GET home page. */
router.get('/', function (req, res, next) {
    //TODO : Check the allSetReadyToLaunch variable, if we are not yet ready. Show a an appropriate page. 
    if (allBankNamesArr.length == 0) {
        bankColl.getAllBankNames().then(function (allBankNames) {
            console.log("Step 3 : Done.");
            console.log("We now have all bank... " + allBankNames);
            allBankNamesArr = allBankNames;
        });
    }
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    if (_.isEmpty(req.query)) {
        res.render('index', {
            title: 'IFSC Search',
            processStep: "findBank",
            dropDownPlaceHolderText: "Search Bank Name",
            stepStatus: [
                { title: "Find Bank", status: "active", description: "Enter Bank Name" },
                { title: "Find City", status: "disabled", description: "Enter Bank Location" },
                { title: "Find Branch", status: "disabled", description: "Enter Bank Branch" }
            ],
            allBankNames: allBankNamesArr,
            statistic: [{ label: "Banks", value: totalNumberOfBanksInDB }, { label: "Bank Branches", value: totalNumberOfBankBranchesInDB }],
            statisticCount: "two",
            statiticTitle: "All Banks",
            statiticSubTitle: "India"
        });
    }
    /*
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
 */
});
router.get('/getBanks/', function (req, res, next) {
    var query = req.query;
    console.log("Returning a response.... " + JSON.stringify(query));
    console.log("Query is " + query.q);
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
    console.log("Resp 1 is : " + resp);
    res.json(resp);
    var resp1 = {
        "results": {
            "category1": {
                "name": "Popular Banks",
                "results": [
                    {
                        "title": "HDFC Bank",
                    },
                    {
                        "title": "ICICI Bank",
                    }
                ]
            },
            "category2": {
                "name": "All Banks",
                "results": [
                    {
                        "title": "Abudaya Bull Crap bank",
                    },
                    {
                        "title": "Abudaya Bull Crap bank",
                    },
                    {
                        "title": "Abudaya Bull Crap bank",
                    },
                    {
                        "title": "Abudaya Bull Crap bank",
                    },
                    {
                        "title": "Abudaya Bull Crap bank",
                    },
                ]
            }
        },
    };
    res.json(resp1);
});
/*
fields: {
  categories      : 'results',     // array of categories (category view)
  categoryName    : 'name',        // name of category (category view)
  categoryResults : 'results',     // array of results (category view)
  description     : 'description', // result description
  image           : 'image',       // result image
  price           : 'price',       // result price
  results         : 'results',     // array of results (standard)
  title           : 'title',       // result title
  action          : 'action',      // "view more" object name
  actionText      : 'text',        // "view more" text
  actionURL       : 'url'          // "view more" url
}
*/
router.get('/getLocationList/', function (req, res, next) {
    var bankName = req.query.bankName;
    var searchInput = req.query.searchInput;
    console.log("Returning a response.... " + JSON.stringify(bankName));
    console.log("Returning a response.... " + JSON.stringify(searchInput));
    bankColl.getAllCityNamesForBank(bankName).then(function (allCityNames) {
        //TODO : Prashanth u can send the search query also to the MongoDB.. remember this is the search bar that gives u the user input.
        console.log("Fetched all city names " + JSON.stringify(allCityNames));
        var matchedCityNames = _.filter(allCityNames, function (eachValue) {
            if (_.includes(_.toLower(eachValue.city), _.toLower(searchInput)) == true) {
                return eachValue;
            }
        });
        //Form the response.
        var resp = {};
        resp['results'] = matchedCityNames;
        var queryReturnedResults = matchedCityNames.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        //Matching City Names
        console.log("Returning Response : " + JSON.stringify(resp));
        return res.json(resp);
    });
});
router.get('/getBranchList/', function (req, res, next) {
    var bankName = req.query.bankName;
    var locationName = req.query.locationName;
    var searchInput = req.query.searchInput;
    bankColl.getAllBranchNamesForBankNameInCity(bankName, locationName).then(function (branchNameArr) {
        //TODO : Prashanth u can send the search query also to the MongoDB.. remember this is the search bar that gives u the user input.
        var matchedBranchObjects = _.filter(branchNameArr, function (eachValue) {
            if (_.includes(_.toLower(eachValue.branch), _.toLower(searchInput)) == true) {
                return eachValue;
            }
        });
        //Form the response.
        var resp = {};
        resp['results'] = matchedBranchObjects;
        var queryReturnedResults = matchedBranchObjects.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        //Matching City Names
        console.log("Returning Response : " + JSON.stringify(resp));
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
router.get('/getDomForResults/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    console.log("Index.ts : getDomForResults bankName, cityName , branchName" + bankName, cityName, branchName);
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        var results_div = dom_gen.getDivForResults({
            bankName: fetchedBranch.name,
            bankBranch: fetchedBranch.branch,
            ifsc: fetchedBranch.ifsc,
            address: fetchedBranch.address,
            city: fetchedBranch.city,
            state: fetchedBranch.state
        });
        console.log("I am returning the Results div ... " + results_div);
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
        console.log("Fetched Branch is..." + fetchedBranch);
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
