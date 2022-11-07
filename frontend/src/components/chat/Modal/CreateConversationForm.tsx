import React, { Dispatch, useState } from 'react'
import { Input } from 'components/common/inputs/Input'
import { Typography } from 'components/common/Typography'
import { CreateConversationParams } from '../interfaces'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { createNewConversation } from 'redux/slice/conversations/conversations.actionCreator'
import { getUserByQuery } from 'redux/slice/userProfile/actionCreators'
import { useSearchParams } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import { AxiosError } from 'axios'

type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>
}

export const CreateConversationForm: React.FC<Props> = ({ setShowModal }) => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  const [recipientEmail, setRecipientEmail] = useState<string | null>(null)
  const [greetingMessage, setGreetingMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [recipientId, setRecipientId] = useState(null)

  const debouncedTerm = useDebounce(searchParams, 200)

  const searchRecipientHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim()
    const params = new URLSearchParams({ email: query })

    setSearchQuery(query)
    setSearchParams(params)

    getUsersByEmail(debouncedTerm)
  }

  const getUsersByEmail = async (params: URLSearchParams) => {
    setErrorMessage(null)
    setRecipientEmail(null)

    if (!params) return

    try {
      const response = await getUserByQuery(params)

      setRecipientEmail(response.data.email)
      setRecipientId(response.data.id)
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr?.response?.status || -1

      if (status === 409) {
        return setErrorMessage('User already in your contacts')
      }

      return setErrorMessage('User not found')
    }
  }

  const createConversationHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!recipientId || !greetingMessage) return

    const newConversation: CreateConversationParams = {
      recipientId,
      message: greetingMessage,
    }

    dispatch(createNewConversation(newConversation))
    setGreetingMessage('')
    setShowModal(false)
    setSearchQuery('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <form
      onSubmit={createConversationHandler}
      className="flex flex-col justify-center gap-1 w-full"
    >
      <div>
        <Input
          type={'email'}
          name={'recipient'}
          placeholder={'recipient email'}
          onChange={searchRecipientHandler}
          value={searchQuery}
          onBlur={() => recipientEmail && setSearchQuery(recipientEmail)}
          required
        />
      </div>
      <div className=" h-4 flex items-center justify-start">
        {errorMessage && searchQuery.length > 3 ? (
          <Typography className=" text-error" type={'Ag-12-medium'}>
            {errorMessage}
          </Typography>
        ) : null}
        {recipientEmail && searchQuery.length > 3 ? (
          <div
            onClick={() => {
              setSearchQuery(recipientEmail)
              setRecipientEmail(null)
            }}
          >
            <Typography className="pl-4 py-1 text-green" type={'Ag-12-medium'}>
              {recipientEmail}
            </Typography>
          </div>
        ) : null}
      </div>
      <div>
        <label htmlFor="message">
          <textarea
            name="message"
            id="message"
            className="resize-none border-none rounded-lg text-sm opacity-70 text-gray-500  w-full focus:rings-green-light focus:ring-green-light focus:outline-none"
            placeholder="Write a message..."
            value={greetingMessage}
            onChange={(e) => setGreetingMessage(e.target.value)}
          />
        </label>
      </div>
      <button
        className={`${
          recipientId && greetingMessage
            ? 'bg-green-light text-green-dark'
            : 'bg-gray-300 text-white'
        }  rounded-lg py-2 px-4`}
        disabled={!recipientId}
      >
        <Typography type={'Ag-18-semibold'}>Submit</Typography>
      </button>
    </form>
  )
}
