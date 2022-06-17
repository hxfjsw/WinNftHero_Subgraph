import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts/index";
import {ERC20_Allowance, ERC20_Balance, ERC20_Contract, ERC20_Transfer, Owner} from "../../generated/schema";
import {
    ERC20, Transfer as TransferEvent,
    Approval as ApprovalEvent,
} from '../../generated/WinkToken/ERC20';


export function getToken(tokenAddress: Address): ERC20_Contract {
    let token = ERC20_Contract.load(tokenAddress.toHexString());
    let erc20 = ERC20.bind(tokenAddress);
    if (token == null) {
        token = new ERC20_Contract(tokenAddress.toHexString());
        let symbol = erc20.try_symbol();
        let name = erc20.try_name();
        let decimals = erc20.try_decimals();
        token.symbol = symbol.reverted ? '' : symbol.value;
        token.name = name.reverted ? '' : name.value;
        token.decimals = decimals.reverted ? 0 : decimals.value;
    }
    let totalSupply = erc20.try_totalSupply();
    token.totalSupply = totalSupply.reverted
        ? BigInt.fromI32(0)
        : totalSupply.value;
    return token as ERC20_Contract;
}

export function getTransfer(txHash: Bytes): ERC20_Transfer {
    let transfer = ERC20_Transfer.load(txHash.toHexString());
    if (transfer == null) {
        transfer = new ERC20_Transfer(txHash.toHexString());
    }
    return transfer as ERC20_Transfer;
}

export function getAllowance(
    token: Address,
    owner: Address,
    spender: Address,
): ERC20_Allowance {
    let allowanceId = token
        .toHexString()
        .concat('-')
        .concat(owner.toHexString())
        .concat('-')
        .concat(spender.toHexString());
    let allowance = ERC20_Allowance.load(allowanceId);
    if (allowance == null) {
        allowance = new ERC20_Allowance(allowanceId);
    }
    return allowance as ERC20_Allowance;
}

export function getUser(address: Address, tokenAddress: Address): Owner {
    let user = Owner.load(address.toHexString());
    if (user == null) {
        user = new Owner(address.toHexString());
        // user.token = tokenAddress.toHexString();
    }
    // let erc20 = ERC20.bind(tokenAddress);
    // let balance = erc20.try_balanceOf(address);

    //user.balance = balance.reverted ? BigInt.fromI32(0) : balance.value;
    return user as Owner;
}

export function getBalance(userAddress: Address, tokenAddress: Address): ERC20_Balance {
    let id = userAddress.toHexString().concat("-").concat(tokenAddress.toHexString());

    let balance = ERC20_Balance.load(id);
    if (balance == null) {
        balance = new ERC20_Balance(id);
    }
    return balance as ERC20_Balance;

}

// ################################################################


export function handleTransfer(event: TransferEvent): void {
    let txHash = event.transaction.hash;
    let timestamp = event.block.timestamp;
    let address = event.address;

    let token = getToken(address);
    token.save();

    let fromUser = getUser(event.params.from, address);
    fromUser.save();

    let toUser = getUser(event.params.to, address);
    toUser.save();

    let transfer = getTransfer(txHash);
    transfer.timestamp = timestamp;
    transfer.from = fromUser.id;
    transfer.to = toUser.id;
    transfer.value = event.params.value;
    transfer.token = token.id;
    transfer.save();

    let erc20 = ERC20.bind(address);
    let balance_from = erc20.try_balanceOf(event.params.from);
    let balance_to = erc20.try_balanceOf(event.params.to);

    let balance_from_entity = getBalance(event.params.from, address)
    balance_from_entity.owner = fromUser.id;
    balance_from_entity.tokenAddress = address;
    balance_from_entity.amount = balance_from.reverted ? BigInt.fromI32(0) : balance_from.value;
    balance_from_entity.save()

    let balance_to_entity = getBalance(event.params.to, address)
    balance_to_entity.owner = toUser.id;
    balance_to_entity.tokenAddress = address;
    balance_to_entity.amount = balance_to.reverted ? BigInt.fromI32(0) : balance_to.value;
    balance_to_entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
    let timestamp = event.block.timestamp;
    let address = event.address;

    let token = getToken(address);
    token.save();

    let ownerUser = getUser(event.params.owner, address);
    ownerUser.save();

    let spenderUser = getUser(event.params.spender, address);
    spenderUser.save();

    let allowance = getAllowance(
        address,
        event.params.owner,
        event.params.spender,
    );
    allowance.timestamp = timestamp;
    allowance.owner = ownerUser.id;
    allowance.spender = spenderUser.id;
    allowance.value = event.params.value;
    allowance.token = token.id;
    allowance.save();
}
