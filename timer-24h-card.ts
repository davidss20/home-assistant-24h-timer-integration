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
    if (changedProps.has('config')) {
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
    }, 30000);
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
        slots.push({ hour, minute: 30, isActive: false });
      }
      return slots;
    }
    
    // Return server state directly - no optimistic updates
    return entity.attributes.time_slots;
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
      const entityState = this.hass.states[entityId];
      if (entityState && entityState.state === 'on') {
        activeCount++;
      }
    }
    
    return {
      total: controlledEntities.length,
      active: activeCount,
      entities: controlledEntities
    };
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
          y="${textPos.y + 3}" 
          text-anchor="middle" 
          font-size="10" 
          font-weight="bold"
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
          y="${textPos.y + 2}" 
          text-anchor="middle" 
          font-size="8" 
          font-weight="bold"
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
            <div class="system-status ${homeStatus ? 'active' : 'inactive'}">
              ${homeStatus ? 'Active' : 'Inactive'}
            </div>
          </div>
        ` : ''}
        
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
                statusText = 'OFF';
              } else if (status.active === status.total) {
                // All on - green
                indicatorColor = '#10b981';
                statusText = 'ON';
              } else {
                // Partial - orange/yellow
                indicatorColor = '#f59e0b';
                statusText = `${status.active}/${status.total}`;
              }
              
              return svg`
                <!-- Outer glow circle -->
                <circle 
                  cx="${centerX}" 
                  cy="${centerY}" 
                  r="35" 
                  fill="${indicatorColor}"
                  opacity="0.1">
                </circle>
                
                <!-- Main indicator circle -->
                <circle 
                  cx="${centerX}" 
                  cy="${centerY}" 
                  r="25" 
                  fill="${indicatorColor}"
                  stroke="#ffffff"
                  stroke-width="3"
                  style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                </circle>
                
                <!-- Status text -->
                <text 
                  x="${centerX}" 
                  y="${centerY + 5}" 
                  text-anchor="middle" 
                  font-size="12" 
                  font-weight="bold"
                  fill="#ffffff"
                  style="pointer-events: none; user-select: none;">
                  ${statusText}
                </text>
                
                <!-- Entity count (small text below) -->
                ${status.total > 0 ? svg`
                  <text 
                    x="${centerX}" 
                    y="${centerY + 18}" 
                    text-anchor="middle" 
                    font-size="7" 
                    fill="#ffffff"
                    opacity="0.8"
                    style="pointer-events: none; user-select: none;">
                    ${status.total} ${status.total === 1 ? 'entity' : 'entities'}
                  </text>
                ` : ''}
              `;
            })()}
            
            <!-- Outer sectors (full hours) -->
            ${Array.from({ length: 24 }, (_, index) => {
              const hour = index;  // Explicitly capture the index value
              const slot = timeSlots.find(s => s.hour === hour && s.minute === 0);
              const isActive = slot?.isActive || false;
              const isCurrent = this.currentTime.getHours() === hour && 
                               this.currentTime.getMinutes() < 30;
              const sectorPath = this.createSectorPath(hour, 24, middleRadius, outerRadius, centerX, centerY);
              const textPos = this.getTextPosition(hour, 24, (middleRadius + outerRadius) / 2, centerX, centerY);
              
              // Create a bound handler with explicit parameters
              const clickHandler = (e: Event) => {
                console.log(`🎯 Outer sector clicked: index=${index}, hour=${hour}`);
                this.handleSlotClick(e, hour, 0);
              };
              
              return svg`
                <path 
                  d="${sectorPath}" 
                  fill="${isActive ? '#10b981' : '#ffffff'}"
                  stroke="${isCurrent ? '#ff6b6b' : '#e5e7eb'}"
                  stroke-width="${isCurrent ? '3' : '1'}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${clickHandler}">
                </path>
                <text 
                  x="${textPos.x}" 
                  y="${textPos.y + 3}" 
                  text-anchor="middle" 
                  font-size="10" 
                  font-weight="bold"
                  style="pointer-events: none; user-select: none;"
                  fill="${isActive ? '#ffffff' : '#374151'}">
                  ${this.getTimeLabel(hour, 0)}
                </text>
              `;
            })}
            
            <!-- Inner sectors (half hours) -->
            ${Array.from({ length: 24 }, (_, index) => {
              const hour = index;  // Explicitly capture the index value
              const slot = timeSlots.find(s => s.hour === hour && s.minute === 30);
              const isActive = slot?.isActive || false;
              const isCurrent = this.currentTime.getHours() === hour && 
                               this.currentTime.getMinutes() >= 30;
              const sectorPath = this.createSectorPath(hour, 24, innerRadius, middleRadius, centerX, centerY);
              const textPos = this.getTextPosition(hour, 24, (innerRadius + middleRadius) / 2, centerX, centerY);
              
              // Create a bound handler with explicit parameters
              const clickHandler = (e: Event) => {
                console.log(`🎯 Inner sector clicked: index=${index}, hour=${hour}`);
                this.handleSlotClick(e, hour, 30);
              };
              
              return svg`
                <path 
                  d="${sectorPath}" 
                  fill="${isActive ? '#10b981' : '#f8f9fa'}"
                  stroke="${isCurrent ? '#ff6b6b' : '#e5e7eb'}"
                  stroke-width="${isCurrent ? '3' : '1'}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${clickHandler}">
                </path>
                <text 
                  x="${textPos.x}" 
                  y="${textPos.y + 2}" 
                  text-anchor="middle" 
                  font-size="8" 
                  font-weight="bold"
                  style="pointer-events: none; user-select: none;"
                  fill="${isActive ? '#ffffff' : '#6b7280'}">
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
        color: var(--error-color, #f44336);
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
        color: var(--primary-text-color, #212121);
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

console.info(
  '%c  TIMER-24H-CARD  %c  Version 5.5.0 - CENTER INDICATOR  ',
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

