# 🔧 PLAN : Scripts Cross-Platform Compatibility

## 📋 **CONTEXT & PROBLEM**

### **Current Issue**
- **9 bash scripts** in `scripts/` directory (.sh files)
- **Windows compatibility problem**: Windows doesn't have bash by default
- **Error**: Scripts fail on Windows PowerShell environment
- **Need**: Pérenne (sustainable) solution for Windows/Mac/Linux

### **Current Scripts to Fix**
```
scripts/
├── auto-release.sh (12KB, 407 lines) - Release automation
├── build.sh (4.3KB, 182 lines) - Build process
├── clean.sh (7.1KB, 258 lines) - Cleanup tasks
├── commit-helper.sh (6.9KB, 230 lines) - Commit automation
├── deploy.sh (8.5KB, 304 lines) - Deployment process
├── project-detector.sh (4.6KB, 182 lines) - Project detection
├── setup-automation.sh (9.4KB, 367 lines) - Automation setup
├── setup.sh (6.0KB, 231 lines) - Initial setup
└── version-manager.sh (8.6KB, 285 lines) - Version management
```

## 🎯 **OBJECTIVE**

Create **universal cross-platform scripts** that work seamlessly on:
- ✅ **Windows** (PowerShell/cmd)
- ✅ **macOS** (bash/zsh)
- ✅ **Linux** (bash)

## 🔄 **SOLUTION STRATEGY**

### **Option A: Node.js Universal Scripts** (RECOMMENDED)
- Convert bash scripts to **JavaScript/Node.js**
- **Advantages**: 
  - Truly universal (Node.js runs everywhere)
  - Already have Node.js dependency in project
  - Can use npm packages for functionality
  - Better error handling and JSON support
- **Disadvantages**: 
  - More verbose than bash for some operations

### **Option B: PowerShell Core Scripts**
- Convert to **PowerShell Core** (.ps1)
- **Advantages**: 
  - Cross-platform PowerShell available
  - Native Windows support
- **Disadvantages**: 
  - Requires PowerShell installation on Mac/Linux
  - Less familiar for Unix users

### **Option C: Hybrid Wrapper System**
- Keep bash scripts + Create PowerShell equivalents
- **Smart launcher** detects platform and runs appropriate script
- **Advantages**: 
  - Maintains existing bash functionality
  - Native experience on each platform
- **Disadvantages**: 
  - Double maintenance burden

## 📋 **SELECTED APPROACH: Option A - Node.js Universal**

### **Rationale**
1. **Already have Node.js** in the project (package.json)
2. **Truly universal** - runs identically everywhere
3. **Single codebase** to maintain
4. **Enhanced functionality** with npm ecosystem
5. **Better integration** with existing tools (ESLint, etc.)

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Analysis & Preparation** (30 min)
**Objective**: Analyze current scripts and prepare conversion framework

#### **Actions**
- [ ] Map bash script functionalities to Node.js equivalents
- [ ] Identify required npm packages for system operations
- [ ] Create Node.js script template with cross-platform utilities
- [ ] Design consistent CLI interface pattern

#### **Deliverables**
- [ ] Functionality mapping document
- [ ] Node.js utilities library (`scripts/lib/utils.js`)
- [ ] Template for Node.js scripts
- [ ] Package.json updates with new dependencies

### **Phase 2: Core Infrastructure Scripts** (45 min)
**Objective**: Convert essential infrastructure scripts first

#### **Priority Scripts**
1. **project-detector.js** - Project type detection
2. **setup.js** - Initial project setup
3. **version-manager.js** - Version management

#### **Actions**
- [ ] Convert `project-detector.sh` → `project-detector.js`
- [ ] Convert `setup.sh` → `setup.js`
- [ ] Convert `version-manager.sh` → `version-manager.js`
- [ ] Create cross-platform file operations utilities
- [ ] Implement process execution helpers (git, npm, etc.)

#### **Technical Requirements**
- [ ] Use `process.platform` for OS detection
- [ ] Use `child_process.spawn/exec` for command execution
- [ ] Use `path` module for cross-platform paths
- [ ] Use `fs/promises` for async file operations

### **Phase 3: Automation Scripts** (60 min)
**Objective**: Convert workflow automation scripts

#### **Scripts to Convert**
1. **commit-helper.js** - Commit automation
2. **auto-release.js** - Release automation
3. **setup-automation.js** - Automation setup

#### **Actions**
- [ ] Convert `commit-helper.sh` → `commit-helper.js`
- [ ] Convert `auto-release.sh` → `auto-release.js`
- [ ] Convert `setup-automation.sh` → `setup-automation.js`
- [ ] Implement git operations wrapper
- [ ] Create GitHub CLI integration helpers

#### **Enhanced Features**
- [ ] Better error handling with stack traces
- [ ] JSON configuration support
- [ ] Progress indicators and colored output
- [ ] Interactive prompts with inquirer.js

### **Phase 4: Build & Deployment Scripts** (45 min)
**Objective**: Convert build and deployment scripts

#### **Scripts to Convert**
1. **build.js** - Build process
2. **clean.js** - Cleanup tasks
3. **deploy.js** - Deployment automation

#### **Actions**
- [ ] Convert `build.sh` → `build.js`
- [ ] Convert `clean.sh` → `clean.js`
- [ ] Convert `deploy.sh` → `deploy.js`
- [ ] Implement cross-platform build utilities
- [ ] Create deployment target handlers

#### **Cross-platform Considerations**
- [ ] Handle different path separators (/ vs \)
- [ ] Manage different executable extensions (.exe on Windows)
- [ ] Account for different shell environments
- [ ] Test file permission handling across platforms

### **Phase 5: Integration & Testing** (30 min)
**Objective**: Ensure all scripts work seamlessly together

#### **Actions**
- [ ] Update package.json scripts to use new Node.js versions
- [ ] Create npm run shortcuts for all scripts
- [ ] Test complete workflow on simulated environments
- [ ] Update documentation with new usage examples

#### **Testing Matrix**
- [ ] **Windows PowerShell**: All scripts functional
- [ ] **Windows cmd**: All scripts functional
- [ ] **macOS Terminal**: All scripts functional
- [ ] **Linux bash**: All scripts functional

### **Phase 6: Migration & Cleanup** (15 min)
**Objective**: Clean transition from bash to Node.js

#### **Actions**
- [ ] Archive old .sh scripts in `scripts/legacy/`
- [ ] Update all documentation references
- [ ] Update Memory Bank with new script locations
- [ ] Create migration guide for users

---

## 🛠️ **TECHNICAL SPECIFICATIONS**

### **Required Dependencies**
```json
{
  "dependencies": {
    "chalk": "^5.3.0",           // Colored terminal output
    "inquirer": "^9.2.0",        // Interactive prompts
    "commander": "^11.1.0",      // CLI framework
    "semver": "^7.5.0",          // Version manipulation
    "fs-extra": "^11.2.0",       // Enhanced file operations
    "cross-spawn": "^7.0.3"      // Cross-platform process spawning
  }
}
```

### **Utilities Library Structure**
```javascript
// scripts/lib/utils.js
module.exports = {
  // Platform detection
  isWindows: process.platform === 'win32',
  isMacOS: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  
  // Cross-platform command execution
  exec: (command, options) => { /* implementation */ },
  spawn: (command, args, options) => { /* implementation */ },
  
  // File operations
  ensureDir: (path) => { /* implementation */ },
  copyFiles: (src, dest) => { /* implementation */ },
  removeFiles: (pattern) => { /* implementation */ },
  
  // Git operations
  git: {
    status: () => { /* implementation */ },
    add: (files) => { /* implementation */ },
    commit: (message) => { /* implementation */ },
    push: () => { /* implementation */ }
  },
  
  // Output utilities
  log: {
    info: (message) => { /* colored output */ },
    success: (message) => { /* colored output */ },
    warning: (message) => { /* colored output */ },
    error: (message) => { /* colored output */ }
  }
};
```

### **Script Template Pattern**
```javascript
#!/usr/bin/env node
const { Command } = require('commander');
const utils = require('./lib/utils');

const program = new Command();

program
  .name('script-name')
  .description('Script description')
  .version('1.0.0');

program
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      utils.log.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

async function main(options) {
  // Script implementation
}

if (require.main === module) {
  program.parse();
}

module.exports = { main };
```

---

## 📋 **SUCCESS CRITERIA**

### **Functional Requirements**
- [ ] All 9 scripts converted to Node.js
- [ ] 100% feature parity with bash versions
- [ ] Cross-platform compatibility (Windows/Mac/Linux)
- [ ] Consistent CLI interface across all scripts
- [ ] Enhanced error handling and user feedback

### **Quality Requirements**
- [ ] Code follows ESLint standards
- [ ] Each script has JSDoc documentation
- [ ] Error messages are clear and actionable
- [ ] Progress indicators for long-running operations
- [ ] Graceful handling of missing dependencies

### **User Experience Requirements**
- [ ] Scripts work identically on all platforms
- [ ] Clear usage instructions and help text
- [ ] Colored output for better readability
- [ ] Interactive prompts where appropriate
- [ ] Backward compatibility maintained for npm scripts

---

## 📝 **DELIVERABLES**

### **New Files Created**
```
scripts/
├── lib/
│   ├── utils.js              # Cross-platform utilities
│   ├── git-helper.js         # Git operations wrapper
│   └── npm-helper.js         # npm operations wrapper
├── auto-release.js           # Replaces auto-release.sh
├── build.js                  # Replaces build.sh
├── clean.js                  # Replaces clean.sh
├── commit-helper.js          # Replaces commit-helper.sh
├── deploy.js                 # Replaces deploy.sh
├── project-detector.js       # Replaces project-detector.sh
├── setup-automation.js       # Replaces setup-automation.sh
├── setup.js                  # Replaces setup.sh
├── version-manager.js        # Replaces version-manager.js
└── legacy/                   # Archived bash scripts
    ├── auto-release.sh
    ├── build.sh
    ├── clean.sh
    ├── commit-helper.sh
    ├── deploy.sh
    ├── project-detector.sh
    ├── setup-automation.sh
    ├── setup.sh
    └── version-manager.sh
```

### **Updated Files**
- [ ] **package.json**: Updated scripts section and dependencies
- [ ] **README.md**: Updated usage examples
- [ ] **docs/usage.md**: Updated script documentation
- [ ] **Memory Bank**: Updated with new script locations

---

## 🚨 **VALIDATION REQUIRED**

**✋ STOP!** Don't start implementation without explicit validation.

**This plan proposes converting all bash scripts to Node.js for universal compatibility.**

**Options for validation:**
- **"OK"** - Proceed with Node.js conversion as planned
- **"Option B"** - Use PowerShell Core instead
- **"Option C"** - Use hybrid wrapper system
- **"Modify"** - Suggest changes to the approach

**Status**: ⏳ **WAITING FOR VALIDATION**

---

*Plan created automatically according to cursor-rules methodology* 