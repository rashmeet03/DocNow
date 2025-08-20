import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability , removeDoctor, editDoctor , aToken , getAllDoctors} = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

 return (
  <div className='m-5 max-h-[90vh] overflow-y-scroll'>
    <h1 className='text-lg font-medium'>All Doctors</h1>
    <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
      {doctors.map((item, index) => (
        <div
          className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group'
          key={index}
        >
          <img
            className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500'
            src={item.image}
            alt=""
          />
          <div className='p-4'>
            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
            <div className='mt-2 flex items-center gap-1 text-sm'>
              <input
                onChange={() => changeAvailability(item._id)}
                type="checkbox"
                checked={item.available}
              />
              <p>Available</p>
            </div>

            {/* ← ADD START */}
            <div className='mt-3 flex gap-2'>
              <button
                onClick={() => removeDoctor(item._id)}
                className='px-2 py-1 text-xs bg-red-500 text-white rounded'
              >
                Remove
              </button>
              <button
  onClick={() => navigate(`/edit-doctor/${item._id}`)}
  className='px-2 py-1 text-xs bg-blue-500 text-white rounded'
>
  Edit
</button>

            </div>
            {/* ← ADD END */}

          </div>
        </div>
      ))}
    </div>
  </div>
)

}

export default DoctorsList