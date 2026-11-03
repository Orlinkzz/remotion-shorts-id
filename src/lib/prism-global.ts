// Harus diimpor SEBELUM komponen bahasa prismjs (mereka membaca `Prism` global).
import { Prism } from "prism-react-renderer";

(globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
