import type { Preset, Rule } from 'unocss';
import { defineConfig, presetAttributify, presetUno } from 'unocss';

import presetRemToRpx from './preset-rem-to-rpx';

const sizeMapping: Record<string, string> = {
  fs: 'font-size',
  height: 'height',
  width: 'width',
  gap: 'gap',
  bdrs: 'border-radius',
  lineH: 'line-height'
};

function getSizeRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];
    return [new RegExp(`^${key}-(\\d+)$`), ([, d]) => ({ [value]: `${d}rpx` })];
  });
}

let rules = getSizeRules(sizeMapping);

const colorMapping: Record<string, string> = {
  bgc: 'background-color',
  bdc: 'border-color'
};

function getColorRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];
    return [
      new RegExp(`^${key}-([\\w-]+)$`),
      ([, d]) => ({ [value]: `var(--color-${d})` })
    ];
  });
}

rules = rules.concat(getColorRules(colorMapping));

const commonMapping: Record<string, Function> = {
  dis: function(d) {
    return { ['display']: `${d}` }
  },
};


function getCommonRules(Mapping: Record<string, Function>): Rule<{}>[] {
  return Object.keys(Mapping).map((key) => {
    const fun = Mapping[key];
    return [
      new RegExp(`^${key}-([\\w-]+)$`),
      ([, d]) => fun(d)
    ];
  });
}


rules = rules.concat(getCommonRules(commonMapping));


// console.log(rules);

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetRemToRpx({
      baseFontSize: 4
    }) as Preset
  ],
  theme: {
    preflightRoot: ['page,::before,::after']
  },
  rules
});
