"use client"

import type { ServiceType } from "~/type/services";
import { use, useState } from "react";

import { HiOutlineBookOpen, HiOutlineFaceSmile, HiOutlineSpeakerWave, HiOutlineGlobeAlt, HiOutlineVideoCamera, HiOutlinePuzzlePiece, HiOutlineMicrophone, HiOutlineSparkles } from 'react-icons/hi2';
import { GenerateButton } from "./generate-button";
import { useVoiceStore } from "~/stores/voice-store";
import { useAudioStore } from "~/stores/audio-store";
import { generateKey } from "crypto";
import { generateSpeech } from "./action";

export function TextToSpeechEditor({
    service, credits
}: {
    service: ServiceType,
    credits: number
}) {

    const [textContent, setTextContent] = useState("")
    const [activePlaceholder, setActivePlaceholder] = useState("Start typing here or paste any text you want to convert to humanlike audio")
    const [loading, setLoading] = useState(false)
    const [currentAudioId, setCurrentAudioId] = useState<string | null>(null)

    const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice)
    const selectedVoice = getSelectedVoice("styletts2")





    const templateTexts = {
        "Tell a bedtime story":
            "A little dragon who was afraid of fire finally learned that being different was actually his greatest strength.",
        "Make someone laugh":
            "My dog used to chase people on bikes. It got so bad, I had to take his bike away.",
        "Pitch a product":
            "Get FreshStart coffee maker. Hot coffee in 30 seconds. Because mornings are hard enough already.",
        "Test different accents":
            "Hey there! Bonjour! Hola amigo! Practice speaking like a local, wherever you go.",
        "Practice voice acting":
            "The detective leaned back in his chair. 'So you're telling me the butler did it... with a candlestick?'",
        "Be a game narrator":
            "Level up! You've collected all the gems. Now face the final boss in the volcano arena.",
        "Start a podcast":
            "Welcome to Tech Talk Daily, where we break down the gadgets and apps that actually matter to you.",
        "Guide relaxation":
            "Take a deep breath in. Hold it for three. Now let it all go. Feel your shoulders drop.",
    };
    const handleButtonHover = (text: string) => {
        setActivePlaceholder(templateTexts[text as keyof typeof templateTexts])

    }
    const handleButtonClick = (text: string) => {
        setTextContent(templateTexts[text as keyof typeof templateTexts])

    }
    const handleGenerateSpeech = async () => {
        const selectedVoice = getSelectedVoice("styletts2")

        if (textContent.trim().length === 0 || !selectedVoice) {
            console.log("⚠️ Missing text or voice")
            return;
        }

        if (textContent.length > 1000) {
            alert("Text is too long. Maximum 1000 characters allowed.")
            return;
        }



        try {
            setLoading(true)

            const result = await generateSpeech(textContent, selectedVoice.id)


            if (!result.success) {

                alert(`Error: ${result.error}`);
                setLoading(false);
                return;
            }


            const { playAudio } = useAudioStore.getState();
            playAudio({
                id: result.s3key || crypto.randomUUID(),
                title: textContent.substring(0, 50) + (textContent.length > 50 ? "..." : ""),
                voice: selectedVoice.name,
                audioUrl: result.audioUrl,
                service: "styletts2"
            });

            setLoading(false)

        }
        catch (error) {

            alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
            setLoading(false)
        }
    }

    return <>
        <textarea value={textContent}
            placeholder={activePlaceholder}
            onChange={(e) => setTextContent(e.target.value)}
            disabled={loading}
            className="w-full grow resize-none rounded-lg bg-white placeholder:font-light placeholder:text-gray-500 focus:border-none focus:ring-0"


        />
        <div className="mt-4 px-0 md:px-4">
            {textContent.length === 0 ? (
                <div className="mt-auto">
                    <p className="mb-2 text-sm text-gray-500">
                        Try these prompt to get started
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {[
                            { text: "Tell a bedtime story", icon: <HiOutlineBookOpen /> },
                            { text: "Make someone laugh", icon: <HiOutlineFaceSmile /> },
                            { text: "Pitch a product", icon: <HiOutlineSpeakerWave /> },
                            { text: "Test different accents", icon: <HiOutlineGlobeAlt /> },
                            { text: "Practice voice acting", icon: <HiOutlineVideoCamera /> },
                            { text: "Be a game narrator", icon: <HiOutlinePuzzlePiece /> },
                            { text: "Start a podcast", icon: <HiOutlineMicrophone /> },
                            { text: "Guide relaxation", icon: <HiOutlineSparkles /> },
                        ].map(({ text, icon }) => (
                            <button
                                key={text}
                                className="flex items-center rounded-lg border border-gray-200 bg-white p-2 text-xs hover:bg-gray-50"
                                onMouseEnter={() => handleButtonHover(text)}
                                onMouseLeave={() =>
                                    setActivePlaceholder(
                                        "Start typing here or paste any text you want to convert to humanlike audio"
                                    )
                                }
                                onClick={() => handleButtonClick(text)}
                            >
                                <span className="mr-2 text-gray-500">{icon}</span>
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (<GenerateButton onGenerate={handleGenerateSpeech}
                isDisabled={textContent.length > 1000 || textContent.trim().length === 0 || loading}
                isLoading={loading}
                showDownload={true}
                creditsRemaning={credits}
                characterCount={textContent.length}
                characterLimit={1000}
                showCredits={true}
                showCharacterCount={true}


            />)}



        </div>




    </>
}