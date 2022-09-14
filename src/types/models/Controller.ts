// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type ControllerProps = Omit<Controller, NonNullable<FunctionPropertyNames<Controller>>>;

export class Controller implements Entity {

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
        assert(id !== null, "Cannot save Controller entity without an ID");
        await store.set('Controller', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Controller entity without an ID");
        await store.remove('Controller', id.toString());
    }

    static async get(id:string): Promise<Controller | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Controller entity without an ID");
        const record = await store.get('Controller', id.toString());
        if (record){
            return Controller.create(record as ControllerProps);
        }else{
            return;
        }
    }



    static create(record: ControllerProps): Controller {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Controller(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
