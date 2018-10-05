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
    
    findBankNameContainingString(bankName : string){
        console.log("Bank Collection : ...... ")
        console.log("All Bank Names are : " + this._allBankNames)
        return this.dataStore.getAllBankNamesMatching(bankName)
    }

    findBankMatchingName(name : string) : Promise<Array<string>> {
        return new Promise((resolve,reject) => {
            resolve(this.bankNameStoreTrie.find(name))
        }) 
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
    private dataStore = new BankDB() 

    private _allBankNames = Array<string>() 

    get allBankNames() : Array<string>{
        return this._allBankNames 
    } 
    
    loadDataBasesWithDataFromFile() : Promise<boolean> {
        console.log("loadDataBasesWithDataFromFile")
        return this.dataStore.connectoToDBAndLoadData(this)  
    }

    // Hydrate the Bank Collection
    hydrateBankCollection(fromCSVFilePath : string) : Promise<boolean> {
        return new Promise((resolve : any, reject : any) => {

            var content = fs.readFileSync(fromCSVFilePath, "utf8");

            let config = {
                delimiter: "|",	// auto-detect
                newline: "",	// auto-detect
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
            }

            // Parse local CSV file
            let results = Papa.parse(content, config)

            //console.log("Finished:", results.data);
            console.log("Meta Data:", results.meta);
            console.log("Error:", results.errors);

            var allBankNames = Array<string>()
            
            // Get list of all unqiue bank names.
            for (var eachBank of results.data){
                allBankNames.push(eachBank["BANK"])
            }
           
            let uniqueBankNames = _.uniq(allBankNames) 
            this._allBankNames = _.uniq(allBankNames)
            console.log("All Bank Names are : " + this._allBankNames)
            //this.bankNameStoreTrie = Trie.from(uniqueBankNames);

            let bankData = results.data 
            // Create a Map of Bank Name vs Bank Details
            let theMap = {}

            uniqueBankNames.forEach(eachBranch => {
                theMap[eachBranch] = Array<BankBranchDetail>()
            })

            results.data.forEach(eachBranchInfo => {
                let tempBranch = new BankBranchDetail(eachBranchInfo) 
                theMap[eachBranchInfo.BANK].push(tempBranch)
            })

            this.bankNameToFileMap = theMap
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

            resolve(true)
        })  
    }

    constructor(){
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

    getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInStateDistrictCity(bankName,stateName,cityName,districtName)
    }

    getAllBranchesForBankNameInState(bankName : string, stateName : string) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInState(bankName,stateName)
    }

    getAllBranchesForBankNameInCity(bankName : string, cityName : string) : Promise<Array<BankBranchDetail>> {
        return this.dataStore.getAllBranchesForBankNameInCity(bankName,cityName)
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
