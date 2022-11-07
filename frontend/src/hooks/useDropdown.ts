import { RefObject, useCallback, useState } from 'react'
import useOnClickOutside from './useClickOutside'

export default function useDropdown(
  dropdownContainerRef: RefObject<HTMLElement>,
  defaultState?: boolean,
) {
  const [isDropDownOpen, setDropDownOpen] = useState(defaultState ?? false)

  useOnClickOutside(dropdownContainerRef, () => setDropDownOpen(false))

  const toggleDropDown = useCallback(
    () => setDropDownOpen((prevState) => !prevState),
    [],
  )

  return [isDropDownOpen, toggleDropDown] as const
}
