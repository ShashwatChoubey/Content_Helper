"use server"

import { env } from "~/env"
import { db } from "~/server/db"
import { type ServiceType } from "~/type/services"
import { auth } from "~/server/auth"
import { includes, success } from "zod/v4"
import { duration } from "node_modules/zod/v4/classic/iso.cjs"
import { de } from "zod/v4/locales"

type ConvertVoiceResult = {
    success: true,
    audioUrl: string,
    s3Key: string,
    audioId: string,
    sourceDuration: number,
    sampleRate: number,
    targetVoice: string,
    remainingCredits?: number

} | {
    success: false,
    error: string
}

type GenerateAudioResult = {
    success: true,
    audioUrl: string,
    s3Key: string,
    audioId: string,
    duration: number,
    sampleRate: number,
    remainingCredits?: number
} | {
    success: false
    error: string
}

type GenerateSpeechResult = {
    success: true,
    audioUrl: string,
    s3key: string,
    remainingCredits?: number
} | {
    success: false,
    error: string
}

export async function deductCredits(amount: number = 200):
    Promise<{ success: boolean, error?: string, remainingCredits?: number }> {
    try {
        const session = await auth()

        if (!session?.user.id) {
            return { success: false, error: "Not authenticated" }
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        if (user.credits < amount) {
            return {
                success: false,
                error: "Insufficient credits"
            }
        }

        const updateUser = await db.user.update({
            where: { id: session.user.id },
            data: {
                credits: {
                    decrement: amount
                }
            },
            select: { credits: true }
        })

        console.log(` Deducted ${amount} credits. Remaining: ${updateUser.credits}`);

        return {
            success: true,
            remainingCredits: updateUser.credits
        }
    }
    catch (error) {
        console.error("Error deducting credits:", error);
        return { success: false, error: "Failed to deduct credits" };


    }
}



export async function transcribeAudio(formData: FormData) {
    try {
        const audioFile = formData.get("audio") as File

        if (!audioFile) {
            return { success: false, error: "No audio file" }
        }

        const arrayBuffer = await audioFile.arrayBuffer()
        const blob = new Blob([arrayBuffer], { type: audioFile.type })

        const apiFormData = new FormData()
        apiFormData.append("audio", blob, audioFile.name)

        const creditResult = await deductCredits(200)

        if (!creditResult.success) {
            return {
                success: false,
                error: creditResult.error || "Failed to deduct credits"
            }
        }

        const response = await fetch(`${env.WHISPER_API_ROUTE}/transcribe`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.BACKEND_API_KEY}`
            },
            body: apiFormData
        })

        if (!response.ok) {
            const errorText = await response.text()

            try {
                const errorData = JSON.parse(errorText)
                return {
                    success: false,
                    error: errorData.detail || `API error: ${response.status}`
                }
            }
            catch {
                return {
                    success: false,
                    error: `API error: ${response.status} - ${errorText}`
                }
            }
        }
        const data = await response.json()

        return {
            success: true,
            text: data.text || "No transcription availabe",
            language: data.language,
            duration: data.duration
        }
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to transcribe audio"

        }
    }

}


export async function generateAudio(prompt: string, duration: number = 8.0):
    Promise<GenerateAudioResult> {
    try {

        if (!prompt || prompt.trim().length === 0) {
            return { success: false, error: "No prompt" }
        }

        if (duration > 30) {
            return { success: false, error: "Maxmium duration is 30 seconds" }
        }

        const creditResult = await deductCredits(200)

        if (!creditResult.success) {
            return {
                success: false,
                error: creditResult.error || "Failed to deduct credits"
            }
        }

        const response = await fetch(`${env.MAKE_AN_AUDIO_API_ROUTE}/generate`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.BACKEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt,
                duration: duration,
                gudiance_scale: 3.0,
                temperature: 1.0
            })
        })

        if (!response.ok) {
            const errorText = await response.text()

            try {
                const errorData = JSON.parse(errorText)
                const errorMessage = errorData.detail || `API error: ${response.status}`
                return { success: false, error: errorMessage }
            }
            catch {
                {
                    return {
                        success: false,
                        error: `API error: ${response.status} - ${errorText}`
                    }
                }
            }


        }
        const data = await response.json()

        if (!data.audio_url) {
            return {
                success: false,
                error: "No audioURL received"
            }
        }

        await saveAudioToHistory({
            text: prompt,
            s3Key: data.s3_key,
            service: "make-an-audio"
        });

        return {
            success: true,
            audioUrl: data.audio_url,
            s3Key: data.s3_key,
            audioId: data.audioId,
            duration: data.duration,
            sampleRate: data.sampleRate

        }

    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate audio"
        }
    }
}


export async function generateSpeech(text: string, voice: string):
    Promise<GenerateSpeechResult> {
    try {

        if (!text || text.trim().length === 0) {
            return {
                success: false,
                error: "No text provied"

            }
        }

        if (text.length > 2000) {
            return { success: false, error: "Text length exceeds 2000" }
        }

        const validVoices = ["angry", "narrator", "women"]
        if (!validVoices.includes(voice)) {
            return {
                success: false,
                error: `Invaild voice`

            }
        }

        const creditResult = await deductCredits(200);

        if (!creditResult.success) {
            return {
                success: false,
                error: creditResult.error || "Failed to deduct credits"
            }
        }

        const response = await fetch(`${env.STYLETTS2_API_ROUTE}/generate`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.BACKEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                target_voice: voice
            })
        })

        if (!response.ok) {
            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            })

            const errorText = await response.text()

            try {
                const errorData = JSON.parse(errorText)
                return { success: false, error: errorData.detail || `API error: ${response.status}` }


            }
            catch {
                return { success: false, error: `API error: ${response.status} - ${errorText.substring(0, 200)}` }


            }
        }




        const data = await response.json()

        if (!data.audio_url) {
            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            })
            return {
                success: false,
                error: "No audioURL received"
            }
        }

        await saveAudioToHistory({
            text: text,
            voice: voice,
            s3Key: data.s3_key,
            service: "styletts2"
        })

        return {
            success: true,
            audioUrl: data.audio_url,
            s3key: data.s3_key
        }
    }
    catch (error) {
        try {
            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            })
        }
        catch { }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate speech"
        }
    }
}

export async function convertVoice(
    sourceAudioFile: File,
    targetVoice: string
): Promise<ConvertVoiceResult> {
    try {

        if (sourceAudioFile.size > 10 * 1024 * 1024) {
            return {
                success: false,
                error: "File too large"
            }
        }

        const allowedTypes = ["audio/mp3", "audio/wav", "audio/mpeg"]

        if (!allowedTypes.includes(sourceAudioFile.type)) {
            return { success: false, error: "Invalid file type. Only MP3 and WAV files are supported" }
        }

        const validVoices = ["angry", "narrator", "women"];
        if (!validVoices.includes(targetVoice)) {
            return {
                success: false,
                error: "Invalid voice"
            };
        }

        const creditResult = await deductCredits(200);

        if (!creditResult.success) {
            return {
                success: false,
                error: creditResult.error || "Failed to deduct credits"
            };
        }

        const formData = new FormData();
        formData.append("source_audio", sourceAudioFile);
        formData.append("target_voice", targetVoice);

        const response = await fetch(`${env.SEED_VC_API_ROUTE}/convert`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.BACKEND_API_KEY}`

            },
            body: formData
        });
        if (!response.ok) {

            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            });

            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText)
                return { success: false, error: errorData.detail || `API error: ${response.status}` }
            }
            catch {
                return {
                    success: false,
                    error: `API error: ${response.status} - ${errorText}`
                };
            }

        }
        const data = await response.json();
        if (!data.audio_url) {

            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            });
            return { success: false, error: "No audio URL received from server" };
        }

        await saveAudioToHistory({
            text: `Voice conversion to ${targetVoice}`,
            voice: targetVoice,
            s3Key: data.s3_key,
            service: "seedvc"
        });

        return {
            success: true,
            audioUrl: data.audio_url,
            s3Key: data.s3_key,
            audioId: data.audio_id,
            sourceDuration: data.source_duration,
            sampleRate: data.sample_rate,
            targetVoice: data.target_voice,

        };


    }
    catch (error) {
        try {
            await db.user.update({
                where: { id: (await auth())?.user.id },
                data: { credits: { increment: 200 } }
            })
        }
        catch { }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to convert voice"
        }
    }
}

export async function saveAudioToHistory(data: {
    text: string,
    voice?: string | null,
    s3Key: string,
    service: ServiceType
}) {
    try {

        const session = await auth()

        if (!session?.user.id) {
            return { success: false, error: "Not authenticated" }
        }
        await db.generatedAudioClip.create({
            data: {
                userId: session.user.id,
                text: data.text,
                voice: data.voice || null,
                s3Key: data.s3Key,
                service: data.service,
                createdAt: new Date()
            }
        })
        return { success: true }
    }
    catch (error) {
        return { success: false, error: "Failed to save to history" }
    }
}