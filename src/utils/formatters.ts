export function shortenAddress(address: string, length = 3): string {
  if (!address) return ''
  return address.slice(0, length) + '...' + address.slice(-length)
}
