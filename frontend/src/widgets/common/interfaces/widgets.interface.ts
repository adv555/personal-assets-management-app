import BaseEntity from 'common/interfaces/BaseEntity'
import { LoadingStatus } from 'common/enums/loading-status'
import { WidgetsEnum } from '../enum/widgets.enum'

export type WidgetDetailsType = Omit<IUserWidget, keyof BaseEntity> & {
  component: () => JSX.Element
}

export interface IUserWidget {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  key: WidgetsEnum
  state: Record<string, any>
}

export interface IUserWidgetDto {
  name: string
  key: WidgetsEnum
  state: Record<string, any>
}

export interface IWidgetsState {
  userWidgets: IUserWidget[]
  status: LoadingStatus
}
