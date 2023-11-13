import type { MenuDataType } from './type';

export const defaultMenuData: MenuDataType[] = [
  {
    label: '选项1',
    onClick: () => {
      console.log('这是选项1');
    },
  },
  {
    label: '选项2',
    onClick: () => {
      console.log('这是选项2');
    },
  },
  {
    label: '选项3',
    onClick: () => {
      console.log('这是选项3');
    },
  },
];
