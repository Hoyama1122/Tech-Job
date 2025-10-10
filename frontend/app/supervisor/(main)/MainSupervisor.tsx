import React from 'react'

const MainSupervisor = () => {
  return (
    <div>
      <div className="">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-dashboard">
          <h1 className="card-title">งานทั้งหมด</h1>
          <p className='card-text'>26</p>
        </div>
        <div className="card-dashboard">
          <h1 className="card-title">งานที่สำเร็จ</h1>
          <p className='card-text'>26</p>
        </div>
        <div className="card-dashboard">
          <h1 className="card-title">งานที่ไม่สำเร็จ</h1>
          <p className='card-text'>26</p>
        </div>
        <div className="card-dashboard">
          <h1 className="card-title">งานตีกลับ</h1>
          <p className='card-text'>26</p>
        </div>
        
      </div>
    </div>
    </div>
  )
}

export default MainSupervisor