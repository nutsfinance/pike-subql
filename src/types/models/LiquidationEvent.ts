// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type LiquidationEventProps = Omit<LiquidationEvent, NonNullable<FunctionPropertyNames<LiquidationEvent>>>;

export class LiquidationEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public amount: bigint;

    public to: string;

    public from: string;

    public blockNumber: number;

    public blockTime: Date;

    public cTokenSymbol: string;

    public underlyingSymbol: string;

    public underlyingRepayAmount: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LiquidationEvent entity without an ID");
        await store.set('LiquidationEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LiquidationEvent entity without an ID");
        await store.remove('LiquidationEvent', id.toString());
    }

    static async get(id:string): Promise<LiquidationEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LiquidationEvent entity without an ID");
        const record = await store.get('LiquidationEvent', id.toString());
        if (record){
            return LiquidationEvent.create(record as LiquidationEventProps);
        }else{
            return;
        }
    }



    static create(record: LiquidationEventProps): LiquidationEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new LiquidationEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
