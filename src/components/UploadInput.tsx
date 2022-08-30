import { useS3Upload, getImageData } from 'next-s3-upload'
import { useState } from 'react'
import { InputControl } from 'formik-chakra-ui'
import { HStack, Button, InputProps } from '@chakra-ui/react'

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

  const openURL = (url) => {
    window.open(url, '_blank')
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
        {uploadUrl ? (
          <Button variant="whiteOutline" onClick={() => openURL(uploadUrl)}>
            Preview
          </Button>
        ) : (
          <Button variant="whiteOutline" onClick={openFileDialog}>
            Upload file
          </Button>
        )}
        <Button variant="whiteOutline" onClick={clearField}>
          X
        </Button>
      </HStack>
    </>
  )
}

export default UploadInput
