"use client"
import type { ServiceType } from "~/type/services";
import { useAudioStore } from "~/stores/audio-store"
import { useVoiceStore } from "~/stores/voice-store"
import { useState } from "react"
import { LuUpload } from "react-icons/lu";
import { GenerateButton } from "./generate-button";
import { convertVoice } from "./action";



const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/wav"] // Fixed typo: "auido" -> "audio"

export function VoiceChanger({ credits, service }: { credits: number, service: ServiceType }) {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { playAudio } = useAudioStore()
    const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice)
    const selectedVoice = getSelectedVoice(service)

    const handleFileSelect = (selectedFile: File) => {
        const isAllowedAudio = ALLOWED_AUDIO_TYPES.includes(selectedFile.type)
        const isUnder50MB = selectedFile.size <= 10 * 1024 * 1024

        if (isAllowedAudio && isUnder50MB) {
            setFile(selectedFile)
        } else {
            alert(isAllowedAudio ?
                "File is too large. Max size is 10MB" : // Fixed: was 50MB in message but 10MB in code
                "Please select an MP3 or WAV file only")
        }
    }



    const handleGenerateSpeech = async () => {
        if (!file || !selectedVoice) {
            console.log("⚠️ Missing file or voice");
            return;
        }

        console.log("🎯 Starting voice conversion...");

        try {
            setIsLoading(true);

            const result = await convertVoice(file, selectedVoice.id);

            console.log("📦 Result:", result);

            if (!result.success) {
                console.error("❌ Voice conversion failed:", result.error);
                alert(`Error: ${result.error}`);
                setIsLoading(false);
                return;
            }

            console.log("✅ Conversion successful!");
            console.log("🎵 Audio URL:", result.audioUrl);

            // Play the converted audio
            playAudio({
                id: result.audioId,
                title: `Voice conversion to ${selectedVoice.name}`,
                voice: selectedVoice.name,
                audioUrl: result.audioUrl,
                duration: `${result.sourceDuration.toFixed(1)}s`,
                service: "seedvc"
            });

            setIsLoading(false);

            // Optionally clear the file after successful conversion
            // setFile(null);
        } catch (error) {
            console.error("💥 Error converting voice:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            setIsLoading(false);
        }
    };


    return <>
        <div className="flex flex-1 flex-col justify-between px-4">
            <div className="flex flex-1 items-center justify-center py-8">
                <div
                    className={`w-full max-w-xl rounded-2xl border-2 border-dotted p-8 transition-all duration-200 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"} ${file ? "bg-white" : "bg-gray-50"}`}
                    onDragOver={(e) => {
                        e.preventDefault() // Added: Required to allow drop
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault() // Added: Prevent default behavior
                        setIsDragging(false)
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const file = e.dataTransfer.files[0]
                            if (file) {
                                handleFileSelect(file)
                            }
                        }
                    }}
                    onClick={() => {
                        if (isLoading) return

                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "audio/mp3,audio/wav"
                        input.onchange = (e) => {
                            const target = e.target as HTMLInputElement
                            if (target.files && target.files.length > 0) {
                                const file = target.files[0]
                                if (file) {
                                    handleFileSelect(file)
                                }
                            }
                        }
                        input.click() // Fixed: Moved outside onchange handler
                    }}
                >
                    {file ? (
                        <div className="flex flex-col items-center text-center"> {/* Fixed typo: "test-center" -> "text-center" */}
                            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3"> {/* Fixed typo: "rounded-g" -> "rounded-lg" */}
                                <LuUpload className="h-4 w-4 text-blue-400" />
                            </div>
                            <p className="mb-1 text-sm font-medium">{file.name}</p>
                            <p className="mb-1 text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (!isLoading) {
                                        setFile(null)
                                    }
                                }}
                                disabled={isLoading}
                                className={`mt-2 text-sm ${isLoading ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                            >
                                Choose a different file
                            </button>
                        </div>
                    ) : (
                        <div className="flex cursor-pointer flex-col items-center py-8 text-center">
                            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                                <LuUpload className="h-4 w-4 text-gray-500" />
                            </div>
                            <p className="mb-1 text-sm font-medium">Click to upload, or drag and drop</p>
                            <p className="text-sm text-gray-500">MP3 or WAV (Max 10MB)</p>
                        </div>
                    )}
                </div>
            </div>

            <GenerateButton
                onGenerate={handleGenerateSpeech}
                isDisabled={!file || isLoading}
                isLoading={isLoading}
                showDownload={true}
                creditsRemaning={credits}
                buttonText="Convert Audio"
            />
        </div>
    </>
}