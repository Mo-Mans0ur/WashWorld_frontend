import Link from "next/link";
import {
  formatOpenHoursDisplay,
  locationShortName,
} from "@/lib/locationGeo";

type LocationPopupCardProps = {
  locationId: string;
  name: string;
  address: string;
  openHours: string;
  distanceLabel: string;
};

/** Samme markup og CSS-klasser som kort-popup'en i Map.tsx */
export default function LocationPopupCard({
  locationId,
  name,
  address,
  openHours,
  distanceLabel,
}: LocationPopupCardProps) {
  return (
    <div className="washworld-popup-card">
      <h4 className="washworld-popup-title">
        {locationShortName(name)} •{" "}
        <span className="washworld-popup-distance">{distanceLabel}</span>
      </h4>
      <p className="washworld-popup-address">{address}</p>
      <div className="washworld-popup-footer">
        <p className="washworld-popup-hours">
          <span className="washworld-popup-hours-accent">Åben</span>{" "}
          {formatOpenHoursDisplay(openHours)}
        </p>
        <Link
          href={`/details?id=${encodeURIComponent(locationId)}`}
          className="washworld-popup-more"
        >
          Se mere
        </Link>
      </div>
    </div>
  );
}
