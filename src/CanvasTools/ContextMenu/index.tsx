import { type FC } from 'react';
import { defaultMenuData } from './defaultMenuData';
import MenuItem from './MenuItem';
import { MenuWrapper } from './Styled';
import type { MenuDataType } from './type';
import { calculationPosition } from './utils';

interface ContextMenuProps {
  open: boolean;
  // 菜单面板的定位
  position?: { left: number; top: number };
  menuData?: MenuDataType[];
}

// 菜单
const ContextMenu: FC<ContextMenuProps> = (props) => {
  const { open, menuData, position = { left: 0, top: 0 } } = props;
  const menuDataArr = menuData || defaultMenuData;
  // 计算面板渲染后的实际高度，用于计算定位。25为单个选项高度,
  const domHeight = menuDataArr.length * 25;
  const { left, top } = calculationPosition(position?.left || 0, position?.top || 0, domHeight);

  return (
    (open || null) && (
      <MenuWrapper style={{ left, top }} onContextMenu={(e) => e.preventDefault()}>
        {menuDataArr?.map((data, index) => <MenuItem key={index} menuData={data} />)}
      </MenuWrapper>
    )
  );
};

export default ContextMenu;
