import React from 'react'
import DefaultLayout from '../../components/layout/defaulLayout'
import OptionSection from './OptionSection'
import BlogList from '../Blogs/components/BlogList'

const Homepage = () => {
  return (
    <DefaultLayout>
      <OptionSection />
      <BlogList limit={6} />
    </DefaultLayout>
  )
}

export default Homepage
