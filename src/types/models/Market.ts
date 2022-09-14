// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type MarketProps = Omit<Market, NonNullable<FunctionPropertyNames<Market>>>;

export class Market implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public borrowRate: bigint;

    public supplyRate: bigint;

    public collateralFactor: bigint;

    public exchangeRate: bigint;

    public interestRateModelAddress: string;

    public name: string;

    public symbol: string;

    public cash: bigint;

    public reserves: bigint;

    public totalBorrows: bigint;

    public totalSupply: bigint;

    public underlyingAddress: string;

    public underlyingName: string;

    public underlyingSymbol: string;

    public underlyingPrice: bigint;

    public underlyingDecimals: number;

    public accrualBlockNumber: number;

    public blockTimestamp: Date;

    public borrowIndex: bigint;

    public reserveFactor: bigint;

    public numberOfBorrowers: number;

    public numberOfSuppliers: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Market entity without an ID");
        await store.set('Market', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Market entity without an ID");
        await store.remove('Market', id.toString());
    }

    static async get(id:string): Promise<Market | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Market entity without an ID");
        const record = await store.get('Market', id.toString());
        if (record){
            return Market.create(record as MarketProps);
        }else{
            return;
        }
    }



    static create(record: MarketProps): Market {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Market(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
