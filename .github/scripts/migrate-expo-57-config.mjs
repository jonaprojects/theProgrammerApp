import { readFile, writeFile } from "node:fs/promises";

const path = "app.json";
const config = JSON.parse(await readFile(path, "utf8"));
const expo = config.expo ?? {};
const splash = expo.splash;
if (splash) {
  delete expo.splash;
  const plugins = Array.isArray(expo.plugins) ? expo.plugins : [];
  expo.plugins = plugins.filter((plugin) => (
    Array.isArray(plugin) ? plugin[0] !== "expo-splash-screen" : plugin !== "expo-splash-screen"
  ));
  expo.plugins.push([
    "expo-splash-screen",
    {
      image: splash.image,
      resizeMode: splash.resizeMode ?? "contain",
      backgroundColor: splash.backgroundColor ?? "#ffffff",
      imageWidth: 200,
    },
  ]);
}
config.expo = expo;
await writeFile(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
