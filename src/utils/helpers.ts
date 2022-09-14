import { Account, AccountCToken, AccountCTokenTransaction, Market } from "../types/models"
import FrontierEthProvider from "@subql/acala-evm-processor/dist/acalaEthProvider";
import { getComptroller, getMarket } from "./records";
import cTokenAbi from '../abis/CToken.abi.json';
import priceOracleAbi from '../abis/PriceOracle.abi.json';
import { ethers } from "ethers";

export const ZERO = BigInt(0);

export async function createAccount(accountID: string): Promise<Account> {
    let account = new Account(accountID);
    account.countLiquidated = 0;
    account.countLiquidator = 0;
    account.hasBorrowed = false;
    await account.save();
    return account;
}

export async function updateCommonCTokenStats(marketId: string, marketSymbol: string, accountId: string,
    tx_hash: string, timestamp: Date, blockNumber: number, logIndex: number): Promise<AccountCToken> {
    const cTokenStatsId = `${marketId}-${accountId}`;
    let cTokenStats = await AccountCToken.get(cTokenStatsId);
    if (!cTokenStats) {
      cTokenStats = await createAccountCToken(cTokenStatsId, marketSymbol, accountId, marketId);
    }

    await getOrCreateAccountCTokenTransaction(cTokenStatsId, tx_hash, timestamp, blockNumber, logIndex)
    cTokenStats.accrualBlockNumber = BigInt(+blockNumber);
    return cTokenStats;
}

export async function createAccountCToken(cTokenStatsId: string, symbol: string, account: string, marketId: string): Promise<AccountCToken> {
    let cTokenStats = new AccountCToken(cTokenStatsId);
    cTokenStats.symbol = symbol;
    cTokenStats.marketId = marketId;
    cTokenStats.accountId = account;
    cTokenStats.accrualBlockNumber = ZERO;
    cTokenStats.cTokenBalance = ZERO;
    cTokenStats.totalUnderlyingSupplied = ZERO;
    cTokenStats.totalUnderlyingRedeemed = ZERO;
    cTokenStats.accountBorrowIndex = ZERO;
    cTokenStats.totalUnderlyingBorrowed = ZERO;
    cTokenStats.totalUnderlyingRepaid = ZERO;
    cTokenStats.storedBorrowBalance = ZERO;
    cTokenStats.enteredMarket = false;
    await cTokenStats.save();

    return cTokenStats;
}


export async function getOrCreateAccountCTokenTransaction(accountId: string, tx_hash: string, timestamp: Date, block: number, logIndex: number): Promise<AccountCTokenTransaction> {
    const id = `${accountId}-${tx_hash}-${logIndex}`;
    let transaction = await AccountCTokenTransaction.get(id);
    if (!transaction) {
      transaction = new AccountCTokenTransaction(id);
      transaction.accountId = accountId;
      transaction.tx_hash = tx_hash;
      transaction.timestamp = timestamp;
      transaction.block = BigInt(+block);
      transaction.logIndex = BigInt(+logIndex);
      await transaction.save();
    }

    return transaction;
}

export async function getTokenPrice(marketId: string): Promise<bigint> {
  const comptroller = await getComptroller("1");
  if (!comptroller.priceOracle) return ZERO;
  const priceOracle = new ethers.Contract(comptroller.priceOracle, priceOracleAbi, new FrontierEthProvider());

  return (await priceOracle.getUnderlyingPrice(marketId)).toBigInt();
}

export async function updateMarket(marketId: string, blockNumber: number, blockTimestamp: Date): Promise<Market> {
  const market = await getMarket(marketId);
  // Only updateMarket if it has not been updated this block
  if (market.accrualBlockNumber === blockNumber)  return market;

  market.underlyingPrice = await getTokenPrice(marketId);

  const cToken = new ethers.Contract(marketId, cTokenAbi, new FrontierEthProvider());
  market.accrualBlockNumber = (await cToken.accrualBlockNumber()).toNumber();
  market.blockTimestamp = blockTimestamp;
  market.totalSupply = (await cToken.totalSupply()).toBigInt();

  /* Exchange rate explanation
    In Practice
    - If you call the cDAI contract on etherscan it comes back (2.0 * 10^26)
    - If you call the cUSDC contract on etherscan it comes back (2.0 * 10^14)
    - The real value is ~0.02. So cDAI is off by 10^28, and cUSDC 10^16
    How to calculate for tokens with different decimals
    - Must div by tokenDecimals, 10^market.underlyingDecimals
    - Must multiply by ctokenDecimals, 10^8
    - Must div by mantissa, 10^18
  */
  market.exchangeRate = (await cToken.exchangeRateStored()).toBigInt();
  market.borrowIndex = (await cToken.borrowIndex()).toBigInt();
  market.reserves = (await cToken.totalReserves()).toBigInt();
  market.totalBorrows = (await cToken.totalBorrows()).toBigInt();
  market.cash = (await cToken.getCash()).toBigInt();
  market.supplyRate = (await cToken.supplyRatePerBlock()).toBigInt();
  market.borrowRate = (await cToken.borrowRatePerBlock()).toBigInt();
  market.save();

  return market;
}