import { Space } from 'antd';
import { type FC, type MouseEvent } from 'react';
import type { MenuDataType } from '../type';
import { MenuItemWrapper } from './Styled';

interface MenuItemProps {
  menuData: MenuDataType;
}

// 单个菜单项
const MenuItem: FC<MenuItemProps> = ({ menuData }) => {
  const { label = '', icon = '', onClick } = menuData;

  const onHandleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
  };

  return (
    <MenuItemWrapper className='menu-item' onClick={onHandleClick}>
      <Space align='center' size={5}>
        {icon}
        <span className='menu-action'>{label}</span>
      </Space>
    </MenuItemWrapper>
  );
};

export default MenuItem;
