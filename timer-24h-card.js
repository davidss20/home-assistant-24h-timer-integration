function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:h,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,m=g?g.emptyScript:"",$=f.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!h(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??_)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,$?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.1");const x=globalThis,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,P=`<${T}>`,k=document,M=()=>k.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,z=/>/g,I=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=q(1),V=q(2),W=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),J=new WeakMap,K=k.createTreeWalker(k,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(n.lastIndex=l,h=n.exec(i),null!==h);)l=n.lastIndex,n===N?"!--"===h[1]?n=R:void 0!==h[1]?n=z:void 0!==h[2]?(j.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=I):void 0!==h[3]&&(n=I):n===I?">"===h[0]?(n=r??N,c=-1):void 0===h[1]?c=-2:(c=n.lastIndex-h[2].length,a=h[1],n=void 0===h[3]?I:'"'===h[3]?L:D):n===L||n===D?n=I:n===R||n===z?n=N:(n=I,r=void 0);const d=n===I&&t[e+1].startsWith("/>")?" ":"";o+=n===N?i+P:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[h,c]=G(t,e);if(this.el=X.createElement(h,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?st:"@"===n[1]?rt:et}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=k.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??k).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=K.nextNode(),o++)}return K.currentNode=k,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),U(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new tt(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Q(this,s[i+n],e,n),a===W&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class rt extends et{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===W)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(X,tt),(x.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class ht extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(M(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ht._$litElement$=!0,ht.finalized=!0,at.litElementHydrateSupport?.({LitElement:ht});const ct=at.litElementPolyfillSupport;ct?.({LitElement:ht}),(at.litElementVersions??=[]).push("4.2.1");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:_},pt=(t=dt,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ft(t){return ut({...t,state:!0,attribute:!1})}let gt=class extends ht{static getLayoutOptions(){return{grid_rows:2,grid_columns:6,grid_min_rows:2,grid_min_columns:3}}getCardSize(){return 3}static async getConfigElement(){return await Promise.resolve().then(function(){return $t}),document.createElement("timer-24h-card-editor")}static getStubConfig(){return{entity:"",show_title:!0}}constructor(){super(),this.currentTime=new Date,this.optimisticSlots=new Map}setConfig(t){if(!t)throw new Error("Invalid configuration: config is required");if(!t.entity)throw new Error("Invalid configuration: entity is required");this.config={show_title:!0,...t}}shouldUpdate(t){if(t.has("config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e||!this.config?.entity)return!0;const i=e.states[this.config.entity],s=this.hass.states[this.config.entity];if(i!==s)return!0;if(i?.attributes.time_slots!==s?.attributes.time_slots)return!0}return t.has("currentTime")}updated(t){if(super.updated(t),t.has("hass")&&this.hass&&(this.updateCurrentTime(),this.config?.entity)){const e=t.get("hass"),i=e?.states[this.config.entity],s=this.hass?.states[this.config.entity];if(i&&s){JSON.stringify(i.attributes.time_slots)!==JSON.stringify(s.attributes.time_slots)&&(this.optimisticSlots.clear(),this.requestUpdate())}}}connectedCallback(){super.connectedCallback(),this.startTimer()}disconnectedCallback(){super.disconnectedCallback(),this.updateInterval&&clearInterval(this.updateInterval)}startTimer(){this.updateInterval&&clearInterval(this.updateInterval),this.updateInterval=window.setInterval(()=>{this.updateCurrentTime()},3e4)}updateCurrentTime(){this.currentTime=new Date,this.requestUpdate()}getEntityState(){return this.hass&&this.config.entity?this.hass.states[this.config.entity]:null}getTimeSlots(){const t=this.getEntityState();if(!t||!t.attributes.time_slots){const t=[];for(let e=0;e<24;e++)t.push({hour:e,minute:0,isActive:!1}),t.push({hour:e,minute:30,isActive:!1});return t}return t.attributes.time_slots.map(t=>{const e=`${t.hour}:${t.minute}`;return this.optimisticSlots.has(e)?{...t,isActive:this.optimisticSlots.get(e)}:t})}getHomeStatus(){const t=this.getEntityState();return!t||!1!==t.attributes.home_status}getEntityName(){const t=this.getEntityState();return t&&t.attributes.friendly_name||"Timer 24H"}handleSlotClick(t,e,i){t.stopPropagation(),t.preventDefault(),this.clickTimeout||(this.clickTimeout=window.setTimeout(()=>{this.clickTimeout=void 0},300),this.toggleTimeSlot(e,i))}async toggleTimeSlot(t,e){if(!this.hass||!this.config.entity)return;const i=`${t}:${e}`;try{const s=this.getTimeSlots().find(i=>i.hour===t&&i.minute===e),r=!s||!s.isActive;this.optimisticSlots.set(i,r),this.requestUpdate(),console.log(`🔄 Toggle slot ${t}:${String(e).padStart(2,"0")} to ${r?"ON":"OFF"}`),await this.hass.callService("timer_24h","toggle_slot",{entity_id:this.config.entity,hour:t,minute:e}),setTimeout(()=>{this.optimisticSlots.delete(i),this.requestUpdate()},1e3)}catch(s){console.error(`❌ Failed to toggle time slot ${t}:${String(e).padStart(2,"0")}:`,s),this.optimisticSlots.delete(i),this.requestUpdate()}}createSectorPath(t,e,i,s,r,o){const n=(360*t/e-90)*(Math.PI/180),a=(360*(t+1)/e-90)*(Math.PI/180),h=r+i*Math.cos(n),c=o+i*Math.sin(n),l=r+s*Math.cos(n),d=o+s*Math.sin(n),p=r+s*Math.cos(a),u=o+s*Math.sin(a),f=r+i*Math.cos(a),g=o+i*Math.sin(a),m=a-n<=Math.PI?0:1;return`M ${h} ${c} L ${l} ${d} A ${s} ${s} 0 ${m} 1 ${p} ${u} L ${f} ${g} A ${i} ${i} 0 ${m} 0 ${h} ${c}`}getTextPosition(t,e,i,s,r){const o=(360*(t+.5)/e-90)*(Math.PI/180);return{x:s+i*Math.cos(o),y:r+i*Math.sin(o)}}getTimeLabel(t,e){return`${t.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}renderDividingLines(){const t=[];for(let e=0;e<24;e++){const i=(360*e/24-90)*(Math.PI/180),s=200+50*Math.cos(i),r=200+50*Math.sin(i),o=200+180*Math.cos(i),n=200+180*Math.sin(i);t.push(B`
        <line 
          x1="${s}" 
          y1="${r}" 
          x2="${o}" 
          y2="${n}" 
          stroke="#e5e7eb" 
          stroke-width="1">
        </line>
      `)}return t}renderOuterSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const s=this.createSectorPath(i,24,50,180,200,200),r=this.getTextPosition(i,24,115,200,200),o=e.find(t=>t.hour===i&&0===t.minute),n=o?.isActive||!1,a=this.currentTime.getHours()===i&&this.currentTime.getMinutes()<30;t.push(B`
        <path 
          d="${s}" 
          fill="${n?"#10b981":"#ffffff"}"
          stroke="${a?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${a?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,0)}">
        </path>
        <text 
          x="${r.x}" 
          y="${r.y+3}" 
          text-anchor="middle" 
          font-size="10" 
          font-weight="bold"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${n?"#ffffff":"#374151"}">
          ${this.getTimeLabel(i,0)}
        </text>
      `)}return t}renderInnerSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const s=this.createSectorPath(i,24,0,50,200,200),r=this.getTextPosition(i,24,25,200,200),o=e.find(t=>t.hour===i&&30===t.minute),n=o?.isActive||!1,a=this.currentTime.getHours()===i&&this.currentTime.getMinutes()>=30;t.push(B`
        <path 
          d="${s}" 
          fill="${n?"#10b981":"#f8f9fa"}"
          stroke="${a?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${a?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,30)}">
        </path>
        <text 
          x="${r.x}" 
          y="${r.y+2}" 
          text-anchor="middle" 
          font-size="8" 
          font-weight="bold"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${n?"#ffffff":"#6b7280"}">
          ${this.getTimeLabel(i,30)}
        </text>
      `)}return t}render(){if(!this.hass||!this.config.entity)return B`
        <ha-card>
          <div class="warning">
            Please configure the timer entity in card settings
          </div>
        </ha-card>
      `;if(!this.getEntityState())return B`
        <ha-card>
          <div class="warning">
            Entity "${this.config.entity}" not found. Please check your configuration.
          </div>
        </ha-card>
      `;const t=this.getHomeStatus(),e=this.getEntityName(),i=this.getTimeSlots(),s=200,r=200,o=180,n=50,a=115;return B`
      <ha-card>
        ${!1!==this.config.show_title?B`
          <div class="header">
            <div class="title">${e}</div>
            <div class="system-status ${t?"active":"inactive"}">
              ${t?"מופעל":"מושבת"}
            </div>
          </div>
        `:""}
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Circles -->
            <circle 
              cx="${s}" 
              cy="${r}" 
              r="${o}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            <circle 
              cx="${s}" 
              cy="${r}" 
              r="${a}" 
              fill="none" 
              stroke="#d1d5db" 
              stroke-width="1.5">
            </circle>
            <circle 
              cx="${s}" 
              cy="${r}" 
              r="${n}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            
            <!-- Dividing lines -->
            ${Array.from({length:24},(t,e)=>{const i=(360*e/24-90)*(Math.PI/180),a=s+n*Math.cos(i),h=r+n*Math.sin(i),c=s+o*Math.cos(i),l=r+o*Math.sin(i);return V`
                <line 
                  x1="${a}" 
                  y1="${h}" 
                  x2="${c}" 
                  y2="${l}" 
                  stroke="#e5e7eb" 
                  stroke-width="1">
                </line>
              `})}
            
            <!-- Outer sectors (full hours) -->
            ${Array.from({length:24},(t,e)=>{const n=i.find(t=>t.hour===e&&0===t.minute),h=n?.isActive||!1,c=this.currentTime.getHours()===e&&this.currentTime.getMinutes()<30,l=this.createSectorPath(e,24,a,o,s,r),d=this.getTextPosition(e,24,147.5,s,r);return V`
                <path 
                  d="${l}" 
                  fill="${h?"#10b981":"#ffffff"}"
                  stroke="${c?"#ff6b6b":"#e5e7eb"}"
                  stroke-width="${c?"3":"1"}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${t=>this.handleSlotClick(t,e,0)}">
                </path>
                <text 
                  x="${d.x}" 
                  y="${d.y+3}" 
                  text-anchor="middle" 
                  font-size="10" 
                  font-weight="bold"
                  style="pointer-events: none; user-select: none;"
                  fill="${h?"#ffffff":"#374151"}">
                  ${this.getTimeLabel(e,0)}
                </text>
              `})}
            
            <!-- Inner sectors (half hours) -->
            ${Array.from({length:24},(t,e)=>{const o=i.find(t=>t.hour===e&&30===t.minute),h=o?.isActive||!1,c=this.currentTime.getHours()===e&&this.currentTime.getMinutes()>=30,l=this.createSectorPath(e,24,n,a,s,r),d=this.getTextPosition(e,24,82.5,s,r);return V`
                <path 
                  d="${l}" 
                  fill="${h?"#10b981":"#f8f9fa"}"
                  stroke="${c?"#ff6b6b":"#e5e7eb"}"
                  stroke-width="${c?"3":"1"}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${t=>this.handleSlotClick(t,e,30)}">
                </path>
                <text 
                  x="${d.x}" 
                  y="${d.y+2}" 
                  text-anchor="middle" 
                  font-size="8" 
                  font-weight="bold"
                  style="pointer-events: none; user-select: none;"
                  fill="${h?"#ffffff":"#6b7280"}">
                  ${this.getTimeLabel(e,30)}
                </text>
              `})}
          </svg>
        </div>
      </ha-card>
    `}static get styles(){return n`
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
    `}};t([ut({attribute:!1})],gt.prototype,"hass",void 0),t([ft()],gt.prototype,"config",void 0),t([ft()],gt.prototype,"currentTime",void 0),t([ft()],gt.prototype,"optimisticSlots",void 0),gt=t([lt("timer-24h-card")],gt),console.info("%c  TIMER-24H-CARD  %c  Version 4.5.0 - SERVICE FIX  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"timer-24h-card",name:"Timer 24H Card",description:"24 Hour Timer Card with automatic entity control",preview:!0,documentationURL:"https://github.com/davidss20/home-assistant-24h-timer-integration"});let mt=class extends ht{constructor(){super(...arguments),this.config={entity:"",show_title:!0}}setConfig(t){this.config={...t}}render(){if(!this.hass)return B`<div class="loading">Loading...</div>`;const t=Object.keys(this.hass.states).filter(t=>{const e=this.hass.states[t];return t.startsWith("sensor.")&&void 0!==e?.attributes?.time_slots}).sort();return B`
      <div class="card-config">
        <div class="config-header">
          <h2>Timer 24H Card Configuration</h2>
          <p>Select a timer entity created by the Timer 24H integration</p>
        </div>

        ${0===t.length?B`
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
            ${t.map(t=>{const e=this.hass.states[t].attributes.friendly_name||t;return B`
                <option value="${t}" ?selected="${this.config.entity===t}">
                  ${e}
                </option>
              `})}
          </select>
          <div class="help-text">
            The timer entity to display and control
          </div>
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
          <div class="help-text">
            Display the timer name at the top of the card
          </div>
        </div>

        ${this.config.entity&&this.hass.states[this.config.entity]?B`
          <div class="preview-info">
            <h3>Selected Timer Details</h3>
            <div class="detail-row">
              <strong>Entity ID:</strong> ${this.config.entity}
            </div>
            <div class="detail-row">
              <strong>Name:</strong> ${this.hass.states[this.config.entity]?.attributes?.friendly_name||"Unknown"}
            </div>
            <div class="detail-row">
              <strong>State:</strong> ${this.hass.states[this.config.entity]?.state||"Unknown"}
            </div>
            <div class="detail-row">
              <strong>Home Status:</strong> ${this.hass.states[this.config.entity]?.attributes?.home_status?"At Home":"Away"}
            </div>
          </div>
        `:""}
      </div>
    `}handleEntityChange(t){const e=t.target;this.config={...this.config,entity:e.value},this.configChanged()}handleShowTitleChange(t){const e=t.target;this.config={...this.config,show_title:e.checked},this.configChanged()}configChanged(){const t=new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0});this.dispatchEvent(t)}static get styles(){return n`
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
    `}};t([ut({attribute:!1})],mt.prototype,"hass",void 0),t([ft()],mt.prototype,"config",void 0),mt=t([lt("timer-24h-card-editor")],mt);var $t=Object.freeze({__proto__:null,get Timer24HCardEditor(){return mt}});export{gt as Timer24HCard};
