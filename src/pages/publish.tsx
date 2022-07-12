import MainLayout from 'components/MainLayout'
import { useWalletContext } from '../hooks/useWalletContext'
import { useLibraryContract } from '../hooks/useLibraryContract'
import { Formik, Form, FormikHelpers } from 'formik'
import { InputControl, TextareaControl } from 'formik-chakra-ui'
import {
  Heading,
  Flex,
  Text,
  HStack,
  VStack,
  Link,
  Box,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'

const Publish = () => {
  const { connectWallet, isConnected, displayName, disconnectWallet } =
    useWalletContext()
  const { libraryContract } = useLibraryContract()
  const [isValidForPublishing, setIsValidForPublishing] = useState(false)
  const [submitRecordResult, setSubmitRecordResult] = useState('')
  const [submitRevokeResult, setSubmitRevokeResult] = useState('')

  interface RecordValues {
    title: string
    author: string
    authorWallet: string
    content: string
    coverArt: string
    storyArt: string
  }

  interface RevokeValues {
    transactionHash: string
  }

  useEffect(() => {
    if (submitRecordResult.includes('Error')) {
      setTimeout(() => {
        setSubmitRecordResult('')
      }, 5000)
    }
  }, [submitRecordResult])

  useEffect(() => {
    if (submitRevokeResult.includes('Error')) {
      setTimeout(() => {
        setSubmitRevokeResult('')
      }, 5000)
    }
  }, [submitRevokeResult])

  useEffect(() => {
    if (isConnected && libraryContract) {
      libraryContract
        .hasValidPublishAccess()
        .then((result) => {
          setIsValidForPublishing(result)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isConnected, libraryContract])

  return (
    <Flex
      alignItems="center"
      justifyContent="top"
      direction="column"
      h="full"
      mt="80px"
      px="20px"
    >
      <Box mb="50px">
        <Heading as="h1" size={{ base: '3xl', md: '4xl' }}>
          Publish to the Librarium
        </Heading>
      </Box>
      {isConnected && (
        <VStack w={{ base: '300px', md: '600px', lg: '800px' }} mb="80px">
          <HStack ml="auto">
            <Text>Connected as: {displayName}</Text>
            <Link onClick={disconnectWallet}>[ disconnect ]</Link>
          </HStack>
          {isValidForPublishing ? (
            <Tabs>
              <TabList>
                <Tab>
                  <Heading>Record</Heading>
                </Tab>
                <Tab>
                  <Heading>Revoke</Heading>
                </Tab>
              </TabList>
              <TabPanels bgColor="#090909" py="10px" px="20px">
                <TabPanel>
                  <Formik
                    initialValues={{
                      title: '',
                      author: '',
                      authorWallet: '',
                      content: '',
                      coverArt: '',
                      storyArt: '',
                    }}
                    validationSchema={Yup.object({
                      title: Yup.string().required('Required'),
                      author: Yup.string().required('Required'),
                      authorWallet: Yup.string()
                        .matches(
                          /^0x([A-Fa-f0-9]{40})$/,
                          'Must be a valid wallet address'
                        )
                        .required('Required'),
                      content: Yup.string().required('Required'),
                      coverArt: Yup.string().required('Required'),
                      storyArt: Yup.string().required('Required'),
                    })}
                    onSubmit={(
                      values: RecordValues,
                      { setSubmitting }: FormikHelpers<RecordValues>
                    ) => {
                      setTimeout(async () => {
                        setSubmitRecordResult('Processing Transaction...')
                        if (
                          confirm(
                            "Are you sure you want to record '" +
                              values.title +
                              "' by " +
                              values.author +
                              '?'
                          )
                        ) {
                          const tags = []
                          tags.push({ key: 'coverart', value: values.coverArt })
                          tags.push({ key: 'storyart', value: values.storyArt })
                          libraryContract
                            .record(
                              values.title,
                              values.author,
                              values.authorWallet,
                              values.content,
                              tags
                            )
                            .then((result) => {
                              console.log('result:', result)
                              setSubmitRecordResult('Success! - ' + result.hash)
                              setSubmitting(false)
                            })
                            .catch((err) => {
                              console.log(err)
                              if (err.message.includes('User denied')) {
                                setSubmitRecordResult(
                                  'Error: User rejected transaction.'
                                )
                              } else {
                                setSubmitRecordResult(
                                  'Error: Transaction Failed!'
                                )
                              }
                              setSubmitting(false)
                            })
                        } else {
                          setSubmitRecordResult('')
                          setSubmitting(false)
                        }
                      }, 500)
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="title">Title</label>
                          <InputControl
                            id="title"
                            name="title"
                            inputProps={{ placeholder: 'Title' }}
                            width="100%"
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="author">Author</label>
                          <InputControl
                            id="author"
                            name="author"
                            inputProps={{ placeholder: 'Author' }}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="authorWallet">
                            Author&#39;s Wallet
                          </label>
                          <InputControl
                            id="authorWallet"
                            name="authorWallet"
                            inputProps={{
                              placeholder:
                                '0x0000000000000000000000000000000000000000',
                            }}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="content">Content</label>
                          <TextareaControl
                            id="content"
                            name="content"
                            textareaProps={{ rows: 10, placeholder: 'Content' }}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="coverArt">
                            Cover Art (URL or CID)
                          </label>
                          <InputControl
                            id="coverArt"
                            name="coverArt"
                            inputProps={{
                              placeholder: 'https://www.example.com/cover.png',
                            }}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="storyArt">
                            Story Art (URL or CID)
                          </label>
                          <InputControl
                            id="storyArt"
                            name="storyArt"
                            inputProps={{
                              placeholder:
                                'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
                            }}
                          />
                        </Box>
                        <HStack>
                          <Button type="submit" disabled={isSubmitting}>
                            Record
                          </Button>
                          <Text pl="10px">{submitRecordResult}</Text>
                        </HStack>
                      </Form>
                    )}
                  </Formik>
                </TabPanel>
                <TabPanel>
                  <Formik
                    initialValues={{
                      transactionHash: '',
                    }}
                    validationSchema={Yup.object({
                      transactionHash: Yup.string()
                        .matches(
                          /^0x([A-Fa-f0-9]{64})$/,
                          'Must be a valid transaction hash'
                        )
                        .required('Required'),
                    })}
                    onSubmit={(
                      values: RevokeValues,
                      { setSubmitting }: FormikHelpers<RevokeValues>
                    ) => {
                      setTimeout(async () => {
                        setSubmitRevokeResult('Processing Transaction...')
                        if (
                          confirm(
                            "Are you sure you want to revoke '" +
                              values.transactionHash +
                              "'?"
                          )
                        ) {
                          console.log('here')
                          libraryContract
                            .revoke(values.transactionHash)
                            .then((result) => {
                              console.log('result:', result)
                              setSubmitRevokeResult('Success! - ' + result.hash)
                              setSubmitting(false)
                            })
                            .catch((err) => {
                              console.log(err)
                              if (err.message.includes('User denied')) {
                                setSubmitRevokeResult(
                                  'User rejected transaction.'
                                )
                              } else {
                                setSubmitRevokeResult('Transaction Failed!')
                              }
                              setSubmitting(false)
                            })
                        }
                      }, 500)
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="transactionHash">
                            Transaction Hash
                          </label>
                          <InputControl
                            id="transactionHash"
                            name="transactionHash"
                            inputProps={{
                              placeholder:
                                '0x0000000000000000000000000000000000000000',
                            }}
                          />
                        </Box>
                        <HStack>
                          <Button type="submit" disabled={isSubmitting}>
                            Revoke
                          </Button>
                          <Text pl="10px">{submitRevokeResult}</Text>
                        </HStack>
                      </Form>
                    )}
                  </Formik>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Heading
              textAlign="center"
              py="40px"
              w={{ base: '250px', md: '600px' }}
            >
              You need a write pass to publish the library. Unfortunately you
              don&#39;t have one.
            </Heading>
          )}
        </VStack>
      )}
      {!isConnected && <Button onClick={connectWallet}>Connect Wallet</Button>}
    </Flex>
  )
}

Publish.layout = MainLayout

export default Publish
