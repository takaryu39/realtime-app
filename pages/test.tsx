import { Spinner } from '@/Components/Spinner'
import { useState } from 'react'

const test = () => {
  const [setValue, isSetValue] = useState('')
  const handleChangeValue = (value: string) => {
    isSetValue(value)
  }
  console.log(setValue)

  return (
    <div>
      <p>{setValue}</p>
      <input
        type="text"
        onChange={(e) => {
          handleChangeValue(e.target.value)
        }}
      />
      <Spinner />
    </div>
  )
}

export default test
