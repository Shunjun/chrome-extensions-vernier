/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 13:05:35
 * @Description
 */
import Vernier from "./Vernier";

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
