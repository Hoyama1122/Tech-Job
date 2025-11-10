import Calendar from '@/components/ui/Calendar'
import React from 'react'

const Dashboard = () => {
  return (
    <div className=''>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
            <div className='p-6 bg-gray-300 rounded-lg'>
            <p className='' fs-1>Mr. Jason John</p>
            <p>รหัสพนักงาน 67696969</p>
            </div>
            <div className='p-6 bg-gray-300 rounded-lg'>
            <p>วันจันทร์ที่</p>
            13 กุมภาพันธ์ 
            <div className=''>
            <p>เวลา</p>
              09:25
            </div>
            
            </div>
        </div>
        <div className='mt-4 flex items-center gap-4'>
          <button className='button-create'>งานวันนี้</button>
          <button className='button-create'>งานสัปดาห์นี้</button>
        </div>
        <div className='mt-4 bg-gray-300 rounded-lg p-3'>
          ลูกค้า : บริษัทกำลังสร้าง
          <p className=''>เลขที่ใบงาน : 0001</p>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>
        <div className='mt-4 bg-gray-300 rounded-lg p-3'>
          ลูกค้า : บริษัทกำลังสร้าง
          <p className=''>เลขที่ใบงาน : 0001</p>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>
        <div className='mt-4 bg-gray-300 rounded-lg p-3'>
          ลูกค้า : บริษัทกำลังสร้าง
          <p className=''>เลขที่ใบงาน : 0001</p>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>
    </div>
  )
}

export default Dashboard