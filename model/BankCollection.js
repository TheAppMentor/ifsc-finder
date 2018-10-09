"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankBranchDetail_1 = require("./BankBranchDetail");
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
        this.dataStore = new dbHandler_1.BankDB();
        this._allBankNames = Array();
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
    BankCollection.prototype.addBank = function (bank) {
        var _this = this;
        return new Promise(function (reslove, reject) {
            _this.findBankMatchingName("IC")
                .then(function () {
                console.log("Do Something... ");
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
        console.log("loadDataBasesWithDataFromFile");
        return this.dataStore.connectoToDBAndLoadData(this);
    };
    // Hydrate the Bank Collection
    BankCollection.prototype.hydrateBankCollection = function (fromCSVFilePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var content = fs.readFileSync(fromCSVFilePath, "utf8");
            var config = {
                delimiter: "|",
                newline: "",
                quoteChar: '"',
                escapeChar: '"',
                header: true,
                trimHeaders: false,
                dynamicTyping: false,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                step: undefined,
                complete: undefined,
                error: undefined,
                download: false,
                skipEmptyLines: false,
                chunk: undefined,
                fastMode: undefined,
                beforeFirstChunk: undefined,
                withCredentials: undefined,
                transform: undefined
            };
            // Parse local CSV file
            var results = Papa.parse(content, config);
            //console.log("Finished:", results.data);
            console.log("Meta Data:", results.meta);
            console.log("Error:", results.errors);
            var allBankNames = Array();
            // Get list of all unqiue bank names.
            for (var _i = 0, _a = results.data; _i < _a.length; _i++) {
                var eachBank = _a[_i];
                allBankNames.push(eachBank["BANK"]);
            }
            var uniqueBankNames = _.uniq(allBankNames);
            _this._allBankNames = _.uniq(allBankNames);
            console.log("All Bank Names are : " + _this._allBankNames);
            //this.bankNameStoreTrie = Trie.from(uniqueBankNames);
            var bankData = results.data;
            // Create a Map of Bank Name vs Bank Details
            var theMap = {};
            uniqueBankNames.forEach(function (eachBranch) {
                theMap[eachBranch] = Array();
            });
            results.data.forEach(function (eachBranchInfo) {
                var tempBranch = new BankBranchDetail_1.BankBranchDetail(eachBranchInfo);
                theMap[eachBranchInfo.BANK].push(tempBranch);
            });
            _this.bankNameToFileMap = theMap;
            //            console.log("Starting to create the hash Map now With %j", theMap["DENA BANK"])
            //            var _tempbankNameToFileMap : IHash  = {}
            //            Object.keys(theMap).forEach(function(key,index) {
            //                // key: the name of the object key
            //                // index: the ordinal position of the key within the object 
            //                let bankDetailsArr = theMap[key] 
            //                JSON.stringify(bankDetailsArr)
            //
            //                let fileName = '../data/BankDetails/' + key + ".json" 
            //                fs.writeJsonSync(fileName, JSON.stringify(bankDetailsArr), err => {
            //                    if (err) return console.error(err)
            //                    _tempbankNameToFileMap[String(key)] = fileName 
            //                }) 
            //            });
            //            this.bankNameToFileMap = _tempbankNameToFileMap
            //           
            //            console.log("Func Hydrate : bankNameToFileMap is : %j",_tempbankNameToFileMap)
            //            console.log("Func Hydrate : bankNameToFileMap is : %j",this.bankNameToFileMap)
            resolve(true);
        });
    };
    BankCollection.prototype.getAllBankNames = function () {
        console.log("In the Coll... goint to talk to datastore");
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
    BankCollection.prototype.getAllBranchesForBankNameInStateDistrictCity = function (bankName, stateName, cityName, districtName) {
        if (districtName === void 0) { districtName = null; }
        return this.dataStore.getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName);
        /*
        return new Promise((resolve,reject) => {
            this.loadBranchDetailsForBank(bankName)
                .then((allBranchDetails : Array<BankBranchDetail>) : Promise<Array<BankBranchDetail>>  => {
                    return new Promise((resolve,reject) => {
                        let branchesFilteredByState = allBranchDetails.filter(eachBranch => {
                            return eachBranch.state.toUpperCase() == stateName.toUpperCase()
                        })
                        resolve(branchesFilteredByState)
                    })
                })
                .then((branchesFilteredByState : Array<BankBranchDetail>) : Promise<Array<BankBranchDetail>> => {
                    return new Promise((resolve,reject) => {
                        if (districtName == null) {
                            resolve(branchesFilteredByState)
                        }
                        let branchesFilteredByDistrict = branchesFilteredByState .filter(eachBranch => {
                            return eachBranch.district.toUpperCase() == districtName.toUpperCase()
                        })
                        resolve(branchesFilteredByDistrict)
                    })
                })
                .then((branchesFilteredByDistrict: Array<BankBranchDetail>) : Promise<Array<BankBranchDetail>> => {
                    return new Promise((resolve,reject) => {
                        let branchesFilteredByCity = branchesFilteredByDistrict.filter(eachBranch => {
                            return eachBranch.city.toUpperCase() == cityName.toUpperCase()
                        })
                        resolve(branchesFilteredByCity)
                    })
                })
                .then((branchesFilteredByCity) => {
                    resolve(branchesFilteredByCity)
                })
                .catch((err) => {
                    reject(err)
                })

        })
        */
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
