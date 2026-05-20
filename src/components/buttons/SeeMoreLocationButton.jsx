export default function SeeMoreLocationButton({
  name,
  distance,
  address,
  imageSrc,
  status,
  hours,
  onReadMore,
}) {
  //"this only for show we remove it after we get it from the backend"

  ((name = "Søborg"),
    (distance = "7.6 km"),
    (address = "Dynamovej 4, 2860 Søborg"),
    (status = "Åben"),
    (hours = "07–22"),
    (imageSrc = "/images/location-thumb.png"),
    (onReadMore = () => {
      alert("Se mere om lokationen");
    }));

  return (
    <article className="w-full max-w-137.5 bg-(--color-grey-04)">
      <div className="flex flex-col">
        <div className="px-5 pt-4">
          <h3 className="text-[1.1rem] font-bold text-black">
            {name}
            <span className="font-medium text-black"> · </span>
            <span className="font-bold text-(--brand-green-01)">
              {distance}
            </span>
          </h3>

          <p className="mt-1 text-[0.95rem] font-medium text-(--color-grey-01)">
            {address}
          </p>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-center gap-3 px-5 pb-4">
            <img src={imageSrc} alt="" className="h-8.5 w-8.5 object-cover" />

            <p className="text-[0.95rem] font-medium text-black">
              <span className="font-bold text-(--brand-green-01)">
                {status}
              </span>{" "}
              {hours}
            </p>
          </div>

          <button
            type="button"
            //onClick={onReadMore}
            className="-mb-px flex h-12 min-w-37.5 items-center justify-center bg-(--brand-green-02) px-6 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
          >
            <span className="text-base font-bold text-white">Se mere</span>
          </button>
        </div>
      </div>
    </article>
  );
}
