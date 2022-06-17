import {log, BigInt, Address} from '@graphprotocol/graph-ts';
import { ERC721, Transfer as TransferEvent } from '../../generated/WinNftHero/ERC721';
import {
  ERC721_Token,
  Owner,
  ERC721_Contract,
  ERC721_Transfer,
  ERC721_Balance
} from '../../generated/schema';
import {ERC20} from "../../generated/ApeNftToken/ERC20";


export function getBalance(userAddress: Address, tokenAddress: Address): ERC721_Balance {
  let id = userAddress.toHexString().concat("-").concat(tokenAddress.toHexString());

  let balance = ERC721_Balance.load(id);
  if (balance == null) {
    balance = new ERC721_Balance(id);
  }
  return balance as ERC721_Balance;

}

export function handleTransfer(event: TransferEvent): void {
  log.debug('Transfer detected. From: {} | To: {} | TokenID: {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.tokenId.toHexString(),
  ]);

  let previousOwner = Owner.load(event.params.from.toHexString());
  let newOwner = Owner.load(event.params.to.toHexString());
  let token = ERC721_Token.load(event.params.tokenId.toHexString());
  let transferId = event.transaction.hash
    .toHexString()
    .concat(':'.concat(event.transactionLogIndex.toHexString()));
  let transfer = ERC721_Transfer.load(transferId);
  let contract = ERC721_Contract.load(event.address.toHexString());
  let instance = ERC721.bind(event.address);

  if (previousOwner == null) {
    previousOwner = new Owner(event.params.from.toHexString());

    // previousOwner.balance = BigInt.fromI32(0);
  } else {
    // let prevBalance = previousOwner.balance;
    // @ts-ignore
    // if (prevBalance > BigInt.fromI32(0)) {
      // @ts-ignore
      // previousOwner.balance = prevBalance - BigInt.fromI32(1);
    // }
  }

  if (newOwner == null) {
    newOwner = new Owner(event.params.to.toHexString());
    // newOwner.balance = BigInt.fromI32(1);
  } else {
    // let prevBalance = newOwner.balance;
    // @ts-ignore
    // newOwner.balance = prevBalance + BigInt.fromI32(1);
  }

  if (token == null) {
    token = new ERC721_Token(event.params.tokenId.toHexString());
    token.contract = event.address.toHexString();

    let uri = instance.try_tokenURI(event.params.tokenId);
    if (!uri.reverted) {
      token.uri = uri.value;
    }
  }

  token.owner = event.params.to.toHexString();

  if (transfer == null) {
    transfer = new ERC721_Transfer(transferId);
    transfer.token = event.params.tokenId.toHexString();
    transfer.from = event.params.from.toHexString();
    transfer.to = event.params.to.toHexString();
    transfer.timestamp = event.block.timestamp;
    transfer.block = event.block.number;
    transfer.transactionHash = event.transaction.hash.toHexString();
  }

  if (contract == null) {
    contract = new ERC721_Contract(event.address.toHexString());
  }

  let name = instance.try_name();
  if (!name.reverted) {
    contract.name = name.value;
  }

  let symbol = instance.try_symbol();
  if (!symbol.reverted) {
    contract.symbol = symbol.value;
  }

  let totalSupply = instance.try_totalSupply();
  if (!totalSupply.reverted) {
    contract.totalSupply = totalSupply.value;
  }

  previousOwner.save();
  newOwner.save();
  token.save();
  contract.save();
  transfer.save();

  let address = event.address;

  let erc721 = ERC721.bind(address);
  let balance_from = erc721.try_balanceOf(event.params.from);
  let balance_to = erc721.try_balanceOf(event.params.to);

  let balance_from_entity = getBalance(event.params.from, address)
  balance_from_entity.owner = event.params.from.toHexString();
  balance_from_entity.tokenAddress = address;
  balance_from_entity.amount = balance_from.reverted ? BigInt.fromI32(0) : balance_from.value;
  balance_from_entity.save()

  let balance_to_entity = getBalance(event.params.to, address)
  balance_to_entity.owner = event.params.to.toHexString();
  balance_to_entity.tokenAddress = address;
  balance_to_entity.amount = balance_to.reverted ? BigInt.fromI32(0) : balance_to.value;
  balance_to_entity.save()
}
