import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"



export default function Profile() {
  const {currentUser,loading,error} = useSelector((state)=> state.user)
  const fileref = useRef(null)
  const [file, setFile] = useState(undefined)
  const[filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData , setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch();
  console.log(formData);


  useEffect(()=> {
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = ()=> {
    setFileUploadError(false);
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storeageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storeageRef,file)
    
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=> setFormData({ ...formData, avatar : downloadURL})
        );
        // setUpdateSuccess(true);
      }
    );
  };

  const handleChange = (e)=>{
    setFormData({ ...formData, [e.target.id] : e.target.value});
  };

  // const handleSubmit = async (e)=>{
  //   e.preventDefault();
  //   try {
  //     dispatch(updateUserStart());
  //     const res = await fetch(`/api/user/update/${currentUser._id}`, {
  //       method : 'POST',
  //       headers : {
  //         'Content-Type': 'application/json',
  //       },
  //       body : JSON.stringify(formData),

  //     })
  //     const data = await res.json();
  //     console.log(data);
  //     if(data.success === false){
  //       dispatch(updateUserFailure(data.message));
  //       return;
  //     }
  //     dispatch(updateUserSuccess(data));

  //   } catch (error) {
  //     dispatch(updateUserFailure(error.message))
  //   }

  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  


 
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=' text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-4" >
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileref} hidden accept="image/*" />
        
        <img onClick={()=>fileref.current.click()} className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={ formData.avatar || currentUser.avatar} alt="" />
        <p className=" text-sm self-center">
          {fileUploadError ? 
          (<span className=" text-red-700">Error Image upload (Image must be less than 2mb) 😒 </span>)
          :
          filePerc > 0 && filePerc < 100 ? (
            <span className=" text-slate-700"> {`Uploading ${filePerc}%`} </span>)
          : filePerc === 100 ? (
            <span className=" text-green-700">Image Successfully uploaded! 👍 </span>
          ) : (
            ''
          )
        }
        </p>
        
        <input type="text" placeholder="username" id="username" className=" border p-3 rounded-lg" defaultValue={currentUser.username} 
        onChange={handleChange}
        />
        
        <input type="text" placeholder="email" id="email" className=" border p-3 rounded-lg" defaultValue={currentUser.email} 
        onChange={handleChange}
        />
        
        <input type="password" placeholder="password" id="password" className=" border p-3 rounded-lg"
        onChange={handleChange}
        />
        
        <button disabled={loading} className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-80">
          {loading ? 'Loading....' : 'Update'}
        </button>
       
      </form>
      <div className=" flex justify-between mt-5 ">
        <span className=" text-red-700 cursor-pointer ">Delete account</span>
        <span className=" text-red-700 cursor-pointer ">Sign out</span>
      </div>
      <p className=" text-red-700 mt-5"> {error ? (error + 'hello'): '' } </p>
      <p className=" text-green-700 mt-5"> {updateSuccess ? 'Successfully updated user 😊 ': '' } </p>
    </div>
  )
}
