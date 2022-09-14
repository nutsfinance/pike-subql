// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type RepayEventProps = Omit<RepayEvent, NonNullable<FunctionPropertyNames<RepayEvent>>>;

export class RepayEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public amount: bigint;

    public accountBorrows: bigint;

    public borrower: string;

    public blockNumber: number;

    public blockTime: Date;

    public underlyingSymbol: string;

    public payer: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save RepayEvent entity without an ID");
        await store.set('RepayEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove RepayEvent entity without an ID");
        await store.remove('RepayEvent', id.toString());
    }

    static async get(id:string): Promise<RepayEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get RepayEvent entity without an ID");
        const record = await store.get('RepayEvent', id.toString());
        if (record){
            return RepayEvent.create(record as RepayEventProps);
        }else{
            return;
        }
    }



    static create(record: RepayEventProps): RepayEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new RepayEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
