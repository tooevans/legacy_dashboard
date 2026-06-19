import { getRole } from '@/utils/roles'
import { Hospital, ListOrdered, Logs, LucideIcon, SquareActivity, SquareActivityIcon } from 'lucide-react'
import React from 'react'
import { FaBell, FaHeartPulse, FaLetterboxd, FaList, FaUser, FaUserDoctor } from 'react-icons/fa6'
import { FaCog, FaFile, FaFileAlt, FaHome, FaLock, FaMedkit, FaSignOutAlt, FaUserAlt } from 'react-icons/fa'
import Link from 'next/link'
import { LogoutButton } from './logout-button'

const ACCESS_LEVEL_ALL = [
  "admin",
  "doctor",
  "nurse",
  "lab-technician",
  "patient",
  "pharmacist",
  "users"
];

const SidebarIcon = ({ Icon } : { Icon: LucideIcon }) => {
  return <Icon className='size-6 lg:size-5' />
} 

export const Sidebar = async() => {

  const role = await getRole()

  const MENU = [
    {
      title: "Menu",
        items: [
            {
                icon: <FaHome />,
                label: "Home",
                href: "/",
                visible: ACCESS_LEVEL_ALL,
            },
            {
                icon: <FaUser />,
                label: "Users",
                href: "/record/users",
                visible: ["admin", "doctor", "patient", "users"],
            },
            {
                icon: <FaUserDoctor />,
                label: "Doctors",
                href: "/record/doctors",
                visible: ["admin", "doctor", "patient"],
            },
            {
                icon: <FaUserAlt />,
                label: "Patients",
                href: "/record/patients",
                visible: ["admin", "doctor", "patient"],
            },
            {
                icon: <FaUserAlt />,
                label: "Staff",
                href: "/record/staff",
                visible: ["admin", "doctor", "staff"],
            },
            {
                icon: <FaFileAlt />,
                label: "Records",
                href: '/record/medical-records',
                visible: ["admin", "doctor", "patient"],
            },
            {
                icon: <FaList />,
                label: "Appointment",
                href: '/record/appointments',
                visible: ["admin", "doctor", "patient", "nurse"],
            },
            /*{
                icon: <FaFlask />,
                label: "Labs",
                href: "/"
            },
            {
                icon: <FaFile />,
                label: "Diagnosis",
                href: "/"
            },*/
            /*{
                icon: <FaMedkit />,
                label: "Prescription",
                href: "/prescription",
                visible: ["admin", "doctor", "patient"],
            },*/
        ],
    },
    {
        title: "System",
        items: [
            {
                icon: <FaUser />,
                label: "Profile",
                href: "/patient/self",
                visible: ["patient"],
            },
            /*{
                icon: <FaBell />,
                label: "Notifications",
                href: "/notifications",
                visible: ACCESS_LEVEL_ALL,
            },
            {
                icon: <FaCog />,
                label: "Settings",
                href: "/admin/system-settings",
                visible: ["admin"],
            },
            {
                icon: <FaLock />,
                label: "Audit Logs",
                href: "/admin/audit-logs",
                visible: ["admin"],
            },
            {
                icon: <FaSignOutAlt />,
                label: "Logout",
                href: "",
                visible: ACCESS_LEVEL_ALL,
            },*/
        ]
 
    }
  ];



  return (
    <div className='w-full p-4 flex flex-col justify-between gap-4 bg-white overflow-y-scroll min-h-full'>
      <div>
        <div className='flex items-center justify-center lg:justify-start gap-2'>
          <div className='p-1.5 rounded-md bg-blue-600 text-white'>
            <Hospital size={22} />
          </div>

          <Link
            href={"/"}
            className='hidden lg:flex text-base 2xl:text-xl font-bold'
          >
            Legacy
          </Link>
        </div>

        <div className='mt-4 text-sm'>
          {MENU.map((i) => (
            <div className='flex flex-col gap-2' key={i.title}>
                <span className='hidden lg:block text-gray-600 font-light my-4'>{i.title}</span>

                {i.items.map(item=>{
                    if (item.visible?.includes(role.toLowerCase())) {
                      return (
                        <Link 
                          href={item.href} 
                          key={item.label}
                          className='flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-blue-400'
                        >
                          <span>{item.icon}</span>
                          <span className='hidden lg:block'>{item.label}</span>
                    </Link>
                      )
                    }
                })}
            </div>
          ))}
        </div>
        <LogoutButton />
      </div>

      
    </div>
  )
}

