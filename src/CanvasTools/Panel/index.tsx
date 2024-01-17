import { Col, ColorPicker, Divider, InputNumber, Row, Space, Switch } from 'antd';
import { type FC } from 'react';
import type { PanelOptType } from '../type';

export type PanelProps = {
  opt: PanelOptType;
  onOptChange: (fieldType: keyof PanelOptType, opt: PanelOptType) => void;
  type?: 'global' | 'local';
};

// 画布面板
const Panel: FC<PanelProps> = (props) => {
  const { opt, onOptChange, type = 'global' } = props;

  const presets = [
    {
      label: 'Recommended',
      colors: [
        '#000000',
        '#000000E0',
        '#000000A6',
        '#00000073',
        '#00000040',
        '#00000026',
        '#0000001A',
        '#00000012',
        '#0000000A',
        '#00000005',
        '#F5222D',
        '#FA8C16',
        '#FADB14',
        '#8BBB11',
        '#52C41A',
        '#13A8A8',
        '#1677FF',
        '#2F54EB',
        '#722ED1',
        '#EB2F96',
        '#F5222D4D',
        '#FA8C164D',
        '#FADB144D',
        '#8BBB114D',
        '#52C41A4D',
        '#13A8A84D',
        '#1677FF4D',
        '#2F54EB4D',
        '#722ED14D',
        '#EB2F964D'
      ]
    },
    {
      label: 'Recent',
      colors: ['#F5222D4D', '#FA8C164D', '#FADB144D', '#8BBB114D', '#52C41A4D', '#13A8A84D']
    }
  ];

  const panelRender = (_, { components: { Picker, Presets } }) => (
    <div
      className='custom-panel'
      style={{
        display: 'flex',
        width: 468
      }}
    >
      <div
        style={{
          flex: 1
        }}
      >
        <Presets />
      </div>
      <Divider
        type='vertical'
        style={{
          height: 'auto'
        }}
      />
      <div
        style={{
          width: 234
        }}
      >
        <Picker />
      </div>
    </div>
  );

  return (
    <Row align='middle'>
      {type === 'global' && (
        <Col span={8}>
          <Space>
            <span>模式切换: </span>
            <Switch
              checkedChildren='绘制'
              unCheckedChildren='框选'
              checked={opt?.isDrawingMode}
              onChange={(value) => {
                onOptChange?.('isDrawingMode', {
                  ...opt,
                  isDrawingMode: value
                });
              }}
            />
          </Space>
        </Col>
      )}
      <Col span={8}>
        <Space>
          <span>笔刷颜色: </span>
          <ColorPicker
            styles={{
              popupOverlayInner: {
                width: 468 + 24
              }
            }}
            presets={presets}
            panelRender={panelRender}
            value={opt?.color}
            onChange={(Color) => {
              onOptChange?.('color', {
                ...opt,
                color: Color.toHexString()
              });
            }}
          />
        </Space>
      </Col>
      <Col span={8}>
        <Space>
          <span>笔刷宽度: </span>
          <InputNumber
            addonAfter='px'
            style={{ width: '100px' }}
            value={opt?.width}
            onChange={(value) => {
              onOptChange?.('width', {
                ...opt,
                width: value || 5
              });
            }}
          />
        </Space>
      </Col>
      <Col span={8}>
        <Space>
          <span>显示箭头: </span>
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            checked={opt?.showArrow}
            onChange={(value) => {
              onOptChange?.('showArrow', {
                ...opt,
                showArrow: value
              });
            }}
          />
        </Space>
      </Col>
      <Col span={8}>
        <Space>
          <span>显示背景: </span>
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            checked={opt?.showBackground}
            onChange={(value) => {
              onOptChange?.('showBackground', {
                ...opt,
                showBackground: value
              });
            }}
          />
        </Space>
      </Col>
      <Col span={8}>
        <Space>
          <span>背景颜色: </span>
          <ColorPicker
            styles={{
              popupOverlayInner: {
                width: 468 + 24
              }
            }}
            presets={presets}
            panelRender={panelRender}
            value={opt?.backgroundColor}
            onChange={(Color) => {
              onOptChange?.('backgroundColor', {
                ...opt,
                backgroundColor: Color.toHexString()
              });
            }}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default Panel;
