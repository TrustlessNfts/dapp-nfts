import React from 'react';
import { Wrapper } from './Banner.styled';

const Banner: React.FC = (): React.ReactElement => {
  return (
    <Wrapper>
      <h1 className='title'>
        Buy art on Bitcoin. Simple. Fast. Zero fees.
      </h1>
      <p className='description'>
        Smart BRC-20s are <span>the first smart contracts deployed on Bitcoin</span>. They run exactly as programmed without any possibility of fraud, third-party interference, or censorship. Issue your Smart BRC-20 on Bitcoin for virtually anything: a cryptocurrency, a share in a company, voting rights in a DAO, and more.
      </p>
    </Wrapper>
  )
}

export default Banner;