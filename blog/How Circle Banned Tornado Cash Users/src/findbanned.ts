import 'dotenv/config';
import { ethers } from 'ethers';

const USDC_ERC20_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

class UsdcBannedlist {
  provider: any;

  usdcContract: ethers.Contract;

  addresses: Array<string>;

  constructor(provider: any, address: string) {
    this.provider = provider;
    this.usdcContract = new ethers.Contract(
      address,
      [
        'function balanceOf(address owner) view returns (uint256)',
        'function symbol() view returns (string)',
      ],
      provider,
    );
  }

  findBannedAddresses = async (filter) => {
    const logs = await this.provider.getLogs(filter);

    /* Sorting uniq addresses. */
    this.addresses = [
      ...new Set<string>(logs.map((log) => ethers.utils.getAddress(`0x${log.topics[1].substr(26)}`))),
    ];
  };

  displayWallets = async () => {
    const symbol = await this.usdcContract.symbol();
    console.log(`[+] ${this.addresses.length} wallets address found:`);

    await Promise.all(this.addresses.map(async (address) => {
      const amount = await this.usdcContract.balanceOf(address);
      console.log(` - ${address}: ${ethers.utils.formatUnits(amount, 'mwei')} ${symbol}`);
    }));
  };
}

const main = async () => {
  const filter = {
    address: USDC_ERC20_ADDRESS,
    fromBlock: 15298283,
    toBlock: 15304705,
    topics: [ethers.utils.id('Blacklisted(address)')],
  };

  const provider = new ethers.providers.JsonRpcProvider(process.env.HTTPS_ENDPOINT);
  const bannedList = new UsdcBannedlist(provider, USDC_ERC20_ADDRESS);
  await bannedList.findBannedAddresses(filter);
  await bannedList.displayWallets();
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(255);
  });
