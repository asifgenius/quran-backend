export type Verse = {
  id: number;
  text: string;
  translation: string;
};

export type Surah = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: Verse[];
};

export type SurahSummary = Omit<Surah, "verses"> & {
  link?: string;
};

export type JuzSummary = {
  id: number;
  label: string;
  range: string;
};

export type SearchResult = {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  surahTranslation: string;
  verseId: number;
  arabicText: string;
  translationText: string;
};
