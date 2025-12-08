# 🧪 Beta Release v1.1.0-beta.1 - הוראות יצירה

## 📝 פרטי Release ב-GitHub

### 1. פתח את דף ה-Releases:
```
https://github.com/davidss20/home-assistant-24h-timer-integration/releases/new
```

### 2. בחר את התג:
**Choose a tag:** `v1.1.0-beta.1` (מהרשימה)

### 3. מלא את הפרטים:

**Release title:**
```
v1.1.0-beta.1 - Beta Release 🧪
```

**Description (העתק את זה):**
```markdown
## 🧪 Beta Release - Test Version

**⚠️ This is a BETA version for testing purposes. Please report any issues!**

This beta introduces improvements and prepares for the upcoming v1.1.0 release.

### ✨ Added
- 🎨 **Custom icon support** - Added official icon to Home Assistant Brands (pending approval)
- 📝 **Enhanced documentation** - Added comprehensive guides for HACS submission and beta testing
- 🔧 **Developer tooling** - Added helper files for release management
- 🖼️ **High-resolution icons** - Added @2x icons for better display on high-DPI screens

### 🔄 Changed
- 📦 Improved project structure with better documentation organization
- 🗂️ Better .gitignore configuration
- 🎨 Icons optimized to correct dimensions (256x256 and 512x512)

### 🐛 Fixed
- 📐 Icon dimensions now meet Home Assistant Brands requirements

### 🧪 Testing Notes
- **Icon display**: Once the Brands PR is approved, the custom icon will appear automatically
- **Stability**: All core functionality from v1.0.0 is maintained
- **Performance**: No known regressions
- **Branch**: Available on `beta/1.1.0` branch

---

## 📥 How to Install Beta

### Via HACS (Recommended):
1. Go to **HACS** → **Integrations**
2. Find **Timer 24H Integration**
3. Click **⋮** (three dots) → **Redownload**
4. Select version: **`v1.1.0-beta.1`** from dropdown
5. Click **Install**
6. **Restart Home Assistant**

### Via Custom Repository:
If not already added to HACS, add as custom repository:
1. HACS → ⋮ → Custom repositories
2. Repository: `https://github.com/davidss20/home-assistant-24h-timer-integration`
3. Category: Integration
4. Then follow steps above

### Manual Installation:
```bash
# Download beta
wget https://github.com/davidss20/home-assistant-24h-timer-integration/archive/refs/tags/v1.1.0-beta.1.zip

# Extract to custom_components/timer_24h
# Restart Home Assistant
```

---

## 🧪 How to Test

1. **Install beta version** (see above)
2. **Verify all existing functionality works:**
   - Create new timer
   - Toggle time slots
   - Test activation conditions
   - Check entity control
3. **Check for errors** in Home Assistant logs
4. **Report issues**: https://github.com/davidss20/home-assistant-24h-timer-integration/issues
   - Use label: `beta`
   - Include: HA version, error logs, steps to reproduce

---

## 🔙 Rollback Instructions

If you encounter issues, you can easily rollback to stable:

1. **HACS** → **Integrations** → **Timer 24H**
2. Click **⋮** → **Redownload**
3. Select version: **`v1.0.0`** (Latest - Stable)
4. Click **Install**
5. **Restart Home Assistant**

Your configuration and data will be preserved!

---

## 🐛 Known Issues

None currently. Please report any you find!

---

## 📊 Beta Testing Goals

We need your help to test:
- ✅ Core functionality (timer, slots, conditions)
- ✅ Entity control works correctly
- ✅ No errors in logs
- ✅ Card displays properly
- ✅ Multi-language support

---

## 🙏 Thank You

Thank you for helping test this beta! Your feedback makes Timer 24H better for everyone.

---

**Full Changelog**: https://github.com/davidss20/home-assistant-24h-timer-integration/blob/beta/1.1.0/CHANGELOG.md
```

### 4. הגדרות חשובות:

**✅ חובה לסמן:**
```
☑️ Set as a pre-release
```

**⬜ אל תסמן:**
```
☐ Set as the latest release
```

### 5. לחץ על:
```
Publish release
```

---

## ✅ אחרי הפרסום

### איך זה ייראה ב-Releases:

```
🟢 Latest    v1.0.0 - First Official HACS Release
🟡 Pre-release    v1.1.0-beta.1 - Beta Release 🧪
```

### איך משתמשים יראו את זה ב-HACS:

**גרסאות זמינות:**
- `v1.0.0` - Latest (ברירת מחדל) 🟢
- `v1.1.0-beta.1` - Pre-release 🟡
- `main` - Branch

---

## 🎯 מבנה ה-Repository עכשיו:

```
Branches:
├── main           → v1.0.0 (Stable)
└── beta/1.1.0     → v1.1.0-beta.1 (Beta)

Tags:
├── v1.0.0         → Latest Release
└── v1.1.0-beta.1  → Pre-release

Releases:
├── v1.0.0 (Latest)
└── v1.1.0-beta.1 (Pre-release)
```

---

## 🔄 תהליך המשך פיתוח:

### עבודה על הבטא:
```bash
git checkout beta/1.1.0
# עשה שינויים
git commit -m "fix: some bug"
git push origin beta/1.1.0

# צור beta.2
# עדכן גרסה ל-1.1.0-beta.2
git tag v1.1.0-beta.2
git push origin v1.1.0-beta.2
# צור Release חדש
```

### כש-Beta מוכנה:
```bash
# מזג ל-main
git checkout main
git merge beta/1.1.0

# עדכן גרסה ל-1.1.0 (ללא beta)
# צור Release רשמי v1.1.0 (ללא pre-release)
```

---

## 📱 הודעה לקהילה (אופציונלי)

אם יש לך Discord/Forum/Reddit, תוכל לפרסם:

```markdown
🧪 Beta v1.1.0-beta.1 is now available for testing!

Help us test the upcoming v1.1.0 release:
- Custom icon support (pending Brands approval)
- Enhanced documentation
- Icon improvements

Install via HACS → Select v1.1.0-beta.1 from version dropdown

Report issues: [GitHub Issues link]

Thank you for testing! 🙏
```

---

**עכשיו לך ליצור את ה-Release!** 🚀

