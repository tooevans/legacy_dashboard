import { createRouteMatcher } from "@clerk/nextjs/server";

type RouteAccessProps = {
    [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
    "/admin(.*)": ["admin", "patient"],
    "/patient(.*)": ["admin", "patient", "nurse", "doctor"],
    "/doctor(.*)": ["admin", "doctor"],
    "/staff(.*)": ["admin", "lab_tchnician", "pharmacist",  "nurse", "doctor"],
    "/record/users" : ["admin", "doctor", "patient", "users"],
    "/record/users(.*)" : ["admin", "doctor", "patient", "users"],
    "/record/doctors" : ["admin", "doctor"],
    "/record/doctors(.*)" : ["admin", "doctor"],
    "/record/staff" : ["admin", "doctor"],
    "/record/patients" : ["admin", "doctor", "nurse"],
    "/patient/registration" : ["patient", "admin", "users"],

};

export const routeMatchers = {
    admin: createRouteMatcher([
        "/admin(.*)",
        "/patient(.*)",
        "/doctors(.*)",
        "/record/users",
        "record/users(.*)",
        "/record/doctors(.*)",
        "/record/patients",
        "/record/doctors(.*)",
        "/record/staff(.*)",
        "/record/patients(.*)",
    ]),
    patient: createRouteMatcher([
        "/patient(.*)",
        "/patient/registration",
        "/record/doctors(.*)",
    ]),
    doctor: createRouteMatcher([
        "/patient(.*)",
        "/doctor(.*)",
        "/record/doctors(.*)",
        "/record/patients",
        "/record/staff",
        "/record/patients(.*)",
    ]),
    users: createRouteMatcher([
        "/record/users",
        "/record/users(.*)",
    ])
};

