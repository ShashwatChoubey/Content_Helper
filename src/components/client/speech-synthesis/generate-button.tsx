"use client"

import { FiDownload } from "react-icons/fi";



export function GenerateButton({ onGenerate, isDisabled, isLoading, showDownload, creditsRemaning, characterCount, characterLimit, buttonText = "Generate Audio", classname, fullWidth, showCredits, showCharacterCount }: {
    onGenerate: () => void,
    isDisabled?: boolean,
    isLoading?: boolean,
    showDownload?: boolean
    creditsRemaning: number,
    characterCount?: number,
    characterLimit?: number,
    buttonText?: string,
    classname?: string,
    fullWidth?: boolean,
    showCredits?: boolean,
    showCharacterCount?: boolean
}) {
    return (
        <div
            className={`flex w-full flex-col items-center gap-4 md:flex-row md:justify-between ${classname}`}
        >
            <div className={`flex items-center gap-3 ${fullWidth ? "w-full" : "w-full md:w-fit"}`}>
                {showDownload && (
                    <button className="hidden min-h-9 min-w-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 lg:flex" type="button" disabled={true}>
                        <FiDownload className="h-4 w-5" />
                    </button>
                )}
                <button className={`h-9 w-full whitespace-nowrap rounded-lg bg-black px-3 text-sm font-medium text-white ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-800"}`}
                    onClick={onGenerate}
                    disabled={isDisabled || isLoading}
                >
                    {isLoading ? <div className="flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="ml-2">{buttonText}</span>
                    </div> : (buttonText)}
                </button>
            </div>

            {(showCredits || (showCharacterCount && characterCount !== undefined)) && (
                <div className="flex w-full flex-wrap items-center justify-between gap-2 md:justify-end">
                    {showCredits && (
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500">
                                {creditsRemaning.toLocaleString()} credits remaining
                            </span>
                        </div>
                    )}
                    {showCharacterCount && characterCount !== undefined && characterLimit !== undefined && <p className="text-xs text-gray-500">
                        <span>{characterCount}</span> / <span>{characterLimit}</span>
                        <span className="ml-1 hidden sm:inline-block">characters</span>
                    </p>}
                </div>
            )}
        </div>
    );
}