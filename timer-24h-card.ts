import {
  LitElement,
  html,
  svg,
  css,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

// Types
interface Timer24HCardConfig extends LovelaceCardConfig {
  entity: string;
  show_title?: boolean;
  custom_title?: string;
  show_enable_switch?: boolean;
}

// Keep in sync with ENABLE_THIRTY_MINUTE_UI in custom_components/timer_24h/const.py
const ENABLE_THIRTY_MINUTE_UI = false;

interface TimeSlot {
  hour: number;
  minute: number;
  isActive: boolean;
}

interface EntitySettings {
  temperature?: number;
  hvac_mode?: string;
  percentage?: number;
}

interface EntitySettingsMap {
  [entityId: string]: EntitySettings;
}

@customElement('timer-24h-card')
export class Timer24HCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: Timer24HCardConfig;
  @state() private currentTime: Date = new Date();
  @state() private showEntitiesDialog: boolean = false;
  @state() private showConditionsDialog: boolean = false;
  @state() private draftConditionSensors: string[] = [];
  @state() private draftConditionLogic: 'OR' | 'AND' = 'OR';
  @state() private conditionsSaving: boolean = false;
  @state() private selectedHour: number | null = null;
  
  private updateInterval?: number;
  private clickTimeout?: number;

  public static getLayoutOptions() {
    return {
      grid_rows: 2,
      grid_columns: 6,
      grid_min_rows: 2,
      grid_min_columns: 3
    };
  }

  public getCardSize(): number {
    return 3;
  }

  public static async getConfigElement() {
    await import('./timer-24h-card-editor.js');
    return document.createElement('timer-24h-card-editor');
  }

  public static getStubConfig(): Timer24HCardConfig {
    return {
      type: 'custom:timer-24h-card',
      entity: '',
      show_title: true,
    };
  }

  constructor() {
    super();
  }

  public setConfig(config: Timer24HCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration: config is required');
    }
    
    if (!config.entity) {
      throw new Error('Invalid configuration: entity is required');
    }

    this.config = {
      show_title: true,
      ...config
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Dialog open/close must update immediately (do not wait for hass/currentTime)
    if (
      changedProps.has('config') ||
      changedProps.has('showEntitiesDialog') ||
      changedProps.has('showConditionsDialog') ||
      changedProps.has('draftConditionSensors') ||
      changedProps.has('draftConditionLogic') ||
      changedProps.has('conditionsSaving') ||
      changedProps.has('selectedHour')
    ) {
      return true;
    }
    
    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.config?.entity) {
        return true;
      }
      
      const oldState = oldHass.states[this.config.entity];
      const newState = this.hass.states[this.config.entity];
      
      // Check if the entity state object changed
      if (oldState !== newState) {
        return true;
      }
      
      // Deep check if time_slots content has changed
      const oldSlots = JSON.stringify(oldState?.attributes.time_slots || []);
      const newSlots = JSON.stringify(newState?.attributes.time_slots || []);
      
      if (oldSlots !== newSlots) {
        console.log('🔄 Time slots changed, updating card');
        return true;
      }

      if (oldState?.attributes.slot_resolution !== newState?.attributes.slot_resolution) {
        return true;
      }
      
      // Check if controlled entities states have changed
      const controlledEntities = newState?.attributes.controlled_entities || [];
      for (const entityId of controlledEntities) {
        const oldEntityState = oldHass.states[entityId];
        const newEntityState = this.hass.states[entityId];
        if (
          oldEntityState?.state !== newEntityState?.state ||
          oldEntityState?.attributes?.temperature !== newEntityState?.attributes?.temperature ||
          oldEntityState?.attributes?.percentage !== newEntityState?.attributes?.percentage
        ) {
          console.log('🔄 Controlled entity state changed:', entityId);
          return true;
        }
      }

      const oldSettings = JSON.stringify(oldState?.attributes.entity_settings || {});
      const newSettings = JSON.stringify(newState?.attributes.entity_settings || {});
      if (oldSettings !== newSettings) {
        return true;
      }

      const oldConditions = JSON.stringify({
        sensors: oldState?.attributes.home_sensors || [],
        logic: oldState?.attributes.home_logic || 'OR',
      });
      const newConditions = JSON.stringify({
        sensors: newState?.attributes.home_sensors || [],
        logic: newState?.attributes.home_logic || 'OR',
      });
      if (oldConditions !== newConditions) {
        return true;
      }
    }
    
    return changedProps.has('currentTime');
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    
    if (changedProps.has('hass') && this.hass) {
      this.updateCurrentTime();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.startTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private startTimer(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = window.setInterval(() => {
      this.updateCurrentTime();
    }, 15000);
  }

  private updateCurrentTime(): void {
    this.currentTime = new Date();
    this.requestUpdate();
  }

  private getEntityState() {
    if (!this.hass || !this.config.entity) {
      return null;
    }
    return this.hass.states[this.config.entity];
  }

  private getTimeSlots(): TimeSlot[] {
    const entity = this.getEntityState();
    if (!entity || !entity.attributes.time_slots) {
      const slots: TimeSlot[] = [];
      for (let hour = 0; hour < 24; hour++) {
        slots.push({ hour, minute: 0, isActive: false });
        slots.push({ hour, minute: 15, isActive: false });
        slots.push({ hour, minute: 30, isActive: false });
        slots.push({ hour, minute: 45, isActive: false });
      }
      return slots;
    }
    
    // Return server state directly - no optimistic updates
    return entity.attributes.time_slots;
  }

  private getSlotResolution(): 15 | 30 {
    if (!ENABLE_THIRTY_MINUTE_UI) {
      return 15;
    }
    const value = Number(this.getEntityState()?.attributes?.slot_resolution);
    return value === 30 ? 30 : 15;
  }

  private currentQuarterMinute(): number {
    return Math.floor(this.currentTime.getMinutes() / 15) * 15;
  }

  private getHomeStatus(): boolean {
    const entity = this.getEntityState();
    if (!entity) return true;
    return entity.attributes.home_status !== false;
  }

  private getEntityName(): string {
    // If custom title is set, use it
    if (this.config.custom_title) {
      return this.config.custom_title;
    }
    
    // Otherwise use entity's friendly name
    const entity = this.getEntityState();
    if (!entity) return 'Timer 24H';
    return entity.attributes.friendly_name || 'Timer 24H';
  }

  private isEntityOn(entityId: string): boolean {
    const entityState = this.hass?.states[entityId];
    if (!entityState) return false;
    const state = (entityState.state || '').toLowerCase();
    if (state === 'unavailable' || state === 'unknown') return false;
    if (entityId.startsWith('climate.')) {
      return state !== 'off';
    }
    return state === 'on';
  }

  private getControlledEntitiesStatus(): { 
    total: number; 
    active: number; 
    entities: string[];
  } {
    const entity = this.getEntityState();
    if (!entity) {
      return { total: 0, active: 0, entities: [] };
    }
    
    const controlledEntities = entity.attributes.controlled_entities || [];
    let activeCount = 0;
    
    for (const entityId of controlledEntities) {
      if (this.isEntityOn(entityId)) {
        activeCount++;
      }
    }
    
    return {
      total: controlledEntities.length,
      active: activeCount,
      entities: controlledEntities
    };
  }

  private getEntitySettingsMap(): EntitySettingsMap {
    const entity = this.getEntityState();
    return (entity?.attributes?.entity_settings as EntitySettingsMap) || {};
  }

  private getClimateEntities(): string[] {
    return this.getControlledEntitiesStatus().entities.filter((id) =>
      id.startsWith('climate.')
    );
  }

  private getFanEntities(): string[] {
    return this.getControlledEntitiesStatus().entities.filter((id) =>
      id.startsWith('fan.')
    );
  }

  private getFriendlyName(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name || entityId;
  }

  private localize(key: string): string {
    const lang = this.hass?.language || this.hass?.locale?.language || 'en';
    
    const translations: Record<string, Record<string, string>> = {
      en: {
        active: 'Active',
        inactive: 'Inactive',
        on: 'ON',
        off: 'OFF',
        entity: 'entity',
        entities: 'entities',
        configure_entity: 'Please configure the timer entity in card settings',
        entity_not_found: 'Entity not found. Please check your configuration.',
        enable_timer: 'Enable Timer',
        climate_controls: 'Climate',
        fan_controls: 'Fan',
        temperature: 'Temp',
        mode: 'Mode',
        speed: 'Speed',
        cool: 'Cool',
        heat: 'Heat',
        heat_cool: 'Auto',
        auto: 'Auto',
        dry: 'Dry',
        fan_only: 'Fan',
        entities_list: 'Controlled Entities',
        close: 'Close',
        no_entities: 'No entities configured',
        activation_conditions: 'Activation Conditions',
        condition_logic: 'Condition logic',
        logic_or: 'OR (any)',
        logic_and: 'AND (all)',
        add_condition: 'Add condition',
        no_conditions: 'No conditions — timer always allowed',
        conditions_hint: 'Saved to the integration (works in background). Empty = always active.',
        save: 'Save',
        remove: 'Remove',
        condition_met: 'Met',
        condition_not_met: 'Not met',
        edit_conditions: 'Edit',
      },
      he: {
        active: 'פעיל',
        inactive: 'לא פעיל',
        on: 'דלוק',
        off: 'כבוי',
        entity: 'ישות',
        entities: 'ישויות',
        configure_entity: 'אנא הגדר את ישות הטיימר בהגדרות הכרטיס',
        entity_not_found: 'הישות לא נמצאה. אנא בדוק את ההגדרות.',
        enable_timer: 'הפעל טיימר',
        climate_controls: 'מזגן',
        fan_controls: 'מאוורר',
        temperature: 'מעלות',
        mode: 'מצב',
        speed: 'מהירות',
        cool: 'קור',
        heat: 'חום',
        heat_cool: 'אוטו',
        auto: 'אוטו',
        dry: 'ייבוש',
        fan_only: 'מאוורר',
        entities_list: 'ישויות מבוקרות',
        close: 'סגור',
        no_entities: 'לא הוגדרו ישויות',
        activation_conditions: 'תנאי הפעלה',
        condition_logic: 'לוגיקת תנאים',
        logic_or: 'OR (אחד מספיק)',
        logic_and: 'AND (הכל חייב)',
        add_condition: 'הוסף תנאי',
        no_conditions: 'אין תנאים — הטיימר תמיד מורשה',
        conditions_hint: 'נשמר באינטגרציה (עובד ברקע). ריק = תמיד פעיל.',
        save: 'שמור',
        remove: 'הסר',
        condition_met: 'מתקיים',
        condition_not_met: 'לא מתקיים',
        edit_conditions: 'ערוך',
      },
    };
    
    return translations[lang]?.[key] || translations['en'][key] || key;
  }

  private localizeHvacMode(mode: string): string {
    const known = ['cool', 'heat', 'heat_cool', 'auto', 'dry', 'fan_only', 'off'];
    if (known.includes(mode)) {
      return this.localize(mode);
    }
    return mode;
  }

  private getHvacModeIcon(mode: string): string {
    const icons: Record<string, string> = {
      cool: 'mdi:snowflake',
      heat: 'mdi:fire',
      heat_cool: 'mdi:sun-snowflake-variant',
      auto: 'mdi:thermostat-auto',
      dry: 'mdi:water-percent',
      fan_only: 'mdi:fan',
      off: 'mdi:power',
    };
    return icons[mode] || 'mdi:thermostat';
  }

  private handleSlotClick(event: Event, hour: number, minute: number): void {
    // Stop event propagation to prevent multiple triggers
    event.stopPropagation();
    event.preventDefault();
    
    const key = `${hour}:${String(minute).padStart(2, '0')}`;
    console.log(`👆 Click detected on ${key}`);
    
    // Debounce - prevent multiple rapid clicks
    if (this.clickTimeout) {
      console.log(`⏸️ Debounced - ignoring click on ${key}`);
      return; // Ignore if already processing a click
    }
    
    this.clickTimeout = window.setTimeout(() => {
      this.clickTimeout = undefined;
    }, 300); // 300ms debounce
    
    // Call the toggle function
    console.log(`✅ Processing click on ${key}`);
    this.toggleTimeSlot(hour, minute);
  }

  private handleFifteenClick(event: Event, hour: number, minute: number): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.clickTimeout) {
      return;
    }

    this.clickTimeout = window.setTimeout(() => {
      this.clickTimeout = undefined;
    }, 300);

    if (this.selectedHour !== hour) {
      this.selectedHour = hour;
      return;
    }

    this.toggleTimeSlot(hour, minute);
  }

  private async toggleTimeSlot(hour: number, minute: number): Promise<void> {
    if (!this.hass || !this.config.entity) return;

    const key = `${hour}:${String(minute).padStart(2, '0')}`;
    
    try {
      console.log(`🎯 Toggle slot: ${key}`);
      
      // Call service - NO optimistic updates
      await this.hass.callService('timer_24h', 'toggle_slot', {
        entity_id: this.config.entity,
        hour: hour,
        minute: minute,
      });
      
      console.log(`✅ Service call completed for ${key}`);
      
    } catch (error) {
      console.error(`❌ Failed to toggle time slot ${key}:`, error);
    }
  }
  
  private getEnabled(): boolean {
    const entity = this.getEntityState();
    return entity?.attributes.enabled !== false;
  }
  
  private shouldShowEnableSwitch(): boolean {
    // Check card config only
    return this.config.show_enable_switch === true;
  }
  
  private async handleEnableToggle(event: Event): Promise<void> {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    const enabled = target.checked;
    
    if (!this.hass || !this.config.entity) return;
    
    try {
      console.log(`🔄 Setting enabled to: ${enabled}`);
      
      await this.hass.callService('timer_24h', 'set_enabled', {
        entity_id: this.config.entity,
        enabled: enabled,
      });
      
      console.log(`✅ Enabled state updated to: ${enabled}`);
    } catch (error) {
      console.error(`❌ Failed to set enabled state:`, error);
    }
  }

  private async updateEntitySettings(
    targetEntityId: string,
    updates: EntitySettings
  ): Promise<void> {
    if (!this.hass || !this.config.entity) return;

    try {
      await this.hass.callService('timer_24h', 'set_entity_settings', {
        entity_id: this.config.entity,
        target_entity_id: targetEntityId,
        ...updates,
      });
    } catch (error) {
      console.error('❌ Failed to update entity settings:', error);
    }
  }

  private getClimateTemp(entityId: string): number {
    const saved = this.getEntitySettingsMap()[entityId]?.temperature;
    if (typeof saved === 'number') return saved;

    const state = this.hass.states[entityId];
    const current = state?.attributes?.temperature;
    if (typeof current === 'number') return current;

    return 24;
  }

  private getClimateMode(entityId: string): string {
    const saved = this.getEntitySettingsMap()[entityId]?.hvac_mode;
    if (saved) return saved;

    const state = this.hass.states[entityId];
    if (state && state.state !== 'off') return state.state;

    const modes: string[] = state?.attributes?.hvac_modes || [];
    const preferred = modes.find((m) => m !== 'off') || 'cool';
    return preferred;
  }

  private getFanPercentage(entityId: string): number {
    const saved = this.getEntitySettingsMap()[entityId]?.percentage;
    if (typeof saved === 'number') return saved;

    const state = this.hass.states[entityId];
    const current = state?.attributes?.percentage;
    if (typeof current === 'number') return current;

    return 50;
  }

  private getClimateModes(entityId: string): string[] {
    const state = this.hass.states[entityId];
    const modes: string[] = state?.attributes?.hvac_modes || [
      'cool',
      'heat',
      'heat_cool',
      'dry',
      'fan_only',
    ];
    return modes.filter((mode) => mode !== 'off');
  }

  private async adjustClimateTemp(entityId: string, delta: number): Promise<void> {
    const state = this.hass.states[entityId];
    const minTemp = Number(state?.attributes?.min_temp ?? 16);
    const maxTemp = Number(state?.attributes?.max_temp ?? 30);
    const next = Math.min(maxTemp, Math.max(minTemp, this.getClimateTemp(entityId) + delta));
    await this.updateEntitySettings(entityId, {
      temperature: next,
      hvac_mode: this.getClimateMode(entityId),
    });
  }

  private async setClimateMode(entityId: string, mode: string): Promise<void> {
    await this.updateEntitySettings(entityId, {
      hvac_mode: mode,
      temperature: this.getClimateTemp(entityId),
    });
  }

  private async adjustFanPercentage(entityId: string, delta: number): Promise<void> {
    const state = this.hass.states[entityId];
    const step = Number(state?.attributes?.percentage_step ?? 10);
    const next = Math.min(100, Math.max(0, this.getFanPercentage(entityId) + delta * step));
    await this.updateEntitySettings(entityId, { percentage: next });
  }

  private handleCenterClick(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.draftConditionSensors = this.getConditionSensors();
    this.draftConditionLogic = this.getConditionLogic();
    this.showEntitiesDialog = true;
  }

  private closeEntitiesDialog(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.showEntitiesDialog = false;
  }

  private isConditionMet(entityId: string): boolean {
    const state = this.hass?.states[entityId]?.state;
    if (!state) return false;
    return ['on', 'home', 'true', '1', 'yes'].includes(state.toLowerCase());
  }

  private getConditionSensors(): string[] {
    const entity = this.hass?.states[this.config.entity];
    const sensors = entity?.attributes?.home_sensors;
    return Array.isArray(sensors) ? [...sensors] : [];
  }

  private getConditionLogic(): 'OR' | 'AND' {
    const entity = this.hass?.states[this.config.entity];
    const logic = String(entity?.attributes?.home_logic || 'OR').toUpperCase();
    return logic === 'AND' ? 'AND' : 'OR';
  }

  private getAvailableConditionSensors(): string[] {
    if (!this.hass) return [];
    const domains = [
      'person',
      'device_tracker',
      'binary_sensor',
      'sensor',
      'input_boolean',
    ];
    return Object.keys(this.hass.states)
      .filter((id) => domains.some((d) => id.startsWith(`${d}.`)))
      .sort();
  }

  private openConditionsDialog(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.draftConditionSensors = this.getConditionSensors();
    this.draftConditionLogic = this.getConditionLogic();
    this.showConditionsDialog = true;
  }

  private closeConditionsDialog(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.showConditionsDialog = false;
  }

  private addConditionSensor(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const entityId = target.value;
    if (!entityId) return;
    if (!this.draftConditionSensors.includes(entityId)) {
      this.draftConditionSensors = [...this.draftConditionSensors, entityId];
    }
    target.value = '';
  }

  private removeConditionSensor(entityId: string): void {
    this.draftConditionSensors = this.draftConditionSensors.filter(
      (id) => id !== entityId
    );
  }

  private setDraftConditionLogic(logic: 'OR' | 'AND'): void {
    this.draftConditionLogic = logic;
  }

  private async saveActivationConditions(): Promise<void> {
    if (!this.hass || !this.config?.entity || this.conditionsSaving) return;
    this.conditionsSaving = true;
    try {
      await this.hass.callService('timer_24h', 'set_activation_conditions', {
        entity_id: this.config.entity,
        home_sensors: this.draftConditionSensors,
        home_logic: this.draftConditionLogic,
      });
      this.showConditionsDialog = false;
    } catch (error) {
      console.error('❌ Failed to update activation conditions:', error);
    } finally {
      this.conditionsSaving = false;
    }
  }

  private renderConditionsEditor(): TemplateResult {
    const selected = new Set(this.draftConditionSensors);
    const available = this.getAvailableConditionSensors().filter(
      (id) => !selected.has(id)
    );

    return html`
      <p class="conditions-hint">${this.localize('conditions_hint')}</p>

      <div class="conditions-section">
        <div class="conditions-label">${this.localize('condition_logic')}</div>
        <div class="logic-toggle">
          <button
            type="button"
            class="logic-btn ${this.draftConditionLogic === 'OR' ? 'active' : ''}"
            @click=${() => this.setDraftConditionLogic('OR')}
          >${this.localize('logic_or')}</button>
          <button
            type="button"
            class="logic-btn ${this.draftConditionLogic === 'AND' ? 'active' : ''}"
            @click=${() => this.setDraftConditionLogic('AND')}
          >${this.localize('logic_and')}</button>
        </div>
      </div>

      <div class="conditions-section">
        ${this.draftConditionSensors.length === 0
          ? html`<div class="no-entities">${this.localize('no_conditions')}</div>`
          : html`
              <ul class="entities-list">
                ${this.draftConditionSensors.map((entityId) => {
                  const met = this.isConditionMet(entityId);
                  return html`
                    <li class="entity-item ${met ? 'on' : 'off'}">
                      <ha-icon icon="${this.getEntityIcon(entityId)}"></ha-icon>
                      <span class="entity-name">${this.getFriendlyName(entityId)}</span>
                      <span class="entity-state ${met ? 'on' : 'off'}">
                        ${met
                          ? this.localize('condition_met')
                          : this.localize('condition_not_met')}
                      </span>
                      <button
                        type="button"
                        class="remove-btn"
                        @click=${() => this.removeConditionSensor(entityId)}
                        aria-label="${this.localize('remove')}"
                      >×</button>
                    </li>
                  `;
                })}
              </ul>
            `}
      </div>

      <div class="conditions-section">
        <label class="conditions-label" for="add-condition">
          ${this.localize('add_condition')}
        </label>
        <select
          id="add-condition"
          class="condition-select"
          @change=${this.addConditionSensor}
        >
          <option value="">-- ${this.localize('add_condition')} --</option>
          ${available.map(
            (entityId) => html`
              <option value="${entityId}">
                ${this.getFriendlyName(entityId)} (${entityId})
              </option>
            `
          )}
        </select>
      </div>

      <button
        type="button"
        class="save-conditions-btn"
        ?disabled=${this.conditionsSaving}
        @click=${() => this.saveActivationConditions()}
      >
        ${this.localize('save')}
      </button>
    `;
  }

  private renderConditionsDialog(): TemplateResult {
    if (!this.showConditionsDialog) return html``;

    return html`
      <div
        class="dialog-overlay"
        @click=${this.closeConditionsDialog}
        @pointerdown=${this.closeConditionsDialog}
      >
        <div
          class="dialog-content conditions-dialog"
          @click=${(e: Event) => e.stopPropagation()}
          @pointerdown=${(e: Event) => e.stopPropagation()}
        >
          <div class="dialog-header">
            <span class="dialog-title">${this.localize('activation_conditions')}</span>
            <button
              type="button"
              class="dialog-close"
              @click=${this.closeConditionsDialog}
              aria-label="${this.localize('close')}"
            >×</button>
          </div>
          <div class="dialog-body">
            ${this.renderConditionsEditor()}
          </div>
        </div>
      </div>
    `;
  }

  private getEntityIcon(entityId: string): string {
    const state = this.hass.states[entityId];
    if (state?.attributes.icon) {
      return state.attributes.icon;
    }
    const domain = entityId.split('.')[0];
    const defaultIcons: Record<string, string> = {
      light: 'mdi:lightbulb',
      switch: 'mdi:toggle-switch',
      fan: 'mdi:fan',
      climate: 'mdi:thermostat',
      media_player: 'mdi:cast',
      cover: 'mdi:window-shutter',
      input_boolean: 'mdi:toggle-switch-outline',
      person: 'mdi:account',
      device_tracker: 'mdi:cellphone',
      binary_sensor: 'mdi:checkbox-marked-circle-outline',
      sensor: 'mdi:eye',
    };
    return defaultIcons[domain] || 'mdi:toggle-switch';
  }

  private renderEntitiesDialog(): TemplateResult {
    if (!this.showEntitiesDialog) return html``;

    const status = this.getControlledEntitiesStatus();

    return html`
      <div
        class="dialog-overlay"
        @click=${this.closeEntitiesDialog}
        @pointerdown=${this.closeEntitiesDialog}
      >
        <div
          class="dialog-content conditions-dialog"
          @click=${(e: Event) => e.stopPropagation()}
          @pointerdown=${(e: Event) => e.stopPropagation()}
        >
          <div class="dialog-header">
            <span class="dialog-title">${this.localize('entities_list')}</span>
            <button
              type="button"
              class="dialog-close"
              @click=${this.closeEntitiesDialog}
              aria-label="${this.localize('close')}"
            >×</button>
          </div>
          <div class="dialog-body">
            <div class="dialog-section">
              <div class="conditions-label">${this.localize('entities_list')}</div>
              ${status.entities.length === 0
                ? html`<div class="no-entities">${this.localize('no_entities')}</div>`
                : html`
                    <ul class="entities-list">
                      ${status.entities.map((entityId) => {
                        const isOn = this.isEntityOn(entityId);
                        return html`
                          <li class="entity-item ${isOn ? 'on' : 'off'}">
                            <ha-icon icon="${this.getEntityIcon(entityId)}"></ha-icon>
                            <span class="entity-name">${this.getFriendlyName(entityId)}</span>
                            <span class="entity-state ${isOn ? 'on' : 'off'}">
                              ${isOn ? this.localize('on') : this.localize('off')}
                            </span>
                          </li>
                        `;
                      })}
                    </ul>
                  `}
            </div>

            <div class="dialog-section dialog-section-divider">
              <div class="conditions-label">${this.localize('activation_conditions')}</div>
              ${this.renderConditionsEditor()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderClimateControls(): TemplateResult {
    const climateEntities = this.getClimateEntities();
    if (climateEntities.length === 0) {
      return html``;
    }

    return html`
      <div class="device-controls">
        ${climateEntities.map((entityId) => {
          const temp = this.getClimateTemp(entityId);
          const mode = this.getClimateMode(entityId);
          const modes = this.getClimateModes(entityId);

          return html`
            <div class="device-control-card">
              ${climateEntities.length > 1
                ? html`<div class="device-control-name">${this.getFriendlyName(entityId)}</div>`
                : ''}
              <div class="control-row single-row">
                <ha-icon class="control-icon" icon="mdi:thermometer"></ha-icon>
                <div class="temp-controls">
                  <button
                    class="ctrl-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustClimateTemp(entityId, -1);
                    }}
                  >−</button>
                  <span class="temp-value">${temp}°</span>
                  <button
                    class="ctrl-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustClimateTemp(entityId, 1);
                    }}
                  >+</button>
                </div>
                <div class="mode-buttons">
                  ${modes.map(
                    (m) => html`
                      <button
                        class="mode-btn ${mode === m ? 'active' : ''}"
                        title="${this.localizeHvacMode(m)}"
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this.setClimateMode(entityId, m);
                        }}
                      >
                        <ha-icon icon="${this.getHvacModeIcon(m)}"></ha-icon>
                      </button>
                    `
                  )}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private renderFanControls(): TemplateResult {
    const fanEntities = this.getFanEntities();
    if (fanEntities.length === 0) {
      return html``;
    }

    return html`
      <div class="device-controls">
        ${fanEntities.map((entityId) => {
          const percentage = this.getFanPercentage(entityId);

          return html`
            <div class="device-control-card">
              ${fanEntities.length > 1
                ? html`<div class="device-control-name">${this.getFriendlyName(entityId)}</div>`
                : ''}
              <div class="control-row single-row">
                <ha-icon class="control-icon" icon="mdi:fan"></ha-icon>
                <div class="temp-controls">
                  <button
                    class="ctrl-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustFanPercentage(entityId, -1);
                    }}
                  >−</button>
                  <span class="temp-value">${percentage}%</span>
                  <button
                    class="ctrl-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustFanPercentage(entityId, 1);
                    }}
                  >+</button>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
  
  
  private renderEnableSwitch(): TemplateResult {
    const enabled = this.getEnabled();
    
    return html`
      <label class="enable-switch-label" title="${this.localize('enable_timer')}">
        <span class="enable-switch-text">
          ${this.localize('enable_timer')}
        </span>
        <input
          type="checkbox"
          class="enable-switch"
          .checked="${enabled}"
          @change="${this.handleEnableToggle}"
        />
      </label>
    `;
  }

  private createSectorPath(
    hour: number,
    totalSectors: number,
    innerRadius: number,
    outerRadius: number,
    centerX: number,
    centerY: number,
    inset: number = 0
  ): string {
    const anglePerSector = 360 / totalSectors;
    const midRadius = (innerRadius + outerRadius) / 2;
    // Inset radial edges by ~inset px so a centered stroke sits inside the sector
    const angularInsetDeg = midRadius > 0 ? (inset / midRadius) * (180 / Math.PI) : 0;

    const startAngle = (hour * anglePerSector - 90 + angularInsetDeg) * (Math.PI / 180);
    const endAngle = ((hour + 1) * anglePerSector - 90 - angularInsetDeg) * (Math.PI / 180);

    const rInner = innerRadius + inset;
    const rOuter = outerRadius - inset;

    const x1 = centerX + rInner * Math.cos(startAngle);
    const y1 = centerY + rInner * Math.sin(startAngle);
    const x2 = centerX + rOuter * Math.cos(startAngle);
    const y2 = centerY + rOuter * Math.sin(startAngle);
    const x3 = centerX + rOuter * Math.cos(endAngle);
    const y3 = centerY + rOuter * Math.sin(endAngle);
    const x4 = centerX + rInner * Math.cos(endAngle);
    const y4 = centerY + rInner * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  }

  private renderCurrentTimeHighlight(
    centerX: number,
    centerY: number,
    innerRadius: number,
    middleRadius: number,
    outerRadius: number
  ) {
    const hour = this.currentTime.getHours();
    const quarter = this.currentQuarterMinute();
    let r0 = innerRadius;
    let r1 = middleRadius;
    if (this.getSlotResolution() === 15) {
      const bands = [
        { m: 0, a: (middleRadius + outerRadius) / 2, b: outerRadius },
        { m: 15, a: middleRadius, b: (middleRadius + outerRadius) / 2 },
        { m: 30, a: (innerRadius + middleRadius) / 2, b: middleRadius },
        { m: 45, a: innerRadius, b: (innerRadius + middleRadius) / 2 },
      ];
      const band = bands.find(b => b.m === quarter) || bands[0];
      r0 = band.a;
      r1 = band.b;
    } else {
      const isOuter = this.currentTime.getMinutes() < 30;
      r0 = isOuter ? middleRadius : innerRadius;
      r1 = isOuter ? outerRadius : middleRadius;
    }
    // Half of stroke-width so the frame sits fully inside the slot
    const strokeWidth = 3;
    const inset = strokeWidth / 2;
    const highlightPath = this.createSectorPath(hour, 24, r0, r1, centerX, centerY, inset);

    return svg`
      <path
        d="${highlightPath}"
        fill="none"
        stroke="#ff6b6b"
        stroke-width="${strokeWidth}"
        stroke-linejoin="round"
        stroke-linecap="round"
        pointer-events="none">
      </path>
    `;
  }

  private getTextPosition(hour: number, totalSectors: number, radius: number, centerX: number, centerY: number): { x: number; y: number } {
    const angle = ((hour + 0.5) * 360 / totalSectors - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }

  private getSectorCenterAngleDeg(index: number, totalSectors: number): number {
    return (index + 0.5) * (360 / totalSectors) - 90;
  }

  private getUprightTextRotationDeg(angleDeg: number): number {
    // Keep text readable in the bottom half of the circle by flipping 180°
    if (angleDeg > 90 || angleDeg < -90) {
      return angleDeg + 180;
    }
    return angleDeg;
  }

  private getTimeLabel(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  private renderSectorLabel(
    hour: number,
    radius: number,
    centerX: number,
    centerY: number,
    text: string,
    fontSize: number,
    fill: string,
  ) {
    const pos = this.getTextPosition(hour, 24, radius, centerX, centerY);
    const rotationDeg = this.getUprightTextRotationDeg(
      this.getSectorCenterAngleDeg(hour, 24)
    );
    return svg`
      <text
        x="${pos.x}"
        y="${pos.y}"
        text-anchor="middle"
        dominant-baseline="central"
        alignment-baseline="middle"
        font-size="${fontSize}"
        font-weight="bold"
        transform="rotate(${rotationDeg} ${pos.x} ${pos.y})"
        style="pointer-events: none; user-select: none; direction: ltr;"
        fill="${fill}">
        ${text}
      </text>
    `;
  }

  private renderThirtyMinuteSectors(
    timeSlots: TimeSlot[],
    centerX: number,
    centerY: number,
    innerRadius: number,
    middleRadius: number,
    outerRadius: number,
  ) {
    const bands: { m: number; pair: number; a: number; b: number }[] = [
      { m: 0, pair: 0, a: (middleRadius + outerRadius) / 2, b: outerRadius },
      { m: 15, pair: 0, a: middleRadius, b: (middleRadius + outerRadius) / 2 },
      { m: 30, pair: 30, a: (innerRadius + middleRadius) / 2, b: middleRadius },
      { m: 45, pair: 30, a: innerRadius, b: (innerRadius + middleRadius) / 2 },
    ];

    return svg`
      ${Array.from({ length: 24 }, (_, hour) => bands.map(band => {
        const isActive = timeSlots.find(s => s.hour === hour && s.minute === band.m)?.isActive || false;
        const sectorPath = this.createSectorPath(hour, 24, band.a, band.b, centerX, centerY);
        const clickHandler = (e: Event) => {
          this.handleSlotClick(e, hour, band.pair);
        };
        return svg`
          <path
            d="${sectorPath}"
            fill="${isActive ? '#10b981' : (band.m === 0 ? '#ffffff' : '#f8f9fa')}"
            stroke="#e5e7eb"
            stroke-width="1"
            style="cursor: pointer; transition: all 0.2s;"
            @click="${clickHandler}">
            <title>${this.getTimeLabel(hour, band.m)}</title>
          </path>
        `;
      }))}
      ${Array.from({ length: 24 }, (_, hour) => {
        const hourOn = [0, 15].every(m => timeSlots.find(s => s.hour === hour && s.minute === m)?.isActive);
        return this.renderSectorLabel(
          hour,
          (middleRadius + outerRadius) / 2,
          centerX,
          centerY,
          this.getTimeLabel(hour, 0),
          11,
          hourOn ? '#ffffff' : '#374151',
        );
      })}
      ${Array.from({ length: 24 }, (_, hour) => {
        const halfOn = [30, 45].every(m => timeSlots.find(s => s.hour === hour && s.minute === m)?.isActive);
        return this.renderSectorLabel(
          hour,
          (innerRadius + middleRadius) / 2,
          centerX,
          centerY,
          this.getTimeLabel(hour, 30),
          9,
          halfOn ? '#ffffff' : '#6b7280',
        );
      })}
    `;
  }

  private renderFifteenMinuteSectors(
    timeSlots: TimeSlot[],
    centerX: number,
    centerY: number,
    innerRadius: number,
    middleRadius: number,
    outerRadius: number,
  ) {
    const bands: { m: number; a: number; b: number }[] = [
      { m: 0, a: (middleRadius + outerRadius) / 2, b: outerRadius },
      { m: 15, a: middleRadius, b: (middleRadius + outerRadius) / 2 },
      { m: 30, a: (innerRadius + middleRadius) / 2, b: middleRadius },
      { m: 45, a: innerRadius, b: (innerRadius + middleRadius) / 2 },
    ];
    const outerBand = bands[0];
    const outerLabelRadius = (outerBand.a + outerBand.b) / 2;
    const selectColor = '#3b82f6';

    return svg`
      ${Array.from({ length: 24 }, (_, hour) => bands.map(band => {
        const isActive = timeSlots.find(s => s.hour === hour && s.minute === band.m)?.isActive || false;
        const selected = this.selectedHour === hour;
        const sectorPath = this.createSectorPath(hour, 24, band.a, band.b, centerX, centerY);
        const clickHandler = (e: Event) => {
          this.handleFifteenClick(e, hour, band.m);
        };
        return svg`
          <path
            d="${sectorPath}"
            fill="${isActive ? '#10b981' : '#ffffff'}"
            stroke="${selected ? selectColor : '#e5e7eb'}"
            stroke-width="${selected ? '2.5' : '1'}"
            style="cursor: pointer; transition: all 0.2s;"
            @click="${clickHandler}">
            <title>${this.getTimeLabel(hour, band.m)}</title>
          </path>
          ${selected && band.m !== 0
            ? this.renderSectorLabel(
                hour,
                (band.a + band.b) / 2,
                centerX,
                centerY,
                String(band.m),
                9,
                isActive ? '#ffffff' : '#374151',
              )
            : ''}
        `;
      }))}
      ${Array.from({ length: 24 }, (_, hour) => {
        const allOn = [0, 15, 30, 45].every(m =>
          timeSlots.find(s => s.hour === hour && s.minute === m)?.isActive
        );
        return this.renderSectorLabel(
          hour,
          outerLabelRadius,
          centerX,
          centerY,
          hour.toString().padStart(2, '0'),
          11,
          allOn ? '#ffffff' : '#374151',
        );
      })}
    `;
  }

  private renderDividingLines() {
    const lines = [];
    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;
    
    for (let i = 0; i < 24; i++) {
      const angle = (i * 360 / 24 - 90) * (Math.PI / 180);
      const xInner = centerX + innerRadius * Math.cos(angle);
      const yInner = centerY + innerRadius * Math.sin(angle);
      const xOuter = centerX + outerRadius * Math.cos(angle);
      const yOuter = centerY + outerRadius * Math.sin(angle);
      
      lines.push(html`
        <line 
          x1="${xInner}" 
          y1="${yInner}" 
          x2="${xOuter}" 
          y2="${yOuter}" 
          stroke="#e5e7eb" 
          stroke-width="1">
        </line>
      `);
    }
    
    return lines;
  }

  private renderOuterSectors() {
    const sectors = [];
    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;
    const timeSlots = this.getTimeSlots();
    
    for (let hour = 0; hour < 24; hour++) {
      const sectorPath = this.createSectorPath(hour, 24, innerRadius, outerRadius, centerX, centerY);
      const textPos = this.getTextPosition(hour, 24, (innerRadius + outerRadius) / 2, centerX, centerY);
      const angleDeg = this.getSectorCenterAngleDeg(hour, 24);
      const rotationDeg = this.getUprightTextRotationDeg(angleDeg);
      const labelY = textPos.y + 3;
      const slot = timeSlots.find(s => s.hour === hour && s.minute === 0);
      const isActive = slot?.isActive || false;
      const isCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() < 30;
      
      sectors.push(html`
        <path 
          d="${sectorPath}" 
          fill="${isActive ? '#10b981' : '#ffffff'}"
          stroke="${isCurrent ? '#ff6b6b' : '#e5e7eb'}"
          stroke-width="${isCurrent ? '3' : '1'}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${() => this.toggleTimeSlot(hour, 0)}">
        </path>
        <text 
          x="${textPos.x}" 
          y="${labelY}" 
          text-anchor="middle" 
          font-size="11" 
          font-weight="bold"
          transform="rotate(${rotationDeg} ${textPos.x} ${labelY})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${isActive ? '#ffffff' : '#374151'}">
          ${this.getTimeLabel(hour, 0)}
        </text>
      `);
    }
    
    return sectors;
  }

  private renderInnerSectors() {
    const sectors = [];
    const centerX = 200;
    const centerY = 200;
    const innerRadius = 50;
    const timeSlots = this.getTimeSlots();
    
    for (let hour = 0; hour < 24; hour++) {
      const sectorPath = this.createSectorPath(hour, 24, 0, innerRadius, centerX, centerY);
      const textPos = this.getTextPosition(hour, 24, innerRadius / 2, centerX, centerY);
      const angleDeg = this.getSectorCenterAngleDeg(hour, 24);
      const rotationDeg = this.getUprightTextRotationDeg(angleDeg);
      const labelY = textPos.y + 2;
      const slot = timeSlots.find(s => s.hour === hour && s.minute === 30);
      const isActive = slot?.isActive || false;
      const isCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() >= 30;
      
      sectors.push(html`
        <path 
          d="${sectorPath}" 
          fill="${isActive ? '#10b981' : '#f8f9fa'}"
          stroke="${isCurrent ? '#ff6b6b' : '#e5e7eb'}"
          stroke-width="${isCurrent ? '3' : '1'}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${() => this.toggleTimeSlot(hour, 30)}">
        </path>
        <text 
          x="${textPos.x}" 
          y="${labelY}" 
          text-anchor="middle" 
          font-size="9" 
          font-weight="bold"
          transform="rotate(${rotationDeg} ${textPos.x} ${labelY})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${isActive ? '#ffffff' : '#6b7280'}">
          ${this.getTimeLabel(hour, 30)}
        </text>
      `);
    }
    
    return sectors;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config.entity) {
      return html`
        <ha-card>
          <div class="warning">
            ${this.localize('configure_entity')}
          </div>
        </ha-card>
      `;
    }

    const entity = this.getEntityState();
    if (!entity) {
      return html`
        <ha-card>
          <div class="warning">
            ${this.localize('entity_not_found')} (${this.config.entity})
          </div>
        </ha-card>
      `;
    }

    const homeStatus = this.getHomeStatus();
    const entityName = this.getEntityName();
    const timeSlots = this.getTimeSlots();

    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;
    const middleRadius = (innerRadius + outerRadius) / 2; // 115

    return html`
      <ha-card>
        ${this.config.show_title !== false ? html`
          <div class="header">
            <div class="title">${entityName}</div>
            ${this.shouldShowEnableSwitch() ? this.renderEnableSwitch() : ''}
            <div
              class="system-status clickable ${homeStatus ? 'active' : 'inactive'}"
              title="${this.localize('activation_conditions')}"
              @click=${this.openConditionsDialog}
            >
              ${homeStatus ? this.localize('active') : this.localize('inactive')}
            </div>
          </div>
        ` : this.shouldShowEnableSwitch() ? html`
          <div class="header">
            ${this.renderEnableSwitch()}
            <div
              class="system-status clickable ${homeStatus ? 'active' : 'inactive'}"
              title="${this.localize('activation_conditions')}"
              @click=${this.openConditionsDialog}
            >
              ${homeStatus ? this.localize('active') : this.localize('inactive')}
            </div>
          </div>
        ` : html`
          <div class="header">
            <div
              class="system-status clickable ${homeStatus ? 'active' : 'inactive'}"
              title="${this.localize('activation_conditions')}"
              @click=${this.openConditionsDialog}
            >
              ${homeStatus ? this.localize('active') : this.localize('inactive')}
            </div>
          </div>
        `}
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Circles -->
            <circle 
              cx="${centerX}" 
              cy="${centerY}" 
              r="${outerRadius}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            <circle 
              cx="${centerX}" 
              cy="${centerY}" 
              r="${middleRadius}" 
              fill="none" 
              stroke="#d1d5db" 
              stroke-width="1.5">
            </circle>
            <circle 
              cx="${centerX}" 
              cy="${centerY}" 
              r="${innerRadius}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            
            <!-- Dividing lines -->
            ${Array.from({ length: 24 }, (_, i) => {
              const angle = (i * 360 / 24 - 90) * (Math.PI / 180);
              const xInner = centerX + innerRadius * Math.cos(angle);
              const yInner = centerY + innerRadius * Math.sin(angle);
              const xOuter = centerX + outerRadius * Math.cos(angle);
              const yOuter = centerY + outerRadius * Math.sin(angle);
              return svg`
                <line 
                  x1="${xInner}" 
                  y1="${yInner}" 
                  x2="${xOuter}" 
                  y2="${yOuter}" 
                  stroke="#e5e7eb" 
                  stroke-width="1">
                </line>
              `;
            })}
            
            <!-- Center indicator for controlled entities -->
            ${(() => {
              const status = this.getControlledEntitiesStatus();
              const homeStatus = this.getHomeStatus();
              
              // Determine indicator color and status
              let indicatorColor = '#9ca3af'; // Gray - default
              let statusText = '—';
              
              if (!homeStatus) {
                // Inactive - gray
                indicatorColor = '#9ca3af';
                statusText = '—';
              } else if (status.total === 0) {
                // No entities configured - gray
                indicatorColor = '#d1d5db';
                statusText = '—';
              } else if (status.active === 0) {
                // All off - red
                indicatorColor = '#ef4444';
                statusText = this.localize('off');
              } else if (status.active === status.total) {
                // All on - green
                indicatorColor = '#10b981';
                statusText = this.localize('on');
              } else {
                // Partial - orange/yellow
                indicatorColor = '#f59e0b';
                statusText = `${status.active}/${status.total}`;
              }
              
              return svg`
                <!-- Full inner circle indicator -->
                <circle 
                  cx="${centerX}" 
                  cy="${centerY}" 
                  r="${innerRadius}" 
                  fill="${indicatorColor}"
                  style="cursor: pointer;"
                  @click="${(e: Event) => this.handleCenterClick(e)}">
                </circle>
                
                <!-- Status text -->
                <text 
                  x="${centerX}" 
                  y="${centerY + 5}" 
                  text-anchor="middle" 
                  font-size="14" 
                  font-weight="bold"
                  fill="#ffffff"
                  style="pointer-events: none; user-select: none;">
                  ${statusText}
                </text>
                
                <!-- Entity count (small text below) -->
                ${status.total > 0 ? svg`
                  <text 
                    x="${centerX}" 
                    y="${centerY + 20}" 
                    text-anchor="middle" 
                    font-size="8" 
                    fill="#ffffff"
                    opacity="0.9"
                    style="pointer-events: none; user-select: none;">
                    ${status.total} ${status.total === 1 ? this.localize('entity') : this.localize('entities')}
                  </text>
                ` : ''}
              `;
            })()}
            
            ${this.getSlotResolution() === 15
              ? this.renderFifteenMinuteSectors(timeSlots, centerX, centerY, innerRadius, middleRadius, outerRadius)
              : this.renderThirtyMinuteSectors(timeSlots, centerX, centerY, innerRadius, middleRadius, outerRadius)}

            <!-- Current time highlight (drawn last so all sides stay uniform) -->
            ${this.renderCurrentTimeHighlight(centerX, centerY, innerRadius, middleRadius, outerRadius)}
          </svg>
        </div>
        ${this.renderClimateControls()}
        ${this.renderFanControls()}
        ${this.renderEntitiesDialog()}
        ${this.renderConditionsDialog()}
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }
      
      ha-card {
        padding: 0;
        overflow: hidden;
        height: 100%;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        container-type: inline-size;
      }
      
      .warning {
        padding: 16px;
        color: var(--error-color, #f44336);
        text-align: center;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        padding: 4px 8px 0 8px;
      }
      
      .title {
        font-size: 1rem;
        font-weight: bold;
        color: var(--primary-text-color, #212121);
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .system-status {
        font-size: 0.7rem;
        text-align: center;
        padding: 2px 8px;
        border-radius: 4px;
        flex-shrink: 0;
      }
      
      .system-status.active {
        color: var(--success-color, #10b981);
        background-color: var(--success-color-alpha, rgba(16, 185, 129, 0.1));
      }
      
      .system-status.inactive {
        color: var(--warning-color, #f59e0b);
        background-color: var(--warning-color-alpha, rgba(245, 158, 11, 0.1));
      }

      .system-status.clickable {
        cursor: pointer;
        user-select: none;
      }

      .system-status.clickable:hover {
        filter: brightness(0.95);
        outline: 1px solid currentColor;
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
        object-fit: contain;
        direction: ltr;
        unicode-bidi: isolate;
      }
      
      @container (max-width: 250px) {
        .header {
          padding: 1px 2px 0 2px;
          margin-bottom: 1px;
        }
        
        .title {
          font-size: 0.8rem;
        }
        
        .system-status {
          font-size: 0.6rem;
        }
      }
      
      @container (min-width: 400px) {
        .title {
          font-size: 1.1rem;
        }
        
        .system-status {
          font-size: 0.8rem;
        }
        
        .header {
          padding: 6px 10px 0 10px;
        }
      }
      
      @container (min-width: 600px) {
        .title {
          font-size: 1.3rem;
        }
        
        .system-status {
          font-size: 0.9rem;
        }
        
        .header {
          padding: 8px 12px 0 12px;
        }
      }
      
      /* Enable Switch Styles — inline in header between title and status */
      .enable-switch-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        flex-shrink: 0;
      }
      
      .enable-switch-text {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color, #6b7280);
        white-space: nowrap;
      }
      
      .enable-switch {
        position: relative;
        appearance: none;
        width: 36px;
        height: 20px;
        background-color: var(--disabled-color, #bbb);
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s;
        outline: none;
        flex-shrink: 0;
      }
      
      .enable-switch:checked {
        background-color: var(--primary-color, #03a9f4);
      }
      
      .enable-switch::before {
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: white;
        top: 3px;
        left: 3px;
        transition: transform 0.3s;
      }
      
      .enable-switch:checked::before {
        transform: translateX(16px);
      }
      
      .enable-switch:focus {
        box-shadow: 0 0 0 2px var(--primary-color-alpha, rgba(3, 169, 244, 0.2));
      }
      
      @container (max-width: 250px) {
        .enable-switch-text {
          display: none;
        }
      }

      .device-controls {
        padding: 8px 12px 12px 12px;
        border-top: 1px solid var(--divider-color, #e5e7eb);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .device-control-card {
        padding: 4px 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .device-control-name {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-text-color, #212121);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .control-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .control-row.single-row {
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .control-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color, #6b7280);
        flex-shrink: 0;
      }

      .temp-controls {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .temp-value {
        min-width: 42px;
        text-align: center;
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--primary-text-color, #212121);
      }

      .ctrl-btn,
      .mode-btn {
        border: 1px solid var(--divider-color, #d1d5db);
        background: var(--card-background-color, #ffffff);
        color: var(--primary-text-color, #212121);
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.15s, border-color 0.15s;
      }

      .ctrl-btn {
        width: 32px;
        height: 32px;
        font-size: 1.1rem;
        line-height: 1;
      }

      .mode-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-inline-start: auto;
      }

      .mode-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .mode-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .mode-btn.active {
        background: var(--primary-color, #03a9f4);
        border-color: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #ffffff);
      }

      .ctrl-btn:hover,
      .mode-btn:hover {
        border-color: var(--primary-color, #03a9f4);
      }

      /* Entities dialog */
      .dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        touch-action: manipulation;
      }

      .dialog-content {
        background: var(--card-background-color, white);
        border-radius: 12px;
        width: 320px;
        max-width: 90vw;
        max-height: 70vh;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        touch-action: manipulation;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color, #e5e7eb);
        background: var(--primary-background-color, #f5f5f5);
      }

      .dialog-title {
        font-size: 1rem;
        font-weight: bold;
        color: var(--primary-text-color, #212121);
      }

      .dialog-close {
        background: none;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: var(--secondary-text-color, #666);
        padding: 4px 8px;
        line-height: 1;
        border-radius: 4px;
      }

      .dialog-close:hover {
        background-color: var(--secondary-background-color, #e0e0e0);
      }

      .dialog-body {
        padding: 12px;
        max-height: 50vh;
        overflow-y: auto;
      }

      .entities-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .entity-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 6px;
        background: var(--secondary-background-color, #f5f5f5);
      }

      .entity-item:last-child {
        margin-bottom: 0;
      }

      .entity-item.on {
        background: rgba(16, 185, 129, 0.15);
      }

      .entity-item ha-icon {
        --mdc-icon-size: 22px;
        color: var(--secondary-text-color, #666);
      }

      .entity-item.on ha-icon {
        color: #10b981;
      }

      .entity-name {
        flex: 1;
        font-size: 0.9rem;
        color: var(--primary-text-color, #212121);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .entity-state {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 4px;
        text-transform: uppercase;
      }

      .entity-state.on {
        color: #10b981;
        background: rgba(16, 185, 129, 0.2);
      }

      .entity-state.off {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
      }

      .no-entities {
        text-align: center;
        color: var(--secondary-text-color, #666);
        padding: 16px;
        font-size: 0.9rem;
      }

      .conditions-dialog {
        max-width: 360px;
      }

      .dialog-section {
        margin-bottom: 4px;
      }

      .dialog-section-divider {
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--divider-color, #e5e7eb);
      }

      .conditions-hint {
        margin: 0 0 12px 0;
        font-size: 0.8rem;
        color: var(--secondary-text-color, #666);
        line-height: 1.35;
      }

      .conditions-section {
        margin-bottom: 14px;
      }

      .conditions-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 6px;
        color: var(--secondary-text-color, #666);
      }

      .logic-toggle {
        display: flex;
        gap: 6px;
      }

      .logic-btn {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 6px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        cursor: pointer;
        font-size: 0.8rem;
      }

      .logic-btn.active {
        background: var(--primary-color, #03a9f4);
        border-color: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }

      .condition-select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 6px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        font-size: 0.85rem;
      }

      .remove-btn {
        border: none;
        background: transparent;
        color: var(--secondary-text-color, #666);
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .remove-btn:hover {
        color: var(--error-color, #ef4444);
        background: rgba(239, 68, 68, 0.1);
      }

      .save-conditions-btn {
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-radius: 6px;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-weight: 600;
        cursor: pointer;
      }

      .save-conditions-btn:disabled {
        opacity: 0.6;
        cursor: default;
      }
      
    `;
  }
}

console.info(
  '%c  TIMER-24H-CARD  %c  Version 1.3.0-beta.9  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: '24 Hour Timer Card with automatic entity control',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-24h-timer-integration'
});

