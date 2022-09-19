import 'dotenv/config';
import { ethers } from 'ethers';

const USDC_PROXY_ADDRESS = '0xB7277a6e95992041568D9391D09d0122023778A2';
const VITALIK_WALLET = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';

const isBlacklisted = async (usdcContract:ethers.Contract, address: string) => {
  const ret = await usdcContract.isBlacklisted(address);
  console.log(`Wallet ${address} is ${ret ? '' : 'not'} blacklisted.`);
};

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTPS_ENDPOINT,
  );

  const usdcContract = new ethers.Contract(
    USDC_PROXY_ADDRESS,
    ['function isBlacklisted(address _account) view returns (bool)'],
    provider,
  );

  await isBlacklisted(usdcContract, VITALIK_WALLET);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(255);
  });
