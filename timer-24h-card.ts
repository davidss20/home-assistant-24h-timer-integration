import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

// Types
interface Timer24HCardConfig extends LovelaceCardConfig {
  entity: string;  // The timer entity created by the integration
  show_title?: boolean;
}

interface TimeSlot {
  hour: number;
  minute: number;
  isActive: boolean;
}

@customElement('timer-24h-card')
export class Timer24HCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: Timer24HCardConfig;
  @state() private currentTime: Date = new Date();
  
  private updateInterval?: number;

  // Grid support
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
    }, 30000); // Update every 30 seconds for UI
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
      // Return empty slots if no data
      const slots: TimeSlot[] = [];
      for (let hour = 0; hour < 24; hour++) {
        slots.push({ hour, minute: 0, isActive: false });
        slots.push({ hour, minute: 30, isActive: false });
      }
      return slots;
    }
    return entity.attributes.time_slots;
  }

  private getHomeStatus(): boolean {
    const entity = this.getEntityState();
    if (!entity) return true;
    return entity.attributes.home_status !== false;
  }

  private getEntityName(): string {
    const entity = this.getEntityState();
    if (!entity) return 'Timer 24H';
    return entity.attributes.friendly_name || 'Timer 24H';
  }

  private async toggleTimeSlot(hour: number, minute: number): Promise<void> {
    if (!this.hass || !this.config.entity) return;

    try {
      await this.hass.callService('timer_24h', 'toggle_slot', {
        entity_id: this.config.entity,
        hour: hour,
        minute: minute,
      });
    } catch (error) {
      console.error('Failed to toggle time slot:', error);
    }
  }

  private createSectorPath(hour: number, totalSectors: number, innerRadius: number, outerRadius: number, centerX: number, centerY: number): string {
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

  private getTextPosition(hour: number, totalSectors: number, radius: number, centerX: number, centerY: number): { x: number; y: number } {
    const angle = ((hour + 0.5) * 360 / totalSectors - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }

  private getTimeLabel(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config.entity) {
      return html`
        <ha-card>
          <div class="warning">
            Please configure the timer entity in card settings
          </div>
        </ha-card>
      `;
    }

    const entity = this.getEntityState();
    if (!entity) {
      return html`
        <ha-card>
          <div class="warning">
            Entity "${this.config.entity}" not found. Please check your configuration.
          </div>
        </ha-card>
      `;
    }

    const timeSlots = this.getTimeSlots();
    const homeStatus = this.getHomeStatus();
    const entityName = this.getEntityName();
    const state = entity.state;

    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;

    return html`
      <ha-card>
        ${this.config.show_title !== false ? html`
          <div class="header">
            <div class="title">${entityName}</div>
            <div class="system-status ${homeStatus ? 'active' : 'inactive'}">
              ${homeStatus ? 'מופעל' : 'מושבת'}
            </div>
          </div>
        ` : ''}
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Border circles -->
            <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" 
                    fill="none" stroke="var(--divider-color)" stroke-width="2"/>
            <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" 
                    fill="none" stroke="var(--divider-color)" stroke-width="2"/>
            
            <!-- Dividing lines -->
            ${Array.from({ length: 24 }, (_, i) => {
              const angle = (i * 360 / 24 - 90) * (Math.PI / 180);
              const xInner = centerX + innerRadius * Math.cos(angle);
              const yInner = centerY + innerRadius * Math.sin(angle);
              const xOuter = centerX + outerRadius * Math.cos(angle);
              const yOuter = centerY + outerRadius * Math.sin(angle);
              return html`<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" 
                               stroke="var(--divider-color)" stroke-width="1"/>`;
            })}
            
            <!-- Outer sectors (full hours) -->
            ${Array.from({ length: 24 }, (_, hour) => {
              const sectorPath = this.createSectorPath(hour, 24, innerRadius, outerRadius, centerX, centerY);
              const textPos = this.getTextPosition(hour, 24, (innerRadius + outerRadius) / 2, centerX, centerY);
              const slot = timeSlots.find(s => s.hour === hour && s.minute === 0);
              const isActive = slot?.isActive || false;
              const isCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() < 30;
              
              return html`
                <path d="${sectorPath}" 
                      fill="${isActive ? 'var(--primary-color)' : 'var(--card-background-color)'}"
                      stroke="${isCurrent ? 'var(--accent-color)' : 'var(--divider-color)'}"
                      stroke-width="${isCurrent ? '3' : '1'}"
                      style="cursor: pointer; transition: opacity 0.2s;"
                      @click="${() => this.toggleTimeSlot(hour, 0)}"/>
                <text x="${textPos.x}" y="${textPos.y + 3}" 
                      text-anchor="middle" font-size="10" font-weight="bold"
                      style="pointer-events: none; user-select: none; font-weight: bold;"
                      fill="${isActive ? 'var(--text-primary-color)' : 'var(--primary-text-color)'}">
                  ${this.getTimeLabel(hour, 0)}
                </text>
              `;
            })}
            
            <!-- Inner sectors (half hours) -->
            ${Array.from({ length: 24 }, (_, hour) => {
              const sectorPath = this.createSectorPath(hour, 24, 50, innerRadius, centerX, centerY);
              const textPos = this.getTextPosition(hour, 24, (50 + innerRadius) / 2, centerX, centerY);
              const slot = timeSlots.find(s => s.hour === hour && s.minute === 30);
              const isActive = slot?.isActive || false;
              const isCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() >= 30;
              
              return html`
                <path d="${sectorPath}" 
                      fill="${isActive ? 'var(--primary-color)' : 'var(--card-background-color)'}"
                      stroke="${isCurrent ? 'var(--accent-color)' : 'var(--divider-color)'}"
                      stroke-width="${isCurrent ? '3' : '1'}"
                      style="cursor: pointer; transition: opacity 0.2s;"
                      @click="${() => this.toggleTimeSlot(hour, 30)}"/>
                <text x="${textPos.x}" y="${textPos.y + 2}" 
                      text-anchor="middle" font-size="8" font-weight="bold"
                      style="pointer-events: none; user-select: none; font-weight: bold;"
                      fill="${isActive ? 'var(--text-primary-color)' : 'var(--primary-text-color)'}">
                  ${this.getTimeLabel(hour, 30)}
                </text>
              `;
            })}
          </svg>
        </div>
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
        color: var(--error-color);
        text-align: center;
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
        color: var(--primary-text-color);
      }
      
      .system-status {
        font-size: 0.7rem;
        text-align: center;
        padding: 2px 8px;
        border-radius: 4px;
      }
      
      .system-status.active {
        color: var(--success-color, #10b981);
        background-color: var(--success-color-alpha, rgba(16, 185, 129, 0.1));
      }
      
      .system-status.inactive {
        color: var(--warning-color, #f59e0b);
        background-color: var(--warning-color-alpha, rgba(245, 158, 11, 0.1));
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
      }
      
      /* Responsive adjustments */
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
    `;
  }
}

// Card info for Home Assistant
console.info(
  '%c  TIMER-24H-CARD  %c  Version 2.1.0  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// Register card for HACS and Home Assistant UI
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: '24 Hour Timer Card with automatic entity control',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-24h-timer-integration'
});
