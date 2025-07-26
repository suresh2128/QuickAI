import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Layout from './Pages/Layout'
import WriteArticle from './Pages/WriteArticle'
import BlogTitles from './Pages/BlogTitles'
import Dashboard from './Pages/Dashboard'
import Generateimages from './Pages/GenerateImages'
import RemoveBackground from './Pages/RemoveBackground'
import RemoveObject from './Pages/RemoveObject'
import ReviewResume from './Pages/ReviewResume'
import Community from './Pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'


const App = () => {

    
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<Generateimages/>} />
          <Route path='remove-background' element={<RemoveBackground/>} />
          <Route path='remove-object' element={<RemoveObject/>} />
          <Route path='review-resume' element={<ReviewResume/>} />
          <Route path='community' element={<Community/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
