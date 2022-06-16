import { BigInt } from "@graphprotocol/graph-ts"
import {
    Auction,
    AuctionCancelled as AuctionCancelledEvent,
    AuctionCreated as AuctionCreatedEvent,
    AuctionSuccessful as AuctionSuccessfulEvent,
    OwnershipTransferred,
    Paused,
    Unpaused
} from "../../generated/Auction/Auction"
import {Auction_Created, Auction_Cancelled, Auction_Successful} from "../../generated/schema"

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
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
