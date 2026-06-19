import { Patient } from '@/lib/generated/prisma/client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'
import { calculateAge } from '@/utils'
import { Calendar, HomeIcon, Info, MailIcon, Phone } from 'lucide-react'
import { format } from 'date-fns'

export const PatientDetailsCard = ({data}: {data: Patient}) => {
    return (
        <Card className='shadow-none bg-white'>
            <CardHeader>
                <CardTitle>Patient Details</CardTitle>
                <div className='relative size-20 xl:size-24 rounded-full overflow-hidden'>
                    <Image
                        src={data?.img || "/men.png"}
                        alt={data ? `Profile photo of ${data.first_name} ${data.last_name}` : "Profile image"}
                        width={100}
                        height={100}
                        className='rounded-full'
                    />
                </div>

                <div>
                    <h2 className='text-lg font-semibold'>
                        {data?.first_name} {data?.last_name}
                    </h2>
                    <p className='text-sm text-gray-500'>
                        {data?.email} - {data?.phone}
                    </p>
                    <p className='text-sm text-gray-500'>
                        {data?.gender} - {calculateAge(data?.date_of_birth)} 
                    </p>
                </div>
            </CardHeader>

            <CardContent className='mt-4 space-y-4'>
                <div className='flex items-start gap-3'>
                    <Calendar size={22} className='text-gray-900' />
                    <div>
                        <p className='text-sm text-gray-900'>Date of Birth</p>
                        <p className='text-base font-medium text-gray-700'>
                            {/* {format(new Date(data?.date_of_birth), "dd MM, yyyy")} */}

                            {data?.date_of_birth
                                ? format(new Date(data.date_of_birth), "dd MM, yyyy")
                                : "Not provided"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <HomeIcon size={22} className='text-gray-900' />
                    <div>
                        <p className='text-sm text-gray-900'>Address</p>
                        <p className='text-base font-medium text-gray-700'>
                            {data?.address}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <MailIcon size={22} className='text-gray-900' />
                    <div>
                        <p className='text-sm text-gray-900'>Email</p>
                        <p className='text-base font-medium text-gray-700'>
                            {data?.email}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Phone size={22} className='text-gray-900' />
                    <div>
                        <p className='text-sm text-gray-900'>Phone</p>
                        <p className='text-base font-medium text-gray-700'>
                            {data?.phone}
                        </p>
                    </div>
                </div>

                {/* <div className='flex items-start gap-3'>
                    <Info size={22} className='text-gray-900' />
                    <div>
                        <p className='text-sm text-gray-900'>Doctor</p>
                        <p className='text-base font-medium text-gray-700'>
                            
                        </p>
                    </div>
                </div> */}

                <div className='flex items-start gap-3'>
                    
                    <div>
                        <p className='text-sm text-gray-900'>Medical conditions</p>
                        <p className='text-base font-medium text-gray-700'>
                            {data?.medical_conditions}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                   
                    <div>
                        <p className='text-sm text-gray-900'>Allergies</p>
                        <p className='text-base font-medium text-gray-700'>
                            {data?.allergies}
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
