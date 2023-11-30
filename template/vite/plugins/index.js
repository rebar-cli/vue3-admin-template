import vue from '@vitejs/plugin-vue';

import createAutoImport from './auto-import';
import createSvgIcon from './svg-icon';
import createCompression from './compression';
import createSetupExtend from './setup-extend';
import createVisualizer from './visualizer';
import createProgress from './progress';
import createTopLevelAwait from './top-level-await';

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createProgress());
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  vitePlugins.push(createTopLevelAwait());
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return [...vitePlugins, createVisualizer()];
}
