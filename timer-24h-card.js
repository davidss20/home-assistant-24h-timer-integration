function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:g}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",$=u.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!l(t,e),_={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,o=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,$?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,T=`<${k}>`,P=document,M=()=>P.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,N=/>/g,I=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),q=B(1),F=B(2),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),J=new WeakMap,G=P.createTreeWalker(P,129);function K(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===H?"!--"===l[1]?r=D:void 0!==l[1]?r=N:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=I):void 0!==l[3]&&(r=I):r===I?">"===l[0]?(r=o??H,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?I:'"'===l[3]?j:R):r===j||r===R?r=I:r===D||r===N?r=H:(r=I,o=void 0);const d=r===I&&t[e+1].startsWith("/>")?" ":"";n+=r===H?i+T:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[K(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=X.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[n++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),G.nextNode(),a.push({type:2,index:++o});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=z(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);G.currentNode=s;let o=G.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=G.nextNode(),n++)}return G.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),z(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Q(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,s[i+r],e,r),a===W&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===V?t=V:t!==V&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===W)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(X,tt),(w.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.1");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},pt=(t=dt,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t)}}throw Error("Unsupported decorator location: "+s)};function gt(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return gt({...t,state:!0,attribute:!1})}let ft=class extends lt{static getLayoutOptions(){return{grid_rows:2,grid_columns:6,grid_min_rows:2,grid_min_columns:3}}getCardSize(){return 3}static async getConfigElement(){return await Promise.resolve().then(function(){return $t}),document.createElement("timer-24h-card-editor")}static getStubConfig(){return{type:"custom:timer-24h-card",entity:"",show_title:!0}}constructor(){super(),this.currentTime=new Date,this.showEntitiesDialog=!1}setConfig(t){if(!t)throw new Error("Invalid configuration: config is required");if(!t.entity)throw new Error("Invalid configuration: entity is required");this.config={show_title:!0,...t}}shouldUpdate(t){if(t.has("config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e||!this.config?.entity)return!0;const i=e.states[this.config.entity],s=this.hass.states[this.config.entity];if(i!==s)return!0;if(JSON.stringify(i?.attributes.time_slots||[])!==JSON.stringify(s?.attributes.time_slots||[]))return console.log("🔄 Time slots changed, updating card"),!0;const o=s?.attributes.controlled_entities||[];for(const t of o){const i=e.states[t],s=this.hass.states[t];if(i?.state!==s?.state)return console.log("🔄 Controlled entity state changed:",t),!0}}return t.has("currentTime")}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.updateCurrentTime()}connectedCallback(){super.connectedCallback(),this.startTimer()}disconnectedCallback(){super.disconnectedCallback(),this.updateInterval&&clearInterval(this.updateInterval)}startTimer(){this.updateInterval&&clearInterval(this.updateInterval),this.updateInterval=window.setInterval(()=>{this.updateCurrentTime()},3e4)}updateCurrentTime(){this.currentTime=new Date,this.requestUpdate()}getEntityState(){return this.hass&&this.config.entity?this.hass.states[this.config.entity]:null}getTimeSlots(){const t=this.getEntityState();if(!t||!t.attributes.time_slots){const t=[];for(let e=0;e<24;e++)t.push({hour:e,minute:0,isActive:!1}),t.push({hour:e,minute:30,isActive:!1});return t}return t.attributes.time_slots}getHomeStatus(){const t=this.getEntityState();return!t||!1!==t.attributes.home_status}getEntityName(){if(this.config.custom_title)return this.config.custom_title;const t=this.getEntityState();return t&&t.attributes.friendly_name||"Timer 24H"}getControlledEntitiesStatus(){const t=this.getEntityState();if(!t)return{total:0,active:0,entities:[]};const e=t.attributes.controlled_entities||[];let i=0;for(const t of e){const e=this.hass.states[t];e&&"on"===e.state&&i++}return{total:e.length,active:i,entities:e}}localize(t){const e=this.hass?.language||this.hass?.locale?.language||"en",i={en:{active:"Active",inactive:"Inactive",on:"ON",off:"OFF",entity:"entity",entities:"entities",configure_entity:"Please configure the timer entity in card settings",entity_not_found:"Entity not found. Please check your configuration.",enable_timer:"Enable Timer",entities_list:"Controlled Entities",close:"Close",no_entities:"No entities configured"},he:{active:"פעיל",inactive:"לא פעיל",on:"דלוק",off:"כבוי",entity:"ישות",entities:"ישויות",configure_entity:"אנא הגדר את ישות הטיימר בהגדרות הכרטיס",entity_not_found:"הישות לא נמצאה. אנא בדוק את ההגדרות.",enable_timer:"הפעל טיימר",entities_list:"ישויות מבוקרות",close:"סגור",no_entities:"לא הוגדרו ישויות"}};return i[e]?.[t]||i.en[t]||t}handleSlotClick(t,e,i){t.stopPropagation(),t.preventDefault();const s=`${e}:${String(i).padStart(2,"0")}`;console.log(`👆 Click detected on ${s}`),this.clickTimeout?console.log(`⏸️ Debounced - ignoring click on ${s}`):(this.clickTimeout=window.setTimeout(()=>{this.clickTimeout=void 0},300),console.log(`✅ Processing click on ${s}`),this.toggleTimeSlot(e,i))}async toggleTimeSlot(t,e){if(!this.hass||!this.config.entity)return;const i=`${t}:${String(e).padStart(2,"0")}`;try{console.log(`🎯 Toggle slot: ${i}`),await this.hass.callService("timer_24h","toggle_slot",{entity_id:this.config.entity,hour:t,minute:e}),console.log(`✅ Service call completed for ${i}`)}catch(t){console.error(`❌ Failed to toggle time slot ${i}:`,t)}}getEnabled(){const t=this.getEntityState();return!1!==t?.attributes.enabled}shouldShowEnableSwitch(){return!0===this.config.show_enable_switch}async handleEnableToggle(t){t.stopPropagation();const e=t.target.checked;if(this.hass&&this.config.entity)try{console.log(`🔄 Setting enabled to: ${e}`),await this.hass.callService("timer_24h","set_enabled",{entity_id:this.config.entity,enabled:e}),console.log(`✅ Enabled state updated to: ${e}`)}catch(t){console.error("❌ Failed to set enabled state:",t)}}handleCenterClick(){this.getControlledEntitiesStatus().total>0&&(this.showEntitiesDialog=!0)}closeEntitiesDialog(){this.showEntitiesDialog=!1}getEntityFriendlyName(t){const e=this.hass.states[t];return e?.attributes.friendly_name||t}getEntityIcon(t){const e=this.hass.states[t];if(e?.attributes.icon)return e.attributes.icon;return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",fan:"mdi:fan",climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",input_boolean:"mdi:toggle-switch-outline"}[t.split(".")[0]]||"mdi:toggle-switch"}renderEntitiesDialog(){if(!this.showEntitiesDialog)return q``;const t=this.getControlledEntitiesStatus();return q`
      <div class="dialog-overlay" @click="${this.closeEntitiesDialog}">
        <div class="dialog-content" @click="${t=>t.stopPropagation()}">
          <div class="dialog-header">
            <span class="dialog-title">${this.localize("entities_list")}</span>
            <button class="dialog-close" @click="${this.closeEntitiesDialog}">×</button>
          </div>
          <div class="dialog-body">
            ${0===t.entities.length?q`
              <div class="no-entities">${this.localize("no_entities")}</div>
            `:q`
              <ul class="entities-list">
                ${t.entities.map(t=>{const e=this.hass.states[t],i="on"===e?.state;return q`
                    <li class="entity-item ${i?"on":"off"}">
                      <ha-icon icon="${this.getEntityIcon(t)}"></ha-icon>
                      <span class="entity-name">${this.getEntityFriendlyName(t)}</span>
                      <span class="entity-state ${i?"on":"off"}">
                        ${i?this.localize("on"):this.localize("off")}
                      </span>
                    </li>
                  `})}
              </ul>
            `}
          </div>
        </div>
      </div>
    `}renderEnableSwitch(){const t=this.getEnabled();return q`
      <div class="enable-switch-container">
        <label class="enable-switch-label">
          <span class="enable-switch-text">
            ${this.localize("enable_timer")}
          </span>
          <input
            type="checkbox"
            class="enable-switch"
            .checked="${t}"
            @change="${this.handleEnableToggle}"
          />
          <span class="slider"></span>
        </label>
      </div>
    `}createSectorPath(t,e,i,s,o,n){const r=(360*t/e-90)*(Math.PI/180),a=(360*(t+1)/e-90)*(Math.PI/180),l=o+i*Math.cos(r),c=n+i*Math.sin(r),h=o+s*Math.cos(r),d=n+s*Math.sin(r),p=o+s*Math.cos(a),g=n+s*Math.sin(a),u=o+i*Math.cos(a),f=n+i*Math.sin(a),m=a-r<=Math.PI?0:1;return`M ${l} ${c} L ${h} ${d} A ${s} ${s} 0 ${m} 1 ${p} ${g} L ${u} ${f} A ${i} ${i} 0 ${m} 0 ${l} ${c}`}getTextPosition(t,e,i,s,o){const n=(360*(t+.5)/e-90)*(Math.PI/180);return{x:s+i*Math.cos(n),y:o+i*Math.sin(n)}}getSectorCenterAngleDeg(t,e){return(t+.5)*(360/e)-90}getUprightTextRotationDeg(t){return t>90||t<-90?t+180:t}getTimeLabel(t,e){return`${t.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}renderDividingLines(){const t=[];for(let e=0;e<24;e++){const i=(360*e/24-90)*(Math.PI/180),s=200+50*Math.cos(i),o=200+50*Math.sin(i),n=200+180*Math.cos(i),r=200+180*Math.sin(i);t.push(q`
        <line 
          x1="${s}" 
          y1="${o}" 
          x2="${n}" 
          y2="${r}" 
          stroke="#e5e7eb" 
          stroke-width="1">
        </line>
      `)}return t}renderOuterSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const s=this.createSectorPath(i,24,50,180,200,200),o=this.getTextPosition(i,24,115,200,200),n=this.getSectorCenterAngleDeg(i,24),r=this.getUprightTextRotationDeg(n),a=o.y+3,l=e.find(t=>t.hour===i&&0===t.minute),c=l?.isActive||!1,h=this.currentTime.getHours()===i&&this.currentTime.getMinutes()<30;t.push(q`
        <path 
          d="${s}" 
          fill="${c?"#10b981":"#ffffff"}"
          stroke="${h?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${h?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,0)}">
        </path>
        <text 
          x="${o.x}" 
          y="${a}" 
          text-anchor="middle" 
          font-size="11" 
          font-weight="bold"
          transform="rotate(${r} ${o.x} ${a})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${c?"#ffffff":"#374151"}">
          ${this.getTimeLabel(i,0)}
        </text>
      `)}return t}renderInnerSectors(){const t=[],e=this.getTimeSlots();for(let i=0;i<24;i++){const s=this.createSectorPath(i,24,0,50,200,200),o=this.getTextPosition(i,24,25,200,200),n=this.getSectorCenterAngleDeg(i,24),r=this.getUprightTextRotationDeg(n),a=o.y+2,l=e.find(t=>t.hour===i&&30===t.minute),c=l?.isActive||!1,h=this.currentTime.getHours()===i&&this.currentTime.getMinutes()>=30;t.push(q`
        <path 
          d="${s}" 
          fill="${c?"#10b981":"#f8f9fa"}"
          stroke="${h?"#ff6b6b":"#e5e7eb"}"
          stroke-width="${h?"3":"1"}"
          style="cursor: pointer; transition: all 0.2s;"
          @click="${()=>this.toggleTimeSlot(i,30)}">
        </path>
        <text 
          x="${o.x}" 
          y="${a}" 
          text-anchor="middle" 
          font-size="9" 
          font-weight="bold"
          transform="rotate(${r} ${o.x} ${a})"
          style="pointer-events: none; user-select: none; font-weight: bold;"
          fill="${c?"#ffffff":"#6b7280"}">
          ${this.getTimeLabel(i,30)}
        </text>
      `)}return t}render(){if(!this.hass||!this.config.entity)return q`
        <ha-card>
          <div class="warning">
            ${this.localize("configure_entity")}
          </div>
        </ha-card>
      `;if(!this.getEntityState())return q`
        <ha-card>
          <div class="warning">
            ${this.localize("entity_not_found")} (${this.config.entity})
          </div>
        </ha-card>
      `;const t=this.getHomeStatus(),e=this.getEntityName(),i=this.getTimeSlots(),s=200,o=200,n=180,r=50,a=115;return q`
      <ha-card>
        ${!1!==this.config.show_title?q`
          <div class="header">
            <div class="title">${e}</div>
            <div class="system-status ${t?"active":"inactive"}">
              ${t?this.localize("active"):this.localize("inactive")}
            </div>
          </div>
        `:""}
        
        ${this.shouldShowEnableSwitch()?this.renderEnableSwitch():""}
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Circles -->
            <circle 
              cx="${s}" 
              cy="${o}" 
              r="${n}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            <circle 
              cx="${s}" 
              cy="${o}" 
              r="${a}" 
              fill="none" 
              stroke="#d1d5db" 
              stroke-width="1.5">
            </circle>
            <circle 
              cx="${s}" 
              cy="${o}" 
              r="${r}" 
              fill="none" 
              stroke="#e5e7eb" 
              stroke-width="2">
            </circle>
            
            <!-- Dividing lines -->
            ${Array.from({length:24},(t,e)=>{const i=(360*e/24-90)*(Math.PI/180),a=s+r*Math.cos(i),l=o+r*Math.sin(i),c=s+n*Math.cos(i),h=o+n*Math.sin(i);return F`
                <line 
                  x1="${a}" 
                  y1="${l}" 
                  x2="${c}" 
                  y2="${h}" 
                  stroke="#e5e7eb" 
                  stroke-width="1">
                </line>
              `})}
            
            <!-- Center indicator for controlled entities -->
            ${(()=>{const t=this.getControlledEntitiesStatus();let e="#9ca3af",i="—";return this.getHomeStatus()?0===t.total?(e="#d1d5db",i="—"):0===t.active?(e="#ef4444",i=this.localize("off")):t.active===t.total?(e="#10b981",i=this.localize("on")):(e="#f59e0b",i=`${t.active}/${t.total}`):(e="#9ca3af",i="—"),F`
                <!-- Full inner circle indicator - clickable when entities exist -->
                <circle 
                  cx="${s}" 
                  cy="${o}" 
                  r="${r}" 
                  fill="${e}"
                  style="cursor: ${t.total>0?"pointer":"default"}; transition: opacity 0.2s;"
                  @click="${()=>this.handleCenterClick()}">
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
                  ${i}
                </text>
                
                <!-- Entity count (small text below) -->
                ${t.total>0?F`
                  <text 
                    x="${s}" 
                    y="${220}" 
                    text-anchor="middle" 
                    font-size="8" 
                    fill="#ffffff"
                    opacity="0.9"
                    style="pointer-events: none; user-select: none;">
                    ${t.total} ${1===t.total?this.localize("entity"):this.localize("entities")}
                  </text>
                `:""}
              `})()}
            
            <!-- Outer sectors (full hours) -->
            ${Array.from({length:24},(t,e)=>{const r=e,l=i.find(t=>t.hour===r&&0===t.minute),c=l?.isActive||!1,h=this.currentTime.getHours()===r&&this.currentTime.getMinutes()<30,d=this.createSectorPath(r,24,a,n,s,o),p=this.getTextPosition(r,24,147.5,s,o),g=this.getSectorCenterAngleDeg(r,24),u=this.getUprightTextRotationDeg(g),f=p.y+3;return F`
                <path 
                  d="${d}" 
                  fill="${c?"#10b981":"#ffffff"}"
                  stroke="${h?"#ff6b6b":"#e5e7eb"}"
                  stroke-width="${h?"3":"1"}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${t=>{console.log(`🎯 Outer sector clicked: index=${e}, hour=${r}`),this.handleSlotClick(t,r,0)}}">
                </path>
                <text 
                  x="${p.x}" 
                  y="${f}" 
                  text-anchor="middle" 
                  font-size="11" 
                  font-weight="bold"
                  transform="rotate(${u} ${p.x} ${f})"
                  style="pointer-events: none; user-select: none;"
                  fill="${c?"#ffffff":"#374151"}">
                  ${this.getTimeLabel(r,0)}
                </text>
              `})}
            
            <!-- Inner sectors (half hours) -->
            ${Array.from({length:24},(t,e)=>{const n=e,l=i.find(t=>t.hour===n&&30===t.minute),c=l?.isActive||!1,h=this.currentTime.getHours()===n&&this.currentTime.getMinutes()>=30,d=this.createSectorPath(n,24,r,a,s,o),p=this.getTextPosition(n,24,82.5,s,o),g=this.getSectorCenterAngleDeg(n,24),u=this.getUprightTextRotationDeg(g),f=p.y+2;return F`
                <path 
                  d="${d}" 
                  fill="${c?"#10b981":"#f8f9fa"}"
                  stroke="${h?"#ff6b6b":"#e5e7eb"}"
                  stroke-width="${h?"3":"1"}"
                  style="cursor: pointer; transition: all 0.2s;"
                  @click="${t=>{console.log(`🎯 Inner sector clicked: index=${e}, hour=${n}`),this.handleSlotClick(t,n,30)}}">
                </path>
                <text 
                  x="${p.x}" 
                  y="${f}" 
                  text-anchor="middle" 
                  font-size="9" 
                  font-weight="bold"
                  transform="rotate(${u} ${p.x} ${f})"
                  style="pointer-events: none; user-select: none;"
                  fill="${c?"#ffffff":"#6b7280"}">
                  ${this.getTimeLabel(n,30)}
                </text>
              `})}
          </svg>
        </div>
        ${this.renderEntitiesDialog()}
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
      
      /* Enable Switch Styles */
      .enable-switch-container {
        padding: 8px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid var(--divider-color, #e5e7eb);
      }
      
      .enable-switch-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
      }
      
      .enable-switch-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--primary-text-color, #212121);
      }
      
      .enable-switch {
        position: relative;
        appearance: none;
        width: 44px;
        height: 24px;
        background-color: var(--disabled-color, #bbb);
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.3s;
        outline: none;
      }
      
      .enable-switch:checked {
        background-color: var(--primary-color, #03a9f4);
      }
      
      .enable-switch::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: white;
        top: 3px;
        left: 3px;
        transition: transform 0.3s;
      }
      
      .enable-switch:checked::before {
        transform: translateX(20px);
      }
      
      .enable-switch:focus {
        box-shadow: 0 0 0 2px var(--primary-color-alpha, rgba(3, 169, 244, 0.2));
      }
      
      /* Dialog Styles */
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
      }
      
      .dialog-content {
        background: var(--card-background-color, white);
        border-radius: 12px;
        width: 320px;
        max-width: 90vw;
        max-height: 70vh;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
      
      .entity-item.off {
        background: var(--secondary-background-color, #f5f5f5);
      }
      
      .entity-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color, #666);
      }
      
      .entity-item.on ha-icon {
        color: #10b981;
      }
      
      .entity-name {
        flex: 1;
        color: var(--primary-text-color, #212121);
        font-size: 0.85rem;
      }
      
      .entity-state {
        font-size: 0.7rem;
        padding: 3px 8px;
        border-radius: 10px;
        font-weight: 600;
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
    `}};t([gt({attribute:!1})],ft.prototype,"hass",void 0),t([ut()],ft.prototype,"config",void 0),t([ut()],ft.prototype,"currentTime",void 0),t([ut()],ft.prototype,"showEntitiesDialog",void 0),ft=t([ht("timer-24h-card")],ft),console.info("%c  TIMER-24H-CARD  %c  Version 5.7.0-beta.2 - ENTITIES DIALOG  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"timer-24h-card",name:"Timer 24H Card",description:"24 Hour Timer Card with automatic entity control",preview:!0,documentationURL:"https://github.com/davidss20/home-assistant-24h-timer-integration"});let mt=class extends lt{constructor(){super(...arguments),this.config={entity:"",show_title:!0}}setConfig(t){this.config={...t}}render(){if(!this.hass)return q`<div class="loading">Loading...</div>`;const t=Object.keys(this.hass.states).filter(t=>{const e=this.hass.states[t];return t.startsWith("sensor.")&&void 0!==e?.attributes?.time_slots}).sort();return q`
      <div class="card-config">
        <div class="config-header">
          <h2>Timer 24H Card Configuration</h2>
          <p>Select a timer entity created by the Timer 24H integration</p>
        </div>

        ${0===t.length?q`
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
            ${t.map(t=>{const e=this.hass.states[t].attributes.friendly_name||t;return q`
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

        ${!1!==this.config.show_title?q`
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

        ${this.config.entity&&this.hass.states[this.config.entity]?q`
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
    `}handleEntityChange(t){const e=t.target;this.config={...this.config,entity:e.value},this.configChanged()}handleShowTitleChange(t){const e=t.target;this.config={...this.config,show_title:e.checked},this.configChanged()}handleCustomTitleChange(t){const e=t.target;this.config={...this.config,custom_title:e.value||void 0},this.configChanged()}handleShowEnableSwitchChange(t){const e=t.target;this.config={...this.config,show_enable_switch:e.checked},this.configChanged()}configChanged(){const t=new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0});this.dispatchEvent(t)}static get styles(){return r`
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
    `}};t([gt({attribute:!1})],mt.prototype,"hass",void 0),t([ut()],mt.prototype,"config",void 0),mt=t([ht("timer-24h-card-editor")],mt);var $t=Object.freeze({__proto__:null,get Timer24HCardEditor(){return mt}});export{ft as Timer24HCard};
