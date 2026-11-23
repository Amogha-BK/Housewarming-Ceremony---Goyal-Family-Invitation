export type Celebration = {
  id: "havan" | "sundar-kaand" | "lunch";
  shortName: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  supportingLine: string;
  start: string;
  image: string;
  imageAlt: string;
  scene: string;
  mapUrl: string;
};

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const address = "Street Adjoining Karuna Hospital, Patiala By Pass Road, Sangrur";
// Exact pin resolved from the host's original Maps link; opens in the app or browser.
const venueMap = "https://www.google.com/maps/search/?api=1&query=30.2490584%2C75.8614627";
export const invitationConfig = {
  weddingLabel: "Saturday, 28 November 2026",
  invitationLine: "A new home, a new beginning — made beautiful by your blessings and presence.",
  monogram: asset("mittal-crest.svg"),
  houseImage: asset("mittal-house.jpeg"),
  venue: { name: "The Mittal Residence Sangrur", address, mapUrl: venueMap },
  celebrations: [
    {
      id: "havan",
      shortName: "Havan",
      title: "Havan",
      subtitle: "A Sacred Beginning",
      dateLabel: "Saturday, 28 November 2026",
      timeLabel: "07.15 AM",
      venue: address,
      supportingLine:
        "With the sacred flame, we welcome peace, prosperity and divine blessings into our new home.",
      start: "20261128T071500",
      image: asset("housewarming-havan-v2.png"),
      imageAlt:
        "A housewarming Havan fire with a coconut kalash, mango leaves and a traditional puja thali in a sunlit home courtyard",
      scene: "fire",
      mapUrl: venueMap,
    },
    {
      id: "sundar-kaand",
      shortName: "Paath Shri Sundar Kaand",
      title: "Paath Shri Sundar Kaand",
      subtitle: "An Offering of Devotion",
      dateLabel: "Saturday, 28 November 2026",
      timeLabel: "10.00 AM",
      venue: address,
      supportingLine:
        "Together in devotion, we seek the blessings of Lord Hanuman for a home filled with strength, harmony and happiness.",
      start: "20261128T100000",
      image: asset("housewarming-sundar-kaand-v2.png"),
      imageAlt:
        "An open sacred scripture on a wooden rehal, a diya, jasmine garland and saffron Hanuman flag in a home prayer nook",
      scene: "devotion",
      mapUrl: venueMap,
    },
    {
      id: "lunch",
      shortName: "Lunch",
      title: "Lunch",
      subtitle: "A Feast of Togetherness",
      dateLabel: "Saturday, 28 November 2026",
      timeLabel: "12.30 PM",
      venue: address,
      supportingLine:
        "After the prayers, join us for a lovingly hosted lunch and the joy of being together.",
      start: "20261128T123000",
      image: asset("housewarming-lunch-v2.png"),
      imageAlt:
        "Two vegetarian brass thalis on a welcoming home dining table with ivory flowers and warm afternoon light",
      scene: "lunch",
      mapUrl: venueMap,
    },
  ] satisfies Celebration[],
} as const;
