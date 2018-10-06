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
            let sessionID = resp["session"]
            console.log("REsponse Parser talking : Sesion is " + sessionID)
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

        if (intentName == "getBankName - getCityName - getBankBranchDetails"){
            return this.fulfillGetBankBranchNameIntent(response) 
        }
    }

    fulfillGetCityIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryText = resp.queryResult.queryText
            console.log("Query Result : " + queryText)

            let queryResult = resp.queryResult
            var bankNameIdentified = "Unknown Bank !!" 

            //Extract the city Name from the intent.
            //"geo-city"
           
            var inputCityName = queryResult.parameters["geo-city"] 
            

            for (var eachContext of resp.queryResult.outputContexts){
                //if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup"){
                if (eachContext.name == resp.session + "/contexts/getbankname-followup"){
                            console.log("We are looking at context : " + resp.session +  "/contexts/getbankname-followup")
                    bankNameIdentified = eachContext.parameters["bankNameIdentified"]
                }
            }
                console.log("Bank Name identified : ==> " +  bankNameIdentified)
                    let responseObject = {fulfillmentText : ("NodejS : Look like you want " + inputCityName + "Resoloving with : " + bankNameIdentified)}
                resolve(responseObject)
            })
        }

    fulfillGetBankNameIntent(dialogFlowResp : string) : Promise<string> {
        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryResult = resp.queryResult.queryText
            let bankName = resp.queryResult.parameters.bankName

            console.log("fulfillGetBankNameIntent : Query Result Bank Name : " + bankName)
            // Find out how many banks we have... 
            bankColl.findBankNameContainingString(bankName)           
            .then((matchedBankNames : Array<string>) => {
                if (matchedBankNames.length == 1){
                    let responseObject = {fulfillmentText : ("Cool. I found your bank. " + matchedBankNames[0])}
                    
                    //"projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup"
                    
                    for (var eachContext of resp.queryResult.outputContexts){
                            console.log("We are looking at context : " + resp.session + "/contexts/getbankname-followup")
                        if (eachContext.name == resp.session + "/contexts/getbankname-followup"){
                        //if (eachContext.name == resp.session + "getbankname-followup"){
                            console.log("We are looking at context : " + resp.session)
                            eachContext.parameters["bankNameIdentified"] = matchedBankNames[0] 
                        }
                        responseObject["outputContexts"]= [eachContext]
                    }

                    resolve(responseObject)
                }
                resolve("We have found many banks that match : " + matchedBankNames.length)
            }).catch((err) => {
                reject("Error ! : dialogflow-responseParser.ts => " + err)
            })
        })
    }


    fulfillGetBankBranchNameIntent(dialogFlowResp : string) : Promise<string> {

        return new Promise((resolve : any, reject : any) => {
            let resp = parseJson(dialogFlowResp)
            let queryText = resp.queryResult.queryText
            let queryResponse = resp.queryResult
            
            let bankNameIdentified = "Unknown !!"
            let inputCityName = "Unknown !!"
            
            for (var eachContext of resp.queryResult.outputContexts){
                if (eachContext.name == "projects/ifsc-finder-a3f6d/agent/sessions/4b813ab6-7c80-117d-4e2f-118f51fcf2e8/contexts/getbankname-followup"){
                    bankNameIdentified = eachContext.parameters["bankNameIdentified"]
                    inputCityName = eachContext.parameters["geo-city"]
                }
            }
          
            bankColl.getBranchesDetailsForBankInCityWithBranchName(bankNameIdentified,inputCityName,queryText).then((bankBranchDetailsArr : Array<BankBranchDetail>) => {
            let responseObject = {fulfillmentText : ("Cool. BankName = " + bankNameIdentified + "City Name : " + inputCityName + "Branch Name :" + queryText + "Count = " + bankBranchDetailsArr.length)}
            resolve(responseObject)
            })
        })
    }


    getOutputContextsFromResponse(dialogFlowResp : string) : Promise<string>{
        return new Promise((resolve : any, reject : any) => {
            
            let resp = parseJson(dialogFlowResp)
            let outputContexts = resp.queryResult.getOutputContexts;
            
        
        })

    }
}

