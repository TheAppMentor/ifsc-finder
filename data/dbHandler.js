"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankBranchDetail_1 = require("../model/BankBranchDetail");
var fs = require('fs-extra-promise');
var Promise = require("bluebird");
var mongoose = require('mongoose');
var _ = require('lodash');
var db = mongoose.connection;
mongoose.Promise = require('bluebird');
// Creating a Schema 
var bankNamesSchema = new mongoose.Schema({
    name: String
});
// Creating a Bank Model
var bankNamesModel = mongoose.model("BankName", bankNamesSchema);
var bankBranchDetailModel = mongoose.model("BankBranchDetail", BankBranchDetail_1.BankBranchDetailSchema);
var connectedToDB = false;
var appConfigOptions = loadConfigFile();
function loadConfigFile() {
    var configFileName = "./appConfig.json";
    //let configFileName = "/Users/i328244/Desktop/NodeProjects/ifsc-finder/appConfig.json"
    var fileContents = fs.readJsonSync(configFileName);
    var reloadAllDB = fileContents['reloadAllDB'];
    return fileContents;
}
var BankDB = /** @class */ (function () {
    function BankDB() {
    }
    BankDB.prototype.connectoToDBAndLoadData = function (bankCollection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj
            mongoose.connect('mongodb://localhost/bankDetailsColl')
                //mongoose.connect('mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj')
                .then(function () {
                console.log("We have logged in... to the DB..");
                if (appConfigOptions["reloadBankDetailsDB"] == true) {
                    bankBranchDetailModel.collection.drop(); // Drop old data before writing
                    return _this.loadDBWithBankBankCollection(bankCollection);
                }
                console.log("User has chose not to load reloadBankDetailsDB");
                Promise.resolve(true);
            })
                .then(function () {
                if (appConfigOptions["reloadBankNamesDB"] == true) {
                    return new Promise(function (resolve, reject) {
                        bankNamesModel.collection.drop(); // Drop old data before writing
                        _this.loadBankNamesDB(bankCollection);
                        resolve(true);
                    });
                }
                console.log("User has chose not to load bank Names DB");
                Promise.resolve(true);
            })
                .then(function () {
                console.log("We have Initializing the Databases..");
                bankNamesModel.find(function (err, values) {
                    console.log("We have found tbanks.... : " + values.length);
                });
                bankBranchDetailModel.find(function (err, values) {
                    console.log("We have found tbanks.... : " + values.length);
                });
                bankBranchDetailModel.find({ name: "DENA BANK" }, function (err, results) {
                    console.log("We Found " + results.length + " DENA BANK Branches");
                });
            })
                .then(function () {
                connectedToDB = true;
                console.log("We have connected to the DB and loaded all the data ... ");
                resolve();
            })
                .catch(function (err) {
                console.log("We Have an Error connecting to Mongoose DB.");
            });
        });
    };
    BankDB.prototype.loadBankNamesDB = function (bankCollection) {
        var numberOfDocumentsLoaded = 0;
        var promises = bankCollection.allBankNames.map(function (eachBankName) {
            return new Promise(function (resolve, reject) {
                var bankName = new bankNamesModel({ name: eachBankName });
                bankName.save(function (err, bank) {
                    if (err) {
                        reject(Error("We have an error saving Bank Name"));
                    }
                    numberOfDocumentsLoaded += 1;
                    resolve();
                });
            });
        });
        var finalPromise = new Promise(function (resolve, reject) {
            Promise.all(promises).then(function (values) {
                resolve(values);
            });
        });
        return finalPromise;
    };
    BankDB.prototype.loadDBWithBankBankCollection = function (bankCollection) {
        return new Promise(function (resolve, reject) {
            console.log("loadDBWithBankBankCollection => Started");
            var promises = bankCollection.allBankNames.map(function (eachBankName) {
                return new Promise(function (resolve, reject) {
                    bankCollection.loadBranchDetailsForBank(eachBankName)
                        .then(function (bankDetailsArr) {
                        var bankDetailObj = bankDetailsArr.map(function (bankDetails) {
                            var bankBranchDetial = new bankBranchDetailModel({
                                name: bankDetails.name,
                                ifsc: bankDetails.ifsc,
                                micr: bankDetails.micr,
                                branch: bankDetails.branch,
                                address: bankDetails.address,
                                contact: bankDetails.contact,
                                city: bankDetails.city,
                                district: bankDetails.district,
                                state: bankDetails.state
                            });
                            return bankBranchDetial;
                        });
                        bankBranchDetailModel.collection.insert(bankDetailObj, function (err, branchDetail) {
                            if (err) {
                                console.log("We have an error saving Bank Name");
                                reject();
                            }
                            resolve(true);
                        });
                    });
                });
            });
            Promise.all(promises).then(function () {
                resolve(true);
            });
        });
    };
    BankDB.prototype.getAllBankNames = function () {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            console.log("In datastore");
            bankNamesModel.find(function (err, values) {
                console.log("We have found ALL .... : " + values.length);
            });
        });
    };
    BankDB.prototype.getAllBankNamesMatching = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            bankNamesModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                //bankBranchDetailModel.find({name : bankName},function(err,results){
                var bankNames = results.map(function (eachRec) {
                    return eachRec.name;
                });
                console.log("Resolving with : ", bankNames);
                resolve(bankNames);
                //var uniqbankNames = _.uniq(bankNames)
                //let sortedUniqueBankNames = _.sortBy(uniqbankNames)
                //console.log("Unique sorted names are... " + sortedUniqueBankNames)
                //
                //
                //:w
                //resolve(sortedUniqueBankNames)
            });
        });
    };
    BankDB.prototype.getAllStateNamesForBank = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            console.log("DB Handler : getAllStateNamesForBank ==> " + bankName);
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var stateNames = results.map(function (eachRec) {
                    return eachRec.state;
                });
                var uniqStateNames = _.uniq(stateNames);
                var sortedUniqueStateNames = _.sortBy(uniqStateNames);
                resolve(sortedUniqueStateNames);
            });
        });
    };
    BankDB.prototype.getAllCityNamesForBank = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var cityNames = results.map(function (eachRec) {
                    return eachRec.city;
                });
                var uniqCityNames = _.uniq(cityNames);
                var sortedUniqueCityNames = _.sortBy(uniqCityNames);
                resolve(sortedUniqueCityNames);
            });
        });
    };
    BankDB.prototype.getAllDistrictNamesForBank = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var allDistrictNames = results.map(function (eachBranch) {
                    return eachBranch.district;
                });
                var uniqDistrictNames = _.uniq(allDistrictNames);
                var sortedUniqueNames = _.sortBy(uniqDistrictNames);
                console.log("Resolving with : " + sortedUniqueNames);
                resolve(sortedUniqueNames);
            });
        });
    };
    BankDB.prototype.getAllBranchesForBankNameInCity = function (bankName, cityName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") }, city: { $regex: new RegExp(cityName, "i") } }, function (err, results) {
                resolve(results);
            });
        });
    };
    BankDB.prototype.getAllBranchesForBankNameInState = function (bankName, stateName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") }, state: { $regex: new RegExp(stateName, "i") } }, function (err, results) {
                resolve(results);
            });
        });
    };
    BankDB.prototype.getAllBranchesForBankNameInStateDistrictCity = function (bankName, stateName, cityName, districtName) {
        if (districtName === void 0) { districtName = null; }
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") },
                state: { $regex: new RegExp(stateName, "i") },
                city: { $regex: new RegExp(cityName, "i") }
                //district : { $regex : new RegExp(districtName, "i") },
            }, function (err, results) {
                console.log("Found the following reuslts... " + results);
                console.log("Count .... " + results.length);
                resolve(results);
            });
        });
    };
    return BankDB;
}());
exports.BankDB = BankDB;
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
