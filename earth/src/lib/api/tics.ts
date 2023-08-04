export type Tic = {
  id: string;
  sectors: string;
  period: string | number;
  duration: string | number;
  depthPercent: string | number;
  rPlanet: string | number;
  rStar: string | number;
  tmag: string | number;
  deltaTmag: string | number;
  paperDisposition: {
    disposition: string;
    comments: string;
  };
  group: string | number;
  dispositionCount: number;
};

export type TicGroup = {
  name: string;
  public?: boolean;
  write?: boolean;
};

export type TicDisposition = {
  disposition: string;
  comments: string;
};

export const TicShortPropertyNames = {
  sectors: "Sector(s)",
  period: "Period [Days]",
  duration: "Duration [Hrs]",
  depthPercent: "Depth%",
  rPlanet: "Rp [R<sub>J</sub>]",
  rStar: "Rs [R<sub>☉</sub>]",
  tmag: "Tmag",
  deltaTmag: "Δ Tmag",
} satisfies Partial<Record<keyof Tic, string>>;

export const TicLongPropertyNames = {
  sectors: "Sector(s)",
  period: 'Period <span class="unit">[Days]</span>',
  duration: 'Duration <span class="unit">[Hours]</span>',
  depthPercent: "Depth%",
  rPlanet: 'Planet Radius <span class="unit">[R<sub>J</sub>]</span>',
  rStar: 'Star Radius <span class="unit">[R<sub>☉</sub>]</span>',
  tmag: "TESSmag",
  deltaTmag: "Δ TESSmag",
} satisfies Partial<Record<keyof Tic, string>>;
