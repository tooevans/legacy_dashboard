"use client"

import { DoctorSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Field } from '../ui/field'
import { CustomInput, SwitchInput } from '../custom-input'
import { SPECIALIZATION } from '@/utils/settings'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { createNewDoctor } from '@/app/actions/admin'

const TYPES =[
    { label: "Full-Time", value: "FULL" },
    { label: "Part-Time", value: "PART" },
]

const WORKING_DAYS = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
]

type Day = {
    day: string
    start_time?: string
    close_time?: string
}

export const DoctorForm = () => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [workingSchedule, setWorkingSchedule] = useState<Day[]>([])

    const form = useForm<z.infer<typeof DoctorSchema>>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            specialization: "",
            address: "",
            type: "FULL",
            department: "",
            img: "",
            password: "",
            license_number: "",
        },
    })

    const handleSubmit:  SubmitHandler<z.infer<typeof DoctorSchema>> = async (values) => {
        try {
            if (workingSchedule.length === 0) {
                toast.error("Please select work schedule")
                return
            }

            setIsLoading(true)
            const resp = await createNewDoctor({
                ...values,
                work_schedule: workingSchedule,
            })

            if (resp.success) {
                toast.success("Doctor added successfully")

                setWorkingSchedule([])
                form.reset()
                router.refresh()
            } else if (resp.error) {
                toast.error(resp.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const selectedSpecialization = form.watch("specialization")

    useEffect(() => {
        if (selectedSpecialization) {
            const department = SPECIALIZATION.find((i) => i.value === selectedSpecialization)

            if (department) {
                form.setValue("department", department.department)
            }
        }
    }, [selectedSpecialization])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Plus size={20} />
                    Add Doctor
                </Button>
            </SheetTrigger>

            <SheetContent className='rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll'>
                <SheetHeader>
                    <SheetTitle>Add New Doctor</SheetTitle>
                </SheetHeader>

                <div>
                    <Field {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-8 mt-10 2xl:mt-10'
                        >
                            <CustomInput 
                                type='radio' 
                                control={form.control} 
                                name={'type'} 
                                selectList={TYPES}
                                label='Type'
                                placeholder=''
                                defaultValue='FULL'
                            />

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='name'
                                label='Full Name'
                                placeholder="Doctor's name"
                            />

                            <div className='flex items-center gap-2'>
                                <CustomInput 
                                    type='select' 
                                    control={form.control} 
                                    name='specialization'
                                    label='Specialization'
                                    placeholder='Select Specialization'
                                    selectList={SPECIALIZATION}
                                />
                                <CustomInput 
                                    type='input' 
                                    control={form.control} 
                                    name='department'
                                    label='Department'
                                    placeholder='OPD'
                                />
                            </div>

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='license_number'
                                label='License Number'
                                placeholder='License Number'
                            />

                            <div className='flex items-center gap-2'>
                                <CustomInput 
                                    type='input' 
                                    control={form.control} 
                                    name='email'
                                    label='Email address'
                                    placeholder='Email address'
                                />

                                <CustomInput 
                                    type='input' 
                                    control={form.control} 
                                    name='phone'
                                    label='Phone number'
                                    placeholder='Phone number'
                                />
                            </div>

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='address'
                                label='Hospital'
                                placeholder='Hospital'
                            />

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='password'
                                label='Password'
                                placeholder=''
                                inputType='password'
                            />

                            <div className='mt-6'>
                                <Label>Working Days</Label>

                                <SwitchInput 
                                    data={WORKING_DAYS!} 
                                    setWorkingSchedule={setWorkingSchedule} 
                                />
                            </div>
                            
                            <Button type='submit' disabled={isLoading} className='w-full'>
                                Submit
                            </Button>
                        </form>
                    </Field>
                </div>
            </SheetContent>
        </Sheet>
    )
}
