import Swup from "swup";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupHeadPlugin from "@swup/head-plugin";

import { initHomePage } from "./main";
import { initReligioPage } from "./religio";
import "./styles/main.scss";

const initCurrentPage = (): void => {
  if (document.querySelector(".app-grid")) {
    initHomePage();
  }

  if (document.querySelector(".religio-detail")) {
    initReligioPage();
  }
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
swup.hooks.on("page:view", initCurrentPage);
