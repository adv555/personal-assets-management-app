import React from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { Formik } from 'formik'
// import { IWallet } from 'redux/slice/walletsSlice'
import { addNewMoneyBox, IMoneyBox } from 'redux/slice/moneyBoxesSlice'
// import { string } from 'yup'
import style from './MoneyBoxModal.module.scss'

interface InitialValue {
  name: string,
  target: number,
  bill: number,
  percentageIncome: boolean,
  percentageIncomeNumber: number,
  percentageExpenses: boolean,
  percentageExpensesNumber: number,
  regularIncome: boolean,
  regularIncomeNumber: number,
  regularExpenses: false,
  regularExpensesNumber: number,
}

interface MoneyBoxModal {
  openModal: boolean
  toggleModal: () => void
}

export const MoneyBoxModal: React.FC<MoneyBoxModal> = ({
  openModal = false,
  toggleModal,
}) => {
  const dispatch = useAppDispatch()
  const { wallets } =
    useAppSelector((state) => state.wallets)
  
  const initialValues: InitialValue = {
    name: '',
    target: 0,
    bill: wallets.length === 0 ? 0 : wallets[0].id,
    percentageIncome: false,
    percentageIncomeNumber: 0,
    percentageExpenses: false,
    percentageExpensesNumber: 0,
    regularIncome: false,
    regularIncomeNumber: 0,
    regularExpenses: false,
    regularExpensesNumber: 0,
  }
  
  const handleSubmit = (values: InitialValue, {setSubmitting}: any) => {
    const currentWallet  = wallets.find((item) => item.id === Number(values.bill))

    const newMoneyBox: IMoneyBox = {
      id: Date.now(),
      moneybox_name: values.name,
      amount: 0,
      target: values.target,
      walletId: Number(values.bill),
      currency: currentWallet ? currentWallet.currency : wallets[0].currency,
      accumulation_method: [],
    }

    if (values.percentageIncome) {
      newMoneyBox.accumulation_method.push({
        method: 'Percentage',
        type: 'Income',
        number: values.percentageIncomeNumber
      }) 
    }

    if (values.percentageExpenses) {
      newMoneyBox.accumulation_method.push({
        method: 'Percentage',
        type: 'Cost',
        number: values.percentageExpensesNumber
      }) 
    }

    if (values.regularIncome) {
       newMoneyBox.accumulation_method.push({
        method: 'Regular',
        type: 'Income',
        number: values.regularIncomeNumber
      }) 
    }

    if (values.regularExpenses) {
       newMoneyBox.accumulation_method.push({
        method: 'Regular',
        type: 'Cost',
        number: values.regularExpensesNumber
      }) 
    }

    dispatch(addNewMoneyBox(newMoneyBox))
    // setSubmitting(true)
    toggleModal()
  }

  interface Errors {
    name?: string
    target?: string
    bill?: string
    percentageIncome?: string
    percentageExpenses?: string
    percentageIncomeNumber?: string
    percentageExpensesNumber?: string
    regularIncome?: string
    regularIncomeNumber?: string
    regularExpenses?: string
    regularExpensesNumber?: string
  }

  return (
    <>
      {openModal && (
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: Errors = {}

            if (!values.name) {
              errors.name = 'Required'
            }

            if (!values.target) {
              errors.target = 'Required'
            }

            if (!values.bill) {
              errors.bill = 'Required'
            }

            if (
              !values.percentageIncome &&
              !values.percentageExpenses &&
              !values.regularIncome &&
              !values.regularExpenses
            ) {
              errors.percentageIncome = 'Select one or more options'
              errors.percentageExpenses = 'Select one or more options'
              errors.regularIncome = 'Select one or more options'
              errors.regularExpenses = 'Select one or more options'
            }

            if (
              values.percentageIncome &&
              values.percentageIncomeNumber === 0
            ) {
              errors.percentageIncomeNumber = 'Required'
            }

            if (
              values.percentageExpenses &&
              values.percentageExpensesNumber === 0
            ) {
              errors.percentageExpensesNumber = 'Required'
            }

            if (values.regularIncome && values.regularIncomeNumber === 0) {
              errors.regularIncomeNumber = 'Required'
            }

            if (values.regularExpenses && values.regularExpensesNumber === 0) {
              errors.regularExpensesNumber = 'Required'
            }

            return errors
          }}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <div className={style.wrapper}>
              <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-6">
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <form onSubmit={handleSubmit}>
                      <div className="overflow-hidden shadow rounded-md">
                        <div className="bg-white px-4 py-5 sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                MoneyBox Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.name && touched.name && errors.name}
                              </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="target"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Target
                              </label>
                              <input
                                type="number"
                                name="target"
                                min={100}
                                step={100}
                                value={values.target}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.target &&
                                  touched.target &&
                                  errors.target}
                              </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="bill"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Bill
                              </label>
                              <select
                                value={values.bill}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="bill"
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                {wallets.map((wallet) => {
                                  return <option key={wallet.id} value={wallet.id}>{wallet.wallet_name} ({wallet.currency})</option>
                                })}
                              </select>

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.bill && touched.bill && errors.bill}
                              </div>
                            </div>

                            <div className="col-span-6">
                              <input
                                checked={values.percentageIncome}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="percentageIncome"
                                id="percentageIncome"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="percentageIncome"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Percentage of income
                              </label>

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.percentageIncome &&
                                  touched.percentageIncome &&
                                  errors.percentageIncome}
                              </div>
                            </div>

                            {values.percentageIncome && (
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="percentageIncomeNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Percent
                                </label>
                                <input
                                  type="number"
                                  name="percentageIncomeNumber"
                                  min={1}
                                  max={10}
                                  value={values.percentageIncomeNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />

                                <div className="mt-1 text-red-600 font-medium">
                                  {errors.percentageIncomeNumber &&
                                    touched.percentageIncomeNumber &&
                                    errors.percentageIncomeNumber}
                                </div>
                              </div>
                            )}

                            <div className="col-span-6">
                              <input
                                checked={values.percentageExpenses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="percentageExpenses"
                                id="percentageExpenses"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="percentageExpenses"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Percentage of expenses
                              </label>

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.percentageExpenses &&
                                  touched.percentageExpenses &&
                                  errors.percentageExpenses}
                              </div>
                            </div>

                            {values.percentageExpenses && (
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="percentageExpensesNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Percent
                                </label>
                                <input
                                  type="number"
                                  name="percentageExpensesNumber"
                                  min={1}
                                  max={10}
                                  value={values.percentageExpensesNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />

                                <div className="mt-1 text-red-600 font-medium">
                                  {errors.percentageExpensesNumber &&
                                    touched.percentageExpensesNumber &&
                                    errors.percentageExpensesNumber}
                                </div>
                              </div>
                            )}

                            <div className="col-span-6">
                              <input
                                checked={values.regularIncome}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="regularIncome"
                                id="regularIncome"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="regularIncome"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Regular replenishment from income
                              </label>

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.regularIncome &&
                                  touched.regularIncome &&
                                  errors.regularIncome}
                              </div>
                            </div>

                            {values.regularIncome && (
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="regularIncomeNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  name="regularIncomeNumber"
                                  min={50}
                                  step={50}
                                  value={values.regularIncomeNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />

                                <div className="mt-1 text-red-600 font-medium">
                                  {errors.regularIncomeNumber &&
                                    touched.regularIncomeNumber &&
                                    errors.regularIncomeNumber}
                                </div>
                              </div>
                            )}

                            <div className="col-span-6">
                              <input
                                checked={values.regularExpenses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="regularExpenses"
                                id="regularExpenses"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="regularExpenses"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Regular replenishment from expenses
                              </label>

                              <div className="mt-1 text-red-600 font-medium">
                                {errors.regularExpenses &&
                                  touched.regularExpenses &&
                                  errors.regularExpenses}
                              </div>
                            </div>

                            {values.regularExpenses && (
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="regularExpensesNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  name="regularExpensesNumber"
                                  min={50}
                                  step={50}
                                  value={values.regularExpensesNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />

                                <div className="mt-1 text-red-600 font-medium">
                                  {errors.regularExpensesNumber &&
                                    touched.regularExpensesNumber &&
                                    errors.regularExpensesNumber}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#C8EE44] py-2 px-4 text-sm font-medium text-[#1B1F2D] shadow-sm hover:bg-[#84CC16] hover:text-[#FFF] focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:ring-offset-2"
                          >
                            Submit
                          </button>

                          <button
                            onClick={toggleModal}
                            type="button"
                            className="inline-flex justify-center ml-2 rounded-md border border-transparent bg-stone-50 py-2 px-4 text-sm font-medium text-[#1B1F2D] hover:text-[#FFF] shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      )}
    </>
  )
}
