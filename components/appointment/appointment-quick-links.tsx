import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { checkRole } from '@/utils/roles'
import { ReviewForm } from '@/components/dialogs/review-form'

const AppointmentQuickLinks = async ({ staffId } : { staffId: string }) => {

    const isPatient = await checkRole("PATIENT")

    return (
        
        <Card className='w-full rounded-xl bg-white shadow-none'>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
            </CardHeader>

            <CardContent className='flex flex-wrap gap-2'>
                <Link
                    href={"?cat=charts"}
                    className='px-4 py-2 rounded-lg bg-gray-100 text-gray-600'
                >
                    Charts
                </Link>
                <Link
                    href={"?cat=appointments"}
                    className='px-4 py-2 rounded-lg bg-teal-100 text-gray-600'
                >
                    Appointments
                </Link>

                <Link
                    href="?cat=medical-history"
                    className='px-4 py-2 rounded-lg bg-green-100 text-gray-600'
                >
                    Medical History
                </Link>

                <Link
                    href="?cat=diagnosis"
                    className='px-4 py-2 rounded-lg bg-blue-100 text-gray-600'
                >
                    Diagnosis
                </Link>

                <Link
                    href="?cat=appointments#vital-signs"
                    className='px-4 py-2 rounded-lg bg-red-100 text-gray-600'
                >
                    Vital Signs
                </Link>

                <Link
                    href="?cat=lab-tests"
                    className='px-4 py-2 rounded-lg bg-purple-100 text-gray-600'
                >
                    Lab Tests
                </Link>

                {!isPatient && <ReviewForm staffId={staffId} />}

            </CardContent>
        </Card>
        
    )
}

export default AppointmentQuickLinks