import { BigInt } from "@graphprotocol/graph-ts"
import {
  MysteryBox,
  OwnershipTransferred,
  Paused,
  Unpaused,
  exchange as exchangeEvent
} from "../../generated/MysteryBox/MysteryBox"

import {MysteryBoxExchange} from "../../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleexchange(event: exchangeEvent): void {
  let entity = MysteryBoxExchange.load(event.transaction.hash.toHex())

  if (!entity) {
    entity = new MysteryBoxExchange(event.transaction.hash.toHex())
  }

  entity.genes = event.params.genes;
  entity.token_id = event.params.tokenId;
  entity.from = event.params.spawner.toHexString();
  entity.nft_address = event.params.nft_address;
  entity.nft_token_id = event.params.nft_token_id;
  entity.timestamp = event.block.timestamp;

  entity.save()
}
