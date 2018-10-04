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
                //resolve(queryResult.intent.displayName)
                _this.fullfillIntentWithName(queryResult.intent.displayName, dialogFlowResp);
            }
            resolve("Some Error man");
        });
    };
    DialogFlowRespParser.prototype.fullfillIntentWithName = function (intentName, response) {
        //Prashanth : Make this an enum here..       
        if (intentName == "getBankName") {
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
            bankColl.getAllBranchesForBankNameInCity("Dena Bank", "Bangalore")
                .then(function (matchedBranches) {
                resolve("We found many Branches.... ");
            });
        });
    };
    DialogFlowRespParser.prototype.fulfillGetBankNameIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult.queryText;
            console.log("Query Result Bank Name : " + queryResult);
            bankColl.getAllBranchesForBankNameInCity("Dena Bank", "Bangalore")
                .then(function (matchedBranches) {
                resolve("We found many Branches.... ");
            });
        });
    };
    DialogFlowRespParser.prototype.fulfillGetBankBranchNameIntent = function (dialogFlowResp) {
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult.queryText;
            console.log("Query Result Bank Name : " + queryResult);
            bankColl.getAllBranchesForBankNameInCity("Dena Bank", "Bangalore")
                .then(function (matchedBranches) {
                resolve("We found many Branches.... ");
            });
        });
    };
    return DialogFlowRespParser;
}());
exports.DialogFlowRespParser = DialogFlowRespParser;
