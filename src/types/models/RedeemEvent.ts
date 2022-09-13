// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type RedeemEventProps = Omit<RedeemEvent, NonNullable<FunctionPropertyNames<RedeemEvent>>>;

export class RedeemEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public amount: bigint;

    public to: string;

    public from: string;

    public blockNumber: number;

    public blockTime: number;

    public cTokenSymbol: string;

    public underlyingAmount?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save RedeemEvent entity without an ID");
        await store.set('RedeemEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove RedeemEvent entity without an ID");
        await store.remove('RedeemEvent', id.toString());
    }

    static async get(id:string): Promise<RedeemEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get RedeemEvent entity without an ID");
        const record = await store.get('RedeemEvent', id.toString());
        if (record){
            return RedeemEvent.create(record as RedeemEventProps);
        }else{
            return;
        }
    }



    static create(record: RedeemEventProps): RedeemEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new RedeemEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
