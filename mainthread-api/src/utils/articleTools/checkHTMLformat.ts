import { JSDOM } from "jsdom";

export const checkHTMLNode = (htmlString: string): boolean => {
  try {
    const dom = new JSDOM(htmlString);
    // Jika tidak ada error saat inisialisasi, anggap format dasar benar
    return !!dom.window.document;
  } catch (e) {
    return false;
  }
};