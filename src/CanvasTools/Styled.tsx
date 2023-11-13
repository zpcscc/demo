import styled from '@emotion/styled';

export const CanvasContainer = styled.div`
  width: 100%;
  height: 56vh;
  border: 1px solid #999999;
  position: relative;

  #echarts-container,
  #canvas-tools-container {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`;
