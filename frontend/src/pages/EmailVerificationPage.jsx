import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useRef,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'




const EmailVerificationPage = () => {
const navigate = useNavigate()
const inputRefs = useRef([])
const [code, setCode] = useState(['', '', '', '', '', '']);
const {error,verifyEmail,isLoading} = useAuthStore();
const handleChange = (index, value) => {
const newCode = [...code];

    //handle pasted content
    if(value.length>1){
      const pastedCode = value.slice(0,6).split('');
      for(let i=0;i<6;i++){
       newCode[i]=pastedCode[i]|| " ";
        }
        setCode(newCode);

        //focus on first and last empty input
        const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
        const focusIndex = lastFilledIndex <5 ? lastFilledIndex +1 : 5;
        inputRefs.current[focusIndex].focus();
    }
    else{
      newCode[index] = value;
      setCode(newCode);

      //focus on next input
     
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      }
    };

  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    alert('Email verified successfully!');
    try {
    await verifyEmail(verificationCode);
    navigate('/');
    toast.success("Email verified successfully!");
} catch (error) {
    console.log(error);
}
}

// submit handler
  useEffect(() => {
  if(code.every((digit) => digit !== '')){
    handleSubmit(new Event("submit"));
  }
}, [code]);


  return (
    <div className='w-full h-screen flex justify-center items-center'>
          <motion.div
          initial={{opacity:0,y:-50}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5}}
          className='max-w-md w-full p-8 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl '  
       >
<h2 className="text-3xl font-bold mb-6 pb-4 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Verify your Email</h2>
<p className="text-center text-gray-300 mb-6">Enter the 6-digit verification code sent to your email</p>

<form onSubmit={handleSubmit} className='space-y-6'>
 <div className="flex justify-between">
{code.map((digit, index) => (
    <input
      key={index}
          ref={(el) => (inputRefs.current[index]=el)}
          type='text'
          maxLenghth='6'
          value={digit}
           onChange={(e) => handleChange(index,e.target.value)}
           onKeyDown={(e) => handleKeyDown(index,e)} 
  className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
/>
))}
 </div>

{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

<motion.button
className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 
 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
type='submit'
disabled={isLoading || code.some((digit) => !digit)}
>
{isLoading ? "Verfying..." : "Verify Email"}  
</motion.button>
</form>
  </motion.div>
    </div>
  )
}

export default EmailVerificationPage
