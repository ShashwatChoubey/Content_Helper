"use client"

import { useState, type ReactNode, useRef, useEffect } from "react"
import Link from "next/link"

import { IoPersonOutline, IoPinOutline } from "react-icons/io5"
import { LuWand } from "react-icons/lu"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname()
    const [isPinned, setIsPinned] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showAccountMenu, setshowAccountMenu] = useState(false)
    const accountMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)
            ) {
                setshowAccountMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.addEventListener("mousedown", handleClickOutside)
        }
    })



    const isExpanded = isMobile || isPinned || isHovered
    const handleSignOut = () => {
        signOut()
        setshowAccountMenu(false)

    }

    function SectionHeader({ children, isExpanded }: { children: ReactNode, isExpanded: boolean }) {
        return (
            <div className="mb-2 mt-4 h-6 pl-4">
                <span className={`text text-black font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>{children}</span>
            </div>
        )


    }

    function SidebarButton({ icon, children, isExpanded, isActive, href }: { icon: ReactNode, children: ReactNode, isExpanded: boolean, isActive: boolean, href: string }) {

        return <Link href={href} className={`flex w-full items-center rounded-lg px-2.5 py-2 text-sm transition-colors ${isActive ? "bg-gray-100 font-medium" : "text-gray-700 hover:bg-gray-100"}`}>

            <div className="flex w-5 h-5 flex-shrink:0 items-center justify-center">{icon}</div>
            <div className={`ml-3 overflow-hidden transition-all duration-300  ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
                style={{ whiteSpace: "nowrap" }}>
                {children}
            </div>
        </Link>
    }




    return <div className={`${isExpanded ? "w-64" : "w-16"} flex h-full flex-col border-r border-gray-200 bg-white px-3 py-4 transition-all duration-300 `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
        <div className="flex items-center justify-between">
            <h1 className={`text-xl font-bold ${!isExpanded && "hidden"}`}>ContentHelper</h1>
            {!isMobile && (<button onClick={() => setIsPinned(!isPinned)} className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100 " title={isPinned ? "Unpin sidebar" : "Pin sidebar"}>

                <div className={`flex h-8 w-8 items-center justify-start transition-all  ${isPinned ? "rounded-lg bg-gray-200" : "text-gray-500"}`}>
                    {isExpanded ? (<IoPinOutline className="h5 w-5" />) : (<div className="flex h-fit w-fit items-center justify-start rounded-lg bg-white px-3 py-2 shadow">
                        <span className="text-md  font-bold text-black">CH</span> </div>)}

                </div>

            </button>)}



        </div>
        <nav className="mt-8 flex flex-1 flex-col">
            <SectionHeader isExpanded={isExpanded}>Playground</SectionHeader>
            <SidebarButton icon={<LuWand />}
                isExpanded={isExpanded}
                isActive={pathname.includes("/app/speech-synthesis/text-to-speech")}
                href="/app/speech-synthesis/text-to-speech">
                Text to Speech
            </SidebarButton>
            <SidebarButton icon={<LuWand />}
                isExpanded={isExpanded}
                isActive={pathname.includes("/app/speech-synthesis/voice-to-voice")}
                href="/app/speech-synthesis/voice-to-voice">
                Voice to Voice
            </SidebarButton>
            <SidebarButton icon={<LuWand />}
                isExpanded={isExpanded}
                isActive={pathname.includes("/app/speech-synthesis/sound-effects")}
                href="/app/speech-synthesis/sound-effects/generate">
                Make Music
            </SidebarButton>
            <SidebarButton icon={<LuWand />}
                isExpanded={isExpanded}
                isActive={pathname.includes("/app/speech-synthesis/speech-to-text")}
                href="/app/speech-synthesis/speech-to-text">
                Speech To Text
            </SidebarButton>


        </nav>


        <div className="relative mt-auto" ref={accountMenuRef}>
            <button onClick={() => setshowAccountMenu(!showAccountMenu)} className="flex w-full items-center rounded-lg px-2.5 py-2 text-small" >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center"
                ><IoPersonOutline /></div>
                <div className={`ml-3 overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`} style={{ whiteSpace: "nowrap" }}>My Account</div>
            </button>

            {showAccountMenu && (<div className="absolute bottom-12 left-0 z-10 min-w-45 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleSignOut}>
                    Sign Out</button>
            </div>)}
        </div>

    </div>


}

