"use client"

import { useState } from "react"
import { FaSearch } from "react-icons/fa"

const SearchBlog = ({ search, handleSearchChange, handleSearch }) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-7">
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`flex items-center overflow-hidden bg-white rounded-lg shadow-md transition-all duration-300 ${isFocused ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"}`}
        >
          <div className="flex items-center justify-center w-12 h-12 text-gray-400">
            <FaSearch className="w-5 h-5" />
          </div>

          <input
            type="text"
            placeholder="ค้นหาข่าวที่คุณสนใจ..."
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full py-3 pr-4 bg-transparent focus:outline-none"
            aria-label="ค้นหาข่าวสาร"
          />

          <button
            type="submit"
            className="h-12 px-6 text-white transition-all duration-300 bg-amber-600 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary md:px-8"
            aria-label="ค้นหา"
          >
            <span className="hidden md:inline">ค้นหา</span>
            <FaSearch className="md:hidden w-5 h-5" />
          </button>
          
        </div>

      </form>
    </div>
  )
}

export default SearchBlog

