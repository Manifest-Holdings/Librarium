import { extendTheme, Input, Select } from '@chakra-ui/react'
import { Button } from './Button'
import { Heading } from './Heading'
import { Tabs } from './Tabs'
// import { InputControl } from 'formik-chakra-ui'

Input.defaultProps = {
  ...Input.defaultProps,
  backgroundColor: '#0d1117',
  borderColor: '#30363d',
  color: '#FFF',
  _focus: {
    borderColor: '#58a6ff',
    boxShadow: 'none',
  },
  _invalid: {
    borderColor: 'red.500',
    boxShadow: '0 1px 0 0 red.500',
  },
}

Select.defaultProps = {
  ...Select.defaultProps,
  backgroundColor: '#0d1117',
  borderColor: '#30363d',
  color: '#FFF',
  _focus: {
    borderColor: '#58a6ff',
    boxShadow: 'none',
  },
}
export const mainTheme = extendTheme({
  components: {
    Button,
    Heading,
    Tabs,
  },
  styles: {
    global: {
      'html, body': {
        color: '#ddcbbd',
        backgroundColor: '#282728',
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
