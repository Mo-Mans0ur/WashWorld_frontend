// BetalingPage – side til valg og tilføjelse af betalingsmetoder.
// Siden er endnu ikke implementeret fuldt ud – indholdsområdet er reserveret til betalingskort-komponenter.
import AppHeader from "@/components/AppHeader";
import ScreenLayout from "@/components/ScreenLayout";
import PageInfo from "@/components/PageInfo";


export default function Betaling() {
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <AppHeader />
            <ScreenLayout >
                <PageInfo text="Betalingsmetoder" userName="" />
                <section className="px-6 pt-10">
                    <h2 className="mb-5 text-2xl font-bold text-white">Vælg betalingsmetoder</h2>
                    <div className="space-y-3">
                    
                    </div>
                </section>
            </ScreenLayout>
        </div>

    )
}