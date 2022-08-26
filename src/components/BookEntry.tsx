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
  Tooltip,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { Remarkable } from 'remarkable'
import DOMPurify from 'dompurify'
import Moment from 'react-moment'
import Link from 'next/link'
import type { Book } from '../utils/types'
import { shortenAddress, isUrl } from 'utils/formatters'

type Props = {
  book: Book
}

function BookEntry({ book }: Props) {
  const { isOpen, onToggle } = useDisclosure()
  const { isOpen: isRendered, onToggle: onToggleRendered } = useDisclosure()
  const md = new Remarkable({ html: true, xhtmlOut: true, breaks: true })
  return (
    <Box w="80%" py="10" key={book.id}>
      <Stack mb="5">
        <HStack spacing="20px">
          <Heading as="h3" size="lg">
            {book.title}
          </Heading>
          <Tooltip label="Copy Entry ID to Clipboard">
            <Button
              variant="outline"
              py="5px"
              px="5px"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(book.id)
              }}
            >
              <CopyIcon w="4" h="4" />
            </Button>
          </Tooltip>
        </HStack>
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
              <a target="_blank">{shortenAddress(book.author.wallet)}</a>
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
                      {isUrl(tag.value) ? (
                        <Link href={tag.value}>
                          <a target="_blank">{tag.value}</a>
                        </Link>
                      ) : (
                        tag.value
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      <Box
        border="1px solid #ddcbbd"
        background="black"
        color="white"
        p="10px"
        position="relative"
      >
        <HStack mt="1rem" mr="1rem" position="absolute" right="0" top="0">
          <Button size="sm" onClick={onToggle}>
            {isOpen ? 'Collapse' : 'Expand'}
          </Button>
          <Button size="sm" onClick={onToggleRendered}>
            {isRendered ? 'HTML' : 'Markdown'}
          </Button>
        </HStack>

        <Collapse in={isOpen} startingHeight="250px">
          <Box
            className="story librarium"
            style={{
              paddingTop: '20px',
              display: isRendered ? 'none' : 'block',
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(md.render(book.content)),
            }}
          />
          <pre
            style={{
              display: isRendered ? 'block' : 'none',
            }}
          >
            {book.content}
          </pre>
        </Collapse>
      </Box>
      <HStack>
        <Text fontSize="xs" pt="2" color="#999999">
          <Link
            href={process.env.NEXT_PUBLIC_ETHERSCAN_LINK + '/tx/' + book.id}
          >
            <a target="_blank">{shortenAddress(book.id, 6)}</a>
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
