"use client"

import type { NullSchema } from "node_modules/zod/v4/core/json-schema.cjs";
import type { HistoryItem } from "~/lib/history";
import { useVoiceStore } from "~/stores/voice-store";
import type { ServiceType } from "~/type/services";
import type { Voice } from "~/stores/voice-store";
import { IoPlayCircle, IoDownloadOutline } from "react-icons/io5"
import { useAudioStore } from "~/stores/audio-store";


export function HistoryPanel({ service, searchQuery, setSearchQuery, hoveredItem, setHoveredItem, historyItems }: {
    service: ServiceType,
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    hoveredItem: string | null
    setHoveredItem: (id: string | null) => void
    historyItems?: HistoryItem[]
}) {

    const { playAudio, downloadAudio } = useAudioStore()

    const getVoices = useVoiceStore((state) => state.getVoices)
    const voices = getVoices(service)


    function HistoryItems({ item, voices, hoveredItem, setHoveredItem, onPlay }: {
        item: HistoryItem,
        voices: Voice[],
        hoveredItem: string | null,
        setHoveredItem: (id: string | null) => void,
        onPlay: (item: HistoryItem) => void

    }) {
        const voiceUsed = voices.find((voice) => voice.id === item.voice) || voices[0]!

        return (
            <div
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex flex-col justify-center rounded-lg p-4 hover:bg-gray-100 transition-colors h-20"
            >
                {/* Top Row: Title */}
                <div className="flex min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                        {item.title || "No title"}
                    </p>
                </div>

                {/* Bottom Row: Metadata */}
                <div className="mt-1 flex items-center space-x-1">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: voiceUsed.gradientColors }}
                    ></div>
                    <span className="text-xs text-gray-500">{voiceUsed.name}</span>
                    <span className="text-xs font-light text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{item.time || "now"}</span>
                </div>

                {/* Hover Actions: Positioned absolutely to the right */}
                {hoveredItem === item.id && (
                    <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-gray-800 to-black text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                            <IoPlayCircle onClick={() => onPlay(item)} className="h-5 w-5" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                            <IoDownloadOutline onClick={downloadAudio} className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

        )



    }

    const handlePlayHistoryItem = (item: HistoryItem) => {
        if (item.audioUrl) {
            playAudio({
                id: item.id.toString(),
                title: item.title,
                voice: item.voice,
                audioUrl: item.audioUrl,
                service: item.service,



            })

        }
    }

    return <div className="flex h-full w-full flex-col">
        <div className="w-full shrink-0">
            <div className="relative">
                <input type="text" placeholder="Search history ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-b-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />

            </div>

        </div>
        {historyItems && historyItems.length > 0 ? (
            <div className="mt-2 flex h-screen w-full flex-col overflow-y-auto">
                {(() => {
                    // 1. Filter items by search query
                    const filteredItems = historyItems.filter((item) => {
                        const titleMatch = item.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())

                        const voiceName =
                            voices.find((voice) => voice.id === item.voice)?.name ?? ""

                        const voiceMatch = voiceName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())

                        return titleMatch || voiceMatch
                    })

                    // 2. Group by date
                    const groupedItems = filteredItems.reduce(
                        (groups: Record<string, HistoryItem[]>, item) => {
                            const date = item.date
                            if (!groups[date]) {
                                groups[date] = []
                            }
                            groups[date].push(item)
                            return groups
                        },
                        {}
                    )

                    const entries = Object.entries(groupedItems)

                    // 3. Render result
                    return entries.length > 0 ? (
                        entries.map(([date, items]) => (
                            <div key={date}>
                                <div className="sticky top-0 z-10 my-2 flex w-full justify-center bg-white py-1">
                                    <div className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                        {date}
                                    </div>
                                </div>

                                {items.map((item) => (
                                    <HistoryItems key={item.id} item={item} voices={voices}
                                        hoveredItem={hoveredItem}
                                        setHoveredItem={setHoveredItem}
                                        onPlay={handlePlayHistoryItem} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="mt-8 text-center text-sm text-gray-500">
                            No results found
                        </p>
                    )
                })()}
            </div>
        ) : <div className="justify-center flex h-full flex-col items-center text-center"><p className="mt-3 text-sm text-gray-500">No History Yet</p></div>}




    </div>

}


