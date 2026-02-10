import type { ServiceType } from "~/type/services"
import { create } from "zustand"

const GRADIENT_COLORS = [
    // Calm violet → pink (default / neutral voice)
    "linear-gradient(45deg, #7c3aed, #ec4899, #ffffff, #6366f1)",

    // Blue → teal (clear / narration voice)
    "linear-gradient(45deg, #2563eb, #14b8a6, #ffffff, #22c55e)",

    // Rose → amber (expressive / emotional voice)
    "linear-gradient(45deg, #f43f5e, #fb923c, #ffffff, #eab308)",

    // Emerald → sky (smooth / soft voice)
    "linear-gradient(45deg, #10b981, #38bdf8, #ffffff, #0ea5e9)",

    // Indigo → purple (deep / professional voice)
    "linear-gradient(45deg, #4f46e5, #a855f7, #ffffff, #9333ea)",
];



export interface Voice {
    id: string,
    name: string,
    gradientColors: string,
    service: ServiceType
}

const voices: Voice[] = [
    {
        id: "angry",
        name: "Anger",
        gradientColors: GRADIENT_COLORS[0]!,
        service: "styletts2"
    },
    {
        id: "women",
        name: "Woman",
        gradientColors: GRADIENT_COLORS[1]!,
        service: "styletts2"
    },
    {
        id: "narrator",
        name: "Narrator",
        gradientColors: GRADIENT_COLORS[2]!,
        service: "styletts2"
    }, {
        id: "angry",
        name: "Anger",
        gradientColors: GRADIENT_COLORS[0]!,
        service: "seedvc"
    },
    {
        id: "women",
        name: "Woman",
        gradientColors: GRADIENT_COLORS[1]!,
        service: "seedvc"
    },
    {
        id: "narrator",
        name: "Narrator",
        gradientColors: GRADIENT_COLORS[2]!,
        service: "seedvc"
    }
]

const defaultStyleTTS2Voice = voices.find((v) => v.service === "styletts2") ?? null
const defaultSeedVcVoice = voices.find((v) => v.service === "seedvc") ?? null


interface VoiceState {
    voices: Voice[]

    selectedVoices: Record<ServiceType, Voice | null>

    getVoices: (service: ServiceType) => Voice[]

    getSelectedVoice: (service: ServiceType) => Voice | null

    selectVoice: (service: ServiceType, voiceId: string) => void
}


export const useVoiceStore = create<VoiceState>((set, get) => ({
    voices: voices,

    selectedVoices: {
        styletts2: defaultStyleTTS2Voice,
        seedvc: defaultSeedVcVoice,
        "make-an-audio": null,
        "whisper": null
    },

    getVoices: (service) => {
        return get().voices.filter((voice) => voice.service === service)
    },

    getSelectedVoice: (service) => {
        return get().selectedVoices[service]
    },

    selectVoice: (service, voiceId) => {
        const serviceVoices = get().voices.filter(
            (voice) => voice.service === service
        )

        const selectedVoice =
            serviceVoices.find((voice) => voice.id === voiceId) ||
            serviceVoices[0]

        set((state) => ({
            selectedVoices: {
                ...state.selectedVoices,
                [service]: selectedVoice,
            },
        }))
    },
}))




