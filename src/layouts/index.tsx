import React, { PropsWithChildren } from 'react';
import Footer from './Footer';
import Header from './Header';
import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const HEADER_HEIGHT = 80;
const FO0TER_HEIGHT = 80;

export const Container = styled.div`
  min-height: 100vh;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 ${px2rem(32)};
`;

const ContentWrapper = styled.div`
  min-height: calc(100vh - 140px);
  width: 100%;

  > div {
    width: 100%;
  }
`;

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <Header height={HEADER_HEIGHT} />
      <ContentWrapper>{children}</ContentWrapper>
      <Footer height={FO0TER_HEIGHT} />
    </Container>
  );
};

export default Layout;
