module.exports = (api) => {
  const isTest = api.env('test');
  
  const presets = [
    'next/babel',
    ['@babel/preset-react', { 
      runtime: 'automatic',
      importSource: '@emotion/react',
    }],
    '@babel/preset-typescript',
  ];

  const plugins = [
    ['@babel/plugin-transform-runtime', {
      useESModules: false,
      version: '^7.18.0',
    }],
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    isTest ? 'babel-plugin-dynamic-import-node' : null,
  ].filter(Boolean);

  if (isTest) {
    // For test environment
    presets.unshift([
      '@babel/preset-env',
      {
        targets: { 
          node: 'current' 
        },
        modules: 'commonjs',
      },
    ]);
  }

  return {
    presets,
    plugins,
  };
};
