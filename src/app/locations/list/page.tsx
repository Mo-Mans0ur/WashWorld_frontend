import LocationsList from "@/components/LocationsList";
import BottomNav from "@/components/BottomNav";

export default function Page() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <LocationsList />
      <BottomNav />
    </div>
  );
}
