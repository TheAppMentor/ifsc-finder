import { BankBranchDetailSchema } from '../model/BankBranchDetail';
const fs = require('fs-extra-promise');
const Promise = require("bluebird");
const mongoose = require('mongoose');
const decompress = require('decompress');
var _ = require('lodash');
//const db = mongoose.connection
mongoose.Promise = require('bluebird');
// Creating a Schema 
const bankNamesSchema = new mongoose.Schema({
    name: String
});
// Creating a Schema 
const bankMetaDataSchema = new mongoose.Schema({
    bankName: String,
    branchCount: String,
    locationCount: String,
    stateCount: String,
    isPopular: String
});
// Creating a Bank Model
const bankNamesModel = mongoose.model("BankName", bankNamesSchema);
const bankMetaDataModel = mongoose.model("bankMetaData", bankMetaDataSchema);
const bankBranchDetailModel = mongoose.model("BankBranchDetail", BankBranchDetailSchema);
const allahabadBankModel = mongoose.model("allahabadBankModel", BankBranchDetailSchema);
const andhraBankModel = mongoose.model("andhraBankModel", BankBranchDetailSchema);
const axisBankModel = mongoose.model("axisBankModel", BankBranchDetailSchema);
const bankOfBarodaBobModel = mongoose.model("bankOfBarodaBobModel", BankBranchDetailSchema);
const bankOfIndiaBoiModel = mongoose.model("bankOfIndiaBoiModel", BankBranchDetailSchema);
const canaraBankModel = mongoose.model("canaraBankModel", BankBranchDetailSchema);
const centralBankOfIndiaModel = mongoose.model("centralBankOfIndiaModel", BankBranchDetailSchema);
const corporationBankModel = mongoose.model("corporationBankModel", BankBranchDetailSchema);
const hdfcBankModel = mongoose.model("hdfcBankModel", BankBranchDetailSchema);
const iciciBankLimitedModel = mongoose.model("iciciBankLimitedModel", BankBranchDetailSchema);
const idbiBankModel = mongoose.model("idbiBankModel", BankBranchDetailSchema);
const indianBankModel = mongoose.model("indianBankModel", BankBranchDetailSchema);
const indianOverseasBankIobModel = mongoose.model("indianOverseasBankIobModel", BankBranchDetailSchema);
const orientalBankOfCommerceModel = mongoose.model("orientalBankOfCommerceModel", BankBranchDetailSchema);
const otherBanksModel = mongoose.model("otherBanksModel", BankBranchDetailSchema);
const punjabNationalBankPnbModel = mongoose.model("punjabNationalBankPnbModel", BankBranchDetailSchema);
const stateBankOfIndiaSbiModel = mongoose.model("stateBankOfIndiaSbiModel", BankBranchDetailSchema);
const syndicateBankModel = mongoose.model("syndicateBankModel", BankBranchDetailSchema);
const ucoBankModel = mongoose.model("ucoBankModel", BankBranchDetailSchema);
const unionBankBankModel = mongoose.model("unionBankBankModel", BankBranchDetailSchema);
const yesBankModel = mongoose.model("yesBankModel", BankBranchDetailSchema);
var connectedToDB = false;
const appConfigOptions = loadConfigFile();
function loadConfigFile() {
    let configFileName = "./appConfig.json";
    //let configFileName = "/Users/i328244/Desktop/NodeProjects/ifsc-finder/appConfig.json"
    let fileContents = fs.readJsonSync(configFileName);
    let reloadAllDB = fileContents['reloadAllDB'];
    return fileContents;
}
// TODO Dont do this.. you have the popular banks tagged in the Meta Data.. fetch it from that.. Hard coding this will make all kind of shitty dependencies.
let popularBanks = ["ALLAHABAD BANK", "ANDHRA BANK", "AXIS BANK LTD", "BANK OF BARODA (BOB)", "BANK OF INDIA (BOI)", "CANARA BANK", "CENTRAL BANK OF INDIA", "CORPORATION BANK", "HDFC BANK LTD", "ICICI BANK LTD", "IDBI LTD", "INDIAN BANK", "INDIAN OVERSEAS BANK (IOB)", "ORIENTAL BANK OF COMMERCE (OBC)", "PUNJAB NATIONAL BANK (PNB)", "STATE BANK OF INDIA (SBI)", "SYNDICATE BANK", "UCO BANK", "UNION BANK OF INDIA", "YES BANK LTD",];
function getModelForBankName(bankName) {
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
            return yesBankModel;
            break;
        }
        default:
            return otherBanksModel;
            break;
    }
}
let MONGODB_URI = "mongodb://localhost/localtest";
if (process.env.IS_HEROKU == "true") {
    MONGODB_URI = process.env.MONGODB_URI;
    MONGODB_URI = "mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj";
}
export class BankDB {
    connectoToDBAndLoadData(bankCollection) {
        return new Promise((resolve, reject) => {
            console.log("MONGODB : Connecting to .... " + MONGODB_URI);
            mongoose.connect(MONGODB_URI)
                .then(() => {
                // Check if app config requires us to reload the DB.
                if (appConfigOptions["reloadBankDetailsDB"] == false) {
                    return Promise.resolve(true);
                }
                return new Promise((resolve, reject) => {
                    decompress('./Split_Records.zip', 'dist')
                        .then((unzipComplete) => {
                        // Load Meta Data 
                        // Load Bank MetaData Table 
                        let bankMetaData = fs.readJsonSync("./dist/Split_Records/BankMetaData.json");
                        let allMetaDataModels = _.map(bankMetaData, (eachBankRec) => {
                            let tempModel = new bankMetaDataModel({
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
                            .then((docs) => {
                            resolve(true);
                        })
                            .catch((err) => {
                            reject("Error !! : Writing Meta Data " + err);
                        });
                    }).then(() => {
                        // Make DB for Other Banks
                        return new Promise((resolve, reject) => {
                            let otherBankData = fs.readJsonSync("./dist/Split_Records/otherBanks.json");
                            let currentModel = getModelForBankName("otherBanksModel"); // Default model is otherBanksModel
                            let allBankDocs = _.map(otherBankData, (eachBankRec) => {
                                let tempBankDetail = new currentModel({
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
                                .then((docs) => {
                                console.log("Success !! : Inserting Other Bank Data " + docs.length);
                                resolve(true);
                            })
                                .catch((err) => {
                                console.log("Error !! : Writing Other Bank Data " + err);
                            });
                        });
                    }).then(() => {
                        // Make DB for Popular Banks
                        return new Promise((resolve, reject) => {
                            console.log("<============= Startin with POP BANKS =============>");
                            _.map(popularBanks, (eachPopBank) => {
                                console.log("<============= Staring :" + eachPopBank + "=============>");
                                let currentModel = getModelForBankName(eachPopBank);
                                let fileName = "./dist/Split_Records/" + _.camelCase(eachPopBank) + ".json";
                                let popBankData = fs.readJsonSync(fileName);
                                let allBankDocs = _.map(popBankData, (eachBankRec) => {
                                    let tempBankDetail = new currentModel({
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
                                    .then((docs) => {
                                    console.log("<============= Complete :" + docs.length + "=============>");
                                })
                                    .catch((err) => {
                                    console.log("Error !! : Writing Other Bank Data " + err);
                                });
                            });
                        });
                    });
                    resolve(true);
                });
            }).catch((err) => {
                console.log("We Have an Error connecting to Mongoose DB." + err);
            });
            resolve(true);
        });
    }
    loadBankNamesDB(bankCollection) {
        var numberOfDocumentsLoaded = 0;
        const promises = bankCollection.allBankNames.map(eachBankName => {
            return new Promise((resolve, reject) => {
                var bankName = new bankNamesModel({ name: eachBankName });
                bankName.save((err, bank) => {
                    if (err) {
                        reject(Error("We have an error saving Bank Name"));
                    }
                    numberOfDocumentsLoaded += 1;
                    resolve();
                });
            });
        });
        const finalPromise = new Promise(function (resolve, reject) {
            Promise.all(promises).then(function (values) {
                resolve(values);
            });
        });
        return finalPromise;
    }
    loadDBWithBankBankCollection(bankCollection) {
        return new Promise((resolve, reject) => {
            const promises = bankCollection.allBankNames.map(eachBankName => {
                return new Promise((resolve, reject) => {
                    bankCollection.loadBranchDetailsForBank(eachBankName)
                        .then((bankDetailsArr) => {
                        var bankDetailObj = bankDetailsArr.map(bankDetails => {
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
                        bankBranchDetailModel.collection.insert(bankDetailObj, (err, branchDetail) => {
                            if (err) {
                                reject();
                            }
                            resolve(true);
                        });
                    });
                });
            });
            Promise.all(promises).then(() => {
                resolve(true);
            });
        });
    }
    getBankMetaData() {
        return new Promise((resolve, reject) => {
            bankMetaDataModel.find((err, values) => {
                resolve(values);
            }).catch((err) => {
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : " + err);
            });
        });
    }
    getBankMetaDataForBankName(bankName) {
        return new Promise((resolve, reject) => {
            bankMetaDataModel.find({ bankName: bankName }, (err, values) => {
                if (values.length == 1) {
                    resolve(values[0]);
                }
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : ");
            }).catch((err) => {
                reject("BANK DB : getBankMetaData : Unable to fetch metadata : " + err);
            });
        });
    }
    getAllBankNames() {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            bankNamesModel.find((err, values) => {
                if (err) {
                    reject("DB Hanlder : getAllBankCount : Error ! : " + err);
                }
                var bankNames = values.map(eachRec => {
                    return eachRec.name;
                });
                resolve(bankNames);
            });
        });
    }
    getAllBankNamesCount() {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            this.getAllBankNames()
                .then((allBankNames) => {
                resolve(allBankNames.length);
            }).catch((err) => {
                reject("DB Hanlder : getAllBankCount : Error ! : " + err);
            });
        });
    }
    getRegExForQueryString(queryString) {
        if (queryString == "") {
            return new RegExp("[A-Z]");
        }
        var finalQueryString = queryString.toUpperCase();
        var finalRegEx = new RegExp(finalQueryString);
        return finalQueryString;
    }
    getLocationCountForBankName(bankName, queryString) {
        return new Promise((resolve, reject) => {
            this.getBankMetaDataForBankName(bankName)
                .then((bankMetaData) => {
                resolve(bankMetaData.locationCount);
            });
        });
    }
    getBranchCountForBankNameInCity(bankName, locationName) {
        return new Promise((resolve, reject) => {
            let finalBankName = bankName.toUpperCase();
            let finalLocationName = locationName.toUpperCase();
            let model = getModelForBankName(finalBankName);
            model.find({ name: finalBankName, city: locationName }, function (err, values) {
                let branchCount = _.uniq(values).length;
                resolve(branchCount);
            });
        });
    }
    getAllBranchesCount(bankName = "") {
        return new Promise((resolve, reject) => {
            if (bankName == "") {
                bankBranchDetailModel.find((err, values) => {
                    resolve(values.length);
                });
            }
            else {
                bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, values) {
                    resolve(values.length);
                });
            }
        });
    }
    getAllBankNamesMatching(bankName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            bankNamesModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                //bankBranchDetailModel.find({name : bankName},function(err,results){
                var bankNames = results.map(eachRec => {
                    return eachRec.name;
                });
                resolve(bankNames);
            });
        });
    }
    getAllStateNamesForBank(bankName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var stateNames = results.map(eachRec => {
                    return eachRec.state;
                });
                var uniqStateNames = _.uniq(stateNames);
                let sortedUniqueStateNames = _.sortBy(uniqStateNames);
                resolve(sortedUniqueStateNames);
            });
        });
    }
    getAllCityNamesForBankMatchingQueryString(bankName, queryString) {
        return new Promise((resolve, reject) => {
            let finalBankName = bankName.toUpperCase(); // Dont use loaash for the uppercase. it messes up string like State bank of inida (SBI) .. it leaves out the ()
            let finalQueryString = queryString.toUpperCase();
            let model = getModelForBankName(finalBankName);
            model.find({ name: finalBankName, city: { $regex: new RegExp(finalQueryString) } }, function (err, results) {
                var cityObjects = results.map(eachRec => {
                    return { city: eachRec.city, state: eachRec.state };
                });
                var uniqCityObjects = _.uniqBy(cityObjects, 'city');
                let sortedUniqueCityObjects = _.sortBy(uniqCityObjects, ['city']);
                resolve(sortedUniqueCityObjects);
            }).catch((err) => {
                console.log("Unable to find branch details : " + err);
            });
        });
    }
    getAllCityNamesForBank(bankName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            let explainResults = bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }).explain();
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var cityObjects = results.map(eachRec => {
                    return { city: eachRec.city, state: eachRec.state };
                });
                var uniqCityObjects = _.uniqBy(cityObjects, 'city');
                let sortedUniqueCityObjects = _.sortBy(uniqCityObjects, ['city']);
                resolve(sortedUniqueCityObjects);
            }).catch((err) => {
            });
        });
    }
    //Old Implementation, without the state object.. thing..
    getAllCityNamesForBank_OLD(bankName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                var cityNames = results.map(eachRec => {
                    return eachRec.city;
                });
                var uniqCityNames = _.uniq(cityNames);
                let sortedUniqueCityNames = _.sortBy(uniqCityNames);
                resolve(sortedUniqueCityNames);
            }).catch((err) => {
                console.log("Unable to find branch details : " + err);
            });
        });
    }
    getAllDistrictNamesForBank(bankName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") } }, function (err, results) {
                let allDistrictNames = results.map(eachBranch => {
                    return eachBranch.district;
                });
                let uniqDistrictNames = _.uniq(allDistrictNames);
                let sortedUniqueNames = _.sortBy(uniqDistrictNames);
                console.log("Resolving with : " + sortedUniqueNames);
                resolve(sortedUniqueNames);
            });
        });
    }
    getAllBranchesForBankNameInCity(bankName, cityName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") }, city: { $regex: new RegExp(cityName, "i") } }, function (err, results) {
                resolve(results);
            });
        });
    }
    getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, cityName, queryString) {
        return new Promise((resolve, reject) => {
            let finalBankName = bankName.toUpperCase();
            let finalCityName = cityName.toUpperCase();
            var finalRegEx = this.getRegExForQueryString(queryString);
            let model = getModelForBankName(finalBankName);
            //model.find({name : finalBankName, city : finalCityName, branch : {$regex : finalRegEx}},function(err,results){
            model.find({ name: finalBankName, city: finalCityName, $or: [{ address: { '$regex': finalRegEx } }, { branch: { '$regex': finalRegEx } }] }, function (err, results) {
                var branchObjects = results.map(eachRec => {
                    var tempRec = {};
                    tempRec['branch'] = eachRec.branch;
                    tempRec['address'] = eachRec.address;
                    return tempRec;
                });
                resolve(branchObjects);
            }).catch((err) => {
                reject("Error ! : DB Handler.ts : getAllBranchNamesForBankNameInCityMatchingQueryString : " + err);
            });
        });
    }
    //Prashanth : Scope for optimiztion ehre.. here you query the db for list of branch names etc. U can just get the cout here and only and pass it to the caller... why make another call.. just to get the counts. Or even better.. have some kind of metadata store.. that is created each time you the db with new data from RBI.
    getAllBranchNamesForBankNameInCity(bankName, cityName) {
        return new Promise((resolve, reject) => {
            this.getAllBranchesForBankNameInCity(bankName, cityName)
                .then((branchDetailsArr) => {
                var branchObjects = branchDetailsArr.map(eachRec => {
                    var tempRec = {};
                    tempRec['branch'] = eachRec.branch;
                    tempRec['address'] = eachRec.address;
                    return tempRec;
                });
                resolve(branchObjects);
            }).catch((err) => {
                reject("Error ! : DB Handler.ts : getAllBranchNamesForBankNameInCity : " + err);
            });
        });
    }
    //Prashanth : Scope for optimiztion ehre.. here you query the db for list of branch names etc. U can just get the cout here and only and pass it to the caller... why make another call.. just to get the counts. Or even better.. have some kind of metadata store.. that is created each time you the db with new data from RBI.
    getAllBranchNamesForBankNameInCity_OLD(bankName, cityName) {
        return new Promise((resolve, reject) => {
            this.getAllBranchesForBankNameInCity(bankName, cityName)
                .then((branchDetailsArr) => {
                var branchNames = branchDetailsArr.map(eachRec => {
                    return eachRec.branch;
                });
                resolve(branchNames);
            }).catch((err) => {
                reject("Error ! : DB Handler.ts : getCountOfBranchesBankNameInCity : " + err);
            });
        });
    }
    getAllBranchesForBankNameInCityBranchName(bankName, cityName, branchName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            let model = getModelForBankName(bankName);
            if (model == undefined) {
                reject("Error : Model not found for bank name " + bankName, cityName, branchName);
            }
            model.find({ name: bankName, city: cityName, branch: branchName }, function (err, results) {
                resolve(results);
            });
        });
    }
    getAllBranchesForBankNameInState(bankName, stateName) {
        return new Promise((resolve, reject) => {
            //NB : https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            // I am using the in-efficinet regex method to make the find case-insensive.. check out the link above for a more optimizes soln.
            // DRY vioation.... !!!! 
            bankBranchDetailModel.find({ name: { $regex: new RegExp(bankName, "i") }, state: { $regex: new RegExp(stateName, "i") } }, function (err, results) {
                resolve(results);
            });
        });
    }
    getAllBranchesForBankNameInStateDistrictCity(bankName, stateName, cityName, districtName = null) {
        return new Promise((resolve, reject) => {
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
    }
}
