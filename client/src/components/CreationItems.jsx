import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItems = ({ items }) => {

    const [expanded , setExpanded] = useState(false)

  return (
    <div  onClick = {()=> setExpanded(!expanded)}   className='p-4 max-w-5xl w-full text-sm bg-white border border-gray-200 rounded-lg cursor-pointer mb-3 shadow-sm hover:shadow-md transition'>
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className='text-gray-800 font-medium'>{items.prompt}</h2>
          <p className='text-gray-500'>
            {items.type} –{' '}
            {new Date(items.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full capitalize'>
          {items.type}
        </button>
      </div>
      {
        expanded && (
            <div>
                {items.type === 'image' ? (
                    <div>
                        <img src={items.content} alt="images" className='mt-3 w-full max-w-md'/>
                    </div>
                ):(
                    <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                        <div className='reset-tw'>
                            <Markdown>{items.content}</Markdown>
                        </div>
                    </div>
                )}
            </div>
        )
      }
    </div>
  );
};

export default CreationItems;
