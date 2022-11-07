import { useFormik } from 'formik'
import React from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { InputUserSchema } from '../schemas/inputUserSchema'

export const UserInputModalForm = (props: {
  setShowModal: (arg0: boolean) => void
  getCustomer: (arg0: { email: string; phone: string }) => void
  userAlReady: any
  showModal: any
  error:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
}) => {
  const formik = useFormik({
    initialValues: { email: '', phone: '' },
    onSubmit: (values) => {
      props.setShowModal(false)
      if (values.email || values.phone) {
        props.getCustomer(values)
      }
    },
    validationSchema: InputUserSchema,
  })

  return (
    <>
      <button
        className="bg-green-minimal text-green-medium font-medium rounded-xl w-full py-3.5 font-semibold hover:bg-green-ultralight"
        onClick={() => props.setShowModal(true)}
      >
        {props.userAlReady ? (
          <span>Change Customer</span>
        ) : (
          <span>Add Customer</span>
        )}
      </button>
      {props.showModal ? (
        <>
          <div className="flex backdrop-blur-sm justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl text-base font-semibold">
                    Customer Info
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => props.setShowModal(false)}
                  >
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-error h-12 w-11 block opacity-7">
                      <MdOutlineCancel size={20} />
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  {props.error && (
                    <div className="text-error mb-4">{props.error}</div>
                  )}
                  <form
                    onSubmit={formik.handleSubmit}
                    className="bg-gray-ultralight rounded px-8 pt-6 pb-8 w-full"
                  >
                    <label className="block text-black text-sm font-bold mb-1">
                      Email:
                    </label>
                    <input
                      type={'email'}
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      className="w-full border border-gray-light rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-error col-span-12 mt-1">
                        {formik.errors.email}
                      </p>
                    )}
                    <label className="block text-black text-sm font-bold mt-2 mb-1">
                      Phone:
                    </label>
                    <input
                      name="phone"
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                      className="w-full border border-gray-light rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-error col-span-12 mt-1">
                        {formik.errors.phone}
                      </p>
                    )}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-error hover:text-error-dark background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => props.setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-green-minimal text-green-medium font-medium rounded-xl font-semibold hover:bg-green-ultralight px-6 py-3 outline-none focus:outline-none mr-1 mb-1"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
