import md5 from 'md5'

const createAuthToken = (): string => {
  const now = new Date(Date.now())

  let [year, month, day]: (string | number)[] = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ]

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  const timestamp = '' + year + month + day
  const password = import.meta.env.VITE_API_PASSWORD

  return md5(`${password}_${timestamp}`)
}

export default createAuthToken
