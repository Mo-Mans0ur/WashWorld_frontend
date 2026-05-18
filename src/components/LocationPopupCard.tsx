import {
  formatOpenHoursDisplay,
  locationShortName,
} from "@/lib/locationGeo";

type LocationPopupCardProps = {
  name: string;
  address: string;
  openHours: string;
  distanceLabel: string;
};

/** Samme markup og CSS-klasser som kort-popup'en i Map.tsx */
export default function LocationPopupCard({
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
        <span className="washworld-popup-more">Se mere</span>
      </div>
    </div>
  );
}
