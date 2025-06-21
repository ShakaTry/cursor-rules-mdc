# 🔄 PLAN : Intégration Versioning Automatique - Smart Commit

**Objectif :** Intégrer le versioning sémantique automatique dans le workflow smart commit pour une gestion des versions entièrement automatisée.

**Date :** 2025-06-21  
**Status :** 📋 TODO  
**Priorité :** 🔥 CRITIQUE  
**Dépendances :** Smart Commit Tests Integration

---

## 🎯 **VISION GLOBALE**

### **🚀 Workflow Automatisé Complet**
```bash
# Commande unique = Analyse + Tests + Commit + Version + Release
npm run cursor-tools -- commit --smart --auto-version

🧠 Analyzing changes...
📋 Detected: feat(auth) - confidence 94%
🧪 Running tests... ✅ All passed (87% coverage)
📦 Version bump: 1.2.3 → 1.3.0 (minor)
🏷️ Creating tag: v1.3.0
🚀 Commit + Tag created successfully!
💡 Ready for release: npm run cursor-tools -- release
```

---

## 🔍 **ANALYSE STRATÉGIQUE**

### **✅ Assets Existants**
- ✅ Smart commit type detection (feat, fix, docs, etc.)
- ✅ Conventional commits validation
- ✅ Version-manager.js script existant
- ✅ Configuration .automation-config.yml 
- ✅ Release workflows GitHub Actions

### **❌ Gaps Critiques**
- ❌ **Pas de liaison** commit type → version bump
- ❌ **Pas d'automatisation** de la création des tags
- ❌ **Pas de workflow unifié** commit+version
- ❌ **Pas de gestion** breaking changes → major

### **🎯 Objectif Final**
**UN SEUL POINT D'ENTRÉE** pour : Commit → Version → Tag → Release

---

## 🏗️ **ARCHITECTURE SOLUTION**

### **1. Smart Version Detector**
```javascript
class SmartVersionDetector {
  // Analyse du type de commit → type de bump
  detectVersionBump(commitType, isBreaking, commitBody) {
    // feat = minor, fix = patch, feat! = major
  }
  
  // Calcul de la prochaine version
  calculateNextVersion(currentVersion, bumpType) {
    // 1.2.3 + minor = 1.3.0
  }
  
  // Détection des breaking changes
  detectBreakingChanges(commitMsg, diffContent) {
    // Analyse du contenu pour breaking changes
  }
}
```

### **2. Integration dans Smart Commit**
```javascript
class SmartCommitWithVersioning {
  async smartCommitWithVersioning(options = {}) {
    1. 🧠 Smart commit detection (existant)
    2. 🧪 Tests execution (en cours)
    3. 📦 Version calculation (NOUVEAU)
    4. 🏷️ Tag creation (NOUVEAU)  
    5. 🚀 Commit with version (NOUVEAU)
    6. 📋 Release preparation (NOUVEAU)
  }
}
```

### **3. Configuration Avancée**
```yaml
# .automation-config.yml extension
versioning:
  # Mode automatique
  auto_version:
    enabled: true
    strict_mode: false  # true = always bump version
    
  # Rules de mapping commit → version
  bump_rules:
    feat: "minor"       # 1.2.3 → 1.3.0
    fix: "patch"        # 1.2.3 → 1.2.4
    perf: "patch"       # 1.2.3 → 1.2.4
    docs: "patch"       # 1.2.3 → 1.2.4
    breaking: "major"   # 1.2.3 → 2.0.0 (feat!, fix!, etc.)
    
  # Breaking change detection
  breaking_patterns:
    - "BREAKING CHANGE:"
    - "BREAKING-CHANGE:"
    - "!:" # feat!: description
    
  # Tag configuration  
  tags:
    prefix: "v"         # v1.2.3
    create_tag: true
    push_tag: true
    
  # Release automation
  auto_release:
    enabled: false      # true = auto-release après version
    draft: true         # GitHub draft release
```

---

## 📋 **PHASES D'IMPLÉMENTATION**

### **🔥 PHASE 1 : Smart Version Detection (3h)**
- [ ] Créer `scripts/lib/smart-version-detector.js`
- [ ] Mapping commit types → version bumps
- [ ] Détection breaking changes intelligente
- [ ] Calcul automatique prochaine version
- [ ] Tests unitaires complets

### **🚀 PHASE 2 : Integration Commit Workflow (4h)**
- [ ] Modifier `scripts/commit-helper.js`
- [ ] Ajouter options `--auto-version`, `--version-bump`
- [ ] Workflow commit + version + tag
- [ ] Gestion des conflits et rollbacks
- [ ] Messages intelligents pour les users

### **⚙️ PHASE 3 : Configuration & CLI (2h)**
- [ ] Étendre `.automation-config.yml` avec section versioning
- [ ] Options CLI avancées : `--major`, `--minor`, `--patch`
- [ ] Mode preview : `--dry-run-version`
- [ ] Override manual du version bump

### **🏷️ PHASE 4 : Tags & GitHub Integration (3h)**
- [ ] Création automatique des tags Git
- [ ] Push tags vers remote
- [ ] Integration avec GitHub Releases API
- [ ] Génération automatique release notes
- [ ] Liens avec PRs et issues

### **📊 PHASE 5 : Advanced Features (3h)**
- [ ] Pre-release versions (alpha, beta, rc)
- [ ] Hotfix workflow spécialisé  
- [ ] Version branching strategies
- [ ] Changelog automatique avancé
- [ ] Notifications et webhooks

---

## 🎯 **WORKFLOWS CIBLES**

### **Mode Auto-Version (Standard)**
```bash
npm run cursor-tools -- commit --smart --auto-version

🧠 Smart analysis...
  Type: feat(auth) - 89% confidence
  Breaking: No
  Tests: ✅ Passed
📦 Version calculation...
  Current: 1.2.3
  Bump: minor (feat detected)
  Next: 1.3.0
🏷️ Creating tag v1.3.0...
🚀 Commit successful: feat(auth): add OAuth support
💡 Next: Run release workflow
```

### **Mode Manual Override**
```bash
npm run cursor-tools -- commit --smart --version-bump major

🧠 Smart analysis...
  Type: feat(auth) - 89% confidence  
  Override: MAJOR bump requested
📦 Version calculation...
  Current: 1.2.3 → 2.0.0 (MAJOR)
⚠️  Major version! Confirm? (y/N)
```

### **Mode Preview**
```bash
npm run cursor-tools -- commit --smart --dry-run-version

🧠 Smart analysis...
  Type: feat(auth) - 89% confidence
📦 Version preview...
  Current: 1.2.3
  Would bump: minor → 1.3.0
  Tag: v1.3.0
⚡ No changes made (dry-run)
```

---

## 🔧 **DÉTAILS TECHNIQUES**

### **Semantic Version Logic** 
```javascript
class VersionBumper {
  calculateBump(commitType, isBreaking, currentVersion) {
    if (isBreaking) return 'major';
    
    const bumpMap = {
      feat: 'minor',
      fix: 'patch', 
      perf: 'patch',
      docs: 'patch',
      build: 'patch',
      ci: 'patch'
    };
    
    return bumpMap[commitType] || 'patch';
  }
  
  applyBump(version, bumpType) {
    const [major, minor, patch] = version.split('.').map(Number);
    
    switch(bumpType) {
      case 'major': return `${major + 1}.0.0`;
      case 'minor': return `${major}.${minor + 1}.0`;
      case 'patch': return `${major}.${minor}.${patch + 1}`;
    }
  }
}
```

### **Breaking Change Detection**
```javascript
detectBreakingChanges(commitMsg, diffContent) {
  // 1. Explicit markers
  if (/BREAKING CHANGE:|!:/.test(commitMsg)) return true;
  
  // 2. API changes in diff
  const apiBreakingPatterns = [
    /^-.*export (class|function|const)/m,  // Removed exports
    /^-.*public \w+/m,                     // Removed public methods
    /interface \w+.*{[^}]*^-/m             // Modified interfaces
  ];
  
  return apiBreakingPatterns.some(pattern => pattern.test(diffContent));
}
```

---

## 📈 **BÉNÉFICES BUSINESS**

### **🚀 Productivité Developer**
- **1 commande** au lieu de 5-10 étapes manuelles
- **Zéro oubli** de version ou tag
- **Standardisation** workflow équipe
- **Traçabilité** automatique complète

### **🎯 Qualité Release**
- **Semantic versioning** respecté à 100%
- **Breaking changes** détectés automatiquement
- **Release notes** générées automatiquement
- **Rollback** facilité avec tags précis

### **📊 Metrics & Governance**
- **Vélocité** releases mesurée automatiquement
- **Impact** features trackées via versions
- **Compliance** standards respectés
- **Audit trail** complet Git + GitHub

---

## 🛠️ **COMMANDES FINALES**

```bash
# Basic auto-versioning
npm run cursor-tools -- commit --smart --auto-version

# With specific bump type
npm run cursor-tools -- commit --smart --version-bump minor

# Preview mode
npm run cursor-tools -- commit --smart --dry-run-version

# Full workflow (commit + version + release)
npm run cursor-tools -- commit --smart --auto-version --auto-release

# Hotfix workflow
npm run cursor-tools -- commit --smart --hotfix

# Pre-release workflow
npm run cursor-tools -- commit --smart --pre-release alpha
```

---

## 🔗 **INTÉGRATIONS**

### **Avec Smart Commit Tests**
```javascript
// Workflow complet
async smartCommitFullWorkflow() {
  1. 🧠 Smart commit detection
  2. 🧪 Tests execution
  3. 📦 Version calculation  
  4. 🏷️ Tag creation
  5. 🚀 Commit with metadata
  6. 📋 Release preparation
}
```

### **Avec CI/CD GitHub**
```yaml
# .github/workflows/auto-release.yml (trigger sur tag)
on:
  push:
    tags: ['v*']
    
jobs:
  auto-release:
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub Release
        uses: actions/create-release@v1
```

---

## 🎯 **SUCCESS METRICS**

### **Phase 1 Success**
- [ ] Version bump automatique fonctionne
- [ ] Breaking changes détectés correctement
- [ ] Tags créés automatiquement

### **Phase Final Success**  
- [ ] **Workflow 1-commande** : commit → version → tag → release
- [ ] **Zero manual intervention** pour releases standard
- [ ] **100% semantic versioning** compliance
- [ ] **Developer happiness** score > 9/10

---

## 🚀 **NEXT STEPS**

1. **Finaliser** Smart Commit Tests Integration (dépendance)
2. **Phase 1** : Smart Version Detector (3h)
3. **Phase 2** : Workflow Integration (4h) 
4. **Test** sur cursor-rules project
5. **Documentation** et rollout équipe

**Estimation totale : 15h développement**  
**Impact : Workflow productivity +500%** 🚀

---

**Ready to revolutionize version management? 🔥**

*Note: Ce plan s'appuie sur les assets existants (version-manager.js, .automation-config.yml) et s'intègre parfaitement avec le Smart Commit Tests Integration en cours.* 