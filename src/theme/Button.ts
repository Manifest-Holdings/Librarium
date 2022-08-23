import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    background: '#282728',
    color: '#ddcbbd',
    lineHeight: '20px',
    _hover: {
      background: '#ddcbbd',
      color: '#282728',
    },
  },
  sizes: {},
  variants: {
    outline: {
      background: 'transparent',
      color: '#ddcbbd',
      borderColor: '#ddcbbd',
      _hover: {
        color: '#282728',
        backgroundColor: '#ddcbbd',
      },
    },
    whiteOutline: {
      background: 'transparent',
      color: '#FFF',
      border: '1px solid',
      borderColor: '#FFF',
      _hover: {
        color: '#000',
        backgroundColor: '#FFF',
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'base',
  },
}
