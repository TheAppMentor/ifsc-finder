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
        this._allBankNames = Array();
        this.dataStore = new BankDB();
    }
    getAllBranchesCount(bankName = "") {
        return this.dataStore.getAllBranchesCount(bankName);
    }
    findBankNameContainingString(bankName) {
        return this.dataStore.getAllBankNamesMatching(bankName);
    }
    findBankMatchingName(name) {
        return new Promise((resolve, reject) => {
            resolve(this.bankNameStoreTrie.find(name));
        });
    }
    getAllBankNamesCount() {
        return this.dataStore.getAllBankNamesCount();
    }
    getLocationCountForBankName(bankName, queryString) {
        return this.dataStore.getLocationCountForBankName(bankName, queryString);
    }
    getBranchCountForBankNameInCity(bankName, cityName) {
        return this.dataStore.getBranchCountForBankNameInCity(bankName, cityName);
    }
    addBank(bank) {
        return new Promise((reslove, reject) => {
            this.findBankMatchingName("IC")
                .then(() => {
                //console.log("Do Something... ")
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
        return this.dataStore.connectoToDBAndLoadData(this);
    }
    getBankMetaData() {
        return this.dataStore.getBankMetaData();
    }
    getAllBankNames() {
        return this.dataStore.getAllBankNames();
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
    //new API with split db and querysting passed to mongodb for filtering.
    //
    getAllCityNamesForBankMatchingQueryString(bankName, queryString) {
        return this.dataStore.getAllCityNamesForBankMatchingQueryString(bankName, queryString);
    }
    getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, cityName, queryString) {
        // Note this searches Address fields also. From the logs I can see the users dont seem to know the branch name and they are searching by Addresss etc.
        return this.dataStore.getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, cityName, queryString);
    }
    getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName = null) {
        return this.dataStore.getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName);
    }
    getAllBranchesForBankNameInState(bankName, stateName) {
        return this.dataStore.getAllBranchesForBankNameInState(bankName, stateName);
    }
    getAllBranchesForBankNameInCity(bankName, cityName) {
        return this.dataStore.getAllBranchesForBankNameInCity(bankName, cityName);
    }
    getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName) {
        return this.dataStore.getAllBranchesForBankNameInCityBranchName(bankName, cityName, branchName);
    }
    getAllBranchNamesForBankNameInCity(bankName, cityName) {
        return this.dataStore.getAllBranchNamesForBankNameInCity(bankName, cityName);
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
