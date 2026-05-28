"use client"

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useCallback, useState } from 'react'

const SearchInput = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const [searchValue, setSearchValue] = useState("")
    
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()

        router.push(pathName + "?" + createQueryString("q", searchValue));
    }

    return (
        <form onSubmit={handleSearch}>
            <div className='hidden xl:flex items-center border-gray-700 px-2 py-2 
            rounded-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-300'>
                <Search size={18} className='text-gray-500' />
                <input 
                    className='outline-none px-2 text-sm'
                    placeholder='Search'
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </form>
    )
}

export default SearchInput