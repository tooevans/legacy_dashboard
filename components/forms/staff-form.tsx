"use client"

import { DoctorSchema, StaffSchema } from '@/lib/schema'
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
import { createNewDoctor, createNewStaff } from '@/app/actions/admin'

const TYPES =[
    { label: "Nurse", value: "NURSE" },
    { label: "Lab Technician", value: "LABORATORY" },
    { label: "Pharmacist", value: "PHARMACIST" },
]


export const StaffForm = () => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof StaffSchema>>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "NURSE",
            address: "",
            type: "FULL",
            department: '',
            img: "",
            password: "",
            license_number: "",
        },
    })

    const  handleSubmit  = async (values: z.infer<typeof StaffSchema>) => {
        try {

            setIsLoading(true)
            const resp = await createNewStaff(values)

            if (resp.success) {
                toast.success("Staff added successfully")

                form.reset()
                router.refresh()
            } else if (resp.error) {
                toast.error(resp.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Plus size={20} />
                    Add Staff
                </Button>
            </SheetTrigger>

            <SheetContent className='rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll'>
                <SheetHeader>
                    <SheetTitle>Add New Staff</SheetTitle>
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
                                name="role"
                                selectList={TYPES}
                                label='Type'
                                placeholder=''
                                defaultValue='NURSE'
                            />

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='name'
                                label='Full Name'
                                placeholder="Staff name"
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
                                name='license_number'
                                label='License Number'
                                placeholder='License Number'
                            />

                            <CustomInput 
                                type='input' 
                                control={form.control} 
                                name='department'
                                label='Department'
                                placeholder='Paediatrics'
                            />                         

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
