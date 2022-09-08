import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store/index";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faPlanetRinged,
  faBasketShopping,
  faCauldron,
  faChess,
  faLock,
  faCardHeart,
  faCardsBlank,
  faEraser,
  faCarrot,
  faToothbrush,
  faScrewdriverWrench,
  faCalendarCirclePlus,
  faCalendarXmark,
  faCircleXmark,
  faChartMixed,
  faGear,
} from "@fortawesome/pro-duotone-svg-icons";

/* add icons to the library */
library.add(
  faPlanetRinged,
  faBasketShopping,
  faCauldron,
  faChess,
  faLock,
  faCardHeart,
  faCardsBlank,
  faEraser,
  faCarrot,
  faToothbrush,
  faScrewdriverWrench,
  faCalendarCirclePlus,
  faCalendarXmark,
  faCircleXmark,
  faChartMixed,
  faGear
);

const app = createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app");
