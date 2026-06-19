import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { DiagnosisContainer } from './appointment/diagnosis-container'

interface DataProps {
    id: number
    patientId: string
    medicalId?: number
    doctorId: string
    label: React.ReactNode
}

export const MedicalHistoryDialog = async ({
    id, patientId, doctorId, label,
} : DataProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className='flex items-center justify-center rounded-full bg-blue-600/10 hover:underline text-blue-600 px-1.5 py-1'
                >
                    {label}
                </Button>
            </DialogTrigger>

            <DialogContent className='max-h-[90%] max-w-106.25 md:max-w-2xl 2xl:max-w-4xl p-8 overflow-y-auto'>
                <DiagnosisContainer 
                    id={id}
                    patientId={patientId!}
                    doctorId={doctorId!}
                />

                <p>Diagnosis Container</p>
            </DialogContent>
        </Dialog>
    )
}
