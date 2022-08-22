import {
  Heading,
  Text,
  HStack,
  Stack,
  Box,
  Collapse,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
} from '@chakra-ui/react'
import { Remarkable } from 'remarkable'
import DOMPurify from 'dompurify'
import Moment from 'react-moment'
import Link from 'next/link'
import type { Book } from '../utils/types'
type Props = {
  book: Book
}

function BookEntry({ book }: Props) {
  const { isOpen, onToggle } = useDisclosure()
  const md = new Remarkable({ html: true, xhtmlOut: true, breaks: true })
  return (
    <Box w="80%" py="10" key={book.id}>
      <Stack mb="5">
        <Heading as="h3" size="lg">
          {book.title}
        </Heading>
        <HStack>
          <Heading size="sm">{book.author.name}</Heading>
          <Text fontSize="sm" color="#999999">
            -&nbsp;
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
        <Box>
          <TableContainer>
            <Table size="sm" variant="unstyled">
              <Thead>
                <Tr>
                  <Th>Tags</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {book.tags.map((tag) => (
                  <Tr key={tag.key}>
                    <Td>{tag.key}</Td>
                    <Td>
                      <Link href={tag.value}>
                        <a target="_blank">{tag.value}</a>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      <Box border="1px solid #fff" p="10px" position="relative">
        <Button
          size="sm"
          onClick={onToggle}
          mt="1rem"
          mr="1rem"
          position="absolute"
          right="0"
          top="0"
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <Collapse
          in={isOpen}
          startingHeight="250px"
          className="story"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(md.render(book.content)),
          }}
        />
      </Box>
      <HStack>
        <Text fontSize="xs" pt="2" color="#999999">
          <Link
            href={process.env.NEXT_PUBLIC_ETHERSCAN_LINK + '/tx/' + book.id}
          >
            <a target="_blank">{book.id}</a>
          </Link>
        </Text>
        <Text fontSize="xs" pt="2" color="#999999" textTransform={'uppercase'}>
          {' '}
          - Published on{' '}
          <Moment unix format="YYYY-MM-DD hh:mmA">
            {book.timestamp}
          </Moment>
        </Text>
      </HStack>
    </Box>
  )
}

export default BookEntry
