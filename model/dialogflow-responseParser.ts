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
                this.fullfillIntentWithName(queryResult.intent.displayName,dialogFlowResp).then((fetchednames : string) => {
                    console.log("Fetched Names are : " + fetchednames) 
                    resolve(fetchednames)
                })
            }
        })
    }

    fullfillIntentWithName(intentName : string, response : string) : Promise<string>{
      //Prashanth : Make this an enum here..       
        if (intentName == "getBankName"){
            console.log("fullfillIntentWithName : I am in the get bank name ")
                return this.fulfillGetBankNameIntent(response)
        }
        
        if (intentName == "getBankName - getCityName"){
            return this.fulfillGetCityIntent(response) 
        }

        if (intentName == "getBankName - getCityName - getBranchName"){
            return this.fulfillGetBankBranchNameIntent(response) 
        }
    }

    fulfillGetCityIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryResult = resp.queryResult.queryText
            console.log("Query Result : " + queryResult)
            resolve("NodejS Resoloving with : " + queryResult)
        })
    }

    fulfillGetBankNameIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryResult = resp.queryResult.queryText

            console.log("fulfillGetBankNameIntent : Query Result Bank Name : " + queryResult)
            // Find out how many banks we have... 
            bankColl.findBankNameContainingString(queryResult)           
            .then((matchedBankNames : [string]) => {
                if (matchedBankNames.length == 1){
                    resolve("Cool. I found your bank. " + matchedBankNames[0])
                }
                resolve("There are a lot of banks man.. ")
                
                //resolve("We found these many banks : " + queryResult + " ==> "+ matchedBankNames.length) 
            })
        })
    }


    fulfillGetBankBranchNameIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryResult = resp.queryResult.queryText
            console.log("Query Result Bank Name : " + queryResult)
            resolve("NodejS Resoloving with : " + queryResult)
        })
    }

}

