# פתרון בעיית Cache - Timer 24H Card

## 🎯 מה השתנה?

הוספתי רישום אוטומטי של ה-Lovelace resource עם **cache busting** - כלומר, בכל עדכון הדפדפן יידע שצריך לטעון את הגירסה החדשה.

## 📝 השינויים שבוצעו

### 1. קריאת גירסה אוטומטית
האינטגרציה קוראת את מספר הגירסה מ-`manifest.json` (כרגע: `4.6.7`)

### 2. רישום Resource אוטומטי
הוספתי פונקציה חדשה `_async_register_lovelace_resource` ש:
- בודקת אם ה-resource כבר קיים
- מעדכנת אותו עם הגירסה החדשה (או יוצרת אחד חדש)
- מוסיפה `?v=4.6.7` ל-URL כדי לעקוף את ה-cache

### 3. Cache Busting
ה-URL כעת נראה כך:
```
/local/timer-24h-card/timer-24h-card.js?v=4.6.7
```

בכל פעם שתעדכן את `manifest.json` לגירסה חדשה, ה-URL ישתנה והדפדפן יטען את הקובץ החדש!

## 🚀 איך זה עובד?

1. **התקנה ראשונה**: האינטגרציה רושמת אוטומטית את ה-resource
2. **עדכון**: בכל פעם שתעדכן את `manifest.json` עם גירסה חדשה, ה-resource יתעדכן
3. **ללא Cache**: הדפדפן יראה URL שונה ויטען את הקובץ החדש

## 📋 מה צריך לעשות אחרי העדכון?

### אם כבר יש לך resource ידני:
1. עבור ל: `Settings → Dashboards → Resources`
2. **מחק** את ה-resource הישן של `timer-24h-card.js`
3. אתחל מחדש את Home Assistant
4. האינטגרציה תרשום אוטומטי את ה-resource החדש עם cache busting

### אם זו התקנה ראשונה:
1. אתחל מחדש את Home Assistant
2. ה-resource ירשם אוטומטית!

## ⚠️ הערה חשובה

לפעמים ה-Lovelace resource collection לא זמין בזמן ה-`async_setup`. במקרה כזה:
- תראה הודעה ב-log: "Lovelace not fully loaded yet"
- **פתרון**: אתחל שוב את Home Assistant או הוסף ידנית

## 🔄 אחרי כל עדכון קוד:

1. **עדכן את `manifest.json`**:
   ```json
   {
     "version": "4.6.8"  // שנה את המספר
   }
   ```

2. **העתק את הקבצים** לתיקיית Home Assistant

3. **אתחל** את Home Assistant

4. **רענן את הדפדפן** עם `Ctrl + Shift + R`

## 🎉 יתרונות

✅ אין צורך להוסיף resource ידנית  
✅ עדכונים אוטומטיים עם כל גירסה חדשה  
✅ פתרון בעיית Cache המעצבנת  
✅ המשתמש רואה את העדכון מיד (אחרי hard refresh)  

## 🐛 בעיות? Debug

בדוק ב-Home Assistant logs:
```
Settings → System → Logs
```

חפש הודעות של:
- `Timer 24H Card v4.6.7 installed successfully`
- `Registered Timer 24H Card resource version 4.6.7`
- `Updated Timer 24H Card resource to version 4.6.7`

---

**נוצר על ידי: עדכון אוטומטי של Timer 24H Integration**

