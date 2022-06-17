import {BigInt} from "@graphprotocol/graph-ts"
import {
    Recharge as RechargeEvent,
    OwnershipTransferred,
    Paused,
    Unpaused
} from "../../generated/RechargeContract/RechargePay"
import { Recharge} from "../../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePaused(event: Paused): void {
}

export function handleRecharge(event: RechargeEvent): void {

    let entity = Recharge.load(event.transaction.hash.toHex())

    if (!entity) {
        entity = new Recharge(event.transaction.hash.toHex())
    }

    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.amount = event.params.amount;
    entity.order_id = event.params.order_id;
    entity.token = event.params.token_address;
    entity.timestamp = event.block.timestamp;

    entity.save()
}

export function handleUnpaused(event: Unpaused): void {
}
