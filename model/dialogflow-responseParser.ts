const parseJson = require('parse-json');
const Promise = require("bluebird");

import { BankCollection } from '../model/BankCollection'
import { BankDB } from '../data/dbHandler'
import { BankBranchDetail } from '../model/BankBranchDetail'

let bankColl = new BankCollection()

export class DialogFlowRespParser {

    determineMatchedIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)

            let queryResult = resp.queryResult
            console.log("allRequiredParamsPresent : " +  queryResult.allRequiredParamsPresent)
            if (queryResult.allRequiredParamsPresent == true){
                console.log("We have all required parameters.... ")
                resolve(queryResult.intent.name)
            }
            resolve("Some Error man")
        })
    }

    fulfillGetCityIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)

            let queryResult = resp.queryResult.queryText

            console.log("Query Result : " + queryResult)

           bankColl.getAllBranchesForBankNameInCity("Dena Bank","Bangalore")
                .then((matchedBranches : Array<BankBranchDetail>) => {
                resolve("We found many Branches.... ") 
           })
        })
    }

    fulfillGetBankNameIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)

            let queryResult = resp.queryResult.queryText

            console.log("Query Result Bank Name : " + queryResult)

           bankColl.getAllBranchesForBankNameInCity("Dena Bank","Bangalore")
                .then((matchedBranches : Array<BankBranchDetail>) => {
                resolve("We found many Branches.... ") 
           })
        })
    }

}

