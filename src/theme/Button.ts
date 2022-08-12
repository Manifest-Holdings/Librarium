import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    background: 'white',
    color: 'black',
    _hover: {
      background: 'white',
      color: 'black',
    },
  },
  sizes: {},
  variants: {
    outline: {
      background: 'transparent',
      color: 'white',
      _hover: {
        color: 'gray.800',
      },
    },
  },
  defaultProps: {},
}
