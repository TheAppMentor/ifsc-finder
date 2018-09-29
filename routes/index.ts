var express = require('express');
var router = express.Router();

import { BankCollection } from '../model/BankCollection'
import { BankDB } from '../data/dbHandler'
import { BankBranchDetail } from '../model/BankBranchDetail'
import { DialogFlowRespParser } from '../model/dialogflow-responseParser'

let bankColl = new BankCollection()

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Finder Boy' });
});

/* GET home page. */
router.get('/loadDB', function(req, res, next) {
    let bankColl = new BankCollection()
    bankColl.hydrateBankCollection("./data/ifsc_codes_all_clean.csv").then(() : Promise<boolean> => {
        return bankColl.loadDataBasesWithDataFromFile()
    }).then(() : Promise<Array<string>> => {
        return bankColl.getAllStateNamesForBank("DenA BanK")
    }).then((matchedStates : Array<string>) => {
        res.render('index', { title: matchedStates.toString() });
    })
});

router.get('/allBankNames', function(req, res, next) {
    bankColl.getAllBankNames().then((bankList : Array<string>) => {
        console.log("All Bank Names are : " + bankList)
        res.render('index', { title: bankList.toString() });
    })
});

router.get('/loadCityNames', function(req, res, next) {
    bankColl.getAllCityNamesForBank("DenA BanK").then((matchedCities : Array<string>) => {
        res.render('index', { title: matchedCities.toString() });
    })
});

router.get('/loadDistrictNames', function(req, res, next) {
    bankColl.getAllDistrictNamesForBank("DenA BanK").then((matchedDistricts : Array<string>) => {
        res.render('index', { title: matchedDistricts.toString() });
    })
});

router.get('/loadBranchDetails', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInCity("DenA BanK","Chennai").then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});
        
router.get('/loadBranchDetailsInState', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInState("DenA BanK","Tamil Nadu").then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});


router.get('/loadBranchDetailsEveryThing', function(req, res, next) {
    bankColl.getAllBranchesForBankNameInStateDistrictCity("DenA BanK","Karnataka","Bangalore",null).then((matchedBranches : Array<BankBranchDetail>) => {
        res.render('index', { title: matchedBranches.toString() });
    })
});

router.post('/DF', function(req, res, next) {
    console.log("Holy Cow.. DialogFlow said something.. ")
    console.log("Request is Headers : " + JSON.stringify(req.headers))
    console.log("Request is body : " + JSON.stringify(req.body))
    //res.json({"status" : "A Bloody Resounding success : POST"})
    let respParser = new DialogFlowRespParser()
    respParser.fulfillGetCityIntent(JSON.stringify(req.body))
        .then((fulfillText : string) => {
           console.log("FulFill Text : " + fulfillText) 
            res.json({"status": fulfillText})
        });
});


module.exports = router;
    //getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
