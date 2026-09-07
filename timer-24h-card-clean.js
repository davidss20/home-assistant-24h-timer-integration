import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';

class Timer24HCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      timeSlots: { type: Array }
    };
  }

  static get layoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
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
      save_state: true, // Always save to server
      storage_entity_id: `input_text.${uniqueId}`,
      auto_create_helper: true,
      allow_local_fallback: true
    };
  }

  // Layout support
  get layout() {
    return this._layout || {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  set layout(layout) {
    this._layout = layout;
    this.requestUpdate();
  }

  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  constructor() {
    super();
    this.timeSlots = this.initializeTimeSlots();
    this.config = {};
    this.updateInterval = null;
    this.syncInterval = null;
    this._layout = {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.startUpdateLoop();
    this.setupAutoSync();
    // Delay automation creation to ensure hass object is ready
    setTimeout(() => {
      this.createAutomationIfNeeded();
    }, 2000);
  }

  startUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      this.requestUpdate();
    }, 60000); // עדכון כל דקה
  }

  setupAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(async () => {
      if (this.config?.save_state && this.config?.storage_entity_id && this.hass) {
        try {
          const serverData = await this.loadFromServer();
          if (serverData && serverData.timeSlots && Array.isArray(serverData.timeSlots)) {
            // Check if there's a change in data
            if (JSON.stringify(this.timeSlots) !== JSON.stringify(serverData.timeSlots)) {
              console.log('Timer Card: Server data changed, updating local state');
              this.timeSlots = serverData.timeSlots;
              this.requestUpdate();
            }
          }
        } catch (error) {
          // שגיאות סינכרון לא קריטיות
        }
      }
    }, 60000); // כל דקה
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
    this.cleanupAutomation();
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
      save_state: true
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
    } catch (e) {
      console.warn('Timer Card: Config validation error, using defaults:', e);
    }
    
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
    this._hass = hass;
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  initializeTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          hour,
          minute,
          active: false
        });
      }
    }
    return slots;
  }

  async loadSavedState() {
    try {
      let savedData = null;
      
      // Try Frontend Storage first (server-side)
      if (this.hass && this.config?.storage_entity_id) {
        try {
          const response = await this.hass.connection.sendMessagePromise({
            type: 'frontend/get_user_data',
            key: this.config.storage_entity_id
          });
          if (response && response.value) {
            savedData = JSON.parse(response.value);
            console.log('Timer Card: Loaded from Frontend Storage');
          }
        } catch (frontendError) {
          console.log('Timer Card: Frontend Storage not available, trying notification fallback');
          
          // Try to load from persistent notifications as fallback
          try {
            const notifications = await this.hass.callWS({ type: 'persistent_notification/get' });
            const timerNotification = notifications.find(n => n.notification_id === this.config.storage_entity_id);
            if (timerNotification && timerNotification.message) {
              savedData = JSON.parse(timerNotification.message);
              console.log('Timer Card: Loaded from Persistent Notifications');
            }
          } catch (notificationError) {
            console.log('Timer Card: Persistent notifications not available');
          }
        }
      }
      
      // Fallback to localStorage if server storage fails
      if (!savedData && this.config?.allow_local_fallback !== false) {
        const localKey = `timer-24h-${this.config?.storage_entity_id || 'default'}`;
        const localData = localStorage.getItem(localKey);
        if (localData) {
          savedData = JSON.parse(localData);
          console.log('Timer Card: Loaded from localStorage');
        }
      }
      
      if (savedData && savedData.timeSlots && Array.isArray(savedData.timeSlots)) {
        this.timeSlots = savedData.timeSlots;
      }
    } catch (error) {
      console.warn('Timer Card: Error loading saved state:', error);
    }
  }

  async saveState() {
    const data = {
      timeSlots: this.timeSlots,
      timestamp: Date.now()
    };

    try {
      // Priority 1: Frontend Storage (server-side)
      if (this.hass && this.config?.storage_entity_id) {
        try {
          await this.hass.connection.sendMessagePromise({
            type: 'frontend/set_user_data',
            key: this.config.storage_entity_id,
            value: JSON.stringify(data)
          });
          console.log('✅ Timer Card: Saved to Frontend Storage (server-side)');
          return;
        } catch (frontendError) {
          console.log('Timer Card: Frontend Storage failed, trying notification fallback');
          
          // Fallback: Persistent Notifications
          try {
            await this.hass.callService('persistent_notification', 'create', {
              notification_id: this.config.storage_entity_id,
              title: 'Timer 24H Card Data',
              message: JSON.stringify(data)
            });
            console.log('✅ Timer Card: Saved to Persistent Notifications');
            return;
          } catch (notificationError) {
            console.warn('Timer Card: Persistent notification fallback failed:', notificationError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Timer Card: Failed to save to Home Assistant:', error);
    }

    // Final fallback: localStorage
    if (this.config?.allow_local_fallback !== false) {
      try {
        const localKey = `timer-24h-${this.config?.storage_entity_id || 'default'}`;
        localStorage.setItem(localKey, JSON.stringify(data));
        console.log('💾 Timer Card: Saved to localStorage as fallback');
      } catch (localError) {
        console.error('❌ Timer Card: Even localStorage failed:', localError);
      }
    }
  }

  async loadFromServer() {
    try {
      if (!this.hass || !this.config?.storage_entity_id) return null;
      
      // Try Frontend Storage first
      try {
        const response = await this.hass.connection.sendMessagePromise({
          type: 'frontend/get_user_data',
          key: this.config.storage_entity_id
        });
        if (response && response.value) {
          return JSON.parse(response.value);
        }
      } catch (frontendError) {
        // Try persistent notifications fallback
        const notifications = await this.hass.callWS({ type: 'persistent_notification/get' });
        const timerNotification = notifications.find(n => n.notification_id === this.config.storage_entity_id);
        if (timerNotification && timerNotification.message) {
          return JSON.parse(timerNotification.message);
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Timer Card: Error loading from server:', error);
      return null;
    }
  }

  toggleTimeSlot(hour, minute) {
    const slot = this.timeSlots.find(s => s.hour === hour && s.minute === minute);
    if (slot) {
      slot.active = !slot.active;
      this.saveState();
      this.requestUpdate();
    }
  }

  isCurrentlyActive() {
    if (!Array.isArray(this.config.home_sensors) || this.config.home_sensors.length === 0) {
      return this.isTimeSlotActive();
    }

    const sensorStates = this.config.home_sensors.map(sensorId => {
      const entity = this.hass?.states[sensorId];
      if (!entity) return false;
      
      // Special handling for jewish calendar sensor
      if (sensorId === 'binary_sensor.jewish_calendar_issur_melacha_in_effect') {
        // For this sensor: 'on' means there IS an issur melacha (restriction), so system should be ACTIVE
        // 'off' means there is NO issur melacha, so system should be INACTIVE
        return entity.state?.toLowerCase() === 'on';
      }
      
      return ['on', 'home', 'true', 'active', 'detected'].includes(entity.state?.toLowerCase());
    });

        const isSystemActive = this.config.home_logic === 'AND'
      ? sensorStates.every(state => state)
      : sensorStates.some(state => state);

    return isSystemActive && this.isTimeSlotActive();
  }

  isTimeSlotActive() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const currentSlot = this.timeSlots.find(slot => {
      const slotStart = slot.hour * 60 + slot.minute;
      const slotEnd = slotStart + 30;
      const currentTime = currentHour * 60 + currentMinute;
      
      return currentTime >= slotStart && currentTime < slotEnd;
    });
    
    return currentSlot?.active || false;
  }

  async controlEntities(turnOn) {
    if (!this.config.entities || this.config.entities.length === 0) {
      return;
    }

    const promises = this.config.entities.map(async (entityId) => {
      try {
        const entity = this.hass?.states[entityId];
        if (!entity) {
          console.warn(`Entity not found: ${entityId}`);
          return;
        }

        const domain = entityId.split('.')[0];
        let service, serviceData;

        switch (domain) {
          case 'switch':
          case 'input_boolean':
            service = turnOn ? 'turn_on' : 'turn_off';
            serviceData = { entity_id: entityId };
            await this.hass.callService(domain, service, serviceData);
            break;
          case 'light':
            service = turnOn ? 'turn_on' : 'turn_off';
            serviceData = { entity_id: entityId };
            await this.hass.callService(domain, service, serviceData);
            break;
          case 'climate':
            if (turnOn) {
              await this.hass.callService('climate', 'set_hvac_mode', {
                entity_id: entityId,
                hvac_mode: 'heat'
              });
            } else {
              await this.hass.callService('climate', 'set_hvac_mode', {
                entity_id: entityId,
                hvac_mode: 'off'
              });
            }
            break;
          case 'script':
            if (turnOn) {
              await this.hass.callService('script', 'turn_on', { entity_id: entityId });
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to control ${entityId}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        contain: layout style paint;
        margin: 8px;
        display: block;
        height: calc(100% - 16px);
      }
      
      .card {
        position: relative;
        z-index: 1;
        isolation: isolate;
        margin: 8px;
        height: calc(100% - 16px);
        background: var(--card-background-color, white);
        border-radius: var(--ha-card-border-radius, 8px);
        box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
        padding: 16px;
        display: flex;
        flex-direction: column;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-shrink: 0;
      }
      
      .title {
        font-size: 1.2em;
        font-weight: 500;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .icon {
        width: 24px;
        height: 24px;
      }
      
      .sync-status {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .timer-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      
      .timer-circle {
        width: 280px;
        height: 280px;
        position: relative;
      }
      
      .timer-svg {
        width: 100%;
        height: 100%;
      }
      
      .center-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        pointer-events: none;
      }
      
      .status-text {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .status-on {
        color: #4CAF50;
      }
      
      .status-off {
        color: #f44336;
        opacity: 0.6;
      }
      
      .current-time {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      
      .time-slot {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .time-slot:hover {
        stroke-width: 3;
      }
      
      .time-slot.active {
        fill: #4CAF50;
        stroke: #388E3C;
      }
      
      .time-slot.inactive {
        fill: #E0E0E0;
        stroke: #BDBDBD;
      }
      
      .time-label {
        font-size: 10px;
        fill: var(--primary-text-color);
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
    `;
  }

  render() {
    const now = new Date();
    const isCurrentlyActive = this.isCurrentlyActive();
    const currentTimeStr = now.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return html`
      <div class="card">
        <div class="header">
          <div class="title">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#41BDF5" stroke="#41BDF5"/>
              <path d="M11 9h2" stroke="white" stroke-width="1.6"/>
              <circle cx="12" cy="15" r="3.5" stroke="white" stroke-width="1.6" fill="none"/>
              <path d="M12 15l2-2" stroke="white" stroke-width="1.6"/>
            </svg>
            ${this.config.title || '24 Hour Timer'}
          </div>
          <div class="sync-status">
            ${this.config.save_state ? '🌐 מסונכרן' : '💾 מקומי'}
          </div>
        </div>
        
        <div class="timer-container">
          <div class="timer-circle">
            <svg class="timer-svg" viewBox="0 0 400 400">
              ${this.renderTimeSlots()}
              ${this.renderHourLabels()}
            </svg>
            
            <div class="center-indicator">
              <div class="status-text ${isCurrentlyActive ? 'status-on' : 'status-off'}">
                ${isCurrentlyActive ? 'מופעל' : 'מושבת'}
              </div>
              <div class="current-time">${currentTimeStr}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

    renderTimeSlots() {
    const centerX = 200;
    const centerY = 200;
    const radius = 120;
    
    return this.timeSlots.map((slot, index) => {
      const angle = (index / 48) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
             // Buttons show user settings - only center indicator checks sensors
       const slotClass = slot.active ? 'active' : 'inactive';
      
      return html`
        <circle
          class="time-slot ${slotClass}"
          cx="${x}"
          cy="${y}"
          r="8"
          @click="${() => this.toggleTimeSlot(slot.hour, slot.minute)}"
        />
      `;
    });
  }

  renderHourLabels() {
    const centerX = 200;
    const centerY = 200;
    const radius = 90;
    
    const hours = [];
    for (let hour = 0; hour < 24; hour += 2) {
      const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      hours.push(html`
        <text
          class="time-label"
          x="${x}"
          y="${y}"
        >
          ${hour.toString().padStart(2, '0')}
        </text>
      `);
    }
    
    return hours;
  }

  // Static helper methods for editor integration
  static async ensureStorageEntity(hass, desiredId) {
    // This method is kept for compatibility but not used since we removed the editor
    return desiredId || `input_text.timer_24h_card_${Date.now()}`;
  }

  static async readStorage(hass, entityId) {
    // This method is kept for compatibility but not used since we removed the editor
    return {};
  }

  static async writeStorage(hass, entityId, data) {
    // This method is kept for compatibility but not used since we removed the editor
    return true;
  }

  static async deleteStorageEntity(hass, entityId) {
    // This method is kept for compatibility but not used since we removed the editor
    return true;
  }

  // Additional methods for Home Assistant compatibility
  updated(changedProperties) {
    super.updated && super.updated(changedProperties);
  }

  getCardSize() {
    return 3;
  }

  // Layout support methods
  static get layoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3,
      grid_min_columns: 3
    };
  }

  // Define layout as a property for Home Assistant
  static defineLayoutProperty() {
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
        set: function(layout) {
          this._layout = layout;
          this.requestUpdate();
        },
        getLayoutOptions: function() {
          return {
            grid_rows: 3,
            grid_columns: 3,
            grid_min_rows: 3,
            grid_min_columns: 3
          };
        },
        enumerable: true,
        configurable: true
      });
    }
  }

  // Automation management functions
  async createAutomationIfNeeded() {
    console.log('🔄 Timer Card: Starting automation creation process...');
    
    if (!this.hass) {
      console.warn('❌ Timer Card: No hass object available');
      return;
    }
    
    if (!this.config?.title) {
      console.warn('❌ Timer Card: No config title available');
      return;
    }

    try {
      console.log('🔍 Timer Card: Checking if automation exists...');
      const automationExists = await this.checkAutomationExists();
      console.log(`🔍 Timer Card: Automation exists: ${automationExists}`);
      
      if (!automationExists) {
        console.log('🚀 Timer Card: Creating new automation and script...');
        await this.createControlScript();
        await this.createAutomation();
        console.log('✅ Timer Card: Automation created successfully');
      } else {
        console.log('ℹ️ Timer Card: Automation already exists, skipping creation');
      }
    } catch (error) {
      console.error('❌ Timer Card: Failed to create automation:', error);
      console.error('❌ Timer Card: Error details:', error.message, error.stack);
    }
  }

  async checkAutomationExists() {
    if (!this.hass) return false;

    try {
      const automationId = `timer_24h_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      console.log(`🔍 Timer Card: Looking for automation: ${automationId}`);
      
      // Try different methods to check for automation
      try {
        const automations = await this.hass.callWS({ type: 'config/automation/list' });
        console.log(`🔍 Timer Card: Found ${automations.length} automations`);
        const exists = automations.some(automation => automation.id === automationId);
        console.log(`🔍 Timer Card: Automation ${automationId} exists: ${exists}`);
        return exists;
      } catch (wsError) {
        console.warn('Timer Card: WS automation list failed, trying states:', wsError);
        // Fallback: check if automation entity exists in states
        const automationEntity = `automation.${automationId}`;
        const exists = !!this.hass.states[automationEntity];
        console.log(`🔍 Timer Card: Automation entity ${automationEntity} exists in states: ${exists}`);
        return exists;
      }
    } catch (error) {
      console.warn('Timer Card: Error checking automation existence:', error);
      return false;
    }
  }

  async createAutomation() {
    if (!this.hass) return;

    const automationId = `timer_24h_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const scriptId = `timer_24h_control_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    
    console.log(`🚀 Timer Card: Creating automation: ${automationId}`);
    console.log(`🚀 Timer Card: Script to call: script.${scriptId}`);
    
    const automationConfig = {
      alias: `Timer 24H ${this.config.title}`,
      description: `אוטומציה עבור טיימר 24 שעות - ${this.config.title}`,
      mode: 'single',
      trigger: [
        {
          platform: 'time_pattern',
          minutes: '/30'
        }
      ],
      condition: [],
      action: [
        {
          service: 'script.turn_on',
          target: {
            entity_id: `script.${scriptId}`
          }
        }
      ]
    };

    try {
      // Try different API methods
      try {
        // Method 1: Try the config/automation/create API
        const result = await this.hass.callWS({
          type: 'config/automation/create',
          config: automationConfig
        });
        console.log(`✅ Timer Card: Automation created via config API: ${automationId}`, result);
        return;
      } catch (configError) {
        console.warn('Timer Card: Config API failed, trying service call:', configError);
        
        // Method 2: Try using automation.reload service with YAML
        try {
          // First, try to call automation service directly
          await this.hass.callService('automation', 'reload');
          console.log('🔄 Timer Card: Automation reload called');
          
          // Try to create via persistent notification for manual creation
          const yamlConfig = this.generateAutomationYAML(automationId, automationConfig);
          await this.hass.callService('persistent_notification', 'create', {
            notification_id: `timer_24h_automation_${automationId}`,
            title: 'Timer 24H Card - Automation YAML',
            message: `Please add this automation to your automations.yaml:\n\n${yamlConfig}`
          });
          console.log('📝 Timer Card: Automation YAML sent via notification');
          return;
        } catch (serviceError) {
          console.error('Timer Card: Service call also failed:', serviceError);
          throw serviceError;
        }
      }
    } catch (error) {
      console.error('Timer Card: All automation creation methods failed:', error);
      throw error;
    }
  }

  async createControlScript() {
    if (!this.hass) return;

    const scriptId = `timer_24h_control_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const storageEntityId = this.config.storage_entity_id;
    
    console.log(`🚀 Timer Card: Creating script: ${scriptId}`);
    console.log(`🚀 Timer Card: Storage entity: ${storageEntityId}`);
    
    // Build sensor condition template
    let sensorCondition = 'true';
    if (this.config.home_sensors && this.config.home_sensors.length > 0) {
      const sensorChecks = this.config.home_sensors.map(sensor => 
        `states('${sensor}') in ['on', 'home', 'true', 'active', 'detected']`
      );
      sensorCondition = this.config.home_logic === 'AND' ? 
        sensorChecks.join(' and ') : 
        sensorChecks.join(' or ');
    }

    // Build entity control sequences
    const turnOnSequence = [];
    const turnOffSequence = [];
    
    if (this.config.entities && this.config.entities.length > 0) {
      this.config.entities.forEach(entityId => {
        const turnOnService = this.getServiceForEntity(entityId, true);
        const turnOffService = this.getServiceForEntity(entityId, false);
        const turnOnData = this.getServiceDataForEntity(entityId, true);
        const turnOffData = this.getServiceDataForEntity(entityId, false);

        if (turnOnService) {
          turnOnSequence.push({
            service: turnOnService,
            target: { entity_id: entityId },
            ...(Object.keys(turnOnData).length > 0 ? { data: turnOnData } : {})
          });
        }

        if (turnOffService) {
          turnOffSequence.push({
            service: turnOffService,
            target: { entity_id: entityId },
            ...(Object.keys(turnOffData).length > 0 ? { data: turnOffData } : {})
          });
        }
      });
    }
    
    const scriptConfig = {
      alias: `Timer 24H Control - ${this.config.title}`,
      description: `סקריפט בקרה עבור טיימר 24 שעות - ${this.config.title}`,
      mode: 'single',
      sequence: [
        {
          variables: {
            timer_data: `{{ states('${storageEntityId}') if states('${storageEntityId}') not in ['unknown', 'unavailable'] else '' }}`,
            current_hour: '{{ now().hour }}',
            current_minute: '{{ now().minute }}'
          }
        },
        {
          condition: 'template',
          value_template: `{{ timer_data != '' }}`
        },
        {
          variables: {
            parsed_data: `{{ timer_data | from_json if timer_data != '' else {} }}`,
            time_slots: `{{ parsed_data.timeSlots if 'timeSlots' in parsed_data else [] }}`
          }
        },
        {
          variables: {
            current_slot_index: `{{ ((current_hour | int) * 2 + (0 if current_minute | int < 30 else 1)) | int }}`,
            is_time_active: `{{ time_slots[current_slot_index].active if current_slot_index < (time_slots | length) else false }}`
          }
        },
        {
          variables: {
            is_sensors_active: `{{ ${sensorCondition} }}`,
            should_be_active: `{{ is_time_active and is_sensors_active }}`
          }
        },
        {
          choose: [
            {
              conditions: [
                {
                  condition: 'template',
                  value_template: '{{ should_be_active }}'
                }
              ],
              sequence: turnOnSequence
            }
          ],
          default: turnOffSequence
        }
      ]
    };

    try {
      // Try different methods to create script
      try {
        const result = await this.hass.callWS({
          type: 'config/script/create',
          config: scriptConfig
        });
        console.log(`✅ Timer Card: Script created via config API: ${scriptId}`, result);
        return;
      } catch (configError) {
        console.warn('Timer Card: Script config API failed, trying notification:', configError);
        
        // Fallback: Create YAML for manual addition
        const yamlConfig = this.generateScriptYAML(scriptId, scriptConfig);
        await this.hass.callService('persistent_notification', 'create', {
          notification_id: `timer_24h_script_${scriptId}`,
          title: 'Timer 24H Card - Script YAML',
          message: `Please add this script to your scripts.yaml:\n\n${yamlConfig}`
        });
        console.log('📝 Timer Card: Script YAML sent via notification');
        return;
      }
    } catch (error) {
      console.error('Timer Card: Failed to create script:', error);
      throw error;
    }
  }

  generateAutomationYAML(automationId, config) {
    return `# Timer 24H Card Automation
- id: ${automationId}
  alias: "${config.alias}"
  description: "${config.description}"
  mode: ${config.mode}
  trigger:
    - platform: time_pattern
      minutes: "/30"
  condition: []
  action:
    - service: script.turn_on
      target:
        entity_id: ${config.action[0].target.entity_id}`;
  }

  generateScriptYAML(scriptId, config) {
    const yamlLines = [`# Timer 24H Card Script`];
    yamlLines.push(`${scriptId}:`);
    yamlLines.push(`  alias: "${config.alias}"`);
    yamlLines.push(`  description: "${config.description}"`);
    yamlLines.push(`  mode: ${config.mode}`);
    yamlLines.push(`  sequence:`);
    
    config.sequence.forEach((step, index) => {
      if (step.variables) {
        yamlLines.push(`    - variables:`);
        Object.entries(step.variables).forEach(([key, value]) => {
          yamlLines.push(`        ${key}: "${value}"`);
        });
      } else if (step.condition) {
        yamlLines.push(`    - condition: ${step.condition}`);
        yamlLines.push(`      value_template: "${step.value_template}"`);
      } else if (step.choose) {
        yamlLines.push(`    - choose:`);
        yamlLines.push(`        - conditions:`);
        yamlLines.push(`            - condition: template`);
        yamlLines.push(`              value_template: "${step.choose[0].conditions[0].value_template}"`);
        yamlLines.push(`          sequence:`);
        step.choose[0].sequence.forEach(action => {
          yamlLines.push(`            - service: ${action.service}`);
          yamlLines.push(`              target:`);
          yamlLines.push(`                entity_id: ${action.target.entity_id}`);
          if (action.data && Object.keys(action.data).length > 0) {
            yamlLines.push(`              data:`);
            Object.entries(action.data).forEach(([key, value]) => {
              yamlLines.push(`                ${key}: ${value}`);
            });
          }
        });
        yamlLines.push(`      default:`);
        step.default.forEach(action => {
          yamlLines.push(`        - service: ${action.service}`);
          yamlLines.push(`          target:`);
          yamlLines.push(`            entity_id: ${action.target.entity_id}`);
          if (action.data && Object.keys(action.data).length > 0) {
            yamlLines.push(`          data:`);
            Object.entries(action.data).forEach(([key, value]) => {
              yamlLines.push(`            ${key}: ${value}`);
            });
          }
        });
      }
    });
    
    return yamlLines.join('\n');
  }

  getServiceForEntity(entityId, turnOn) {
    const domain = entityId.split('.')[0];
    
    switch (domain) {
      case 'switch':
      case 'input_boolean':
      case 'light':
        return turnOn ? `${domain}.turn_on` : `${domain}.turn_off`;
      case 'climate':
        return 'climate.set_hvac_mode';
      case 'script':
        return turnOn ? 'script.turn_on' : null;
      default:
        return turnOn ? `${domain}.turn_on` : `${domain}.turn_off`;
    }
  }

  getServiceDataForEntity(entityId, turnOn) {
    const domain = entityId.split('.')[0];
    
    switch (domain) {
      case 'climate':
        return { hvac_mode: turnOn ? 'heat' : 'off' };
      default:
        return {};
    }
  }

  async cleanupAutomation() {
    if (!this.hass || !this.config?.title) {
      return;
    }

    try {
      const automationId = `timer_24h_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const scriptId = `timer_24h_control_${this.config.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

      // Schedule cleanup after a delay to avoid issues during page refresh
      setTimeout(async () => {
        if (!this.isConnected) {
          try {
            // Delete automation
            await this.hass.callWS({
              type: 'config/automation/delete',
              config_id: automationId
            });
            console.log(`✅ Timer Card: Automation deleted: ${automationId}`);
            
            // Delete script
            await this.hass.callWS({
              type: 'config/script/delete',
              entity_id: `script.${scriptId}`
            });
            console.log(`✅ Timer Card: Script deleted: ${scriptId}`);
          } catch (error) {
            console.warn('Timer Card: Error during automation cleanup:', error);
          }
        }
      }, 5000); // Wait 5 seconds to ensure card is really being removed
    } catch (error) {
      console.warn('Timer Card: Error scheduling automation cleanup:', error);
    }
  }
}

console.info(
  '%c  TIMER-24H-CARD  %c  Version 2.1.0 - YAML Only  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

// Register the card
customElements.define('timer-24h-card', Timer24HCard);

// Add to custom cards registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: '24h timer with YAML configuration only',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-timer-card',
  // configurable: true, // GUI editor disabled - YAML only
  // Custom icon for HACS and card picker
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Home timer icon" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#41BDF5" stroke="#41BDF5"/>
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

// Define layout property
Timer24HCard.defineLayoutProperty();
