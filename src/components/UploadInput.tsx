import { useS3Upload, getImageData } from 'next-s3-upload'
import { useState } from 'react'
import { InputControl } from 'formik-chakra-ui'
import { HStack, Link, Button, InputProps } from '@chakra-ui/react'

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

type Props = {
  id: string
  name: string
  inputProps: InputProps
  setFieldValue: (field: string, value: unknown) => void
  setFieldTouched: (field: string, value: unknown) => void
  setFieldError: (field: string, value: unknown) => void
  values: RecordValues
}

const UploadInput = ({
  id,
  name,
  inputProps,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  values,
}: Props) => {
  const [uploadUrl, setUploadUrl] = useState('')
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  const handleCoverArtFileChange = async (file) => {
    setUploadUrl('')
    setFieldValue('coverArt', '')
    const { height, width } = await getImageData(file)
    if (height && width) {
      if (height / width != 1) {
        setFieldError('coverArt', 'Cover art must be a square image')
        setFieldTouched('coverArt', true)
      } else if (
        (height > 500 || height < 200) &&
        (width > 500 || width < 200)
      ) {
        setFieldError(
          'coverArt',
          'Cover art must be between 200x200 and 500x500'
        )
        setFieldTouched('coverArt', true)
      } else {
        setFieldError('coverArt', '')
        setFieldTouched('coverArt', true)
        const { url } = await uploadToS3(file)
        setUploadUrl(url)
        values.coverArt = url
      }
    }
  }

  const clearCoverArt = () => {
    setFieldValue('coverArt', '')
    setUploadUrl('')
  }
  return (
    <>
      <HStack alignItems="baseline">
        <InputControl
          id={id}
          name={name}
          inputProps={inputProps}
          isDisabled={uploadUrl ? true : false}
        />
        <FileInput onChange={handleCoverArtFileChange} />
        <Button variant="whiteOutline" onClick={openFileDialog}>
          Upload file
        </Button>
        <Button variant="whiteOutline" onClick={clearCoverArt}>
          X
        </Button>
      </HStack>
      {uploadUrl && (
        <Link
          href={uploadUrl}
          target="_blank"
          textTransform="uppercase"
          fontSize="10px"
          color="#999"
        >
          Preview
        </Link>
      )}
    </>
  )
}

export default UploadInput
