import {
    Auction,
    AuctionCancelled as AuctionCancelledEvent,
    AuctionCreated as AuctionCreatedEvent,
    AuctionSuccessful as AuctionSuccessfulEvent,
    OwnershipTransferred,
    Paused,
    Unpaused
} from "../../generated/Auction/Auction"

import {
    Auction_Created,
    Auction_Cancelled,
    Auction_Successful,
    Auction_Day,
    Auction_Week,
    Auction_Month,
} from "../../generated/schema"

import {BigInt, BigDecimal, Address} from '@graphprotocol/graph-ts'

export let ZERO_BD = BigDecimal.fromString('0')
export let ZERO_BI = BigInt.fromI32(0)


export function handleAuctionCancelled(event: AuctionCancelledEvent): void {
    let entity = Auction_Cancelled.load(event.transaction.from.toHex())

    if (!entity) {
        entity = new Auction_Cancelled(event.transaction.from.toHex())
    }

    entity.nftAddress = event.params._nftAddress;
    entity.tokenId = event.params._tokenId;
    entity.timestamp = event.block.timestamp;

    entity.save()
}

export function handleAuctionCreated(event: AuctionCreatedEvent): void {

    let entity = Auction_Created.load(event.transaction.from.toHex())

    if (!entity) {
        entity = new Auction_Created(event.transaction.from.toHex())
    }

    entity.seller = event.params._seller;
    entity.duration = event.params._duration;
    entity.startingPrice = event.params._startingPrice;
    entity.endingPrice = event.params._endingPrice;
    entity.tokenId = event.params._tokenId;
    entity.nftAddress = event.params._nftAddress;
    entity.timestamp = event.block.timestamp;
    entity.save()

    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400

    let weekIndex = timestamp / 604800
    let weekStartTimestamp = weekIndex * 604800

    let monthIndex = timestamp / 2592000
    let monthStartTimestamp = monthIndex * 2592000

    let day = Auction_Day.load(dayStartTimestamp.toString())
    let week = Auction_Week.load(weekStartTimestamp.toString())
    let month = Auction_Month.load(monthStartTimestamp.toString())
    let alldays = Auction_Day.load("0")

    if (!day) {
        day = new Auction_Day(dayStartTimestamp.toString())
        day.totalSale = ZERO_BI;
        day.totalSold = ZERO_BI;
        day.totalVolume = ZERO_BI;
    }

    if (!week) {
        week = new Auction_Week(weekStartTimestamp.toString())
        week.totalSale = ZERO_BI;
        week.totalSold = ZERO_BI;
        week.totalVolume = ZERO_BI;
    }

    if (!month) {
        month = new Auction_Month(weekStartTimestamp.toString())
        month.totalSale = ZERO_BI;
        month.totalSold = ZERO_BI;
        month.totalVolume = ZERO_BI;
    }

    if (!alldays) {
        alldays = new Auction_Day("0")
        alldays.totalSale = ZERO_BI;
        alldays.totalSold = ZERO_BI;
        alldays.totalVolume = ZERO_BI;
    }


    // @ts-ignore
    day.totalSale = day.totalSale + BigInt.fromI32(1)
    // @ts-ignore
    week.totalSale = week.totalSale + BigInt.fromI32(1)
    // @ts-ignore
    month.totalSale = month.totalSale + BigInt.fromI32(1)
    // @ts-ignore
    alldays.totalSale = alldays.totalSale + BigInt.fromI32(1)

    day.save();
    week.save();
    month.save()
    alldays.save();

}

export function handleAuctionSuccessful(event: AuctionSuccessfulEvent): void {
    let entity = Auction_Successful.load(event.transaction.from.toHex())

    if (!entity) {
        entity = new Auction_Successful(event.transaction.from.toHex())
    }

    entity.seller = event.params._seller;
    entity.winer = event.params._winner;
    entity.totalPrice = event.params._totalPrice;
    entity.tokenId = event.params._tokenId;
    entity.nftAddress = event.params._nftAddress;
    entity.timestamp = event.block.timestamp;
    entity.save()

    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400

    let weekIndex = timestamp / 604800
    let weekStartTimestamp = weekIndex * 604800

    let monthIndex = timestamp / 2592000
    let monthStartTimestamp = monthIndex * 2592000

    let day = Auction_Day.load(dayStartTimestamp.toString())
    let week = Auction_Week.load(weekStartTimestamp.toString())
    let month = Auction_Month.load(monthStartTimestamp.toString())
    let alldays = Auction_Day.load("0")

    if (!day) {
        day = new Auction_Day(dayStartTimestamp.toString())
        day.totalSale = ZERO_BI;
        day.totalSold = ZERO_BI;
        day.totalVolume = ZERO_BI;
    }

    if (!week) {
        week = new Auction_Week(weekStartTimestamp.toString())
        week.totalSale = ZERO_BI;
        week.totalSold = ZERO_BI;
        week.totalVolume = ZERO_BI;
    }

    if (!month) {
        month = new Auction_Month(weekStartTimestamp.toString())
        month.totalSale = ZERO_BI;
        month.totalSold = ZERO_BI;
        month.totalVolume = ZERO_BI;
    }

    if (!alldays) {
        alldays = new Auction_Day("0")
        alldays.totalSale = ZERO_BI;
        alldays.totalSold = ZERO_BI;
        alldays.totalVolume = ZERO_BI;
    }


    // @ts-ignore
    day.totalSold = day.totalSold + BigInt.fromI32(1)
    // @ts-ignore
    week.totalSold = week.totalSold + BigInt.fromI32(1)
    // @ts-ignore
    month.totalSold = month.totalSold + BigInt.fromI32(1)
    // @ts-ignore
    alldays.totalSold = alldays.totalSold + BigInt.fromI32(1)

    // @ts-ignore
    day.totalVolume = day.totalVolume + event.params._totalPrice;
    // @ts-ignore
    week.totalVolume = week.totalVolume + event.params._totalPrice;
    // @ts-ignore
    month.totalVolume = month.totalVolume + event.params._totalPrice;
    // @ts-ignore
    alldays.totalVolume = alldays.totalVolume + event.params._totalPrice;

    day.save();
    week.save();
    month.save()
    alldays.save();

}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePaused(event: Paused): void {
}

export function handleUnpaused(event: Unpaused): void {
}
