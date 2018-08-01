var mongoose = require('mongoose')

export let BankBranchDetailSchema = new mongoose.Schema({
    name : String,
    ifsc : String,
    micr : String,
    branch : String,
    address : String,
    contact : String,
    city : String,
    district : String,
    state : String
})

export class BankBranchDetail {
    name : string
    ifsc : string
    micr : string
    branch : string
    address : string
    contact : string
    city : string
    district : string
    state : string

    constructor(bankObj : {string:string}, fromJSONFile : boolean = false){

        if (fromJSONFile == true) {

            this.name = bankObj["name"]
            this.ifsc = bankObj["ifsc"]
            this.micr = bankObj["micr"]
            this.branch = bankObj["branch"] 
            this.address = bankObj["address"] 
            this.contact = bankObj["contact"] 
            this.city = bankObj["city"] 
            this.district = bankObj["district"] 
            this.state = bankObj["state"] 
            return
        }

        this.name = bankObj["BANK"]
        this.ifsc = bankObj["IFSC"]
        this.micr = bankObj["MICR CODE"]
        this.branch = bankObj["BRANCH"] 
        this.address = bankObj["ADDRESS"] 
        this.contact = bankObj["CONTACT"] 
        this.city = bankObj["CITY"] 
        this.district = bankObj["DISTRICT"] 
        this.state = bankObj["STATE"] 

    }
}
