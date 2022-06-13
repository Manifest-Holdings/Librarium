import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { GlobalStyle } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../../apollo-client'
import { WalletProvider } from 'hooks/useWalletContext'

type AppLayoutProps = {
  Component: NextPage & { layout: typeof React.Component }
}

function MyApp({ Component, pageProps }: AppProps & AppLayoutProps) {
  const Layout =
    Component.layout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>)

  return (
    <>
      <Head>
        <title>librarium.dev</title>
        <meta name="description" content="DESCRIPTION" />
      </Head>
      <ApolloProvider client={client}>
        <WalletProvider>
          <Layout>
            <GlobalStyle />
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
