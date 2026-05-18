import Map from '@/components/Map'
import { Suspense } from "react";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Indlæser kort…</div>}>
      <Map />
    </Suspense>
  );
}