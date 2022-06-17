import { BigInt } from "@graphprotocol/graph-ts"
import {
  MysteryBox,
  OwnershipTransferred,
  Paused,
  Unpaused,
  exchange as exchangeEvent
} from "../../generated/MysteryBox/MysteryBox"

import { MysteryBoxExchange } from "../../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleexchange(event: exchangeEvent): void {}
