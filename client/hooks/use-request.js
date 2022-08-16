import { useState } from 'react'

import axios from 'axios'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (error) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooooops....</h4>
          <ul className='my=0'>
            {error.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
      throw error
    }
  }

  return { doRequest, errors }
}
