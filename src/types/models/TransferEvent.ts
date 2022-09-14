// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type TransferEventProps = Omit<TransferEvent, NonNullable<FunctionPropertyNames<TransferEvent>>>;

export class TransferEvent implements Entity {

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


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TransferEvent entity without an ID");
        await store.set('TransferEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TransferEvent entity without an ID");
        await store.remove('TransferEvent', id.toString());
    }

    static async get(id:string): Promise<TransferEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TransferEvent entity without an ID");
        const record = await store.get('TransferEvent', id.toString());
        if (record){
            return TransferEvent.create(record as TransferEventProps);
        }else{
            return;
        }
    }



    static create(record: TransferEventProps): TransferEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new TransferEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
