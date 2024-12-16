import React from 'react'
import SearchBox from '../components/SearchBox'
import Header from '../components/Header'

const page = () => {
    return (
        <div className='h-screen w-full bg-white'>
            <Header />
            <div className='block md:hidden p-4'>
                <SearchBox />
            </div>
        </div>
    )
}

export default page