import { useS3Upload, getImageData } from 'next-s3-upload'
import { useState } from 'react'
import { InputControl } from 'formik-chakra-ui'
import { HStack, Link, Button, InputProps } from '@chakra-ui/react'

type Props = {
  id: string
  name: string
  inputProps: InputProps
  setFieldValue: (field: string, value: unknown) => void
  setFieldTouched: (field: string, value: unknown) => void
  setFieldError: (field: string, value: unknown) => void
  fileRequirements: (height: number, width: number) => string
}

const UploadInput = ({
  id,
  name,
  inputProps,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  fileRequirements,
}: Props) => {
  const [uploadUrl, setUploadUrl] = useState('')
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  const handleFileChange = async (file) => {
    clearField()
    const { height, width } = await getImageData(file)
    if (height && width) {
      const requirementError = fileRequirements(height, width)
      if (requirementError !== '') {
        setFieldError(id, requirementError)
        setFieldTouched(id, true)
      } else {
        setFieldError(id, '')
        setFieldTouched(id, true)
        const { url } = await uploadToS3(file)
        setUploadUrl(url)
        setFieldValue(id, url)
      }
    }
  }

  const clearField = () => {
    setFieldValue(id, '')
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
        <FileInput onChange={handleFileChange} />
        <Button variant="whiteOutline" onClick={openFileDialog}>
          Upload file
        </Button>
        <Button variant="whiteOutline" onClick={clearField}>
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
