import {Theme} from './Types/indexTypes';

// 68BBE3
// 0E86D4
// 162C46
// 031525
// f1f6ff
// ffffff
// 0d2136

const Colors: Theme = {
  Light: {
    appBackground: '#f1f6ff',
    componentBG: '#ffffff',
    accent: '#0E86D4', //'#2192ff',
    textInputBackground: '#ffffff',

    textPrimary: '#252525',
    textSecondary: '#3d3d3d',
    lightText: '#adb5bd',
    whiteText: '#ffffff',
    hyperlinkText: '#0055cc',
    warningRed: '#f56262',

    headerFirst: '#A35CBC',
    headerSecond: '#9648B2',
    headerThird: '#8D3AAB',
    white: '#fff',
    black: '#000',
    green: '#0f0',
  },
  Dark: {
    appBackground: '#031525',
    componentBG: '#0d2136',
    accent: '#055C9D',
    textInputBackground: '#0d2136',

    textPrimary: '#adb5bd',
    textSecondary: '#adb5bd',
    lightText: '#7b8288',
    whiteText: '#031525',
    hyperlinkText: '#0055cc',
    warningRed: '#f56262',

    headerFirst: '#0D3055',
    headerSecond: '#052546',
    headerThird: '#0b233d',
    white: '#fff',
    black: '#000',
    green: '#0f0',
  },
};
export default Colors;
