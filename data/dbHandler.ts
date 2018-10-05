import { BankBranchDetail,BankBranchDetailSchema } from '../model/BankBranchDetail'
import { BankCollection } from '../model/BankCollection'
import { Bank } from '../model/Bank'

const fs = require('fs-extra-promise')
const Promise = require("bluebird");
const mongoose = require('mongoose')
var _ = require('lodash')
const db = mongoose.connection
mongoose.Promise = require('bluebird');

// Creating a Schema 
const bankNamesSchema = new mongoose.Schema({
    name: String
});

// Creating a Bank Model
const bankNamesModel = mongoose.model("BankName", bankNamesSchema)
const bankBranchDetailModel = mongoose.model("BankBranchDetail", BankBranchDetailSchema)

var connectedToDB : boolean = false 
const appConfigOptions = loadConfigFile()

function loadConfigFile(){
    let configFileName = "./appConfig.json"
    //let configFileName = "/Users/i328244/Desktop/NodeProjects/ifsc-finder/appConfig.json"
    let fileContents = fs.readJsonSync(configFileName)
    let reloadAllDB = fileContents['reloadAllDB'] 
    return fileContents 
}

export class BankDB {

    connectoToDBAndLoadData(bankCollection : BankCollection) : Promise<boolean> {
        return new Promise((resolve,reject) => {
            //mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj
            //mongoose.connect('mongodb://localhost/bankDetailsColl')
            mongoose.connect('mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj')
                .then(() => {
                    console.log("We have logged in... to the DB..")
                    if (appConfigOptions["reloadBankDetailsDB"] == true){
                        bankBranchDetailModel.collection.drop() // Drop old data before writing
                        return this.loadDBWithBankBankCollection(bankCollection)
                    }
                    console.log("User has chose not to load reloadBankDetailsDB")
                    Promise.resolve(true)
                })
                .then(() =>  {
                    if (appConfigOptions["reloadBankNamesDB"] == true){
                        return new Promise((resolve : any, reject : any) => {
                            bankNamesModel.collection.drop() // Drop old data before writing
                            this.loadBankNamesDB(bankCollection)
                            resolve(true)
                        })
                    }
                    console.log("User has chose not to load bank Names DB")
                    Promise.resolve(true)
                })
                .then(() => {
                    console.log("We have Initializing the Databases..")
                    bankNamesModel.find((err,values) => {
                        console.log("We have found tbanks.... : " + values.length)
                    })
                    bankBranchDetailModel.find((err,values) => {
                        console.log("We have found tbanks.... : " + values.length)
                    })
                    bankBranchDetailModel.find({name : "DENA BANK"},function(err,results){
                        console.log("We Found " + results.length + " DENA BANK Branches") 
                    })
                })
                .then(() => {
                    connectedToDB = true
                    console.log("We have connected to the DB and loaded all the data ... ")
                    resolve()
                })
                .catch((err) => {
                    console.log("We Have an Error connecting to Mongoose DB.")
                })
        })
    }

    private loadBankNamesDB(bankCollection : BankCollection) : Promise<any> {
        var numberOfDocumentsLoaded = 0

        const promises = bankCollection.allBankNames.map(eachBankName => {
            return new Promise((resolve : any, reject : any) => {
                var bankName = new bankNamesModel({name : eachBankName})

                bankName.save((err,bank) => {
                    if (err){
                        reject(Error("We have an error saving Bank Name"))
                    }
                    numberOfDocumentsLoaded += 1
                    resolve()
                })
            })
        }) 

        const finalPromise =  new Promise(function(resolve, reject){
            Promise.all(promises).then(function(values) {
                resolve(values)
            });
        })

        return finalPromise
    }

    private loadDBWithBankBankCollection(bankCollection : BankCollection) : Promise<boolean> {
        return new Promise((resolve : any, reject : any) => {
            console.log("loadDBWithBankBankCollection => Started")

            const promises =  bankCollection.allBankNames.map(eachBankName => {
                return new Promise((resolve:any,reject:any) => {
                    bankCollection.loadBranchDetailsForBank(eachBankName)
                        .then((bankDetailsArr : Array<BankBranchDetail>) => {
                            var bankDetailObj = bankDetailsArr.map(bankDetails => {

                                var bankBranchDetial = new bankBranchDetailModel({
                                    name : bankDetails.name, 
                                    ifsc : bankDetails.ifsc,
                                    micr : bankDetails.micr,
                                    branch : bankDetails.branch,
                                    address : bankDetails.address,
                                    contact : bankDetails.contact,
                                    city : bankDetails.city,
                                    district : bankDetails.district,
                                    state : bankDetails.state
                                })

                                return bankBranchDetial
                            })

                            bankBranchDetailModel.collection.insert(bankDetailObj,(err,branchDetail) => {
                                if (err){
                                    console.log("We have an error saving Bank Name")
                                    reject()
                                }
                                resolve(true)
                            })

                        })
                })
            })

            Promise.all(promises).then(() => {
                resolve(true)
            })
        })
    }

    getAllBankNames() : Promise<Array<string>>{
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.

            console.log("In datastore")
            bankNamesModel.find((err,values) => {
                console.log("We have found ALL .... : " + values.length)
            })
        })
    }

    getAllBankNamesMatching(bankName : string) : Promise<Array<string>>{
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.

            bankNamesModel.find({name : { $regex : new RegExp(bankName, "i") } },function(err,results){
                //bankBranchDetailModel.find({name : bankName},function(err,results){
                var bankNames = results.map(eachRec => {
                    return eachRec.name
                })
                var uniqbankNames = _.uniq(bankNames)
                let sortedUniqueBankNames = _.sortBy(uniqbankNames)
                console.log("Unique sorted names are... " + sortedUniqueBankNames)
                resolve(sortedUniqueBankNames)
            })
        })
    }

    getAllStateNamesForBank(bankName : string) : Promise<Array<string>>{
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            console.log("DB Handler : getAllStateNamesForBank ==> " + bankName)
            bankBranchDetailModel.find({name : { $regex : new RegExp(bankName, "i") } },function(err,results){
                var stateNames = results.map(eachRec => {
                    return eachRec.state
                })
                var uniqStateNames = _.uniq(stateNames)
                let sortedUniqueStateNames = _.sortBy(uniqStateNames)
                resolve(sortedUniqueStateNames)
            })
        })
    }

    getAllCityNamesForBank(bankName : string) : Promise<Array<string>>{

        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({name : { $regex : new RegExp(bankName, "i") } },function(err,results){
                var cityNames = results.map(eachRec => {
                    return eachRec.city
                })
                var uniqCityNames = _.uniq(cityNames)
                let sortedUniqueCityNames = _.sortBy(uniqCityNames)
                resolve(sortedUniqueCityNames)
            })
        })
    }



    getAllDistrictNamesForBank(bankName : string) : Promise<Array<string>>{

        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({name : { $regex : new RegExp(bankName, "i") } },function(err,results){

                let allDistrictNames = results.map(eachBranch => {
                    return eachBranch.district   
                })

                let uniqDistrictNames = _.uniq(allDistrictNames) 
                let sortedUniqueNames = _.sortBy(uniqDistrictNames) 
                console.log("Resolving with : " + sortedUniqueNames)
                resolve(sortedUniqueNames)
            })
        })
    }


    getAllBranchesForBankNameInCity(bankName : string, cityName : string) : Promise<Array<BankBranchDetail>> {
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({name : { $regex : new RegExp(bankName, "i") } , city : { $regex : new RegExp(cityName, "i") }},function(err,results){
                resolve(results)
            })
        })
    }


    getAllBranchesForBankNameInState(bankName : string, stateName : string) : Promise<Array<BankBranchDetail>> {
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({name : { $regex : new RegExp(bankName, "i") } , state : { $regex : new RegExp(stateName, "i") }},function(err,results){
                resolve(results)
            })
        })
    }


    getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
        return new Promise((resolve,reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name : { $regex : new RegExp(bankName, "i") } , 
                state : { $regex : new RegExp(stateName, "i") },
                city : { $regex : new RegExp(cityName, "i") }
                //district : { $regex : new RegExp(districtName, "i") },
            },function(err,results){
                console.log("Found the following reuslts... " + results)
                console.log("Count .... " + results.length)
                resolve(results)
            })
        })

    }

}

/*
db.on('error',console.error.bind(console, 'connection error:'));

db.on('open',function(){

    let appConfigOptions = loadConfigFile()
    let bankCollection = new BankCollection()

    bankCollection.hydrateBankCollection("../data/ifsc_codes_all_clean.csv")
        .then((isBankNamesDBLoaded : boolean) : Promise<boolean> => {
            if (appConfigOptions["reloadBankDetailsDB"] == true){

                bankBranchDetailModel.collection.drop() // Drop old data before writing
                return loadDBWithBankBankCollection(bankCollection)
            }
            console.log("User has chose not to load reloadBankDetailsDB")
            Promise.resolve(true)

        })
        .then((isBankCollHydrated : boolean) : Promise<boolean>  =>  {
            if (appConfigOptions["reloadBankNamesDB"] == true){
                return new Promise((resolve : any, reject : any) => {
                    if (isBankCollHydrated = true) {
                        bankNamesModel.collection.drop() // Drop old data before writing
                        loadBankNamesDB(bankCollection)
                        resolve(true)
                    }
                })
            }
            console.log("User has chose not to load bank Names DB")
            Promise.resolve(true)
        })
        .then(() => {
            console.log("We have Initializing the Databases..")
            bankNamesModel.find((err,values) => {
                console.log("We have found tbanks.... : " + values.length)
            })
            bankBranchDetailModel.find((err,values) => {
                console.log("We have found tbanks.... : " + values.length)
            })
            bankBranchDetailModel.find({name : "DENA BANK"},function(err,results){
                console.log("We Found " + results.length + " DENA BANK Branches") 
            })
        })
        .then(() => {
            connectedToDB = true
        })
});
 */
