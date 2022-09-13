// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type ComptrollerProps = Omit<Comptroller, NonNullable<FunctionPropertyNames<Comptroller>>>;

export class Comptroller implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public priceOracle?: string;

    public closeFactor?: bigint;

    public liquidationIncentive?: bigint;

    public maxAssets?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Comptroller entity without an ID");
        await store.set('Comptroller', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Comptroller entity without an ID");
        await store.remove('Comptroller', id.toString());
    }

    static async get(id:string): Promise<Comptroller | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Comptroller entity without an ID");
        const record = await store.get('Comptroller', id.toString());
        if (record){
            return Comptroller.create(record as ComptrollerProps);
        }else{
            return;
        }
    }



    static create(record: ComptrollerProps): Comptroller {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Comptroller(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
