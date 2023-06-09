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
  min-height: calc(100vh - 80px);
  width: 100%;
  /* overflow-x: hidden; */

  > div {
    width: 100%;
  }
`;

type Props = {
  hideFooter?: boolean;
};

const Layout = ({ children, hideFooter = false }: PropsWithChildren<Props>) => {
  return (
    <Container>
      <Header height={HEADER_HEIGHT} />

      <ContentWrapper>{children}</ContentWrapper>
      {!hideFooter && <Footer height={FO0TER_HEIGHT} />}
    </Container>
  );
};

export default Layout;
