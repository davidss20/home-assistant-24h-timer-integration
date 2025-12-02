// Timer 24H Card for Home Assistant
// Version 2.1.1 - YAML Only
// All documentation/comments are in English. UI labels are localized (EN/HE/ES/FR).

// === i18n: translations & helpers ===
const TIMER24H_I18N = {
  en: {
    title_default: "24 Hour Timer",
    status_on: "Active",
    status_off: "Inactive",
    sync_cloud: "Synced",
    sync_local: "Local",
  },
  he: {
    title_default: "טיימר 24 שעות",
    status_on: "מופעל",
    status_off: "מושבת",
    sync_cloud: "🌐 מסונכרן",
    sync_local: "💾 מקומי",
  },
  es: {
    title_default: "Temporizador 24h",
    status_on: "Activo",
    status_off: "Inactivo",
    sync_cloud: "Sincronizado",
    sync_local: "Local",
  },
  fr: {
    title_default: "Minuteur 24h",
    status_on: "Actif",
    status_off: "Inactif",
    sync_cloud: "Synchronisé",
    sync_local: "Local",
  },
};

function pickLangFromHass(hass) {
  // Try HA locale → fallback to browser → default to 'en'
  const cand =
    hass?.locale?.language ||
    hass?.language ||
    (typeof navigator !== "undefined" && navigator.language?.slice(0, 2)) ||
    "en";
  const key = (cand || "en").toLowerCase().slice(0, 2);
  return TIMER24H_I18N[key] ? key : "en";
}

function t(dict, key) {
  const lang = dict.__lang__ || "en";
  const pack = TIMER24H_I18N[lang] || TIMER24H_I18N.en;
  return pack[key] ?? TIMER24H_I18N.en[key] ?? key;
}

class Timer24HCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeSlots = this.initializeTimeSlots();
    this.currentTime = new Date();
    this.isSystemActive = false;
    this.lastControlledStates = new Map();
    this.updateInterval = null;
    this.config = null;
    this._hass = null;
    this._layout = null;

    // Initialize layout property immediately
    this.layout = {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };

    // i18n state holder
    this.__i18n = { __lang__: 'en' };
  }

  // Home Assistant required methods
  // GUI editor disabled - use YAML configuration only
  // static async getConfigElement() {
  //   return null;
  // }

  static getStubConfig() {
    // Generate unique storage entity ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const uniqueId = `timer_24h_card_${timestamp}_${random}`;

    return {
      title: 'Timer 24H',
      home_logic: 'OR',
      entities: [],
      home_sensors: [],
      save_state: true, // Always save to server when possible
      storage_entity_id: `input_text.${uniqueId}`,
      auto_create_helper: true,
      allow_local_fallback: true,
      language: 'en',
    };
  }

  // Legacy Masonry layout support
  getCardSize() {
    return 3;
  }

  // Grid layout support - NEW Home Assistant sections
  static getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  // Layout property for grid sections
  get layout() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  set layout(value) {
    // Accept layout changes from Home Assistant
    if (value && typeof value === 'object') {
      this._layout = { ...value };
    } else {
      // Fallback to default layout
      this._layout = {
        grid_rows: 3,
        grid_columns: 3,
        grid_min_rows: 3,
        grid_min_columns: 3
      };
    }
  }

  // Additional layout methods for compatibility
  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    // Safe config merging with validation
    this.config = {
      title: '24 Hour Timer',
      home_sensors: [],
      home_logic: 'OR',
      entities: [],
      save_state: true,
      language: 'en',
    };

    // Safely merge user config
    try {
      if (config.title && typeof config.title === 'string') {
        this.config.title = config.title;
      }
      if (config.home_logic === 'AND' || config.home_logic === 'OR') {
        this.config.home_logic = config.home_logic;
      }
      if (config.entities && Array.isArray(config.entities)) {
        this.config.entities = config.entities.filter(e => e && typeof e === 'string');
      }
      if (config.home_sensors && Array.isArray(config.home_sensors)) {
        this.config.home_sensors = config.home_sensors.filter(s => s && typeof s === 'string');
      }
      if (typeof config.save_state === 'boolean') {
        this.config.save_state = config.save_state;
      }
      if (config.storage_entity_id && typeof config.storage_entity_id === 'string') {
        this.config.storage_entity_id = config.storage_entity_id;
      }
      if (typeof config.auto_create_helper === 'boolean') {
        this.config.auto_create_helper = config.auto_create_helper;
      }
      if (typeof config.allow_local_fallback === 'boolean') {
        this.config.allow_local_fallback = config.allow_local_fallback;
      }
      if (typeof config.language === 'string') {
        this.config.language = config.language;
      }
    } catch (e) {
      console.warn('Timer Card: Config validation error, using defaults:', e);
    }

    // Initialize i18n language (if hass is not yet available we keep user choice / default)
    this.__i18n = { __lang__: this.config.language || 'en' };

    // Load saved state asynchronously
    this.loadSavedState().then(() => {
      if (this.shadowRoot) {
        this.render();
      }
    }).catch(error => {
      console.error('Timer Card: Error loading saved state:', error);
      // Ensure timeSlots is still an array even if loading fails
      if (!Array.isArray(this.timeSlots)) {
        this.timeSlots = this.initializeTimeSlots();
      }
      if (this.shadowRoot) {
        this.render();
      }
    });
  }

  set hass(hass) {
    const wasHassAvailable = !!this._hass;
    this._hass = hass;

    // If language not explicitly set in config, auto-pick from HA on first hass assignment
    if (this.config && !this.config.language) {
      this.__i18n = { __lang__: pickLangFromHass(hass) };
    }

    if (hass) {
      const oldSystemStatus = this.isSystemActive;
      this.checkSystemStatus();

      if (oldSystemStatus !== this.isSystemActive) {
        this.controlEntities();
      }

      this.updateCurrentTime();

      // If hass wasn't available before, load saved data now
      if (!wasHassAvailable && this.config?.save_state) {
        this.loadSavedState().then(() => {
          this.render();
        }).catch(error => {
          console.error('Timer Card: Error loading saved state on hass update:', error);
          this.render();
        });
      } else {
        this.render();
      }
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.startTimer();

    // Setup automatic synchronization
    this.setupAutoSync();

    // Ensure layout is set for grid sections
    if (!this.layout) {
      this.layout = {
        grid_rows: 3,
        grid_columns: 3,
        grid_min_rows: 3,
        grid_min_columns: 3
      };
    }
  }

  setupAutoSync() {
    // Sync with server every minute
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      if (this.config?.save_state && this.hass && this.hass.connection) {
        try {
          const storageKey = `timer_24h_card_${this.generateCardId()}`;
          const result = await this.hass.connection.sendMessagePromise({
            type: 'frontend/get_user_data',
            key: storageKey
          });

          if (result && result.value && result.value.timeSlots) {
            // Check if there are changes from the server
            const serverDataStr = JSON.stringify(result.value.timeSlots);
            const localDataStr = JSON.stringify(this.timeSlots);

            if (serverDataStr !== localDataStr && result.value.timestamp > (this.lastSyncTime || 0)) {
              console.log('Timer Card: Syncing changes from server...');
              this.timeSlots = result.value.timeSlots;
              this.lastSyncTime = result.value.timestamp;
              this.render();
            }
          }
        } catch (error) {
          // Silent: no log needed for sync errors
        }
      }
    }, 60000); // every 60 seconds
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Cleanup helper entities when card is removed
    this._scheduleCleanup();
  }

  _scheduleCleanup() {
    // Wait a bit to see if card is reconnected (e.g., during refresh)
    setTimeout(() => {
      if (!this.isConnected && this.config?.storage_entity_id && this.hass) {
        this._cleanupHelperEntity();
      }
    }, 5000); // Wait 5 seconds
  }

  async _cleanupHelperEntity() {
    try {
      const entityId = this.config.storage_entity_id;

      // Check if entity still exists and was created by us
      if (!this.hass.states[entityId]) {
        return; // Already deleted
      }

      // Only delete if it's our timer card entity
      if (!entityId.includes('timer_24h_card_')) {
        return; // Not our entity
      }

      console.log(`Timer Card: Cleaning up helper entity: ${entityId}`);

      // Try to delete via WebSocket API
      try {
        await this.hass.callWS({
          type: 'config/input_text/delete',
          entity_id: entityId.replace('input_text.', '')
        });
        console.log(`✅ Timer Card: Successfully deleted helper entity: ${entityId}`);
      } catch (wsError) {
        // Try alternative API
        try {
          await this.hass.callWS({
            type: 'config/helpers/delete',
            entity_id: entityId
          });
          console.log(`✅ Timer Card: Successfully deleted helper entity via legacy API: ${entityId}`);
        } catch (legacyError) {
          console.warn(`Timer Card: Could not auto-delete helper entity ${entityId}. Please delete manually.`);
        }
      }

    } catch (error) {
      console.warn('Timer Card: Error during cleanup:', error);
    }
  }

  initializeTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({ hour, minute: 0, isActive: false });
      slots.push({ hour, minute: 30, isActive: false });
    }
    console.log('Timer Card: Initialized timeSlots with', slots.length, 'slots');
    return slots;
  }

  startTimer() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 120000); // Check every 2 minutes
  }

  checkSystemStatus() {
    if (!this.hass || !this.config.home_sensors?.length) {
      this.isSystemActive = true;
      return;
    }

    const logic = this.config.home_logic || 'OR';
    let systemStatus = logic === 'AND';

    for (const sensorId of this.config.home_sensors) {
      const sensor = this.hass.states[sensorId];
      if (!sensor) continue;

      let isTrue;

      if (sensorId === 'binary_sensor.jewish_calendar_issur_melacha_in_effect') {
        // For this sensor: 'on' means there IS an issur melacha (restriction), so system should be ACTIVE
        // 'off' means there is NO issur melacha, so system should be INACTIVE
        isTrue = sensor.state.toLowerCase() === 'on';
      } else {
        isTrue = ['on', 'home', 'true', '1', 'yes'].includes(sensor.state.toLowerCase());
      }

      if (logic === 'OR') {
        if (isTrue) {
          systemStatus = true;
          break;
        }
      } else {
        if (!isTrue) {
          systemStatus = false;
          break;
        }
      }
    }

    this.isSystemActive = systemStatus;
  }

  updateCurrentTime() {
    const newTime = new Date();
    const oldHour = this.currentTime.getHours();
    const oldMinute = Math.floor(this.currentTime.getMinutes() / 30) * 30;
    const newHour = newTime.getHours();
    const newMinute = Math.floor(newTime.getMinutes() / 30) * 30;

    this.currentTime = newTime;

    if (oldHour !== newHour || oldMinute !== newMinute) {
      console.log(`Timer Card: Time segment changed to ${newHour}:${newMinute === 0 ? '00' : '30'}`);
      this.controlEntities();
    }
  }

  controlEntities() {
    if (!this.hass || !this.config.entities?.length || !this.isSystemActive) {
      return;
    }

    // Ensure timeSlots is an array
    if (!Array.isArray(this.timeSlots)) {
      this.timeSlots = this.initializeTimeSlots();
    }

    const currentHour = this.currentTime.getHours();
    const currentMinute = this.currentTime.getMinutes();
    const minute = currentMinute < 30 ? 0 : 30;

    const currentSlot = this.timeSlots.find(slot =>
      slot.hour === currentHour && slot.minute === minute
    );

    const shouldBeOn = currentSlot?.isActive || false;

    for (const entityId of this.config.entities) {
      const entity = this.hass.states[entityId];
      if (!entity) continue;

      const currentState = entity.state === 'on';
      const lastControlledState = this.lastControlledStates.get(entityId);

      if (currentState !== shouldBeOn && lastControlledState !== shouldBeOn) {
        try {
          this.hass.callService('homeassistant', shouldBeOn ? 'turn_on' : 'turn_off', {
            entity_id: entityId
          });
          console.log(`Timer Card: ${shouldBeOn ? 'Turned on' : 'Turned off'} ${entityId}`);

          this.lastControlledStates.set(entityId, shouldBeOn);

          setTimeout(() => {
            if (this.lastControlledStates.get(entityId) === shouldBeOn) {
              this.lastControlledStates.delete(entityId);
            }
          }, 30000);

        } catch (error) {
          console.error(`Timer Card: Failed to control ${entityId}:`, error);
        }
      }
    }
  }

  toggleTimeSlot(hour, minute) {
    // Ensure timeSlots is an array
    if (!Array.isArray(this.timeSlots)) {
      this.timeSlots = this.initializeTimeSlots();
    }

    const slot = this.timeSlots.find(s => s.hour === hour && s.minute === minute);
    if (slot) {
      slot.isActive = !slot.isActive;
      this.saveState();
      this.lastControlledStates.clear();
      this.controlEntities();
      this.render();
    }
  }

  async saveState() {
    if (!this.config.save_state) return;

    console.log('Timer Card: Saving state...');

    try {
      // Using Home Assistant Frontend Storage - automatically synced
      const storageKey = `timer_24h_card_${this.generateCardId()}`;
      const data = {
        timeSlots: this.timeSlots,
        timestamp: Date.now(),
        version: '2.1.1'
      };

      // Save via Home Assistant connection (user data)
      if (this.hass && this.hass.connection) {
        try {
          this.lastSyncTime = data.timestamp; // remember last sync time
          await this.hass.connection.sendMessagePromise({
            type: 'frontend/set_user_data',
            key: storageKey,
            value: data
          });
          console.log('✅ Timer Card: State saved to Home Assistant user data (synced across devices)');
          return;
        } catch (frontendError) {
          console.warn('Timer Card: Frontend storage failed, trying alternative method:', frontendError);
        }
      }

      // Alternative method: using persistent_notification as storage
      if (this.hass) {
        try {
          const notificationId = `timer_24h_card_data_${this.generateCardId()}`;

          // Delete previous notification if exists
          try {
            await this.hass.callService('persistent_notification', 'dismiss', {
              notification_id: notificationId
            });
          } catch (e) {
            // Not critical if it doesn't exist
          }

          // Create new notification with data (hidden)
          await this.hass.callService('persistent_notification', 'create', {
            notification_id: notificationId,
            title: `Timer Card Data - ${this.config.title}`,
            message: JSON.stringify(data),
            // Metadata to mark internal data
            data: {
              timer_card_internal: true,
              hidden: true
            }
          });

          console.log('✅ Timer Card: State saved via persistent notification (synced)');
          return;

        } catch (notificationError) {
          console.warn('Timer Card: Notification storage failed:', notificationError);
        }
      }

      // Fallback to localStorage
      localStorage.setItem(`timer-24h-${this.config.title}`, JSON.stringify(this.timeSlots));
      console.log('💾 Timer Card: Fallback to localStorage (device-only)');

    } catch (error) {
      console.error('Timer Card: All save methods failed:', error);
      // Last resort
      localStorage.setItem(`timer-24h-${this.config.title}`, JSON.stringify(this.timeSlots));
    }
  }

  async loadSavedState() {
    if (!this.config?.save_state) return;

    console.log('Timer Card: Loading saved state...');

    if (this.hass) {
      try {
        const storageKey = `timer_24h_card_${this.generateCardId()}`;

        // Try to load from Home Assistant Frontend Storage
        if (this.hass.connection) {
          try {
            const result = await this.hass.connection.sendMessagePromise({
              type: 'frontend/get_user_data',
              key: storageKey
            });

            if (result && result.value && result.value.timeSlots) {
              this.timeSlots = result.value.timeSlots;
              console.log(`✅ Timer Card: State loaded from Home Assistant user data (${this.timeSlots.length} slots)`);
              return;
            }
          } catch (frontendError) {
            console.warn('Timer Card: Frontend storage load failed:', frontendError);
          }
        }

        // Alternative method: load from persistent_notification
        try {
          const notificationId = `timer_24h_card_data_${this.generateCardId()}`;

          // Check if there's a notification with the data
          const notifications = this.hass.states['persistent_notification.' + notificationId];
          if (notifications && notifications.attributes && notifications.attributes.message) {
            const data = JSON.parse(notifications.attributes.message);
            if (data.timeSlots && Array.isArray(data.timeSlots)) {
              this.timeSlots = data.timeSlots;
              console.log(`✅ Timer Card: State loaded from persistent notification (${this.timeSlots.length} slots)`);
              return;
            }
          }
        } catch (notificationError) {
          console.warn('Timer Card: Notification load failed:', notificationError);
        }

      } catch (error) {
        console.warn('Timer Card: Home Assistant load failed:', error);
      }
    }

    // Fallback to localStorage
    console.log('Timer Card: Loading from localStorage fallback...');
    try {
      const saved = localStorage.getItem(`timer-24h-${this.config.title}`);
      if (saved) {
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) {
          this.timeSlots = parsedData;
          console.log(`✅ Timer Card: State loaded from localStorage (${this.timeSlots.length} slots)`);
          return;
        }
      }
    } catch (error) {
      console.warn('Timer Card: localStorage load failed:', error);
    }

    console.log('Timer Card: No saved data found, using defaults');
  }

  generateCardId() {
    // Generate a stable ID based on the card title/config
    const title = this.config.title || 'default';

    // Extract only ASCII letters and numbers, ignore other chars
    const englishOnly = title.match(/[a-zA-Z0-9]/g);

    if (englishOnly && englishOnly.length > 0) {
      return englishOnly.join('').toLowerCase();
    }

    // If no English chars found, use a simple hash of the title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return 'timer_' + Math.abs(hash).toString();
  }

  createSectorPath(hour, totalSectors, innerRadius, outerRadius, centerX, centerY) {
    const startAngle = (hour * 360 / totalSectors - 90) * (Math.PI / 180);
    const endAngle = ((hour + 1) * 360 / totalSectors - 90) * (Math.PI / 180);

    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  }

  getTextPosition(hour, totalSectors, radius, centerX, centerY) {
    const angle = ((hour + 0.5) * 360 / totalSectors - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }

  getTimeLabel(hour, minute) {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  render() {
    if (!this.config) return;

    // Ensure timeSlots is always an array
    if (!Array.isArray(this.timeSlots)) {
      this.timeSlots = this.initializeTimeSlots();
    }

    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;

    // Check if timer is currently active (center indicator uses sensors)
    const currentHour = this.currentTime.getHours();
    const currentMinute = this.currentTime.getMinutes();
    const minute = currentMinute < 30 ? 0 : 30;

    const currentSlot = this.timeSlots.find(slot =>
      slot.hour === currentHour && slot.minute === minute
    );

    const isCurrentlyActive = (currentSlot?.isActive || false) && this.isSystemActive;

    const sectors = Array.from({ length: 24 }, (_, hour) => {
      const middleRadius = (innerRadius + outerRadius) / 2;

      // Outer half (full hour - 00)
      const outerSectorPath = this.createSectorPath(hour, 24, middleRadius, outerRadius, centerX, centerY);
      const outerTextPos = this.getTextPosition(hour, 24, (middleRadius + outerRadius) / 2, centerX, centerY);
      const outerSlot = this.timeSlots.find(s => s.hour === hour && s.minute === 0);
      const outerIsActive = outerSlot?.isActive || false; // buttons show user settings
      const outerIsCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() < 30;

      // Inner half (half hour - 30)
      const innerSectorPath = this.createSectorPath(hour, 24, innerRadius, middleRadius, centerX, centerY);
      const innerTextPos = this.getTextPosition(hour, 24, (innerRadius + middleRadius) / 2, centerX, centerY);
      const innerSlot = this.timeSlots.find(s => s.hour === hour && s.minute === 30);
      const innerIsActive = innerSlot?.isActive || false; // buttons show user settings
      const innerIsCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() >= 30;

      // Current hour indicator (animated dot outside the ring)
      let currentTimeIndicator = '';
      if (outerIsCurrent || innerIsCurrent) {
        const indicatorAngle = ((hour + 0.5) * 360 / 24 - 90) * (Math.PI / 180);
        const indicatorX = centerX + (outerRadius + 10) * Math.cos(indicatorAngle);
        const indicatorY = centerY + (outerRadius + 10) * Math.sin(indicatorAngle);

        currentTimeIndicator = `
          <circle cx="${indicatorX}" cy="${indicatorY}" r="4" 
                  fill="#ff6b6b" stroke="#ffffff" stroke-width="2">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
          </circle>
        `;
      }

      return `
        <!-- Outer half (full hour) -->
        <path d="${outerSectorPath}" 
              fill="${outerIsActive ? '#10b981' : '#ffffff'}"
              stroke="${outerIsCurrent ? '#ff6b6b' : '#e5e7eb'}"
              stroke-width="${outerIsCurrent ? '3' : '1'}"
              style="cursor: pointer; transition: all 0.2s;"
              onclick="this.getRootNode().host.toggleTimeSlot(${hour}, 0)"/>
        <text x="${outerTextPos.x}" y="${outerTextPos.y + 2}" 
              text-anchor="middle" font-size="9" font-weight="bold"
              style="pointer-events: none; user-select: none;"
              fill="${outerIsActive ? '#ffffff' : '#374151'}">
          ${this.getTimeLabel(hour, 0)}
        </text>
        
        <!-- Inner half (half hour - 30) -->
        <path d="${innerSectorPath}" 
              fill="${innerIsActive ? '#10b981' : '#f8f9fa'}"
              stroke="${innerIsCurrent ? '#ff6b6b' : '#e5e7eb'}"
              stroke-width="${innerIsCurrent ? '3' : '1'}"
              style="cursor: pointer; transition: all 0.2s;"
              onclick="this.getRootNode().host.toggleTimeSlot(${hour}, 30)"/>
        <text x="${innerTextPos.x}" y="${innerTextPos.y + 1}" 
              text-anchor="middle" font-size="7" font-weight="bold"
              style="pointer-events: none; user-select: none;"
              fill="${innerIsActive ? '#ffffff' : '#6b7280'}">
          ${this.getTimeLabel(hour, 30)}
        </text>
        
        ${currentTimeIndicator}
      `;
    }).join('');

    // Hour divider lines
    const dividerLines = Array.from({ length: 24 }, (_, i) => {
      const angle = (i * 360 / 24 - 90) * (Math.PI / 180);
      const xInner = centerX + innerRadius * Math.cos(angle);
      const yInner = centerY + innerRadius * Math.sin(angle);
      const xOuter = centerX + outerRadius * Math.cos(angle);
      const yOuter = centerY + outerRadius * Math.sin(angle);
      return `<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" stroke="#e5e7eb" stroke-width="1"/>`;
    }).join('');

    const titleText = this.config.title || t(this.__i18n, 'title_default');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--primary-font-family, sans-serif);
          position: relative;
          contain: layout style paint;
          margin: 8px;
        }
        
        .card {
          background: var(--card-background-color, #ffffff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          padding: 0;
          overflow: hidden;
          height: calc(100% - 16px);
          min-height: 200px;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
          isolation: isolate;
          margin: 8px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          padding: 4px 8px 0 8px;
        }
        
        .title {
          font-size: 1rem;
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          display: flex;
          align-items: center;
        }
        
        .status-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        
        .system-status {
          font-size: 0.7rem;
          text-align: center;
          margin: 0;
        }
         
        .sync-status {
          font-size: 0.6rem;
          text-align: center;
          margin: 0;
          opacity: 0.8;
          color: var(--secondary-text-color, #666);
        }
         
        .system-status.active {
          color: #10b981;
        }
         
        .system-status.inactive {
          color: #f59e0b;
        }
        
        .timer-container {
          display: flex;
          justify-content: center;
          margin: 0;
          padding: 0;
          flex: 1;
          min-height: 0;
        }
        
        .timer-svg {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
      </style>
      
      <div class="card">
        <div class="header">
          <div class="title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em" height="1.2em" 
                 style="margin-right: 8px; vertical-align: middle;" role="img" aria-label="Home timer icon" 
                 fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#41BDF5" stroke="#41BDF5"/>
              <path d="M11 9h2" stroke="white" stroke-width="1.6"/>
              <circle cx="12" cy="15" r="3.5" stroke="white" stroke-width="1.6" fill="none"/>
              <path d="M12 15l2-2" stroke="white" stroke-width="1.6"/>
            </svg>
            ${titleText}
          </div>
          <div class="status-container">
            <div class="system-status ${this.isSystemActive ? 'active' : 'inactive'}">
              ${this.isSystemActive ? t(this.__i18n, 'status_on') : t(this.__i18n, 'status_off')}
            </div>
          </div>
        </div>
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Outer circles -->
            <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" 
                    fill="none" stroke="#e5e7eb" stroke-width="2"/>
            <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" 
                    fill="none" stroke="#e5e7eb" stroke-width="2"/>
            <!-- Middle ring separating inner/outer halves -->
            <circle cx="${centerX}" cy="${centerY}" r="${(innerRadius + outerRadius) / 2}" 
                    fill="none" stroke="#d1d5db" stroke-width="1.5"/>
            
            ${dividerLines}
            ${sectors}
            
            <!-- Center indicator (shows current active/inactive status considering sensors) -->
            <circle cx="${centerX}" cy="${centerY}" r="45" 
                    fill="${isCurrentlyActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.05)'}" 
                    stroke="${isCurrentlyActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.2)'}" 
                    stroke-width="1"/>
            
            <text x="${centerX}" y="${centerY - 8}" 
                  text-anchor="middle" font-size="14" font-weight="bold"
                  fill="${isCurrentlyActive ? '#ef4444' : '#6b7280'}">
              ${isCurrentlyActive ? t(this.__i18n, 'status_on') : t(this.__i18n, 'status_off')}
            </text>
            
            <text x="${centerX}" y="${centerY + 8}" 
                  text-anchor="middle" font-size="10"
                  fill="${isCurrentlyActive ? '#ef4444' : '#6b7280'}">
              ${this.currentTime.getHours().toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}
            </text>
          </svg>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('timer-24h-card', Timer24HCard);

// Register card for HACS and Home Assistant UI
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: '24h timer with YAML configuration only (EN/HE/ES/FR supported via `language` option)',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-timer-card',
  // configurable: true, // GUI editor disabled - YAML only
  // Custom icon for HACS and card picker
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Home timer icon" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a 1 1 0 0 1-1-1z" fill="#41BDF5" stroke="#41BDF5"/>
    <path d="M11 9h2" stroke="white" stroke-width="1.6"/>
    <circle cx="12" cy="15" r="3.5" stroke="white" stroke-width="1.6" fill="none"/>
    <path d="M12 15l2-2" stroke="white" stroke-width="1.6"/>
  </svg>`,
  // Alternative PNG icon for HACS
  iconUrl: './icon.png',
  // Grid layout support
  grid_options: {
    rows: 3,
    columns: 3,
    min_rows: 3,
    min_columns: 3
  }
});

// Ensure layout compatibility with Home Assistant grid sections
if (Timer24HCard && Timer24HCard.prototype) {
  Timer24HCard.prototype.getLayoutOptions = Timer24HCard.prototype.getLayoutOptions || function() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  };

  // Static layout options for Home Assistant
  Timer24HCard.getLayoutOptions = Timer24HCard.getLayoutOptions || function() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  };

  // Ensure layout property exists
  if (!Timer24HCard.prototype.hasOwnProperty('layout')) {
    Object.defineProperty(Timer24HCard.prototype, 'layout', {
      get: function() {
        return this._layout || {
          grid_rows: 3,
          grid_columns: 3,
          grid_min_rows: 3,
          grid_min_columns: 3
        };
      },
      set: function(value) {
        if (value && typeof value === 'object') {
          this._layout = { ...value };
        } else {
          this._layout = {
            grid_rows: 3,
            grid_columns: 3,
            grid_min_rows: 3,
            grid_min_columns: 3
          };
        }
      },
      enumerable: true,
      configurable: true
    });
  }
}

console.info(
  '%c  TIMER-24H-CARD  %c  Version 2.1.1 - YAML Only  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);
