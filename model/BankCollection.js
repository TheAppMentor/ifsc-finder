import { BankBranchDetail } from './BankBranchDetail';
import { BankDB } from '../data/dbHandler';
var Papa = require('papaparse');
var _ = require('lodash');
var Promise = require("bluebird");
var Trie = require('mnemonist/trie');
//var fs = require('fs')
const fs = require('fs-extra-promise');
export class BankCollection {
    constructor() {
        this.bankNameStoreTrie = Trie.from([]);
        this.bankNameToFileMap = {};
        this.dataStore = new BankDB();
        this._allBankNames = Array();
    }
    findBankMatchingName(name) {
        return new Promise((resolve, reject) => {
            resolve(this.bankNameStoreTrie.find(name));
        });
    }
    addBank(bank) {
        return new Promise((reslove, reject) => {
            this.findBankMatchingName("IC")
                .then(() => {
                console.log("Do Something... ");
            });
        });
    }
    fetchFileNameForBank(bankName) {
        return new Promise((resolve, reject) => {
            resolve(this.bankNameToFileMap[bankName]);
            if (this.bankNameToFileMap[bankName] != null) {
                resolve(this.bankNameToFileMap[bankName]);
            }
            reject(Error("Unable to find bank name : " + bankName));
        });
    }
    get allBankNames() {
        return this._allBankNames;
    }
    loadDataBasesWithDataFromFile() {
        console.log("loadDataBasesWithDataFromFile");
        return this.dataStore.connectoToDBAndLoadData(this);
    }
    // Hydrate the Bank Collection
    hydrateBankCollection(fromCSVFilePath) {
        return new Promise((resolve, reject) => {
            var content = fs.readFileSync(fromCSVFilePath, "utf8");
            let config = {
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
            let results = Papa.parse(content, config);
            //console.log("Finished:", results.data);
            console.log("Meta Data:", results.meta);
            console.log("Error:", results.errors);
            var allBankNames = Array();
            // Get list of all unqiue bank names.
            for (var eachBank of results.data) {
                allBankNames.push(eachBank["BANK"]);
            }
            let uniqueBankNames = _.uniq(allBankNames);
            this._allBankNames = _.uniq(allBankNames);
            //this.bankNameStoreTrie = Trie.from(uniqueBankNames);
            let bankData = results.data;
            // Create a Map of Bank Name vs Bank Details
            let theMap = {};
            uniqueBankNames.forEach(eachBranch => {
                theMap[eachBranch] = Array();
            });
            results.data.forEach(eachBranchInfo => {
                let tempBranch = new BankBranchDetail(eachBranchInfo);
                theMap[eachBranchInfo.BANK].push(tempBranch);
            });
            this.bankNameToFileMap = theMap;
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
    }
    loadBranchDetailsForBank(bankName) {
        return new Promise((resolve, reject) => {
            //TODO : This is loading from File everytime.. Modify this to load from cache.
            if (this.bankNameToFileMap.hasOwnProperty(bankName)) {
                let bankFileName = this.bankNameToFileMap[bankName];
                resolve(bankFileName);
            }
            reject(Error("Bank Name Not found in bankNameToFileMap"));
        });
    }
    getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName = null) {
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
    }
    getAllBranchesForBankNameInState(bankName, stateName) {
        return this.dataStore.getAllBranchesForBankNameInState(bankName, stateName);
    }
    getAllBranchesForBankNameInCity(bankName, cityName) {
        return this.dataStore.getAllBranchesForBankNameInCity(bankName, cityName);
    }
    getAllStateNamesForBank(bankName) {
        return this.dataStore.getAllStateNamesForBank(bankName);
    }
    getAllCityNamesForBank(bankName) {
        return this.dataStore.getAllCityNamesForBank(bankName);
    }
    getAllDistrictNamesForBank(bankName) {
        return this.dataStore.getAllDistrictNamesForBank(bankName);
    }
}
