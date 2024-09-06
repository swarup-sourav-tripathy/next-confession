"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from 'next-auth'
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
    const { data: session } = useSession()
    const { setTheme } = useTheme()

    const user: User = session?.user as User

    return (
        <nav className="p-4 md:p-6 bg-gray-900 flex text-white shadow-md">
           
            <div className="container mx-auto flex flex-col md:flex-row justify-start items-start md:justify-between md:items-center">
                <a className="text-xl font-bold  mb-4 md:mb-0" href="#">Anonymous Message</a>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                            <Button className="relative left-72  md:left-auto  w-30 bg-white text-black md:w-auto" onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href={'/sign-in'}>
                            <Button className="w-full  bg-white text-black md:w-auto">Login</Button>
                        </Link>
                    )
                }
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mb-5 " size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] text-black rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

           
        </nav>
    )

}

export default NavBar;