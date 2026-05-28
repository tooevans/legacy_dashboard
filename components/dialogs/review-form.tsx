"use client"

import { ReviewSchema } from '@/lib/schema'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus, StarIcon } from 'lucide-react'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '../ui/field'
import { Control, FormControl } from '@radix-ui/react-form'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { createReview } from '@/app/actions/general'

export type ReviewFormValues = z.infer<typeof ReviewSchema>

export const ReviewForm = ({ staffId } : { staffId: string }) => {

    const router = useRouter()
    const user = useAuth()

    const [loading, setLoading] = useState(false)

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            patient_id: user?.userId as string,
            staff_id: staffId,
            rating: 1,
            comment: "",
        }
    })

    const handleSubmit = async (values: ReviewFormValues) => {
        try {
            setLoading(true)
            const response = await createReview(values)

            if (response.success) {
                toast.success(response.message)
                router.refresh()
            } else {
                toast.error(response.message)
            }

        } catch (error) {
            toast.error("Failed to create review")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        size={"sm"}
                        className='px-4 py-2 rounded-lg bg-black/10 text-black hover:bg-transparent font-light'
                    >
                        <Plus /> Add review
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Review</DialogTitle>
                        <DialogDescription>
                            Fill in the fields below
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form 
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-6'
                        >
                            <Field>
                                <Controller 
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FieldSet>
                                            <FieldLabel>Rating</FieldLabel>
                                            
                                            <div className='flex items-center space-x-3'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => field.onChange(star)}
                                                    >
                                                        <StarIcon
                                                            size={30}
                                                            className={cn(
                                                                star <= field.value
                                                                    ? "text-yellow-500 fill-yellow-500"
                                                                    : "text-gray-500"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            <FieldDescription>
                                                Please rate your experience
                                            </FieldDescription>  

                                            
                                        </FieldSet>
                                    )}
                                />

                                <Controller 
                                    control={form.control}
                                    name='comment'
                                    render={({ field }) => (
                                        <FieldSet>
                                            <FieldLabel>Comment</FieldLabel>

                                            <Textarea
                                                placeholder='Write your review here...'
                                                className='resize-none'
                                                {...field}
                                            />

                                            <FieldDescription>
                                                Please write a detailed review of your experience to enhance your healthcare.
                                            </FieldDescription>
                                        </FieldSet>
                                    )}
                                />

                                <Button className='w-full' type='submit' disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                            </Field>
                        </form>
                    </FieldGroup>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}
