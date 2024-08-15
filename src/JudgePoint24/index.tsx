import { Input, Space } from 'antd';
import { useState, type ChangeEvent, type FC } from 'react';
import judgePoint24 from './judgePoint24';

const App: FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value || '';
    setInput(value);
    const nums = value.split(',').map(Number).slice(0, 4);
    setResult(String(judgePoint24(nums)));
  };

  return (
    <Space direction='vertical'>
      <Input
        style={{ width: '400px' }}
        value={input}
        placeholder='请输入需要计算的四位数字，逗号分割。例:1,2,3,4'
        onChange={onChange}
      />
      <Input.TextArea rows={3} style={{ width: '400px' }} value={String(result)} />
    </Space>
  );
};

export default App;
