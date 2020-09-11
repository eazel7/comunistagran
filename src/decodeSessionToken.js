import { base64decode } from './utils'

export default function decodeSessionToken(token) {
  return JSON.parse(base64decode(token.split('.')[1]))
}
