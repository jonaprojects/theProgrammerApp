/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#00ADB5';
const tintColorDark = '#0a7ea4';

export const Colors = {
  light: {
    text: '#11181C',
    secondaryText: "#DADADA",
    primary: "#00ADB5",
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    lineProgressActive: "#52F5FD",
    lineProgressInactive: "#333C48",
    tabBackgroundColor: "#fff",
    cardBackgroundColor: "#1B2129",
    optionBackgroundColor: "#29374B",
    navbarBg: "#1A212C"

  },
  dark: {
    text: '#ECEDEE',
    secondaryText: "#DADADA",
    primary: "#00ADB5",
    background: '#222831',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    lineProgress: "#52F5FD",
    lineProgressActive: "#52F5FD",
    lineProgressInactive: "#333C48", 
    tabBackgroundColor: "#1E242C",
    cardBackgroundColor: "#1B2129",
    optionBackgroundColor: "#29374B",
    navbarBg: "#1B2129"

  },
};
