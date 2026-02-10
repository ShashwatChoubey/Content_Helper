import { PageLayout } from "~/components/client/page-layout";
import { HistoryList } from "~/components/client/sound-effects/history-list";
import { SoundEffectsGenerator } from "~/components/client/sound-effects/sound-effects-generator";
import { getHistoryItems } from "~/lib/history";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function SoundEffectHistoryPage() {
    const session = await auth();
    const userId = session?.user.id;





    const SoundEffectsTabs = [
        {
            name: "Generate",
            path: "/app/speech-synthesis/sound-effects/generate"
        }, {

            name: "History",
            path: "/app/speech-synthesis/sound-effects/history"

        }
    ]

    const service = "make-an-audio"

    const historyItems = await getHistoryItems(service)




    return (
        <PageLayout
            title={"Make Music"}
            showSidebar={false}
            tabs={SoundEffectsTabs}
            service={service}

        >
            <HistoryList historyItems={historyItems} />

        </PageLayout>
    );
}