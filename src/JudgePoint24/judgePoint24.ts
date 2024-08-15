// 计算24点
const judgePoint24 = (nums: number[]) => {
  const EPSILON = 1e-6;

  const dfs = (nums: number[], expression: string[]) => {
    if (nums.length === 1) {
      if (Math.abs(nums[0] - 24) < EPSILON) {
        return expression[0];
      }
      return false;
    }

    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i !== j) {
          const nextNums: number[] = [];
          const nextExpressions: string[] = [];

          for (const [k, num] of nums.entries()) {
            if (k !== i && k !== j) {
              nextNums.push(num);
              nextExpressions.push(expression[k]);
            }
          }

          const ops = [
            { val: nums[i] + nums[j], exp: `(${expression[i]} + ${expression[j]})` },
            { val: nums[i] - nums[j], exp: `(${expression[i]} - ${expression[j]})` },
            { val: nums[j] - nums[i], exp: `(${expression[j]} - ${expression[i]})` },
            { val: nums[i] * nums[j], exp: `(${expression[i]} * ${expression[j]})` },
            { val: nums[i] / nums[j], exp: `(${expression[i]} / ${expression[j]})` },
            { val: nums[j] / nums[i], exp: `(${expression[j]} / ${expression[i]})` }
          ];

          for (const op of ops) {
            if (Math.abs(op.val) < EPSILON && (op.val === nums[i] || op.val === nums[j])) continue;

            nextNums.push(op.val);
            nextExpressions.push(op.exp);

            const exp = dfs(nextNums, nextExpressions);
            if (exp) {
              return exp;
            }

            nextNums.pop();
            nextExpressions.pop();
          }
        }
      }
    }

    return false;
  };

  return dfs(
    nums,
    nums.map((num) => num.toString())
  );
};

export default judgePoint24;
