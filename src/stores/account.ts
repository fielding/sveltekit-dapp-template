import { writable } from 'svelte/store'


export const account = writable('');

account.subscribe(a => console.log('~~>> account: ', a));
