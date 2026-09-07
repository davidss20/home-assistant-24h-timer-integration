
Timer 24H Card — Server Sync Upgrade
====================================
- Adds server-side storage via Home Assistant input_text helper.
- Auto-creates the helper on first load (admin required).
- Optional localStorage fallback is disabled by default.
- New config fields:
  - storage_entity_id (string)
  - auto_create_helper (boolean, default true)
  - allow_local_fallback (boolean, default false)
