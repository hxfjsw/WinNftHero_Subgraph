import { BigInt } from "@graphprotocol/graph-ts"
import {
    Auction,
    AuctionCancelled,
    AuctionCreated,
    AuctionSuccessful,
    OwnershipTransferred,
    Paused,
    Unpaused
} from "../../generated/Auction/Auction"
import { Auction_Created,Auction_Cancelled } from "../../generated/schema"

export function handleAuctionCancelled(event: AuctionCancelled): void {


}

export function handleAuctionCreated(event: AuctionCreated): void {

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

    entity.save()
}

export function handleAuctionSuccessful(event: AuctionSuccessful): void {

}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
