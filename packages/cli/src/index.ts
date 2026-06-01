#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import {
  GETTING_STARTED,
  INSTALLATION,
  WRITING_GUIDES,
  COMPONENTS,
  BEST_PRACTICES,
  CONFIG_FILE,
} from './templates';

const program = new Command();

program
  .name('monkey-doc')
  .description('Beautiful product documentation — a narrative-first alternative to Storybook')
  .version('0.1.0');

program
  .command('init')
  .description('Initialise monkey-doc in the current project')
  .action(() => {
    const cwd = process.cwd();
    const docsDir = path.join(cwd, 'docs');

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log('  Created /docs');
    }

    const files: Record<string, string> = {
      'getting-started.mdx': GETTING_STARTED,
      'installation.mdx': INSTALLATION,
      'writing-guides.mdx': WRITING_GUIDES,
      'components.mdx': COMPONENTS,
      'best-practices.mdx': BEST_PRACTICES,
    };

    for (const [name, content] of Object.entries(files)) {
      const filePath = path.join(docsDir, name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  Created docs/${name}`);
      }
    }

    const configPath = path.join(cwd, 'monkey-doc.config.ts');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, CONFIG_FILE, 'utf-8');
      console.log('  Created monkey-doc.config.ts');
    }

    console.log('\nDone! Run `monkey-doc dev` to start your documentation server.');
  });

program
  .command('dev')
  .description('Start the documentation development server')
  .action(() => {
    const cwd = process.cwd();
    let webDir: string;
    try {
      webDir = path.dirname(require.resolve('@monkey-doc/web/package.json'));
    } catch {
      console.error('Could not find @monkey-doc/web. Try reinstalling monkey-doc.');
      process.exit(1);
    }

    const docsDir = path.join(cwd, 'docs');
    if (!fs.existsSync(docsDir)) {
      console.log('No /docs folder found. Run `monkey-doc init` first.');
      process.exit(1);
    }

    console.log('Starting Monkey-Doc...');
    console.log('Docs: ' + docsDir);
    console.log('Server: http://localhost:5173\n');

    const isWindows = process.platform === 'win32';
    const child = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
      cwd: webDir,
      env: { ...process.env, MONKEY_DOC_PATH: cwd },
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      process.exit(code ?? 0);
    });
  });

program.parse();
