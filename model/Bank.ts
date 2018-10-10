import { BankBranchDetail } from './BankBranchDetail'

export class Bank {
    private _allKnownBankNames : any 
    private _allBranches : Array<BankBranchDetail>
    name : string

    bankNameStore : any 

    constructor(name : string, branchDetails : Array<{string:string}>) {
        this.name = name
        this._allBranches = branchDetails.map(eachBranch => {
            return new BankBranchDetail(eachBranch)        
        })
    }
}

export interface IHash {
    [details: string] : string;
} 
