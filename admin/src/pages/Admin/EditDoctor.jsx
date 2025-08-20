// src/pages/Admin/EditDoctor.jsx
import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const EditDoctor = () => {
  /* ---------- state ---------- */
  const [docId, setDocId] = useState('')             // must be “docId” (backend expects this key)
  const [docImg, setDocImg] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees]           = useState('')
  const [about, setAbout]         = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree]       = useState('')
  const [address1, setAddress1]   = useState('')
  const [address2, setAddress2]   = useState('')

  /* ---------- context ---------- */
  const { backendUrl }                    = useContext(AppContext)
  const { aToken, doctors, getAllDoctors } = useContext(AdminContext)

  const { id } = useParams()
  const navigate = useNavigate()

  /* ---------- initialise form once ---------- */
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (aToken && !doctors.length) getAllDoctors()
  }, [aToken, doctors.length, getAllDoctors])

  useEffect(() => {
    if (!loaded && id && doctors.length) {
      const doctor = doctors.find(d => d._id === id)
      if (doctor) {
        setDocId(doctor._id)
        setName(doctor.name)
        setEmail(doctor.email)
        setExperience(doctor.experience)
        setFees(doctor.fees)
        setAbout(doctor.about)
        setSpeciality(doctor.speciality)
        setDegree(doctor.degree)
        setAddress1(doctor.address?.line1 || '')
        setAddress2(doctor.address?.line2 || '')
        setPreviewUrl(doctor.image)
        setLoaded(true)               // prevent future overwrites while typing
      }
    }
  }, [loaded, id, doctors])

  /* ---------- submit ---------- */
  const onSubmitHandler = async e => {
    e.preventDefault()

    try {
      if (!docId) return toast.error('Doctor ID missing')

      const formData = new FormData()
      if (docImg) formData.append('image', docImg)

      // backend expects “docId”, NOT “doctorId”
      formData.append('docId', docId)
      formData.append('name', name)
      formData.append('email', email)
      if (password.trim()) formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-doctor`,
        formData,
        { headers: { aToken } }
      )

      if (data.success) {
        toast.success(data.message)
        navigate(-1)          // back to list
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  /* ---------- UI ---------- */
  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Edit Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        {/* image */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='doc-img'>
            <img
              className='w-16 bg-gray-100 rounded-full cursor-pointer'
              src={docImg ? URL.createObjectURL(docImg) : (previewUrl || assets.upload_area)}
              alt='Doctor'
            />
          </label>
          <input id='doc-img' type='file' hidden onChange={e => setDocImg(e.target.files[0])} />
          <p>Upload doctor <br /> picture</p>
        </div>

        {/* columns */}
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          {/* left */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <Input label='Doctor name' value={name} setValue={setName} />
            <Input label='Doctor Email' type='email' value={email} setValue={setEmail} />
            <Input label='Doctor Password' type='password' placeholder='Leave blank to keep current password' value={password} setValue={setPassword} required={false} />
            <Select label='Experience' value={experience} setValue={setExperience}
              options={[...Array(10)].map((_, i) => `${i + 1} Year${i ? 's' : ''}`)} />
            <Input label='Fees' type='number' value={fees} setValue={setFees} />
          </div>

          {/* right */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <Select label='Speciality' value={speciality} setValue={setSpeciality}
              options={['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist']} />
            <Input label='Education' value={degree} setValue={setDegree} />
            <Input label='Address 1' value={address1} setValue={setAddress1} />
            <Input label='Address 2' value={address2} setValue={setAddress2} />
          </div>
        </div>

        {/* about */}
        <div className='flex-1 flex flex-col gap-1 mt-4'>
          <p>About Doctor</p>
          <textarea
            className='w-full px-4 pt-2 border rounded'
            rows={5}
            placeholder='Write about doctor'
            value={about}
            onChange={e => setAbout(e.target.value)}
            required
          />
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
          Update Doctor
        </button>
      </div>
    </form>
  )
}

/* ---------- small helpers ---------- */
const Input = ({ label, value, setValue, type='text', required=true, placeholder='' }) => (
  <div className='flex-1 flex flex-col gap-1'>
    <p>{label}</p>
    <input
      type={type}
      className='border rounded px-3 py-2'
      placeholder={placeholder || label}
      value={value}
      onChange={e => setValue(e.target.value)}
      {...(!required && { required: false })}
    />
  </div>
)

const Select = ({ label, value, setValue, options=[] }) => (
  <div className='flex-1 flex flex-col gap-1'>
    <p>{label}</p>
    <select className='border rounded px-3 py-2' value={value} onChange={e => setValue(e.target.value)}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
)

export default EditDoctor
