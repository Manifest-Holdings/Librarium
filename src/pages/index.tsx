import MainLayout from 'components/MainLayout'
import { gql, useQuery } from '@apollo/client'
import {
  Heading,
  Flex,
  Text,
  HStack,
  VStack,
  Stack,
  Box,
} from '@chakra-ui/react'
import type { Books } from '../utils/types'

import Moment from 'react-moment'
import Link from 'next/link'

const Home = () => {
  const BOOKS_QUERY = gql`
    query Books {
      books(orderBy: id) {
        id
        title
        author {
          id
          name
          wallet
          bookCount
        }
        content
        tags
        timestamp
      }
    }
  `

  const { loading, data, error } = useQuery<Books>(BOOKS_QUERY)

  return (
    <Flex
      alignItems="center"
      justifyContent="top"
      direction="column"
      h="full"
      mt="80px"
      px="20px"
    >
      <VStack mb="50px">
        <Heading as="h1" size="4xl">
          The Librarium
        </Heading>
        <Text fontSize="xl">
          An open source tool for on-chain story telling.
        </Text>
      </VStack>
      {loading ? (
        <Heading as="h3" size="lg">
          Loading ...
        </Heading>
      ) : error ? (
        <Box>
          <>{console.log(error)}</>
          <Heading as="h3" size="lg">
            There seems to be an problem connecting to the Librarium.
          </Heading>
        </Box>
      ) : (
        data &&
        data.books.map((book) => (
          <Box w="80%" py="10" key={book.id}>
            <Stack mb="5">
              <Heading as="h3" size="lg">
                {book.title}
              </Heading>
              <HStack>
                <Heading size="sm">{book.author.name}</Heading>
                <Text fontSize="sm" color="#999999">
                  -
                  <Link
                    href={
                      process.env.NEXT_PUBLIC_ETHERSCAN_LINK +
                      '/address/' +
                      book.author.wallet
                    }
                  >
                    <a target="_blank">{book.author.wallet}</a>
                  </Link>
                </Text>
              </HStack>
            </Stack>
            <Text whiteSpace="pre-wrap">{book.content}</Text>
            <Text>{book.tags}</Text>
            <HStack>
              <Text fontSize="xs" pt="2" color="#999999">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_ETHERSCAN_LINK + '/tx/' + book.id
                  }
                >
                  <a target="_blank">{book.id}</a>
                </Link>
              </Text>
              <Text
                fontSize="xs"
                pt="2"
                color="#999999"
                textTransform={'uppercase'}
              >
                {' '}
                - Published on{' '}
                <Moment unix format="YYYY-MM-DD hh:mmA">
                  {book.timestamp}
                </Moment>
              </Text>
            </HStack>
          </Box>
        ))
      )}
    </Flex>
  )
}

Home.layout = MainLayout

export default Home
