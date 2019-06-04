"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
exports.BankBranchDetailSchema = new mongoose.Schema({
    name: String,
    ifsc: String,
    micr: String,
    branch: String,
    address: String,
    contact: String,
    city: String,
    district: String,
    state: String,
    pincode: String
});
var BankBranchDetail = /** @class */ (function () {
    function BankBranchDetail(bankObj, fromJSONFile) {
        if (fromJSONFile === void 0) { fromJSONFile = false; }
        if (fromJSONFile == true) {
            this.name = bankObj["name"];
            this.ifsc = bankObj["ifsc"];
            this.micr = bankObj["micr"];
            this.branch = bankObj["branch"];
            this.address = bankObj["address"];
            this.contact = bankObj["contact"];
            this.city = bankObj["city"];
            this.district = bankObj["district"];
            this.state = bankObj["state"];
            this.pincode = bankObj["pincode"];
            return;
        }
        this.name = bankObj["BANK"];
        this.ifsc = bankObj["IFSC"];
        this.micr = bankObj["MICR CODE"];
        this.branch = bankObj["BRANCH"];
        this.address = bankObj["ADDRESS"];
        this.contact = bankObj["CONTACT"];
        this.city = bankObj["CITY"];
        this.district = bankObj["DISTRICT"];
        this.state = bankObj["STATE"];
        this.pincode = bankObj["PINCODE"];
    }
    return BankBranchDetail;
}());
exports.BankBranchDetail = BankBranchDetail;
