export function shortenAddress(address: string, length = 3): string {
  if (!address) return ''
  return address.slice(0, length) + '...' + address.slice(-length)
}
export function isUrl(url: string): boolean {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
    url
  )
}
