import { Callout } from './Callout';
import { Steps, Step } from './Steps';
import { Card } from './Card';
import { Tabs } from './Tabs';
import { CodeBlock, InlineCode } from './CodeBlock';
import { FileTree, FileTreeFile, FileTreeFolder } from './FileTree';
import { CodeGroup } from './CodeGroup';
import { Accordion } from './Accordion';
import { Badge } from './Badge';
import { Mermaid } from './Mermaid';
import { Breadcrumb } from './Breadcrumb';
import { Diff } from './Diff';
import { Stepper, StepperStep } from './Stepper';
import { Property, PropertyGroup } from './Property';
import { Video } from './Video';

export {
  Callout, Steps, Step, Card, Tabs, CodeBlock, InlineCode,
  FileTree, FileTreeFile, FileTreeFolder, CodeGroup, Accordion,
  Badge, Mermaid, Breadcrumb, Diff, Stepper, StepperStep,
  Property, PropertyGroup, Video,
};

export const mdxComponents = {
  Callout,
  Steps,
  Step,
  Card,
  Tabs,
  FileTree,
  File: FileTreeFile,
  Folder: FileTreeFolder,
  CodeGroup,
  Accordion,
  Badge,
  Mermaid,
  Breadcrumb,
  Diff,
  Stepper,
  StepperStep,
  Property,
  PropertyGroup,
  Video,
  pre: CodeBlock,
  code: InlineCode,
};
