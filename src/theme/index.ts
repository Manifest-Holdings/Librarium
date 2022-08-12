import { extendTheme, Input } from '@chakra-ui/react'
import { Button } from './Button'
import { Heading } from './Heading'
// import { InputControl } from 'formik-chakra-ui'

Input.defaultProps = {
  ...Input.defaultProps,
  backgroundColor: '#0d1117',
  borderColor: '#30363d',
  color: '#c9d1d9',
  _focus: {
    borderColor: '#58a6ff',
    boxShadow: 'none',
  },
  _invalid: {
    borderColor: 'red.500',
    boxShadow: '0 1px 0 0 red.500',
  },
}
export const mainTheme = extendTheme({
  components: { Button, Heading },
  styles: {
    global: {
      'html, body': {
        color: '#fff',
        backgroundColor: '#000',
        fontSize: '14px',
      },
      'html, body, body > div:first-of-type, div#__next, div#__next > div': {
        height: '100%',
      },
    },
  },
  fonts: {
    heading: 'Roslindale, serif',
    body: '"Sweet Sans Pro", sans-serif',
  },
})
