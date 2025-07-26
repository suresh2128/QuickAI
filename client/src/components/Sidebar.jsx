import React from 'react';
import { useClerk, useUser, Protect } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center
        max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-50
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
        transition-all duration-300 ease-in-out`}
    >
      {/* Top Profile */}
      <div className='my-7  w-full px-4'>
        <img
          src={user.imageUrl}
          alt='User'
          className='w-16 h-16 rounded-full mx-auto'
        />
        <h1 className='mt-2 text-center font-medium text-gray-800'>
          {user.fullName}
        </h1>

        {/* Nav Items */}
        <div className='px-2 mt-5 text-sm text-gray-600 font-medium space-y-1'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded hover:bg-gray-100 transition ${
                  isActive ? 'bg-gradient-to-r from-[#3c81f6] to-[#9234EA] text-white' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom User Info */}
      <div
        onClick={openUserProfile}
        className='mb-6 w-full px-3 flex items-center  cursor-pointer hover:bg-gray-100 py-2 rounded transition'
      >
        <img src={user.imageUrl} alt='User' className='w-8 h-8 ml-5 rounded-full' />
        <div className='flex-1'>
          <h1 className='text-sm ml-2 font-medium'>{user.fullName}</h1>
          <p className='text-xs ml-2  text-gray-500'>
            <Protect plan='premium' fallback='Free'>Premium</Protect> Plan
          </p>
        </div>
        <LogOut
          onClick={(e) => {
            e.stopPropagation(); 
            signOut();
          }}
          className='w-4 h-4 mr-9 text-gray-400 hover:text-gray-700 transition cursor-pointer ml-1'
        />

      </div>
    </div>
  );
};

export default Sidebar;
