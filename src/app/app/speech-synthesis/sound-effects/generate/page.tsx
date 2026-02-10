import { PageLayout } from "~/components/client/page-layout";
import { SoundEffectsGenerator } from "~/components/client/sound-effects/sound-effects-generator";
import { getHistoryItems } from "~/lib/history";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function SoundEffectGeneratePage() {
    const session = await auth();
    const userId = session?.user.id;

    let credits = 0;

    if (userId) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                credits: true,
            },
        });
        credits = user?.credits ?? 0;
    }


    const SoundEffectsTabs = [
        {
            name: "Generate",
            path: "/app/speech-synthesis/sound-effects/generate"
        }, {

            name: "History",
            path: "/app/speech-synthesis/sound-effects/history"

        }
    ]



    return (
        <PageLayout
            title={"Make Music"}
            showSidebar={false}
            tabs={SoundEffectsTabs}
            service="make-an-audio"

        >
            <SoundEffectsGenerator credits={credits} />
        </PageLayout>
    );
}