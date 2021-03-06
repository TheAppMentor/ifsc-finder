"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankBranchDetail_1 = require("../model/BankBranchDetail");
var fs = require('fs-extra-promise');
var Promise = require("bluebird");
var mongoose = require('mongoose');
var decompress = require('decompress');
var _ = require('lodash');
//const db = mongoose.connection
mongoose.Promise = require('bluebird');
// Creating a Schema 
var bankNamesSchema = new mongoose.Schema({
    name: String
});
// Creating a Schema 
var bankMetaDataSchema = new mongoose.Schema({
    bankName: String,
    branchCount: String,
    locationCount: String,
    stateCount: String,
    isPopular: String
});
// Creating a Bank Model
var bankNamesModel = mongoose.model("BankName", bankNamesSchema);
var bankMetaDataModel = mongoose.model("bankMetaData", bankMetaDataSchema);
var bankBranchDetailModel = mongoose.model("BankBranchDetail", BankBranchDetail_1.BankBranchDetailSchema);
var allahabadBankModel = mongoose.model("allahabadBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var andhraBankModel = mongoose.model("andhraBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var axisBankModel = mongoose.model("axisBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var bankOfBarodaBobModel = mongoose.model("bankOfBarodaBobModel", BankBranchDetail_1.BankBranchDetailSchema);
var bankOfIndiaBoiModel = mongoose.model("bankOfIndiaBoiModel", BankBranchDetail_1.BankBranchDetailSchema);
var canaraBankModel = mongoose.model("canaraBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var centralBankOfIndiaModel = mongoose.model("centralBankOfIndiaModel", BankBranchDetail_1.BankBranchDetailSchema);
var corporationBankModel = mongoose.model("corporationBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var hdfcBankModel = mongoose.model("hdfcBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var iciciBankLimitedModel = mongoose.model("iciciBankLimitedModel", BankBranchDetail_1.BankBranchDetailSchema);
var idbiBankModel = mongoose.model("idbiBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var indianBankModel = mongoose.model("indianBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var indianOverseasBankIobModel = mongoose.model("indianOverseasBankIobModel", BankBranchDetail_1.BankBranchDetailSchema);
var orientalBankOfCommerceModel = mongoose.model("orientalBankOfCommerceModel", BankBranchDetail_1.BankBranchDetailSchema);
var otherBanksModel = mongoose.model("otherBanksModel", BankBranchDetail_1.BankBranchDetailSchema);
var punjabNationalBankPnbModel = mongoose.model("punjabNationalBankPnbModel", BankBranchDetail_1.BankBranchDetailSchema);
var stateBankOfIndiaSbiModel = mongoose.model("stateBankOfIndiaSbiModel", BankBranchDetail_1.BankBranchDetailSchema);
var syndicateBankModel = mongoose.model("syndicateBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var ucoBankModel = mongoose.model("ucoBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var unionBankBankModel = mongoose.model("unionBankBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var yesBankModel = mongoose.model("yesBankModel", BankBranchDetail_1.BankBranchDetailSchema);
var connectedToDB = false;
var appConfigOptions = loadConfigFile();
function loadConfigFile() {
    var configFileName = "./appConfig.json";
    //let configFileName = "/Users/i328244/Desktop/NodeProjects/ifsc-finder/appConfig.json"
    var fileContents = fs.readJsonSync(configFileName);
    var reloadAllDB = fileContents['reloadAllDB'];
    return fileContents;
}
// TODO Dont do this.. you have the popular banks tagged in the Meta Data.. fetch it from that.. Hard coding this will make all kind of shitty dependencies.
var popularBanks = ["ALLAHABAD BANK", "ANDHRA BANK", "AXIS BANK LTD", "BANK OF BARODA (BOB)", "BANK OF INDIA (BOI)", "CANARA BANK", "CENTRAL BANK OF INDIA", "CORPORATION BANK", "HDFC BANK LTD", "ICICI BANK LTD", "IDBI LTD", "INDIAN BANK", "INDIAN OVERSEAS BANK (IOB)", "ORIENTAL BANK OF COMMERCE (OBC)", "PUNJAB NATIONAL BANK (PNB)", "STATE BANK OF INDIA (SBI)", "SYNDICATE BANK", "UCO BANK", "UNION BANK OF INDIA", "YES BANK LTD",];
var getModelForBankName = function (bankName) {
    console.log("IN FUNC... " + bankName);
    switch (bankName) {
        case "ALLAHABAD BANK": {
            return allahabadBankModel;
            break;
        }
        case "ANDHRA BANK": {
            return andhraBankModel;
            break;
        }
        case "AXIS BANK LTD": {
            return axisBankModel;
            break;
        }
        case "BANK OF BARODA (BOB)": {
            return bankOfBarodaBobModel;
            break;
        }
        case "BANK OF INDIA (BOI)": {
            return bankOfIndiaBoiModel;
            break;
        }
        case "CANARA BANK": {
            return canaraBankModel;
            break;
        }
        case "CENTRAL BANK OF INDIA": {
            return centralBankOfIndiaModel;
            break;
        }
        case "CORPORATION BANK": {
            return corporationBankModel;
            break;
        }
        case "HDFC BANK LTD": {
            return hdfcBankModel;
            break;
        }
        case "ICICI BANK LTD": {
            return iciciBankLimitedModel;
            break;
        }
        case "IDBI LTD": {
            return idbiBankModel;
            break;
        }
        case "INDIAN BANK": {
            return indianBankModel;
            break;
        }
        case "INDIAN OVERSEAS BANK (IOB)": {
            return indianOverseasBankIobModel;
            break;
        }
        case "ORIENTAL BANK OF COMMERCE (OBC)": {
            return orientalBankOfCommerceModel;
            break;
        }
        case "PUNJAB NATIONAL BANK (PNB)": {
            return punjabNationalBankPnbModel;
            break;
        }
        case "STATE BANK OF INDIA (SBI)": {
            return stateBankOfIndiaSbiModel;
            break;
        }
        case "SYNDICATE BANK": {
            return syndicateBankModel;
            break;
        }
        case "UCO BANK": {
            return ucoBankModel;
            break;
        }
        case "UNION BANK OF INDIA": {
            return unionBankBankModel;
            break;
        }
        case "YES BANK LTD": {
            console.log("Returning .. YES BANK : " + yesBankModel);
            return yesBankModel;
            break;
        }
        default:
            return otherBanksModel;
            break;
    }
};
var MONGODB_URI = "mongodb://localhost/localtest";
if (process.env.IS_HEROKU == "true") {
    MONGODB_URI = process.env.MONGODB_URI;
    MONGODB_URI = "mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj";
}
var BankDB = /** @class */ (function () {
    function BankDB() {
    }
    BankDB.prototype.connectoToDBAndLoadData = function (bankCollection) {
        return new Promise(function (resolve, reject) {
            console.log("MONGODB : Connecting to .... " + MONGODB_URI);
            mongoose.connect(MONGODB_URI)
                .then(function () {
                // Check if app config requires us to reload the DB.
                if (appConfigOptions["reloadBankDetailsDB"] == false) {
                    return Promise.resolve(true);
                }
                return new Promise(function (resolve, reject) {
                    decompress('./Split_Records.zip', 'dist')
                        .then(function (unzipComplete) {
                        // Load Meta Data 
                        // Load Bank MetaData Table 
                        var bankMetaData = fs.readJsonSync("./dist/Split_Records/BankMetaData.json");
                        var allMetaDataModels = _.map(bankMetaData, function (eachBankRec) {
                            var tempModel = new bankMetaDataModel({
                                bankName: eachBankRec["bankName"],
                                branchCount: eachBankRec["branchCount"],
                                locationCount: eachBankRec["locationCount"],
                                stateCount: eachBankRec["stateCount"],
                                isPopular: eachBankRec["isPopular"]
                            });
                            return tempModel;
                        });
                        bankMetaDataModel.collection.drop(); // Drop old data before writing
                        bankMetaDataModel.insertMany(allMetaDataModels)
                            .then(function (docs) {
                            resolve(true);
                        })
                            .catch(function (err) {
                            reject("Error !! : Writing Meta Data " + err);
                        });
                    }).then(function () {
                        // Make DB for Other Banks
                        return new Promise(function (resolve, reject) {
                            var otherBankData = fs.readJsonSync("./dist/Split_Records/otherBanks.json");
                            var currentModel = getModelForBankName("otherBanksModel"); // Default model is otherBanksModel
                            var allBankDocs = _.map(otherBankData, function (eachBankRec) {
                                var tempBankDetail = new currentModel({
                                    name: eachBankRec["name"],
                                    ifsc: eachBankRec["ifsc"],
                                    micr: eachBankRec["micr"],
                                    branch: eachBankRec["branch"],
                                    address: eachBankRec["address"],
                                    contact: eachBankRec["contact"],
                                    city: eachBankRec["city"],
                                    district: eachBankRec["district"],
                                    state: eachBankRec["state"],
                                    pincode: eachBankRec["pincode"]
                                });
                                return tempBankDetail;
                            });
                            currentModel.collection.drop();
                            console.log("Inserting other bank docs.......  :" + allBankDocs.length);
                            currentModel.insertMany(allBankDocs)
                                .then(function (docs) {
                                console.log("Success !! : Inserting Other Bank Data " + docs.length);
                                resolve(true);
                            })
                                .catch(function (err) {
                                console.log("Error !! : Writing Other Bank Data " + err);
                            });
                        });
                    }).then(function () {
                        // Make DB for Popular Banks
                        return new Promise(function (resolve, reject) {
                            console.log("<============= Startin with POP BANKS =============>");
                            _.map(popularBanks, function (eachPopBank) {
                                console.log("<============= Staring :" + eachPopBank + "=============>");
                                var currentModel = getModelForBankName(eachPopBank);
                                var fileName = "./dist/Split_Records/" + _.camelCase(eachPopBank) + ".json";
                                var popBankData = fs.readJsonSync(fileName);
                                var allBankDocs = _.map(popBankData, function (eachBankRec) {
                                    var tempBankDetail = new currentModel({
                                        name: eachBankRec["name"],
                                        ifsc: eachBankRec["ifsc"],
                                        micr: eachBankRec["micr"],
                                        branch: eachBankRec["branch"],
                                        address: eachBankRec["address"],
                                        contact: eachBankRec["contact"],
                                        city: eachBankRec["city"],
                                        district: eachBankRec["district"],
                                        state: eachBankRec["state"],
                                        pincode: eachBankRec["pincode"]
                                    });
                                    return tempBankDetail;
                                });
                                currentModel.collection.drop();
                                currentModel.insertMany(allBankDocs)
                                    .then(function (docs) {
                                    console.log("<============= Complete :" + docs.length + "=============>");
                                })
                                    .catch(function (err) {
                                    console.log("Error !! : Writing Other Bank Data " + err);
                                });
                            });
                        });
                    });
                    resolve(true);
                });
            }).catch(function (err) {
                console.log("We Have an Error connecting to Mongoose DB." + err);
            });
            resolve(true);
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
                                state: bankDetails.state,
                                pincode: bankDetails.pincode
                            });
                            return bankBranchDetial;
                        });
                        bankBranchDetailModel.collection.insert(bankDetailObj, function (err, branchDetail) {
                            if (err) {
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
    BankDB.prototype.getBankMetaData = function () {
        return new Promise(function (resolve, reject) {
            bankMetaDataModel.find(function (err, values) {
                resolve(values);
            }).catch(function (err) {
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : " + err);
            });
        });
    };
    BankDB.prototype.getBankMetaDataForBankName = function (bankName) {
        return new Promise(function (resolve, reject) {
            bankMetaDataModel.find({ bankName: bankName }, function (err, values) {
                if (values.length == 1) {
                    resolve(values[0]);
                }
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : ");
            }).catch(function (err) {
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : " + err);
            });
        });
    };
    BankDB.prototype.getAllBankNames = function () {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            bankNamesModel.find(function (err, values) {
                if (err) {
                    reject("DB Hanlder : getAllBankCount : Error ! : " + err);
                }
                var bankNames = values.map(function (eachRec) {
                    return eachRec.name;
                });
                resolve(bankNames);
            });
        });
    };
    BankDB.prototype.getAllBankNamesCount = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            _this.getAllBankNames()
                .then(function (allBankNames) {
                resolve(allBankNames.length);
            }).catch(function (err) {
                reject("DB Hanlder : getAllBankCount : Error ! : " + err);
            });
        });
    };
    BankDB.prototype.getRegExForQueryString = function (queryString) {
        if (queryString == "") {
            return new RegExp("[A-Z]");
        }
        var finalQueryString = queryString.toUpperCase();
        var finalRegEx = new RegExp(finalQueryString);
        return finalQueryString;
    };
    BankDB.prototype.getLocationCountForBankName = function (bankName, queryString) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getBankMetaDataForBankName(bankName)
                .then(function (bankMetaData) {
                resolve(bankMetaData.locationCount);
            });
        });
    };
    BankDB.prototype.getBranchCountForBankNameInCity = function (bankName, locationName) {
        return new Promise(function (resolve, reject) {
            var finalBankName = bankName.toUpperCase();
            var finalLocationName = locationName.toUpperCase();
            var model = getModelForBankName(finalBankName);
            model.find({ name: finalBankName, city: locationName }, function (err, values) {
                var branchCount = _.uniq(values).length;
                resolve(branchCount);
            });
        });
    };
    BankDB.prototype.getAllBranchesCount = function (bankName) {
        if (bankName === void 0) { bankName = ""; }
        return new Promise(function (resolve, reject) {
            if (bankName == "") {
                bankBranchDetailModel.find(function (err, values) {
                    resolve(values.length);
                });
            }
            else {
                bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, values) {
                    resolve(values.length);
                });
            }
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
                resolve(bankNames);
            });
        });
    };
    BankDB.prototype.getAllStateNamesForBank = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
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
    BankDB.prototype.getAllCityNamesForBankMatchingQueryString = function (bankName, queryString) {
        return new Promise(function (resolve, reject) {
            var finalBankName = bankName.toUpperCase(); // Dont use loaash for the uppercase. it messes up string like State bank of inida (SBI) .. it leaves out the ()
            var finalQueryString = queryString.toUpperCase();
            var model = getModelForBankName(finalBankName);
            model.find({ name: finalBankName, city: { $regex: new RegExp(finalQueryString) } }, function (err, results) {
                var cityObjects = results.map(function (eachRec) {
                    return { city: eachRec.city, state: eachRec.state };
                });
                var uniqCityObjects = _.uniqBy(cityObjects, 'city');
                var sortedUniqueCityObjects = _.sortBy(uniqCityObjects, ['city']);
                resolve(sortedUniqueCityObjects);
            }).catch(function (err) {
                console.log("Unable to find branch details : " + err);
            });
        });
    };
    BankDB.prototype.getAllCityNamesForBank = function (bankName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            var explainResults = bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }).explain();
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var cityObjects = results.map(function (eachRec) {
                    return { city: eachRec.city, state: eachRec.state };
                });
                var uniqCityObjects = _.uniqBy(cityObjects, 'city');
                var sortedUniqueCityObjects = _.sortBy(uniqCityObjects, ['city']);
                resolve(sortedUniqueCityObjects);
            }).catch(function (err) {
            });
        });
    };
    //Old Implementation, without the state object.. thing..
    BankDB.prototype.getAllCityNamesForBank_OLD = function (bankName) {
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
            }).catch(function (err) {
                console.log("Unable to find branch details : " + err);
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
    BankDB.prototype.getAllBranchNamesForBankNameInCityMatchingQueryString = function (bankName, cityName, queryString) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var finalBankName = bankName.toUpperCase();
            var finalCityName = cityName.toUpperCase();
            var finalRegEx = _this.getRegExForQueryString(queryString);
            var model = getModelForBankName(finalBankName);
            //model.find({name : finalBankName, city : finalCityName, branch : {$regex : finalRegEx}},function(err,results){
            model.find({ name: finalBankName, city: finalCityName, $or: [{ address: { '$regex': finalRegEx } }, { branch: { '$regex': finalRegEx } }] }, function (err, results) {
                var branchObjects = results.map(function (eachRec) {
                    var tempRec = {};
                    tempRec['branch'] = eachRec.branch;
                    tempRec['address'] = eachRec.address;
                    return tempRec;
                });
                resolve(branchObjects);
            }).catch(function (err) {
                reject("Error ! : DB Handler.ts : getAllBranchNamesForBankNameInCityMatchingQueryString : " + err);
            });
        });
    };
    //Prashanth : Scope for optimiztion ehre.. here you query the db for list of branch names etc. U can just get the cout here and only and pass it to the caller... why make another call.. just to get the counts. Or even better.. have some kind of metadata store.. that is created each time you the db with new data from RBI.
    BankDB.prototype.getAllBranchNamesForBankNameInCity = function (bankName, cityName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getAllBranchesForBankNameInCity(bankName, cityName)
                .then(function (branchDetailsArr) {
                var branchObjects = branchDetailsArr.map(function (eachRec) {
                    var tempRec = {};
                    tempRec['branch'] = eachRec.branch;
                    tempRec['address'] = eachRec.address;
                    return tempRec;
                });
                resolve(branchObjects);
            }).catch(function (err) {
                reject("Error ! : DB Handler.ts : getAllBranchNamesForBankNameInCity : " + err);
            });
        });
    };
    //Prashanth : Scope for optimiztion ehre.. here you query the db for list of branch names etc. U can just get the cout here and only and pass it to the caller... why make another call.. just to get the counts. Or even better.. have some kind of metadata store.. that is created each time you the db with new data from RBI.
    BankDB.prototype.getAllBranchNamesForBankNameInCity_OLD = function (bankName, cityName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getAllBranchesForBankNameInCity(bankName, cityName)
                .then(function (branchDetailsArr) {
                var branchNames = branchDetailsArr.map(function (eachRec) {
                    return eachRec.branch;
                });
                resolve(branchNames);
            }).catch(function (err) {
                reject("Error ! : DB Handler.ts : getCountOfBranchesBankNameInCity : " + err);
            });
        });
    };
    BankDB.prototype.getAllBranchesForBankNameInCityBranchName = function (bankName, cityName, branchName) {
        return new Promise(function (resolve, reject) {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            var model = getModelForBankName(bankName);
            if (model == undefined) {
                reject("Error : Model not found for bank name " + bankName, cityName, branchName);
            }
            model.find({ name: bankName, city: cityName, branch: branchName }, function (err, results) {
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
                resolve(results);
            });
        });
    };
    // GET details without bank name.. by city etc... this is diff coz we need to search across collections.
    // TODO : I am sure there is a better way to do this... 
    //
    BankDB.prototype.getAllBanksForCity = function (cityName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var finalCityName = cityName.toUpperCase();
            var allBankModels = _this.getAllBankModels();
            var allPromises = _.map(allBankModels, function (model) {
                return new Promise(function (resolve, reject) {
                    if (model == null) {
                        reject(Error("Got a dabba model"));
                    }
                    model.find({ city: finalCityName }, function (err, results) {
                        resolve(results);
                    });
                });
            });
            Promise.all(allPromises)
                .then(function (allBanksInfo) {
                var emptyFiltered = _.filter(allBanksInfo, function (eachBankArr) {
                    return !_.isEmpty(eachBankArr);
                });
                resolve(emptyFiltered);
            });
        });
    };
    BankDB.prototype.getAllBankModels = function () {
        var allBankModels = _.map(popularBanks, function (eachBank) {
            var fetchedModel = getModelForBankName(eachBank);
            return getModelForBankName(eachBank);
        });
        allBankModels.push(getModelForBankName("otherBankModels"));
        return allBankModels;
    };
    //TODO : Bloody Bloody inefficient.. just keep a list of all known cities in a table or file and return it... 
    // Just doing this coz i am bloody lazy now... 12-June-2019
    BankDB.prototype.getAllKnownCities = function (searchInput) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var finalRegEx = _this.getRegExForQueryString(searchInput);
            var allBankModels = _this.getAllBankModels();
            var allPromises = _.map(allBankModels, function (model) {
                return new Promise(function (resolve, reject) {
                    if (model == null) {
                        reject(Error("Got a dabba model"));
                    }
                    model.find({ city: { '$regex': finalRegEx } }, { city: 1, state: 1, _id: 0 }, function (err, results) {
                        resolve(results);
                    });
                });
            });
            Promise.all(allPromises)
                .then(function (allCities) {
                var allCitiesFlat = _.flattenDeep(allCities);
                var uniqCities = _.uniqBy(allCitiesFlat, "city");
                resolve(uniqCities);
            });
        });
    };
    BankDB.prototype.getAllBanksForIFSC = function (searchInput) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var finalRegEx = _this.getRegExForQueryString(searchInput);
            var allBankModels = _this.getAllBankModels();
            var allPromises = _.map(allBankModels, function (model) {
                return new Promise(function (resolve, reject) {
                    if (model == null) {
                        reject(Error("Got a dabba model"));
                    }
                    model.find({ ifsc: { '$regex': finalRegEx } }, function (err, results) {
                        resolve(results);
                    });
                });
            });
            Promise.all(allPromises)
                .then(function (allBanksMatchingIFSC) {
                resolve(allBanksMatchingIFSC);
            });
        });
    };
    return BankDB;
}());
exports.BankDB = BankDB;
