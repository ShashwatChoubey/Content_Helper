import { PageLayout } from "~/components/client/page-layout"
import { SpeechToText } from "~/components/client/speech-synthesis/speech-to-text-editor"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function SpeechToTextPage() {
    const session = await auth()
    const userId = session?.user.id

    let credits = 0

    if (userId) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
            },
        })
        credits = user?.credits ?? 0
    }

    return (
        <PageLayout
            title="Speech To Text"
            service="whisper"
            showSidebar={false}
        >
            <SpeechToText credits={credits} />
        </PageLayout>
    )
}