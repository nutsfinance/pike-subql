/* eslint-disable prefer-const */ // to satisfy AS compiler

import { AcalaEvmEvent } from "@subql/acala-evm-processor";
import { BigNumber } from "ethers";
import { getAccount, getComptroller, getMarket } from "../utils/records";
import { updateCommonCTokenStats, updateMarket, ZERO } from "../utils/helpers";

type MintEventArgs = [string, BigNumber, BigNumber] &  { minter: string, mintAmount: BigNumber, mintTokens: BigNumber };
type RedeemEventArgs = [ string, BigNumber, BigNumber ] & { redeemer: string, redeemAmount: BigNumber, redeemTokens: BigNumber };
type BorrowEventArgs = [string, BigNumber, BigNumber, BigNumber] & { borrower: string, borrowAmount: BigNumber, accountBorrows: BigNumber, totalBorrows: BigNumber };
type RepayBorrowEventArgs = [ string, string, BigNumber, BigNumber, BigNumber ] & { payer: string, borrower: string, repayAmount: BigNumber, accountBorrows: BigNumber, totalBorrows: BigNumber };
type LiquidateBorrowEventArgs = [string, string, BigNumber, string, BigNumber] & { liquidator: string, borrower: string, repayAmount: BigNumber, cTokenCollateral: string, seizeTokens: BigNumber };
type TransferEventArgs = [string, string, BigNumber] & { from: string, to: string, amount: BigNumber };
type NewReserveFactorEventArgs = [BigNumber, BigNumber] & { oldReserveFactorMantissa: BigNumber, newReserveFactorMantissa: BigNumber };
type NewMarketInterestRateModelEventArgs = [string, string] & { oldInterestRateModel: string, newInterestRateModel: string };

/* Borrow assets from the protocol. All values either ETH or ERC20
 *
 * event.params.totalBorrows = of the whole market (not used right now)
 * event.params.accountBorrows = total of the account
 * event.params.borrowAmount = that was added in this event
 * event.params.borrower = the account
 * Notes
 *    No need to updateMarket(), handleAccrueInterest() ALWAYS runs before this
 */
export async function handleBorrow(event: AcalaEvmEvent<BorrowEventArgs>): Promise<void> {
  // Ensures that the market is created if absent
  const market = await getMarket(event.address);
  // Ensures that the account is created if absent
  const account = await getAccount(event.args.borrower);

  // Update cTokenStats common for all events, and return the stats to update unique
  // values for each event
  const cTokenStats = await updateCommonCTokenStats(
    market.id,
    market.symbol,
    account.id,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    event.blockNumber,
    event.logIndex,
  );

  const previousBorrow = cTokenStats.storedBorrowBalance;
  cTokenStats.storedBorrowBalance = event.args.accountBorrows.toBigInt();
  cTokenStats.accountBorrowIndex = market.borrowIndex;
  cTokenStats.totalUnderlyingBorrowed = cTokenStats.totalUnderlyingBorrowed + event.args.borrowAmount.toBigInt();
  cTokenStats.save();

  account.hasBorrowed = true;
  account.save();

  if (previousBorrow == BigInt(0) &&
    event.args.accountBorrows.toBigInt() != BigInt(0) // checking edge case for borrwing 0
  ) {
    market.numberOfBorrowers++;
    market.save();
  }
}

/* Repay some amount borrowed. Anyone can repay anyones balance
 *
 * event.params.totalBorrows = of the whole market (not used right now)
 * event.params.accountBorrows = total of the account (not used right now)
 * event.params.repayAmount = that was added in this event
 * event.params.borrower = the borrower
 * event.params.payer = the payer
 *
 * Notes
 *    No need to updateMarket(), handleAccrueInterest() ALWAYS runs before this
 *    Once a account totally repays a borrow, it still has its account interest index set to the
 *    markets value. We keep this, even though you might think it would reset to 0 upon full
 *    repay.
 */
export async function handleRepayBorrow(event: AcalaEvmEvent<RepayBorrowEventArgs>): Promise<void> {
  // Ensures that the market is created if absent
  const market = await getMarket(event.address);
  // Ensures that the account is created if absent
  const account = await getAccount(event.args.borrower);

  // Update cTokenStats common for all events, and return the stats to update unique
  // values for each event
  const cTokenStats = await updateCommonCTokenStats(
    market.id,
    market.symbol,
    account.id,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    event.blockNumber,
    event.logIndex,
  );

  cTokenStats.storedBorrowBalance = event.args.accountBorrows.toBigInt();
  cTokenStats.accountBorrowIndex = market.borrowIndex;
  cTokenStats.totalUnderlyingRepaid = cTokenStats.totalUnderlyingRepaid + event.args.repayAmount.toBigInt();
  cTokenStats.save();

  if (cTokenStats.storedBorrowBalance == BigInt(0)) {
    market.numberOfBorrowers--;
    market.save();
  }
}


/*
 * Liquidate an account who has fell below the collateral factor.
 *
 * event.params.borrower - the borrower who is getting liquidated of their cTokens
 * event.params.cTokenCollateral - the market ADDRESS of the ctoken being liquidated
 * event.params.liquidator - the liquidator
 * event.params.repayAmount - the amount of underlying to be repaid
 * event.params.seizeTokens - cTokens seized (transfer event should handle this)
 *
 * Notes
 *    No need to updateMarket(), handleAccrueInterest() ALWAYS runs before this.
 *    When calling this function, event RepayBorrow, and event Transfer will be called every
 *    time. This means we can ignore repayAmount. Seize tokens only changes state
 *    of the cTokens, which is covered by transfer. Therefore we only
 *    add liquidation counts in this handler.
 */
export async function handleLiquidateBorrow(event: AcalaEvmEvent<LiquidateBorrowEventArgs>): Promise<void> {
  // Ensures liquidator account exist
  const liquidator = await getAccount(event.args.liquidator);
  liquidator.countLiquidator++;
  liquidator.save()

  // Ensures borrowers account exist
  const borrower = await getAccount(event.args.borrower);
  borrower.countLiquidated++;
  borrower.save();
}

/* Transferring of cTokens
 *
 * event.params.from = sender of cTokens
 * event.params.to = receiver of cTokens
 * event.params.amount = amount sent
 *
 * Notes
 *    Possible ways to emit Transfer:
 *      seize() - i.e. a Liquidation Transfer (does not emit anything else)
 *      redeemFresh() - i.e. redeeming your cTokens for underlying asset
 *      mintFresh() - i.e. you are lending underlying assets to create ctokens
 *      transfer() - i.e. a basic transfer
 *    This function handles all 4 cases. Transfer is emitted alongside the mint, redeem, and seize
 *    events. So for those events, we do not update cToken balances.
 */
export async function handleTransfer(event: AcalaEvmEvent<TransferEventArgs>): Promise<void> {
  // We only updateMarket() if accrual block number is not up to date. This will only happen
  // with normal transfers, since mint, redeem, and seize transfers will already run updateMarket()
  let market = await getMarket(event.address);
  if (market.accrualBlockNumber != event.blockNumber) {
    market = await updateMarket(event.address, event.blockNumber, event.blockTimestamp.getTime());
  }

  const amountUnderlying = market.exchangeRate * event.args.amount.toBigInt();
  const accountFromId = event.args.from;

  // Transfer from == cToken in minting
  // https://github.com/nutsfinance/compound-protocol/blob/6cf0139e4af1ca406107c8c0fef374e3cde0c5ed/contracts/CToken.sol#L555
  if (accountFromId != market.id) {
    const accountFrom = await getAccount(accountFromId);

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsFrom = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountFromId,
      event.transactionHash,
      BigInt(event.blockTimestamp.getTime()),
      event.blockNumber,
      event.logIndex,
    );

    cTokenStatsFrom.cTokenBalance = cTokenStatsFrom.cTokenBalance - event.args.amount.toBigInt();
    // Transfer is emitted in the following three cases when from != cToken:
    // 1. Redeem
    // 2. Sieze
    // 3. Normal transfer
    // In either case, from account redeems the cToken
    cTokenStatsFrom.totalUnderlyingRedeemed = cTokenStatsFrom.totalUnderlyingRedeemed + amountUnderlying;
    cTokenStatsFrom.save();

    if (cTokenStatsFrom.cTokenBalance == ZERO) {
      market.numberOfSuppliers;
      market.save();
    }
  }

  let accountToId = event.args.to;
  // Transfer to == cToken in redeeming or siezing
  if (accountToId != market.id) {
    const accountTo = await getAccount(accountFromId);

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsTo = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountToId,
      event.transactionHash,
      BigInt(event.blockTimestamp.getTime()),
      event.blockNumber,
      event.logIndex,
    )

    let previousCTokenBalanceTo = cTokenStatsTo.cTokenBalance;
    // Transfer is emited in the following case when to != cToken:
    // 1. Mint
    // 2. Sieze
    // 3. Normal transfer
    // In either case, to account mints the token
    cTokenStatsTo.cTokenBalance = cTokenStatsTo.cTokenBalance + event.args.amount.toBigInt();
    cTokenStatsTo.totalUnderlyingSupplied = cTokenStatsTo.totalUnderlyingSupplied + amountUnderlying;
    cTokenStatsTo.save();

    if (
      previousCTokenBalanceTo == ZERO &&
      event.args.amount.toBigInt()!= ZERO // checking edge case for transfers of 0
    ) {
      market.numberOfSuppliers++;
      market.save();
    }
  }
}

export async function handleAccrueInterest(event: AcalaEvmEvent): Promise<void> {
  await updateMarket(event.address, event.blockNumber, event.blockTimestamp.getTime());
}

export async function handleNewReserveFactor(event: AcalaEvmEvent<NewReserveFactorEventArgs>): Promise<void> {
  const market = await getMarket(event.address);
  market.reserveFactor = event.args.newReserveFactorMantissa.toBigInt();
  market.save();
}

export async function handleNewMarketInterestRateModel(event: AcalaEvmEvent<NewMarketInterestRateModelEventArgs>): Promise<void> {
  const market = await getMarket(event.address);
  market.interestRateModelAddress = event.args.newInterestRateModel;
  market.save();
}