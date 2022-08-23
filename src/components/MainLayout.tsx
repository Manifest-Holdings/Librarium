import React from 'react'
import { mainTheme } from 'theme'
import Navbar from './Navbar'
import { ChakraProvider, Flex } from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <ChakraProvider theme={mainTheme}>
      <Flex direction="column" pb="8" h="full">
        <Navbar />
        {children}
      </Flex>
    </ChakraProvider>
  )
}

export default MainLayout
