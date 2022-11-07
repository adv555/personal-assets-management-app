import React from 'react'
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg'

interface SearchProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchQuery: string
}

export const Search: React.FC<SearchProps> = ({ onSearch, searchQuery }) => {
  return (
    <div className="flex items-center bg-gray-ultralight rounded-2xl h-10 px-2">
      <SearchIcon className="w-6 h-6" />
      <input
        type="search"
        placeholder={'Search'}
        className="form-input border-0 bg-transparent focus:ring-transparent shadow-none px-2 w-full placeholder:opacity-70"
        onChange={onSearch}
        value={searchQuery}
      />
    </div>
  )
}
