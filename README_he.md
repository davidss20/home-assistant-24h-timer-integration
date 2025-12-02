# Timer 24H Integration - אינטגרציה לטיימר 24 שעות

<div align="center">

![Timer 24H Icon](https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/icon.svg)

[![HACS](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=blue)](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
[![License](https://img.shields.io/github/license/davidss20/home-assistant-24h-timer-integration.svg?style=for-the-badge&color=green)](LICENSE)

</div>

אינטגרציה מותאמת ל-Home Assistant המאפשרת יצירת טיימרים יומיים עם שליטה אוטומטית על ישויות.

<div align="center">

![Timer 24H Preview](https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/images/preview.jpg)

*טיימר מעגלי 24 שעות עם שליטה אוטומטית וזיהוי נוכחות בבית*

</div>

## ✨ תכונות עיקריות

- **🕐 טיימר מעגלי 24 שעות** עם פלחים של חצי שעה
- **🏠 זיהוי נוכחות בבית** - ישויות יופעלו רק כאשר אתם בבית
- **🔧 שליטה אוטומטית על ישויות** לפי לוח הזמנים
- **🎯 מספר instances** - צרו כמה טיימרים שתרצו
- **💾 שמירת מצב** - הגדרות נשמרות אוטומטית
- **🌍 תמיכה רב-לשונית** עם תמיכה ב-RTL
- **⚙️ קל להתקנה** - התקנה אחת כוללת את הכל

## 📥 התקנה

### דרך HACS (מומלץ)

1. פתח את HACS ב-Home Assistant
2. לחץ על "Integrations"
3. לחץ על הכפתור "+" בפינה הימנית התחתונה
4. חפש "Timer 24H Integration"
5. לחץ על "Install"
6. **אתחל את Home Assistant**

### התקנה ידנית

1. הורד את הגרסה האחרונה מ-[GitHub Releases](https://github.com/davidss20/home-assistant-24h-timer-integration/releases)
2. חלץ את תיקיית `custom_components/timer_24h` לתוך התיקייה `config/custom_components/`
3. **אתחל את Home Assistant**

## 🚀 שימוש

### הוספת טיימר חדש

1. עבור ל-**Settings → Devices & Services**
2. לחץ על **"+ Add Integration"**
3. חפש **"Timer 24H"**
4. הזן את הפרטים:
   - **שם הטיימר** (לדוגמה: "תאורה", "דוד שמש")
   - **בחר ישויות לשליטה** (lights, switches, fans וכו')
   - **חיישני נוכחות בבית** (אופציונלי)
   - **לוגיקת חיישנים** (OR/AND)
5. לחץ על **"Submit"**

הטיימר נוצר! עכשיו תוכל להוסיף את הכרטיס ללוח הבקרה.

### הוספת הכרטיס ללוח הבקרה

הכרטיס מותקן אוטומטית עם האינטגרציה.

#### דרך הממשק הגרפי

1. עבור למצב עריכה בלוח הבקרה
2. לחץ על **"Add Card"**
3. חפש **"Timer 24H Card"**
4. בחר את ישות הטיימר שיצרת
5. התאם הגדרות נוספות (אופציונלי)

#### דרך YAML

```yaml
type: custom:timer-24h-card
entity: sensor.timer_24h_lighting  # הישות שהאינטגרציה יצרה
show_title: true  # הצג את שם הטיימר בחלק העליון
```

## ⚙️ אפשרויות תצורה

### הגדרות האינטגרציה

| שם | סוג | נדרש | תיאור |
|----|-----|------|-------|
| `name` | string | ✅ | שם הטיימר |
| `entities` | list | ❌ | רשימת ישויות לשליטה אוטומטית |
| `home_sensors` | list | ❌ | חיישנים לזיהוי נוכחות בבית |
| `home_logic` | string | ❌ | לוגיקת חיישנים: OR או AND |

### הגדרות הכרטיס

| שם | סוג | ברירת מחדל | תיאור |
|----|-----|------------|-------|
| `entity` | string | - | ישות הטיימר (נדרש) |
| `show_title` | boolean | `true` | הצג כותרת |

### סוגי ישויות נתמכות לשליטה

- `light.*` - תאורה
- `switch.*` - מתגים
- `fan.*` - מאווררים
- `climate.*` - מיזוג אוויר
- `media_player.*` - נגני מדיה
- `cover.*` - תריסים וכיסויים
- `input_boolean.*` - מתגים וירטואליים

### סוגי חיישנים נתמכים לזיהוי נוכחות

- `person.*` - אנשים
- `device_tracker.*` - מעקב מכשירים
- `binary_sensor.*` - חיישנים בינאריים
- `sensor.*` - חיישנים כלליים
- `input_boolean.*` - מתגים וירטואליים

## 🎯 איך זה עובד?

1. **🎨 הגדרת זמנים**: לחץ על פלחים במעגל או על המשולש המצביע
   - **מעגל חיצוני**: שעות מלאות (00:00, 01:00 וכו')
   - **מעגל פנימי**: חצאי שעות (00:30, 01:30 וכו')

2. **🏠 זיהוי נוכחות**: האינטגרציה בודקת את החיישנים המוגדרים כל דקה
   - **OR**: לפחות חיישן אחד חייב להיות פעיל
   - **AND**: כל החיישנים חייבים להיות פעילים

3. **🔧 שליטה על ישויות**: אם אתם בבית והזמן פעיל, הישויות יופעלו אוטומטית

4. **💾 שמירה**: ההגדרות נשמרות אוטומטית באינטגרציה

## 🎨 מראה הכרטיס

- **🟢 ירוק**: פלחים פעילים
- **⚪ אפור**: פלחים לא פעילים
- **🔵 כחול**: הפלח הנוכחי (מסגרת כחולה)
- **🟢 ירוק**: מצב מערכת פעיל (בבית)
- **🟡 צהוב**: מצב מערכת לא פעיל (לא בבית)

## 🔧 Services

האינטגרציה מספקת services לשליטה בטיימר:

### `timer_24h.toggle_slot`

החלף מצב של פלח זמן ספציפי.

```yaml
service: timer_24h.toggle_slot
data:
  entity_id: sensor.timer_24h_lighting
  hour: 14
  minute: 30  # 0 או 30
```

### `timer_24h.set_slots`

הגדר מספר פלחי זמן בבת אחת.

```yaml
service: timer_24h.set_slots
data:
  entity_id: sensor.timer_24h_lighting
  slots:
    - hour: 14
      minute: 0
      isActive: true
    - hour: 14
      minute: 30
      isActive: true
    - hour: 15
      minute: 0
      isActive: false
```

### `timer_24h.clear_all`

נקה את כל פלחי הזמן.

```yaml
service: timer_24h.clear_all
data:
  entity_id: sensor.timer_24h_lighting
```

## 📋 דוגמאות

### טיימר תאורה פשוט

```yaml
# הוסף דרך UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "תאורה"
# Entities: light.living_room, light.kitchen
```

### טיימר מתקדם עם זיהוי נוכחות

```yaml
# הוסף דרך UI:
# Settings → Integrations → Add Integration → Timer 24H
# Name: "מערכת בית חכם"
# Entities: light.all_lights, switch.water_heater, climate.living_room
# Home Sensors: person.john, person.jane, binary_sensor.motion_entrance
# Logic: OR
```

### אוטומציה עם הטיימר

```yaml
automation:
  - alias: "הודעה כאשר הטיימר מופעל"
    trigger:
      - platform: state
        entity_id: sensor.timer_24h_lighting
        to: "active"
    action:
      - service: notify.mobile_app
        data:
          message: "הטיימר הופעל - התאורה נדלקה"
```

## 🔄 עדכון ההגדרות

ניתן לשנות את הגדרות הטיימר בכל עת:

1. עבור ל-**Settings → Devices & Services**
2. מצא את **"Timer 24H"**
3. לחץ על **"Configure"** (⚙️)
4. ערוך את ההגדרות
5. לחץ על **"Submit"**

## 🌍 תמיכה בעברית

האינטגרציה כוללת תמיכה מלאה בעברית:

- **📝 ממשק בעברית** - כל הטקסטים בעברית
- **🔄 תמיכה ב-RTL** - כיוון טקסט מימין לשמאל
- **⚙️ עורך בעברית** - ממשק הגדרה בעברית

## 🔧 פתרון בעיות

### הכרטיס לא מופיע

1. וודא שההתקנה בוצעה דרך HACS או ידנית
2. אתחל את Home Assistant
3. נקה את מטמון הדפדפן (Ctrl+F5)

### הטיימר לא מופעל

1. בדוק שיש ישות טיימר תקינה
2. ודא שההגדרות נכונות ב-Configuration
3. בדוק את ה-logs: Settings → System → Logs

### הישויות לא מופעלות

1. ודא שהישויות קיימות וזמינות
2. בדוק שהחיישנים מחזירים ערכים נכונים
3. ודא שאתה "בבית" לפי החיישנים
4. בדוק את לוגים של Home Assistant

## 🆘 תמיכה

- **🐛 דיווח על באגים**: [GitHub Issues](https://github.com/davidss20/home-assistant-24h-timer-integration/issues)
- **💡 בקשות לתכונות**: [GitHub Discussions](https://github.com/davidss20/home-assistant-24h-timer-integration/discussions)
- **📖 תיעוד נוסף**: [Wiki](https://github.com/davidss20/home-assistant-24h-timer-integration/wiki)

## 🤝 תרומה

תרומות מתקבלות בברכה! אנא הגישו Pull Request.

## 📄 רישיון

פרויקט זה ברישיון MIT - ראה את קובץ [LICENSE](LICENSE) לפרטים.

---

**נוצר באהבה עבור קהילת Home Assistant** 🏠❤️

