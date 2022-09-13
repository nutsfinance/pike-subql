// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type BorrowEventProps = Omit<BorrowEvent, NonNullable<FunctionPropertyNames<BorrowEvent>>>;

export class BorrowEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public amount: bigint;

    public accountBorrows: bigint;

    public borrower: string;

    public blockNumber: number;

    public blockTime: number;

    public underlyingSymbol: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BorrowEvent entity without an ID");
        await store.set('BorrowEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BorrowEvent entity without an ID");
        await store.remove('BorrowEvent', id.toString());
    }

    static async get(id:string): Promise<BorrowEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get BorrowEvent entity without an ID");
        const record = await store.get('BorrowEvent', id.toString());
        if (record){
            return BorrowEvent.create(record as BorrowEventProps);
        }else{
            return;
        }
    }



    static create(record: BorrowEventProps): BorrowEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new BorrowEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
