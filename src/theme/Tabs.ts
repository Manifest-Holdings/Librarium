import type { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const Tabs: ComponentMultiStyleConfig = {
  parts: ['tablist', 'tab', 'tabpanels', 'tabpanel'],
  baseStyle: {
    tablist: {
      borderBottom: '1px solid',
      borderColor: '#ddcbbd',
    },
    tab: {
      background: '#282728',
      color: '#ddcbbd',
      border: '1px solid',
      _hover: {
        background: '#ddcbbd',
        color: '#282728',
      },
      _selected: {
        background: '#ddcbbd',
        border: '1px solid',
        borderColor: '#ddcbbd',
        color: '#282728',
      },
    },
    tabpanels: {
      background: '#000',
      border: '1px solid',
      color: '#fff',
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {
    size: 'md',
    variant: 'base',
  },
}
