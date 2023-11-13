import type { MouseEvent } from 'react';

export interface MenuDataType {
  // 菜单项的名称
  label?: string;
  // icon图标
  icon?: any;
  // 是否渲染当前菜单项
  hidden?: boolean;
  // 点击后的触发事件
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}
