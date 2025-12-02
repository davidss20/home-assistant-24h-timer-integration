import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

interface Timer24HCardConfig {
  entity: string;
  show_title?: boolean;
}

@customElement('timer-24h-card-editor')
export class Timer24HCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: Timer24HCardConfig;

  public setConfig(config: Timer24HCardConfig): void {
    this.config = { ...config };
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html`<div class="loading">Loading...</div>`;
    }

    // Get all timer entities from the integration
    const timerEntities = Object.keys(this.hass.states)
      .filter(entityId => {
        const entity = this.hass.states[entityId];
        return entityId.startsWith('sensor.') && 
               entity?.attributes?.time_slots !== undefined;
      })
      .sort();

    return html`
      <div class="card-config">
        <div class="config-header">
          <h2>Timer 24H Card Configuration</h2>
          <p>Select a timer entity created by the Timer 24H integration</p>
        </div>

        ${timerEntities.length === 0 ? html`
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
        ` : ''}

        <div class="config-row">
          <label for="entity">Timer Entity</label>
          <select
            id="entity"
            .value="${this.config.entity || ''}"
            @change="${this.handleEntityChange}"
          >
            <option value="">-- Select a timer entity --</option>
            ${timerEntities.map(entityId => {
              const entity = this.hass.states[entityId];
              const name = entity.attributes.friendly_name || entityId;
              return html`
                <option value="${entityId}" ?selected="${this.config.entity === entityId}">
                  ${name}
                </option>
              `;
            })}
          </select>
          <div class="help-text">
            The timer entity to display and control
          </div>
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
          <div class="help-text">
            Display the timer name at the top of the card
          </div>
        </div>

        ${this.config.entity && this.hass.states[this.config.entity] ? html`
          <div class="preview-info">
            <h3>Selected Timer Details</h3>
            <div class="detail-row">
              <strong>Entity ID:</strong> ${this.config.entity}
            </div>
            <div class="detail-row">
              <strong>Name:</strong> ${this.hass.states[this.config.entity]?.attributes?.friendly_name || 'Unknown'}
            </div>
            <div class="detail-row">
              <strong>State:</strong> ${this.hass.states[this.config.entity]?.state || 'Unknown'}
            </div>
            <div class="detail-row">
              <strong>Home Status:</strong> ${this.hass.states[this.config.entity]?.attributes?.home_status ? 'At Home' : 'Away'}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private handleEntityChange(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    this.config = { ...this.config, entity: target.value };
    this.configChanged();
  }

  private handleShowTitleChange(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this.config = { ...this.config, show_title: target.checked };
    this.configChanged();
  }

  private configChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    });
    // Dispatch event using the built-in method from HTMLElement
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

      .config-row input[type="checkbox"] {
        margin-right: 8px;
      }

      .config-row select,
      .config-row input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 14px;
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

      .preview-info {
        background-color: var(--primary-color-alpha, rgba(3, 169, 244, 0.1));
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 16px;
        margin-top: 20px;
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
