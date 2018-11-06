import { BankBranchDetail } from './BankBranchDetail'
import { Bank } from './Bank'
import { BankDB } from '../data/dbHandler'

var Papa = require('papaparse')
var _ = require('lodash')
var Promise = require("bluebird");
var Trie = require('mnemonist/trie');

//var fs = require('fs')
const fs = require('fs-extra-promise')
//Promise.promisifyAll(fs);

export interface IHash {
    [details: string] : string;
} 

export class BankCollection {
    
    getAllBranchesCount(bankName : string = "") : Promise<number>{
        return this.dataStore.getAllBranchesCount(bankName)
    }
    
    findBankNameContainingString(bankName : string) : Promise<Array<string>> {
        return this.dataStore.getAllBankNamesMatching(bankName)
    }

    findBankMatchingName(name : string) : Promise<Array<string>> {
        return new Promise((resolve,reject) => {
            resolve(this.bankNameStoreTrie.find(name))
        }) 
    }

    getAllBankNamesCount() : Promise<number>{
        return this.dataStore.getAllBankNamesCount()
    }

    getLocationCountForBankName(bankName : string, queryString : string) : Promise<number>{
        return this.dataStore.getLocationCountForBankName(bankName, queryString)
    }


    addBank(bank : Bank) : Promise<boolean> {
        return new Promise((reslove,reject) => {
            this.findBankMatchingName("IC")
                .then(() => {
                    console.log("Do Something... ")
                })
        }) 
    }

    fetchFileNameForBank(bankName : string) : Promise<string>{
        return new Promise((resolve,reject) => {
            resolve(this.bankNameToFileMap[bankName]) 
            if (this.bankNameToFileMap[bankName] != null) {
                resolve(this.bankNameToFileMap[bankName]) 
            } reject(Error("Unable to find bank name : " + bankName))
        })

    }

    private bankNameStoreTrie  = Trie.from([]);
    private bankNameToFileMap : IHash = {}
    private dataStore 
    private _allBankNames = Array<string>() 

    get allBankNames() : Array<string>{
        return this._allBankNames 
    } 
   
    loadDataBasesWithDataFromFile() : Promise<boolean> {
        console.log("Function Calling : loadDataBasesWithDataFromFile")
        return this.dataStore.connectoToDBAndLoadData(this)  
    }

    constructor(){
        //console.log("Constructor Calling : loadDataBasesWithDataFromFile")
        //this.loadDataBasesWithDataFromFile()
        this.dataStore = new BankDB() 
    }

    getBankMetaData() : Promise<Array<string>> {
        console.log("In the Coll... goint to talk to datastore")
        return this.dataStore.getBankMetaData()
    }

    getAllBankNames() : Promise<Array<string>> {
        console.log("In the Coll... goint to talk to datastore")
        return this.dataStore.getAllBankNames()
    }

    loadBranchDetailsForBank(bankName : string) : Promise<Array<BankBranchDetail>> {
        return new Promise((resolve,reject) => {
            //TODO : This is loading from File everytime.. Modify this to load from cache.

            if (this.bankNameToFileMap.hasOwnProperty(bankName)){
                let bankFileName = this.bankNameToFileMap[bankName] 
                resolve(bankFileName)
            }
            reject(Error("Bank Name Not found in bankNameToFileMap"))
        })
    }



    //new API with split db and querysting passed to mongodb for filtering.
    //

    getAllCityNamesForBankMatchingQueryString(bankName : string,queryString : string) : Promise<Array<string>>{
        return this.dataStore.getAllCityNamesForBankMatchingQueryString(bankName,queryString)
    }


    getAllBranchNamesForBankNameInCityMatchingQueryString(bankName : string, cityName : string, queryString : string) : Promise<Array<string>> {
        return this.dataStore.getAllBranchNamesForBankNameInCityMatchingQueryString(bankName,cityName,queryString)
    }    





    getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInStateDistrictCity(bankName,stateName,cityName,districtName)
    }

    getAllBranchesForBankNameInState(bankName : string, stateName : string) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInState(bankName,stateName)
    }

    getAllBranchesForBankNameInCity(bankName : string, cityName : string) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInCity(bankName,cityName)
    }

    getBranchesDetailsForBankInCityWithBranchName(bankName : string, cityName : string, branchName : string) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInCityBranchName(bankName,cityName,branchName)
    }

    getAllBranchNamesForBankNameInCity(bankName : string, cityName : string) : Promise<Array<string>> {
        return this.dataStore.getAllBranchNamesForBankNameInCity(bankName,cityName)
    }    
    getAllStateNamesForBank(bankName : string) : Promise<Array<string>>{
        return this.dataStore.getAllStateNamesForBank(bankName)
    }

    getAllCityNamesForBank(bankName : string) : Promise<Array<string>>{
        return this.dataStore.getAllCityNamesForBank(bankName)
    }

    getAllDistrictNamesForBank(bankName : string) : Promise<Array<string>>{
        return this.dataStore.getAllDistrictNamesForBank(bankName)
    }
}
