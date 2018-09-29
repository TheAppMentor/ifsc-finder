const parseJson = require('parse-json');
const Promise = require("bluebird");

export class DialogFlowRespParser {

   fulfillGetCityIntent(dialogFlowResp : string) : Promise<string> {

   return new Promise((resolve : any, reject : any) => {
    resolve("talking back baby.. ")
       
   })
}

}

