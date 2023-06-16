import { CDN_URL } from '@/configs';
import Link from 'next/link';
import { Separator, StepBlock, StyledGetStarted } from './GetStarted.styled';
import SectionBlock from './SectionBlock';

const STEP_1_CONTENT = [
  {
    title: 'Step 1: Create a TC Wallet',
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
        and connect your Metamask wallet.
        <br /> After connecting, you will have a TC wallet address and a BTC wallet
        address.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-1a.png`,
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
          https://tcgasstation.com/
        </Link>
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-2.png`,
  },
  {
    title: 'Step 3: Top up BTC',
    content: (
      <p>
        Send BTC to your newly generated BTC wallet address for the network fee.
        Please send BTC from a wallet/platform that supports the taproot type.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-3a.png`,
  },
  {
    title: 'Step 4: Check your balance',
    content: <p>Check your balance here.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-4a.png`,
  },
];

const STEP_2_CONTENT = [
  {
    title: 'Step 1:',
    content: <p>Click “INSCRIBE NOW” and choose the file you want to inscribe.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-5.png`,
  },
  {
    title: 'Step 2:',
    content: <p>Pay the network fee in TC and BTC.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-6.png`,
  },
  {
    title: 'Step 3:',
    content: (
      <p>
        Check your smart inscription status Transaction tab on Trustless Wallet.{' '}
        <br />
        Your smart inscription will appear here when the inscribing process is
        completed.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-7a.png`,
  },
];

const STEP_3_CONTENT = [
  {
    title: 'Step 1:',
    content: <p>Click “INSCRIBE NOW” and choose the file you want to inscribe.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-5.png`,
  },
  {
    title: 'Step 2:',
    content: <p>Reserve the empty smart inscription.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-9.png`,
  },
  {
    title: 'Step 3:',
    content: (
      <p>
        Pay the network fee to inscribe. Due to the large file size, the network fee
        will be divided into some payments.
        <br />
        The inscribing process and the history of inscribing big files will also be
        displayed here.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-10.png`,
  },
  {
    title: 'Step 4:',
    content: <p>Check your smart inscription status at BIG FILE status.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-11a.png`,
  },
];

const GetStarted = () => {
  return (
    <StyledGetStarted>
      <h2>Get Started</h2>
      <div className="wrapper">
        <StepBlock>
          <h3>Create TC Wallet, top-up TC, and BTC for the network fee</h3>
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
        <Separator>Let’s inscribe!</Separator>
        <div className="inscribe-wrapper">
          <StepBlock>
            <h3>For {`<`}350KB smart inscriptions</h3>
            <div className="content-wrapper">
              {STEP_2_CONTENT.map((item, index) => (
                <div className="content-wrapper-item" key={`step-1-${index}`}>
                  <SectionBlock title={item.title}>{item.content}</SectionBlock>
                  <div className="image-wrapper">
                    <img src={item.image} alt="get started image instruction" />
                  </div>
                </div>
              ))}
            </div>
          </StepBlock>
          <StepBlock>
            <h3>Inscribing {`>`}350KB smart inscriptions (BIG FILE)</h3>
            <div className="content-wrapper">
              {STEP_3_CONTENT.map((item, index) => (
                <div className="content-wrapper-item" key={`step-1-${index}`}>
                  <SectionBlock title={item.title}>{item.content}</SectionBlock>
                  <div className="image-wrapper">
                    <img src={item.image} alt="get started image instruction" />
                  </div>
                </div>
              ))}
            </div>
          </StepBlock>
        </div>
      </div>
    </StyledGetStarted>
  );
};

export default GetStarted;
