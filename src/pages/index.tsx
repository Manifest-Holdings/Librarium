import MainLayout from 'components/MainLayout'
import { gql, useQuery } from '@apollo/client'
import { Heading, Flex, Text, VStack, Box } from '@chakra-ui/react'
import type { Books } from '../utils/types'
import BookEntry from '../components/BookEntry'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const specificId = router.query.id
    ? `where: {id_in: ["${router.query.id}"]}`
    : ''
  const BOOKS_QUERY = gql`
    query Books {
      books(orderBy: timestamp orderDirection: desc ${specificId}) {
        id
        title
        author {
          id
          name
          wallet
          bookCount
        }
        content
        tags(orderBy: key where: { key_in: ["coverart", "storyart", "license", "world"] }) {
          value
          key
        }
        timestamp
      }
    }
  `
  const { loading, data, error } = useQuery<Books>(BOOKS_QUERY)

  return (
    <Flex alignItems="center" justifyContent="top" direction="column" h="full">
      <VStack
        mt="-80px"
        pt="90px"
        pb="150px"
        mb="25px"
        width="full"
        backgroundImage="url(/images/librarium_door.jpg)"
        backgroundSize="cover"
        backgroundPosition="center"
        sx={{
          maskImage: 'linear-gradient(to bottom, black 80%,transparent 98%);',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 80%,transparent 98%);',
        }}
      >
        <Heading as="h1" size="4xl" mt="80px" textAlign="center">
          The Librarium
        </Heading>
        <Text fontSize="xl" textAlign="center">
          An open source tool for on-chain storytelling.
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
