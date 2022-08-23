import MainLayout from 'components/MainLayout'
import { useWalletContext } from '../hooks/useWalletContext'
import { useLibraryContract } from '../hooks/useLibraryContract'
import { Formik, Form, FormikHelpers } from 'formik'
import { InputControl, SelectControl } from 'formik-chakra-ui'
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
  Tooltip,
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { useState, useEffect, ComponentType } from 'react'
import * as Yup from 'yup'
import { MDEditorProps } from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'

import dynamic from 'next/dynamic'

const Publish = () => {
  const { connectWallet, isConnected, displayName, disconnectWallet } =
    useWalletContext()
  const { libraryContract } = useLibraryContract()
  const [isValidForPublishing, setIsValidForPublishing] = useState(false)
  const [submitRecordResult, setSubmitRecordResult] = useState('')
  const [submitRevokeResult, setSubmitRevokeResult] = useState('')
  const MDEditor: ComponentType<MDEditorProps> = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
  )

  interface RecordValues {
    title: string
    author: string
    authorWallet: string
    content: string
    coverArt: string
    storyArt: string
    license: string
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
              <TabPanels py="10px" px="20px">
                <TabPanel>
                  <Formik
                    initialValues={{
                      title: '',
                      author: '',
                      authorWallet: '',
                      content: '',
                      coverArt: '',
                      storyArt: '',
                      license: 'CC0',
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
                          tags.push({ key: 'license', value: values.license })
                          tags.push({ key: 'world', value: values.license })
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
                              setSubmitRecordResult(
                                'Transaction Submitted: ' +
                                  result.hash +
                                  ' <br/>Please wait a few moments before it shows up in the Librarium.'
                              )
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
                    {({ isSubmitting, values, setFieldValue }) => (
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
                          <Flex justifyContent="space-between">
                            <Flex alignItems="center">
                              <label htmlFor="coverArt">Cover Art</label>
                              <Text
                                ml="10px"
                                textTransform="uppercase"
                                fontSize="10px"
                                color="#999"
                              >
                                (URL or CID)
                              </Text>
                            </Flex>
                            <Tooltip
                              label="This is the image that shows up in the NFT and when viewing the list of stories. It needs to a square (1:1) aspect ratio and a max resolution of 500x500."
                              fontSize="md"
                            >
                              <QuestionOutlineIcon mr="10px" />
                            </Tooltip>
                          </Flex>
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
                          <Flex justifyContent="space-between">
                            <Flex alignItems="center">
                              <label htmlFor="storyArt">Story Art</label>
                              <Text
                                ml="10px"
                                textTransform="uppercase"
                                fontSize="10px"
                                color="#999"
                              >
                                (URL or CID - optional)
                              </Text>
                            </Flex>
                            <Tooltip
                              label="This is the image that shows up in reader app. If an image isn't provided, the cover art image is used instead. It needs to be 16:10 aspect ratio with a max resolution of 1376x860."
                              fontSize="md"
                            >
                              <QuestionOutlineIcon mr="10px" />
                            </Tooltip>
                          </Flex>
                          <InputControl
                            id="storyArt"
                            name="storyArt"
                            inputProps={{
                              placeholder:
                                'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
                            }}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="license">License</label>
                          <SelectControl id="license" name="license">
                            <option value="CC0" selected>
                              CC0
                            </option>
                            <option value="CC-BY">CC-BY</option>
                            <option value="CC-BY-SA">CC-BY-SA</option>
                            <option value="CC-BY-ND">CC-BY-ND</option>
                            <option value="CC-BY-NC">CC-BY-NC</option>
                            <option value="CC-BY-NC-SA">CC-BY-NC-SA</option>
                            <option value="CC-BY-NC-ND">CC-BY-NC-ND</option>
                            <option value="allrightsreserved">
                              All Rights Reserved
                            </option>
                          </SelectControl>
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="world">World</label>
                          <SelectControl id="world" name="world">
                            <option value="" selected>
                              None
                            </option>
                            <option value="lootverse">Lootverse</option>
                            <option value="nouns">Nouns</option>
                            <option value="cryptoadz">CrypToadz</option>
                            <option value="chainrunners">Chain Runners</option>
                            <option value="moonbirds">Moonbirds</option>
                          </SelectControl>
                          <Box textAlign="right">
                            <Link
                              href="https://tfp0m1w5j9m.typeform.com/to/qCfZce2y"
                              target="_blank"
                              fontSize="10px"
                              color="#999"
                              textTransform="uppercase"
                            >
                              Request an additional world
                            </Link>
                          </Box>
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="content">Content</label>
                          <div data-color-mode="dark">
                            <MDEditor
                              value={values.content}
                              textareaProps={{
                                id: 'content',
                                name: 'content',
                                placeholder: 'Content',
                              }}
                              onChange={(content) => {
                                setFieldValue('content', content)
                              }}
                              height="500px"
                              previewOptions={{
                                className: 'story',
                              }}
                            />
                          </div>
                        </Box>

                        <HStack>
                          <Button
                            variant="whiteOutline"
                            type="submit"
                            disabled={isSubmitting}
                          >
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
                              setSubmitRevokeResult(
                                'Transaction Submitted! - ' + result.hash
                              )
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
                          <Button
                            variant="whiteOutline"
                            type="submit"
                            disabled={isSubmitting}
                          >
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
