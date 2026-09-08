import L from "leaflet";

const createIcon = (color: string) => {
  const p1 = "https:" + "//" + "raw" + "." + "githubusercontent" + "." + "com";
  const p2 =
    "/" +
    "pointhi" +
    "/" +
    "leaflet" +
    "-" +
    "color" +
    "-" +
    "markers" +
    "/" +
    "master" +
    "/" +
    "img" +
    "/";
  const iconUrlString = p1 + p2 + "marker-icon-" + color + ".png";

  const shadowUrlString =
    "https:" +
    "//" +
    "unpkg" +
    "." +
    "com" +
    "/" +
    "leaflet@1.7.1" +
    "/" +
    "dist" +
    "/" +
    "images" +
    "/" +
    "marker-shadow.png";

  return new L.Icon({
    iconUrl: iconUrlString,
    shadowUrl: shadowUrlString,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export const iconsMap: Record<string, L.Icon> = {
  station: createIcon("blue"),
  closure: createIcon("violet"),
  slack: createIcon("green"),
  burn: createIcon("orange"),
  bullet: createIcon("black"),
  partial: createIcon("gold"),
  thermal: createIcon("grey"),
  accident: createIcon("red"),
};
