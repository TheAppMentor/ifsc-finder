"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var WebhookClient = require('dialogflow-fulfillment').WebhookClient;
var Promise = require('bluebird');
var BankCollection_1 = require("../model/BankCollection");
var dialogflow_responseParser_1 = require("../model/dialogflow-responseParser");
var bankColl = new BankCollection_1.BankCollection();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Finder Boy' });
});
/* GET home page. */
router.get('/loadDB', function (req, res, next) {
    var bankColl = new BankCollection_1.BankCollection();
    bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv").then(function () {
        return bankColl.loadDataBasesWithDataFromFile();
    }).then(function () {
        return bankColl.getAllStateNamesForBank("DenA BanK");
    }).then(function (matchedStates) {
        res.render('index', { title: matchedStates.toString() });
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
    //res.json({"status" : "A Bloody Resounding success : POST"})
    var respParser = new dialogflow_responseParser_1.DialogFlowRespParser();
    respParser.determineMatchedIntent(JSON.stringify(req.body))
        .then(function (fulfillText) {
        console.log("Got a Simply Request.... ");
        console.log(fulfillText);
        res.json({ 'fulfillmentText': fulfillText });
        res.render('index', { title: fulfillText });
    });
    /*
        respParser.fulfillGetCityIntent(JSON.stringify(req.body))
            .then((fulfillText : string) => {
           return new Promise((resolve : any, reject : any) => {
                console.log("FulFill Text : " + fulfillText)
                agent.add('Now We are really talking ... ')
                res.json({ 'fulfillmentText': fulfillText});
                resolve()
            })
            });
    */
});
router.get('/simply', function (req, res, next) {
    var respParser = new dialogflow_responseParser_1.DialogFlowRespParser();
    var sampleJSON = { "responseId": "574b5f75-f257-42fe-9275-0d61f852365d", "queryResult": { "queryText": "\"Bangalore\"", "parameters": { "geo-city": ["Bangalore"] }, "allRequiredParamsPresent": true, "intent": { "name": "projects/ifsc-finder-a3f6d/agent/intents/c7f18d63-5d51-4678-82ef-9946819d6d80", "displayName": "getCity" }, "intentDetectionConfidence": 1, "languageCode": "en-us" }, "originalDetectIntentRequest": { "payload": {} }, "session": "projects/ifsc-finder-a3f6d/agent/sessions/quickstart-session-id" };
    var sampleJSON1 = {
        "responseId": "7d37ca9a-a871-40d7-ace0-f7e93c396b9d",
        "queryResult": {
            "queryText": "icici",
            "parameters": {
                "geo-country": "",
                "geo-city": [],
                "bankName": "icici",
                "geo-country1": ""
            },
            "allRequiredParamsPresent": true,
            "fulfillmentText": "talking back baby.. ",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "talking back baby.. "
                        ]
                    }
                }
            ],
            "outputContexts": [
                {
                    "name": "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup",
                    "lifespanCount": 2,
                    "parameters": {
                        "bankName": "icici",
                        "geo-country1": "",
                        "geo-city.original": "",
                        "geo-city": [],
                        "geo-country.original": "",
                        "bankName.original": "icici",
                        "geo-country1.original": "",
                        "geo-country": ""
                    }
                }
            ],
            "intent": {
                "name": "projects/ifsc-finder-a3f6d/agent/intents/6754d62c-ba0b-410f-89fb-8e70359f079b",
                "displayName": "getBankName"
            },
            "intentDetectionConfidence": 1,
            "diagnosticInfo": {
                "webhook_latency_ms": 183
            },
            "languageCode": "en"
        },
        "webhookStatus": {
            "message": "Webhook execution successful"
        }
    };
    respParser.determineMatchedIntent(JSON.stringify(sampleJSON1))
        .then(function (fulfillText) {
        console.log("Got a Simply Request.... ");
        console.log(fulfillText);
        res.json({ 'fulfillmentText': fulfillText });
        res.render('index', { title: fulfillText });
    });
});
module.exports = router;
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
