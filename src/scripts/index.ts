/*
 * @Author 舜君
 * @LastEditTime 2022-01-05 14:18:53
 * @Description
 */
import Vernier from "./core/Vernier";

window.addEventListener("load", function () {
  const vernier = new Vernier();

  chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    if (message === "start") {
      vernier.start();
    }

    if (message === "stop") {
      vernier.stop();
    }
  });
});
