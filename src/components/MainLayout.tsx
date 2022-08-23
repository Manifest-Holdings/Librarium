import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { mainTheme } from 'theme'
import {
  Box,
  ChakraProvider,
  Flex,
  HStack,
  Link,
  VStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
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
  const { isOpen, onOpen, onClose } = useDisclosure()

  const Links = [
    {
      href: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + '/graphql',
      label: 'SUBGRAPH',
      target: '_blank',
    },
    {
      href:
        process.env.NEXT_PUBLIC_ETHERSCAN_LINK +
        '/address/' +
        process.env.NEXT_PUBLIC_LIBRARY_CONTRACT_ADDRESS,
      label: 'ETHERSCAN',
      target: '_blank',
    },
    {
      href: 'https://github.com/Open-Quill-Foundation/Librarium/blob/main/README.md',
      label: 'ABOUT',
      target: '_blank',
    },
    {
      href: '/publish',
      label: 'PUBLISH',
    },
  ]

  const NavLink = ({ children, href, target }: NavLinkProps) => {
    const styles =
      router.pathname === href
        ? {
            color: '#ddcbbd',
            fontWeight: 'bold',
            fontFamily: 'Roslindale',
          }
        : {
            color: '#ddcbbd',
            fontFamily: 'Roslindale',
          }

    return (
      <NextLink href={href} passHref>
        <Link target={target ? target : '_self'} {...styles}>
          {children}
        </Link>
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
          justifyContent="space-between"
          alignItems="center"
          zIndex="5"
        >
          <NextLink href="/" passHref>
            <Link cursor="pointer">
              <Box
                w="48px"
                h="100px"
                bgImage="url('/images/librarium-logo.jpg')"
                bgPosition="center"
                bgRepeat="no-repeat"
                bgSize="contain"
              />
            </Link>
          </NextLink>
          <HStack
            gap={['16px', '32px', '64px']}
            display={{ base: 'none', md: 'flex' }}
          >
            {Links.map((link) => (
              <NavLink key={link.label} href={link.href} target={link.target}>
                {link.label}
              </NavLink>
            ))}
          </HStack>
          <IconButton
            colorScheme="blackAlpha"
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            onClick={isOpen ? onClose : onOpen}
            autoFocus={false}
            display={{ base: 'block', md: 'none' }}
          />
        </HStack>
        <Drawer
          placement="top"
          onClose={onClose}
          isOpen={isOpen}
          isFullHeight={true}
          autoFocus={false}
        >
          <DrawerOverlay>
            <DrawerContent mt={0} bgColor="black" fontSize="13px" color="white">
              <DrawerBody>
                <IconButton
                  colorScheme="blackAlpha"
                  size={'md'}
                  icon={<CloseIcon />}
                  aria-label={'Open Menu'}
                  onClick={onClose}
                  autoFocus={false}
                  position="absolute"
                  right="15px"
                  top="15px"
                />
                <VStack
                  as={'nav'}
                  spacing={5}
                  textAlign="center"
                  w={40}
                  justify="center"
                  mx="auto"
                  mt="60px"
                >
                  {Links.map((link) => (
                    <NavLink
                      key={link.label}
                      href={link.href}
                      target={link.target}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
        {children}
      </Flex>
    </ChakraProvider>
  )
}

export default MainLayout
