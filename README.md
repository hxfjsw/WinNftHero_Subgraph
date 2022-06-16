# WinNftHero_Subgraph

https://thegraph.com/studio/subgraph/winnfthero_rinkeby/

```graphql
query{
  owners(first:10,orderBy:balance,orderDirection: desc){
    id
    balance
  }
}
```