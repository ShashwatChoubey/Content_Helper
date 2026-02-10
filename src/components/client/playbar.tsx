"use client"


import { useEffect } from "react"
import { IoPause, IoPlay } from "react-icons/io5"
import { LuChevronDown, LuClock, LuDownload } from "react-icons/lu"
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb"
import { useAudioStore } from "~/stores/audio-store"
import { useVoiceStore } from "~/stores/voice-store"
import { audioManager } from "~/utils/audio-manager"


export default function Playbar() {

    const { currentAudio, isPlaying, isPlaybarOpen, progress, duration, setCurrentAudio, setIsPlaying, setIsPlaybarOpen, setProgress, setDuration, playAudio, togglePlayPause, togglePlaybar, skipForward, skipBackward,
        downloadAudio } = useAudioStore()

    const getVoices = useVoiceStore((state) => state.getVoices)

    const styleTTS2Voices = getVoices("styletts2")
    const seedVCVoices = getVoices("seedvc")
    const allVoices = [...styleTTS2Voices, ...seedVCVoices]
    const voice = allVoices.find(v => v.id === currentAudio?.voice)

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)

        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const getCurrentTimeFormatted = () => {
        return formatTime(audioManager.getCurrentTime())
    }

    useEffect(() => {
        if (!currentAudio) return;

        const audio = audioManager.initialize()
        if (!audio) return

        const handleTimeUpdate = () => {
            const currentProgress = audioManager.getProgess()
            setProgress(currentProgress)
        }

        const handleLoadedMetadata = () => {
            const durationTime = audioManager.getDuration()
            const formattedDuration = formatTime(durationTime)
            setDuration(formattedDuration)
        }

        const handleEnded = () => {
            setIsPlaying(false)
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("ended", handleEnded)


        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [currentAudio, setDuration, setIsPlaying, setProgress])





    return <>{!isPlaybarOpen &&
        (<div onClick={togglePlaybar} className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 transform cursor-pointer">
            <div className="flex h-1 w-96 items-center rounded-full bg-gray-300">
                <div className="h-1 rounded-full bg-black" style={{ width: `${progress === 0 ? 100 : progress}%` }}></div>

            </div>

        </div>)}


        <div className={`relative border-t border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out`}
            style={{
                height: isPlaybarOpen ? "80px" : "8px",
            }}>
            <div className="absolute left-0 top-0 h-0.5 w-full bg-gray-200 md:hidden">
                <div className="absolute h-0.5 bg-black" style={{ width: `${progress}%` }}>

                </div>
            </div>

            <div className="hidden h-full md:grid md:grid-cols-[25%_50%_25%]">
                <div className="flex items-center px-4">
                    <div className="flex flex-col gap-1">
                        <p className="max-w-xs truncate text-sm">{currentAudio?.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            {voice && (
                                <div className="flex items-center gap-1">
                                    <div className="h-3 w-3 rounded-full" style={{ background: voice.gradientColors }}></div>
                                    <span>{voice.name}</span>
                                </div>
                            )}
                            <span>·</span>
                            <div className="flex items-center gap-1">
                                <LuClock className="h-3 w-3" />
                                <span>{currentAudio?.createdAt || "Just now"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-3">
                        <button onClick={skipBackward} className="rounded-full p-2 hover:bg-gray-100">
                            <TbRewindBackward10 className="h-5 w-5" />
                        </button>
                        <button onClick={togglePlayPause} className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                            {isPlaying ? (<IoPause className="h-5 w-5" />) : (<IoPlay className="h-5 w-5" />)}
                        </button>
                        <button onClick={skipForward} className="rounded-full p-2 hover:bg-gray-100">
                            <TbRewindForward10 className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex w-full max-w-md items-center gap-2">
                        <span className="min-w-8 text-xs text-gray-400">
                            {getCurrentTimeFormatted()}
                        </span>
                        <div className="relative h-1 flex-1 rounded-full bg-gray-200">
                            <div className="h1 rounded-full bg-gray-200">
                                <div className="absolute h-1 rounded-full bg-black" style={{ width: `${progress}%` }} /></div>
                        </div>
                        <span className="min-w-8 text-xs text-gray-400">{duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-6">
                    <button onClick={downloadAudio} className="rounded-full p-1.5 hover:bg-gray-100">
                        <LuDownload className="h-5 w-5" />
                    </button>
                    <button onClick={togglePlaybar} className="rounded-full p-1.5 hover:bg-gray-100">
                        <LuChevronDown className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex h-full md:hidden">
                    <div className="flex flex-1 items-center px-4">
                        <div className="flex w-full flex-col gap-1">
                            <p className="truncate text-sm">{currentAudio?.title}</p>

                            <div className="flex items-center text-xs text-gray-400">
                                {voice && (
                                    <>
                                        <div className="flex items-center">
                                            <div
                                                className="mr-1 flex h-3 w-3 items-center justify-center rounded-full text-white"
                                                style={{ background: voice.gradientColors }}
                                            />
                                            <span>{voice.name}</span>
                                            <span className="mx-1">·</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center">
                                    <LuClock className="mr-1 h-3 w-3" />
                                    <span>{currentAudio?.createdAt || "Just now"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-4">
                        <button
                            onClick={downloadAudio}
                            className="rounded-full p-1.5 hover:bg-gray-100"
                        >
                            <LuDownload className="h-5 w-5" />
                        </button>
                        <button
                            onClick={togglePlayPause}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
                        >
                            {isPlaying ? (
                                <IoPause className="h-5 w-5" />
                            ) : (
                                <IoPlay className="ml-0.5 h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </>
}