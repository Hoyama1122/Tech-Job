import Work from '@/components/Technician/Work'
import { ArrowDown } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1 className='font-title'>ใบงานทั้งหมดของฉัน</h1>
      <div className='grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4 mt-4'>
        <div className=''>
          {/* Filter */}
              <div className='flex items-center space-x-4'>
                <button className='flex items-center justify-center gap-2 rounded bg-accent text-white hover:bg-accent-hover cursor-pointer px-4 py-2'>ทั้งหมด<ArrowDown size={16}/></button>
              </div>
        </div>
        <div>
          <Work/>
        </div>
      </div>
    </div>
  )
}

export default page