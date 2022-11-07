import React from 'react'
import style from './DropDown.module.scss'
import { IoIosArrowBack } from 'react-icons/io'
import { CoinType } from 'redux/slice/cryptoWidgetSlice'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'

type PropsDropDowm = {
  options: CoinType[] | string[]
  select?: string
  select2?: string
  setSelect?: any
  chengeCurrencyFunction?: any
}

type PopupClick = MouseEvent & {
  path: Node[]
}

const DropDown: React.FC<PropsDropDowm> = ({
  options,
  select,
  setSelect,
  select2,
  chengeCurrencyFunction,
}) => {
  const dispatch = useAppDispatch()
  const [isActive, setIsActive] = React.useState(false)

  const selectRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const _event = event as PopupClick

      if (selectRef.current && !_event.path.includes(selectRef.current)) {
        setIsActive(false)
      }
    }

    document.body.addEventListener('click', handleClickOutside)

    return () => {
      document.body.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={style.dropdown} ref={selectRef}>
      <div className={style.btn} onClick={() => setIsActive(!isActive)}>
        {select || select2}
        <IoIosArrowBack
          size={26}
          className={`${isActive ? style.arrow2 : style.arrow}`}
        />
      </div>

      <div className={isActive ? style.content2 : style.content}>
        {options.map((el: any, id) => (
          <div
            key={id}
            className={style.item}
            onClick={() => {
              setSelect && dispatch(setSelect([el.marker, el.price]))
              chengeCurrencyFunction && dispatch(chengeCurrencyFunction(el))
              setIsActive(false)
            }}
          >
            {el.marker ? el.marker : el}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DropDown
