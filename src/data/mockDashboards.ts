export interface Dashboard {
  id: string;
  name: string;
  coordinates: string;
  cameraCount: number;
  createdAt: string;
  createdBy: string;
  status: "active" | "sleeping" | "offline";
  lastLog: string;
}

export const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: "d1",
    name: "Serengeti Watchtower",
    coordinates: "2.3333° S, 34.8333° E",
    cameraCount: 6,
    createdAt: "2025-11-14",
    createdBy: "Alex Ranger",
    status: "active",
    lastLog: "Lion pride spotted near camera 3 — 12 min ago",
  },
  {
    id: "d2",
    name: "Amazon Canopy Hub",
    coordinates: "3.4653° S, 62.2159° W",
    cameraCount: 4,
    createdAt: "2025-12-02",
    createdBy: "Alex Ranger",
    status: "active",
    lastLog: "Jaguar crossing detected — 1 hr ago",
  },
  {
    id: "d3",
    name: "Arctic Tundra Station",
    coordinates: "71.2906° N, 156.7886° W",
    cameraCount: 3,
    createdAt: "2026-01-08",
    createdBy: "Alex Ranger",
    status: "sleeping",
    lastLog: "Polar bear activity — 3 hrs ago",
  },
  {
    id: "d4",
    name: "Borneo Rainforest Post",
    coordinates: "1.0° N, 114.0° E",
    cameraCount: 5,
    createdAt: "2026-01-22",
    createdBy: "Sam Observer",
    status: "active",
    lastLog: "Orangutan nest building observed — 30 min ago",
  },
  {
    id: "d5",
    name: "Yellowstone Geyser Watch",
    coordinates: "44.4280° N, 110.5885° W",
    cameraCount: 8,
    createdAt: "2026-02-10",
    createdBy: "Alex Ranger",
    status: "offline",
    lastLog: "Grizzly bear fishing — 6 hrs ago",
  },
];
