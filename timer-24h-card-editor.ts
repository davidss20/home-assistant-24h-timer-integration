import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

interface Timer24HCardConfig {
  entity: string;
  show_title?: boolean;
  custom_title?: string;
  show_enable_switch?: boolean;
}

const CONDITION_DOMAINS = [
  'person',
  'device_tracker',
  'binary_sensor',
  'sensor',
  'input_boolean',
];

@customElement('timer-24h-card-editor')
export class Timer24HCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config: Timer24HCardConfig = { entity: '', show_title: true };
  @state() private draftSensors: string[] = [];
  @state() private draftLogic: 'OR' | 'AND' = 'OR';
  @state() private conditionsSaving = false;
  @state() private conditionsDirty = false;
  @state() private slotResolutionSaving = false;
  private lastSyncedEntity = '';

  public setConfig(config: Timer24HCardConfig): void {
    this.config = { ...config };
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.config?.entity || !this.hass?.states[this.config.entity]) {
      return;
    }
    // Sync draft from integration attributes when entity changes or first load
    if (
      this.config.entity !== this.lastSyncedEntity ||
      (!this.conditionsDirty && changedProps.has('hass'))
    ) {
      this.syncDraftFromEntity();
    }
  }

  private syncDraftFromEntity(): void {
    const entity = this.hass?.states[this.config.entity];
    if (!entity) return;
    const sensors = entity.attributes?.home_sensors;
    const logic = String(entity.attributes?.home_logic || 'OR').toUpperCase();
    this.draftSensors = Array.isArray(sensors) ? [...sensors] : [];
    this.draftLogic = logic === 'AND' ? 'AND' : 'OR';
    this.lastSyncedEntity = this.config.entity;
    this.conditionsDirty = false;
  }

  private getFriendlyName(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name || entityId;
  }

  private getAvailableConditionSensors(): string[] {
    if (!this.hass) return [];
    const selected = new Set(this.draftSensors);
    return Object.keys(this.hass.states)
      .filter(
        (id) =>
          CONDITION_DOMAINS.some((d) => id.startsWith(`${d}.`)) &&
          !selected.has(id)
      )
      .sort();
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html`<div class="loading">Loading...</div>`;
    }

    const timerEntities = Object.keys(this.hass.states)
      .filter((entityId) => {
        const entity = this.hass.states[entityId];
        return (
          entityId.startsWith('sensor.') &&
          entity?.attributes?.time_slots !== undefined
        );
      })
      .sort();

    const selectedEntity = this.config.entity
      ? this.hass.states[this.config.entity]
      : undefined;

    return html`
      <div class="card-config">
        <div class="config-header">
          <h2>Timer 24H Card Configuration</h2>
          <p>Select a timer entity created by the Timer 24H integration</p>
        </div>

        ${timerEntities.length === 0
          ? html`
              <div class="warning">
                <p>⚠️ No timer entities found!</p>
                <p>Please add a Timer 24H integration instance first:</p>
                <ol>
                  <li>Go to Settings → Devices & Services</li>
                  <li>Click "+ Add Integration"</li>
                  <li>Search for "Timer 24H"</li>
                  <li>Follow the setup wizard</li>
                </ol>
              </div>
            `
          : ''}

        <div class="config-row">
          <label for="entity">Timer Entity</label>
          <select
            id="entity"
            .value="${this.config.entity || ''}"
            @change="${this.handleEntityChange}"
          >
            <option value="">-- Select a timer entity --</option>
            ${timerEntities.map((entityId) => {
              const entity = this.hass.states[entityId];
              const name = entity.attributes.friendly_name || entityId;
              return html`
                <option
                  value="${entityId}"
                  ?selected="${this.config.entity === entityId}"
                >
                  ${name}
                </option>
              `;
            })}
          </select>
          <div class="help-text">The timer entity to display and control</div>
        </div>

        <div class="config-row">
          <label>
            <input
              type="checkbox"
              .checked="${this.config.show_title !== false}"
              @change="${this.handleShowTitleChange}"
            />
            Show entity name as title
          </label>
          <div class="help-text">Display the timer name at the top of the card</div>
        </div>

        ${this.config.show_title !== false
          ? html`
              <div class="config-row">
                <label for="custom_title">Custom Title (Optional)</label>
                <input
                  type="text"
                  id="custom_title"
                  .value="${this.config.custom_title || ''}"
                  @input="${this.handleCustomTitleChange}"
                  placeholder="Leave empty to use entity name"
                />
                <div class="help-text">
                  Override the entity name with a custom title
                </div>
              </div>
            `
          : ''}

        <div class="config-row">
          <label>
            <input
              type="checkbox"
              .checked="${this.config.show_enable_switch === true}"
              @change="${this.handleShowEnableSwitchChange}"
            />
            Show enable/disable switch
          </label>
          <div class="help-text">
            Display a toggle switch to enable or disable the timer
          </div>
        </div>

        ${selectedEntity
          ? html`
              <div class="config-row">
                <label>Slot interval</label>
                <div class="logic-toggle">
                  <button
                    type="button"
                    class="logic-btn ${this.getSlotResolution() === 15 ? 'active' : ''}"
                    ?disabled=${this.slotResolutionSaving}
                    @click=${() => this.setSlotResolution(15)}
                  >
                    15 minutes
                  </button>
                  <button
                    type="button"
                    class="logic-btn ${this.getSlotResolution() === 30 ? 'active' : ''}"
                    ?disabled=${this.slotResolutionSaving}
                    @click=${() => this.setSlotResolution(30)}
                  >
                    30 minutes
                  </button>
                </div>
                <div class="help-text">
                  Saved to the timer (not this card). 15 min: tap each quarter.
                  30 min: classic two-ring view.
                </div>
              </div>
            `
          : ''}

        ${selectedEntity
          ? html`
              <div class="conditions-panel">
                <h3>Activation Conditions</h3>
                <p class="help-text">
                  Saved to the integration options (not card YAML), so the timer
                  keeps working in the background.
                </p>

                <div class="config-row">
                  <label>Condition logic</label>
                  <div class="logic-toggle">
                    <button
                      type="button"
                      class="logic-btn ${this.draftLogic === 'OR' ? 'active' : ''}"
                      @click=${() => this.setLogic('OR')}
                    >
                      OR (any)
                    </button>
                    <button
                      type="button"
                      class="logic-btn ${this.draftLogic === 'AND' ? 'active' : ''}"
                      @click=${() => this.setLogic('AND')}
                    >
                      AND (all)
                    </button>
                  </div>
                </div>

                <div class="config-row">
                  <label>Condition sensors</label>
                  ${this.draftSensors.length === 0
                    ? html`<div class="empty-list">
                        No conditions — timer always allowed
                      </div>`
                    : html`
                        <ul class="sensor-list">
                          ${this.draftSensors.map(
                            (entityId) => html`
                              <li>
                                <span>${this.getFriendlyName(entityId)}</span>
                                <button
                                  type="button"
                                  class="remove-btn"
                                  @click=${() => this.removeSensor(entityId)}
                                >
                                  ×
                                </button>
                              </li>
                            `
                          )}
                        </ul>
                      `}
                  <select class="add-select" @change=${this.addSensor}>
                    <option value="">-- Add condition --</option>
                    ${this.getAvailableConditionSensors().map(
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
                  class="save-btn"
                  ?disabled=${this.conditionsSaving || !this.conditionsDirty}
                  @click=${() => this.saveConditions()}
                >
                  ${this.conditionsSaving ? 'Saving…' : 'Save conditions'}
                </button>
              </div>

              <div class="preview-info">
                <h3>Selected Timer Details</h3>
                <div class="detail-row">
                  <strong>Entity ID:</strong> ${this.config.entity}
                </div>
                <div class="detail-row">
                  <strong>Name:</strong>
                  ${selectedEntity.attributes?.friendly_name || 'Unknown'}
                </div>
                <div class="detail-row">
                  <strong>State:</strong> ${selectedEntity.state || 'Unknown'}
                </div>
                <div class="detail-row">
                  <strong>Home Status:</strong>
                  ${selectedEntity.attributes?.home_status ? 'Active' : 'Inactive'}
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private handleEntityChange(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    this.config = { ...this.config, entity: target.value };
    this.conditionsDirty = false;
    this.lastSyncedEntity = '';
    this.configChanged();
  }

  private handleShowTitleChange(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this.config = { ...this.config, show_title: target.checked };
    this.configChanged();
  }

  private handleCustomTitleChange(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this.config = { ...this.config, custom_title: target.value || undefined };
    this.configChanged();
  }

  private handleShowEnableSwitchChange(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this.config = { ...this.config, show_enable_switch: target.checked };
    this.configChanged();
  }

  private getSlotResolution(): 15 | 30 {
    if (!this.config?.entity || !this.hass) return 15;
    const value = Number(
      this.hass.states[this.config.entity]?.attributes?.slot_resolution
    );
    return value === 30 ? 30 : 15;
  }

  private async setSlotResolution(resolution: 15 | 30): Promise<void> {
    if (!this.hass || !this.config?.entity || this.slotResolutionSaving) return;
    if (this.getSlotResolution() === resolution) return;
    this.slotResolutionSaving = true;
    try {
      await this.hass.callService('timer_24h', 'set_slot_resolution', {
        entity_id: this.config.entity,
        slot_resolution: resolution,
      });
    } catch (error) {
      console.error('Failed to set slot interval:', error);
    } finally {
      this.slotResolutionSaving = false;
    }
  }

  private setLogic(logic: 'OR' | 'AND'): void {
    this.draftLogic = logic;
    this.conditionsDirty = true;
  }

  private addSensor(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    const entityId = target.value;
    if (!entityId) return;
    if (!this.draftSensors.includes(entityId)) {
      this.draftSensors = [...this.draftSensors, entityId];
      this.conditionsDirty = true;
    }
    target.value = '';
  }

  private removeSensor(entityId: string): void {
    this.draftSensors = this.draftSensors.filter((id) => id !== entityId);
    this.conditionsDirty = true;
  }

  private async saveConditions(): Promise<void> {
    if (!this.hass || !this.config?.entity || this.conditionsSaving) return;
    this.conditionsSaving = true;
    try {
      await this.hass.callService('timer_24h', 'set_activation_conditions', {
        entity_id: this.config.entity,
        home_sensors: this.draftSensors,
        home_logic: this.draftLogic,
      });
      this.conditionsDirty = false;
    } catch (error) {
      console.error('Failed to save activation conditions:', error);
    } finally {
      this.conditionsSaving = false;
    }
  }

  private configChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    });
    (this as any).dispatchEvent(event);
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        padding: 16px;
      }

      .config-header {
        margin-bottom: 24px;
      }

      .config-header h2 {
        margin: 0 0 8px 0;
        font-size: 1.5em;
        color: var(--primary-text-color);
      }

      .config-header p {
        margin: 0;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .config-row {
        margin-bottom: 20px;
      }

      .config-row label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .config-row input[type='checkbox'] {
        margin-right: 8px;
      }

      .config-row select,
      .config-row input[type='text'],
      .add-select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 14px;
        box-sizing: border-box;
      }

      .help-text {
        margin-top: 4px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      .warning {
        background-color: var(--warning-color-alpha, rgba(245, 158, 11, 0.1));
        border: 1px solid var(--warning-color, #f59e0b);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .warning p {
        margin: 8px 0;
        color: var(--primary-text-color);
      }

      .warning ol {
        margin: 8px 0;
        padding-left: 24px;
        color: var(--primary-text-color);
      }

      .conditions-panel {
        background-color: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 16px;
        margin-top: 8px;
        margin-bottom: 16px;
      }

      .conditions-panel h3 {
        margin: 0 0 8px 0;
        font-size: 1.1em;
        color: var(--primary-text-color);
      }

      .logic-toggle {
        display: flex;
        gap: 8px;
      }

      .logic-btn {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 0.9em;
      }

      .logic-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }

      .logic-btn:disabled {
        opacity: 0.6;
        cursor: default;
      }

      .sensor-list {
        list-style: none;
        margin: 0 0 10px 0;
        padding: 0;
      }

      .sensor-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        margin-bottom: 6px;
        border-radius: 6px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        font-size: 0.9em;
      }

      .empty-list {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 6px;
        background: var(--card-background-color);
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .remove-btn {
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 1.2rem;
        cursor: pointer;
        line-height: 1;
        padding: 2px 6px;
      }

      .remove-btn:hover {
        color: var(--error-color, #ef4444);
      }

      .save-btn {
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-radius: 6px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        font-weight: 600;
        cursor: pointer;
      }

      .save-btn:disabled {
        opacity: 0.5;
        cursor: default;
      }

      .preview-info {
        background-color: var(--primary-color-alpha, rgba(3, 169, 244, 0.1));
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 16px;
        margin-top: 8px;
      }

      .preview-info h3 {
        margin: 0 0 12px 0;
        font-size: 1.1em;
        color: var(--primary-text-color);
      }

      .detail-row {
        margin: 8px 0;
        color: var(--primary-text-color);
      }

      .detail-row strong {
        display: inline-block;
        min-width: 120px;
        color: var(--secondary-text-color);
      }

      .loading {
        padding: 20px;
        text-align: center;
        color: var(--secondary-text-color);
      }
    `;
  }
}
