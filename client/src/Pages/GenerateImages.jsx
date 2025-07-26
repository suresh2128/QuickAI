import { Image, Sparkles,Hash } from 'lucide-react';
import React,{useState} from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {

  const imageStyle = ['Realistic','Gibil style','Anime Style','Cartoon Style','Fantasy Style','Realistic Style','3D Styles','Portrait Style',];
  
    const [selectedStyle, setSelectedStyle] = useState('Realistic');
    const [input, setInput] = useState('');
    const [publish, setPublish] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const { getToken } = useAuth();
  
    const onsubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const prompt = `Generate an image of ${input} in the style ${selectedStyle}`

         const { data } = await axios.post('/api/ai/generate-image',{ prompt, publish},
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        } 
      else {
        toast.error(data.message);
        }
      } catch (error) {
         toast.error(error.message);
      }
      setLoading(false);
    }


  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700'>
      {/* Form Column */}
      <form onSubmit={onsubmit} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all ${
                selectedStyle === item
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type='checkbox' onChange={(e)=>setPublish(e.target.checked)} checked={publish} className='sr-only peer'/>

            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
            
          </label>

          <p className='text-sm'>Make this image Public</p>
        </div>

        <button disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :<Image className='w-5' />}
          
          Generate Image
        </button>
      </form>

      {/* Display Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-base font-semibold'>Generated Image</h1>
        </div>
        
        {
          !content ? (
            <div className='text-sm text-gray-700 whitespace-pre-wrap space-y-2'>
          
            <div className='flex flex-col items-center gap-5 text-gray-400 mt-20'>
              <Image className='w-9 h-9' />
              <p>Enter a topic and click "Generate Image" to get started.</p>
            </div>
        </div>
          ) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full'/>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default GenerateImages