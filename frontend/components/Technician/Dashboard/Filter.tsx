import { Briefcase, Calendar, Filter } from 'lucide-react'
import React from 'react'

const FilterJobs = ({ activeTab, setActiveTab, showFilter, setShowFilter }) => {
  return (
     <div className="flex justify-between items-center mb-4">
          <div className="inline-flex rounded-lg shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg transition-colors ${
                activeTab === "today"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              งานวันนี้
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("week")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg transition-colors -ml-px ${
                activeTab === "week"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              งานทั้งหมด
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              กรอง
            </button>

            {showFilter && (
              <div className="absolute mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48 z-10">
                {["งานวันนี้", "งานทั้งหมด", "งานรอการตรวจสอบ", "งานด่วน"].map(
                  (item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setShowFilter(false)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
  )
}

export default FilterJobs