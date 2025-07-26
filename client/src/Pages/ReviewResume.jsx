import { FileTextIcon, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);
      

    const { data } = await axios.post('/api/ai/resume-review', formData, {
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
    setLoading(false)
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700'>
      {/* File Upload */}
      <form onSubmit={onsubmit} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Interest Area Analyzer</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Area of Interest File</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          accept='application/pdf'
          type='file'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 cursor-pointer'
          required
        />

        <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF format</p>

        <button disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :<FileTextIcon className='w-5' />}
          Analyze Interests
        </button>
      </form>

      {/* Result Preview */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3 mb-4'>
          <FileTextIcon className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-base font-semibold'>Interest Report</h1>
        </div>
        {
  !content ? (
    <div className='text-sm text-gray-700 whitespace-pre-wrap space-y-2'>
      <div className='flex flex-col items-center gap-5 text-gray-400 mt-20'>
        <FileTextIcon className='w-9 h-9' />
        <p>Upload a file and click "Analyze Interests" to get started.</p>
      </div>
    </div>
  ) : (
    <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
      <div className='reset-tw'>
        <Markdown>{content}</Markdown> 
      </div>
    </div>
  )
}
      </div>
    </div>
  );
};

export default ReviewResume;
