#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import {
  EN_GETTING_STARTED, EN_INSTALLATION, EN_WRITING_GUIDES, EN_COMPONENTS, EN_BEST_PRACTICES,
  FR_GETTING_STARTED, FR_INSTALLATION, FR_WRITING_GUIDES, FR_COMPONENTS, FR_BEST_PRACTICES,
  DEPLOY_EN,
  DEPLOY_FR,
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
      'en/getting-started.mdx': EN_GETTING_STARTED,
      'en/installation.mdx':    EN_INSTALLATION,
      'en/writing-guides.mdx':  EN_WRITING_GUIDES,
      'en/components.mdx':      EN_COMPONENTS,
      'en/best-practices.mdx':  EN_BEST_PRACTICES,
      'en/deploy.mdx':          DEPLOY_EN,
      'fr/getting-started.mdx': FR_GETTING_STARTED,
      'fr/installation.mdx':    FR_INSTALLATION,
      'fr/writing-guides.mdx':  FR_WRITING_GUIDES,
      'fr/components.mdx':      FR_COMPONENTS,
      'fr/best-practices.mdx':  FR_BEST_PRACTICES,
      'fr/deploy.mdx':          DEPLOY_FR,
    };

    for (const [name, content] of Object.entries(files)) {
      const filePath = path.join(docsDir, name);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
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

    const child = spawn('npm', ['run', 'dev'], {
      cwd: webDir,
      env: { ...process.env, MONKEY_DOC_PATH: cwd },
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      process.exit(code ?? 0);
    });
  });

program
  .command('build')
  .description('Build static documentation for deployment')
  .option('-o, --output <dir>', 'Output directory', 'docs-dist')
  .action((options: { output: string }) => {
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

    const outDir = path.resolve(cwd, options.output);

    console.log('Building Monkey-Doc...');
    console.log('Docs:   ' + docsDir);
    console.log('Output: ' + outDir + '\n');

    // vite may be installed directly under webDir or hoisted one level up
    // (into monkey-doc/node_modules/vite) depending on npm's hoisting.
    const viteCandidates = [
      path.join(webDir, 'node_modules', 'vite', 'bin', 'vite.js'),
      path.join(webDir, '..', '..', 'vite', 'bin', 'vite.js'),
    ];
    const viteScript = viteCandidates.find((p) => fs.existsSync(p));
    if (!viteScript) {
      console.error('Could not find vite. Try reinstalling monkey-doc.');
      process.exit(1);
    }

    const child = spawn(process.execPath, [viteScript, 'build'], {
      cwd: webDir,
      env: {
        ...process.env,
        MONKEY_DOC_PATH: cwd,
        MONKEY_DOC_OUT_DIR: outDir,
      },
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        // vercel.json at project root — required for Vercel GitHub integration
        // (Vercel reads config from the repo root, not from the output directory)
        const rootVercel = path.join(cwd, 'vercel.json');
        if (!fs.existsSync(rootVercel)) {
          fs.writeFileSync(
            rootVercel,
            JSON.stringify(
              { outputDirectory: options.output, rewrites: [{ source: '/(.*)', destination: '/index.html' }] },
              null,
              2,
            ) + '\n',
          );
        }

        // vercel.json in outDir — for `vercel <outDir>` CLI deployments
        const outVercel = path.join(outDir, 'vercel.json');
        if (!fs.existsSync(outVercel)) {
          fs.writeFileSync(
            outVercel,
            JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }, null, 2) + '\n',
          );
        }

        // _redirects — SPA fallback for Netlify / Cloudflare Pages
        const userRedirects = path.join(cwd, '_redirects');
        if (fs.existsSync(userRedirects)) {
          fs.copyFileSync(userRedirects, path.join(outDir, '_redirects'));
        } else {
          fs.writeFileSync(path.join(outDir, '_redirects'), '/*  /index.html  200\n');
        }

        // Prevent GitHub Pages from ignoring dotfiles
        fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

        console.log('\nBuild complete!');
        console.log('');
        console.log('Deploy:');
        console.log('  Vercel   →  vercel ' + options.output);
        console.log('  Netlify  →  drag the "' + options.output + '" folder to app.netlify.com/drop');
        console.log('  GitHub   →  push "' + options.output + '" to your gh-pages branch');
      }
      process.exit(code ?? 0);
    });
  });

program.parse();
