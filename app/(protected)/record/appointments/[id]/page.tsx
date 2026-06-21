import { AppointmentContainer } from '@/components/appointment-container'
import { AppointmentDetails } from '@/components/appointment/appointment-details'
import AppointmentQuickLinks from '@/components/appointment/appointment-quick-links'
import ChartContainer from '@/components/appointment/chart-container'
import { DiagnosisContainer } from '@/components/appointment/diagnosis-container'
import { PatientDetailsCard } from '@/components/appointment/patient-details-card'
import { VitalSigns } from '@/components/appointment/vital-signs'
import { MedicalHistoryContainer } from '@/components/medical-history-container'
import { getAppointmentWithMedicalRecordsById } from '@/utils/services/appointment'
import React from 'react'

const AppointmentDetailsPage = async ({
    params, 
    searchParams,
} : {
    params: Promise<{id: string}>
    searchParams: Promise<{ [key: string] : string | string[] | undefined }>
}) => {

    const { id } = await params
    const search = await searchParams
    const cat = (search?.cat as string) || undefined

    const appointmentId = Number(id)

    const {data} = await getAppointmentWithMedicalRecordsById(Number(id))

    return (
        <div className='flex p-6 flex-col-reverse lg:flex-row w-full min-h-screen gap-10'>
            {/* LEFT */}
            <div className='w-full lg:w-[65%] flex flex-col gap-6'>

                {/* Show everything */}
                {!cat && (
                    <>
                        <AppointmentDetails 
                            id={data?.id!}
                            patient_id={data?.patient_id!}
                            appointment_date={data?.appointment_date!}
                            time={data?.time!}
                            notes={data?.note!}
                        />

                        <DiagnosisContainer
                            id={appointmentId}
                            patientId={data?.patient_id!}
                            doctorId={data?.doctor_id!}
                        />

                        <VitalSigns
                            id={id}
                            patientId={data?.patient_id!}
                            doctorId={data?.doctor_id!}
                        />

                        <MedicalHistoryContainer id={id!} patientId={data?.patient_id!} />

                    </>
                )}


               {/*{cat === "charts" && <ChartContainer id={data?.patient_id!} />} */}
               {cat === "appointments" && (
                    <>
                        {/*<AppointmentDetails 
                            id={data?.id!}
                            patient_id={data?.patient_id!}
                            appointment_date={data?.appointment_date!}
                            time={data?.time!}
                            notes={data?.note!}
                        /> */}

                        <VitalSigns
                            id={id}
                            patientId={data?.patient_id!}
                            doctorId={data?.doctor_id!}
                        />
                    </>
               )} 
               {cat === "diagnosis" && (
                    <DiagnosisContainer
                        id={appointmentId}
                        patientId={data?.patient_id!}
                        doctorId={data?.doctor_id!}
                    />
                )}
               {cat === "medical-history" && (
                    <MedicalHistoryContainer id={id!} patientId={data?.patient_id!} />
               )}
            </div>
            {/* RIGHT */}
            <div className='flex-1 space-y-6'>
                <AppointmentQuickLinks staffId={data?.doctor_id as string} />
                <PatientDetailsCard data={data?.patient!} />
            </div>
        </div>
    )
}

export default AppointmentDetailsPage 