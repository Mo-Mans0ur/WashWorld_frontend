import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
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
            <BottomNav />
        </div>

    )
}