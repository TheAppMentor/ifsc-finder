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
        return new Promise(function (resolve, reject) {
            var resp = parseJson(dialogFlowResp);
            var queryResult = resp.queryResult;
            console.log("allRequiredParamsPresent : " + queryResult.allRequiredParamsPresent);
            if (queryResult.allRequiredParamsPresent == true) {
                console.log("We have all required parameters.... ");
                resolve(queryResult.intent.displayName);
            }
            resolve("Some Error man");
        });
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
    return DialogFlowRespParser;
}());
exports.DialogFlowRespParser = DialogFlowRespParser;
