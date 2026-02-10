"use client"

import { useState } from "react"
import { LuUpload } from "react-icons/lu"
import { GenerateButton } from "./generate-button"
import { transcribeAudio } from "./action"


const ALLOWED_AUDIO_TYPES = [
    "audio/mp3",
    "audio/wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
    "audio/webm"
]

export function SpeechToText({ credits }: { credits: number }) {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [convertedText, setConvertedText] = useState("")
    const [error, setError] = useState("")

    const handleFileSelect = (selectedFile: File) => {
        const isAllowedAudio = ALLOWED_AUDIO_TYPES.includes(selectedFile.type)
        const isUnder10MB = selectedFile.size <= 10 * 1024 * 1024

        if (isAllowedAudio && isUnder10MB) {
            setFile(selectedFile)
            setError("")
        } else {
            const errorMessage = !isAllowedAudio
                ? "Please select a valid audio file (MP3, WAV, M4A, WEBM)"
                : "File is too large. Max size is 10MB"
            setError(errorMessage)
            alert(errorMessage)
        }
    }

    const handleGenerateSpeech = async () => {
        if (!file) return

        setIsLoading(true)
        setError("")
        setConvertedText("")

        try {

            const formData = new FormData()
            formData.append("audio", file)


            const result = await transcribeAudio(formData)

            if (result.success) {
                setConvertedText(result.text || "No transcription available")
            } else {
                throw new Error(result.error || "Failed to transcribe audio")
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to transcribe audio"
            setError(errorMessage)
            console.error("Transcription error:", err)
            alert(`Error: ${errorMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col justify-between px-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
                {/* File Upload Area */}
                <div
                    className={`w-full max-w-xl rounded-2xl border-2 border-dotted p-8 transition-all duration-200 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                        } ${file ? "bg-white" : "bg-gray-50"}`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
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
                        input.accept = "audio/mp3,audio/wav,audio/mpeg,audio/mp4,audio/m4a,audio/webm"
                        input.onchange = (e) => {
                            const target = e.target as HTMLInputElement
                            if (target.files && target.files.length > 0) {
                                const file = target.files[0]
                                if (file) {
                                    handleFileSelect(file)
                                }
                            }
                        }
                        input.click()
                    }}
                >
                    {file ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                                <LuUpload className="h-4 w-4 text-blue-400" />
                            </div>
                            <p className="mb-1 text-sm font-medium">{file.name}</p>
                            <p className="mb-1 text-xs text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (!isLoading) {
                                        setFile(null)
                                        setConvertedText("")
                                        setError("")
                                    }
                                }}
                                disabled={isLoading}
                                className={`mt-2 text-sm ${isLoading
                                    ? "cursor-not-allowed text-gray-400"
                                    : "text-blue-600 hover:text-blue-800"
                                    }`}
                            >
                                Choose a different file
                            </button>
                        </div>
                    ) : (
                        <div className="flex cursor-pointer flex-col items-center py-8 text-center">
                            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                                <LuUpload className="h-4 w-4 text-gray-500" />
                            </div>
                            <p className="mb-1 text-sm font-medium">
                                Click to upload, or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                MP3, WAV, M4A, WEBM (Max 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Text Display Area */}
                <div className="w-full max-w-xl rounded-2xl border-2 border-dotted border-gray-300 bg-gray-50 p-8">
                    <div className={`text-sm ${convertedText ? "text-gray-900" : "text-gray-500"} ${error ? "text-red-600" : ""}`}>
                        {isLoading ? (
                            <div className="text-center">
                                <p className="animate-pulse">Transcribing audio...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center">
                                <p>Error: {error}</p>
                            </div>
                        ) : convertedText ? (
                            <div className="whitespace-pre-wrap text-left">
                                {convertedText}
                            </div>
                        ) : (
                            <div className="text-center">
                                Upload audio to generate text
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <GenerateButton
                onGenerate={handleGenerateSpeech}
                isDisabled={!file || isLoading}
                isLoading={isLoading}
                showDownload={false}
                creditsRemaning={credits}
                buttonText="Convert to Text"
            />
        </div>
    )
}