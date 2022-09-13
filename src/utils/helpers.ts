import { Account, AccountCToken, AccountCTokenTransaction } from "../types/models"

export let zeroBD = BigInt(0)

export async function createAccount(accountID: string): Promise<Account> {
  let account = new Account(accountID)
  account.countLiquidated = 0
  account.countLiquidator = 0
  account.hasBorrowed = false
  await account.save()
  return account
}

export async function updateCommonCTokenStats(marketId: string, marketSymbol: string, accountId: string,
    tx_hash: string, timestamp: BigInt, blockNumber: number, logIndex: number): Promise<AccountCToken> {
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
    cTokenStats.accrualBlockNumber = BigInt(0);
    cTokenStats.cTokenBalance = zeroBD;
    cTokenStats.totalUnderlyingSupplied = zeroBD;
    cTokenStats.totalUnderlyingRedeemed = zeroBD;
    cTokenStats.accountBorrowIndex = zeroBD;
    cTokenStats.totalUnderlyingBorrowed = zeroBD;
    cTokenStats.totalUnderlyingRepaid = zeroBD;
    cTokenStats.storedBorrowBalance = zeroBD;
    cTokenStats.enteredMarket = false;
    await cTokenStats.save();

    return cTokenStats;
}


export async function getOrCreateAccountCTokenTransaction(accountId: string, tx_hash: string, timestamp: BigInt, block: number, logIndex: number): Promise<AccountCTokenTransaction> {
    const id = `${accountId}-${tx_hash}-${logIndex}`;
    let transaction = await AccountCTokenTransaction.get(id);
    if (!transaction) {
      transaction = new AccountCTokenTransaction(id);
      transaction.accountId = accountId;
      transaction.tx_hash = tx_hash;
      transaction.timestamp = BigInt(timestamp.toString());
      transaction.block = BigInt(+block);
      transaction.logIndex = BigInt(+logIndex);
      await transaction.save();
    }

    return transaction;
}