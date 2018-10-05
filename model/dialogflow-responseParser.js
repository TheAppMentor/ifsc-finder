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
        if (intentName == "getBankName - getCityName - getBranchName") {
            return this.fulfillGetBankBranchNameIntent(response);
        }
    };
    DialogFlowRespParser.prototype.fulfillGetCityIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult.queryText;
            console.log("Query Result : " + queryResult);
            //bankColl.getAllBranchesForBankNameInCity(queryResult)
            resolve("NodejS Resoloving with : " + queryResult);
        });
    };
    DialogFlowRespParser.prototype.fulfillGetBankNameIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult.queryText;
            console.log("fulfillGetBankNameIntent : Query Result Bank Name : " + queryResult);
            // Find out how many banks we have... 
            bankColl.findBankNameContainingString(queryResult)
                .then(function (matchedBankNames) {
                console.log(typeof (matchedBankNames));
                console.log(matchedBankNames);
                console.log("LOG : dialogflow-responseParser.ts : matchedBankNames => " + matchedBankNames);
                console.log("LOG : dialogflow-responseParser.ts : lets Check the length => " + matchedBankNames.length);
                if (matchedBankNames.length == 1) {
                    //                    let responseObject = {fulfillmentText : ("Cool. I found your bank. " + matchedBankNames[0]), outputContexts.paramters.bankName : "ICICI BANK KA Baccha limited"}
                    var responseObject = { fulfillmentText: ("Cool. I found your bank. " + matchedBankNames[0]) };
                    console.log("GOt the felllow " + resp.queryResult);
                    console.log("GOt the felllow " + resp.queryResult);
                    for (var _i = 0, _a = resp.queryResult.outputContexts; _i < _a.length; _i++) {
                        var eachContext = _a[_i];
                        if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup") {
                            eachContext.parameters["bankNameIdentified"] = "ICICI BANK ka Baccha";
                        }
                        responseObject["outputContexts"] = [eachContext];
                    }
                    //resolve("Cool. I found your bank. " + matchedBankNames[0])
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
            var queryResult = resp.queryResult.queryText;
            console.log("Query Result Bank Name : " + queryResult);
            resolve("NodejS Resoloving with : " + queryResult);
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
