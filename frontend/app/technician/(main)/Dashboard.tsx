import Calendar from '@/components/ui/Calendar'
import React from 'react'

const Dashboard = () => {
  return (
    <div className=''>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-6 '>
              <Calendar/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard