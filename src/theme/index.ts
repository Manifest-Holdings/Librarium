import { extendTheme } from '@chakra-ui/react'
import { Button } from './Button'
import { Heading } from './Heading'

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
    heading: 'Joan, serif',
    body: 'Roboto, sans-serif',
  },
  colors: {
    divine: {
      grey: '#2B2B2B',
      yellow: '#C39620',
    },
  },
})
