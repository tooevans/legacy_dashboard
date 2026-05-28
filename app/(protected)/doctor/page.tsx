import { AvailableDoctors } from '@/components/available-doctor'
import { AppointmentChart } from '@/components/charts/appointment-chart'
import { StatSummary } from '@/components/charts/stat-summary'
import { StatCard } from '@/components/stat-card'
import { RecentAppointments } from '@/components/tables/recent-appointment'
import { Button } from '@/components/ui/button'
import { getDoctorDashboardStats } from '@/utils/services/doctor'
import { currentUser } from '@clerk/nextjs/server'
import { BriefcaseBusinessIcon, BriefcaseMedical, User, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaBriefcaseMedical } from 'react-icons/fa6'

const DoctorDashboard = async () => {

  const user = await currentUser()

  const {
    totalPatient,
    totalNurses,
    totalAppointment,
    appointmentCounts,
    availableDoctors,
    monthlyData,
    last5Records,
  } =  await getDoctorDashboardStats()

  const cardData = [
    {
      title: "Patients",
      value: totalPatient,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total Patients",
      link: "/record/patients",
    },
    {
      title: "Nurses",
      value: totalNurses,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Total Nurses",
      link: "",
    },
    {
      title: "Appointments",
      value: totalAppointment,
      icon: BriefcaseBusinessIcon,
      className: "bg-teal-600/15",
      iconClassName: "bg-teal-600/25 text-teal-600",
      note: "Total Appointments",
      link: "/record/appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total Consultation",
      link: "/record/appointments",
    },
  ]

  return (
    <div className='rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6'>
      {/* LEFT */}
      <div className='w-full xl:w-[69%]'>
        <div className='bg-white rounded-xl p-4 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h1>Welcome, Dr. {user?.firstName}</h1>
            <Button size="sm" variant="outline" asChild >
              <Link href={`/record/doctors/${user?.id}`} >View Profile</Link>
            </Button>
          </div>

          <div className='w-full flex gap-2'>
            {cardData?.map((i, index) => (
              <StatCard
                key={index}
                title={i?.title}
                value={i?.value!}
                icon={i?.icon}
                className={i?.className}
                iconClassName={i?.iconClassName}
                note={i?.note}
                link={i?.link}
              />
            ))}
          </div>
        </div>

        <div className='h-125'>
          <AppointmentChart data={monthlyData!} />
        </div>

        <div>
          <RecentAppointments data={last5Records!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className='w-full xl:w-[30%]'>
        <div className='w-full h-112.5 mb-8'>
          <StatSummary data={appointmentCounts} total={totalAppointment!} />
        </div>

        <AvailableDoctors data={availableDoctors as any} />
      </div>
    </div>
  )
}

export default DoctorDashboard