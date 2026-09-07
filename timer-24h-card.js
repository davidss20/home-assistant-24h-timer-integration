function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:g}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",v=u.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const o=this.constructor,s=this[t];if(i??=o.getPropertyOptions(t),!((i.hasChanged??$)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[b("elementProperties")]=new Map,_[b("finalized")]=new Map,v?.({ReactiveElement:_}),(u.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,T=`<${E}>`,D=document,z=()=>D.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,O="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,L=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=F(1),B=F(2),q=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),V=new WeakMap,K=D.createTreeWalker(D,129);function Q(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=N:void 0!==l[1]?r=H:void 0!==l[2]?(I.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=s??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?j:U):r===j||r===U?r=L:r===N||r===H?r=R:(r=L,s=void 0);const h=r===L&&t[e+1].startsWith("/>")?" ":"";n+=r===R?i+T:c>=0?(o.push(a),i.slice(0,c)+k+i.slice(c)+A+h):i+A+(-2===c?e:h)}return[Q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class G{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=G.createElement(l,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(k)){const e=c[n++],i=o.getAttribute(t).split(A),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?st:et}),o.removeAttribute(t)}else t.startsWith(A)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(I.test(o.tagName)){const t=o.textContent.split(A),e=t.length-1;if(e>0){o.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],z()),K.nextNode(),a.push({type:2,index:++s});o.append(t[e],z())}}}else if(8===o.nodeType)if(o.data===E)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(A,t+1));)a.push({type:7,index:s}),t+=A.length-1}s++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,o){if(e===q)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=P(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=X(t,s._$AS(t,e.values),s,o)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??D).importNode(e,!0);K.currentNode=o;let s=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new nt(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=K.nextNode(),n++)}return K.currentNode=D,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),P(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Y(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new tt(this.O(z()),this.O(z()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=X(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=X(this,o[i+r],e,r),a===q&&(a=this._$AH[r]),n||=!P(a)||a!==this._$AH[r],a===J?t=J:t!==J&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class ot extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class st extends et{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??J)===q)return;const i=this._$AH,o=t===J&&i!==J||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==J&&(i===J||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(G,tt),(w.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class lt extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new tt(e.insertBefore(z(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.1");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},pt=(t=ht,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t)}}throw Error("Unsupported decorator location: "+o)};function gt(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return gt({...t,state:!0,attribute:!1})}let ft=class extends lt{static getLayoutOptions(){return{grid_rows:2,grid_columns:6,grid_min_rows:2,grid_min_columns:3}}getCardSize(){return 3}static async getConfigElement(){return await Promise.resolve().then(function(){return bt}),document.createElement("timer-24h-card-editor")}static getStubConfig(t){return{entity:(t?Object.keys(t.states).find(e=>{const i=t.states[e];return e.startsWith("sensor.")&&void 0!==i?.attributes?.time_slots}):void 0)||"",show_title:!0}}constructor(){super(),this.currentTime=new Date,this.showEntitiesDialog=!1,this.showConditionsDialog=!1,this.draftConditionSensors=[],this.draftConditionLogic="OR",this.conditionsSaving=!1,this.selectedHour=null}setConfig(t){if(!t)throw new Error("Invalid configuration: config is required");this.config={show_title:!0,...t,entity:t.entity||""}}shouldUpdate(t){if(t.has("config")||t.has("showEntitiesDialog")||t.has("showConditionsDialog")||t.has("draftConditionSensors")||t.has("draftConditionLogic")||t.has("conditionsSaving")||t.has("selectedHour"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e||!this.config?.entity)return!0;const i=e.states[this.config.entity],o=this.hass.states[this.config.entity];if(i!==o)return!0;if(JSON.stringify(i?.attributes.time_slots||[])!==JSON.stringify(o?.attributes.time_slots||[]))return console.log("🔄 Time slots changed, updating card"),!0;if(i?.attributes.slot_resolution!==o?.attributes.slot_resolution)return!0;const s=o?.attributes.controlled_entities||[];for(const t of s){const i=e.states[t],o=this.hass.states[t];if(i?.state!==o?.state||i?.attributes?.temperature!==o?.attributes?.temperature||i?.attributes?.percentage!==o?.attributes?.percentage)return console.log("🔄 Controlled entity state changed:",t),!0}if(JSON.stringify(i?.attributes.entity_settings||{})!==JSON.stringify(o?.attributes.entity_settings||{}))return!0;if(JSON.stringify({sensors:i?.attributes.home_sensors||[],logic:i?.attributes.home_logic||"OR"})!==JSON.stringify({sensors:o?.attributes.home_sensors||[],logic:o?.attributes.home_logic||"OR"}))return!0}return t.has("currentTime")}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.updateCurrentTime()}connectedCallback(){super.connectedCallback(),this.startTimer()}disconnectedCallback(){super.disconnectedCallback(),this.updateInterval&&clearInterval(this.updateInterval)}startTimer(){this.updateInterval&&clearInterval(this.updateInterval),this.updateInterval=window.setInterval(()=>{this.updateCurrentTime()},15e3)}updateCurrentTime(){this.currentTime=new Date,this.requestUpdate()}getEntityState(){return this.hass&&this.config.entity?this.hass.states[this.config.entity]:null}isDemoPreview(){return!this.config?.entity||!this.getEntityState()}getDemoTimeSlots(){const t=[];for(let e=0;e<24;e++)for(const i of[0,15,30,45]){const o=4*e+i/15,s=o>=24&&o<34,n=o>=68&&o<88;t.push({hour:e,minute:i,isActive:s||n})}return t}getTimeSlots(){const t=this.getEntityState();return t&&t.attributes.time_slots?t.attributes.time_slots:this.getDemoTimeSlots()}getSlotResolution(){return 30===Number(this.getEntityState()?.attributes?.slot_resolution)?30:15}currentQuarterMinute(){return 15*Math.floor(this.currentTime.getMinutes()/15)}getHomeStatus(){const t=this.getEntityState();return!t||!1!==t.attributes.home_status}getEntityName(){if(this.config.custom_title)return this.config.custom_title;const t=this.getEntityState();return t&&t.attributes.friendly_name||"Timer 24H"}isEntityOn(t){const e=this.hass?.states[t];if(!e)return!1;const i=(e.state||"").toLowerCase();return"unavailable"!==i&&"unknown"!==i&&(t.startsWith("climate.")?"off"!==i:"on"===i)}getControlledEntitiesStatus(){const t=this.getEntityState();if(!t)return{total:0,active:0,entities:[]};const e=t.attributes.controlled_entities||[];let i=0;for(const t of e)this.isEntityOn(t)&&i++;return{total:e.length,active:i,entities:e}}getEntitySettingsMap(){const t=this.getEntityState();return t?.attributes?.entity_settings||{}}getClimateEntities(){return this.getControlledEntitiesStatus().entities.filter(t=>t.startsWith("climate."))}getFanEntities(){return this.getControlledEntitiesStatus().entities.filter(t=>t.startsWith("fan."))}getFriendlyName(t){return this.hass?.states[t]?.attributes?.friendly_name||t}localize(t){const e=this.hass?.language||this.hass?.locale?.language||"en",i={en:{active:"Active",inactive:"Inactive",on:"ON",off:"OFF",entity:"entity",entities:"entities",configure_entity:"Please configure the timer entity in card settings",entity_not_found:"Entity not found. Please check your configuration.",enable_timer:"Enable Timer",climate_controls:"Climate",fan_controls:"Fan",temperature:"Temp",mode:"Mode",speed:"Speed",cool:"Cool",heat:"Heat",heat_cool:"Auto",auto:"Auto",dry:"Dry",fan_only:"Fan",entities_list:"Controlled Entities",close:"Close",no_entities:"No entities configured",activation_conditions:"Activation Conditions",condition_logic:"Condition logic",logic_or:"OR (any)",logic_and:"AND (all)",add_condition:"Add condition",no_conditions:"No conditions — timer always allowed",conditions_hint:"Saved to the integration (works in background). Empty = always active.",save:"Save",remove:"Remove",condition_met:"Met",condition_not_met:"Not met",edit_conditions:"Edit"},he:{active:"פעיל",inactive:"לא פעיל",on:"דלוק",off:"כבוי",entity:"ישות",entities:"ישויות",configure_entity:"אנא הגדר את ישות הטיימר בהגדרות הכרטיס",entity_not_found:"הישות לא נמצאה. אנא בדוק את ההגדרות.",enable_timer:"הפעל טיימר",climate_controls:"מזגן",fan_controls:"מאוורר",temperature:"מעלות",mode:"מצב",speed:"מהירות",cool:"קור",heat:"חום",heat_cool:"אוטו",auto:"אוטו",dry:"ייבוש",fan_only:"מאוורר",entities_list:"ישויות מבוקרות",close:"סגור",no_entities:"לא הוגדרו ישויות",activation_conditions:"תנאי הפעלה",condition_logic:"לוגיקת תנאים",logic_or:"OR (אחד מספיק)",logic_and:"AND (הכל חייב)",add_condition:"הוסף תנאי",no_conditions:"אין תנאים — הטיימר תמיד מורשה",conditions_hint:"נשמר באינטגרציה (עובד ברקע). ריק = תמיד פעיל.",save:"שמור",remove:"הסר",condition_met:"מתקיים",condition_not_met:"לא מתקיים",edit_conditions:"ערוך"}};return i[e]?.[t]||i.en[t]||t}localizeHvacMode(t){return["cool","heat","heat_cool","auto","dry","fan_only","off"].includes(t)?this.localize(t):t}getHvacModeIcon(t){return{cool:"mdi:snowflake",heat:"mdi:fire",heat_cool:"mdi:sun-snowflake-variant",auto:"mdi:thermostat-auto",dry:"mdi:water-percent",fan_only:"mdi:fan",off:"mdi:power"}[t]||"mdi:thermostat"}handleSlotClick(t,e,i){t.stopPropagation(),t.preventDefault();const o=`${e}:${String(i).padStart(2,"0")}`;console.log(`👆 Click detected on ${o}`),this.clickTimeout?console.log(`⏸️ Debounced - ignoring click on ${o}`):(this.clickTimeout=window.setTimeout(()=>{this.clickTimeout=void 0},300),console.log(`✅ Processing click on ${o}`),this.toggleTimeSlot(e,i))}handleFifteenClick(t,e,i){t.stopPropagation(),t.preventDefault(),this.clickTimeout||(this.clickTimeout=window.setTimeout(()=>{this.clickTimeout=void 0},300),this.selectedHour===e?this.toggleTimeSlot(e,i):this.selectedHour=e)}async toggleTimeSlot(t,e){if(!this.hass||!this.config.entity)return;const i=`${t}:${String(e).padStart(2,"0")}`;try{console.log(`🎯 Toggle slot: ${i}`),await this.hass.callService("timer_24h","toggle_slot",{entity_id:this.config.entity,hour:t,minute:e}),console.log(`✅ Service call completed for ${i}`)}catch(t){console.error(`❌ Failed to toggle time slot ${i}:`,t)}}getEnabled(){const t=this.getEntityState();return!1!==t?.attributes.enabled}shouldShowEnableSwitch(){return!0===this.config.show_enable_switch}async handleEnableToggle(t){t.stopPropagation();const e=t.target.checked;if(this.hass&&this.config.entity)try{console.log(`🔄 Setting enabled to: ${e}`),await this.hass.callService("timer_24h","set_enabled",{entity_id:this.config.entity,enabled:e}),console.log(`✅ Enabled state updated to: ${e}`)}catch(t){console.error("❌ Failed to set enabled state:",t)}}async updateEntitySettings(t,e){if(this.hass&&this.config.entity)try{await this.hass.callService("timer_24h","set_entity_settings",{entity_id:this.config.entity,target_entity_id:t,...e})}catch(t){console.error("❌ Failed to update entity settings:",t)}}getClimateTemp(t){const e=this.getEntitySettingsMap()[t]?.temperature;if("number"==typeof e)return e;const i=this.hass.states[t],o=i?.attributes?.temperature;return"number"==typeof o?o:24}getClimateMode(t){const e=this.getEntitySettingsMap()[t]?.hvac_mode;if(e)return e;const i=this.hass.states[t];if(i&&"off"!==i.state)return i.state;const o=(i?.attributes?.hvac_modes||[]).find(t=>"off"!==t)||"cool";return o}getFanPercentage(t){const e=this.getEntitySettingsMap()[t]?.percentage;if("number"==typeof e)return e;const i=this.hass.states[t],o=i?.attributes?.percentage;return"number"==typeof o?o:50}getClimateModes(t){const e=this.hass.states[t];return(e?.attributes?.hvac_modes||["cool","heat","heat_cool","dry","fan_only"]).filter(t=>"off"!==t)}async adjustClimateTemp(t,e){const i=this.hass.states[t],o=Number(i?.attributes?.min_temp??16),s=Number(i?.attributes?.max_temp??30),n=Math.min(s,Math.max(o,this.getClimateTemp(t)+e));await this.updateEntitySettings(t,{temperature:n,hvac_mode:this.getClimateMode(t)})}async setClimateMode(t,e){await this.updateEntitySettings(t,{hvac_mode:e,temperature:this.getClimateTemp(t)})}async adjustFanPercentage(t,e){const i=this.hass.states[t],o=Number(i?.attributes?.percentage_step??10),s=Math.min(100,Math.max(0,this.getFanPercentage(t)+e*o));await this.updateEntitySettings(t,{percentage:s})}handleCenterClick(t){t?.stopPropagation(),t?.preventDefault(),this.draftConditionSensors=this.getConditionSensors(),this.draftConditionLogic=this.getConditionLogic(),this.showEntitiesDialog=!0}closeEntitiesDialog(t){t?.stopPropagation(),t?.preventDefault(),this.showEntitiesDialog=!1}isConditionMet(t){const e=this.hass?.states[t]?.state;return!!e&&["on","home","true","1","yes"].includes(e.toLowerCase())}getConditionSensors(){const t=this.hass?.states[this.config.entity],e=t?.attributes?.home_sensors;return Array.isArray(e)?[...e]:[]}getConditionLogic(){const t=this.hass?.states[this.config.entity];return"AND"===String(t?.attributes?.home_logic||"OR").toUpperCase()?"AND":"OR"}getAvailableConditionSensors(){if(!this.hass)return[];const t=["person","device_tracker","binary_sensor","sensor","input_boolean"];return Object.keys(this.hass.states).filter(e=>t.some(t=>e.startsWith(`${t}.`))).sort()}openConditionsDialog(t){t?.stopPropagation(),t?.preventDefault(),this.draftConditionSensors=this.getConditionSensors(),this.draftConditionLogic=this.getConditionLogic(),this.showConditionsDialog=!0}closeConditionsDialog(t){t?.stopPropagation(),t?.preventDefault(),this.showConditionsDialog=!1}addConditionSensor(t){const e=t.target,i=e.value;i&&(this.draftConditionSensors.includes(i)||(this.draftConditionSensors=[...this.draftConditionSensors,i]),e.value="")}removeConditionSensor(t){this.draftConditionSensors=this.draftConditionSensors.filter(e=>e!==t)}setDraftConditionLogic(t){this.draftConditionLogic=t}async saveActivationConditions(){if(this.hass&&this.config?.entity&&!this.conditionsSaving){this.conditionsSaving=!0;try{await this.hass.callService("timer_24h","set_activation_conditions",{entity_id:this.config.entity,home_sensors:this.draftConditionSensors,home_logic:this.draftConditionLogic}),this.showConditionsDialog=!1}catch(t){console.error("❌ Failed to update activation conditions:",t)}finally{this.conditionsSaving=!1}}}renderConditionsEditor(){const t=new Set(this.draftConditionSensors),e=this.getAvailableConditionSensors().filter(e=>!t.has(e));return W`
      <p class="conditions-hint">${this.localize("conditions_hint")}</p>

      <div class="conditions-section">
        <div class="conditions-label">${this.localize("condition_logic")}</div>
        <div class="logic-toggle">
          <button
            type="button"
            class="logic-btn ${"OR"===this.draftConditionLogic?"active":""}"
            @click=${()=>this.setDraftConditionLogic("OR")}
          >${this.localize("logic_or")}</button>
          <button
            type="button"
            class="logic-btn ${"AND"===this.draftConditionLogic?"active":""}"
            @click=${()=>this.setDraftConditionLogic("AND")}
          >${this.localize("logic_and")}</button>
        </div>
      </div>

      <div class="conditions-section">
        ${0===this.draftConditionSensors.length?W`<div class="no-entities">${this.localize("no_conditions")}</div>`:W`
              <ul class="entities-list">
                ${this.draftConditionSensors.map(t=>{const e=this.isConditionMet(t);return W`
                    <li class="entity-item ${e?"on":"off"}">
                      <ha-icon icon="${this.getEntityIcon(t)}"></ha-icon>
                      <span class="entity-name">${this.getFriendlyName(t)}</span>
                      <span class="entity-state ${e?"on":"off"}">
                        ${e?this.localize("condition_met"):this.localize("condition_not_met")}
                      </span>
                      <button
                        type="button"
                        class="remove-btn"
                        @click=${()=>this.removeConditionSensor(t)}
                        aria-label="${this.localize("remove")}"
                      >×</button>
                    </li>
                  `})}
              </ul>
            `}
      </div>

      <div class="conditions-section">
        <label class="conditions-label" for="add-condition">
          ${this.localize("add_condition")}
        </label>
        <select
          id="add-condition"
          class="condition-select"
          @change=${this.addConditionSensor}
        >
          <option value="">-- ${this.localize("add_condition")} --</option>
          ${e.map(t=>W`
              <option value="${t}">
                ${this.getFriendlyName(t)} (${t})
              </option>
            `)}
        </select>
      </div>

      <button
        type="button"
        class="save-conditions-btn"
        ?disabled=${this.conditionsSaving}
        @click=${()=>this.saveActivationConditions()}
      >
        ${this.localize("save")}
      </button>
    `}renderConditionsDialog(){return this.showConditionsDialog?W`
      <div
        class="dialog-overlay"
        @click=${this.closeConditionsDialog}
        @pointerdown=${this.closeConditionsDialog}
      >
        <div
          class="dialog-content conditions-dialog"
          @click=${t=>t.stopPropagation()}
          @pointerdown=${t=>t.stopPropagation()}
        >
          <div class="dialog-header">
            <span class="dialog-title">${this.localize("activation_conditions")}</span>
            <button
              type="button"
              class="dialog-close"
              @click=${this.closeConditionsDialog}
              aria-label="${this.localize("close")}"
            >×</button>
          </div>
          <div class="dialog-body">
            ${this.renderConditionsEditor()}
          </div>
        </div>
      </div>
    `:W``}getEntityIcon(t){const e=this.hass.states[t];if(e?.attributes.icon)return e.attributes.icon;return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",fan:"mdi:fan",climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",input_boolean:"mdi:toggle-switch-outline",person:"mdi:account",device_tracker:"mdi:cellphone",binary_sensor:"mdi:checkbox-marked-circle-outline",sensor:"mdi:eye"}[t.split(".")[0]]||"mdi:toggle-switch"}renderEntitiesDialog(){if(!this.showEntitiesDialog)return W``;const t=this.getControlledEntitiesStatus();return W`
      <div
        class="dialog-overlay"
        @click=${this.closeEntitiesDialog}
        @pointerdown=${this.closeEntitiesDialog}
      >
        <div
          class="dialog-content conditions-dialog"
          @click=${t=>t.stopPropagation()}
          @pointerdown=${t=>t.stopPropagation()}
        >
          <div class="dialog-header">
            <span class="dialog-title">${this.localize("entities_list")}</span>
            <button
              type="button"
              class="dialog-close"
              @click=${this.closeEntitiesDialog}
              aria-label="${this.localize("close")}"
            >×</button>
          </div>
          <div class="dialog-body">
            <div class="dialog-section">
              <div class="conditions-label">${this.localize("entities_list")}</div>
              ${0===t.entities.length?W`<div class="no-entities">${this.localize("no_entities")}</div>`:W`
                    <ul class="entities-list">
                      ${t.entities.map(t=>{const e=this.isEntityOn(t);return W`
                          <li class="entity-item ${e?"on":"off"}">
                            <ha-icon icon="${this.getEntityIcon(t)}"></ha-icon>
                            <span class="entity-name">${this.getFriendlyName(t)}</span>
                            <span class="entity-state ${e?"on":"off"}">
                              ${e?this.localize("on"):this.localize("off")}
                            </span>
                          </li>
                        `})}
                    </ul>
                  `}
            </div>

            <div class="dialog-section dialog-section-divider">
              <div class="conditions-label">${this.localize("activation_conditions")}</div>
              ${this.renderConditionsEditor()}
            </div>
          </div>
        </div>
      </div>
    `}renderClimateControls(){const t=this.getClimateEntities();return 0===t.length?W``:W`
      <div class="device-controls">
        ${t.map(e=>{const i=this.getClimateTemp(e),o=this.getClimateMode(e),s=this.getClimateModes(e);return W`
            <div class="device-control-card">
              ${t.length>1?W`<div class="device-control-name">${this.getFriendlyName(e)}</div>`:""}
              <div class="control-row single-row">
                <ha-icon class="control-icon" icon="mdi:thermometer"></ha-icon>
                <div class="temp-controls">
                  <button
                    class="ctrl-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustClimateTemp(e,-1)}}
                  >−</button>
                  <span class="temp-value">${i}°</span>
                  <button
                    class="ctrl-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustClimateTemp(e,1)}}
                  >+</button>
                </div>
                <div class="mode-buttons">
                  ${s.map(t=>W`
                      <button
                        class="mode-btn ${o===t?"active":""}"
                        title="${this.localizeHvacMode(t)}"
                        @click=${i=>{i.stopPropagation(),this.setClimateMode(e,t)}}
                      >
                        <ha-icon icon="${this.getHvacModeIcon(t)}"></ha-icon>
                      </button>
                    `)}
                </div>
              </div>
            </div>
          `})}
      </div>
    `}renderFanControls(){const t=this.getFanEntities();return 0===t.length?W``:W`
      <div class="device-controls">
        ${t.map(e=>{const i=this.getFanPercentage(e);return W`
            <div class="device-control-card">
              ${t.length>1?W`<div class="device-control-name">${this.getFriendlyName(e)}</div>`:""}
              <div class="control-row single-row">
                <ha-icon class="control-icon" icon="mdi:fan"></ha-icon>
                <div class="temp-controls">
                  <button
                    class="ctrl-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustFanPercentage(e,-1)}}
                  >−</button>
                  <span class="temp-value">${i}%</span>
                  <button
                    class="ctrl-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustFanPercentage(e,1)}}
                  >+</button>
                </div>
              </div>
            </div>
          `})}
      </div>
    `}renderEnableSwitch(){const t=this.getEnabled();return W`
      <label class="enable-switch-label" title="${this.localize("enable_timer")}">
        <span class="enable-switch-text">
          ${this.localize("enable_timer")}
        </span>
        <input
          type="checkbox"
          class="enable-switch"
          .checked="${t}"
          @change="${this.handleEnableToggle}"
        />
      </label>
    `}createSectorPath(t,e,i,o,s,n,r=0){const a=360/e,l=(i+o)/2,c=l>0?r/l*(180/Math.PI):0,d=(t*a-90+c)*(Math.PI/180),h=((t+1)*a-90-c)*(Math.PI/180),p=i+r,g=o-r,u=s+p*Math.cos(d),f=n+p*Math.sin(d),m=s+g*Math.cos(d),v=n+g*Math.sin(d),b=s+g*Math.cos(h),y=n+g*Math.sin(h),$=s+p*Math.cos(h),x=n+p*Math.sin(h),_=h-d<=Math.PI?0:1;return`M ${u} ${f} L ${m} ${v} A ${g} ${g} 0 ${_} 1 ${b} ${y} L ${$} ${x} A ${p} ${p} 0 ${_} 0 ${u} ${f}`}renderCurrentTimeHighlight(t,e,i,o,s){const n=this.currentTime.getHours(),r=this.currentQuarterMinute();let a=i,l=o;if(15===this.getSlotResolution()){const t=[{m:0,a:(o+s)/2,b:s},{m:15,a:o,b:(o+s)/2},{m:30,a:(i+o)/2,b:o},{m:45,a:i,b:(i+o)/2}],e=t.find(t=>t.m===r)||t[0];a=e.a,l=e.b}else{const t=this.currentTime.getMinutes()<30;a=t?o:i,l=t?s:o}const c=this.createSectorPath(n,24,a,l,t,e,1.5);return B`
      <path
        d="${c}"
        fill="none"
        stroke="#ff6b6b"
        stroke-width="${3}"
        stroke-linejoin="round"
        stroke-linecap="round"
        pointer-events="none">
      </path>
    `}getTextPosition(t,e,i,o,s){const n=(360*(t+.5)/e-90)*(Math.PI/180);return{x:o+i*Math.cos(n),y:s+i*Math.sin(n)}}getSectorCenterAngleDeg(t,e){return(t+.5)*(360/e)-90}getUprightTextRotationDeg(t){return t>90||t<-90?t+180:t}getTimeLabel(t,e){return`${t.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}renderSectorLabel(t,e,i,o,s,n,r){const a=this.getTextPosition(t,24,e,i,o),l=this.getUprightTextRotationDeg(this.getSectorCenterAngleDeg(t,24));return B`
      <text
        x="${a.x}"
        y="${a.y}"
        text-anchor="middle"
        dominant-baseline="central"
        alignment-baseline="middle"
        font-size="${n}"
        font-weight="bold"
        transform="rotate(${l} ${a.x} ${a.y})"
        style="pointer-events: none; user-select: none; direction: ltr;"
        fill="${r}">
        ${s}
      </text>
    `}renderThirtyMinuteSectors(t,e,i,o,s,n){const r=[{pair:0,minutes:[0,15],a:s,b:n},{pair:30,minutes:[30,45],a:o,b:s}];return B`
      ${Array.from({length:24},(o,s)=>r.map(o=>{const n=o.minutes.every(e=>t.find(t=>t.hour===s&&t.minute===e)?.isActive),r=this.createSectorPath(s,24,o.a,o.b,e,i);return B`
          <path
            d="${r}"
            fill="${n?"#10b981":0===o.pair?"#ffffff":"#f8f9fa"}"
            stroke="#e5e7eb"
            stroke-width="1"
            style="cursor: pointer; transition: all 0.2s;"
            @click="${t=>{this.handleSlotClick(t,s,o.pair)}}">
            <title>${this.getTimeLabel(s,o.pair)}</title>
          </path>
        `}))}
      ${Array.from({length:24},(o,r)=>{const a=[0,15].every(e=>t.find(t=>t.hour===r&&t.minute===e)?.isActive);return this.renderSectorLabel(r,(s+n)/2,e,i,this.getTimeLabel(r,0),11,a?"#ffffff":"#374151")})}
      ${Array.from({length:24},(n,r)=>{const a=[30,45].every(e=>t.find(t=>t.hour===r&&t.minute===e)?.isActive);return this.renderSectorLabel(r,(o+s)/2,e,i,this.getTimeLabel(r,30),9,a?"#ffffff":"#6b7280")})}
    `}renderFifteenMinuteSectors(t,e,i,o,s,n){const r=[{m:0,a:(s+n)/2,b:n},{m:15,a:s,b:(s+n)/2},{m:30,a:(o+s)/2,b:s},{m:45,a:o,b:(o+s)/2}],a=r[0],l=(a.a+a.b)/2;return B`
      ${Array.from({length:24},(o,s)=>r.map(o=>{const n=t.find(t=>t.hour===s&&t.minute===o.m)?.isActive||!1,r=this.selectedHour===s,a=this.createSectorPath(s,24,o.a,o.b,e,i);return B`
          <path
            d="${a}"
            fill="${n?"#10b981":"#ffffff"}"
            stroke="${r?"#3b82f6":"#e5e7eb"}"
            stroke-width="${r?"2.5":"1"}"
            style="cursor: pointer; transition: all 0.2s;"
            @click="${t=>{this.handleFifteenClick(t,s,o.m)}}">
            <title>${this.getTimeLabel(s,o.m)}</title>
          </path>
          ${r&&0!==o.m?this.renderSectorLabel(s,(o.a+o.b)/2,e,i,String(o.m),9,n?"#ffffff":"#374151"):""}
        `}))}
      ${Array.from({length:24},(o,s)=>{const n=[0,15,30,45].every(e=>t.find(t=>t.hour===s&&t.minute===e)?.isActive);return this.renderSectorLabel(s,l,e,i,s.toString().padStart(2,"0"),11,n?"#ffffff":"#374151")})}
    `}renderDividingLines(){const t=[];for(let e=0;e<24;e++){const i=(360*e/24-90)*(Math.PI/180),o=200+50*Math.cos(i),s=200+50*Math.sin(i),n=200+180*Math.cos(i),r=200+180*Math.sin(i);t.push(W`
        <line 
          x1="${o}" 
          y1="${s}" 
          x2="${n}" 
          y2="${r}" 
          stroke="#e5e7eb" 
          stroke-width="1">
        </line>
      `)}return t}renderOuterSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const o=this.createSectorPath(i,24,50,180,200,200),s=this.getTextPosition(i,24,115,200,200),n=this.getSectorCenterAngleDeg(i,24),r=this.getUprightTextRotationDeg(n),a=s.y+3,l=e.find(t=>t.hour===i&&0===t.minute),c=l?.isActive||!1,d=this.currentTime.getHours()===i&&this.currentTime.getMinutes()<30;t.push(W`
        <path 
          d="${o}" 
          fill="${c?"#10b981":"#ffffff"}"
          stroke="${d?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${d?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,0)}">
        </path>
        <text 
          x="${s.x}" 
          y="${a}" 
          text-anchor="middle" 
          font-size="11" 
          font-weight="bold"
          transform="rotate(${r} ${s.x} ${a})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${c?"#ffffff":"#374151"}">
          ${this.getTimeLabel(i,0)}
        </text>
      `)}return t}renderInnerSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const o=this.createSectorPath(i,24,0,50,200,200),s=this.getTextPosition(i,24,25,200,200),n=this.getSectorCenterAngleDeg(i,24),r=this.getUprightTextRotationDeg(n),a=s.y+2,l=e.find(t=>t.hour===i&&30===t.minute),c=l?.isActive||!1,d=this.currentTime.getHours()===i&&this.currentTime.getMinutes()>=30;t.push(W`
        <path 
          d="${o}" 
          fill="${c?"#10b981":"#f8f9fa"}"
          stroke="${d?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${d?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,30)}">
        </path>
        <text 
          x="${s.x}" 
          y="${a}" 
          text-anchor="middle" 
          font-size="9" 
          font-weight="bold"
          transform="rotate(${r} ${s.x} ${a})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${c?"#ffffff":"#6b7280"}">
          ${this.getTimeLabel(i,30)}
        </text>
      `)}return t}render(){if(!this.config)return W``;if(this.config.entity&&this.hass&&!this.getEntityState())return W`
        <ha-card>
          <div class="warning">
            ${this.localize("entity_not_found")} (${this.config.entity})
          </div>
        </ha-card>
      `;const t=this.isDemoPreview(),e=!!t||this.getHomeStatus(),i=this.getEntityName(),o=t?this.getDemoTimeSlots():this.getTimeSlots(),s=200,n=200,r=180,a=50,l=115;return W`
      <ha-card>
        ${!1!==this.config.show_title?W`
          <div class="header">
            <div class="title">${i}</div>
            ${this.shouldShowEnableSwitch()?this.renderEnableSwitch():""}
            <div
              class="system-status clickable ${e?"active":"inactive"}"
              title="${this.localize("activation_conditions")}"
              @click=${this.openConditionsDialog}
            >
              ${e?this.localize("active"):this.localize("inactive")}
            </div>
          </div>
        `:this.shouldShowEnableSwitch()?W`
          <div class="header">
            ${this.renderEnableSwitch()}
            <div
              class="system-status clickable ${e?"active":"inactive"}"
              title="${this.localize("activation_conditions")}"
              @click=${this.openConditionsDialog}
            >
              ${e?this.localize("active"):this.localize("inactive")}
            </div>
          </div>
        `:W`
          <div class="header">
            <div
              class="system-status clickable ${e?"active":"inactive"}"
              title="${this.localize("activation_conditions")}"
              @click=${this.openConditionsDialog}
            >
              ${e?this.localize("active"):this.localize("inactive")}
            </div>
          </div>
        `}
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Circles -->
            <circle 
              cx="${s}" 
              cy="${n}" 
              r="${r}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            <circle 
              cx="${s}" 
              cy="${n}" 
              r="${l}" 
              fill="none" 
              stroke="#d1d5db" 
              stroke-width="1.5">
            </circle>
            <circle 
              cx="${s}" 
              cy="${n}" 
              r="${a}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            
            <!-- Dividing lines -->
            ${Array.from({length:24},(t,e)=>{const i=(360*e/24-90)*(Math.PI/180),o=s+a*Math.cos(i),l=n+a*Math.sin(i),c=s+r*Math.cos(i),d=n+r*Math.sin(i);return B`
                <line 
                  x1="${o}" 
                  y1="${l}" 
                  x2="${c}" 
                  y2="${d}" 
                  stroke="#e5e7eb" 
                  stroke-width="1">
                </line>
              `})}
            
            <!-- Center indicator for controlled entities -->
            ${(()=>{if(t)return B`
                <circle 
                  cx="${s}" 
                  cy="${n}" 
                  r="${a}" 
                  fill="#10b981"
                  style="cursor: default;">
                </circle>
                <text 
                  x="${s}" 
                  y="${205}" 
                  text-anchor="middle" 
                  font-size="14" 
                  font-weight="bold"
                  fill="#ffffff"
                  style="pointer-events: none; user-select: none;">
                  ${this.localize("on")}
                </text>
                `;const e=this.getControlledEntitiesStatus();let i="#9ca3af",o="—";return this.getHomeStatus()?0===e.total?(i="#d1d5db",o="—"):0===e.active?(i="#ef4444",o=this.localize("off")):e.active===e.total?(i="#10b981",o=this.localize("on")):(i="#f59e0b",o=`${e.active}/${e.total}`):(i="#9ca3af",o="—"),B`
                <!-- Full inner circle indicator -->
                <circle 
                  cx="${s}" 
                  cy="${n}" 
                  r="${a}" 
                  fill="${i}"
                  style="cursor: pointer;"
                  @click="${t=>this.handleCenterClick(t)}">
                </circle>
                
                <!-- Status text -->
                <text 
                  x="${s}" 
                  y="${205}" 
                  text-anchor="middle" 
                  font-size="14" 
                  font-weight="bold"
                  fill="#ffffff"
                  style="pointer-events: none; user-select: none;">
                  ${o}
                </text>
                
                <!-- Entity count (small text below) -->
                ${e.total>0?B`
                  <text 
                    x="${s}" 
                    y="${220}" 
                    text-anchor="middle" 
                    font-size="8" 
                    fill="#ffffff"
                    opacity="0.9"
                    style="pointer-events: none; user-select: none;">
                    ${e.total} ${1===e.total?this.localize("entity"):this.localize("entities")}
                  </text>
                `:""}
              `})()}
            
            ${15===this.getSlotResolution()?this.renderFifteenMinuteSectors(o,s,n,a,l,r):this.renderThirtyMinuteSectors(o,s,n,a,l,r)}

            <!-- Current time highlight (drawn last so all sides stay uniform) -->
            ${this.renderCurrentTimeHighlight(s,n,a,l,r)}
          </svg>
        </div>
        ${this.renderClimateControls()}
        ${this.renderFanControls()}
        ${this.renderEntitiesDialog()}
        ${this.renderConditionsDialog()}
      </ha-card>
    `}static get styles(){return r`
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
        min-height: 180px;
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
      
    `}};t([gt({attribute:!1})],ft.prototype,"hass",void 0),t([ut()],ft.prototype,"config",void 0),t([ut()],ft.prototype,"currentTime",void 0),t([ut()],ft.prototype,"showEntitiesDialog",void 0),t([ut()],ft.prototype,"showConditionsDialog",void 0),t([ut()],ft.prototype,"draftConditionSensors",void 0),t([ut()],ft.prototype,"draftConditionLogic",void 0),t([ut()],ft.prototype,"conditionsSaving",void 0),t([ut()],ft.prototype,"selectedHour",void 0),ft=t([dt("timer-24h-card")],ft),console.info("%c  TIMER-24H-CARD  %c  Version 1.3.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"timer-24h-card",name:"Timer 24H Card",description:"24 Hour Timer Card with automatic entity control",preview:!0,documentationURL:"https://github.com/davidss20/home-assistant-24h-timer-integration"});const mt=["person","device_tracker","binary_sensor","sensor","input_boolean"];let vt=class extends lt{constructor(){super(...arguments),this.config={entity:"",show_title:!0},this.draftSensors=[],this.draftLogic="OR",this.conditionsSaving=!1,this.conditionsDirty=!1,this.slotResolutionSaving=!1,this.lastSyncedEntity=""}setConfig(t){this.config={...t}}updated(t){super.updated(t),this.config?.entity&&this.hass?.states[this.config.entity]&&(this.config.entity!==this.lastSyncedEntity||!this.conditionsDirty&&t.has("hass"))&&this.syncDraftFromEntity()}syncDraftFromEntity(){const t=this.hass?.states[this.config.entity];if(!t)return;const e=t.attributes?.home_sensors,i=String(t.attributes?.home_logic||"OR").toUpperCase();this.draftSensors=Array.isArray(e)?[...e]:[],this.draftLogic="AND"===i?"AND":"OR",this.lastSyncedEntity=this.config.entity,this.conditionsDirty=!1}getFriendlyName(t){return this.hass?.states[t]?.attributes?.friendly_name||t}getAvailableConditionSensors(){if(!this.hass)return[];const t=new Set(this.draftSensors);return Object.keys(this.hass.states).filter(e=>mt.some(t=>e.startsWith(`${t}.`))&&!t.has(e)).sort()}render(){if(!this.hass)return W`<div class="loading">Loading...</div>`;const t=Object.keys(this.hass.states).filter(t=>{const e=this.hass.states[t];return t.startsWith("sensor.")&&void 0!==e?.attributes?.time_slots}).sort(),e=this.config.entity?this.hass.states[this.config.entity]:void 0;return W`
      <div class="card-config">
        <div class="config-header">
          <h2>Timer 24H Card Configuration</h2>
          <p>Select a timer entity created by the Timer 24H integration</p>
        </div>

        ${0===t.length?W`
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
            `:""}

        <div class="config-row">
          <label for="entity">Timer Entity</label>
          <select
            id="entity"
            .value="${this.config.entity||""}"
            @change="${this.handleEntityChange}"
          >
            <option value="">-- Select a timer entity --</option>
            ${t.map(t=>{const e=this.hass.states[t].attributes.friendly_name||t;return W`
                <option
                  value="${t}"
                  ?selected="${this.config.entity===t}"
                >
                  ${e}
                </option>
              `})}
          </select>
          <div class="help-text">The timer entity to display and control</div>
        </div>

        <div class="config-row">
          <label>
            <input
              type="checkbox"
              .checked="${!1!==this.config.show_title}"
              @change="${this.handleShowTitleChange}"
            />
            Show entity name as title
          </label>
          <div class="help-text">Display the timer name at the top of the card</div>
        </div>

        ${!1!==this.config.show_title?W`
              <div class="config-row">
                <label for="custom_title">Custom Title (Optional)</label>
                <input
                  type="text"
                  id="custom_title"
                  .value="${this.config.custom_title||""}"
                  @input="${this.handleCustomTitleChange}"
                  placeholder="Leave empty to use entity name"
                />
                <div class="help-text">
                  Override the entity name with a custom title
                </div>
              </div>
            `:""}

        <div class="config-row">
          <label>
            <input
              type="checkbox"
              .checked="${!0===this.config.show_enable_switch}"
              @change="${this.handleShowEnableSwitchChange}"
            />
            Show enable/disable switch
          </label>
          <div class="help-text">
            Display a toggle switch to enable or disable the timer
          </div>
        </div>

        ${e?W`
              <div class="config-row">
                <label>Slot interval</label>
                <div class="logic-toggle">
                  <button
                    type="button"
                    class="logic-btn ${15===this.getSlotResolution()?"active":""}"
                    ?disabled=${this.slotResolutionSaving}
                    @click=${()=>this.setSlotResolution(15)}
                  >
                    15 minutes
                  </button>
                  <button
                    type="button"
                    class="logic-btn ${30===this.getSlotResolution()?"active":""}"
                    ?disabled=${this.slotResolutionSaving}
                    @click=${()=>this.setSlotResolution(30)}
                  >
                    30 minutes
                  </button>
                </div>
                <div class="help-text">
                  Saved to the timer (not this card). 15 min: tap each quarter.
                  30 min: classic two-ring view.
                </div>
              </div>
            `:""}

        ${e?W`
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
                      class="logic-btn ${"OR"===this.draftLogic?"active":""}"
                      @click=${()=>this.setLogic("OR")}
                    >
                      OR (any)
                    </button>
                    <button
                      type="button"
                      class="logic-btn ${"AND"===this.draftLogic?"active":""}"
                      @click=${()=>this.setLogic("AND")}
                    >
                      AND (all)
                    </button>
                  </div>
                </div>

                <div class="config-row">
                  <label>Condition sensors</label>
                  ${0===this.draftSensors.length?W`<div class="empty-list">
                        No conditions — timer always allowed
                      </div>`:W`
                        <ul class="sensor-list">
                          ${this.draftSensors.map(t=>W`
                              <li>
                                <span>${this.getFriendlyName(t)}</span>
                                <button
                                  type="button"
                                  class="remove-btn"
                                  @click=${()=>this.removeSensor(t)}
                                >
                                  ×
                                </button>
                              </li>
                            `)}
                        </ul>
                      `}
                  <select class="add-select" @change=${this.addSensor}>
                    <option value="">-- Add condition --</option>
                    ${this.getAvailableConditionSensors().map(t=>W`
                        <option value="${t}">
                          ${this.getFriendlyName(t)} (${t})
                        </option>
                      `)}
                  </select>
                </div>

                <button
                  type="button"
                  class="save-btn"
                  ?disabled=${this.conditionsSaving||!this.conditionsDirty}
                  @click=${()=>this.saveConditions()}
                >
                  ${this.conditionsSaving?"Saving…":"Save conditions"}
                </button>
              </div>

              <div class="preview-info">
                <h3>Selected Timer Details</h3>
                <div class="detail-row">
                  <strong>Entity ID:</strong> ${this.config.entity}
                </div>
                <div class="detail-row">
                  <strong>Name:</strong>
                  ${e.attributes?.friendly_name||"Unknown"}
                </div>
                <div class="detail-row">
                  <strong>State:</strong> ${e.state||"Unknown"}
                </div>
                <div class="detail-row">
                  <strong>Home Status:</strong>
                  ${e.attributes?.home_status?"Active":"Inactive"}
                </div>
              </div>
            `:""}
      </div>
    `}handleEntityChange(t){const e=t.target;this.config={...this.config,entity:e.value},this.conditionsDirty=!1,this.lastSyncedEntity="",this.configChanged()}handleShowTitleChange(t){const e=t.target;this.config={...this.config,show_title:e.checked},this.configChanged()}handleCustomTitleChange(t){const e=t.target;this.config={...this.config,custom_title:e.value||void 0},this.configChanged()}handleShowEnableSwitchChange(t){const e=t.target;this.config={...this.config,show_enable_switch:e.checked},this.configChanged()}getSlotResolution(){if(!this.config?.entity||!this.hass)return 15;return 30===Number(this.hass.states[this.config.entity]?.attributes?.slot_resolution)?30:15}async setSlotResolution(t){if(this.hass&&this.config?.entity&&!this.slotResolutionSaving&&this.getSlotResolution()!==t){this.slotResolutionSaving=!0;try{await this.hass.callService("timer_24h","set_slot_resolution",{entity_id:this.config.entity,slot_resolution:t})}catch(t){console.error("Failed to set slot interval:",t)}finally{this.slotResolutionSaving=!1}}}setLogic(t){this.draftLogic=t,this.conditionsDirty=!0}addSensor(t){const e=t.target,i=e.value;i&&(this.draftSensors.includes(i)||(this.draftSensors=[...this.draftSensors,i],this.conditionsDirty=!0),e.value="")}removeSensor(t){this.draftSensors=this.draftSensors.filter(e=>e!==t),this.conditionsDirty=!0}async saveConditions(){if(this.hass&&this.config?.entity&&!this.conditionsSaving){this.conditionsSaving=!0;try{await this.hass.callService("timer_24h","set_activation_conditions",{entity_id:this.config.entity,home_sensors:this.draftSensors,home_logic:this.draftLogic}),this.conditionsDirty=!1}catch(t){console.error("Failed to save activation conditions:",t)}finally{this.conditionsSaving=!1}}}configChanged(){const t=new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0});this.dispatchEvent(t)}static get styles(){return r`
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
    `}};t([gt({attribute:!1})],vt.prototype,"hass",void 0),t([ut()],vt.prototype,"config",void 0),t([ut()],vt.prototype,"draftSensors",void 0),t([ut()],vt.prototype,"draftLogic",void 0),t([ut()],vt.prototype,"conditionsSaving",void 0),t([ut()],vt.prototype,"conditionsDirty",void 0),t([ut()],vt.prototype,"slotResolutionSaving",void 0),vt=t([dt("timer-24h-card-editor")],vt);var bt=Object.freeze({__proto__:null,get Timer24HCardEditor(){return vt}});export{ft as Timer24HCard};
