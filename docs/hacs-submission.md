# HACS Submission Template

Copy and paste this when submitting to HACS:
https://github.com/hacs/default/issues/new?template=integration.yml

---

## 📌 Issue Title (כותרת ה-Issue):

```
Add Timer 24H Integration
```

או באנגלית מפורטת יותר:
```
Add Timer 24H Integration - 24-hour visual timer with automatic entity control
```

---

## Repository Information

**Repository URL:**
```
https://github.com/davidss20/home-assistant-24h-timer-integration
```

**Category:** Integration

**Description:**
```
A powerful 24-hour visual timer with automatic entity control for Home Assistant.

Features:
• 24-hour circular timer interface with half-hour precision
• Smart activation conditions (home presence, Shabbat mode, vacation, custom sensors)
• Automatic entity control (lights, switches, fans, climate, covers, etc.)
• Event-driven architecture for instant response (no polling delays)
• Real-time visual status indicators
• Multi-language support (8 languages: EN, HE, ES, FR, DE, IT, NL, PL)
• Automatic Lovelace card installation with cache busting
• Multiple timer instances support
• RTL support for Hebrew and other RTL languages

Perfect for:
- Water heater scheduling
- Smart lighting automation
- Garden irrigation timers
- HVAC time-based control
- Any time-based home automation
```

**Why should this be in the default repository?**
```
1. Unique Visual Interface: Provides an intuitive circular 24-hour timer that's easy to use
2. Solves Common Need: Time-based automation is one of the most requested features
3. Well Documented: Comprehensive README with examples in multiple languages
4. Active Development: Regular updates with detailed changelog (currently v1.0.0)
5. Quality Code: Follows HA best practices, includes validation workflow
6. Multi-Language: Supports 8 languages with RTL support
7. Complete Solution: Includes both backend integration and frontend card
8. User-Friendly: Config flow for easy setup, no YAML required
9. Event-Driven: Uses state listeners for instant response, not polling
10. Already in Use: Being used by multiple users with positive feedback
```

**Additional information:**
```
- Latest version: 1.0.0
- Minimum Home Assistant version: 2024.1.0
- Minimum HACS version: 1.6.0
- IoT Class: local_push (event-driven, no polling)
- Integration type: device
- Config flow: Yes
- Includes Lovelace card: Yes (auto-installed)
- Dependencies: None
- Translations: 8 languages
- GitHub workflow: HACS validation + Hassfest validation
- License: MIT
- Active maintenance: Yes
```

**Screenshots/Preview:**
```
Preview images available in repository:
https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/images/preview.jpg
https://github.com/davidss20/home-assistant-24h-timer-integration/raw/main/images/preview1.jpg
```

---

## Checklist Before Submission

- [x] Repository is public
- [x] Repository has a valid LICENSE file (MIT)
- [x] Repository has a README.md with documentation
- [x] Repository has releases (create v1.0.0 before submitting!)
- [x] Integration has a manifest.json
- [x] Integration has a hacs.json
- [x] Integration has proper structure in custom_components/
- [x] Integration uses config_flow
- [x] Integration has translations
- [x] Repository has GitHub Actions validation workflow
- [x] No obvious bugs or issues
- [x] Code follows Home Assistant standards

---

## Quick Links for Submission

1. **Create Release First**: https://github.com/davidss20/home-assistant-24h-timer-integration/releases/new
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - First Official HACS Release`
   - Description: Copy from CHANGELOG.md

2. **Submit to HACS**: https://github.com/hacs/default/issues/new?template=integration.yml

3. **Wait for Response**: Usually 1-4 weeks

---

**Note**: Version 1.0.0 marks the first official HACS release. Previous versions (4.x-5.x) were development versions.

