

<script>
  import { account } from '../stores/account';
  web3 = new Web3(Web3.givenProvider || "ws://some.local-or-remote.node:8546");
  // let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545"); // no longer works


  let network = "";
  let msg = '';

  web3.eth.net.getNetworkType().then(function (type) {
    network = type;
  });


  web3.eth.getAccounts().then(function (_account) {
    if (_account.length != 0) {
      account.set(_account[0]);
      msg = _account[0];
    } else {
      msg = "No address detected... Please connect an account!";
    }
  });


  function copyETH() {
    const cb = navigator.clipboard;
    const paragraph = document.querySelector("#eth_address");
    cb.writeText(paragraph.innerText).then(() => alert("Address copied"));
  }

</script>

<aside id="CheckWeb3" class="w-full p-3 mx-auto bg-yellow-200">
  <div class="inline-block">
    <span class="font-bold text-md md:ml-10 lg:ml-10 uppercase">Network:</span>
    <span class="capitalize">{network}</span>
    <span
      class="font-bold text-md text-right block mt-2  md:ml-10 md:inline lg:ml-10 lg:inline uppercase ">Ethereum Address:</span>

    {#if msg != "No address detected... Please connect an account!"}
      <span id="eth_address"
        >{msg}
        <button on:click={copyETH} class="w-7 ml-2 bg-gray-300 rounded-md">
          <i class="far fa-copy" />
        </button></span
      >
    {:else}
      <span>{msg}</span>
    {/if}
  </div>
</aside>
