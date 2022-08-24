import Document, { Html, Head, Main, NextScript } from 'next/document'
import { chakra } from '@chakra-ui/react'

const ChakraHtml = chakra(Html)
const Body = chakra('body')

class MyDocument extends Document {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <ChakraHtml backgroundColor="#282728">
        <Head>
          <link
            rel="preload"
            href="/fonts/SweetSansPro/SweetSansPro-Medium.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/Roslindale/Roslindale-TextRegular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/Roslindale/Roslindale-TextBold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/Roslindale/Roslindale-DisplayLight.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/Roslindale/Roslindale-DisplayCondensedBold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
        </Head>
        <Body>
          <Main />
          <NextScript />
        </Body>
      </ChakraHtml>
    )
  }
}

export default MyDocument
