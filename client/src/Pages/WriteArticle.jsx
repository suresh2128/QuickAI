import { Edit, Sparkle, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;
      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

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
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Form Section */}
      <form onSubmit={onSubmit} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>

        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button  disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#4A7AFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          
        >
          
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :<Edit className='w-5' />}
          Generate Article
        </button>
      </form>

      {/* Result Section */}
   <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
  <div className='flex items-center gap-3 mb-4'>
    <Edit className='w-5 h-5 text-[#4A7AFF]' />
    <h1 className='text-base font-semibold'>Generate Article</h1>
  </div>

      {!content ? (
        <div className='text-sm text-gray-700 whitespace-pre-wrap space-y-2'>
          <div className='flex flex-col items-center gap-5 text-gray-400 mt-20'>
          <Edit className='w-9 h-9' />
          <p>Enter a topic and click "Generate Article" to get started.</p>
        </div>
      </div>
    ) : (
      <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
        <div className='reset-tw'>
          <Markdown>{content}</Markdown>
        </div>
    </div>
  )}
</div>



    </div>
  );
};

export default WriteArticle;
