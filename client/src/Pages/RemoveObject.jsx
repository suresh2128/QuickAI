import { Scissors, Sparkles } from 'lucide-react';
import React,{useState} from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  

const RemoveObject = () => {

  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();



  const onsubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    if (!object || object.trim().split(' ').length > 1) {
  toast.error('Please enter only one object name');
  return;
}


    const formData = new FormData();
    formData.append('image', input);
    formData.append('object', object);

    const { data } = await axios.post('/api/ai/remove-image-object', formData, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (data.success) {
      setContent(data.content);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
  setLoading(false);
};


  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700'>
      {/* Image Upload */}
      <form onSubmit={onsubmit} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 cursor-pointer'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          accept='image/*'
          type='file'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />

        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image...'
          required
        />


        <button disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className='w-5' />}
          Remove Object
        </button>
      </form>

      {/* Result Preview */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Scissors className='w-5 h-5 text-[#4A7Aff]' />
          <h1 className='text-base font-semibold'>Processed Image</h1>
        </div>

        {
          !content ? (
            <div className='text-sm text-gray-700 whitespace-pre-wrap space-y-2'>
          <div className='flex flex-col items-center gap-5 text-gray-400 mt-20'>
            <Scissors className='w-9 h-9' />
            <p>Upload an image and click "Remove Object" to get started.</p>
          </div>
        </div>
          ):(
            <img src={content} alt="image" className='mt-3 w-full h-full' />
          )
        }
      </div>
    </div>
  )
}

export default RemoveObject