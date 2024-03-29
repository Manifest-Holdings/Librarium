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
import NextImage from 'next/image'
import dynamic from 'next/dynamic'
import UploadInput from '../components/UploadInput'
import { useRouter } from 'next/router'

const Publish = () => {
  const router = useRouter()
  const {
    connectWallet,
    isConnected,
    displayName,
    disconnectWallet,
    networkId,
  } = useWalletContext()
  const { libraryContract } = useLibraryContract()
  const [isValidForPublishing, setIsValidForPublishing] = useState(false)
  const [submitRecordResult, setSubmitRecordResult] = useState('')
  const [submitRevokeResult, setSubmitRevokeResult] = useState('')
  const [isNetworkValid, setIsNetworkValid] = useState(true)
  const MDEditor: ComponentType<MDEditorProps> = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
  )

  const RecordDefaults = {
    title: '',
    author: '',
    authorWallet: '',
    content: '',
    coverArt: '',
    storyArt: '',
    license: 'CC0',
    world: '',
  }

  const Worlds = [
    { value: '', label: 'None' },
    { value: 'lootverse', label: 'Lootverse' },
    { value: 'nouns', label: 'Nouns' },
    { value: 'cryptoadz', label: 'CrypToadz' },
    { value: 'chainrunners', label: 'Chain Runners' },
    { value: 'moonbirds', label: 'Moonbirds' },
  ]

  if (router.query.world_override) {
    Worlds.push({
      value: String(router.query.world_override),
      label: String(router.query.world_override),
    })
    RecordDefaults.world = String(router.query.world_override)
  }

  const SelectWorlds = () => {
    return (
      <SelectControl id="world" name="world">
        {Worlds.map((world) => {
          return (
            <option key={world.value} value={world.value}>
              {world.label}
            </option>
          )
        })}
      </SelectControl>
    )
  }

  interface RecordValues {
    title: string
    author: string
    authorWallet: string
    content: string
    coverArt: string
    storyArt: string
    license: string
    world: string
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
      console.log(networkId)
      if (networkId === Number(process.env.NEXT_PUBLIC_NETWORK_ID)) {
        setIsNetworkValid(true)
        libraryContract
          .hasValidPublishAccess()
          .then((result) => {
            setIsValidForPublishing(result)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        setIsNetworkValid(false)
      }
    }
  }, [networkId, isConnected, libraryContract])

  const coverArtRequirements = (height, width) => {
    if (height / width != 1) {
      return 'Cover art must be a square image'
    } else if ((height > 500 || height < 200) && (width > 500 || width < 200)) {
      return 'Cover art must be between 200x200 and 500x500'
    } else {
      return ''
    }
  }

  const storyArtRequirements = (height, width) => {
    if (width != 1376 && height != 860) {
      return 'Story art is ' + height + 'x' + width + ', it must be 1376x860'
    } else {
      return ''
    }
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="top"
      direction="column"
      h="full"
      mt="80px"
      px="20px"
    >
      {!isNetworkValid && (
        <Box
          position="absolute"
          top="90px"
          backgroundColor="red.900"
          padding="10px"
          maxWidth="600px"
          textAlign="center"
        >
          You are connected to the wrong network. Please connect to the &quot;
          {process.env.NEXT_PUBLIC_NETWORK}&quot; network.
        </Box>
      )}
      <Box mb="50px">
        <Heading as="h1" size={{ base: '3xl', md: '4xl' }} textAlign="center">
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
                    initialValues={RecordDefaults}
                    validateOnChange={false}
                    validateOnBlur={false}
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
                          tags.push({ key: 'world', value: values.world })
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
                    {({
                      isSubmitting,
                      values,
                      setFieldValue,
                      setFieldTouched,
                      setFieldError,
                    }) => (
                      <Form>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="title">Title *</label>
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
                          <label htmlFor="author">Author *</label>
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
                            Author&#39;s Wallet *
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
                          <Flex justifyContent="center-between">
                            <Flex alignItems="center">
                              <label htmlFor="coverArt">Cover Art *</label>
                            </Flex>
                            <Tooltip
                              label="This is the image that shows up in the NFT and when viewing the list of stories. It needs to a square (1:1) aspect ratio and a max resolution of 500x500."
                              fontSize="md"
                            >
                              <QuestionOutlineIcon ml="10px" my="5px" />
                            </Tooltip>
                          </Flex>
                          <UploadInput
                            id="coverArt"
                            name="coverArt"
                            inputProps={{
                              placeholder: 'https://www.example.com/cover.png',
                            }}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            setFieldError={setFieldError}
                            fileRequirements={coverArtRequirements}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <Flex alignItems="center">
                            <Flex alignItems="center">
                              <label htmlFor="storyArt">Story Art</label>
                            </Flex>
                            <Tooltip
                              label="This is the image that shows up in reader app. If an image isn't provided, the cover art image is used instead. It needs to be 16:10 aspect ratio with a max resolution of 1376x860."
                              fontSize="md"
                            >
                              <QuestionOutlineIcon ml="10px" my="5px" />
                            </Tooltip>
                          </Flex>
                          <UploadInput
                            id="storyArt"
                            name="storyArt"
                            inputProps={{
                              placeholder: 'https://www.example.com/story.png',
                            }}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            setFieldError={setFieldError}
                            fileRequirements={storyArtRequirements}
                          />
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="license">License</label>
                          <SelectControl id="license" name="license">
                            <option defaultValue="CC0">CC0</option>
                            <option value="CC-BY">CC-BY</option>
                            <option value="CC-BY-SA">CC-BY-SA</option>
                            <option value="CC-BY-ND">CC-BY-ND</option>
                            <option value="CC-BY-NC">CC-BY-NC</option>
                            <option value="CC-BY-NC-SA">CC-BY-NC-SA</option>
                            <option value="CC-BY-NC-ND">CC-BY-NC-ND</option>
                            <option value="allrightsreserved">
                              All Rights Reserved
                            </option>
                            <option value="N/A">
                              Not Applicable (No license required)
                            </option>
                          </SelectControl>
                        </Box>
                        <Box
                          mb="15px"
                          w={{ base: '300px', md: '600px', lg: '800px' }}
                        >
                          <label htmlFor="world">World</label>
                          <SelectWorlds />
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
                                className: 'story librarium',
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
            <VStack py="40px" spacing="20px">
              <Box>
                <NextImage
                  objectFit="cover"
                  width="500px"
                  height="300px"
                  src="/images/librarium-card-full.jpg"
                  alt="Library Card"
                />
              </Box>
              <Heading textAlign="center" w={{ base: '250px', md: '600px' }}>
                You need a write pass to publish to the library. You can find
                one on &nbsp;
                <Link
                  textDecoration="underline"
                  href="https://opensea.io/collection/librarium"
                  target="_blank"
                >
                  OpenSea
                </Link>
                &nbsp; or request one&nbsp;
                <Link
                  textDecoration="underline"
                  href="https://tfp0m1w5j9m.typeform.com/to/gV2oFyQI"
                  target="_blank"
                >
                  here
                </Link>
                .
              </Heading>
            </VStack>
          )}
        </VStack>
      )}
      {!isConnected && <Button onClick={connectWallet}>Connect Wallet</Button>}
    </Flex>
  )
}

Publish.layout = MainLayout

export default Publish
