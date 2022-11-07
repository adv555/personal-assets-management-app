import React, { useState } from 'react'
import { getUserByParams } from 'redux/slice/invoiceServices/invoiceActions'
import { currentImagesPath } from '../secondaryFunctions/secondaryFunctions'
import { UserInputModalForm } from './UserInputModalForm'

const initialUser = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  phone: '',
  avatarPath: '',
}

export function ClientDetails(props: any) {
  const [client, setClient] = useState(props.client || initialUser)
  const [error, setError] = useState('')
  const [showUserInputModalForm, setShowUserInputModalForm] = useState(false)
  const [invoiceAlreadyHasUser, setInvoiceAlreadyHasUser] = useState(
    props.client ? true : false,
  )
  const userFullName = client.firstName
    ? `${client.firstName} ${client.lastName}`
    : client.email
  const address = client.address ? client.address.split(',') : ''

  async function getUser(params: {
    [x: string]: any
    email?: string
    phone?: string
  }) {
    let correctParams = {}

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        correctParams = { ...correctParams, [key]: params[key] }
      }
    })

    try {
      const user = await getUserByParams(correctParams)

      setClient(user)
      props.setCustomer(user)
      setError('')
      setInvoiceAlreadyHasUser(true)
    } catch (e: any) {
      setError(e.response.data.message)
      setShowUserInputModalForm(true)
    }
  }

  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">
        Client Details
      </div>
      <div className="container columns-1">
        {client.email && (
          <>
            <img
              className="mx-5 mb-2 float-left h-14 rounded-full"
              src={currentImagesPath(client.avatarPath)}
              alt={userFullName}
            />
            <div className="text-base font-semibold text-lg px-4">
              {userFullName}
            </div>
            <div className="text-base font-normal text-text-ultralight px-4">
              {client.email}
            </div>
          </>
        )}
      </div>
      <br />
      <hr className="border-gray-border w-11/12 mx-auto" />
      <div className="container columns-1 p-5">
        {client.address && (
          <>
            <div className="text-base font-semibold text-lg">{address[1]}</div>
            <div className="text-base font-normal text-text-ultralight">
              {address[0]}, {address[2]}
            </div>
          </>
        )}
        {props.setCustomer && (
          <>
            <br />
            <UserInputModalForm
              getCustomer={getUser}
              showModal={showUserInputModalForm}
              userAlReady={invoiceAlreadyHasUser}
              setShowModal={setShowUserInputModalForm}
              error={error}
            />
          </>
        )}
      </div>
    </div>
  )
}
