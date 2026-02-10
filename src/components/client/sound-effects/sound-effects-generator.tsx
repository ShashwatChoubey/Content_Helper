"use client"

import { useState } from "react"
import { useAudioStore } from "~/stores/audio-store"
import { GenerateButton } from "../speech-synthesis/generate-button"
import {
    IoMusicalNotesOutline,
    IoThunderstormOutline,
    IoWaterOutline,
    IoCafeOutline,
    IoGameControllerOutline,
    IoRocketOutline,
    IoHeartOutline,
    IoStarOutline,
    IoFlameOutline,
    IoTrendingUpOutline
} from "react-icons/io5";

import {
    GiGuitar,
    GiDrumKit
} from "react-icons/gi";

import { generateAudio } from "../speech-synthesis/action";

const MAX_CHARS = 500

const musicPrompts = [
    {
        text: "Upbeat EDM",
        fullText: "Upbeat electronic dance music with heavy bass and energetic synths",
        icon: <IoMusicalNotesOutline />
    },
    {
        text: "Lo-fi Hip Hop",
        fullText: "Relaxing lo-fi hip hop beats with mellow piano and soft percussion",
        icon: <IoCafeOutline />
    },
    {
        text: "Epic Orchestral",
        fullText: "Epic cinematic orchestral music with powerful drums and strings",
        icon: <IoStarOutline />
    },
    {
        text: "Smooth Jazz",
        fullText: "Smooth jazz with saxophone melody and walking bass line",
        icon: <IoTrendingUpOutline />
    },
    {
        text: "Rock Music",
        fullText: "Energetic rock music with electric guitar riffs and driving drums",
        icon: <GiGuitar />
    },
    {
        text: "Ambient Space",
        fullText: "Ambient space music with ethereal pads and atmospheric sounds",
        icon: <IoRocketOutline />
    },
    {
        text: "8-bit Chiptune",
        fullText: "8-bit retro video game music with chiptune melodies",
        icon: <IoGameControllerOutline />
    },
    {
        text: "Piano Ballad",
        fullText: "Romantic piano ballad with emotional strings accompaniment",
        icon: <IoHeartOutline />
    },
    {
        text: "Heavy Metal",
        fullText: "Intense heavy metal with aggressive guitar and powerful drums",
        icon: <IoFlameOutline />
    },
    {
        text: "Tropical Reggae",
        fullText: "Tropical reggae with steel drums and laid-back rhythm",
        icon: <IoWaterOutline />
    },
    {
        text: "Drum & Bass",
        fullText: "Fast-paced drum and bass with breakbeats and deep bassline",
        icon: <GiDrumKit />
    },
    {
        text: "Dark Techno",
        fullText: "Dark atmospheric techno with industrial sounds and heavy bass",
        icon: <IoThunderstormOutline />
    }
];

export function SoundEffectsGenerator({ credits }: { credits: number }) {

    const [textContent, setTextContent] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [activePlaceholder, setActivePlaceholder] = useState(
        "Describe what kind of music you want to generate and then click generate..."
    )

    const [loading, setLoading] = useState(false)
    const { playAudio } = useAudioStore()

    const isTextEmpty = textContent.trim() === "";

    const handleGenerateSoundEffect = async () => {
        if (isTextEmpty) {
            console.log("⚠️ No prompt provided")
            return;
        }

        try {
            setLoading(true)

            const result = await generateAudio(textContent, 8.0)

            console.log("📦 Result:", result)

            if (!result.success) {
                console.error("❌ Audio generation failed:", result.error);
                alert(`Error: ${result.error}`);
                setLoading(false);
                return;
            }

            console.log("✅ Generation successful!")
            console.log("🎵 Audio URL:", result.audioUrl)

            // Play the generated audio
            playAudio({
                id: result.audioId,
                title: textContent.substring(0, 50) + (textContent.length > 50 ? "..." : ""),
                voice: null,
                audioUrl: result.audioUrl,
                duration: `${result.duration}s`,
                createdAt: new Date().toISOString(),
                service: "musicgen"
            })

            setLoading(false)

        }
        catch (error) {
            console.error("💥 Error generating audio:", error)
            alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
            setLoading(false)
        }
    }

    return (
        <>
            <style jsx>{`
                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>

            <div className="relative flex h-full w-full flex-col items-center px-4">
                {/* Animated Background */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform opacity-30">
                    <div
                        className="h-96 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 blur-3xl"
                        style={{ animation: "gradientMove 20s ease infinite", backgroundSize: "200% 200%" }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex h-full w-full flex-col items-center gap-6 py-8 md:pt-20">
                    {/* Input Box */}
                    <div className={`h-fit w-full max-w-2xl rounded-2xl border-2 bg-white/90 backdrop-blur-sm p-6 shadow-2xl transition-all duration-300 ${isFocused ? "border-purple-500 shadow-purple-200" : "border-gray-200"
                        }`}>
                        <div className="flex flex-col">
                            <textarea
                                value={textContent}
                                onChange={(e) => {
                                    const text = e.target.value
                                    if (text.length <= MAX_CHARS) {
                                        setTextContent(text)
                                    }
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                maxLength={MAX_CHARS}
                                placeholder={activePlaceholder}
                                className="h-24 resize-none rounded-lg border border-gray-200 p-3 text-sm placeholder:font-light placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            />

                            <div className="mt-2 flex w-full justify-end">
                                <span className="text-xs font-medium text-gray-400">
                                    {textContent.length}/{MAX_CHARS}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <GenerateButton
                                    onGenerate={handleGenerateSoundEffect}
                                    isDisabled={isTextEmpty || loading}
                                    isLoading={loading}
                                    buttonText="Generate Music"
                                    showDownload={false}
                                    fullWidth={false}
                                    creditsRemaning={credits}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Prompt Suggestions */}
                    <div className="h-fit w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-xl">
                        <p className="mb-4 text-center text-sm font-medium text-gray-600">
                            ✨ Try these prompts to generate music
                        </p>

                        <div className="flex flex-wrap justify-center gap-2">
                            {musicPrompts.map(({ text, fullText, icon }) => (
                                <button
                                    className="group flex items-center gap-2 rounded-full border border-gray-300 bg-gradient-to-r from-white to-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md active:scale-95"
                                    key={text}
                                    onMouseEnter={() => setActivePlaceholder(fullText)}
                                    onMouseLeave={() => setActivePlaceholder("Describe what kind of music you want to generate and then click generate...")}
                                    onClick={() => {
                                        if (fullText.length <= MAX_CHARS) {
                                            setTextContent(fullText);
                                        } else {
                                            setTextContent(fullText.substring(0, MAX_CHARS));
                                        }
                                    }}
                                >
                                    <span className="text-lg text-purple-600 transition-transform duration-200 group-hover:scale-110">
                                        {icon}
                                    </span>
                                    <span className="whitespace-nowrap">{text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}