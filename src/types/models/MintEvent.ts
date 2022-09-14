// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type MintEventProps = Omit<MintEvent, NonNullable<FunctionPropertyNames<MintEvent>>>;

export class MintEvent implements Entity {

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

    public underlyingAmount?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save MintEvent entity without an ID");
        await store.set('MintEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove MintEvent entity without an ID");
        await store.remove('MintEvent', id.toString());
    }

    static async get(id:string): Promise<MintEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get MintEvent entity without an ID");
        const record = await store.get('MintEvent', id.toString());
        if (record){
            return MintEvent.create(record as MintEventProps);
        }else{
            return;
        }
    }



    static create(record: MintEventProps): MintEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new MintEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
