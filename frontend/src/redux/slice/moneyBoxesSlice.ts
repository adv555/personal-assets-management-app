import { LoadingStatus } from './../../common/enums/loading-status'
import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { convertToMoney } from '../../components/wallets/helpers/convertFunction'

export interface IAccumulationMethod {
  percentageIncome?: number
  percentageExpenses?: number
  regularIncome?: number
  regularExpenses?: number
}

type Type = 'Income' | 'Cost'
type Method = 'Percentage' | 'Regular'
export interface IAccumulationMethod {
  method: Method
  type: Type
  number: number
}

export interface IMoneyBox {
  id: number
  createdAt?: Date
  updatedAt?: Date
  moneybox_name: string
  amount: number
  target: number
  walletId: number
  currency: string
  accumulation_method: IAccumulationMethod[]
}

interface MoneyBoxState {
  moneyBoxes: IMoneyBox[]
  loading: LoadingStatus
  errorMessage: string | null
  successMessage: string | null
}

const initialState: MoneyBoxState = {
  moneyBoxes: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: null,
  successMessage:null
}

const moneyBoxesSlice = createSlice({
  name: 'moneyBoxes',
  initialState,
  reducers: {
    addNewMoneyBox(state, action: PayloadAction<IMoneyBox>) {
      state.moneyBoxes.push(action.payload)
    },
    updateMoneyBox(state, action: PayloadAction<any>) {
      state.moneyBoxes.forEach(moneyBox => {
        console.log(moneyBox.walletId)
        console.log(action.payload.walletId)
      
        if (moneyBox.walletId === action.payload.walletId) {
          console.log('this card is brother for moneyBox')

          moneyBox.accumulation_method.forEach(accItem => {
            if (accItem.method === 'Percentage') {
              if (action.payload.type.match(/(\w+)/)[0] === 'Cost'
                  && accItem.type === 'Cost') {
                const transactionSum = convertToMoney(action.payload.data.sum)
                
                moneyBox.amount += transactionSum * accItem.number / 100

              } else if ((action.payload.type.match(/(\w+)/)[0] === 'Income'
                          && accItem.type === 'Income')) {
                const transactionSum = convertToMoney(action.payload.data.sum)
                
                moneyBox.amount += transactionSum * accItem.number / 100
              }
            } else if (accItem.method === 'Regular') {
              console.log('this moneyBox has Regular')

              if (action.payload.type.match(/(\w+)/)[0] === 'Cost'
                  && accItem.type === 'Cost') {
                console.log('this is Cost Regular formula')

                moneyBox.amount +=  accItem.number
           
              } else if ((action.payload.type.match(/(\w+)/)[0] === 'Income'
                          && accItem.type === 'Income')) {
                console.log('this is Income Regular formula')

                moneyBox.amount +=  accItem.number
              }
            } else {
              return
            }
          })
        }
      });
    },
  },
})

export const {
  addNewMoneyBox,
  updateMoneyBox,
} = moneyBoxesSlice.actions

export default moneyBoxesSlice.reducer
