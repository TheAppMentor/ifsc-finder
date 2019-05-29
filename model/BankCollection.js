"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbHandler_1 = require("../data/dbHandler");
var Papa = require('papaparse');
var _ = require('lodash');
var Promise = require("bluebird");
var Trie = require('mnemonist/trie');
//var fs = require('fs')
var fs = require('fs-extra-promise');
var BankCollection = /** @class */ (function () {
    function BankCollection() {
        this.bankNameStoreTrie = Trie.from([]);
        this.bankNameToFileMap = {};
        this._allBankNames = Array();
        this.dataStore = new dbHandler_1.BankDB();
    }
    BankCollection.prototype.getAllBranchesCount = function (bankName) {
        if (bankName === void 0) { bankName = ""; }
        return this.dataStore.getAllBranchesCount(bankName);
    };
    BankCollection.prototype.findBankNameContainingString = function (bankName) {
        return this.dataStore.getAllBankNamesMatching(bankName);
    };
    BankCollection.prototype.findBankMatchingName = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.bankNameStoreTrie.find(name));
        });
    };
    BankCollection.prototype.getAllBankNamesCount = function () {
        return this.dataStore.getAllBankNamesCount();
    };
    BankCollection.prototype.getLocationCountForBankName = function (bankName, queryString) {
        return this.dataStore.getLocationCountForBankName(bankName, queryString);
    };
    BankCollection.prototype.getBranchCountForBankNameInCity = function (bankName, cityName) {
        return this.dataStore.getBranchCountForBankNameInCity(bankName, cityName);
    };
    BankCollection.prototype.addBank = function (bank) {
        var _this = this;
        return new Promise(function (reslove, reject) {
            _this.findBankMatchingName("IC")
                .then(function () {
                //console.log("Do Something... ")
            });
        });
    };
    BankCollection.prototype.fetchFileNameForBank = function (bankName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.bankNameToFileMap[bankName]);
            if (_this.bankNameToFileMap[bankName] != null) {
                resolve(_this.bankNameToFileMap[bankName]);
            }
            reject(Error("Unable to find bank name : " + bankName));
        });
    };
    Object.defineProperty(BankCollection.prototype, "allBankNames", {
        get: function () {
            return this._allBankNames;
        },
        enumerable: true,
        configurable: true
    });
    BankCollection.prototype.loadDataBasesWithDataFromFile = function () {
        return this.dataStore.connectoToDBAndLoadData(this);
    };
    BankCollection.prototype.getBankMetaData = function () {
        return this.dataStore.getBankMetaData();
    };
    BankCollection.prototype.getAllBankNames = function () {
        return this.dataStore.getAllBankNames();
    };
    BankCollection.prototype.loadBranchDetailsForBank = function (bankName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //TODO : This is loading from File everytime.. Modify this to load from cache.
            if (_this.bankNameToFileMap.hasOwnProperty(bankName)) {
                var bankFileName = _this.bankNameToFileMap[bankName];
                resolve(bankFileName);
            }
            reject(Error("Bank Name Not found in bankNameToFileMap"));
        });
    };
    //new API with split db and querysting passed to mongodb for filtering.
    //
    BankCollection.prototype.getAllCityNamesForBankMatchingQueryString = function (bankName, queryString) {
        return this.dataStore.getAllCityNamesForBankMatchingQueryString(bankName, queryString);
    };
    BankCollection.prototype.getAllBranchNamesForBankNameInCityMatchingQueryString = function (bankName, cityName, queryString) {
        // Note this searches Address fields also. From the logs I can see the users dont seem to know the branch name and they are searching by Addresss etc.
        return this.dataStore.getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, cityName, queryString);
    };
    BankCollection.prototype.getAllBranchesForBankNameInStateDistrictCity = function (bankName, stateName, cityName, districtName) {
        if (districtName === void 0) { districtName = null; }
        return this.dataStore.getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName);
    };
    BankCollection.prototype.getAllBranchesForBankNameInState = function (bankName, stateName) {
        return this.dataStore.getAllBranchesForBankNameInState(bankName, stateName);
    };
    BankCollection.prototype.getAllBranchesForBankNameInCity = function (bankName, cityName) {
        return this.dataStore.getAllBranchesForBankNameInCity(bankName, cityName);
    };
    BankCollection.prototype.getBranchesDetailsForBankInCityWithBranchName = function (bankName, cityName, branchName) {
        return this.dataStore.getAllBranchesForBankNameInCityBranchName(bankName, cityName, branchName);
    };
    BankCollection.prototype.getAllBranchNamesForBankNameInCity = function (bankName, cityName) {
        return this.dataStore.getAllBranchNamesForBankNameInCity(bankName, cityName);
    };
    BankCollection.prototype.getAllStateNamesForBank = function (bankName) {
        return this.dataStore.getAllStateNamesForBank(bankName);
    };
    BankCollection.prototype.getAllCityNamesForBank = function (bankName) {
        return this.dataStore.getAllCityNamesForBank(bankName);
    };
    BankCollection.prototype.getAllDistrictNamesForBank = function (bankName) {
        return this.dataStore.getAllDistrictNamesForBank(bankName);
    };
    return BankCollection;
}());
exports.BankCollection = BankCollection;
