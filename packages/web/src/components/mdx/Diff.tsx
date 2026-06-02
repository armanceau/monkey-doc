import React from 'react';

interface DiffProps {
  before: string;
  after: string;
  language?: string;
}

function diffLines(before: string, after: string) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');

  // LCS-based diff
  const m = beforeLines.length;
  const n = afterLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        beforeLines[i - 1] === afterLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: { type: 'same' | 'add' | 'remove'; text: string }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beforeLines[i - 1] === afterLines[j - 1]) {
      result.unshift({ type: 'same', text: beforeLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'add', text: afterLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'remove', text: beforeLines[i - 1] });
      i--;
    }
  }
  return result;
}

export function Diff({ before, after, language }: DiffProps) {
  const lines = diffLines(before.trim(), after.trim());
  const hasChanges = lines.some((l) => l.type !== 'same');

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-[#e5e5e5] dark:border-[#2a2a2a] text-[13px] font-mono">
      {language && (
        <div className="border-b border-[#e5e5e5] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#141414] px-4 py-2 text-[11px] text-[#999] dark:text-[#555] uppercase tracking-wider">
          {language}
        </div>
      )}
      <div className="overflow-x-auto bg-[#fafafa] dark:bg-[#0d0d0d]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => {
              const isAdd = line.type === 'add';
              const isRemove = line.type === 'remove';
              return (
                <tr
                  key={i}
                  className={
                    isAdd
                      ? 'bg-[#e6ffec] dark:bg-[#0d2a14]'
                      : isRemove
                        ? 'bg-[#ffebe9] dark:bg-[#2a0d0d]'
                        : ''
                  }
                >
                  <td className="select-none w-6 pl-3 pr-1 text-center text-[#b0b0b0] dark:text-[#444]">
                    {isAdd ? (
                      <span className="text-[#1a7f37] dark:text-[#3fb950] font-bold">+</span>
                    ) : isRemove ? (
                      <span className="text-[#cf222e] dark:text-[#f85149] font-bold">-</span>
                    ) : (
                      <span className="opacity-0">·</span>
                    )}
                  </td>
                  <td
                    className={`py-0.5 pl-2 pr-4 whitespace-pre leading-6 ${
                      isAdd
                        ? 'text-[#1a7f37] dark:text-[#3fb950]'
                        : isRemove
                          ? 'text-[#cf222e] dark:text-[#f85149]'
                          : 'text-[#333] dark:text-[#ccc]'
                    }`}
                  >
                    {line.text || ' '}
                  </td>
                </tr>
              );
            })}
            {!hasChanges && (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-[#999] dark:text-[#555] italic">
                  No changes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
