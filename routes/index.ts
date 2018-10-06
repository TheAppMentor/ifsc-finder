var express = require('express');
var router = express.Router();
const { WebhookClient } = require('dialogflow-fulfillment')
var Promise = require('bluebird')

import { BankCollection } from '../model/BankCollection'
import { BankDB } from '../data/dbHandler'
import { BankBranchDetail } from '../model/BankBranchDetail'
import { DialogFlowRespParser } from '../model/dialogflow-responseParser'

let bankColl = new BankCollection()

bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv")
    .then(() : Promise<boolean> => {
        return bankColl.loadDataBasesWithDataFromFile()
    }).then(() : Promise<Array<string>> => {
        console.log("Printing : All State Names for Dena Bank")
        return bankColl.getAllStateNamesForBank("DenA BanK")
    })

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Finder Boy' });
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
    //res.json({"status" : "A Bloody Resounding success : POST"})
    let respParser = new DialogFlowRespParser()

    respParser.determineMatchedIntent(JSON.stringify(req))
        .then((fulfillText : string) => {
            console.log("Got a Simply Request.... ")
            console.log(fulfillText)
            res.json(fulfillText)
            res.render('index', { title: fulfillText});
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
