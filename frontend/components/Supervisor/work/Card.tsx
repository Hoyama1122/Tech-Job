import { CardWork } from '@/lib/Mock/CardWork'
import Image from 'next/image';
import React from 'react'

const Card = () => {
     
      
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
     {CardWork.map((data,idx)=>(
      <div key={idx} className='bg-white p-6 shadow-md rounded-lg'>
            <p>{data.JobId}</p> 
      </div>
     ))}
    </div>
  )
}

export default Card