"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var WebhookClient = require('dialogflow-fulfillment').WebhookClient;
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
    respParser.fulfillGetCityIntent(JSON.stringify(req.body))
        .then(function (fulfillText) {
        console.log("FulFill Text : " + fulfillText);
        agent.add('Now We are really talking ... ');
        //res.json({"status": fulfillText})
    });
});
module.exports = router;
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
