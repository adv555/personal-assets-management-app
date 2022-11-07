import { WidgetsEnum } from './enum/widgets.enum'
import { ExchangeWidget } from '../exchange'
import { ToDoWidget } from 'widgets/todo/ToDoWidget'
import { WidgetDetailsType } from './interfaces/widgets.interface'

export default {
  [WidgetsEnum.ExchangeWidget]: {
    name: 'Exchange Rates',
    key: WidgetsEnum.ExchangeWidget,
    component: ExchangeWidget,
    state: {},
  },
  [WidgetsEnum.ToDoWidget]: {
    name: 'TO DO',
    key: WidgetsEnum.ToDoWidget,
    component: ToDoWidget,
    state: {},
  },
} as Record<WidgetsEnum, WidgetDetailsType>
