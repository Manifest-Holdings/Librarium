import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { mainTheme } from 'theme'
import { Box, ChakraProvider, Flex, HStack, Link } from '@chakra-ui/react'
import '@fontsource/roboto/400.css'
import '@fontsource/joan/400.css'
type Props = {
  children: React.ReactNode
}

type NavLinkProps = {
  children: React.ReactNode
  href: string
  target?: string
}

const MainLayout = ({ children }: Props) => {
  const router = useRouter()

  const NavLink = ({ children, href, target }: NavLinkProps) => {
    const styles =
      router.pathname === href
        ? {
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'joan',
          }
        : {
            color: '#ffffff',
            fontFamily: 'joan',
          }

    return (
      <NextLink href={href} passHref>
        {target == '_blank' ? (
          <a target="_blank" {...styles}>
            {children}
          </a>
        ) : (
          <Link {...styles}>{children}</Link>
        )}
      </NextLink>
    )
  }

  return (
    <ChakraProvider theme={mainTheme}>
      <Flex direction="column" pb="8" h="full">
        <HStack
          h="80px"
          px={['10px', '20px', '40px']}
          py="10px"
          borderBottom="1px"
          borderColor="#fff"
          justifyContent="space-between"
          alignItems="center"
        >
          <NextLink href="/" passHref>
            <Link>
              <Box
                w="48px"
                h="48px"
                bgImage="url('/images/logo.png')"
                bgPosition="center"
                bgRepeat="no-repeat"
                bgSize="contain"
              />
            </Link>
          </NextLink>
          <HStack gap={['16px', '32px', '64px']}>
            <NavLink
              target="_blank"
              href={process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + '/graphql'}
            >
              SUBGRAPH
            </NavLink>
            <NavLink
              target="_blank"
              href={
                process.env.NEXT_PUBLIC_ETHERSCAN_LINK +
                '/address/' +
                process.env.NEXT_PUBLIC_LIBRARY_CONTRACT_ADDRESS
              }
            >
              ETHERSCAN
            </NavLink>
            <NavLink href="/publish">PUBLISH</NavLink>
          </HStack>
        </HStack>
        {children}
      </Flex>
    </ChakraProvider>
  )
}

export default MainLayout
