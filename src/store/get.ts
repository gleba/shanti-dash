import constants from './constants.ts'

async function get(name: string) {
  return fetch(constants.API + name)
    .then((r) => r.json())
}

export default get