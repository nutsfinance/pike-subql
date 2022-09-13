// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type AccountCTokenProps = Omit<AccountCToken, NonNullable<FunctionPropertyNames<AccountCToken>>>;

export class AccountCToken implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public marketId: string;

    public symbol: string;

    public accountId: string;

    public accrualBlockNumber: bigint;

    public enteredMarket: boolean;

    public cTokenBalance: bigint;

    public totalUnderlyingSupplied: bigint;

    public totalUnderlyingRedeemed: bigint;

    public accountBorrowIndex: bigint;

    public totalUnderlyingBorrowed: bigint;

    public totalUnderlyingRepaid: bigint;

    public storedBorrowBalance: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AccountCToken entity without an ID");
        await store.set('AccountCToken', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AccountCToken entity without an ID");
        await store.remove('AccountCToken', id.toString());
    }

    static async get(id:string): Promise<AccountCToken | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AccountCToken entity without an ID");
        const record = await store.get('AccountCToken', id.toString());
        if (record){
            return AccountCToken.create(record as AccountCTokenProps);
        }else{
            return;
        }
    }


    static async getByMarketId(marketId: string): Promise<AccountCToken[] | undefined>{
      
      const records = await store.getByField('AccountCToken', 'marketId', marketId);
      return records.map(record => AccountCToken.create(record as AccountCTokenProps));
      
    }

    static async getByAccountId(accountId: string): Promise<AccountCToken[] | undefined>{
      
      const records = await store.getByField('AccountCToken', 'accountId', accountId);
      return records.map(record => AccountCToken.create(record as AccountCTokenProps));
      
    }


    static create(record: AccountCTokenProps): AccountCToken {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AccountCToken(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
