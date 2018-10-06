"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseJson = require('parse-json');
var Promise = require("bluebird");
var BankCollection_1 = require("../model/BankCollection");
var bankColl = new BankCollection_1.BankCollection();
var DialogFlowRespParser = /** @class */ (function () {
    function DialogFlowRespParser() {
    }
    DialogFlowRespParser.prototype.determineMatchedIntent = function (dialogFlowResp) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var sessionID = resp["session"];
            console.log("REsponse Parser talking : Sesion is " + sessionID);
            var queryResult = resp.queryResult;
            console.log("allRequiredParamsPresent : " + queryResult.allRequiredParamsPresent);
            if (queryResult.allRequiredParamsPresent == true) {
                console.log("We have all required parameters.... ");
                _this.fullfillIntentWithName(queryResult.intent.displayName, dialogFlowResp).then(function (fetchednames) {
                    console.log("Fetched Names are : " + fetchednames);
                    resolve(fetchednames);
                });
            }
        });
    };
    DialogFlowRespParser.prototype.fullfillIntentWithName = function (intentName, response) {
        //Prashanth : Make this an enum here..       
        if (intentName == "getBankName") {
            console.log("fullfillIntentWithName : I am in the get bank name ");
            return this.fulfillGetBankNameIntent(response);
        }
        if (intentName == "getBankName - getCityName") {
            return this.fulfillGetCityIntent(response);
        }
        if (intentName == "getBankName - getCityName - getBankBranchDetails") {
            return this.fulfillGetBankBranchNameIntent(response);
        }
    };
    DialogFlowRespParser.prototype.fulfillGetCityIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryText = resp.queryResult.queryText;
            console.log("Query Result : " + queryText);
            var queryResult = resp.queryResult;
            var bankNameIdentified = "Unknown Bank !!";
            //Extract the city Name from the intent.
            //"geo-city"
            var inputCityName = queryResult.parameters["geo-city"];
            for (var _i = 0, _a = resp.queryResult.outputContexts; _i < _a.length; _i++) {
                var eachContext = _a[_i];
                //if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup"){
                if (eachContext.name == resp.session + "/contexts/getbankname-followup") {
                    console.log("We are looking at context : " + resp.session + "/contexts/getbankname-followup");
                    bankNameIdentified = eachContext.parameters["bankNameIdentified"];
                }
            }
            console.log("Bank Name identified : ==> " + bankNameIdentified);
            var responseObject = { fulfillmentText: ("NodejS : Look like you want " + inputCityName + "Resoloving with : " + bankNameIdentified) };
            resolve(responseObject);
        });
    };
    DialogFlowRespParser.prototype.fulfillGetBankNameIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult.queryText;
            var bankName = resp.queryResult.parameters.bankName;
            console.log("fulfillGetBankNameIntent : Query Result Bank Name : " + bankName);
            // Find out how many banks we have... 
            bankColl.findBankNameContainingString(bankName)
                .then(function (matchedBankNames) {
                if (matchedBankNames.length == 1) {
                    var responseObject = { fulfillmentText: ("Cool. I found your bank. " + matchedBankNames[0]) };
                    for (var _i = 0, _a = resp.queryResult.outputContexts; _i < _a.length; _i++) {
                        var eachContext = _a[_i];
                        //"projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-getcityname-followup"
                        //if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup"){
                        if (eachContext.name == resp.session + "getbankname-getcityname-followup") {
                            //if (eachContext.name == resp.session + "getbankname-followup"){
                            console.log("We are looking at context : " + resp.session);
                            eachContext.parameters["bankNameIdentified"] = matchedBankNames[0];
                        }
                        responseObject["outputContexts"] = [eachContext];
                    }
                    resolve(responseObject);
                }
                resolve("We have found many banks that match : " + matchedBankNames.length);
            }).catch(function (err) {
                reject("Error ! : dialogflow-responseParser.ts => " + err);
            });
        });
    };
    DialogFlowRespParser.prototype.fulfillGetBankBranchNameIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryText = resp.queryResult.queryText;
            var queryResponse = resp.queryResult;
            var bankNameIdentified = "Unknown !!";
            var inputCityName = "Unknown !!";
            for (var _i = 0, _a = resp.queryResult.outputContexts; _i < _a.length; _i++) {
                var eachContext = _a[_i];
                if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup") {
                    bankNameIdentified = eachContext.parameters["bankNameIdentified"];
                    inputCityName = eachContext.parameters["geo-city"];
                }
            }
            bankColl.getBranchesDetailsForBankInCityWithBranchName(bankNameIdentified, inputCityName, queryText).then(function (bankBranchDetailsArr) {
                var responseObject = { fulfillmentText: ("Cool. BankName = " + bankNameIdentified + "City Name : " + inputCityName + "Branch Name :" + queryText + "Count = " + bankBranchDetailsArr.length) };
                resolve(responseObject);
            });
        });
    };
    DialogFlowRespParser.prototype.getOutputContextsFromResponse = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var outputContexts = resp.queryResult.getOutputContexts;
        });
    };
    return DialogFlowRespParser;
}());
exports.DialogFlowRespParser = DialogFlowRespParser;
