"use client";

import { Patient } from '@/lib/generated/prisma/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field } from './ui/field';
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatientFormSchema } from '@/lib/schema';
import { z } from 'zod';
import { CustomInput } from './custom-input';
import { GENDER, MARITAL_STATUS } from '@/lib';
import { Button } from './ui/button';
import { createNewPatient, updatePatient } from '@/app/actions/patient';
import { toast } from 'sonner';

interface DataProps {
    data?: Patient;
    type: "create" | "update";
}

export const NewPatient = ({ data, type } : DataProps) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [imgURL, setURL] = useState<any>();
    const router = useRouter();

    const userData = {
        first_name: user?.firstName || "",
        last_name: user?.lastName || "",
        email: user?.emailAddresses[0].emailAddress || "",
        phone: user?.phoneNumbers?.toString() || "",
    }

    const userId = user?.id

    const form = useForm<z.infer<typeof PatientFormSchema>> ({
        resolver: zodResolver(PatientFormSchema) as any,
        defaultValues: {
            ...userData,
            date_of_birth: new Date(),
            gender: "MALE",
            address: "",
            marital_status: "single",
            allergies: "",
            medical_conditions: "",
            medical_history: "",
        }
    })

    const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async(values) => {
        setLoading(true)
        
        const res = 
            type === "create" ? await createNewPatient(values, userId!) : await updatePatient(values, userId!)
        setLoading(false);

        if (res?.success) {
            toast.success(res.msg);
            form.reset();
            router.push("/patient");
        } else {
            console.log(res)
            toast.error("Failed to create Patient")
        }
    }

    useEffect(() => {
        if (type === "create") {
            userData && form.reset({ ...userData });
        } else if (type === "update") {
            data &&
                form.reset({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    date_of_birth: new Date(data.date_of_birth),
                    gender: data.gender,
                    marital_status: data.marital_status as 
                        | "married"
                        | "single"
                        | "divorced",
                    address: data.address,
                    allergies: data?.allergies! || "",
                    medical_conditions: data?.medical_conditions! || "",
                    medical_history: data?.medical_history! || "",
                    medical_consent: data.medical_consent,
                    privacy_consent: data.privacy_consent,
                    service_consent: data.service_consent,
                });
        }
    }, [user]);

    return (
        <Card className="max-w-6xl w-full p-4">
            <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
                <CardDescription>
                    Please provide all information below to help us better provide quality healthcare.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Field {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5'>
                        <h3 className='text-lg font-semibold'>Personal Information</h3>

                        <>
                            {/* <ImagePicker /> */}

                            <div className='flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4'>
                                <CustomInput
                                    type='input'
                                    control={form.control}
                                    name="first_name"
                                    placeholder="First Name"
                                    label="First Name"
                                />
                                <CustomInput
                                    type='input'
                                    control={form.control}
                                    name="last_name"
                                    placeholder="Last Name"
                                    label="Last Name"
                                />
                                
                            </div>
                            <CustomInput
                                type='input'
                                control={form.control}
                                name="email"
                                placeholder="email@example.com"
                                label="Email"
                            />

                            <div className='flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4'>
                                <CustomInput
                                    type='select'
                                    control={form.control}
                                    name="gender"
                                    placeholder="Select Gender"
                                    label="Gender"
                                    selectList={GENDER}
                                />
                                <CustomInput
                                    type='input'
                                    control={form.control}
                                    name="date_of_birth"
                                    placeholder="01-01-2026"
                                    label="Date of Birth"
                                    inputType='date'
                                />
                            </div>

                            <div className='flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4'>
                                <CustomInput
                                    type='input'
                                    control={form.control}
                                    name="phone"
                                    placeholder="Phone number"
                                    label="Phone Number"
                                />
                                <CustomInput
                                    type='select'
                                    control={form.control}
                                    name="marital_status"
                                    placeholder="Select Marital status"
                                    label="Marital status"
                                    selectList={MARITAL_STATUS}
                                />
                            </div>

                            <CustomInput
                                type='input'
                                control={form.control}
                                name="address"
                                placeholder="Address"
                                label="Address"
                            />
                        </>
                        <div className='space-y-8'>
                            <h3 className='text-lg font-semibold'>Medical Information</h3>

                            <CustomInput
                                type='input'
                                control={form.control}
                                name="allergies"
                                placeholder="Allergies"
                                label="Allergies"
                            />
                            <CustomInput
                                type='input'
                                control={form.control}
                                name="medical_conditions"
                                placeholder="Medical Conditions"
                                label="Medical conditions"
                            />
                            <CustomInput
                                type='input'
                                control={form.control}
                                name="medical_history"
                                placeholder="Medical History"
                                label="Medical History"
                            />

                        </div>

                        {type !== "update" && (
                            <div>
                                <h3 className='tex-lg font-semibold mb-2'>Consent</h3>

                                <div className='space-y-6'>
                                    <CustomInput
                                        type='checkbox'
                                        control={form.control}
                                        name="privacy_consent"
                                        placeholder="I consent to the collection, storage and use of my personal
                                        and health information as outlined in this policy. I understand that my 
                                        data will be used and my rights regarding access, corrections and deletion."
                                        label="Privacy Policy Agreement!"
                                    />
                                    <CustomInput
                                        type='checkbox'
                                        control={form.control}
                                        name="service_consent"
                                        placeholder="I agree to the Terms of Service, including any responsibilities
                                        as a user of the system, limitations of liability and dispute resolution process.
                                        I understand that usage of this service is contingent on my adherence to this terms."
                                        label="Terms of Service"
                                    />
                                    <CustomInput
                                        type='checkbox'
                                        control={form.control}
                                        name="medical_consent"
                                        placeholder="I provide informed consent to receive medical treatment and service
                                        through this system. I acknowledge that I have been informed of the nature, risks, 
                                        benefits and alternatives to proposed treatment and that I have the right to ask
                                        questions and receive further information."
                                        label="Informed Consent"
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            disabled={loading}
                            type='submit'
                            className='w-full md:w-fit px-6'
                        >
                            {type === "create" ? "Submit" : "Update"}
                        </Button>
                        
                    </form>
                </Field>
            </CardContent>
        </Card>
    )
}
