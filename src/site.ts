import Swup from "swup";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupHeadPlugin from "@swup/head-plugin";

import { initHomePage } from "./main";
import { initReligioPage, destroyReligioPage } from "./religio";
import { initPayluxResearch, destroyPayluxResearch } from "./paylux";
import "./styles/main.scss";
import "./styles/paylux.scss";

const initCurrentPage = (): void => {
  if (document.querySelector(".app-grid")) {
    initHomePage();
  }

  if (document.querySelector(".religio-detail")) {
    initReligioPage();
  }

  initPayluxResearch();
};

const swup = new Swup({
  containers: ["#swup"],
  linkSelector: 'a[href]:not([href^="#"]):not([target="_blank"]):not([download])',
  plugins: [
    new SwupBodyClassPlugin(),
    new SwupHeadPlugin({
      attributes: ["lang", "dir", "class"],
      persistAssets: true,
    }),
  ],
});

initCurrentPage();
swup.hooks.before("content:replace", () => {
  destroyPayluxResearch();
  destroyReligioPage();
});
swup.hooks.on("page:view", initCurrentPage);
