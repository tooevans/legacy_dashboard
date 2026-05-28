
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function Home() {

    const { userId } = await auth();
    const role = await getRole();

    if (userId && role) {
        redirect(`/${role}`);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen p-6">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-center">
                        Welcome to <br />
                        <span className="text-blue-600 text-5xl md:text-6xl">Legacy HMS</span>
                    </h1>
                </div>

                <div className="text-center max-w-xl flex flex-col items-center justify-center">
                    <p className="mb-8">
                        Your personal healthcare partner, making you take control over your health, 
                        creating memories of loved ones.
                    </p>

                    <div className="flex gap-4">

                        {userId ? (
                            <>
                                <Link href={`/${role}`}>
                                    <Button> Dashboard</Button>
                                </Link>
                                <UserButton />
                            </>
                        ) : (
                            <>
                                <Link href="/sign-up">
                                    <Button className="med:text-base font-light">
                                        New Patient
                                    </Button>
                                </Link>

                                <Link href="/sign-in">
                                    <Button variant="outline" className="md:text-base outline hover text-blue-500">
                                        Login to account
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <footer className="mt-8">
                <p className="text-center text-sm">
                    &copy; 2026 Legacy Hospital Patient System. All rights reserved.
                </p>
            </footer>
        </div>
    )
}