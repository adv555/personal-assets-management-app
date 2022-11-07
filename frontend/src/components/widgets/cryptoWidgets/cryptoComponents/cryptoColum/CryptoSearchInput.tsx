import { Input } from 'components/common/inputs/Input'
import { InputField } from 'components/common/inputs/InputField'
import React from 'react'
import InputUI from 'ui/input/InputUI'

type PropsCryptoSearchInput = {
  searchValue: string
  setSearchValue: (e: string) => void
}

const CryptoSearchInput: React.FC<PropsCryptoSearchInput> = ({
  searchValue,
  setSearchValue,
}) => {
  return (
    <div>
      <InputUI
        type={'text'}
        placeholder={'Write the name of the cryptocurrency to search'}
        style={{ margin: '10px 0 10px 0' }}
        value={searchValue}
        onChange={setSearchValue}
      ></InputUI>
    </div>
  )
}

export default CryptoSearchInput
