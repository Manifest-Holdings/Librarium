import MainLayout from 'components/MainLayout'
import {
  Heading,
  Flex,
  Text,
  Stack,
  Box,
  Button,
  Link,
  Image,
} from '@chakra-ui/react'

const Home = () => {
  return (
    <Flex
      align="left"
      justify="left"
      direction="column"
      h="full"
      mt="80px"
      px="20px"
    >
      <Box mb="50px">
        <Heading as="h1" size={{ base: '3xl', md: '4xl' }} textAlign="center">
          Apps Built on the Librarium
        </Heading>
      </Box>
      <Stack
        alignItems="left"
        justifyContent="left"
        spacing="20px"
        direction={{ base: 'column', sm: 'row' }}
        mx={{ base: '5px', sm: '80px' }}
      >
        <Flex
          width={{ base: 'auto', sm: '320px' }}
          border="1px solid #ccc"
          p="20px"
          textAlign="center"
          align="center"
          justify="center"
          direction="column"
          backgroundColor="#ddcbbd"
          color="#282728"
        >
          <Image src="/images/genesis-eye-smaller.png" alt="Eye Logo" />

          <Heading as="h2" size="lg" textAlign="center">
            The Eye (for Adventurers)
          </Heading>
          <Text mt="30px" fontSize="xl" textAlign="center">
            A magical device that contains an on-chain world
          </Text>
          <Link href="https://eyeforadventurers.com" target="_blank">
            <Button mt="20px" variant="secondary">
              Learn More
            </Button>
          </Link>
        </Flex>
        <Flex
          width={{ base: 'auto', sm: '320px' }}
          border="1px solid #ccc"
          p="20px"
          align="center"
          justify="center"
          direction="column"
        >
          <Link
            href="https://tfp0m1w5j9m.typeform.com/to/PGGvBbNM"
            target="_blank"
          >
            <Text fontSize="xl" textAlign="center">
              + Add an Application
            </Text>
          </Link>
        </Flex>
      </Stack>
    </Flex>
  )
}

Home.layout = MainLayout

export default Home
