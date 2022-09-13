// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type CTokenProps = Omit<CToken, NonNullable<FunctionPropertyNames<CToken>>>;

export class CToken implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public cToken: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CToken entity without an ID");
        await store.set('CToken', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CToken entity without an ID");
        await store.remove('CToken', id.toString());
    }

    static async get(id:string): Promise<CToken | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CToken entity without an ID");
        const record = await store.get('CToken', id.toString());
        if (record){
            return CToken.create(record as CTokenProps);
        }else{
            return;
        }
    }



    static create(record: CTokenProps): CToken {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new CToken(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
