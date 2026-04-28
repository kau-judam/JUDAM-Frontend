const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const aliases = {
  '@/assets': path.join(projectRoot, 'assets'),
  '@/components': path.join(projectRoot, 'src/components'),
  '@/constants': path.join(projectRoot, 'src/constants'),
  '@/contexts': path.join(projectRoot, 'src/contexts'),
  '@/features': path.join(projectRoot, 'src/features'),
  '@/hooks': path.join(projectRoot, 'src/hooks'),
  '@/layouts': path.join(projectRoot, 'src/layouts'),
  '@/utils': path.join(projectRoot, 'src/utils'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const alias = Object.keys(aliases).find((key) => moduleName === key || moduleName.startsWith(`${key}/`));

  if (alias) {
    const targetPath = path.join(aliases[alias], moduleName.slice(alias.length));
    return context.resolveRequest(context, targetPath, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
