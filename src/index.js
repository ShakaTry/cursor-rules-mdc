/**
 * Main entry point for cursor-rules project
 * Generated by Phase 3 - Structure Professionnelle
 */

const packageInfo = require('../package.json');

/**
 * Welcome message with project information
 */
function displayWelcome() {
  console.log('🎉 Welcome to cursor-rules!');
  console.log(`📦 Project: ${packageInfo.name}`);
  console.log(`🔖 Version: ${packageInfo.version}`);
  console.log(`📝 Description: ${packageInfo.description}`);
  console.log('');
  console.log('🚀 Available commands:');
  console.log('  npm run quality      - Check code quality');
  console.log('  npm run quality:fix  - Auto-fix quality issues');
  console.log('  npm run release      - Create new release');
  console.log('  ./scripts/build.sh   - Build project');
  console.log('  ./scripts/deploy.sh  - Deploy project');
  console.log('');
  console.log('📖 Documentation: docs/');
  console.log('💡 Examples: examples/');
  console.log('🎨 Templates: templates/');
}

/**
 * Main function
 */
function main() {
  displayWelcome();

  // Example of using the project structure
  const config = {
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    features: {
      qualityTools: true,
      automaticVersioning: true,
      professionalStructure: true,
      documentation: true,
      examples: true,
      templates: true,
    },
  };

  console.log('⚙️ Configuration:');
  console.log(JSON.stringify(config, null, 2));
}

// Export for use in other modules
module.exports = {
  displayWelcome,
  main,
  version: packageInfo.version,
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
