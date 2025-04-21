import { type Preset, defineConfig, presetUno } from 'unocss';

// /** 隐藏 scrollbar */
const presetScrollbarHide = (): Preset => {
  return {
    name: 'unocss-preset-scrollbar-hide',
    rules: [
      [
        /^scrollbar-hide$/,
        () => {
          return '.scrollbar-hide{scrollbar-width:none}.scrollbar-hide::-webkit-scrollbar{display:none}';
        },
      ],
    ],
  };
};

export default defineConfig({
  presets: [presetScrollbarHide(), presetUno()],
  shortcuts: [
    {
      'u-start': 'flex items-start justify-start',
      'u-start-center': 'flex items-start justify-center',
      'u-center': 'flex items-center justify-center',
      'u-center-between': 'flex items-center justify-between',
      'u-center-around': 'flex items-center justify-around',
      'u-center-start': 'flex items-center justify-start',
      'u-ellipsis': 'text-ellipsis overflow-hidden whitespace-nowrap',
      'u-disabled': 'opacity-50 bg-e0e0e0 text-a0a0a0 pointer-events-none',
      'u-safe-bottom': 'pb-[env(safe-area-inset-bottom)]',
    },
  ],
  theme: {},
  transformers: [],
  content: {
    pipeline: {
      include: [/\.(tsx)($|\?)/],
    },
  },
});
