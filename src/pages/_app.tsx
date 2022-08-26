import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { GlobalStyle } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../../apollo-client'
import { WalletProvider } from 'hooks/useWalletContext'
import Fonts from '../components/Fonts'
import '../../public/css/story.css'
import '../theme/markdown.css'

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
        <title>The Librarium</title>
        <meta
          name="description"
          content="An open source tool for on-chain storytelling"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Librarium" />
        <meta
          property="og:title"
          content="An open source tool for on-chain storytelling"
        />
        <meta
          property="og:image"
          content="https://librarium.dev/images/librarium-card.jpg"
        />
        <meta
          property="og:description"
          content="An open source tool for on-chain storytelling"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OpenQuill" />
        <meta name="twitter:creator" content="@OpenQuill" />
        <meta
          name="twitter:title"
          content="An open source tool for on-chain storytelling"
        />
        <meta
          name="twitter:description"
          content="An open source tool for on-chain storytelling"
        />
        <meta
          name="twitter:image:src"
          content="https://librarium.dev/images/librarium-card.jpg"
        />
      </Head>
      <ApolloProvider client={client}>
        <WalletProvider>
          <Fonts />
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
