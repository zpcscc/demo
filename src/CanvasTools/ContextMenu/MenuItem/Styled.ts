import styled from '@emotion/styled';

export const MenuItemWrapper = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 2px 5px;
  color: #333333;
  font-weight: normal;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  &:hover,
  &:focus {
    color: #ffffff;
    text-decoration: none;
    background-color: #0081c2;
    background-image: linear-gradient(to bottom, #0088cc, #0077b3);
    background-repeat: repeat-x;
  }
  .ant-space {
    /* 禁止ant-space的默认点击事件，space的点击事件阻止了事件冒泡。但这里正需要冒泡 */
    pointer-events: none;
  }
`;
