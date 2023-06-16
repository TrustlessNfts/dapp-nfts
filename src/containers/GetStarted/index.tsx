import { CDN_URL } from '@/configs';
import Link from 'next/link';
import { StepBlock, StyledGetStarted } from './GetStarted.styled';
import SectionBlock from './SectionBlock';

const STEP_1_CONTENT = [
  {
    title: 'Step 1:',
    content: (
      <p>
        Go to{' '}
        <Link
          href="https://trustlesswallet.io"
          target="_blank"
          className="text-underline"
        >
          trustlesswallet.io
        </Link>{' '}
        and create a TC Wallet by clicking &quot;Connect wallet&quot; to connect your
        Metamask wallet.
        <br /> After connecting, you will have a TC wallet address and a BTC wallet
        address.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-1-Create-TC-wallet.png`,
  },
  {
    title: 'Step 2: Top up TC',
    content: (
      <p>
        Top up TC at{' '}
        <Link
          href="https://tcgasstation.com/"
          target="_blank"
          className="text-underline"
        >
          https://tcgasstation.com
        </Link>
        .
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-2-Create-TC-wallet.png`,
  },
  {
    title: 'Step 3: Top up BTC',
    content: (
      <p>
        Top up BTC by sending BTC to your newly generated BTC wallet address for the
        network fee.
        <br /> Please send BTC from a wallet/platform that supports the taproot type.
        <br />
        You can check your $BTC balance here.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-3-create-TC-wallet.png`,
  },
  {
    title: 'Step 4: Wrap your ETH, BTC.',
    content: (
      <p>
        Go to{' '}
        <Link
          href="https://trustlessbridge.io"
          target="_blank"
          className="text-underline"
        >
          https://trustlessbridge.io
        </Link>
        , and connect your wallet.
        <br /> Choose the network and your preferred cryptocurrency (2 options: BTC,
        ETH).
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/Step-4.1-create-TC-wallet%20.png`,
  },
  {
    title: '',
    content: (
      <p>
        Once you send the amount of the chosen crypto you want to trade to this
        wallet, your crypto will be automatically wrapped.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-4.2-Create-TC-wallet%20.png`,
  },
  {
    title: '',
    content: (
      <p>
        Once the transaction is completed, check your wrapped crypto balance under
        the Tokens tab in your Trustless Wallet{' '}
        <Link
          href="https://trustlesswallet.io"
          target="_blank"
          className="text-underline"
        >
          https://trustlesswallet.io
        </Link>
        .
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/Step-4.3-Create-TC-wallet.png`,
  },
];

const STEP_2_CONTENT = [
  {
    title: 'Step 1:',
    content: (
      <p>
        Go to{' '}
        <Link
          href=" https://trustlessnfts.com/"
          target="_blank"
          className="text-underline"
        >
          https://trustlessnfts.com
        </Link>
        , Connect your MetaMask wallet and then click “Connect a wallet”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-1-List-for-sale.png`,
  },
  {
    title: 'Step 2:',
    content: (
      <p>
        Find the NFT you want to sell under the &quot;Trustless Computer&quot; tab on
        your profile and click &quot;List for Sell&quot;.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-2-List-for-sale.png`,
  },
  {
    title: 'Step 3:',
    content: (
      <p>
        Enter the amount of WBTC or WETH suitable for your NFT and click
        &quot;Confirm&quot;.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-3-List-for-sale.png`,
  },
  {
    title: 'Step 4:',
    content: (
      <p>Select the network fee you want to pay and click &quot;Sign&quot;.</p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-4-list-for-sale.png`,
  },
  {
    title: 'Step 5:',
    content: <p>Go back to your Wallet to process the Transaction.</p>,
    image: `${CDN_URL}/pages/nfts/get-started/step-5-List-for-sale.png`,
  },
  {
    title: 'Step 6:',
    content: (
      <p>
        To check if you have any offers, click on your NFT. Click &quot;Accept&quot;
        if you want to sell.
      </p>
    ),
    image: ``,
  },
];

const STEP_3_CONTENT = [
  {
    title: 'Step 1:',
    content: (
      <p>
        Go to{' '}
        <Link
          href=" https://trustlessnfts.com/"
          target="_blank"
          className="text-underline"
        >
          https://trustlessnfts.com
        </Link>
        , Connect your MetaMask wallet and then click “Connect a wallet”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-1-buy%20.png`,
  },
  {
    title: 'Step 2:',
    content: (
      <p>Choose the NFT you want to buy and click to buy with WBTC or WETH.</p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-2-buy%20.png`,
  },
  {
    title: 'Step 3:',
    content: <p>Select the network fee you want to pay and click “Sign”.</p>,
    image: `${CDN_URL}/pages/nfts/get-started/step-3-buy.png`,
  },
  {
    title: 'Step 4:',
    content: <p>Go back to your Wallet to process the Transaction.</p>,
    image: ``,
  },
];

const STEP_4_CONTENT = [
  {
    title: 'Step 1:',
    content: (
      <p>
        Go to{' '}
        <Link
          href=" https://trustlessnfts.com/"
          target="_blank"
          className="text-underline"
        >
          https://trustlessnfts.com
        </Link>
        , Connect your MetaMask wallet and then click “Connect a wallet”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-1-make-offer.png`,
  },
  {
    title: 'Step 2:',
    content: <p>Choose the NFT and click “Make Offer”.</p>,
    image: `${CDN_URL}/pages/nfts/get-started/step-2-make-offer.png`,
  },
  {
    title: 'Step 3:',
    content: (
      <p>
        Make an offer with a suitable price in WETH or WBTC and select the network
        fee you want to pay and click “Confirm”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-3-make-offer.png`,
  },
  {
    title: 'Step 4:',
    content: <p>Select the network fee you want to pay and click “Sign”.</p>,
    image: `${CDN_URL}/pages/nfts/get-started/step-4-make-offer.png`,
  },
  {
    title: 'Step 5:',
    content: <p>Waiting for the owner accepts the offer.</p>,
    image: ``,
  },
];
const STEP_5_CONTENT = [
  {
    title: 'Step 1:',
    content: (
      <p>
        Go to{' '}
        <Link
          href=" https://trustlessnfts.com/"
          target="_blank"
          className="text-underline"
        >
          https://trustlessnfts.com
        </Link>
        , Connect your MetaMask wallet and then click “Connect a wallet”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-1-create%20NFT.png`,
  },
  {
    title: 'Step 2:',
    content: <p> Click “Create BRC-721” on the homepage.</p>,
    image: `${CDN_URL}/pages/nfts/get-started/step-2-create-NFT.png`,
  },
  {
    title: 'Step 3:',
    content: (
      <p>
        Fill in “Collection Name”, upload the NFT file. The platform will
        auto-calculate the fee and click “Create”.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-3-create-NFT%20.png`,
  },
  {
    title: 'Step 4:',
    content: (
      <p>
        Go back to your Wallet at{' '}
        <Link
          href="https://trustlesswallet.io/?tab=transactions"
          target="_blank"
          className="text-underline"
        >
          https://trustlesswallet.io/?tab=transactions
        </Link>
        , check the Transaction.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-4.1-create-NFT.png`,
    image2: `${CDN_URL}/pages/nfts/get-started/step-4.2-create-NFT%20.png`,
  },
  {
    title: 'Step 5:',
    content: (
      <p>
        When the Transactions success, return to{' '}
        <Link
          href="https://trustlessnfts.com"
          target="_blank"
          className="text-underline"
        >
          https://trustlessnfts.com
        </Link>
        , your NFT will be on the Homepage.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/get-started/step-5-create-NFT.png`,
  },
];

const GetStarted = () => {
  return (
    <StyledGetStarted>
      <h2>
        instruction for buy / sell / listing and create <br /> on trustless nfts
      </h2>
      <div className="wrapper">
        <StepBlock>
          <h3>Create a TC Wallet</h3>
          <div className="content-wrapper">
            {STEP_1_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SectionBlock title={item.title}>{item.content}</SectionBlock>
                <div className="image-wrapper">
                  <img src={item.image} alt="get started image instruction" />
                </div>
              </div>
            ))}
          </div>
        </StepBlock>
        <h2>How to sell?</h2>
        <StepBlock>
          <h3>List for sale</h3>
          <div className="content-wrapper">
            {STEP_2_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SectionBlock title={item.title}>{item.content}</SectionBlock>
                {!!item.image && (
                  <div className="image-wrapper">
                    <img src={item.image} alt="get started image instruction" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </StepBlock>
        <h2>How to buy?</h2>

        <StepBlock>
          <h3>1. Buy</h3>
          <div className="content-wrapper">
            {STEP_3_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SectionBlock title={item.title}>{item.content}</SectionBlock>
                {!!item.image && (
                  <div className="image-wrapper">
                    <img src={item.image} alt="get started image instruction" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </StepBlock>
        <StepBlock>
          <h3>2. Make an offer</h3>
          <div className="content-wrapper">
            {STEP_4_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SectionBlock title={item.title}>{item.content}</SectionBlock>
                {!!item.image && (
                  <div className="image-wrapper">
                    <img src={item.image} alt="get started image instruction" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </StepBlock>
        <h2>How to Create?</h2>
        <StepBlock>
          <div className="content-wrapper">
            {STEP_5_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SectionBlock title={item.title}>{item.content}</SectionBlock>
                <div className="image-wrapper">
                  <img src={item.image} alt="get started image instruction" />
                </div>
                {!!item.image2 && (
                  <div className="image-wrapper">
                    <img src={item.image2} alt="get started image instruction" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </StepBlock>
      </div>
    </StyledGetStarted>
  );
};

export default GetStarted;
