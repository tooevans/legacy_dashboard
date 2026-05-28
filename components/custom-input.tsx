import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface InputProps {
    type: "input" | "select" | "checkbox" | "switch" | "radio" | "textarea";
    control: any;
    name: string;
    label?: string;
    placeholder?: string;
    inputType?: "text" | "email" | "password" | "date";
    selectList?: { label: string; value: string}[];
    defaultValue?: string;
}

const RenderInput = ({ field, props} : { field: any; props: InputProps}) => {
    switch (props.type) {
        case 'input':
            return (
                <Field>
                    <Input 
                        type={props.inputType}
                        placeholder={props.placeholder}
                        {...field}
                    />
                </Field>
            )
        case 'select':
            return (
                <Select onValueChange={field.onChange} value={field?.value}>
                    <Field>
                        <SelectTrigger>
                            <SelectValue placeholder={props.placeholder} />
                        </SelectTrigger>
                    </Field>
                    <SelectContent>
                        {props.selectList?.map((i, id) => (
                            <SelectItem key={id} value={i.value}>
                                {i.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'checkbox':
            return (
                <div className='items-top flex space-x-2'>
                    <Checkbox
                        id={props.name}
                        onCheckedChange={(e) => field.onChange(e === true || null)}
                    />
                    <div className='grid gap-1.5 leading-none'>
                        <label 
                            htmlFor={props.name}
                            className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-0.5'
                        >
                            {props.label}
                        </label>
                        <p className='text-sm text-muted-foreground'>{props.placeholder}</p>
                    </div>
                </div>
            )
        case 'switch':
        case 'radio':
            return (
                <div className='w-full'>
                    <FieldLabel>{props.label}</FieldLabel>
                    <RadioGroup
                        defaultValue={props.defaultValue}
                        onChange={field.onChange}
                        className='flex gap-4'
                    >
                        {props?.selectList?.map((i, id) => (
                            <div className='flex items-center w-full' key={id}>
                                <RadioGroupItem
                                    value={i.value}
                                    id={i.value}
                                    className='peer sr-only'
                                 />
                                 <Label
                                    htmlFor={i.value}
                                    className='flex flex-1 items-center justify-center rounded-md border-2 bg-popover 
                                    w-full md:w-12.5 md:h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-transparent'
                                 >
                                    {i.label}
                                 </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )
        case 'textarea':
            return (
                <Field>
                    
                    <Textarea
                        type={props.inputType}
                        placeholder={props.placeholder}
                        {...field}
                    ></Textarea>
                </Field>
            )
    }
}

export const CustomInput = (props: InputProps) => {

    const { name, label, control, type } = props;
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => 
                <FieldContent className='w-full'>
                    {type !== "radio" && type !== "checkbox" && (
                        <FieldLabel>{label}</FieldLabel>
                    )}
                    <RenderInput field={field} props={props} />
                    <FieldDescription />
                </FieldContent>}
        />
    )
}

type Day = {
    day: string
    start_time?: string
    close_time?: string
}

interface SwitchProps {
    data: { label: string; value: string }[]
    setWorkingSchedule: React.Dispatch<React.SetStateAction<Day[]>>
}

export const SwitchInput = ({data, setWorkingSchedule} : SwitchProps) => {
    const handleChange = (day: string, field:any, value: string) => {
        setWorkingSchedule((prevDays) => {
            const dayExist = prevDays.find((d) => d.day === day)

            if (dayExist) {
                return prevDays.map((d)=> d.day === day ? {...d, [field]: value} : d)
            } else {
                if (field === true) {
                    return [...prevDays, {day, start_time: "09:00", close_time: "17:00"}]
                } else {
                    return [...prevDays, {day, [field]: value}]
                }
            }
        })
    }

    return (
        <div className=''>
            {data?.map((i, id) => (
                <div 
                    key={id}
                    className='w-full flex items-center space-y-3 border-t border-t-gray-200 py-3'
                >
                    <Switch 
                        id={i.value}
                        className='data-[state=checked]:bg-blue0699 peer'
                        onCheckedChange={e=> handleChange(i.value, true, "09:00")}

                    />
                    <Label htmlFor={i.value} className='w-20 capitalize'>
                        {i.value}
                    </Label>

                    <Label className='tex-gray-400 font-normal italic peer-data-[state=checked]:hidden pl-10'>
                        Not working on this day
                    </Label>

                    <div className='hidden peer-data-[state=checked]:flex items-center gap-2 pl-6'>
                        <Input
                            name={`${i.label}.start_time`}
                            type='time'
                            defaultValue={"09:00"}
                            onChange={(e)=> handleChange(i.value, "start_time", e.target.value)} 
                        />
                        <Input
                            name={`${i.label}.close_time`}
                            type='time'
                            defaultValue={"18:00"}
                            onChange={(e)=> handleChange(i.value, "close_time", e.target.value)} 
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
