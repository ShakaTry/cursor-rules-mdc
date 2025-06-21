# 🚀 Basic Usage Example

> **Practical Case: Create a Simple JavaScript Project with Automatic Quality**

## 🎯 Objective

Start a new project in less than 5 minutes with all quality tools automatically configured.

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured
- Code editor (VS Code recommended)

## 🚀 Step-by-Step

### 1. Clone and Customize

```bash
# Clone this template
git clone https://github.com/your-username/cursor-rules my-project
cd my-project

# Customize package.json
nano package.json  # Change name, description, author
```

### 2. Automatic Installation

```bash
# Run the complete installation
./scripts/setup.sh

# Or manually
npm install
```

### 3. First Code

```bash
# Create your first file
cat > src/index.js << 'EOF'
/**
 * My first project with cursor-rules
 */

function sayHello(name = 'World') {
  return `Hello, ${name}!`;
}

function main() {
  console.log(sayHello('Developer'));
  console.log('🎉 Project successfully configured!');

  // Example of using tools
  const config = {
    name: require('../package.json').name,
    version: require('../package.json').version,
    environment: process.env.NODE_ENV || 'development'
  };

  console.log('📋 Configuration:', config);
}

// Export for reuse
module.exports = { sayHello, main };

// Execute if called directly
if (require.main === module) {
  main();
}
EOF
```

### 4. Quality Check

```bash
# Check code quality
npm run quality

# See the magic: the code is automatically formatted!
cat src/index.js
```

### 5. First Commit

```bash
# Add files
git add .

# Commit with convention (automatically formatted)
git commit -m "feat: initial project setup with working example"

# The pre-commit hook automatically checks quality!
```

### 6. Test and Build

```bash
# Test the code
node src/index.js

# Build the project
./scripts/build.sh

# Test the build
node dist/index.js
```

## 🎨 Quick Customization

### Add a Utility Function

```javascript
// src/utils/helpers.js
const formatDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

module.exports = { formatDate, generateId };
```

### Use in index.js

```javascript
// Add at the top of src/index.js
const { formatDate, generateId } = require('./utils/helpers');

// Use in main()
console.log('📅 Date:', formatDate());
console.log('🆔 ID:', generateId());
```

### Add Custom Scripts

```json
// In package.json, "scripts" section
{
  "dev": "node src/index.js",
  "start": "node dist/index.js",
  "watch": "nodemon src/index.js"
}
```

## ✅ Validation

### Automatic Checks

```bash
# Code quality (0 errors expected)
npm run quality

# Build without errors
npm run build

# Tests (if configured)
npm test
```

### Expected Metrics

- ✅ ESLint: 0 errors, 0 warnings
- ✅ Prettier: Code automatically formatted
- ✅ Build: Success in <30 seconds
- ✅ Git: Functional hooks

## 🚀 Next Steps

### Development

1. **Add features** in `src/`
2. **Document** in `docs/`
3. **Test** with examples
4. **Commit** with conventions

### Deployment

```bash
# Create a release
npm run release

# Deploy
./scripts/deploy.sh
```

### Extensions

- Add TypeScript: `npm install typescript @types/node`
- Add tests: `npm install jest`
- Add an API: `npm install express`

## 🎯 Expected Result

By the end of this example, you will have:

- ✅ **Functional project** in 5 minutes
- ✅ **Quality guaranteed** automatically
- ✅ **Professional standards** applied
- ✅ **Ready for the team** and production

## 💡 Tips

### For beginners

- Follow the steps in order
- Read error messages (they are useful!)
- Use `npm run quality:fix` to automatically fix

### For teams

- Share this template with everyone
- Personalize `.eslintrc.js` according to your standards
- Adjust scripts in `package.json`

---

**🎉 Congratulations! You have a professional project in a few minutes!**

➡️ **Next**: Check out `../advanced-usage/` for advanced features.
