// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type AccountCTokenTransactionProps = Omit<AccountCTokenTransaction, NonNullable<FunctionPropertyNames<AccountCTokenTransaction>>>;

export class AccountCTokenTransaction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId: string;

    public tx_hash: string;

    public timestamp: Date;

    public block: bigint;

    public logIndex: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AccountCTokenTransaction entity without an ID");
        await store.set('AccountCTokenTransaction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AccountCTokenTransaction entity without an ID");
        await store.remove('AccountCTokenTransaction', id.toString());
    }

    static async get(id:string): Promise<AccountCTokenTransaction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AccountCTokenTransaction entity without an ID");
        const record = await store.get('AccountCTokenTransaction', id.toString());
        if (record){
            return AccountCTokenTransaction.create(record as AccountCTokenTransactionProps);
        }else{
            return;
        }
    }


    static async getByAccountId(accountId: string): Promise<AccountCTokenTransaction[] | undefined>{
      
      const records = await store.getByField('AccountCTokenTransaction', 'accountId', accountId);
      return records.map(record => AccountCTokenTransaction.create(record as AccountCTokenTransactionProps));
      
    }


    static create(record: AccountCTokenTransactionProps): AccountCTokenTransaction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AccountCTokenTransaction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
