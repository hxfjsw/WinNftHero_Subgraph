# WinNftHero_Subgraph


#Rinkeby：
https://thegraph.com/studio/subgraph/winnfthero_rinkeby/

#Bsc testnet:
https://thegraph.com/hosted-service/subgraph/hxfjsw/win_nft_hero_bsctest?selected=playground

----

```graphql
query{
  owners(first:10,orderBy:balance,orderDirection: desc){
    id
    balance
  }
}
```