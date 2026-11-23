export const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

const venueName = "ANANTA 11";
const address = "Country Home Extension, Samrala Road, Khanna";
const mapQuery = encodeURIComponent(`${venueName}, ${address}`);

export const invitationConfig = {
  date: "Thursday, 3 December 2026",
  dateShort: "3 December 2026",
  dateTime: "2026-12-03T08:30:00+05:30",
  venue: {
    name: venueName,
    address,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  },
  programme: [
    {
      id: "grah-pravesh",
      title: "Grah Pravesh",
      subtitle: "The First Steps into Our New Home",
      time: "8:30 a.m.",
      image: asset("goyal-grah-pravesh.jpg"),
    },
    {
      id: "breakfast",
      title: "Breakfast",
      subtitle: "A Warm Start to the Morning",
      time: "9:00 a.m.",
      image: asset("goyal-breakfast.jpg"),
    },
    {
      id: "havan",
      title: "Havan",
      subtitle: "Blessings by the Sacred Fire",
      time: "10:00 a.m.",
      image: asset("goyal-havan.jpg"),
    },
    {
      id: "lunch",
      title: "Lunch",
      subtitle: "A Meal Shared with Loved Ones",
      time: "12:30 p.m.",
      image: asset("goyal-lunch.jpg"),
    },
    {
      id: "kirtan",
      title: "Hari Naam Kirtan",
      subtitle: "Singing Together in Devotion",
      time: "2:00 p.m.",
      image: asset("goyal-kirtan.jpg"),
    },
  ],
  contacts: ["99883-06789", "75084-56789"],
} as const;

export type Celebration = (typeof invitationConfig.programme)[number];
