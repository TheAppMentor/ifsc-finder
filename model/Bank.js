import { BankBranchDetail } from './BankBranchDetail';
export class Bank {
    constructor(name, branchDetails) {
        this.name = name;
        this._allBranches = branchDetails.map(eachBranch => {
            return new BankBranchDetail(eachBranch);
        });
    }
}
