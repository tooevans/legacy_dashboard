import { Table } from '@/components/tables/table'
import { clerkClient, User } from '@clerk/nextjs/server'
import { format } from 'date-fns'
import { BriefcaseBusinessIcon } from 'lucide-react'
import React from 'react'

const colums = [
    {
        header: "User ID",
        key: "id",
        className: "hidden lg:table-cell",
    },
    {
        header: "Name",
        key: "name",
    },
    {
        header: "Email",
        key: "email",
        className: "hidden lg:table-cell",
    },
    {
        header: "Role",
        key: "role",
    },
    {
        header: "Status",
        key: "status",
    },
    {
        header: "Last Login",
        key: "last_login",
        className: "hidden lg:table-cell",
    },
]

interface UserProps {
    id: string
    firstName: string
    lastName: string
    emailAddresses: { emailAddress: string }[]
    publicMetadata: { role: string }
    lastSignInAt: number | string
}

const UserPage = async () => {
    const client = await clerkClient()
    const { data, totalCount } = await client.users.getUserList({
        orderBy: "-created_at",
    })

    const renderRow = (item: UserProps) => (
        <tr
            key={item.id}
            className='border-b border-gray-300 even:bg-slate-50 text-base hover:bg-slate-50'
        >
            <td className='hidden lg:table-cell items-center'>{item?.id}</td>
            <td className='table-cell py-2 xl:py-4'>
                {item?.firstName} {item?.lastName}
            </td>
            <td className='table-cell'>{item?.emailAddresses[0].emailAddress}</td>
            <td className='table-cell capitalize'>{item?.publicMetadata.role}</td>
            <td className='hidden lg:table-cell capitalize'>Active</td>
            <td className='hidden lg:table-cell capitalize'>
                {format(item?.lastSignInAt, "dd-MM-yyyy h:mm")}
            </td>
        </tr>
    )

    return (
        <div className='bg-white rounded-xl p-2 md:p-4 2xl:p-6'>
            <div className='flex items-center justify-between'>
                <div className='hidden lg:flex items-center gap-1'>
                    <BriefcaseBusinessIcon size={20} className='text-gray-500' />

                    <p className='text-2xl font-semibold'>{totalCount}</p>
                    <span className='text-gray-700 text-sm xl:text-base'>
                        Total Users
                    </span>
                </div>
            </div>

            <div>
                <Table colums={colums} data={data} renderRow={renderRow} />
            </div>
        </div>
    )
}

export default UserPage