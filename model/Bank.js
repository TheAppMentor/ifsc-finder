"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankBranchDetail_1 = require("./BankBranchDetail");
var Bank = /** @class */ (function () {
    function Bank(name, branchDetails) {
        this.name = name;
        this._allBranches = branchDetails.map(function (eachBranch) {
            return new BankBranchDetail_1.BankBranchDetail(eachBranch);
        });
    }
    return Bank;
}());
exports.Bank = Bank;
