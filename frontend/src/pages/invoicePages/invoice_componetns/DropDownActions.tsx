import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { AppRoute } from 'common/enums/app-route.enum'
import { useAppSelector } from 'hooks/useAppDispatch'
import { Link } from 'react-router-dom'

export default function DropDownActions(props: any) {
  const dateNow = new Date()
  const currentUser = useAppSelector((state) => state.userProfile)
  const loader = useAppSelector((state) => state.loader)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="col-span-1 text-center text-green-medium text-xl mb-5 mx-3">
          ...
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 px-4 origin-top-right rounded-md bg-gray-medium shadow-lg ring-1 ring-text ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {!props.paid && props.createdByEmail === currentUser.email && (
              <Menu.Item>
                {({ active }) => (
                  <a
                    href={`${AppRoute.INVOICES}/${AppRoute.INVOICE_UPDATE}/${props.invoiceId}`}
                    className={`${
                      active
                        ? 'bg-gray-medium text-gray-default'
                        : 'text-text-light'
                    } block px-4 py-2 text-sm`}
                  >
                    Update
                  </a>
                )}
              </Menu.Item>
            )}
            {!props.paid &&
              props.createdByEmail !== currentUser.email &&
              dateNow < new Date(props.dueDate) && (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active
                          ? 'bg-gray-medium text-gray-default'
                          : 'text-text-light'
                      } block px-4 py-2 text-sm`}
                    >
                      Paid
                    </a>
                  )}
                </Menu.Item>
              )}
            <Menu.Item>
              {({ active }) => (
                <button
                  disabled={loader}
                  className={`${
                    active
                      ? 'bg-gray-medium text-gray-default'
                      : 'text-text-light'
                  } block px-4 py-2 text-sm`}
                  onClick={props.removeInvoice}
                >
                  Remove
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
