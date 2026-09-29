import { renderToString } from "react-dom/server";
import LandingPage from "./pages/LandingPage";

// Usado só no build (scripts/prerender.mjs): gera o HTML da home para que
// buscadores e prévias de link leiam o conteúdo sem executar JavaScript.
export function render() {
  return renderToString(<LandingPage />);
}
