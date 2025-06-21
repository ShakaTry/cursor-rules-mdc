# 🔗 INSTALLATION MCP GITHUB - USAGE PERSONNEL

**Objectif** : Installer MCP GitHub dans Cursor IDE pour votre usage personnel  
**Durée** : 30 minutes maximum  
**Contexte** : Installation simple, pas d'intégration projet

## 🎯 **CE QU'ON VA FAIRE**

Installer le serveur MCP GitHub officiel pour pouvoir faire ça dans Cursor :
```
"List my repositories"
"Create an issue in cursor-rules"
"Show recent commits"
```

Au lieu de taper des commandes `gh` dans le terminal.

## 📋 **PLAN EN 3 ÉTAPES SIMPLES**

### **ÉTAPE 1 : Vérification rapide (5 min)**

**🤖 Je vérifie avec vous :**
```bash
# Version Cursor (doit être récente pour MCP)
# Dans Cursor : Help → About

# GitHub CLI fonctionne
gh auth status

# NPX disponible
npx --version
```

### **ÉTAPE 2 : Installation MCP (15 min)**

**👤 Vous faites :**
```bash
# Installer le serveur MCP GitHub
npx -y @modelcontextprotocol/server-github
```

**🤖 Je crée le fichier config :**
`.cursor/mcp.json` avec votre token GitHub

**👤 Vous créez un token GitHub :**
1. https://github.com/settings/tokens
2. "Generate new token (classic)"  
3. Cocher : `repo`, `workflow`, `user`
4. Copier le token

### **ÉTAPE 3 : Test (10 min)**

**👤 Vous testez :**
1. Redémarrer Cursor IDE
2. Ouvrir le Chat
3. Taper : "List my repositories"
4. Voir si ça marche !

**🤖 Si ça marche pas :**
- Je vous aide à debugger la config
- On vérifie les logs MCP
- On teste différemment

## ✅ **RÉSULTAT ATTENDU**

Après 30 min, vous pouvez dans Cursor Chat :
- "Show my repos"
- "Create issue in [repo]"  
- "List recent commits"
- Et plein d'autres trucs GitHub

**C'est tout !** Pas de modification du projet cursor-rules, juste votre installation perso.

---

**PRÊT À COMMENCER ?** 🚀

*Installation personnelle simple - on complique rien !* 