"use client"

import { Doctor, Patient } from '@/lib/generated/prisma/client';
import { AppointmentSchema } from '@/lib/schema';
import { generateTimes } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { UserPen } from 'lucide-react';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import { ProfileImage } from '../profile-image';
import { CustomInput } from '../custom-input';
import { Control, FormField } from '@radix-ui/react-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { createNewAppointment } from '@/app/actions/appointment';

const TYPES = [
    { label: "Consultation", value: "Consultation" },
    { label: "Check up", value: "Check up" },
    { label: "Antenatal Clinic", value: "Antenatal" },
    { label: "Maternity", value: "Maternity" },
    { label: "Dental", value: "Dental" },
    { label: "Medication", value: "Medications" },
]

export const BookAppointment = ({data, doctors} : {data: Patient; doctors: Doctor[] }) => {

    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const [physicians, setPhysicians] = useState<Doctor[] | undefined>(doctors)

    const appointmentTimes = generateTimes(8, 17, 30)

    const patientName = `${data?.first_name} ${data?.last_name}`

    const form = useForm<z.infer<typeof AppointmentSchema>>({
        resolver: zodResolver(AppointmentSchema),
        defaultValues: {
            doctor_id: "",
            appointment_date: "",
            time: "",
            type: "",
            note: "",
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = async (
        values
    ) => {
        try {
            setIsSubmitting(true)
            const newData = {...values, patient_id: data?.id! }

            const res = await createNewAppointment(newData)

            if (res.success) {
                form.reset({})
                router.refresh()
                toast.success("Created successfully")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className='w-full flex items-center justify-start gap-2 text-sm font-light bg-blue-500 text-white'
                >
                    <UserPen size={16} /> Book Appointment
                </Button>
            </SheetTrigger>

            <SheetContent className='rounded-xl rounded-r-2xl md:h-p[95%] md:top-[2.5%] md:right-[1%] w-full'>
                {loading ? (
                    <div className='flex items-center justify-center h-full'>
                        <span>Loading</span>
                    </div>
                ) : (
                    <div className='h-full overflow-y-auto p-4'>
                        <SheetHeader>
                            <SheetTitle>Book appointment</SheetTitle>
                        </SheetHeader>

                        <Field {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5 2xl:mt-10'>
                                <div className='w-full rounded-md border border-input bg-background px-3 py-1 flex items-center gap-4'>
                                    <ProfileImage
                                        url={data?.img!}
                                        name={patientName}
                                        className='size-16 border border-input'
                                        bgColor={data?.colorCode!}
                                    />

                                    <div>
                                        <p className='font-semibold text-lg'>{patientName}</p>
                                        <span className='text-sm text-gray-700 capitalize'>{data?.gender}</span>
                                    </div>
                                </div>

                                <CustomInput
                                    type="select"
                                    selectList={TYPES}
                                    control={form.control}
                                    name="type"
                                    label="Appointment Type"
                                    placeholder='Select appointment type'
                                />

                                <FieldGroup>
                                    <Controller
                                        name="doctor_id"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Doctors</FieldLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isSubmitting}
                                                >
                                                    <Control>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a doctor" />
                                                        </SelectTrigger>
                                                    </Control>
                                                    <SelectContent className=''>
                                                        {physicians?.map((i, id) => (
                                                            <SelectItem key={id} value={i.id} className='p-2'>
                                                                <div className='flex flex-row gap-2 p-2'>
                                                                    <ProfileImage
                                                                        url={i?.img!}
                                                                        name={i?.name}
                                                                        bgColor={i?.colorCode!}
                                                                        textClassName='text-black'
                                                                    />
                                                                    <div>
                                                                        <p className='font-medium text-start'>
                                                                            {i.name}
                                                                        </p>
                                                                        <span className='text-sm text-gray-600'>
                                                                            {i?.specialization}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldDescription />
                                            </Field>
                                        )}
                                    />

                                    <div className='flex items-center gap-2'>
                                        <CustomInput
                                            type='input'
                                            control={form.control}
                                            name="appointment_date"
                                            placeholder=""
                                            label="Date"
                                            inputType='date'
                                        />
                                        <CustomInput
                                            type='select'
                                            control={form.control}
                                            name="time"
                                            placeholder="Select Time"
                                            label="Time"
                                            selectList={appointmentTimes}
                                        />
                                        
                                    </div>
                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name="note"
                                        placeholder="Additional notes"
                                        label="Note"
                                    />

                                    <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className='bg-blue-500 w-full'
                                    >
                                        Submit
                                    </Button>
                                </FieldGroup>
                            </form>
                        </Field>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
