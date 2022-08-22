import MainLayout from 'components/MainLayout'
import { gql, useQuery } from '@apollo/client'
import { Heading, Flex, Text, VStack, Box } from '@chakra-ui/react'
import type { Books } from '../utils/types'
import BookEntry from '../components/BookEntry'

const Home = () => {
  const BOOKS_QUERY = gql`
    query Books {
      books(orderBy: timestamp, orderDirection: desc) {
        id
        title
        author {
          id
          name
          wallet
          bookCount
        }
        content
        tags(where: { key_in: ["coverart", "storyart"] }) {
          value
          key
        }
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
        data.books.map((book) => <BookEntry key={book.id} book={book} />)
      )}
    </Flex>
  )
}

Home.layout = MainLayout

export default Home
