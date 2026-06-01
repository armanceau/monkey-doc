import { Callout } from './Callout';
import { Steps, Step } from './Steps';
import { Card } from './Card';
import { Tabs } from './Tabs';
import { CodeBlock, InlineCode } from './CodeBlock';

export { Callout, Steps, Step, Card, Tabs, CodeBlock, InlineCode };

export const mdxComponents = {
  Callout,
  Steps,
  Step,
  Card,
  Tabs,
  pre: CodeBlock,
  code: InlineCode,
};
