export type Prayer = {
  name:
    | 'Fajr'
    | 'Sunrise'
    | 'Dhuhr'
    | 'Asr'
    | 'Maghrib'
    | "Isha'a"
    | 'Fajr tomrrow';
  time: number;
};

export type TimeStr = `${number}:${number}`;

export type NextPrayerOptions = {
  escapeSunrise?: boolean;
};
