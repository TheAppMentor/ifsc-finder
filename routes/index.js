"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var BankCollection_1 = require("../model/BankCollection");
var bankColl = new BankCollection_1.BankCollection();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Finder Boy' });
});
/* GET home page. */
router.get('/loadDB', function (req, res, next) {
    var bankColl = new BankCollection_1.BankCollection();
    bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv").then(function () {
        return bankColl.loadDataBasesWithDataFromFile();
    }).then(function () {
        return bankColl.getAllStateNamesForBank("DenA BanK");
    }).then(function (matchedStates) {
        res.render('index', { title: matchedStates.toString() });
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
module.exports = router;
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
