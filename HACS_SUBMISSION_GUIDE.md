# מדריך הגשה ל-HACS - התהליך המעודכן

## ⚠️ חשוב להבין!

HACS השתנה בשנים האחרונות. היום **אין צורך להגיש אינטגרציה ל-HACS Default Repository**!

---

## 🎯 **2 אפשרויות להשתמש ב-HACS:**

### **אפשרות 1: Custom Repository (מומלץ להתחלה!) ✅**

משתמשים יכולים להוסיף את האינטגרציה שלך ישירות ב-HACS כ-**Custom Repository**:

#### **הוראות למשתמשים:**

1. פתח את HACS ב-Home Assistant
2. לחץ על **Integrations**
3. לחץ על **⋮** (שלוש הנקודות) בפינה הימנית העליונה
4. בחר **Custom repositories**
5. הוסף:
   - **Repository**: `https://github.com/davidss20/home-assistant-24h-timer-integration`
   - **Category**: `Integration`
6. לחץ **Add**
7. חפש "Timer 24H" ב-HACS והתקן!

**זה הדרך הכי מהירה להתחיל!** 🚀

---

### **אפשרות 2: הוספה ל-HACS Default Repository**

זה התהליך להפוך את האינטגרציה לזמינה לכולם ב-HACS Default.

#### **דרישות מקדימות:**

- ✅ המאגר חייב להיות ציבורי (יש לך!)
- ✅ יש קובץ `hacs.json` תקין (יש לך!)
- ✅ יש `manifest.json` תקין (יש לך!)
- ✅ יש לפחות release אחד (יש לך - v1.0.0!)
- ✅ יש LICENSE (יש לך!)
- ✅ יש README מפורט (יש לך!)
- ✅ **חדש**: צריך להוסיף ל-Home Assistant Brands

---

## 📦 **שלב 1: הוסף ל-Home Assistant Brands (חובה מ-2024!)**

לפני שאפשר להיות ב-HACS Default, חייבים להיות ב-Home Assistant Brands:

### **מה זה Brands?**
זה מאגר שמכיל את הלוגו והמידע של כל האינטגרציות ב-Home Assistant.

### **איך להוסיף:**

1. **Fork את המאגר:**
   ```
   https://github.com/home-assistant/brands
   ```

2. **צור תיקייה חדשה:**
   ```
   brands/custom_integrations/timer_24h/
   ```

3. **הוסף קובץ `manifest.json`:**
   ```json
   {
     "domain": "timer_24h",
     "name": "Timer 24H",
     "documentation": "https://github.com/davidss20/home-assistant-24h-timer-integration",
     "codeowners": ["@davidss20"]
   }
   ```

4. **הוסף לוגו:**
   - קובץ: `icon.png` (256x256 pixels)
   - או: `logo.png` (256x256 pixels)

5. **צור Pull Request:**
   - כותרת: `Add Timer 24H integration`
   - תיאור: "Adding Timer 24H custom integration to brands"

6. **המתן לאישור** (בדרך כלל כמה ימים)

---

## 📝 **שלב 2: הגש ל-HACS Default (אחרי ה-Brands!)**

**רק אחרי שה-PR ב-Brands אושר**, אפשר להגיש ל-HACS:

### **דרך 1: Pull Request (מומלץ)**

1. **Fork את המאגר:**
   ```
   https://github.com/hacs/default
   ```

2. **ערוך את הקובץ המתאים:**
   ```
   integration
   ```

3. **הוסף את המאגר שלך בסדר אלפביתי:**
   ```
   davidss20/home-assistant-24h-timer-integration
   ```

4. **צור Pull Request:**
   - כותרת: `Add Timer 24H Integration`
   - תיאור: תיאור קצר של האינטגרציה

### **דרך 2: טופס הגשה (חדש)**

אם יש טופס רשמי - השתמש בו:
```
https://github.com/hacs/default/issues/new/choose
```

בחר בטמפלייט המתאים להוספת אינטגרציה.

---

## ⏰ **זמני המתנה:**

- **Brands PR**: 2-7 ימים
- **HACS PR**: 1-4 שבועות (אחרי ש-Brands אושר)

---

## 🚀 **המלצה שלי:**

### **להתחיל:**
1. עדכן את ה-README עם הוראות "Custom Repository"
2. פרסם את האינטגרציה לקהילה (פורומים, Reddit, וכו')
3. תן למשתמשים להתקין דרך Custom Repository

### **בהמשך:**
1. הוסף ל-Home Assistant Brands
2. אחרי אישור - הגש ל-HACS Default
3. תהנה מחשיפה רחבה יותר!

---

## 📚 **קישורים שימושיים:**

- **HACS Documentation**: https://hacs.xyz/docs/publish/integration
- **Home Assistant Brands**: https://github.com/home-assistant/brands
- **HACS Default**: https://github.com/hacs/default
- **HACS Discord**: https://discord.gg/apgchf8

---

## ✅ **מה יש לך עכשיו:**

- ✅ Repository מושלם עם כל הקבצים הנדרשים
- ✅ Release v1.0.0 מוכן
- ✅ תיעוד מעולה
- ✅ 8 שפות!
- ✅ Workflow בדיקות

**האינטגרציה שלך מוכנה לשימוש דרך Custom Repository ממש עכשיו!** 🎉

---

## 🎯 **הצעד הראשון שלך:**

עדכן את ה-README עם הוראות התקנה דרך Custom Repository, כך שמשתמשים יוכלו להתחיל להשתמש באינטגרציה שלך **עכשיו**, לפני כל התהליך הבירוקרטי!

רוצה שאעזור לעדכן את ה-README? 📝

