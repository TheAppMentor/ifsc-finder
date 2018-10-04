import { BankCollection } from './BankCollection';
var Papa = require('papaparse');
var _ = require('lodash');
var Promise = require("bluebird");
var Trie = require('mnemonist/trie');
//var fs = require('fs')
const fs = require('fs-extra-promise');
let theBank = new BankCollection("../data/ifsc_codes_all_clean.csv");
console.log("We have now created a Bank Collection");
//theBank.findBankMatchingName("IC").then((theNames) => {
//    console.log(theNames)
//})
console.log("Waiting... ");
setTimeout(() => {
    theBank.getAllStateNamesForBank("DENA BANK")
        .then((stateNames) => {
        console.log("\n\n State Names are : " + stateNames);
    })
        .catch((error) => {
        console.log("We have an Error " + error);
    });
    theBank.getAllCityNamesForBank("DENA BANK")
        .then((cityNames) => {
        console.log("\n\n City Names are : " + cityNames);
    })
        .catch((error) => {
        console.log("We have an Error " + error);
    });
    theBank.getAllDistrictNamesForBank("DENA BANK")
        .then((districtNames) => {
        console.log("\n\n District Names are : " + districtNames);
    })
        .catch((error) => {
        console.log("We have an Error " + error);
    });
    theBank.getAllBranchesForBankNameInStateDistrictCity("DENA BANK", "Karnataka", "Bangalore").then((finalList) => {
        console.log("We Have fetched ... Final list of branches : " + finalList.length);
        finalList.forEach(eachBranch => {
            console.log("%j", eachBranch);
        });
    });
    theBank.getAllBranchesForBankNameInStateDistrictCity("IDBI BANK", "Karnataka", "Bangalore").then((finalList) => {
        console.log("We Have fetched ... Final list of branches : " + finalList.length);
        finalList.forEach(eachBranch => {
            console.log("%j", eachBranch);
        });
    });
    theBank.getAllBranchesForBankNameInStateDistrictCity("IDBI BANK", "Bihar", "Patna").then((finalList) => {
        console.log("We Have fetched ... Final list of branches : " + finalList.length);
        finalList.forEach(eachBranch => {
            console.log("%j", eachBranch);
        });
    });
}, 3000);
//getAllBranchesForBankNameInStateDistrictCity(bankName : string, stateName : string, cityName : string, districtName : string = null) : Promise<Array<BankBranchDetail>> {
/*
theBank.fetchFileNameForBank("STATE BANK OF INDIA").then((theFileName) => {
    console.log("The File Name is " + theFileName)
}).catch((error) => {
    console.log("We have an Error " + error)
})
 */
/*


// Parse local CSV file
//let results = Papa.parse(content, config)

//console.log("Finished:", results.data);
//console.log("Meta Data:", results.meta);
//console.log("Error:", results.errors);

var allBankNames = Array<string>()
var bankMap : {string:Array<BankBranchDetail>} = null

// Get list of all unqiue bank names.
for (var eachBank of results.data){
    allBankNames.push(eachBank["BANK"])
}

let uniqueBankNames = _.uniq(allBankNames)
console.log(uniqueBankNames)

// Make bank details projects
var bankDetailArr = results.data.map(eachBankJSON => {
    return new BankBranchDetail(eachBankJSON)
})

console.log(bankDetailArr.length)
console.log(bankDetailArr[0])

// Create an empty bankMap
// {"BankName" : ["BankJSON"]}
for (var eachBank of uniqueBankNames){
    bankMap[eachBank] = Array<string>()
}

// Split files based on bank name
var allBankNames = Array<string>()

for (var eachBankRecord of results.data){
    console.log("eachBankRecord" + eachBankRecord)
    console.log("Inserting Record for Bank : " + eachBank["BANK"])
    console.log("This bank boy is... : " +  bankMap[eachBank["BANK"]])
    bankMap[eachBank["BANK"]].push(eachBankRecord)
}
console.log(bankMap)

//let uniqueBankNames = _.uniq(allBankNames)
//let bankMap = {}
//for (eachBank of uniqueBankNames){
//    bankMap[eachBank].push()
//}
 */
