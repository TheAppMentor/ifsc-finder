"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var handlebars = require('handlebars');
var fs = require('fs');
var uuidv1 = require('uuid/v1');
var WebhookClient = require('dialogflow-fulfillment').WebhookClient;
var Promise = require('bluebird');
var BankCollection_1 = require("../model/BankCollection");
var DOM_Generator = require('../templates/dom_gen');
var bankColl = new BankCollection_1.BankCollection();
var dom_gen = new DOM_Generator();
var totalNumberOfBankBranchesInDB = "1.5 L";
var totalNumberOfBanksInDB;
var allBankNamesArr = [];
var popularBankNamesArr = [];
var allKnowCitiesArr = [];
var allSetReadyToLaunch = false;
var bankMetaData = [];
bankColl.loadDataBasesWithDataFromFile()
    .then(function () {
    // Load Meta Data table into memory. This is pretty small and can be stored in memory (Later may be in the cache)
    // db.statebankofindiasbimodels.find({city : /BENGA/}).count()
    return bankColl.getBankMetaData();
})
    .then(function (metaData) {
    bankMetaData = metaData;
    totalNumberOfBanksInDB = bankMetaData.length;
    return Promise.resolve(metaData);
})
    .then(function (metaData) {
    // Get List of all popular banks. (From Meta Data Table)
    popularBankNamesArr = _.reduce(bankMetaData, function (result, value, key) {
        //TODO change this to a boolean.. right now its a string.
        if (value.isPopular == 'true') {
            result.push(value.bankName);
            return result;
        }
        return result;
    }, []);
    return Promise.resolve(metaData);
})
    .then(function (metaData) {
    allBankNamesArr = _.map(bankMetaData, function (eachBankRec) {
        return eachBankRec.bankName;
    });
    return Promise.resolve(true);
})
    .then(function (success) {
    bankColl.getAllKnownCities("")
        .then(function (allCities) {
        allKnowCitiesArr = allCities;
        return Promise.resolve(true);
    });
    return Promise.resolve(true);
})
    .then(function (preProcessingComplete) {
    if (preProcessingComplete == true) {
        allSetReadyToLaunch = true;
    }
})
    .catch(function (err) {
    console.log("Error! : index.ts :  => " + err);
});
function createUserData(req) {
    req.session.userData = {};
    req.session.userData = { sessID: uuidv1() };
}
/* GET home page. */
router.get('/', function (req, res, next) {
    //TODO : Check the allSetReadyToLaunch variable, if we are not yet ready. Show a an appropriate page. 
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    // Check Device . If Mobile, redirect to the mobile friendly Site
    var pageToRender = "index";
    res.render(pageToRender, {});
});
/* RTGS Holidays Page */
router.get('/rtgsholidays', function (req, res, next) {
    console.log("Session :" + req.session.Stupid + " : Request Received | Route : /rtgsholidays | query : " + JSON.stringify(req.query));
    res.render('rtgs_holidays', {});
});
router.get('/getBanks/', function (req, res, next) {
    var query = req.query;
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getBanks | query : " + JSON.stringify(query));
    var matchedBanks = _.filter(allBankNamesArr, function (eachValue) {
        if (_.includes(_.toLower(eachValue), _.toLower(query.q)) == true) {
            return eachValue;
        }
    });
    var matchedPopularBanks = _.filter(popularBankNamesArr, function (eachValue) {
        if (_.includes(_.toLower(eachValue), _.toLower(query.q)) == true) {
            return eachValue;
        }
    });
    var resp = {};
    resp['results'] = [];
    var queryReturnedResults = matchedBanks.length > 0 ? true : false;
    resp["success"] = queryReturnedResults;
    // Build Popular Banks Category
    var popularBanksCat = {};
    popularBanksCat['name'] = "Popular Banks";
    //Build Popular bank Items
    var popBankItems = _.map(matchedPopularBanks, function (eachPopBank) {
        var popItem = {};
        popItem['title'] = eachPopBank;
        return popItem;
    });
    popularBanksCat['results'] = popBankItems;
    // If we have found a match, Then dont show popular banks.
    if (matchedBanks.length > 1) {
        resp['results'].push(popularBanksCat);
    }
    // Build Popular Banks Category
    var allBanksCat = {};
    allBanksCat['name'] = "All Banks";
    // Build resp for all banks that match the search
    var allBankItems = _.map(matchedBanks, function (eachBank) {
        var bankItem = {};
        bankItem['title'] = eachBank;
        return bankItem;
    });
    allBanksCat['results'] = allBankItems;
    resp['results'].push(allBanksCat);
    console.log("Session :" + req.session.userData.sessID + " : Response Sent | Route : /getBanks | query : " + JSON.stringify(query) + " | Results : Somethign was sent");
    res.json(resp);
});
function isValidateSearchInput(searchInput) {
    if (searchInput.search(/[^a-zA-Z0-9]+/) === -1) {
        return true;
    }
    return false;
}
router.get('/getLocationList/', function (req, res, next) {
    var bankName = req.query.bankName;
    var searchInput = req.query.searchInput.toUpperCase();
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getLocationList | query : " + JSON.stringify(req.query));
    if (isValidateSearchInput(searchInput) == false) {
        console.log("Session :" + "We Have an ERROR  " + searchInput);
        var errResp = {};
        errResp['results'] = [];
        console.log("Session :" + req.session.userData.sessID + "Response Sent | Route : /getLocationList | query : " + JSON.stringify(req.query) + ": Results : Something Was Sent");
        return res.json(errResp);
    }
    bankColl.getAllCityNamesForBankMatchingQueryString(bankName, searchInput)
        .then(function (allCityNames) {
        var formattedSearchInput = "<font color=\"red\">" + searchInput + "</font>";
        //Form the response.
        var formattedResults = _.map(allCityNames, function (eachCityRec) {
            var tempBranchRec = {};
            var cityText = eachCityRec['city'];
            //cityText = cityText.replace(searchInput,formattedSearchInput) 
            var stateText = eachCityRec['state'];
            //stateText = stateText.replace(searchInput,formattedSearchInput) 
            tempBranchRec['city'] = cityText;
            tempBranchRec['state'] = stateText;
            return tempBranchRec;
        });
        var locationStr = formattedResults.length == 1 ? "location" : "locations";
        var resp = {};
        resp['results'] = formattedResults;
        resp['action'] = { "actionText": "Found " + formattedResults.length + " " + locationStr + " matching " + formattedSearchInput };
        var queryReturnedResults = formattedResults.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        //Matching City Names
        console.log("Session :" + "Response Sent | Route : /getLocationList | query : " + JSON.stringify(req.query) + ": Results : Something Was Sent");
        return res.json(resp);
    });
});
router.get('/getBranchList/', function (req, res, next) {
    //let bankName = req.query.bankName
    //let bankName = $(req.query.bankName).text();
    var bankName = req.query.bankName;
    var locationName = req.query.locationName.replace(/<(.|\n)*?>/g, '');
    var searchInput = req.query.searchInput.toUpperCase();
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + "Request Received | Route : /getBranchList| query : " + JSON.stringify(req.query));
    if (isValidateSearchInput(searchInput) == false) {
        console.log("Session :" + "We Have an ERROR  " + searchInput);
        var errResp = {};
        errResp['results'] = [];
        console.log("Session :" + "Response Sent | Route : /getLocationList | query : " + JSON.stringify(req.query) + ": Results : Something Was Sent");
        return res.json(errResp);
    }
    bankColl.getAllBranchNamesForBankNameInCityMatchingQueryString(bankName, locationName, searchInput)
        .then(function (branchNameArr) {
        //Form the response.
        var resp = {};
        var formattedSearchInput = "<font color=\"red\">" + searchInput + "</font>";
        var formattedResults = _.map(branchNameArr, function (eachBranchRec) {
            var tempBranchRec = {};
            var branchText = eachBranchRec['branch'];
            var addrtext = eachBranchRec['address'];
            //branchText = branchText.replace(searchInput,formattedSearchInput) 
            //addrtext = addrtext.replace(searchInput,formattedSearchInput) 
            tempBranchRec['branch'] = branchText;
            tempBranchRec['address'] = addrtext;
            return tempBranchRec;
        });
        resp['results'] = formattedResults;
        var branchStr = formattedResults.length == 1 ? "branch" : "branches";
        //resp['action'] = {"actionText" : "Found " + branchNameArr.length + " " + branchStr + " matching " + "'<font color=\"green\">" + searchInput + "</font>'"} 
        resp['action'] = { "actionText": "Found " + formattedResults.length + " " + branchStr + " matching " + formattedSearchInput };
        var queryReturnedResults = formattedResults.length > 0 ? true : false;
        resp["success"] = queryReturnedResults;
        console.log("Session :" + JSON.stringify(req.query));
        //Matching City Names
        console.log("Session :" + req.session.userData.sessID + "Response Sent | Route : /getBranchList| query : " + JSON.stringify(req.query) + " : Results : " + (resp["results"].length) + "Branches");
        return res.json(resp);
    });
});
// For Bank Name : Get all locations
router.get('/getLocations/', function (req, res, next) {
    var bankName = req.query.bankName;
    console.log("The bank Name is : " + bankName);
    //res.json({message : bankName})
    bankColl.getAllCityNamesForBank(bankName).then(function (allCityNames) {
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: allCityNames.length == 1 ? "Location" : "Locations", value: allCityNames.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
            statiticSubTitle: ""
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Find City", status: "active", description: "Choose Location below" },
                { title: "Find Branch", status: "disabled", description: "Enter Branch Name" }
            ],
        });
        var dropdown_div = dom_gen.getDivForDropDown({
            processStep: "findCity",
            allBankNames: allCityNames,
            dropDownPlaceHolderText: "Search Bank Location",
        });
        res.set('bankName', bankName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div });
    }).catch(function (err) {
        console.log("ERROR! : index.ts : /cities/ => Finding City Name Name " + err);
    });
});
// Generate DOM for final results 
router.get('/getDomForLocationSearch/', function (req, res, next) {
    var bankName = req.query.bankName;
    console.log("Session :" + req.session.userData.sessID + "Request Received | Route : /getDomForLocationSearch | query : " + JSON.stringify(req.query));
    //TODO : WE dont have to get the search div and the counts for the info div at the same time. If performance is an issue the info div count can be fetched later.
    bankColl.getLocationCountForBankName(bankName, "").then(function (bankLocationCount) {
        var locationSearch_div = dom_gen.getDivForLocationSearch({
            bankName: bankName,
            segmentID: "findLocationSegment",
            searchFieldID: "findLocationSearchField",
            descriptionText: "Enter your bank Location (City/Town/Village)"
        });
        var info_div = dom_gen.getDivForInfoLocationSearch({
            bankName: bankName,
            locationCount: bankLocationCount
        });
        console.log("Session :" + req.session.userData.sessID + " : Response Sent | Route : /getDomForLocationSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_Location Search");
        res.json({ div_locationSearch: locationSearch_div, div_info: info_div });
    });
});
// Generate DOM for final results 
router.get('/getDomForBranchSearch/', function (req, res, next) {
    var bankName = req.query.bankName;
    var locationName = req.query.locationName;
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query));
    bankColl.getBranchCountForBankNameInCity(bankName, locationName)
        .then(function (branchCountAtLocation) {
        var branchSearch_div = dom_gen.getDivForBranchSearch({
            bankName: bankName,
            locationName: locationName,
            segmentID: "findBranchSegment",
            searchFieldID: "findBranchSearchField",
            descriptionText: "Choose your branch"
        });
        var info_div = dom_gen.getDivForInfoBranchSearch({
            bankName: bankName,
            locationName: locationName,
            branchCount: branchCountAtLocation
        });
        console.log(req.session.userData.sessID + " : Response Sent | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_Branch Search");
        res.json({ div_branchSearch: branchSearch_div, div_info: info_div });
    });
});
// Generate DOM for final results 
router.get('/getDomForResults/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.locationName.replace(/<(.|\n)*?>/g, '');
    var branchName = req.query.branchName.replace(/<(.|\n)*?>/g, '');
    console.log("Session :" + req.session.userData.sessID + "Request Received | Route : /getDomForResults | query : " + JSON.stringify(req.query));
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        var results_div = dom_gen.getDivForResults({
            bankName: fetchedBranch.bankName,
            bankBranch: fetchedBranch.branch,
            ifsc: fetchedBranch.ifsc,
            address: fetchedBranch.address,
            city: fetchedBranch.city,
            state: fetchedBranch.state
        });
        console.log(req.session.userData.sessID + " : Response Sent | Route : /getDomForBranchSearch | query : " + JSON.stringify(req.query) + " : Results : DIV_FINAL_Results" + JSON.stringify(fetchedBranch));
        res.json({ div_finaResults: results_div });
    });
});
router.get('/getBranches/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    // Find all Branches for Bank name & City Name:
    bankColl.getAllBranchNamesForBankNameInCity(bankName, cityName).then(function (branchNameArr) {
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            //TODO : Prashanth add a condition in hbs file to omit the subtitle div if no value is passed.
            statiticSubTitle: cityName
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Location", status: "completed", description: cityName },
                { title: "Find Branch", status: "active", description: "Choose Branch" }
            ],
        });
        var dropdown_div = dom_gen.getDivForBranchDropDown({
            processStep: "findBranch",
            allBankNames: branchNameArr,
            dropDownPlaceHolderText: "Search Bank Branch",
        });
        res.set('bankName', bankName);
        res.set('cityName', cityName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div });
    }).catch(function (err) {
        console.log("ERROR! : Finding branch Name");
    });
});
router.get('/getBranchDetailsJSON/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        console.log("Fetched Branch is : " + JSON.stringify(fetchedBranch));
        res.json({ bankName: fetchedBranch.name,
            ifscCode: fetchedBranch.ifsc,
            micr: fetchedBranch.micr,
            address: fetchedBranch.address,
            city: fetchedBranch.city,
            state: fetchedBranch.state,
            pincode: fetchedBranch.pincode,
            branchName: fetchedBranch.branch });
    });
});
router.get('/getBranchDetails/', function (req, res, next) {
    var bankName = req.query.bankName;
    var cityName = req.query.cityName;
    var branchName = req.query.branchName;
    bankColl.getBranchesDetailsForBankInCityWithBranchName(bankName, cityName, branchName).then(function (branchNameArr) {
        var fetchedBranch = _.first(branchNameArr);
        var statistics_div = dom_gen.getDivForStatistics({
            statistic: [
                { label: branchNameArr.length == 1 ? "Branch" : "Branches", value: branchNameArr.length }
            ],
            statisticCount: "one",
            statiticTitle: bankName,
            statiticSubTitle: cityName
        });
        var steps_div = dom_gen.getDivForSteps({
            stepStatus: [
                { title: "Bank", status: "completed", description: bankName },
                { title: "Location", status: "completed", description: cityName },
                { title: "Branch", status: "completed", description: branchName }
            ],
        });
        var dropdown_div = dom_gen.getDivForDropDown({
            processStep: "findBranch",
            allBankNames: branchNameArr,
        });
        var modal_div = dom_gen.getDivForModal({
            bankName: fetchedBranch.name,
            ifscCode: fetchedBranch.ifsc,
            address: fetchedBranch.address,
            branchName: fetchedBranch.branch
        });
        res.set('bankName', bankName);
        res.set('cityName', cityName);
        res.set('branchName', branchName);
        res.json({ div_dropdown: dropdown_div, div_stats: statistics_div, div_steps: steps_div, div_modal: modal_div });
    }).catch(function (err) {
        console.log("ERROR! : index.ts : /branches/ => Finding branch Name " + err);
    });
});
router.get('/allBankNames', function (req, res, next) {
    bankColl.getAllBankNames().then(function (bankList) {
        console.log("All Bank Names are : " + bankList);
        res.render('index', { title: bankList.toString() });
    });
});
router.get('/loadCityNames', function (req, res, next) {
    bankColl.getAllCityNamesForBank("DenA BanK").then(function (matchedCities) {
        res.render('index', { title: matchedCities.toString() });
    });
});
router.get('/loadDistrictNames', function (req, res, next) {
    bankColl.getAllDistrictNamesForBank("DenA BanK").then(function (matchedDistricts) {
        res.render('index', { title: matchedDistricts.toString() });
    });
});
router.get('/loadBranchDetails', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInCity("DenA BanK", "Chennai").then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.get('/loadBranchDetailsInState', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInState("DenA BanK", "Tamil Nadu").then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.get('/loadBranchDetailsEveryThing', function (req, res, next) {
    bankColl.getAllBranchesForBankNameInStateDistrictCity("DenA BanK", "Karnataka", "Bangalore", null).then(function (matchedBranches) {
        res.render('index', { title: matchedBranches.toString() });
    });
});
router.get('/getAllBanksByLocation/', function (req, res, next) {
    var query = req.query;
    var searchInput = req.query.searchInput.toUpperCase();
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getAllBanksByLocation | query : " + JSON.stringify(query));
    var resp = {};
    resp['results'] = [];
    bankColl.getAllBanksForCity(searchInput)
        .then(function (allBankBranches) {
        var allBanksArr = _.flattenDeep(allBankBranches);
        var sortedResults = _.sortBy(allBanksArr, function (eachResult) { return eachResult.length; });
        resp['results'] = _.reverse(sortedResults);
        res.json(resp);
    })
        .catch(function (err) {
        console.log("Error! : index.ts :  => " + err);
    });
});
//TODO : The city object has both city and state names. Instead of passing the statenames with each object. you can have a hash table of statename to code and pass that along... and do the mapping on the client.. 
router.get('/getAllKnownCities/', function (req, res, next) {
    var query = req.query;
    var searchInput = req.query.searchInput.toUpperCase();
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getAllKnownCities/ | query : " + JSON.stringify(query));
    var resp = {};
    resp['results'] = [];
    if (searchInput == "") {
        resp['results'] = allKnowCitiesArr;
    }
    else {
        resp['results'] = _.filter(allKnowCitiesArr, function (eachCityObj) {
            return (eachCityObj.city.includes(searchInput) || eachCityObj.state.includes(searchInput));
        });
    }
    res.json(resp);
});
// We need to this be able to provide a link using IFSC Code.
router.get('/getBankByIFSC/', function (req, res, next) {
    var query = req.query;
    var searchInput = req.query.searchInput.toUpperCase();
    if (req.session.userData === undefined) {
        createUserData(req);
    }
    console.log("Session :" + req.session.userData.sessID + " : Request Received | Route : /getBankByIFSC | query : " + JSON.stringify(query));
    var resp = {};
    resp['results'] = [];
    bankColl.getAllBanksForIFSC(searchInput)
        .then(function (allBankBranches) {
        var allBanksArr = _.flattenDeep(allBankBranches);
        var sortedResults = _.sortBy(allBanksArr, function (eachResult) { return eachResult.length; });
        resp['results'] = _.reverse(sortedResults);
        res.json(resp);
    })
        .catch(function (err) {
        console.log("Error! : index.ts :  => " + err);
    });
});
module.exports = router;
