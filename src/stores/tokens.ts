import { derived, writable } from 'svelte/store'
import { account } from './account.ts';

import * as contract from '../../build/contracts/NFTContract.json';


const getGlobalObject = () => {
  if (typeof globalThis !== 'undefined') { return globalThis }
  if (typeof self !== 'undefined') { return self }
  if (typeof window !== 'undefined') { return window }
  if (typeof global !== 'undefined') { return global }
  throw new Error('cannot find the global object')
}


// const nftContract = new web3.eth.Contract(contract.abi, contract.networks['5777'].address);

const tokenInvalidations = writable(0);

export function invalidateTokens() {
  tokenInvalidations.update($c => $c + 1);
}

export const tokens = derived([account, tokenInvalidations], ([$account, $i], $set) => { 
  console.log('~~>> rerunning derived token store');
  const web3 = getGlobalObject().web3 || {};
  // if (!web3.eth) return;

  const nftContract = new web3.eth.Contract(contract.abi, contract.networks['5777'].address);
  if ($account) {

    nftContract.methods.getTokensByOwner($account).call().then(async t => {
      console.log('~~>> tokens: ', t)
      $set(Promise.all(t.map(async t => fetch(await nftContract.methods.tokenURI(t).call()).then(r => r.json()).then(d => d))));
    });
  }
});

export const tokenURIs = derived(tokens, ($tokens, $set) => {
  console.log('~~>> rerunning derived tokenURI store');
  if (typeof $tokens !== 'object') return;
  const web3 = getGlobalObject().web3 || {};
  // if (!web3.eth) return;

  const nftContract = new web3.eth.Contract(contract.abi, contract.networks['5777'].address);
  return Promise.all($tokens.map(async t => fetch(await nftContract.methods.tokenURI(t).call()).then(r => r.json()).then(d => d)));

}, []);