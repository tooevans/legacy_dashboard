import { z }  from 'zod';

export const PatientFormSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(2, "First name must be more than 3 characters")
        .max(30, "First name cannot be more than 20 charcters"),
    last_name: z
        .string()
        .trim()
        .min(2, "Last name must be more than 3 characters")
        .max(30, "Last name cannot be more than 20 charcters"),
    date_of_birth: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE"], {message: "Gender is required"}),
    email: z.email("Invalid email address"),
    phone: z.string().min(7, "Phone number must be at least 7 digits"),
    address: z
        .string()
        .min(2, "Must be at least 2 characters.")
        .max(500, "Mut be maximum of 500 characters."),
    marital_status: z.enum(
        ["married", "single", "divorced", "separated"],
        { message: "Required."}
    ),
    allergies: z.string().optional(),
    medical_conditions: z.string().optional(),
    medical_history: z.string().optional(),
    privacy_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to the privacy policy.",
        }),
    service_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to terms of service."
        }),
    medical_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to medical treatment terms."
        }),
    img: z.string().optional(),

});


export const AppointmentSchema = z.object({
    doctor_id: z.string().min(1, "Select Doctor"),
    type: z.string().min(1, "Select type of appointment"),
    appointment_date: z.string().min(1, "Select appointment date"),
    time: z.string().min(1, "Select Time"),
    note: z.string().optional(),
})


export const DoctorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 3 characters")
        .max(50, "Maximum is 50 characters"),
    phone: z.string().min(7, "Enter phone number").max(15, "Enter phone number"),
    email: z.email("Invalid email address"),
    address: z
        .string()
        .min(5, "Must be at least 5 characters")
        .max(10, "Maximum of 10 characters"),
    specialization: z.string().min(2, "This field is required"),
    license_number: z.string().min(2, "License number is required"),
    type: z.enum(["FULL", "PART"], { message: "Required"}),
    department: z.string().min(2, "Department is required"),
    img: z.string().optional(),
    password: z
        .string()
        .min(4, { message: "Password shoule be at least 4 characters long" })
        .optional()
        .or(z.literal("")),
})


export const workingDaysSchema = z.object({
    day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]),
    start_time: z.string(),
    close_time: z.string(),
})


export const WorkingDaysSchema = z.array(workingDaysSchema).optional()


export const StaffSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 3 characters")
        .max(50, "Maximum is 50 characters"),
    phone: z.string().min(7, "Enter phone number").max(15, "Enter phone number"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["NURSE", "LAB_TECHNICIAN", "PHARMACIST"], { message: "Role is required" }),
    address: z
        .string()
        .min(5, "Must be at least 5 characters")
        .max(10, "Maximum of 10 characters"),
    license_number: z.string().min(2, "License number is required"),
    type: z.enum(["FULL", "PART"], { message: "Required"}),
    department: z.string().min(2, "Department is required"),
    img: z.string().optional(),
    password: z
        .string()
        .min(4, { message: "Password shoule be at least 4 characters long" })
        .optional()
        .or(z.literal("")),
})


export const ReviewSchema = z.object({
    patient_id: z.string(),
    staff_id: z.string(),
    rating: z.number().min(1).max(5),
    comment: z
        .string()
        .min(1, "Review must be at least 10 characters long")
        .max(1000),
})


export const VitalSignsSchema = z.object({
    patient_id: z.string(),
    medical_id: z.string(),

    systolic: z.coerce.number({
        message: "Enter recorded pressure",
    }),
    diastolic: z.coerce.number({
        message: "Enter recorded pressure",
    }),
    pulse: z.coerce.number({ message: "Enter recorded pulse rate"}),
    body_temperature: z.coerce.number({
        message: "Enter recorded temperature",
    }),

    sugars: z.coerce.number(),

    respiratory_rate: z.preprocess(
        (val) => val === "" ? undefined : Number(val),
        z.number().optional()
    ),
    oxygen_saturation: z.preprocess(
        (val) => val === "" ? undefined : Number(val),
        z.number().optional()
    ),
    weight: z.coerce.number({ message: "Enter Weight (kg)"}),
    height: z.coerce.number({ message: "Enter height (cm)"}),
})

export const DiagnosisSchema = z.object({
    patient_id: z.string(),
    medical_id: z.string(),
    doctor_id: z.string(),
    symptoms: z.string({ message: "Symptoms required" }),
    diagnosis: z.string({ message: "Diagnosis required" }),
    notes: z.string().optional(),
    prescription: z.string().optional(),
    follow_up_plan: z.string().optional(),
})