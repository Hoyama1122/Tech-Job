import { Search, X } from 'lucide-react'
import React from 'react'
type Props = {
    setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const ModalSerach = ({ setIsSearchOpen}:Props) => {
  return (
      <div
          className="fixed inset-0 bg-black/40 z-[1000] top-0 start-0  min-h-screen animate-fadeIn"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-xl flex flex-col mt-10 sm:mx-auto w-full max-w-2xl p-6 shadow-2xl relative transform animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Input */}
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="พิมพ์เพื่อค้นหา..."
                className="w-full border-none focus:outline-none text-gray-800 text-lg"

               
              />
            </div>

            {/* Results */}
            <ul className="max-h-60 overflow-y-auto">
              <div className="px-4">
                <li>สมชาย</li>
                <li>สมชาย</li>
                <li>สมชาย</li>
                <li>สมชาย</li>
              </div>
            </ul>
          </div>
        </div>
  )
}

export default ModalSerach