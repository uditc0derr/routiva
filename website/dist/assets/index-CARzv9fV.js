function vd(e,n){for(var t=0;t<n.length;t++){const r=n[t];if(typeof r!="string"&&!Array.isArray(r)){for(const s in r)if(s!=="default"&&!(s in e)){const o=Object.getOwnPropertyDescriptor(r,s);o&&Object.defineProperty(e,s,o.get?o:{enumerable:!0,get:()=>r[s]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();function wd(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ml={exports:{}},xs={},Il={exports:{}},_={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pr=Symbol.for("react.element"),xd=Symbol.for("react.portal"),kd=Symbol.for("react.fragment"),jd=Symbol.for("react.strict_mode"),Sd=Symbol.for("react.profiler"),Ed=Symbol.for("react.provider"),Td=Symbol.for("react.context"),Cd=Symbol.for("react.forward_ref"),Nd=Symbol.for("react.suspense"),bd=Symbol.for("react.memo"),Ad=Symbol.for("react.lazy"),mi=Symbol.iterator;function Rd(e){return e===null||typeof e!="object"?null:(e=mi&&e[mi]||e["@@iterator"],typeof e=="function"?e:null)}var Ll={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},zl=Object.assign,Dl={};function yt(e,n,t){this.props=e,this.context=n,this.refs=Dl,this.updater=t||Ll}yt.prototype.isReactComponent={};yt.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};yt.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Fl(){}Fl.prototype=yt.prototype;function va(e,n,t){this.props=e,this.context=n,this.refs=Dl,this.updater=t||Ll}var wa=va.prototype=new Fl;wa.constructor=va;zl(wa,yt.prototype);wa.isPureReactComponent=!0;var gi=Array.isArray,Hl=Object.prototype.hasOwnProperty,xa={current:null},Ul={key:!0,ref:!0,__self:!0,__source:!0};function $l(e,n,t){var r,s={},o=null,a=null;if(n!=null)for(r in n.ref!==void 0&&(a=n.ref),n.key!==void 0&&(o=""+n.key),n)Hl.call(n,r)&&!Ul.hasOwnProperty(r)&&(s[r]=n[r]);var i=arguments.length-2;if(i===1)s.children=t;else if(1<i){for(var u=Array(i),c=0;c<i;c++)u[c]=arguments[c+2];s.children=u}if(e&&e.defaultProps)for(r in i=e.defaultProps,i)s[r]===void 0&&(s[r]=i[r]);return{$$typeof:pr,type:e,key:o,ref:a,props:s,_owner:xa.current}}function qd(e,n){return{$$typeof:pr,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function ka(e){return typeof e=="object"&&e!==null&&e.$$typeof===pr}function Pd(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var yi=/\/+/g;function $s(e,n){return typeof e=="object"&&e!==null&&e.key!=null?Pd(""+e.key):n.toString(36)}function Ir(e,n,t,r,s){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(o){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case pr:case xd:a=!0}}if(a)return a=e,s=s(a),e=r===""?"."+$s(a,0):r,gi(s)?(t="",e!=null&&(t=e.replace(yi,"$&/")+"/"),Ir(s,n,t,"",function(c){return c})):s!=null&&(ka(s)&&(s=qd(s,t+(!s.key||a&&a.key===s.key?"":(""+s.key).replace(yi,"$&/")+"/")+e)),n.push(s)),1;if(a=0,r=r===""?".":r+":",gi(e))for(var i=0;i<e.length;i++){o=e[i];var u=r+$s(o,i);a+=Ir(o,n,t,u,s)}else if(u=Rd(e),typeof u=="function")for(e=u.call(e),i=0;!(o=e.next()).done;)o=o.value,u=r+$s(o,i++),a+=Ir(o,n,t,u,s);else if(o==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return a}function wr(e,n,t){if(e==null)return e;var r=[],s=0;return Ir(e,r,"","",function(o){return n.call(t,o,s++)}),r}function _d(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var ce={current:null},Lr={transition:null},Od={ReactCurrentDispatcher:ce,ReactCurrentBatchConfig:Lr,ReactCurrentOwner:xa};function Bl(){throw Error("act(...) is not supported in production builds of React.")}_.Children={map:wr,forEach:function(e,n,t){wr(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return wr(e,function(){n++}),n},toArray:function(e){return wr(e,function(n){return n})||[]},only:function(e){if(!ka(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};_.Component=yt;_.Fragment=kd;_.Profiler=Sd;_.PureComponent=va;_.StrictMode=jd;_.Suspense=Nd;_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Od;_.act=Bl;_.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=zl({},e.props),s=e.key,o=e.ref,a=e._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,a=xa.current),n.key!==void 0&&(s=""+n.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(u in n)Hl.call(n,u)&&!Ul.hasOwnProperty(u)&&(r[u]=n[u]===void 0&&i!==void 0?i[u]:n[u])}var u=arguments.length-2;if(u===1)r.children=t;else if(1<u){i=Array(u);for(var c=0;c<u;c++)i[c]=arguments[c+2];r.children=i}return{$$typeof:pr,type:e.type,key:s,ref:o,props:r,_owner:a}};_.createContext=function(e){return e={$$typeof:Td,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Ed,_context:e},e.Consumer=e};_.createElement=$l;_.createFactory=function(e){var n=$l.bind(null,e);return n.type=e,n};_.createRef=function(){return{current:null}};_.forwardRef=function(e){return{$$typeof:Cd,render:e}};_.isValidElement=ka;_.lazy=function(e){return{$$typeof:Ad,_payload:{_status:-1,_result:e},_init:_d}};_.memo=function(e,n){return{$$typeof:bd,type:e,compare:n===void 0?null:n}};_.startTransition=function(e){var n=Lr.transition;Lr.transition={};try{e()}finally{Lr.transition=n}};_.unstable_act=Bl;_.useCallback=function(e,n){return ce.current.useCallback(e,n)};_.useContext=function(e){return ce.current.useContext(e)};_.useDebugValue=function(){};_.useDeferredValue=function(e){return ce.current.useDeferredValue(e)};_.useEffect=function(e,n){return ce.current.useEffect(e,n)};_.useId=function(){return ce.current.useId()};_.useImperativeHandle=function(e,n,t){return ce.current.useImperativeHandle(e,n,t)};_.useInsertionEffect=function(e,n){return ce.current.useInsertionEffect(e,n)};_.useLayoutEffect=function(e,n){return ce.current.useLayoutEffect(e,n)};_.useMemo=function(e,n){return ce.current.useMemo(e,n)};_.useReducer=function(e,n,t){return ce.current.useReducer(e,n,t)};_.useRef=function(e){return ce.current.useRef(e)};_.useState=function(e){return ce.current.useState(e)};_.useSyncExternalStore=function(e,n,t){return ce.current.useSyncExternalStore(e,n,t)};_.useTransition=function(){return ce.current.useTransition()};_.version="18.3.1";Il.exports=_;var k=Il.exports;const Wl=wd(k),Md=vd({__proto__:null,default:Wl},[k]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Id=k,Ld=Symbol.for("react.element"),zd=Symbol.for("react.fragment"),Dd=Object.prototype.hasOwnProperty,Fd=Id.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hd={key:!0,ref:!0,__self:!0,__source:!0};function Vl(e,n,t){var r,s={},o=null,a=null;t!==void 0&&(o=""+t),n.key!==void 0&&(o=""+n.key),n.ref!==void 0&&(a=n.ref);for(r in n)Dd.call(n,r)&&!Hd.hasOwnProperty(r)&&(s[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)s[r]===void 0&&(s[r]=n[r]);return{$$typeof:Ld,type:e,key:o,ref:a,props:s,_owner:Fd.current}}xs.Fragment=zd;xs.jsx=Vl;xs.jsxs=Vl;Ml.exports=xs;var l=Ml.exports,Gl={exports:{}},je={},Ql={exports:{}},Jl={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(C,R){var P=C.length;C.push(R);e:for(;0<P;){var G=P-1>>>1,Y=C[G];if(0<s(Y,R))C[G]=R,C[P]=Y,P=G;else break e}}function t(C){return C.length===0?null:C[0]}function r(C){if(C.length===0)return null;var R=C[0],P=C.pop();if(P!==R){C[0]=P;e:for(var G=0,Y=C.length,yr=Y>>>1;G<yr;){var En=2*(G+1)-1,Us=C[En],Tn=En+1,vr=C[Tn];if(0>s(Us,P))Tn<Y&&0>s(vr,Us)?(C[G]=vr,C[Tn]=P,G=Tn):(C[G]=Us,C[En]=P,G=En);else if(Tn<Y&&0>s(vr,P))C[G]=vr,C[Tn]=P,G=Tn;else break e}}return R}function s(C,R){var P=C.sortIndex-R.sortIndex;return P!==0?P:C.id-R.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var a=Date,i=a.now();e.unstable_now=function(){return a.now()-i}}var u=[],c=[],g=1,d=null,m=3,v=!1,w=!1,x=!1,S=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,p=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(C){for(var R=t(c);R!==null;){if(R.callback===null)r(c);else if(R.startTime<=C)r(c),R.sortIndex=R.expirationTime,n(u,R);else break;R=t(c)}}function y(C){if(x=!1,f(C),!w)if(t(u)!==null)w=!0,Fs(E);else{var R=t(c);R!==null&&Hs(y,R.startTime-C)}}function E(C,R){w=!1,x&&(x=!1,h(A),A=-1),v=!0;var P=m;try{for(f(R),d=t(u);d!==null&&(!(d.expirationTime>R)||C&&!ye());){var G=d.callback;if(typeof G=="function"){d.callback=null,m=d.priorityLevel;var Y=G(d.expirationTime<=R);R=e.unstable_now(),typeof Y=="function"?d.callback=Y:d===t(u)&&r(u),f(R)}else r(u);d=t(u)}if(d!==null)var yr=!0;else{var En=t(c);En!==null&&Hs(y,En.startTime-R),yr=!1}return yr}finally{d=null,m=P,v=!1}}var N=!1,b=null,A=-1,F=5,q=-1;function ye(){return!(e.unstable_now()-q<F)}function jt(){if(b!==null){var C=e.unstable_now();q=C;var R=!0;try{R=b(!0,C)}finally{R?St():(N=!1,b=null)}}else N=!1}var St;if(typeof p=="function")St=function(){p(jt)};else if(typeof MessageChannel<"u"){var fi=new MessageChannel,yd=fi.port2;fi.port1.onmessage=jt,St=function(){yd.postMessage(null)}}else St=function(){S(jt,0)};function Fs(C){b=C,N||(N=!0,St())}function Hs(C,R){A=S(function(){C(e.unstable_now())},R)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(C){C.callback=null},e.unstable_continueExecution=function(){w||v||(w=!0,Fs(E))},e.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):F=0<C?Math.floor(1e3/C):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return t(u)},e.unstable_next=function(C){switch(m){case 1:case 2:case 3:var R=3;break;default:R=m}var P=m;m=R;try{return C()}finally{m=P}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(C,R){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var P=m;m=C;try{return R()}finally{m=P}},e.unstable_scheduleCallback=function(C,R,P){var G=e.unstable_now();switch(typeof P=="object"&&P!==null?(P=P.delay,P=typeof P=="number"&&0<P?G+P:G):P=G,C){case 1:var Y=-1;break;case 2:Y=250;break;case 5:Y=1073741823;break;case 4:Y=1e4;break;default:Y=5e3}return Y=P+Y,C={id:g++,callback:R,priorityLevel:C,startTime:P,expirationTime:Y,sortIndex:-1},P>G?(C.sortIndex=P,n(c,C),t(u)===null&&C===t(c)&&(x?(h(A),A=-1):x=!0,Hs(y,P-G))):(C.sortIndex=Y,n(u,C),w||v||(w=!0,Fs(E))),C},e.unstable_shouldYield=ye,e.unstable_wrapCallback=function(C){var R=m;return function(){var P=m;m=R;try{return C.apply(this,arguments)}finally{m=P}}}})(Jl);Ql.exports=Jl;var Ud=Ql.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $d=k,ke=Ud;function j(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Kl=new Set,Gt={};function Fn(e,n){ut(e,n),ut(e+"Capture",n)}function ut(e,n){for(Gt[e]=n,e=0;e<n.length;e++)Kl.add(n[e])}var Qe=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),wo=Object.prototype.hasOwnProperty,Bd=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,vi={},wi={};function Wd(e){return wo.call(wi,e)?!0:wo.call(vi,e)?!1:Bd.test(e)?wi[e]=!0:(vi[e]=!0,!1)}function Vd(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Gd(e,n,t,r){if(n===null||typeof n>"u"||Vd(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function de(e,n,t,r,s,o,a){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=s,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=o,this.removeEmptyString=a}var re={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){re[e]=new de(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];re[n]=new de(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){re[e]=new de(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){re[e]=new de(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){re[e]=new de(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){re[e]=new de(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){re[e]=new de(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){re[e]=new de(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){re[e]=new de(e,5,!1,e.toLowerCase(),null,!1,!1)});var ja=/[\-:]([a-z])/g;function Sa(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace(ja,Sa);re[n]=new de(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace(ja,Sa);re[n]=new de(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace(ja,Sa);re[n]=new de(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){re[e]=new de(e,1,!1,e.toLowerCase(),null,!1,!1)});re.xlinkHref=new de("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){re[e]=new de(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ea(e,n,t,r){var s=re.hasOwnProperty(n)?re[n]:null;(s!==null?s.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Gd(n,t,s,r)&&(t=null),r||s===null?Wd(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):s.mustUseProperty?e[s.propertyName]=t===null?s.type===3?!1:"":t:(n=s.attributeName,r=s.attributeNamespace,t===null?e.removeAttribute(n):(s=s.type,t=s===3||s===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var Ye=$d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,xr=Symbol.for("react.element"),Bn=Symbol.for("react.portal"),Wn=Symbol.for("react.fragment"),Ta=Symbol.for("react.strict_mode"),xo=Symbol.for("react.profiler"),Xl=Symbol.for("react.provider"),Yl=Symbol.for("react.context"),Ca=Symbol.for("react.forward_ref"),ko=Symbol.for("react.suspense"),jo=Symbol.for("react.suspense_list"),Na=Symbol.for("react.memo"),tn=Symbol.for("react.lazy"),Zl=Symbol.for("react.offscreen"),xi=Symbol.iterator;function Et(e){return e===null||typeof e!="object"?null:(e=xi&&e[xi]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,Bs;function Pt(e){if(Bs===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);Bs=n&&n[1]||""}return`
`+Bs+e}var Ws=!1;function Vs(e,n){if(!e||Ws)return"";Ws=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(c){var r=c}Reflect.construct(e,[],n)}else{try{n.call()}catch(c){r=c}e.call(n.prototype)}else{try{throw Error()}catch(c){r=c}e()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var s=c.stack.split(`
`),o=r.stack.split(`
`),a=s.length-1,i=o.length-1;1<=a&&0<=i&&s[a]!==o[i];)i--;for(;1<=a&&0<=i;a--,i--)if(s[a]!==o[i]){if(a!==1||i!==1)do if(a--,i--,0>i||s[a]!==o[i]){var u=`
`+s[a].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=a&&0<=i);break}}}finally{Ws=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?Pt(e):""}function Qd(e){switch(e.tag){case 5:return Pt(e.type);case 16:return Pt("Lazy");case 13:return Pt("Suspense");case 19:return Pt("SuspenseList");case 0:case 2:case 15:return e=Vs(e.type,!1),e;case 11:return e=Vs(e.type.render,!1),e;case 1:return e=Vs(e.type,!0),e;default:return""}}function So(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Wn:return"Fragment";case Bn:return"Portal";case xo:return"Profiler";case Ta:return"StrictMode";case ko:return"Suspense";case jo:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Yl:return(e.displayName||"Context")+".Consumer";case Xl:return(e._context.displayName||"Context")+".Provider";case Ca:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Na:return n=e.displayName||null,n!==null?n:So(e.type)||"Memo";case tn:n=e._payload,e=e._init;try{return So(e(n))}catch{}}return null}function Jd(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return So(n);case 8:return n===Ta?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function wn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function eu(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Kd(e){var n=eu(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var s=t.get,o=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return s.call(this)},set:function(a){r=""+a,o.call(this,a)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function kr(e){e._valueTracker||(e._valueTracker=Kd(e))}function nu(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=eu(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function Qr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Eo(e,n){var t=n.checked;return B({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function ki(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=wn(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function tu(e,n){n=n.checked,n!=null&&Ea(e,"checked",n,!1)}function To(e,n){tu(e,n);var t=wn(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?Co(e,n.type,t):n.hasOwnProperty("defaultValue")&&Co(e,n.type,wn(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function ji(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function Co(e,n,t){(n!=="number"||Qr(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var _t=Array.isArray;function tt(e,n,t,r){if(e=e.options,n){n={};for(var s=0;s<t.length;s++)n["$"+t[s]]=!0;for(t=0;t<e.length;t++)s=n.hasOwnProperty("$"+e[t].value),e[t].selected!==s&&(e[t].selected=s),s&&r&&(e[t].defaultSelected=!0)}else{for(t=""+wn(t),n=null,s=0;s<e.length;s++){if(e[s].value===t){e[s].selected=!0,r&&(e[s].defaultSelected=!0);return}n!==null||e[s].disabled||(n=e[s])}n!==null&&(n.selected=!0)}}function No(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(j(91));return B({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Si(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(j(92));if(_t(t)){if(1<t.length)throw Error(j(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:wn(t)}}function ru(e,n){var t=wn(n.value),r=wn(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function Ei(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function su(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function bo(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?su(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var jr,ou=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,s){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,s)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(jr=jr||document.createElement("div"),jr.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=jr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function Qt(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var zt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Xd=["Webkit","ms","Moz","O"];Object.keys(zt).forEach(function(e){Xd.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),zt[n]=zt[e]})});function au(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||zt.hasOwnProperty(e)&&zt[e]?(""+n).trim():n+"px"}function iu(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,s=au(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,s):e[t]=s}}var Yd=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ao(e,n){if(n){if(Yd[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(j(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(j(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(j(61))}if(n.style!=null&&typeof n.style!="object")throw Error(j(62))}}function Ro(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var qo=null;function ba(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Po=null,rt=null,st=null;function Ti(e){if(e=mr(e)){if(typeof Po!="function")throw Error(j(280));var n=e.stateNode;n&&(n=Ts(n),Po(e.stateNode,e.type,n))}}function lu(e){rt?st?st.push(e):st=[e]:rt=e}function uu(){if(rt){var e=rt,n=st;if(st=rt=null,Ti(e),n)for(e=0;e<n.length;e++)Ti(n[e])}}function cu(e,n){return e(n)}function du(){}var Gs=!1;function pu(e,n,t){if(Gs)return e(n,t);Gs=!0;try{return cu(e,n,t)}finally{Gs=!1,(rt!==null||st!==null)&&(du(),uu())}}function Jt(e,n){var t=e.stateNode;if(t===null)return null;var r=Ts(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(j(231,n,typeof t));return t}var _o=!1;if(Qe)try{var Tt={};Object.defineProperty(Tt,"passive",{get:function(){_o=!0}}),window.addEventListener("test",Tt,Tt),window.removeEventListener("test",Tt,Tt)}catch{_o=!1}function Zd(e,n,t,r,s,o,a,i,u){var c=Array.prototype.slice.call(arguments,3);try{n.apply(t,c)}catch(g){this.onError(g)}}var Dt=!1,Jr=null,Kr=!1,Oo=null,ep={onError:function(e){Dt=!0,Jr=e}};function np(e,n,t,r,s,o,a,i,u){Dt=!1,Jr=null,Zd.apply(ep,arguments)}function tp(e,n,t,r,s,o,a,i,u){if(np.apply(this,arguments),Dt){if(Dt){var c=Jr;Dt=!1,Jr=null}else throw Error(j(198));Kr||(Kr=!0,Oo=c)}}function Hn(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function hu(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function Ci(e){if(Hn(e)!==e)throw Error(j(188))}function rp(e){var n=e.alternate;if(!n){if(n=Hn(e),n===null)throw Error(j(188));return n!==e?null:e}for(var t=e,r=n;;){var s=t.return;if(s===null)break;var o=s.alternate;if(o===null){if(r=s.return,r!==null){t=r;continue}break}if(s.child===o.child){for(o=s.child;o;){if(o===t)return Ci(s),e;if(o===r)return Ci(s),n;o=o.sibling}throw Error(j(188))}if(t.return!==r.return)t=s,r=o;else{for(var a=!1,i=s.child;i;){if(i===t){a=!0,t=s,r=o;break}if(i===r){a=!0,r=s,t=o;break}i=i.sibling}if(!a){for(i=o.child;i;){if(i===t){a=!0,t=o,r=s;break}if(i===r){a=!0,r=o,t=s;break}i=i.sibling}if(!a)throw Error(j(189))}}if(t.alternate!==r)throw Error(j(190))}if(t.tag!==3)throw Error(j(188));return t.stateNode.current===t?e:n}function fu(e){return e=rp(e),e!==null?mu(e):null}function mu(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=mu(e);if(n!==null)return n;e=e.sibling}return null}var gu=ke.unstable_scheduleCallback,Ni=ke.unstable_cancelCallback,sp=ke.unstable_shouldYield,op=ke.unstable_requestPaint,Q=ke.unstable_now,ap=ke.unstable_getCurrentPriorityLevel,Aa=ke.unstable_ImmediatePriority,yu=ke.unstable_UserBlockingPriority,Xr=ke.unstable_NormalPriority,ip=ke.unstable_LowPriority,vu=ke.unstable_IdlePriority,ks=null,He=null;function lp(e){if(He&&typeof He.onCommitFiberRoot=="function")try{He.onCommitFiberRoot(ks,e,void 0,(e.current.flags&128)===128)}catch{}}var Me=Math.clz32?Math.clz32:dp,up=Math.log,cp=Math.LN2;function dp(e){return e>>>=0,e===0?32:31-(up(e)/cp|0)|0}var Sr=64,Er=4194304;function Ot(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Yr(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,s=e.suspendedLanes,o=e.pingedLanes,a=t&268435455;if(a!==0){var i=a&~s;i!==0?r=Ot(i):(o&=a,o!==0&&(r=Ot(o)))}else a=t&~s,a!==0?r=Ot(a):o!==0&&(r=Ot(o));if(r===0)return 0;if(n!==0&&n!==r&&!(n&s)&&(s=r&-r,o=n&-n,s>=o||s===16&&(o&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-Me(n),s=1<<t,r|=e[t],n&=~s;return r}function pp(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function hp(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,s=e.expirationTimes,o=e.pendingLanes;0<o;){var a=31-Me(o),i=1<<a,u=s[a];u===-1?(!(i&t)||i&r)&&(s[a]=pp(i,n)):u<=n&&(e.expiredLanes|=i),o&=~i}}function Mo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function wu(){var e=Sr;return Sr<<=1,!(Sr&4194240)&&(Sr=64),e}function Qs(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function hr(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-Me(n),e[n]=t}function fp(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var s=31-Me(t),o=1<<s;n[s]=0,r[s]=-1,e[s]=-1,t&=~o}}function Ra(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-Me(t),s=1<<r;s&n|e[r]&n&&(e[r]|=n),t&=~s}}var M=0;function xu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var ku,qa,ju,Su,Eu,Io=!1,Tr=[],cn=null,dn=null,pn=null,Kt=new Map,Xt=new Map,sn=[],mp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function bi(e,n){switch(e){case"focusin":case"focusout":cn=null;break;case"dragenter":case"dragleave":dn=null;break;case"mouseover":case"mouseout":pn=null;break;case"pointerover":case"pointerout":Kt.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Xt.delete(n.pointerId)}}function Ct(e,n,t,r,s,o){return e===null||e.nativeEvent!==o?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:o,targetContainers:[s]},n!==null&&(n=mr(n),n!==null&&qa(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,s!==null&&n.indexOf(s)===-1&&n.push(s),e)}function gp(e,n,t,r,s){switch(n){case"focusin":return cn=Ct(cn,e,n,t,r,s),!0;case"dragenter":return dn=Ct(dn,e,n,t,r,s),!0;case"mouseover":return pn=Ct(pn,e,n,t,r,s),!0;case"pointerover":var o=s.pointerId;return Kt.set(o,Ct(Kt.get(o)||null,e,n,t,r,s)),!0;case"gotpointercapture":return o=s.pointerId,Xt.set(o,Ct(Xt.get(o)||null,e,n,t,r,s)),!0}return!1}function Tu(e){var n=An(e.target);if(n!==null){var t=Hn(n);if(t!==null){if(n=t.tag,n===13){if(n=hu(t),n!==null){e.blockedOn=n,Eu(e.priority,function(){ju(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function zr(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=Lo(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);qo=r,t.target.dispatchEvent(r),qo=null}else return n=mr(t),n!==null&&qa(n),e.blockedOn=t,!1;n.shift()}return!0}function Ai(e,n,t){zr(e)&&t.delete(n)}function yp(){Io=!1,cn!==null&&zr(cn)&&(cn=null),dn!==null&&zr(dn)&&(dn=null),pn!==null&&zr(pn)&&(pn=null),Kt.forEach(Ai),Xt.forEach(Ai)}function Nt(e,n){e.blockedOn===n&&(e.blockedOn=null,Io||(Io=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,yp)))}function Yt(e){function n(s){return Nt(s,e)}if(0<Tr.length){Nt(Tr[0],e);for(var t=1;t<Tr.length;t++){var r=Tr[t];r.blockedOn===e&&(r.blockedOn=null)}}for(cn!==null&&Nt(cn,e),dn!==null&&Nt(dn,e),pn!==null&&Nt(pn,e),Kt.forEach(n),Xt.forEach(n),t=0;t<sn.length;t++)r=sn[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<sn.length&&(t=sn[0],t.blockedOn===null);)Tu(t),t.blockedOn===null&&sn.shift()}var ot=Ye.ReactCurrentBatchConfig,Zr=!0;function vp(e,n,t,r){var s=M,o=ot.transition;ot.transition=null;try{M=1,Pa(e,n,t,r)}finally{M=s,ot.transition=o}}function wp(e,n,t,r){var s=M,o=ot.transition;ot.transition=null;try{M=4,Pa(e,n,t,r)}finally{M=s,ot.transition=o}}function Pa(e,n,t,r){if(Zr){var s=Lo(e,n,t,r);if(s===null)so(e,n,r,es,t),bi(e,r);else if(gp(s,e,n,t,r))r.stopPropagation();else if(bi(e,r),n&4&&-1<mp.indexOf(e)){for(;s!==null;){var o=mr(s);if(o!==null&&ku(o),o=Lo(e,n,t,r),o===null&&so(e,n,r,es,t),o===s)break;s=o}s!==null&&r.stopPropagation()}else so(e,n,r,null,t)}}var es=null;function Lo(e,n,t,r){if(es=null,e=ba(r),e=An(e),e!==null)if(n=Hn(e),n===null)e=null;else if(t=n.tag,t===13){if(e=hu(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return es=e,null}function Cu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ap()){case Aa:return 1;case yu:return 4;case Xr:case ip:return 16;case vu:return 536870912;default:return 16}default:return 16}}var an=null,_a=null,Dr=null;function Nu(){if(Dr)return Dr;var e,n=_a,t=n.length,r,s="value"in an?an.value:an.textContent,o=s.length;for(e=0;e<t&&n[e]===s[e];e++);var a=t-e;for(r=1;r<=a&&n[t-r]===s[o-r];r++);return Dr=s.slice(e,1<r?1-r:void 0)}function Fr(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function Cr(){return!0}function Ri(){return!1}function Se(e){function n(t,r,s,o,a){this._reactName=t,this._targetInst=s,this.type=r,this.nativeEvent=o,this.target=a,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(t=e[i],this[i]=t?t(o):o[i]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Cr:Ri,this.isPropagationStopped=Ri,this}return B(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Cr)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Cr)},persist:function(){},isPersistent:Cr}),n}var vt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Oa=Se(vt),fr=B({},vt,{view:0,detail:0}),xp=Se(fr),Js,Ks,bt,js=B({},fr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ma,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==bt&&(bt&&e.type==="mousemove"?(Js=e.screenX-bt.screenX,Ks=e.screenY-bt.screenY):Ks=Js=0,bt=e),Js)},movementY:function(e){return"movementY"in e?e.movementY:Ks}}),qi=Se(js),kp=B({},js,{dataTransfer:0}),jp=Se(kp),Sp=B({},fr,{relatedTarget:0}),Xs=Se(Sp),Ep=B({},vt,{animationName:0,elapsedTime:0,pseudoElement:0}),Tp=Se(Ep),Cp=B({},vt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Np=Se(Cp),bp=B({},vt,{data:0}),Pi=Se(bp),Ap={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Rp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},qp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pp(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=qp[e])?!!n[e]:!1}function Ma(){return Pp}var _p=B({},fr,{key:function(e){if(e.key){var n=Ap[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Fr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Rp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ma,charCode:function(e){return e.type==="keypress"?Fr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Fr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Op=Se(_p),Mp=B({},js,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),_i=Se(Mp),Ip=B({},fr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ma}),Lp=Se(Ip),zp=B({},vt,{propertyName:0,elapsedTime:0,pseudoElement:0}),Dp=Se(zp),Fp=B({},js,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Hp=Se(Fp),Up=[9,13,27,32],Ia=Qe&&"CompositionEvent"in window,Ft=null;Qe&&"documentMode"in document&&(Ft=document.documentMode);var $p=Qe&&"TextEvent"in window&&!Ft,bu=Qe&&(!Ia||Ft&&8<Ft&&11>=Ft),Oi=" ",Mi=!1;function Au(e,n){switch(e){case"keyup":return Up.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ru(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Vn=!1;function Bp(e,n){switch(e){case"compositionend":return Ru(n);case"keypress":return n.which!==32?null:(Mi=!0,Oi);case"textInput":return e=n.data,e===Oi&&Mi?null:e;default:return null}}function Wp(e,n){if(Vn)return e==="compositionend"||!Ia&&Au(e,n)?(e=Nu(),Dr=_a=an=null,Vn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return bu&&n.locale!=="ko"?null:n.data;default:return null}}var Vp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ii(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Vp[e.type]:n==="textarea"}function qu(e,n,t,r){lu(r),n=ns(n,"onChange"),0<n.length&&(t=new Oa("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var Ht=null,Zt=null;function Gp(e){Uu(e,0)}function Ss(e){var n=Jn(e);if(nu(n))return e}function Qp(e,n){if(e==="change")return n}var Pu=!1;if(Qe){var Ys;if(Qe){var Zs="oninput"in document;if(!Zs){var Li=document.createElement("div");Li.setAttribute("oninput","return;"),Zs=typeof Li.oninput=="function"}Ys=Zs}else Ys=!1;Pu=Ys&&(!document.documentMode||9<document.documentMode)}function zi(){Ht&&(Ht.detachEvent("onpropertychange",_u),Zt=Ht=null)}function _u(e){if(e.propertyName==="value"&&Ss(Zt)){var n=[];qu(n,Zt,e,ba(e)),pu(Gp,n)}}function Jp(e,n,t){e==="focusin"?(zi(),Ht=n,Zt=t,Ht.attachEvent("onpropertychange",_u)):e==="focusout"&&zi()}function Kp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ss(Zt)}function Xp(e,n){if(e==="click")return Ss(n)}function Yp(e,n){if(e==="input"||e==="change")return Ss(n)}function Zp(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Le=typeof Object.is=="function"?Object.is:Zp;function er(e,n){if(Le(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var s=t[r];if(!wo.call(n,s)||!Le(e[s],n[s]))return!1}return!0}function Di(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Fi(e,n){var t=Di(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Di(t)}}function Ou(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Ou(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Mu(){for(var e=window,n=Qr();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=Qr(e.document)}return n}function La(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function eh(e){var n=Mu(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Ou(t.ownerDocument.documentElement,t)){if(r!==null&&La(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var s=t.textContent.length,o=Math.min(r.start,s);r=r.end===void 0?o:Math.min(r.end,s),!e.extend&&o>r&&(s=r,r=o,o=s),s=Fi(t,o);var a=Fi(t,r);s&&a&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(n=n.createRange(),n.setStart(s.node,s.offset),e.removeAllRanges(),o>r?(e.addRange(n),e.extend(a.node,a.offset)):(n.setEnd(a.node,a.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var nh=Qe&&"documentMode"in document&&11>=document.documentMode,Gn=null,zo=null,Ut=null,Do=!1;function Hi(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Do||Gn==null||Gn!==Qr(r)||(r=Gn,"selectionStart"in r&&La(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ut&&er(Ut,r)||(Ut=r,r=ns(zo,"onSelect"),0<r.length&&(n=new Oa("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=Gn)))}function Nr(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var Qn={animationend:Nr("Animation","AnimationEnd"),animationiteration:Nr("Animation","AnimationIteration"),animationstart:Nr("Animation","AnimationStart"),transitionend:Nr("Transition","TransitionEnd")},eo={},Iu={};Qe&&(Iu=document.createElement("div").style,"AnimationEvent"in window||(delete Qn.animationend.animation,delete Qn.animationiteration.animation,delete Qn.animationstart.animation),"TransitionEvent"in window||delete Qn.transitionend.transition);function Es(e){if(eo[e])return eo[e];if(!Qn[e])return e;var n=Qn[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Iu)return eo[e]=n[t];return e}var Lu=Es("animationend"),zu=Es("animationiteration"),Du=Es("animationstart"),Fu=Es("transitionend"),Hu=new Map,Ui="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function kn(e,n){Hu.set(e,n),Fn(n,[e])}for(var no=0;no<Ui.length;no++){var to=Ui[no],th=to.toLowerCase(),rh=to[0].toUpperCase()+to.slice(1);kn(th,"on"+rh)}kn(Lu,"onAnimationEnd");kn(zu,"onAnimationIteration");kn(Du,"onAnimationStart");kn("dblclick","onDoubleClick");kn("focusin","onFocus");kn("focusout","onBlur");kn(Fu,"onTransitionEnd");ut("onMouseEnter",["mouseout","mouseover"]);ut("onMouseLeave",["mouseout","mouseover"]);ut("onPointerEnter",["pointerout","pointerover"]);ut("onPointerLeave",["pointerout","pointerover"]);Fn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Fn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Fn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Fn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Fn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Fn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mt="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),sh=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mt));function $i(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,tp(r,n,void 0,e),e.currentTarget=null}function Uu(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],s=r.event;r=r.listeners;e:{var o=void 0;if(n)for(var a=r.length-1;0<=a;a--){var i=r[a],u=i.instance,c=i.currentTarget;if(i=i.listener,u!==o&&s.isPropagationStopped())break e;$i(s,i,c),o=u}else for(a=0;a<r.length;a++){if(i=r[a],u=i.instance,c=i.currentTarget,i=i.listener,u!==o&&s.isPropagationStopped())break e;$i(s,i,c),o=u}}}if(Kr)throw e=Oo,Kr=!1,Oo=null,e}function L(e,n){var t=n[Bo];t===void 0&&(t=n[Bo]=new Set);var r=e+"__bubble";t.has(r)||($u(n,e,2,!1),t.add(r))}function ro(e,n,t){var r=0;n&&(r|=4),$u(t,e,r,n)}var br="_reactListening"+Math.random().toString(36).slice(2);function nr(e){if(!e[br]){e[br]=!0,Kl.forEach(function(t){t!=="selectionchange"&&(sh.has(t)||ro(t,!1,e),ro(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[br]||(n[br]=!0,ro("selectionchange",!1,n))}}function $u(e,n,t,r){switch(Cu(n)){case 1:var s=vp;break;case 4:s=wp;break;default:s=Pa}t=s.bind(null,n,t,e),s=void 0,!_o||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(s=!0),r?s!==void 0?e.addEventListener(n,t,{capture:!0,passive:s}):e.addEventListener(n,t,!0):s!==void 0?e.addEventListener(n,t,{passive:s}):e.addEventListener(n,t,!1)}function so(e,n,t,r,s){var o=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var i=r.stateNode.containerInfo;if(i===s||i.nodeType===8&&i.parentNode===s)break;if(a===4)for(a=r.return;a!==null;){var u=a.tag;if((u===3||u===4)&&(u=a.stateNode.containerInfo,u===s||u.nodeType===8&&u.parentNode===s))return;a=a.return}for(;i!==null;){if(a=An(i),a===null)return;if(u=a.tag,u===5||u===6){r=o=a;continue e}i=i.parentNode}}r=r.return}pu(function(){var c=o,g=ba(t),d=[];e:{var m=Hu.get(e);if(m!==void 0){var v=Oa,w=e;switch(e){case"keypress":if(Fr(t)===0)break e;case"keydown":case"keyup":v=Op;break;case"focusin":w="focus",v=Xs;break;case"focusout":w="blur",v=Xs;break;case"beforeblur":case"afterblur":v=Xs;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=qi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=jp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=Lp;break;case Lu:case zu:case Du:v=Tp;break;case Fu:v=Dp;break;case"scroll":v=xp;break;case"wheel":v=Hp;break;case"copy":case"cut":case"paste":v=Np;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=_i}var x=(n&4)!==0,S=!x&&e==="scroll",h=x?m!==null?m+"Capture":null:m;x=[];for(var p=c,f;p!==null;){f=p;var y=f.stateNode;if(f.tag===5&&y!==null&&(f=y,h!==null&&(y=Jt(p,h),y!=null&&x.push(tr(p,y,f)))),S)break;p=p.return}0<x.length&&(m=new v(m,w,null,t,g),d.push({event:m,listeners:x}))}}if(!(n&7)){e:{if(m=e==="mouseover"||e==="pointerover",v=e==="mouseout"||e==="pointerout",m&&t!==qo&&(w=t.relatedTarget||t.fromElement)&&(An(w)||w[Je]))break e;if((v||m)&&(m=g.window===g?g:(m=g.ownerDocument)?m.defaultView||m.parentWindow:window,v?(w=t.relatedTarget||t.toElement,v=c,w=w?An(w):null,w!==null&&(S=Hn(w),w!==S||w.tag!==5&&w.tag!==6)&&(w=null)):(v=null,w=c),v!==w)){if(x=qi,y="onMouseLeave",h="onMouseEnter",p="mouse",(e==="pointerout"||e==="pointerover")&&(x=_i,y="onPointerLeave",h="onPointerEnter",p="pointer"),S=v==null?m:Jn(v),f=w==null?m:Jn(w),m=new x(y,p+"leave",v,t,g),m.target=S,m.relatedTarget=f,y=null,An(g)===c&&(x=new x(h,p+"enter",w,t,g),x.target=f,x.relatedTarget=S,y=x),S=y,v&&w)n:{for(x=v,h=w,p=0,f=x;f;f=$n(f))p++;for(f=0,y=h;y;y=$n(y))f++;for(;0<p-f;)x=$n(x),p--;for(;0<f-p;)h=$n(h),f--;for(;p--;){if(x===h||h!==null&&x===h.alternate)break n;x=$n(x),h=$n(h)}x=null}else x=null;v!==null&&Bi(d,m,v,x,!1),w!==null&&S!==null&&Bi(d,S,w,x,!0)}}e:{if(m=c?Jn(c):window,v=m.nodeName&&m.nodeName.toLowerCase(),v==="select"||v==="input"&&m.type==="file")var E=Qp;else if(Ii(m))if(Pu)E=Yp;else{E=Kp;var N=Jp}else(v=m.nodeName)&&v.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(E=Xp);if(E&&(E=E(e,c))){qu(d,E,t,g);break e}N&&N(e,m,c),e==="focusout"&&(N=m._wrapperState)&&N.controlled&&m.type==="number"&&Co(m,"number",m.value)}switch(N=c?Jn(c):window,e){case"focusin":(Ii(N)||N.contentEditable==="true")&&(Gn=N,zo=c,Ut=null);break;case"focusout":Ut=zo=Gn=null;break;case"mousedown":Do=!0;break;case"contextmenu":case"mouseup":case"dragend":Do=!1,Hi(d,t,g);break;case"selectionchange":if(nh)break;case"keydown":case"keyup":Hi(d,t,g)}var b;if(Ia)e:{switch(e){case"compositionstart":var A="onCompositionStart";break e;case"compositionend":A="onCompositionEnd";break e;case"compositionupdate":A="onCompositionUpdate";break e}A=void 0}else Vn?Au(e,t)&&(A="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(A="onCompositionStart");A&&(bu&&t.locale!=="ko"&&(Vn||A!=="onCompositionStart"?A==="onCompositionEnd"&&Vn&&(b=Nu()):(an=g,_a="value"in an?an.value:an.textContent,Vn=!0)),N=ns(c,A),0<N.length&&(A=new Pi(A,e,null,t,g),d.push({event:A,listeners:N}),b?A.data=b:(b=Ru(t),b!==null&&(A.data=b)))),(b=$p?Bp(e,t):Wp(e,t))&&(c=ns(c,"onBeforeInput"),0<c.length&&(g=new Pi("onBeforeInput","beforeinput",null,t,g),d.push({event:g,listeners:c}),g.data=b))}Uu(d,n)})}function tr(e,n,t){return{instance:e,listener:n,currentTarget:t}}function ns(e,n){for(var t=n+"Capture",r=[];e!==null;){var s=e,o=s.stateNode;s.tag===5&&o!==null&&(s=o,o=Jt(e,t),o!=null&&r.unshift(tr(e,o,s)),o=Jt(e,n),o!=null&&r.push(tr(e,o,s))),e=e.return}return r}function $n(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Bi(e,n,t,r,s){for(var o=n._reactName,a=[];t!==null&&t!==r;){var i=t,u=i.alternate,c=i.stateNode;if(u!==null&&u===r)break;i.tag===5&&c!==null&&(i=c,s?(u=Jt(t,o),u!=null&&a.unshift(tr(t,u,i))):s||(u=Jt(t,o),u!=null&&a.push(tr(t,u,i)))),t=t.return}a.length!==0&&e.push({event:n,listeners:a})}var oh=/\r\n?/g,ah=/\u0000|\uFFFD/g;function Wi(e){return(typeof e=="string"?e:""+e).replace(oh,`
`).replace(ah,"")}function Ar(e,n,t){if(n=Wi(n),Wi(e)!==n&&t)throw Error(j(425))}function ts(){}var Fo=null,Ho=null;function Uo(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var $o=typeof setTimeout=="function"?setTimeout:void 0,ih=typeof clearTimeout=="function"?clearTimeout:void 0,Vi=typeof Promise=="function"?Promise:void 0,lh=typeof queueMicrotask=="function"?queueMicrotask:typeof Vi<"u"?function(e){return Vi.resolve(null).then(e).catch(uh)}:$o;function uh(e){setTimeout(function(){throw e})}function oo(e,n){var t=n,r=0;do{var s=t.nextSibling;if(e.removeChild(t),s&&s.nodeType===8)if(t=s.data,t==="/$"){if(r===0){e.removeChild(s),Yt(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=s}while(t);Yt(n)}function hn(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function Gi(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var wt=Math.random().toString(36).slice(2),Fe="__reactFiber$"+wt,rr="__reactProps$"+wt,Je="__reactContainer$"+wt,Bo="__reactEvents$"+wt,ch="__reactListeners$"+wt,dh="__reactHandles$"+wt;function An(e){var n=e[Fe];if(n)return n;for(var t=e.parentNode;t;){if(n=t[Je]||t[Fe]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=Gi(e);e!==null;){if(t=e[Fe])return t;e=Gi(e)}return n}e=t,t=e.parentNode}return null}function mr(e){return e=e[Fe]||e[Je],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Jn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(j(33))}function Ts(e){return e[rr]||null}var Wo=[],Kn=-1;function jn(e){return{current:e}}function z(e){0>Kn||(e.current=Wo[Kn],Wo[Kn]=null,Kn--)}function I(e,n){Kn++,Wo[Kn]=e.current,e.current=n}var xn={},ie=jn(xn),fe=jn(!1),Mn=xn;function ct(e,n){var t=e.type.contextTypes;if(!t)return xn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var s={},o;for(o in t)s[o]=n[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=s),s}function me(e){return e=e.childContextTypes,e!=null}function rs(){z(fe),z(ie)}function Qi(e,n,t){if(ie.current!==xn)throw Error(j(168));I(ie,n),I(fe,t)}function Bu(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var s in r)if(!(s in n))throw Error(j(108,Jd(e)||"Unknown",s));return B({},t,r)}function ss(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||xn,Mn=ie.current,I(ie,e),I(fe,fe.current),!0}function Ji(e,n,t){var r=e.stateNode;if(!r)throw Error(j(169));t?(e=Bu(e,n,Mn),r.__reactInternalMemoizedMergedChildContext=e,z(fe),z(ie),I(ie,e)):z(fe),I(fe,t)}var Be=null,Cs=!1,ao=!1;function Wu(e){Be===null?Be=[e]:Be.push(e)}function ph(e){Cs=!0,Wu(e)}function Sn(){if(!ao&&Be!==null){ao=!0;var e=0,n=M;try{var t=Be;for(M=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}Be=null,Cs=!1}catch(s){throw Be!==null&&(Be=Be.slice(e+1)),gu(Aa,Sn),s}finally{M=n,ao=!1}}return null}var Xn=[],Yn=0,os=null,as=0,Ee=[],Te=0,In=null,We=1,Ve="";function Cn(e,n){Xn[Yn++]=as,Xn[Yn++]=os,os=e,as=n}function Vu(e,n,t){Ee[Te++]=We,Ee[Te++]=Ve,Ee[Te++]=In,In=e;var r=We;e=Ve;var s=32-Me(r)-1;r&=~(1<<s),t+=1;var o=32-Me(n)+s;if(30<o){var a=s-s%5;o=(r&(1<<a)-1).toString(32),r>>=a,s-=a,We=1<<32-Me(n)+s|t<<s|r,Ve=o+e}else We=1<<o|t<<s|r,Ve=e}function za(e){e.return!==null&&(Cn(e,1),Vu(e,1,0))}function Da(e){for(;e===os;)os=Xn[--Yn],Xn[Yn]=null,as=Xn[--Yn],Xn[Yn]=null;for(;e===In;)In=Ee[--Te],Ee[Te]=null,Ve=Ee[--Te],Ee[Te]=null,We=Ee[--Te],Ee[Te]=null}var xe=null,we=null,D=!1,_e=null;function Gu(e,n){var t=Ce(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function Ki(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,xe=e,we=hn(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,xe=e,we=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=In!==null?{id:We,overflow:Ve}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=Ce(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,xe=e,we=null,!0):!1;default:return!1}}function Vo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Go(e){if(D){var n=we;if(n){var t=n;if(!Ki(e,n)){if(Vo(e))throw Error(j(418));n=hn(t.nextSibling);var r=xe;n&&Ki(e,n)?Gu(r,t):(e.flags=e.flags&-4097|2,D=!1,xe=e)}}else{if(Vo(e))throw Error(j(418));e.flags=e.flags&-4097|2,D=!1,xe=e}}}function Xi(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;xe=e}function Rr(e){if(e!==xe)return!1;if(!D)return Xi(e),D=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!Uo(e.type,e.memoizedProps)),n&&(n=we)){if(Vo(e))throw Qu(),Error(j(418));for(;n;)Gu(e,n),n=hn(n.nextSibling)}if(Xi(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){we=hn(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}we=null}}else we=xe?hn(e.stateNode.nextSibling):null;return!0}function Qu(){for(var e=we;e;)e=hn(e.nextSibling)}function dt(){we=xe=null,D=!1}function Fa(e){_e===null?_e=[e]:_e.push(e)}var hh=Ye.ReactCurrentBatchConfig;function At(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(j(309));var r=t.stateNode}if(!r)throw Error(j(147,e));var s=r,o=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===o?n.ref:(n=function(a){var i=s.refs;a===null?delete i[o]:i[o]=a},n._stringRef=o,n)}if(typeof e!="string")throw Error(j(284));if(!t._owner)throw Error(j(290,e))}return e}function qr(e,n){throw e=Object.prototype.toString.call(n),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function Yi(e){var n=e._init;return n(e._payload)}function Ju(e){function n(h,p){if(e){var f=h.deletions;f===null?(h.deletions=[p],h.flags|=16):f.push(p)}}function t(h,p){if(!e)return null;for(;p!==null;)n(h,p),p=p.sibling;return null}function r(h,p){for(h=new Map;p!==null;)p.key!==null?h.set(p.key,p):h.set(p.index,p),p=p.sibling;return h}function s(h,p){return h=yn(h,p),h.index=0,h.sibling=null,h}function o(h,p,f){return h.index=f,e?(f=h.alternate,f!==null?(f=f.index,f<p?(h.flags|=2,p):f):(h.flags|=2,p)):(h.flags|=1048576,p)}function a(h){return e&&h.alternate===null&&(h.flags|=2),h}function i(h,p,f,y){return p===null||p.tag!==6?(p=fo(f,h.mode,y),p.return=h,p):(p=s(p,f),p.return=h,p)}function u(h,p,f,y){var E=f.type;return E===Wn?g(h,p,f.props.children,y,f.key):p!==null&&(p.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===tn&&Yi(E)===p.type)?(y=s(p,f.props),y.ref=At(h,p,f),y.return=h,y):(y=Gr(f.type,f.key,f.props,null,h.mode,y),y.ref=At(h,p,f),y.return=h,y)}function c(h,p,f,y){return p===null||p.tag!==4||p.stateNode.containerInfo!==f.containerInfo||p.stateNode.implementation!==f.implementation?(p=mo(f,h.mode,y),p.return=h,p):(p=s(p,f.children||[]),p.return=h,p)}function g(h,p,f,y,E){return p===null||p.tag!==7?(p=On(f,h.mode,y,E),p.return=h,p):(p=s(p,f),p.return=h,p)}function d(h,p,f){if(typeof p=="string"&&p!==""||typeof p=="number")return p=fo(""+p,h.mode,f),p.return=h,p;if(typeof p=="object"&&p!==null){switch(p.$$typeof){case xr:return f=Gr(p.type,p.key,p.props,null,h.mode,f),f.ref=At(h,null,p),f.return=h,f;case Bn:return p=mo(p,h.mode,f),p.return=h,p;case tn:var y=p._init;return d(h,y(p._payload),f)}if(_t(p)||Et(p))return p=On(p,h.mode,f,null),p.return=h,p;qr(h,p)}return null}function m(h,p,f,y){var E=p!==null?p.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return E!==null?null:i(h,p,""+f,y);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case xr:return f.key===E?u(h,p,f,y):null;case Bn:return f.key===E?c(h,p,f,y):null;case tn:return E=f._init,m(h,p,E(f._payload),y)}if(_t(f)||Et(f))return E!==null?null:g(h,p,f,y,null);qr(h,f)}return null}function v(h,p,f,y,E){if(typeof y=="string"&&y!==""||typeof y=="number")return h=h.get(f)||null,i(p,h,""+y,E);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case xr:return h=h.get(y.key===null?f:y.key)||null,u(p,h,y,E);case Bn:return h=h.get(y.key===null?f:y.key)||null,c(p,h,y,E);case tn:var N=y._init;return v(h,p,f,N(y._payload),E)}if(_t(y)||Et(y))return h=h.get(f)||null,g(p,h,y,E,null);qr(p,y)}return null}function w(h,p,f,y){for(var E=null,N=null,b=p,A=p=0,F=null;b!==null&&A<f.length;A++){b.index>A?(F=b,b=null):F=b.sibling;var q=m(h,b,f[A],y);if(q===null){b===null&&(b=F);break}e&&b&&q.alternate===null&&n(h,b),p=o(q,p,A),N===null?E=q:N.sibling=q,N=q,b=F}if(A===f.length)return t(h,b),D&&Cn(h,A),E;if(b===null){for(;A<f.length;A++)b=d(h,f[A],y),b!==null&&(p=o(b,p,A),N===null?E=b:N.sibling=b,N=b);return D&&Cn(h,A),E}for(b=r(h,b);A<f.length;A++)F=v(b,h,A,f[A],y),F!==null&&(e&&F.alternate!==null&&b.delete(F.key===null?A:F.key),p=o(F,p,A),N===null?E=F:N.sibling=F,N=F);return e&&b.forEach(function(ye){return n(h,ye)}),D&&Cn(h,A),E}function x(h,p,f,y){var E=Et(f);if(typeof E!="function")throw Error(j(150));if(f=E.call(f),f==null)throw Error(j(151));for(var N=E=null,b=p,A=p=0,F=null,q=f.next();b!==null&&!q.done;A++,q=f.next()){b.index>A?(F=b,b=null):F=b.sibling;var ye=m(h,b,q.value,y);if(ye===null){b===null&&(b=F);break}e&&b&&ye.alternate===null&&n(h,b),p=o(ye,p,A),N===null?E=ye:N.sibling=ye,N=ye,b=F}if(q.done)return t(h,b),D&&Cn(h,A),E;if(b===null){for(;!q.done;A++,q=f.next())q=d(h,q.value,y),q!==null&&(p=o(q,p,A),N===null?E=q:N.sibling=q,N=q);return D&&Cn(h,A),E}for(b=r(h,b);!q.done;A++,q=f.next())q=v(b,h,A,q.value,y),q!==null&&(e&&q.alternate!==null&&b.delete(q.key===null?A:q.key),p=o(q,p,A),N===null?E=q:N.sibling=q,N=q);return e&&b.forEach(function(jt){return n(h,jt)}),D&&Cn(h,A),E}function S(h,p,f,y){if(typeof f=="object"&&f!==null&&f.type===Wn&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case xr:e:{for(var E=f.key,N=p;N!==null;){if(N.key===E){if(E=f.type,E===Wn){if(N.tag===7){t(h,N.sibling),p=s(N,f.props.children),p.return=h,h=p;break e}}else if(N.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===tn&&Yi(E)===N.type){t(h,N.sibling),p=s(N,f.props),p.ref=At(h,N,f),p.return=h,h=p;break e}t(h,N);break}else n(h,N);N=N.sibling}f.type===Wn?(p=On(f.props.children,h.mode,y,f.key),p.return=h,h=p):(y=Gr(f.type,f.key,f.props,null,h.mode,y),y.ref=At(h,p,f),y.return=h,h=y)}return a(h);case Bn:e:{for(N=f.key;p!==null;){if(p.key===N)if(p.tag===4&&p.stateNode.containerInfo===f.containerInfo&&p.stateNode.implementation===f.implementation){t(h,p.sibling),p=s(p,f.children||[]),p.return=h,h=p;break e}else{t(h,p);break}else n(h,p);p=p.sibling}p=mo(f,h.mode,y),p.return=h,h=p}return a(h);case tn:return N=f._init,S(h,p,N(f._payload),y)}if(_t(f))return w(h,p,f,y);if(Et(f))return x(h,p,f,y);qr(h,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,p!==null&&p.tag===6?(t(h,p.sibling),p=s(p,f),p.return=h,h=p):(t(h,p),p=fo(f,h.mode,y),p.return=h,h=p),a(h)):t(h,p)}return S}var pt=Ju(!0),Ku=Ju(!1),is=jn(null),ls=null,Zn=null,Ha=null;function Ua(){Ha=Zn=ls=null}function $a(e){var n=is.current;z(is),e._currentValue=n}function Qo(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function at(e,n){ls=e,Ha=Zn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&(he=!0),e.firstContext=null)}function be(e){var n=e._currentValue;if(Ha!==e)if(e={context:e,memoizedValue:n,next:null},Zn===null){if(ls===null)throw Error(j(308));Zn=e,ls.dependencies={lanes:0,firstContext:e}}else Zn=Zn.next=e;return n}var Rn=null;function Ba(e){Rn===null?Rn=[e]:Rn.push(e)}function Xu(e,n,t,r){var s=n.interleaved;return s===null?(t.next=t,Ba(n)):(t.next=s.next,s.next=t),n.interleaved=t,Ke(e,r)}function Ke(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var rn=!1;function Wa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Yu(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ge(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function fn(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,O&2){var s=r.pending;return s===null?n.next=n:(n.next=s.next,s.next=n),r.pending=n,Ke(e,t)}return s=r.interleaved,s===null?(n.next=n,Ba(r)):(n.next=s.next,s.next=n),r.interleaved=n,Ke(e,t)}function Hr(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Ra(e,t)}}function Zi(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var s=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var a={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};o===null?s=o=a:o=o.next=a,t=t.next}while(t!==null);o===null?s=o=n:o=o.next=n}else s=o=n;t={baseState:r.baseState,firstBaseUpdate:s,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function us(e,n,t,r){var s=e.updateQueue;rn=!1;var o=s.firstBaseUpdate,a=s.lastBaseUpdate,i=s.shared.pending;if(i!==null){s.shared.pending=null;var u=i,c=u.next;u.next=null,a===null?o=c:a.next=c,a=u;var g=e.alternate;g!==null&&(g=g.updateQueue,i=g.lastBaseUpdate,i!==a&&(i===null?g.firstBaseUpdate=c:i.next=c,g.lastBaseUpdate=u))}if(o!==null){var d=s.baseState;a=0,g=c=u=null,i=o;do{var m=i.lane,v=i.eventTime;if((r&m)===m){g!==null&&(g=g.next={eventTime:v,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var w=e,x=i;switch(m=n,v=t,x.tag){case 1:if(w=x.payload,typeof w=="function"){d=w.call(v,d,m);break e}d=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=x.payload,m=typeof w=="function"?w.call(v,d,m):w,m==null)break e;d=B({},d,m);break e;case 2:rn=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,m=s.effects,m===null?s.effects=[i]:m.push(i))}else v={eventTime:v,lane:m,tag:i.tag,payload:i.payload,callback:i.callback,next:null},g===null?(c=g=v,u=d):g=g.next=v,a|=m;if(i=i.next,i===null){if(i=s.shared.pending,i===null)break;m=i,i=m.next,m.next=null,s.lastBaseUpdate=m,s.shared.pending=null}}while(!0);if(g===null&&(u=d),s.baseState=u,s.firstBaseUpdate=c,s.lastBaseUpdate=g,n=s.shared.interleaved,n!==null){s=n;do a|=s.lane,s=s.next;while(s!==n)}else o===null&&(s.shared.lanes=0);zn|=a,e.lanes=a,e.memoizedState=d}}function el(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],s=r.callback;if(s!==null){if(r.callback=null,r=t,typeof s!="function")throw Error(j(191,s));s.call(r)}}}var gr={},Ue=jn(gr),sr=jn(gr),or=jn(gr);function qn(e){if(e===gr)throw Error(j(174));return e}function Va(e,n){switch(I(or,n),I(sr,e),I(Ue,gr),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:bo(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=bo(n,e)}z(Ue),I(Ue,n)}function ht(){z(Ue),z(sr),z(or)}function Zu(e){qn(or.current);var n=qn(Ue.current),t=bo(n,e.type);n!==t&&(I(sr,e),I(Ue,t))}function Ga(e){sr.current===e&&(z(Ue),z(sr))}var H=jn(0);function cs(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var io=[];function Qa(){for(var e=0;e<io.length;e++)io[e]._workInProgressVersionPrimary=null;io.length=0}var Ur=Ye.ReactCurrentDispatcher,lo=Ye.ReactCurrentBatchConfig,Ln=0,U=null,K=null,Z=null,ds=!1,$t=!1,ar=0,fh=0;function se(){throw Error(j(321))}function Ja(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!Le(e[t],n[t]))return!1;return!0}function Ka(e,n,t,r,s,o){if(Ln=o,U=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Ur.current=e===null||e.memoizedState===null?vh:wh,e=t(r,s),$t){o=0;do{if($t=!1,ar=0,25<=o)throw Error(j(301));o+=1,Z=K=null,n.updateQueue=null,Ur.current=xh,e=t(r,s)}while($t)}if(Ur.current=ps,n=K!==null&&K.next!==null,Ln=0,Z=K=U=null,ds=!1,n)throw Error(j(300));return e}function Xa(){var e=ar!==0;return ar=0,e}function De(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Z===null?U.memoizedState=Z=e:Z=Z.next=e,Z}function Ae(){if(K===null){var e=U.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var n=Z===null?U.memoizedState:Z.next;if(n!==null)Z=n,K=e;else{if(e===null)throw Error(j(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},Z===null?U.memoizedState=Z=e:Z=Z.next=e}return Z}function ir(e,n){return typeof n=="function"?n(e):n}function uo(e){var n=Ae(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=K,s=r.baseQueue,o=t.pending;if(o!==null){if(s!==null){var a=s.next;s.next=o.next,o.next=a}r.baseQueue=s=o,t.pending=null}if(s!==null){o=s.next,r=r.baseState;var i=a=null,u=null,c=o;do{var g=c.lane;if((Ln&g)===g)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:e(r,c.action);else{var d={lane:g,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(i=u=d,a=r):u=u.next=d,U.lanes|=g,zn|=g}c=c.next}while(c!==null&&c!==o);u===null?a=r:u.next=i,Le(r,n.memoizedState)||(he=!0),n.memoizedState=r,n.baseState=a,n.baseQueue=u,t.lastRenderedState=r}if(e=t.interleaved,e!==null){s=e;do o=s.lane,U.lanes|=o,zn|=o,s=s.next;while(s!==e)}else s===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function co(e){var n=Ae(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=t.dispatch,s=t.pending,o=n.memoizedState;if(s!==null){t.pending=null;var a=s=s.next;do o=e(o,a.action),a=a.next;while(a!==s);Le(o,n.memoizedState)||(he=!0),n.memoizedState=o,n.baseQueue===null&&(n.baseState=o),t.lastRenderedState=o}return[o,r]}function ec(){}function nc(e,n){var t=U,r=Ae(),s=n(),o=!Le(r.memoizedState,s);if(o&&(r.memoizedState=s,he=!0),r=r.queue,Ya(sc.bind(null,t,r,e),[e]),r.getSnapshot!==n||o||Z!==null&&Z.memoizedState.tag&1){if(t.flags|=2048,lr(9,rc.bind(null,t,r,s,n),void 0,null),ee===null)throw Error(j(349));Ln&30||tc(t,n,s)}return s}function tc(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=U.updateQueue,n===null?(n={lastEffect:null,stores:null},U.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function rc(e,n,t,r){n.value=t,n.getSnapshot=r,oc(n)&&ac(e)}function sc(e,n,t){return t(function(){oc(n)&&ac(e)})}function oc(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!Le(e,t)}catch{return!0}}function ac(e){var n=Ke(e,1);n!==null&&Ie(n,e,1,-1)}function nl(e){var n=De();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ir,lastRenderedState:e},n.queue=e,e=e.dispatch=yh.bind(null,U,e),[n.memoizedState,e]}function lr(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=U.updateQueue,n===null?(n={lastEffect:null,stores:null},U.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function ic(){return Ae().memoizedState}function $r(e,n,t,r){var s=De();U.flags|=e,s.memoizedState=lr(1|n,t,void 0,r===void 0?null:r)}function Ns(e,n,t,r){var s=Ae();r=r===void 0?null:r;var o=void 0;if(K!==null){var a=K.memoizedState;if(o=a.destroy,r!==null&&Ja(r,a.deps)){s.memoizedState=lr(n,t,o,r);return}}U.flags|=e,s.memoizedState=lr(1|n,t,o,r)}function tl(e,n){return $r(8390656,8,e,n)}function Ya(e,n){return Ns(2048,8,e,n)}function lc(e,n){return Ns(4,2,e,n)}function uc(e,n){return Ns(4,4,e,n)}function cc(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function dc(e,n,t){return t=t!=null?t.concat([e]):null,Ns(4,4,cc.bind(null,n,e),t)}function Za(){}function pc(e,n){var t=Ae();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Ja(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function hc(e,n){var t=Ae();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Ja(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function fc(e,n,t){return Ln&21?(Le(t,n)||(t=wu(),U.lanes|=t,zn|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,he=!0),e.memoizedState=t)}function mh(e,n){var t=M;M=t!==0&&4>t?t:4,e(!0);var r=lo.transition;lo.transition={};try{e(!1),n()}finally{M=t,lo.transition=r}}function mc(){return Ae().memoizedState}function gh(e,n,t){var r=gn(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},gc(e))yc(n,t);else if(t=Xu(e,n,t,r),t!==null){var s=ue();Ie(t,e,r,s),vc(t,n,r)}}function yh(e,n,t){var r=gn(e),s={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(gc(e))yc(n,s);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=n.lastRenderedReducer,o!==null))try{var a=n.lastRenderedState,i=o(a,t);if(s.hasEagerState=!0,s.eagerState=i,Le(i,a)){var u=n.interleaved;u===null?(s.next=s,Ba(n)):(s.next=u.next,u.next=s),n.interleaved=s;return}}catch{}finally{}t=Xu(e,n,s,r),t!==null&&(s=ue(),Ie(t,e,r,s),vc(t,n,r))}}function gc(e){var n=e.alternate;return e===U||n!==null&&n===U}function yc(e,n){$t=ds=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function vc(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Ra(e,t)}}var ps={readContext:be,useCallback:se,useContext:se,useEffect:se,useImperativeHandle:se,useInsertionEffect:se,useLayoutEffect:se,useMemo:se,useReducer:se,useRef:se,useState:se,useDebugValue:se,useDeferredValue:se,useTransition:se,useMutableSource:se,useSyncExternalStore:se,useId:se,unstable_isNewReconciler:!1},vh={readContext:be,useCallback:function(e,n){return De().memoizedState=[e,n===void 0?null:n],e},useContext:be,useEffect:tl,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,$r(4194308,4,cc.bind(null,n,e),t)},useLayoutEffect:function(e,n){return $r(4194308,4,e,n)},useInsertionEffect:function(e,n){return $r(4,2,e,n)},useMemo:function(e,n){var t=De();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=De();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=gh.bind(null,U,e),[r.memoizedState,e]},useRef:function(e){var n=De();return e={current:e},n.memoizedState=e},useState:nl,useDebugValue:Za,useDeferredValue:function(e){return De().memoizedState=e},useTransition:function(){var e=nl(!1),n=e[0];return e=mh.bind(null,e[1]),De().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=U,s=De();if(D){if(t===void 0)throw Error(j(407));t=t()}else{if(t=n(),ee===null)throw Error(j(349));Ln&30||tc(r,n,t)}s.memoizedState=t;var o={value:t,getSnapshot:n};return s.queue=o,tl(sc.bind(null,r,o,e),[e]),r.flags|=2048,lr(9,rc.bind(null,r,o,t,n),void 0,null),t},useId:function(){var e=De(),n=ee.identifierPrefix;if(D){var t=Ve,r=We;t=(r&~(1<<32-Me(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=ar++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=fh++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},wh={readContext:be,useCallback:pc,useContext:be,useEffect:Ya,useImperativeHandle:dc,useInsertionEffect:lc,useLayoutEffect:uc,useMemo:hc,useReducer:uo,useRef:ic,useState:function(){return uo(ir)},useDebugValue:Za,useDeferredValue:function(e){var n=Ae();return fc(n,K.memoizedState,e)},useTransition:function(){var e=uo(ir)[0],n=Ae().memoizedState;return[e,n]},useMutableSource:ec,useSyncExternalStore:nc,useId:mc,unstable_isNewReconciler:!1},xh={readContext:be,useCallback:pc,useContext:be,useEffect:Ya,useImperativeHandle:dc,useInsertionEffect:lc,useLayoutEffect:uc,useMemo:hc,useReducer:co,useRef:ic,useState:function(){return co(ir)},useDebugValue:Za,useDeferredValue:function(e){var n=Ae();return K===null?n.memoizedState=e:fc(n,K.memoizedState,e)},useTransition:function(){var e=co(ir)[0],n=Ae().memoizedState;return[e,n]},useMutableSource:ec,useSyncExternalStore:nc,useId:mc,unstable_isNewReconciler:!1};function qe(e,n){if(e&&e.defaultProps){n=B({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}function Jo(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:B({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var bs={isMounted:function(e){return(e=e._reactInternals)?Hn(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=ue(),s=gn(e),o=Ge(r,s);o.payload=n,t!=null&&(o.callback=t),n=fn(e,o,s),n!==null&&(Ie(n,e,s,r),Hr(n,e,s))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=ue(),s=gn(e),o=Ge(r,s);o.tag=1,o.payload=n,t!=null&&(o.callback=t),n=fn(e,o,s),n!==null&&(Ie(n,e,s,r),Hr(n,e,s))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=ue(),r=gn(e),s=Ge(t,r);s.tag=2,n!=null&&(s.callback=n),n=fn(e,s,r),n!==null&&(Ie(n,e,r,t),Hr(n,e,r))}};function rl(e,n,t,r,s,o,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,a):n.prototype&&n.prototype.isPureReactComponent?!er(t,r)||!er(s,o):!0}function wc(e,n,t){var r=!1,s=xn,o=n.contextType;return typeof o=="object"&&o!==null?o=be(o):(s=me(n)?Mn:ie.current,r=n.contextTypes,o=(r=r!=null)?ct(e,s):xn),n=new n(t,o),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=bs,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=o),n}function sl(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&bs.enqueueReplaceState(n,n.state,null)}function Ko(e,n,t,r){var s=e.stateNode;s.props=t,s.state=e.memoizedState,s.refs={},Wa(e);var o=n.contextType;typeof o=="object"&&o!==null?s.context=be(o):(o=me(n)?Mn:ie.current,s.context=ct(e,o)),s.state=e.memoizedState,o=n.getDerivedStateFromProps,typeof o=="function"&&(Jo(e,n,o,t),s.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(n=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),n!==s.state&&bs.enqueueReplaceState(s,s.state,null),us(e,t,s,r),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function ft(e,n){try{var t="",r=n;do t+=Qd(r),r=r.return;while(r);var s=t}catch(o){s=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:n,stack:s,digest:null}}function po(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function Xo(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var kh=typeof WeakMap=="function"?WeakMap:Map;function xc(e,n,t){t=Ge(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){fs||(fs=!0,ia=r),Xo(e,n)},t}function kc(e,n,t){t=Ge(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var s=n.value;t.payload=function(){return r(s)},t.callback=function(){Xo(e,n)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(t.callback=function(){Xo(e,n),typeof r!="function"&&(mn===null?mn=new Set([this]):mn.add(this));var a=n.stack;this.componentDidCatch(n.value,{componentStack:a!==null?a:""})}),t}function ol(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new kh;var s=new Set;r.set(n,s)}else s=r.get(n),s===void 0&&(s=new Set,r.set(n,s));s.has(t)||(s.add(t),e=Mh.bind(null,e,n,t),n.then(e,e))}function al(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function il(e,n,t,r,s){return e.mode&1?(e.flags|=65536,e.lanes=s,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=Ge(-1,1),n.tag=2,fn(t,n,1))),t.lanes|=1),e)}var jh=Ye.ReactCurrentOwner,he=!1;function le(e,n,t,r){n.child=e===null?Ku(n,null,t,r):pt(n,e.child,t,r)}function ll(e,n,t,r,s){t=t.render;var o=n.ref;return at(n,s),r=Ka(e,n,t,r,o,s),t=Xa(),e!==null&&!he?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~s,Xe(e,n,s)):(D&&t&&za(n),n.flags|=1,le(e,n,r,s),n.child)}function ul(e,n,t,r,s){if(e===null){var o=t.type;return typeof o=="function"&&!ii(o)&&o.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=o,jc(e,n,o,r,s)):(e=Gr(t.type,null,r,n,n.mode,s),e.ref=n.ref,e.return=n,n.child=e)}if(o=e.child,!(e.lanes&s)){var a=o.memoizedProps;if(t=t.compare,t=t!==null?t:er,t(a,r)&&e.ref===n.ref)return Xe(e,n,s)}return n.flags|=1,e=yn(o,r),e.ref=n.ref,e.return=n,n.child=e}function jc(e,n,t,r,s){if(e!==null){var o=e.memoizedProps;if(er(o,r)&&e.ref===n.ref)if(he=!1,n.pendingProps=r=o,(e.lanes&s)!==0)e.flags&131072&&(he=!0);else return n.lanes=e.lanes,Xe(e,n,s)}return Yo(e,n,t,r,s)}function Sc(e,n,t){var r=n.pendingProps,s=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},I(nt,ve),ve|=t;else{if(!(t&1073741824))return e=o!==null?o.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,I(nt,ve),ve|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:t,I(nt,ve),ve|=r}else o!==null?(r=o.baseLanes|t,n.memoizedState=null):r=t,I(nt,ve),ve|=r;return le(e,n,s,t),n.child}function Ec(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function Yo(e,n,t,r,s){var o=me(t)?Mn:ie.current;return o=ct(n,o),at(n,s),t=Ka(e,n,t,r,o,s),r=Xa(),e!==null&&!he?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~s,Xe(e,n,s)):(D&&r&&za(n),n.flags|=1,le(e,n,t,s),n.child)}function cl(e,n,t,r,s){if(me(t)){var o=!0;ss(n)}else o=!1;if(at(n,s),n.stateNode===null)Br(e,n),wc(n,t,r),Ko(n,t,r,s),r=!0;else if(e===null){var a=n.stateNode,i=n.memoizedProps;a.props=i;var u=a.context,c=t.contextType;typeof c=="object"&&c!==null?c=be(c):(c=me(t)?Mn:ie.current,c=ct(n,c));var g=t.getDerivedStateFromProps,d=typeof g=="function"||typeof a.getSnapshotBeforeUpdate=="function";d||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(i!==r||u!==c)&&sl(n,a,r,c),rn=!1;var m=n.memoizedState;a.state=m,us(n,r,a,s),u=n.memoizedState,i!==r||m!==u||fe.current||rn?(typeof g=="function"&&(Jo(n,t,g,r),u=n.memoizedState),(i=rn||rl(n,t,i,r,m,u,c))?(d||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(n.flags|=4194308)):(typeof a.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=u),a.props=r,a.state=u,a.context=c,r=i):(typeof a.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{a=n.stateNode,Yu(e,n),i=n.memoizedProps,c=n.type===n.elementType?i:qe(n.type,i),a.props=c,d=n.pendingProps,m=a.context,u=t.contextType,typeof u=="object"&&u!==null?u=be(u):(u=me(t)?Mn:ie.current,u=ct(n,u));var v=t.getDerivedStateFromProps;(g=typeof v=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(i!==d||m!==u)&&sl(n,a,r,u),rn=!1,m=n.memoizedState,a.state=m,us(n,r,a,s);var w=n.memoizedState;i!==d||m!==w||fe.current||rn?(typeof v=="function"&&(Jo(n,t,v,r),w=n.memoizedState),(c=rn||rl(n,t,c,r,m,w,u)||!1)?(g||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,w,u),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,w,u)),typeof a.componentDidUpdate=="function"&&(n.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof a.componentDidUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=w),a.props=r,a.state=w,a.context=u,r=c):(typeof a.componentDidUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),r=!1)}return Zo(e,n,t,r,o,s)}function Zo(e,n,t,r,s,o){Ec(e,n);var a=(n.flags&128)!==0;if(!r&&!a)return s&&Ji(n,t,!1),Xe(e,n,o);r=n.stateNode,jh.current=n;var i=a&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&a?(n.child=pt(n,e.child,null,o),n.child=pt(n,null,i,o)):le(e,n,i,o),n.memoizedState=r.state,s&&Ji(n,t,!0),n.child}function Tc(e){var n=e.stateNode;n.pendingContext?Qi(e,n.pendingContext,n.pendingContext!==n.context):n.context&&Qi(e,n.context,!1),Va(e,n.containerInfo)}function dl(e,n,t,r,s){return dt(),Fa(s),n.flags|=256,le(e,n,t,r),n.child}var ea={dehydrated:null,treeContext:null,retryLane:0};function na(e){return{baseLanes:e,cachePool:null,transitions:null}}function Cc(e,n,t){var r=n.pendingProps,s=H.current,o=!1,a=(n.flags&128)!==0,i;if((i=a)||(i=e!==null&&e.memoizedState===null?!1:(s&2)!==0),i?(o=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),I(H,s&1),e===null)return Go(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(a=r.children,e=r.fallback,o?(r=n.mode,o=n.child,a={mode:"hidden",children:a},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=a):o=qs(a,r,0,null),e=On(e,r,t,null),o.return=n,e.return=n,o.sibling=e,n.child=o,n.child.memoizedState=na(t),n.memoizedState=ea,e):ei(n,a));if(s=e.memoizedState,s!==null&&(i=s.dehydrated,i!==null))return Sh(e,n,a,r,i,s,t);if(o){o=r.fallback,a=n.mode,s=e.child,i=s.sibling;var u={mode:"hidden",children:r.children};return!(a&1)&&n.child!==s?(r=n.child,r.childLanes=0,r.pendingProps=u,n.deletions=null):(r=yn(s,u),r.subtreeFlags=s.subtreeFlags&14680064),i!==null?o=yn(i,o):(o=On(o,a,t,null),o.flags|=2),o.return=n,r.return=n,r.sibling=o,n.child=r,r=o,o=n.child,a=e.child.memoizedState,a=a===null?na(t):{baseLanes:a.baseLanes|t,cachePool:null,transitions:a.transitions},o.memoizedState=a,o.childLanes=e.childLanes&~t,n.memoizedState=ea,r}return o=e.child,e=o.sibling,r=yn(o,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function ei(e,n){return n=qs({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function Pr(e,n,t,r){return r!==null&&Fa(r),pt(n,e.child,null,t),e=ei(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Sh(e,n,t,r,s,o,a){if(t)return n.flags&256?(n.flags&=-257,r=po(Error(j(422))),Pr(e,n,a,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(o=r.fallback,s=n.mode,r=qs({mode:"visible",children:r.children},s,0,null),o=On(o,s,a,null),o.flags|=2,r.return=n,o.return=n,r.sibling=o,n.child=r,n.mode&1&&pt(n,e.child,null,a),n.child.memoizedState=na(a),n.memoizedState=ea,o);if(!(n.mode&1))return Pr(e,n,a,null);if(s.data==="$!"){if(r=s.nextSibling&&s.nextSibling.dataset,r)var i=r.dgst;return r=i,o=Error(j(419)),r=po(o,r,void 0),Pr(e,n,a,r)}if(i=(a&e.childLanes)!==0,he||i){if(r=ee,r!==null){switch(a&-a){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(r.suspendedLanes|a)?0:s,s!==0&&s!==o.retryLane&&(o.retryLane=s,Ke(e,s),Ie(r,e,s,-1))}return ai(),r=po(Error(j(421))),Pr(e,n,a,r)}return s.data==="$?"?(n.flags|=128,n.child=e.child,n=Ih.bind(null,e),s._reactRetry=n,null):(e=o.treeContext,we=hn(s.nextSibling),xe=n,D=!0,_e=null,e!==null&&(Ee[Te++]=We,Ee[Te++]=Ve,Ee[Te++]=In,We=e.id,Ve=e.overflow,In=n),n=ei(n,r.children),n.flags|=4096,n)}function pl(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),Qo(e.return,n,t)}function ho(e,n,t,r,s){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:s}:(o.isBackwards=n,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=t,o.tailMode=s)}function Nc(e,n,t){var r=n.pendingProps,s=r.revealOrder,o=r.tail;if(le(e,n,r.children,t),r=H.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&pl(e,t,n);else if(e.tag===19)pl(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(I(H,r),!(n.mode&1))n.memoizedState=null;else switch(s){case"forwards":for(t=n.child,s=null;t!==null;)e=t.alternate,e!==null&&cs(e)===null&&(s=t),t=t.sibling;t=s,t===null?(s=n.child,n.child=null):(s=t.sibling,t.sibling=null),ho(n,!1,s,t,o);break;case"backwards":for(t=null,s=n.child,n.child=null;s!==null;){if(e=s.alternate,e!==null&&cs(e)===null){n.child=s;break}e=s.sibling,s.sibling=t,t=s,s=e}ho(n,!0,t,null,o);break;case"together":ho(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Br(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function Xe(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),zn|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(j(153));if(n.child!==null){for(e=n.child,t=yn(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=yn(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function Eh(e,n,t){switch(n.tag){case 3:Tc(n),dt();break;case 5:Zu(n);break;case 1:me(n.type)&&ss(n);break;case 4:Va(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,s=n.memoizedProps.value;I(is,r._currentValue),r._currentValue=s;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(I(H,H.current&1),n.flags|=128,null):t&n.child.childLanes?Cc(e,n,t):(I(H,H.current&1),e=Xe(e,n,t),e!==null?e.sibling:null);I(H,H.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return Nc(e,n,t);n.flags|=128}if(s=n.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),I(H,H.current),r)break;return null;case 22:case 23:return n.lanes=0,Sc(e,n,t)}return Xe(e,n,t)}var bc,ta,Ac,Rc;bc=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};ta=function(){};Ac=function(e,n,t,r){var s=e.memoizedProps;if(s!==r){e=n.stateNode,qn(Ue.current);var o=null;switch(t){case"input":s=Eo(e,s),r=Eo(e,r),o=[];break;case"select":s=B({},s,{value:void 0}),r=B({},r,{value:void 0}),o=[];break;case"textarea":s=No(e,s),r=No(e,r),o=[];break;default:typeof s.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ts)}Ao(t,r);var a;t=null;for(c in s)if(!r.hasOwnProperty(c)&&s.hasOwnProperty(c)&&s[c]!=null)if(c==="style"){var i=s[c];for(a in i)i.hasOwnProperty(a)&&(t||(t={}),t[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Gt.hasOwnProperty(c)?o||(o=[]):(o=o||[]).push(c,null));for(c in r){var u=r[c];if(i=s!=null?s[c]:void 0,r.hasOwnProperty(c)&&u!==i&&(u!=null||i!=null))if(c==="style")if(i){for(a in i)!i.hasOwnProperty(a)||u&&u.hasOwnProperty(a)||(t||(t={}),t[a]="");for(a in u)u.hasOwnProperty(a)&&i[a]!==u[a]&&(t||(t={}),t[a]=u[a])}else t||(o||(o=[]),o.push(c,t)),t=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,i=i?i.__html:void 0,u!=null&&i!==u&&(o=o||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(o=o||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Gt.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&L("scroll",e),o||i===u||(o=[])):(o=o||[]).push(c,u))}t&&(o=o||[]).push("style",t);var c=o;(n.updateQueue=c)&&(n.flags|=4)}};Rc=function(e,n,t,r){t!==r&&(n.flags|=4)};function Rt(e,n){if(!D)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function oe(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var s=e.child;s!==null;)t|=s.lanes|s.childLanes,r|=s.subtreeFlags&14680064,r|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)t|=s.lanes|s.childLanes,r|=s.subtreeFlags,r|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function Th(e,n,t){var r=n.pendingProps;switch(Da(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return oe(n),null;case 1:return me(n.type)&&rs(),oe(n),null;case 3:return r=n.stateNode,ht(),z(fe),z(ie),Qa(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Rr(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,_e!==null&&(ca(_e),_e=null))),ta(e,n),oe(n),null;case 5:Ga(n);var s=qn(or.current);if(t=n.type,e!==null&&n.stateNode!=null)Ac(e,n,t,r,s),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(j(166));return oe(n),null}if(e=qn(Ue.current),Rr(n)){r=n.stateNode,t=n.type;var o=n.memoizedProps;switch(r[Fe]=n,r[rr]=o,e=(n.mode&1)!==0,t){case"dialog":L("cancel",r),L("close",r);break;case"iframe":case"object":case"embed":L("load",r);break;case"video":case"audio":for(s=0;s<Mt.length;s++)L(Mt[s],r);break;case"source":L("error",r);break;case"img":case"image":case"link":L("error",r),L("load",r);break;case"details":L("toggle",r);break;case"input":ki(r,o),L("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},L("invalid",r);break;case"textarea":Si(r,o),L("invalid",r)}Ao(t,o),s=null;for(var a in o)if(o.hasOwnProperty(a)){var i=o[a];a==="children"?typeof i=="string"?r.textContent!==i&&(o.suppressHydrationWarning!==!0&&Ar(r.textContent,i,e),s=["children",i]):typeof i=="number"&&r.textContent!==""+i&&(o.suppressHydrationWarning!==!0&&Ar(r.textContent,i,e),s=["children",""+i]):Gt.hasOwnProperty(a)&&i!=null&&a==="onScroll"&&L("scroll",r)}switch(t){case"input":kr(r),ji(r,o,!0);break;case"textarea":kr(r),Ei(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=ts)}r=s,n.updateQueue=r,r!==null&&(n.flags|=4)}else{a=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=su(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(t,{is:r.is}):(e=a.createElement(t),t==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,t),e[Fe]=n,e[rr]=r,bc(e,n,!1,!1),n.stateNode=e;e:{switch(a=Ro(t,r),t){case"dialog":L("cancel",e),L("close",e),s=r;break;case"iframe":case"object":case"embed":L("load",e),s=r;break;case"video":case"audio":for(s=0;s<Mt.length;s++)L(Mt[s],e);s=r;break;case"source":L("error",e),s=r;break;case"img":case"image":case"link":L("error",e),L("load",e),s=r;break;case"details":L("toggle",e),s=r;break;case"input":ki(e,r),s=Eo(e,r),L("invalid",e);break;case"option":s=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},s=B({},r,{value:void 0}),L("invalid",e);break;case"textarea":Si(e,r),s=No(e,r),L("invalid",e);break;default:s=r}Ao(t,s),i=s;for(o in i)if(i.hasOwnProperty(o)){var u=i[o];o==="style"?iu(e,u):o==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&ou(e,u)):o==="children"?typeof u=="string"?(t!=="textarea"||u!=="")&&Qt(e,u):typeof u=="number"&&Qt(e,""+u):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(Gt.hasOwnProperty(o)?u!=null&&o==="onScroll"&&L("scroll",e):u!=null&&Ea(e,o,u,a))}switch(t){case"input":kr(e),ji(e,r,!1);break;case"textarea":kr(e),Ei(e);break;case"option":r.value!=null&&e.setAttribute("value",""+wn(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?tt(e,!!r.multiple,o,!1):r.defaultValue!=null&&tt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=ts)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return oe(n),null;case 6:if(e&&n.stateNode!=null)Rc(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(j(166));if(t=qn(or.current),qn(Ue.current),Rr(n)){if(r=n.stateNode,t=n.memoizedProps,r[Fe]=n,(o=r.nodeValue!==t)&&(e=xe,e!==null))switch(e.tag){case 3:Ar(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ar(r.nodeValue,t,(e.mode&1)!==0)}o&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[Fe]=n,n.stateNode=r}return oe(n),null;case 13:if(z(H),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(D&&we!==null&&n.mode&1&&!(n.flags&128))Qu(),dt(),n.flags|=98560,o=!1;else if(o=Rr(n),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(j(318));if(o=n.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(j(317));o[Fe]=n}else dt(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;oe(n),o=!1}else _e!==null&&(ca(_e),_e=null),o=!0;if(!o)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||H.current&1?X===0&&(X=3):ai())),n.updateQueue!==null&&(n.flags|=4),oe(n),null);case 4:return ht(),ta(e,n),e===null&&nr(n.stateNode.containerInfo),oe(n),null;case 10:return $a(n.type._context),oe(n),null;case 17:return me(n.type)&&rs(),oe(n),null;case 19:if(z(H),o=n.memoizedState,o===null)return oe(n),null;if(r=(n.flags&128)!==0,a=o.rendering,a===null)if(r)Rt(o,!1);else{if(X!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(a=cs(e),a!==null){for(n.flags|=128,Rt(o,!1),r=a.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)o=t,e=r,o.flags&=14680066,a=o.alternate,a===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=a.childLanes,o.lanes=a.lanes,o.child=a.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=a.memoizedProps,o.memoizedState=a.memoizedState,o.updateQueue=a.updateQueue,o.type=a.type,e=a.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return I(H,H.current&1|2),n.child}e=e.sibling}o.tail!==null&&Q()>mt&&(n.flags|=128,r=!0,Rt(o,!1),n.lanes=4194304)}else{if(!r)if(e=cs(a),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),Rt(o,!0),o.tail===null&&o.tailMode==="hidden"&&!a.alternate&&!D)return oe(n),null}else 2*Q()-o.renderingStartTime>mt&&t!==1073741824&&(n.flags|=128,r=!0,Rt(o,!1),n.lanes=4194304);o.isBackwards?(a.sibling=n.child,n.child=a):(t=o.last,t!==null?t.sibling=a:n.child=a,o.last=a)}return o.tail!==null?(n=o.tail,o.rendering=n,o.tail=n.sibling,o.renderingStartTime=Q(),n.sibling=null,t=H.current,I(H,r?t&1|2:t&1),n):(oe(n),null);case 22:case 23:return oi(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?ve&1073741824&&(oe(n),n.subtreeFlags&6&&(n.flags|=8192)):oe(n),null;case 24:return null;case 25:return null}throw Error(j(156,n.tag))}function Ch(e,n){switch(Da(n),n.tag){case 1:return me(n.type)&&rs(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return ht(),z(fe),z(ie),Qa(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return Ga(n),null;case 13:if(z(H),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(j(340));dt()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return z(H),null;case 4:return ht(),null;case 10:return $a(n.type._context),null;case 22:case 23:return oi(),null;case 24:return null;default:return null}}var _r=!1,ae=!1,Nh=typeof WeakSet=="function"?WeakSet:Set,T=null;function et(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){V(e,n,r)}else t.current=null}function ra(e,n,t){try{t()}catch(r){V(e,n,r)}}var hl=!1;function bh(e,n){if(Fo=Zr,e=Mu(),La(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var s=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var a=0,i=-1,u=-1,c=0,g=0,d=e,m=null;n:for(;;){for(var v;d!==t||s!==0&&d.nodeType!==3||(i=a+s),d!==o||r!==0&&d.nodeType!==3||(u=a+r),d.nodeType===3&&(a+=d.nodeValue.length),(v=d.firstChild)!==null;)m=d,d=v;for(;;){if(d===e)break n;if(m===t&&++c===s&&(i=a),m===o&&++g===r&&(u=a),(v=d.nextSibling)!==null)break;d=m,m=d.parentNode}d=v}t=i===-1||u===-1?null:{start:i,end:u}}else t=null}t=t||{start:0,end:0}}else t=null;for(Ho={focusedElem:e,selectionRange:t},Zr=!1,T=n;T!==null;)if(n=T,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,T=e;else for(;T!==null;){n=T;try{var w=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var x=w.memoizedProps,S=w.memoizedState,h=n.stateNode,p=h.getSnapshotBeforeUpdate(n.elementType===n.type?x:qe(n.type,x),S);h.__reactInternalSnapshotBeforeUpdate=p}break;case 3:var f=n.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(y){V(n,n.return,y)}if(e=n.sibling,e!==null){e.return=n.return,T=e;break}T=n.return}return w=hl,hl=!1,w}function Bt(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var s=r=r.next;do{if((s.tag&e)===e){var o=s.destroy;s.destroy=void 0,o!==void 0&&ra(n,t,o)}s=s.next}while(s!==r)}}function As(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function sa(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function qc(e){var n=e.alternate;n!==null&&(e.alternate=null,qc(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[Fe],delete n[rr],delete n[Bo],delete n[ch],delete n[dh])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Pc(e){return e.tag===5||e.tag===3||e.tag===4}function fl(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Pc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function oa(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=ts));else if(r!==4&&(e=e.child,e!==null))for(oa(e,n,t),e=e.sibling;e!==null;)oa(e,n,t),e=e.sibling}function aa(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(aa(e,n,t),e=e.sibling;e!==null;)aa(e,n,t),e=e.sibling}var ne=null,Pe=!1;function nn(e,n,t){for(t=t.child;t!==null;)_c(e,n,t),t=t.sibling}function _c(e,n,t){if(He&&typeof He.onCommitFiberUnmount=="function")try{He.onCommitFiberUnmount(ks,t)}catch{}switch(t.tag){case 5:ae||et(t,n);case 6:var r=ne,s=Pe;ne=null,nn(e,n,t),ne=r,Pe=s,ne!==null&&(Pe?(e=ne,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):ne.removeChild(t.stateNode));break;case 18:ne!==null&&(Pe?(e=ne,t=t.stateNode,e.nodeType===8?oo(e.parentNode,t):e.nodeType===1&&oo(e,t),Yt(e)):oo(ne,t.stateNode));break;case 4:r=ne,s=Pe,ne=t.stateNode.containerInfo,Pe=!0,nn(e,n,t),ne=r,Pe=s;break;case 0:case 11:case 14:case 15:if(!ae&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){s=r=r.next;do{var o=s,a=o.destroy;o=o.tag,a!==void 0&&(o&2||o&4)&&ra(t,n,a),s=s.next}while(s!==r)}nn(e,n,t);break;case 1:if(!ae&&(et(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(i){V(t,n,i)}nn(e,n,t);break;case 21:nn(e,n,t);break;case 22:t.mode&1?(ae=(r=ae)||t.memoizedState!==null,nn(e,n,t),ae=r):nn(e,n,t);break;default:nn(e,n,t)}}function ml(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new Nh),n.forEach(function(r){var s=Lh.bind(null,e,r);t.has(r)||(t.add(r),r.then(s,s))})}}function Re(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var s=t[r];try{var o=e,a=n,i=a;e:for(;i!==null;){switch(i.tag){case 5:ne=i.stateNode,Pe=!1;break e;case 3:ne=i.stateNode.containerInfo,Pe=!0;break e;case 4:ne=i.stateNode.containerInfo,Pe=!0;break e}i=i.return}if(ne===null)throw Error(j(160));_c(o,a,s),ne=null,Pe=!1;var u=s.alternate;u!==null&&(u.return=null),s.return=null}catch(c){V(s,n,c)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Oc(n,e),n=n.sibling}function Oc(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Re(n,e),ze(e),r&4){try{Bt(3,e,e.return),As(3,e)}catch(x){V(e,e.return,x)}try{Bt(5,e,e.return)}catch(x){V(e,e.return,x)}}break;case 1:Re(n,e),ze(e),r&512&&t!==null&&et(t,t.return);break;case 5:if(Re(n,e),ze(e),r&512&&t!==null&&et(t,t.return),e.flags&32){var s=e.stateNode;try{Qt(s,"")}catch(x){V(e,e.return,x)}}if(r&4&&(s=e.stateNode,s!=null)){var o=e.memoizedProps,a=t!==null?t.memoizedProps:o,i=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{i==="input"&&o.type==="radio"&&o.name!=null&&tu(s,o),Ro(i,a);var c=Ro(i,o);for(a=0;a<u.length;a+=2){var g=u[a],d=u[a+1];g==="style"?iu(s,d):g==="dangerouslySetInnerHTML"?ou(s,d):g==="children"?Qt(s,d):Ea(s,g,d,c)}switch(i){case"input":To(s,o);break;case"textarea":ru(s,o);break;case"select":var m=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!o.multiple;var v=o.value;v!=null?tt(s,!!o.multiple,v,!1):m!==!!o.multiple&&(o.defaultValue!=null?tt(s,!!o.multiple,o.defaultValue,!0):tt(s,!!o.multiple,o.multiple?[]:"",!1))}s[rr]=o}catch(x){V(e,e.return,x)}}break;case 6:if(Re(n,e),ze(e),r&4){if(e.stateNode===null)throw Error(j(162));s=e.stateNode,o=e.memoizedProps;try{s.nodeValue=o}catch(x){V(e,e.return,x)}}break;case 3:if(Re(n,e),ze(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{Yt(n.containerInfo)}catch(x){V(e,e.return,x)}break;case 4:Re(n,e),ze(e);break;case 13:Re(n,e),ze(e),s=e.child,s.flags&8192&&(o=s.memoizedState!==null,s.stateNode.isHidden=o,!o||s.alternate!==null&&s.alternate.memoizedState!==null||(ri=Q())),r&4&&ml(e);break;case 22:if(g=t!==null&&t.memoizedState!==null,e.mode&1?(ae=(c=ae)||g,Re(n,e),ae=c):Re(n,e),ze(e),r&8192){if(c=e.memoizedState!==null,(e.stateNode.isHidden=c)&&!g&&e.mode&1)for(T=e,g=e.child;g!==null;){for(d=T=g;T!==null;){switch(m=T,v=m.child,m.tag){case 0:case 11:case 14:case 15:Bt(4,m,m.return);break;case 1:et(m,m.return);var w=m.stateNode;if(typeof w.componentWillUnmount=="function"){r=m,t=m.return;try{n=r,w.props=n.memoizedProps,w.state=n.memoizedState,w.componentWillUnmount()}catch(x){V(r,t,x)}}break;case 5:et(m,m.return);break;case 22:if(m.memoizedState!==null){yl(d);continue}}v!==null?(v.return=m,T=v):yl(d)}g=g.sibling}e:for(g=null,d=e;;){if(d.tag===5){if(g===null){g=d;try{s=d.stateNode,c?(o=s.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(i=d.stateNode,u=d.memoizedProps.style,a=u!=null&&u.hasOwnProperty("display")?u.display:null,i.style.display=au("display",a))}catch(x){V(e,e.return,x)}}}else if(d.tag===6){if(g===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(x){V(e,e.return,x)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===e)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===e)break e;for(;d.sibling===null;){if(d.return===null||d.return===e)break e;g===d&&(g=null),d=d.return}g===d&&(g=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:Re(n,e),ze(e),r&4&&ml(e);break;case 21:break;default:Re(n,e),ze(e)}}function ze(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(Pc(t)){var r=t;break e}t=t.return}throw Error(j(160))}switch(r.tag){case 5:var s=r.stateNode;r.flags&32&&(Qt(s,""),r.flags&=-33);var o=fl(e);aa(e,o,s);break;case 3:case 4:var a=r.stateNode.containerInfo,i=fl(e);oa(e,i,a);break;default:throw Error(j(161))}}catch(u){V(e,e.return,u)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Ah(e,n,t){T=e,Mc(e)}function Mc(e,n,t){for(var r=(e.mode&1)!==0;T!==null;){var s=T,o=s.child;if(s.tag===22&&r){var a=s.memoizedState!==null||_r;if(!a){var i=s.alternate,u=i!==null&&i.memoizedState!==null||ae;i=_r;var c=ae;if(_r=a,(ae=u)&&!c)for(T=s;T!==null;)a=T,u=a.child,a.tag===22&&a.memoizedState!==null?vl(s):u!==null?(u.return=a,T=u):vl(s);for(;o!==null;)T=o,Mc(o),o=o.sibling;T=s,_r=i,ae=c}gl(e)}else s.subtreeFlags&8772&&o!==null?(o.return=s,T=o):gl(e)}}function gl(e){for(;T!==null;){var n=T;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:ae||As(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!ae)if(t===null)r.componentDidMount();else{var s=n.elementType===n.type?t.memoizedProps:qe(n.type,t.memoizedProps);r.componentDidUpdate(s,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=n.updateQueue;o!==null&&el(n,o,r);break;case 3:var a=n.updateQueue;if(a!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}el(n,a,t)}break;case 5:var i=n.stateNode;if(t===null&&n.flags&4){t=i;var u=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&t.focus();break;case"img":u.src&&(t.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var c=n.alternate;if(c!==null){var g=c.memoizedState;if(g!==null){var d=g.dehydrated;d!==null&&Yt(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}ae||n.flags&512&&sa(n)}catch(m){V(n,n.return,m)}}if(n===e){T=null;break}if(t=n.sibling,t!==null){t.return=n.return,T=t;break}T=n.return}}function yl(e){for(;T!==null;){var n=T;if(n===e){T=null;break}var t=n.sibling;if(t!==null){t.return=n.return,T=t;break}T=n.return}}function vl(e){for(;T!==null;){var n=T;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{As(4,n)}catch(u){V(n,t,u)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var s=n.return;try{r.componentDidMount()}catch(u){V(n,s,u)}}var o=n.return;try{sa(n)}catch(u){V(n,o,u)}break;case 5:var a=n.return;try{sa(n)}catch(u){V(n,a,u)}}}catch(u){V(n,n.return,u)}if(n===e){T=null;break}var i=n.sibling;if(i!==null){i.return=n.return,T=i;break}T=n.return}}var Rh=Math.ceil,hs=Ye.ReactCurrentDispatcher,ni=Ye.ReactCurrentOwner,Ne=Ye.ReactCurrentBatchConfig,O=0,ee=null,J=null,te=0,ve=0,nt=jn(0),X=0,ur=null,zn=0,Rs=0,ti=0,Wt=null,pe=null,ri=0,mt=1/0,$e=null,fs=!1,ia=null,mn=null,Or=!1,ln=null,ms=0,Vt=0,la=null,Wr=-1,Vr=0;function ue(){return O&6?Q():Wr!==-1?Wr:Wr=Q()}function gn(e){return e.mode&1?O&2&&te!==0?te&-te:hh.transition!==null?(Vr===0&&(Vr=wu()),Vr):(e=M,e!==0||(e=window.event,e=e===void 0?16:Cu(e.type)),e):1}function Ie(e,n,t,r){if(50<Vt)throw Vt=0,la=null,Error(j(185));hr(e,t,r),(!(O&2)||e!==ee)&&(e===ee&&(!(O&2)&&(Rs|=t),X===4&&on(e,te)),ge(e,r),t===1&&O===0&&!(n.mode&1)&&(mt=Q()+500,Cs&&Sn()))}function ge(e,n){var t=e.callbackNode;hp(e,n);var r=Yr(e,e===ee?te:0);if(r===0)t!==null&&Ni(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&Ni(t),n===1)e.tag===0?ph(wl.bind(null,e)):Wu(wl.bind(null,e)),lh(function(){!(O&6)&&Sn()}),t=null;else{switch(xu(r)){case 1:t=Aa;break;case 4:t=yu;break;case 16:t=Xr;break;case 536870912:t=vu;break;default:t=Xr}t=$c(t,Ic.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Ic(e,n){if(Wr=-1,Vr=0,O&6)throw Error(j(327));var t=e.callbackNode;if(it()&&e.callbackNode!==t)return null;var r=Yr(e,e===ee?te:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=gs(e,r);else{n=r;var s=O;O|=2;var o=zc();(ee!==e||te!==n)&&($e=null,mt=Q()+500,_n(e,n));do try{_h();break}catch(i){Lc(e,i)}while(!0);Ua(),hs.current=o,O=s,J!==null?n=0:(ee=null,te=0,n=X)}if(n!==0){if(n===2&&(s=Mo(e),s!==0&&(r=s,n=ua(e,s))),n===1)throw t=ur,_n(e,0),on(e,r),ge(e,Q()),t;if(n===6)on(e,r);else{if(s=e.current.alternate,!(r&30)&&!qh(s)&&(n=gs(e,r),n===2&&(o=Mo(e),o!==0&&(r=o,n=ua(e,o))),n===1))throw t=ur,_n(e,0),on(e,r),ge(e,Q()),t;switch(e.finishedWork=s,e.finishedLanes=r,n){case 0:case 1:throw Error(j(345));case 2:Nn(e,pe,$e);break;case 3:if(on(e,r),(r&130023424)===r&&(n=ri+500-Q(),10<n)){if(Yr(e,0)!==0)break;if(s=e.suspendedLanes,(s&r)!==r){ue(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=$o(Nn.bind(null,e,pe,$e),n);break}Nn(e,pe,$e);break;case 4:if(on(e,r),(r&4194240)===r)break;for(n=e.eventTimes,s=-1;0<r;){var a=31-Me(r);o=1<<a,a=n[a],a>s&&(s=a),r&=~o}if(r=s,r=Q()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Rh(r/1960))-r,10<r){e.timeoutHandle=$o(Nn.bind(null,e,pe,$e),r);break}Nn(e,pe,$e);break;case 5:Nn(e,pe,$e);break;default:throw Error(j(329))}}}return ge(e,Q()),e.callbackNode===t?Ic.bind(null,e):null}function ua(e,n){var t=Wt;return e.current.memoizedState.isDehydrated&&(_n(e,n).flags|=256),e=gs(e,n),e!==2&&(n=pe,pe=t,n!==null&&ca(n)),e}function ca(e){pe===null?pe=e:pe.push.apply(pe,e)}function qh(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var s=t[r],o=s.getSnapshot;s=s.value;try{if(!Le(o(),s))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function on(e,n){for(n&=~ti,n&=~Rs,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-Me(n),r=1<<t;e[t]=-1,n&=~r}}function wl(e){if(O&6)throw Error(j(327));it();var n=Yr(e,0);if(!(n&1))return ge(e,Q()),null;var t=gs(e,n);if(e.tag!==0&&t===2){var r=Mo(e);r!==0&&(n=r,t=ua(e,r))}if(t===1)throw t=ur,_n(e,0),on(e,n),ge(e,Q()),t;if(t===6)throw Error(j(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,Nn(e,pe,$e),ge(e,Q()),null}function si(e,n){var t=O;O|=1;try{return e(n)}finally{O=t,O===0&&(mt=Q()+500,Cs&&Sn())}}function Dn(e){ln!==null&&ln.tag===0&&!(O&6)&&it();var n=O;O|=1;var t=Ne.transition,r=M;try{if(Ne.transition=null,M=1,e)return e()}finally{M=r,Ne.transition=t,O=n,!(O&6)&&Sn()}}function oi(){ve=nt.current,z(nt)}function _n(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,ih(t)),J!==null)for(t=J.return;t!==null;){var r=t;switch(Da(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&rs();break;case 3:ht(),z(fe),z(ie),Qa();break;case 5:Ga(r);break;case 4:ht();break;case 13:z(H);break;case 19:z(H);break;case 10:$a(r.type._context);break;case 22:case 23:oi()}t=t.return}if(ee=e,J=e=yn(e.current,null),te=ve=n,X=0,ur=null,ti=Rs=zn=0,pe=Wt=null,Rn!==null){for(n=0;n<Rn.length;n++)if(t=Rn[n],r=t.interleaved,r!==null){t.interleaved=null;var s=r.next,o=t.pending;if(o!==null){var a=o.next;o.next=s,r.next=a}t.pending=r}Rn=null}return e}function Lc(e,n){do{var t=J;try{if(Ua(),Ur.current=ps,ds){for(var r=U.memoizedState;r!==null;){var s=r.queue;s!==null&&(s.pending=null),r=r.next}ds=!1}if(Ln=0,Z=K=U=null,$t=!1,ar=0,ni.current=null,t===null||t.return===null){X=1,ur=n,J=null;break}e:{var o=e,a=t.return,i=t,u=n;if(n=te,i.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,g=i,d=g.tag;if(!(g.mode&1)&&(d===0||d===11||d===15)){var m=g.alternate;m?(g.updateQueue=m.updateQueue,g.memoizedState=m.memoizedState,g.lanes=m.lanes):(g.updateQueue=null,g.memoizedState=null)}var v=al(a);if(v!==null){v.flags&=-257,il(v,a,i,o,n),v.mode&1&&ol(o,c,n),n=v,u=c;var w=n.updateQueue;if(w===null){var x=new Set;x.add(u),n.updateQueue=x}else w.add(u);break e}else{if(!(n&1)){ol(o,c,n),ai();break e}u=Error(j(426))}}else if(D&&i.mode&1){var S=al(a);if(S!==null){!(S.flags&65536)&&(S.flags|=256),il(S,a,i,o,n),Fa(ft(u,i));break e}}o=u=ft(u,i),X!==4&&(X=2),Wt===null?Wt=[o]:Wt.push(o),o=a;do{switch(o.tag){case 3:o.flags|=65536,n&=-n,o.lanes|=n;var h=xc(o,u,n);Zi(o,h);break e;case 1:i=u;var p=o.type,f=o.stateNode;if(!(o.flags&128)&&(typeof p.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(mn===null||!mn.has(f)))){o.flags|=65536,n&=-n,o.lanes|=n;var y=kc(o,i,n);Zi(o,y);break e}}o=o.return}while(o!==null)}Fc(t)}catch(E){n=E,J===t&&t!==null&&(J=t=t.return);continue}break}while(!0)}function zc(){var e=hs.current;return hs.current=ps,e===null?ps:e}function ai(){(X===0||X===3||X===2)&&(X=4),ee===null||!(zn&268435455)&&!(Rs&268435455)||on(ee,te)}function gs(e,n){var t=O;O|=2;var r=zc();(ee!==e||te!==n)&&($e=null,_n(e,n));do try{Ph();break}catch(s){Lc(e,s)}while(!0);if(Ua(),O=t,hs.current=r,J!==null)throw Error(j(261));return ee=null,te=0,X}function Ph(){for(;J!==null;)Dc(J)}function _h(){for(;J!==null&&!sp();)Dc(J)}function Dc(e){var n=Uc(e.alternate,e,ve);e.memoizedProps=e.pendingProps,n===null?Fc(e):J=n,ni.current=null}function Fc(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=Ch(t,n),t!==null){t.flags&=32767,J=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{X=6,J=null;return}}else if(t=Th(t,n,ve),t!==null){J=t;return}if(n=n.sibling,n!==null){J=n;return}J=n=e}while(n!==null);X===0&&(X=5)}function Nn(e,n,t){var r=M,s=Ne.transition;try{Ne.transition=null,M=1,Oh(e,n,t,r)}finally{Ne.transition=s,M=r}return null}function Oh(e,n,t,r){do it();while(ln!==null);if(O&6)throw Error(j(327));t=e.finishedWork;var s=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(j(177));e.callbackNode=null,e.callbackPriority=0;var o=t.lanes|t.childLanes;if(fp(e,o),e===ee&&(J=ee=null,te=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||Or||(Or=!0,$c(Xr,function(){return it(),null})),o=(t.flags&15990)!==0,t.subtreeFlags&15990||o){o=Ne.transition,Ne.transition=null;var a=M;M=1;var i=O;O|=4,ni.current=null,bh(e,t),Oc(t,e),eh(Ho),Zr=!!Fo,Ho=Fo=null,e.current=t,Ah(t),op(),O=i,M=a,Ne.transition=o}else e.current=t;if(Or&&(Or=!1,ln=e,ms=s),o=e.pendingLanes,o===0&&(mn=null),lp(t.stateNode),ge(e,Q()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)s=n[t],r(s.value,{componentStack:s.stack,digest:s.digest});if(fs)throw fs=!1,e=ia,ia=null,e;return ms&1&&e.tag!==0&&it(),o=e.pendingLanes,o&1?e===la?Vt++:(Vt=0,la=e):Vt=0,Sn(),null}function it(){if(ln!==null){var e=xu(ms),n=Ne.transition,t=M;try{if(Ne.transition=null,M=16>e?16:e,ln===null)var r=!1;else{if(e=ln,ln=null,ms=0,O&6)throw Error(j(331));var s=O;for(O|=4,T=e.current;T!==null;){var o=T,a=o.child;if(T.flags&16){var i=o.deletions;if(i!==null){for(var u=0;u<i.length;u++){var c=i[u];for(T=c;T!==null;){var g=T;switch(g.tag){case 0:case 11:case 15:Bt(8,g,o)}var d=g.child;if(d!==null)d.return=g,T=d;else for(;T!==null;){g=T;var m=g.sibling,v=g.return;if(qc(g),g===c){T=null;break}if(m!==null){m.return=v,T=m;break}T=v}}}var w=o.alternate;if(w!==null){var x=w.child;if(x!==null){w.child=null;do{var S=x.sibling;x.sibling=null,x=S}while(x!==null)}}T=o}}if(o.subtreeFlags&2064&&a!==null)a.return=o,T=a;else e:for(;T!==null;){if(o=T,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Bt(9,o,o.return)}var h=o.sibling;if(h!==null){h.return=o.return,T=h;break e}T=o.return}}var p=e.current;for(T=p;T!==null;){a=T;var f=a.child;if(a.subtreeFlags&2064&&f!==null)f.return=a,T=f;else e:for(a=p;T!==null;){if(i=T,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:As(9,i)}}catch(E){V(i,i.return,E)}if(i===a){T=null;break e}var y=i.sibling;if(y!==null){y.return=i.return,T=y;break e}T=i.return}}if(O=s,Sn(),He&&typeof He.onPostCommitFiberRoot=="function")try{He.onPostCommitFiberRoot(ks,e)}catch{}r=!0}return r}finally{M=t,Ne.transition=n}}return!1}function xl(e,n,t){n=ft(t,n),n=xc(e,n,1),e=fn(e,n,1),n=ue(),e!==null&&(hr(e,1,n),ge(e,n))}function V(e,n,t){if(e.tag===3)xl(e,e,t);else for(;n!==null;){if(n.tag===3){xl(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(mn===null||!mn.has(r))){e=ft(t,e),e=kc(n,e,1),n=fn(n,e,1),e=ue(),n!==null&&(hr(n,1,e),ge(n,e));break}}n=n.return}}function Mh(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=ue(),e.pingedLanes|=e.suspendedLanes&t,ee===e&&(te&t)===t&&(X===4||X===3&&(te&130023424)===te&&500>Q()-ri?_n(e,0):ti|=t),ge(e,n)}function Hc(e,n){n===0&&(e.mode&1?(n=Er,Er<<=1,!(Er&130023424)&&(Er=4194304)):n=1);var t=ue();e=Ke(e,n),e!==null&&(hr(e,n,t),ge(e,t))}function Ih(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),Hc(e,t)}function Lh(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,s=e.memoizedState;s!==null&&(t=s.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(n),Hc(e,t)}var Uc;Uc=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||fe.current)he=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return he=!1,Eh(e,n,t);he=!!(e.flags&131072)}else he=!1,D&&n.flags&1048576&&Vu(n,as,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;Br(e,n),e=n.pendingProps;var s=ct(n,ie.current);at(n,t),s=Ka(null,n,r,e,s,t);var o=Xa();return n.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,me(r)?(o=!0,ss(n)):o=!1,n.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Wa(n),s.updater=bs,n.stateNode=s,s._reactInternals=n,Ko(n,r,e,t),n=Zo(null,n,r,!0,o,t)):(n.tag=0,D&&o&&za(n),le(null,n,s,t),n=n.child),n;case 16:r=n.elementType;e:{switch(Br(e,n),e=n.pendingProps,s=r._init,r=s(r._payload),n.type=r,s=n.tag=Dh(r),e=qe(r,e),s){case 0:n=Yo(null,n,r,e,t);break e;case 1:n=cl(null,n,r,e,t);break e;case 11:n=ll(null,n,r,e,t);break e;case 14:n=ul(null,n,r,qe(r.type,e),t);break e}throw Error(j(306,r,""))}return n;case 0:return r=n.type,s=n.pendingProps,s=n.elementType===r?s:qe(r,s),Yo(e,n,r,s,t);case 1:return r=n.type,s=n.pendingProps,s=n.elementType===r?s:qe(r,s),cl(e,n,r,s,t);case 3:e:{if(Tc(n),e===null)throw Error(j(387));r=n.pendingProps,o=n.memoizedState,s=o.element,Yu(e,n),us(n,r,null,t);var a=n.memoizedState;if(r=a.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},n.updateQueue.baseState=o,n.memoizedState=o,n.flags&256){s=ft(Error(j(423)),n),n=dl(e,n,r,t,s);break e}else if(r!==s){s=ft(Error(j(424)),n),n=dl(e,n,r,t,s);break e}else for(we=hn(n.stateNode.containerInfo.firstChild),xe=n,D=!0,_e=null,t=Ku(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(dt(),r===s){n=Xe(e,n,t);break e}le(e,n,r,t)}n=n.child}return n;case 5:return Zu(n),e===null&&Go(n),r=n.type,s=n.pendingProps,o=e!==null?e.memoizedProps:null,a=s.children,Uo(r,s)?a=null:o!==null&&Uo(r,o)&&(n.flags|=32),Ec(e,n),le(e,n,a,t),n.child;case 6:return e===null&&Go(n),null;case 13:return Cc(e,n,t);case 4:return Va(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=pt(n,null,r,t):le(e,n,r,t),n.child;case 11:return r=n.type,s=n.pendingProps,s=n.elementType===r?s:qe(r,s),ll(e,n,r,s,t);case 7:return le(e,n,n.pendingProps,t),n.child;case 8:return le(e,n,n.pendingProps.children,t),n.child;case 12:return le(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,s=n.pendingProps,o=n.memoizedProps,a=s.value,I(is,r._currentValue),r._currentValue=a,o!==null)if(Le(o.value,a)){if(o.children===s.children&&!fe.current){n=Xe(e,n,t);break e}}else for(o=n.child,o!==null&&(o.return=n);o!==null;){var i=o.dependencies;if(i!==null){a=o.child;for(var u=i.firstContext;u!==null;){if(u.context===r){if(o.tag===1){u=Ge(-1,t&-t),u.tag=2;var c=o.updateQueue;if(c!==null){c=c.shared;var g=c.pending;g===null?u.next=u:(u.next=g.next,g.next=u),c.pending=u}}o.lanes|=t,u=o.alternate,u!==null&&(u.lanes|=t),Qo(o.return,t,n),i.lanes|=t;break}u=u.next}}else if(o.tag===10)a=o.type===n.type?null:o.child;else if(o.tag===18){if(a=o.return,a===null)throw Error(j(341));a.lanes|=t,i=a.alternate,i!==null&&(i.lanes|=t),Qo(a,t,n),a=o.sibling}else a=o.child;if(a!==null)a.return=o;else for(a=o;a!==null;){if(a===n){a=null;break}if(o=a.sibling,o!==null){o.return=a.return,a=o;break}a=a.return}o=a}le(e,n,s.children,t),n=n.child}return n;case 9:return s=n.type,r=n.pendingProps.children,at(n,t),s=be(s),r=r(s),n.flags|=1,le(e,n,r,t),n.child;case 14:return r=n.type,s=qe(r,n.pendingProps),s=qe(r.type,s),ul(e,n,r,s,t);case 15:return jc(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,s=n.pendingProps,s=n.elementType===r?s:qe(r,s),Br(e,n),n.tag=1,me(r)?(e=!0,ss(n)):e=!1,at(n,t),wc(n,r,s),Ko(n,r,s,t),Zo(null,n,r,!0,e,t);case 19:return Nc(e,n,t);case 22:return Sc(e,n,t)}throw Error(j(156,n.tag))};function $c(e,n){return gu(e,n)}function zh(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ce(e,n,t,r){return new zh(e,n,t,r)}function ii(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Dh(e){if(typeof e=="function")return ii(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ca)return 11;if(e===Na)return 14}return 2}function yn(e,n){var t=e.alternate;return t===null?(t=Ce(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function Gr(e,n,t,r,s,o){var a=2;if(r=e,typeof e=="function")ii(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Wn:return On(t.children,s,o,n);case Ta:a=8,s|=8;break;case xo:return e=Ce(12,t,n,s|2),e.elementType=xo,e.lanes=o,e;case ko:return e=Ce(13,t,n,s),e.elementType=ko,e.lanes=o,e;case jo:return e=Ce(19,t,n,s),e.elementType=jo,e.lanes=o,e;case Zl:return qs(t,s,o,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Xl:a=10;break e;case Yl:a=9;break e;case Ca:a=11;break e;case Na:a=14;break e;case tn:a=16,r=null;break e}throw Error(j(130,e==null?e:typeof e,""))}return n=Ce(a,t,n,s),n.elementType=e,n.type=r,n.lanes=o,n}function On(e,n,t,r){return e=Ce(7,e,r,n),e.lanes=t,e}function qs(e,n,t,r){return e=Ce(22,e,r,n),e.elementType=Zl,e.lanes=t,e.stateNode={isHidden:!1},e}function fo(e,n,t){return e=Ce(6,e,null,n),e.lanes=t,e}function mo(e,n,t){return n=Ce(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function Fh(e,n,t,r,s){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qs(0),this.expirationTimes=Qs(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qs(0),this.identifierPrefix=r,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function li(e,n,t,r,s,o,a,i,u){return e=new Fh(e,n,t,i,u),n===1?(n=1,o===!0&&(n|=8)):n=0,o=Ce(3,null,null,n),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Wa(o),e}function Hh(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Bn,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function Bc(e){if(!e)return xn;e=e._reactInternals;e:{if(Hn(e)!==e||e.tag!==1)throw Error(j(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(me(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(j(171))}if(e.tag===1){var t=e.type;if(me(t))return Bu(e,t,n)}return n}function Wc(e,n,t,r,s,o,a,i,u){return e=li(t,r,!0,e,s,o,a,i,u),e.context=Bc(null),t=e.current,r=ue(),s=gn(t),o=Ge(r,s),o.callback=n??null,fn(t,o,s),e.current.lanes=s,hr(e,s,r),ge(e,r),e}function Ps(e,n,t,r){var s=n.current,o=ue(),a=gn(s);return t=Bc(t),n.context===null?n.context=t:n.pendingContext=t,n=Ge(o,a),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=fn(s,n,a),e!==null&&(Ie(e,s,a,o),Hr(e,s,a)),a}function ys(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function kl(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function ui(e,n){kl(e,n),(e=e.alternate)&&kl(e,n)}function Uh(){return null}var Vc=typeof reportError=="function"?reportError:function(e){console.error(e)};function ci(e){this._internalRoot=e}_s.prototype.render=ci.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(j(409));Ps(e,n,null,null)};_s.prototype.unmount=ci.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;Dn(function(){Ps(null,e,null,null)}),n[Je]=null}};function _s(e){this._internalRoot=e}_s.prototype.unstable_scheduleHydration=function(e){if(e){var n=Su();e={blockedOn:null,target:e,priority:n};for(var t=0;t<sn.length&&n!==0&&n<sn[t].priority;t++);sn.splice(t,0,e),t===0&&Tu(e)}};function di(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Os(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function jl(){}function $h(e,n,t,r,s){if(s){if(typeof r=="function"){var o=r;r=function(){var c=ys(a);o.call(c)}}var a=Wc(n,r,e,0,null,!1,!1,"",jl);return e._reactRootContainer=a,e[Je]=a.current,nr(e.nodeType===8?e.parentNode:e),Dn(),a}for(;s=e.lastChild;)e.removeChild(s);if(typeof r=="function"){var i=r;r=function(){var c=ys(u);i.call(c)}}var u=li(e,0,!1,null,null,!1,!1,"",jl);return e._reactRootContainer=u,e[Je]=u.current,nr(e.nodeType===8?e.parentNode:e),Dn(function(){Ps(n,u,t,r)}),u}function Ms(e,n,t,r,s){var o=t._reactRootContainer;if(o){var a=o;if(typeof s=="function"){var i=s;s=function(){var u=ys(a);i.call(u)}}Ps(n,a,e,s)}else a=$h(t,n,e,s,r);return ys(a)}ku=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=Ot(n.pendingLanes);t!==0&&(Ra(n,t|1),ge(n,Q()),!(O&6)&&(mt=Q()+500,Sn()))}break;case 13:Dn(function(){var r=Ke(e,1);if(r!==null){var s=ue();Ie(r,e,1,s)}}),ui(e,1)}};qa=function(e){if(e.tag===13){var n=Ke(e,134217728);if(n!==null){var t=ue();Ie(n,e,134217728,t)}ui(e,134217728)}};ju=function(e){if(e.tag===13){var n=gn(e),t=Ke(e,n);if(t!==null){var r=ue();Ie(t,e,n,r)}ui(e,n)}};Su=function(){return M};Eu=function(e,n){var t=M;try{return M=e,n()}finally{M=t}};Po=function(e,n,t){switch(n){case"input":if(To(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var s=Ts(r);if(!s)throw Error(j(90));nu(r),To(r,s)}}}break;case"textarea":ru(e,t);break;case"select":n=t.value,n!=null&&tt(e,!!t.multiple,n,!1)}};cu=si;du=Dn;var Bh={usingClientEntryPoint:!1,Events:[mr,Jn,Ts,lu,uu,si]},qt={findFiberByHostInstance:An,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Wh={bundleType:qt.bundleType,version:qt.version,rendererPackageName:qt.rendererPackageName,rendererConfig:qt.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ye.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=fu(e),e===null?null:e.stateNode},findFiberByHostInstance:qt.findFiberByHostInstance||Uh,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Mr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Mr.isDisabled&&Mr.supportsFiber)try{ks=Mr.inject(Wh),He=Mr}catch{}}je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Bh;je.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!di(n))throw Error(j(200));return Hh(e,n,null,t)};je.createRoot=function(e,n){if(!di(e))throw Error(j(299));var t=!1,r="",s=Vc;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),n=li(e,1,!1,null,null,t,!1,r,s),e[Je]=n.current,nr(e.nodeType===8?e.parentNode:e),new ci(n)};je.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=fu(n),e=e===null?null:e.stateNode,e};je.flushSync=function(e){return Dn(e)};je.hydrate=function(e,n,t){if(!Os(n))throw Error(j(200));return Ms(null,e,n,!0,t)};je.hydrateRoot=function(e,n,t){if(!di(e))throw Error(j(405));var r=t!=null&&t.hydratedSources||null,s=!1,o="",a=Vc;if(t!=null&&(t.unstable_strictMode===!0&&(s=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),n=Wc(n,null,e,1,t??null,s,!1,o,a),e[Je]=n.current,nr(e),r)for(e=0;e<r.length;e++)t=r[e],s=t._getVersion,s=s(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,s]:n.mutableSourceEagerHydrationData.push(t,s);return new _s(n)};je.render=function(e,n,t){if(!Os(n))throw Error(j(200));return Ms(null,e,n,!1,t)};je.unmountComponentAtNode=function(e){if(!Os(e))throw Error(j(40));return e._reactRootContainer?(Dn(function(){Ms(null,null,e,!1,function(){e._reactRootContainer=null,e[Je]=null})}),!0):!1};je.unstable_batchedUpdates=si;je.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!Os(t))throw Error(j(200));if(e==null||e._reactInternals===void 0)throw Error(j(38));return Ms(e,n,t,!1,r)};je.version="18.3.1-next-f1338f8080-20240426";function Gc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Gc)}catch(e){console.error(e)}}Gc(),Gl.exports=je;var Vh=Gl.exports,Qc,Sl=Vh;Qc=Sl.createRoot,Sl.hydrateRoot;/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function cr(){return cr=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)({}).hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},cr.apply(null,arguments)}var un;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(un||(un={}));const El="popstate";function Gh(e){e===void 0&&(e={});function n(r,s){let{pathname:o,search:a,hash:i}=r.location;return da("",{pathname:o,search:a,hash:i},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function t(r,s){return typeof s=="string"?s:vs(s)}return Jh(n,t,null,e)}function $(e,n){if(e===!1||e===null||typeof e>"u")throw new Error(n)}function Jc(e,n){if(!e){typeof console<"u"&&console.warn(n);try{throw new Error(n)}catch{}}}function Qh(){return Math.random().toString(36).substr(2,8)}function Tl(e,n){return{usr:e.state,key:e.key,idx:n}}function da(e,n,t,r){return t===void 0&&(t=null),cr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof n=="string"?xt(n):n,{state:t,key:n&&n.key||r||Qh()})}function vs(e){let{pathname:n="/",search:t="",hash:r=""}=e;return t&&t!=="?"&&(n+=t.charAt(0)==="?"?t:"?"+t),r&&r!=="#"&&(n+=r.charAt(0)==="#"?r:"#"+r),n}function xt(e){let n={};if(e){let t=e.indexOf("#");t>=0&&(n.hash=e.substr(t),e=e.substr(0,t));let r=e.indexOf("?");r>=0&&(n.search=e.substr(r),e=e.substr(0,r)),e&&(n.pathname=e)}return n}function Jh(e,n,t,r){r===void 0&&(r={});let{window:s=document.defaultView,v5Compat:o=!1}=r,a=s.history,i=un.Pop,u=null,c=g();c==null&&(c=0,a.replaceState(cr({},a.state,{idx:c}),""));function g(){return(a.state||{idx:null}).idx}function d(){i=un.Pop;let S=g(),h=S==null?null:S-c;c=S,u&&u({action:i,location:x.location,delta:h})}function m(S,h){i=un.Push;let p=da(x.location,S,h);c=g()+1;let f=Tl(p,c),y=x.createHref(p);try{a.pushState(f,"",y)}catch(E){if(E instanceof DOMException&&E.name==="DataCloneError")throw E;s.location.assign(y)}o&&u&&u({action:i,location:x.location,delta:1})}function v(S,h){i=un.Replace;let p=da(x.location,S,h);c=g();let f=Tl(p,c),y=x.createHref(p);a.replaceState(f,"",y),o&&u&&u({action:i,location:x.location,delta:0})}function w(S){let h=s.location.origin!=="null"?s.location.origin:s.location.href,p=typeof S=="string"?S:vs(S);return p=p.replace(/ $/,"%20"),$(h,"No window.location.(origin|href) available to create URL for href: "+p),new URL(p,h)}let x={get action(){return i},get location(){return e(s,a)},listen(S){if(u)throw new Error("A history only accepts one active listener");return s.addEventListener(El,d),u=S,()=>{s.removeEventListener(El,d),u=null}},createHref(S){return n(s,S)},createURL:w,encodeLocation(S){let h=w(S);return{pathname:h.pathname,search:h.search,hash:h.hash}},push:m,replace:v,go(S){return a.go(S)}};return x}var Cl;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Cl||(Cl={}));function Kh(e,n,t){return t===void 0&&(t="/"),Xh(e,n,t)}function Xh(e,n,t,r){let s=typeof n=="string"?xt(n):n,o=gt(s.pathname||"/",t);if(o==null)return null;let a=Kc(e);Yh(a);let i=null,u=cf(o);for(let c=0;i==null&&c<a.length;++c)i=lf(a[c],u);return i}function Kc(e,n,t,r){n===void 0&&(n=[]),t===void 0&&(t=[]),r===void 0&&(r="");let s=(o,a,i)=>{let u={relativePath:i===void 0?o.path||"":i,caseSensitive:o.caseSensitive===!0,childrenIndex:a,route:o};u.relativePath.startsWith("/")&&($(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let c=vn([r,u.relativePath]),g=t.concat(u);o.children&&o.children.length>0&&($(o.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),Kc(o.children,n,g,c)),!(o.path==null&&!o.index)&&n.push({path:c,score:of(c,o.index),routesMeta:g})};return e.forEach((o,a)=>{var i;if(o.path===""||!((i=o.path)!=null&&i.includes("?")))s(o,a);else for(let u of Xc(o.path))s(o,a,u)}),n}function Xc(e){let n=e.split("/");if(n.length===0)return[];let[t,...r]=n,s=t.endsWith("?"),o=t.replace(/\?$/,"");if(r.length===0)return s?[o,""]:[o];let a=Xc(r.join("/")),i=[];return i.push(...a.map(u=>u===""?o:[o,u].join("/"))),s&&i.push(...a),i.map(u=>e.startsWith("/")&&u===""?"/":u)}function Yh(e){e.sort((n,t)=>n.score!==t.score?t.score-n.score:af(n.routesMeta.map(r=>r.childrenIndex),t.routesMeta.map(r=>r.childrenIndex)))}const Zh=/^:[\w-]+$/,ef=3,nf=2,tf=1,rf=10,sf=-2,Nl=e=>e==="*";function of(e,n){let t=e.split("/"),r=t.length;return t.some(Nl)&&(r+=sf),n&&(r+=nf),t.filter(s=>!Nl(s)).reduce((s,o)=>s+(Zh.test(o)?ef:o===""?tf:rf),r)}function af(e,n){return e.length===n.length&&e.slice(0,-1).every((r,s)=>r===n[s])?e[e.length-1]-n[n.length-1]:0}function lf(e,n,t){let{routesMeta:r}=e,s={},o="/",a=[];for(let i=0;i<r.length;++i){let u=r[i],c=i===r.length-1,g=o==="/"?n:n.slice(o.length)||"/",d=pa({path:u.relativePath,caseSensitive:u.caseSensitive,end:c},g),m=u.route;if(!d)return null;Object.assign(s,d.params),a.push({params:s,pathname:vn([o,d.pathname]),pathnameBase:hf(vn([o,d.pathnameBase])),route:m}),d.pathnameBase!=="/"&&(o=vn([o,d.pathnameBase]))}return a}function pa(e,n){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[t,r]=uf(e.path,e.caseSensitive,e.end),s=n.match(t);if(!s)return null;let o=s[0],a=o.replace(/(.)\/+$/,"$1"),i=s.slice(1);return{params:r.reduce((c,g,d)=>{let{paramName:m,isOptional:v}=g;if(m==="*"){let x=i[d]||"";a=o.slice(0,o.length-x.length).replace(/(.)\/+$/,"$1")}const w=i[d];return v&&!w?c[m]=void 0:c[m]=(w||"").replace(/%2F/g,"/"),c},{}),pathname:o,pathnameBase:a,pattern:e}}function uf(e,n,t){n===void 0&&(n=!1),t===void 0&&(t=!0),Jc(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],s="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(a,i,u)=>(r.push({paramName:i,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),s+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):t?s+="\\/*$":e!==""&&e!=="/"&&(s+="(?:(?=\\/|$))"),[new RegExp(s,n?void 0:"i"),r]}function cf(e){try{return e.split("/").map(n=>decodeURIComponent(n).replace(/\//g,"%2F")).join("/")}catch(n){return Jc(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+n+").")),e}}function gt(e,n){if(n==="/")return e;if(!e.toLowerCase().startsWith(n.toLowerCase()))return null;let t=n.endsWith("/")?n.length-1:n.length,r=e.charAt(t);return r&&r!=="/"?null:e.slice(t)||"/"}function df(e,n){n===void 0&&(n="/");let{pathname:t,search:r="",hash:s=""}=typeof e=="string"?xt(e):e,o;return t?(t=Yc(t),t.startsWith("/")?o=bl(t.substring(1),"/"):o=bl(t,n)):o=n,{pathname:o,search:ff(r),hash:mf(s)}}function bl(e,n){let t=n.replace(/\/+$/,"").split("/");return e.split("/").forEach(s=>{s===".."?t.length>1&&t.pop():s!=="."&&t.push(s)}),t.length>1?t.join("/"):"/"}function go(e,n,t,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+n+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+t+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function pf(e){return e.filter((n,t)=>t===0||n.route.path&&n.route.path.length>0)}function pi(e,n){let t=pf(e);return n?t.map((r,s)=>s===t.length-1?r.pathname:r.pathnameBase):t.map(r=>r.pathnameBase)}function hi(e,n,t,r){r===void 0&&(r=!1);let s;typeof e=="string"?s=xt(e):(s=cr({},e),$(!s.pathname||!s.pathname.includes("?"),go("?","pathname","search",s)),$(!s.pathname||!s.pathname.includes("#"),go("#","pathname","hash",s)),$(!s.search||!s.search.includes("#"),go("#","search","hash",s)));let o=e===""||s.pathname==="",a=o?"/":s.pathname,i;if(a==null)i=t;else{let d=n.length-1;if(!r&&a.startsWith("..")){let m=a.split("/");for(;m[0]==="..";)m.shift(),d-=1;s.pathname=m.join("/")}i=d>=0?n[d]:"/"}let u=df(s,i),c=a&&a!=="/"&&a.endsWith("/"),g=(o||a===".")&&t.endsWith("/");return!u.pathname.endsWith("/")&&(c||g)&&(u.pathname+="/"),u}const Yc=e=>e.replace(/\/\/+/g,"/"),vn=e=>Yc(e.join("/")),hf=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),ff=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,mf=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function gf(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const Zc=["post","put","patch","delete"];new Set(Zc);const yf=["get",...Zc];new Set(yf);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function dr(){return dr=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)({}).hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},dr.apply(null,arguments)}const Is=k.createContext(null),ed=k.createContext(null),Ze=k.createContext(null),Ls=k.createContext(null),en=k.createContext({outlet:null,matches:[],isDataRoute:!1}),nd=k.createContext(null);function vf(e,n){let{relative:t}=n===void 0?{}:n;kt()||$(!1);let{basename:r,navigator:s}=k.useContext(Ze),{hash:o,pathname:a,search:i}=Ds(e,{relative:t}),u=a;return r!=="/"&&(u=a==="/"?r:vn([r,a])),s.createHref({pathname:u,search:i,hash:o})}function kt(){return k.useContext(Ls)!=null}function Un(){return kt()||$(!1),k.useContext(Ls).location}function td(e){k.useContext(Ze).static||k.useLayoutEffect(e)}function zs(){let{isDataRoute:e}=k.useContext(en);return e?Pf():wf()}function wf(){kt()||$(!1);let e=k.useContext(Is),{basename:n,future:t,navigator:r}=k.useContext(Ze),{matches:s}=k.useContext(en),{pathname:o}=Un(),a=JSON.stringify(pi(s,t.v7_relativeSplatPath)),i=k.useRef(!1);return td(()=>{i.current=!0}),k.useCallback(function(c,g){if(g===void 0&&(g={}),!i.current)return;if(typeof c=="number"){r.go(c);return}let d=hi(c,JSON.parse(a),o,g.relative==="path");e==null&&n!=="/"&&(d.pathname=d.pathname==="/"?n:vn([n,d.pathname])),(g.replace?r.replace:r.push)(d,g.state,g)},[n,r,a,o,e])}function xf(){let{matches:e}=k.useContext(en),n=e[e.length-1];return n?n.params:{}}function Ds(e,n){let{relative:t}=n===void 0?{}:n,{future:r}=k.useContext(Ze),{matches:s}=k.useContext(en),{pathname:o}=Un(),a=JSON.stringify(pi(s,r.v7_relativeSplatPath));return k.useMemo(()=>hi(e,JSON.parse(a),o,t==="path"),[e,a,o,t])}function kf(e,n){return jf(e,n)}function jf(e,n,t,r){kt()||$(!1);let{navigator:s}=k.useContext(Ze),{matches:o}=k.useContext(en),a=o[o.length-1],i=a?a.params:{};a&&a.pathname;let u=a?a.pathnameBase:"/";a&&a.route;let c=Un(),g;if(n){var d;let S=typeof n=="string"?xt(n):n;u==="/"||(d=S.pathname)!=null&&d.startsWith(u)||$(!1),g=S}else g=c;let m=g.pathname||"/",v=m;if(u!=="/"){let S=u.replace(/^\//,"").split("/");v="/"+m.replace(/^\//,"").split("/").slice(S.length).join("/")}let w=Kh(e,{pathname:v}),x=Nf(w&&w.map(S=>Object.assign({},S,{params:Object.assign({},i,S.params),pathname:vn([u,s.encodeLocation?s.encodeLocation(S.pathname).pathname:S.pathname]),pathnameBase:S.pathnameBase==="/"?u:vn([u,s.encodeLocation?s.encodeLocation(S.pathnameBase).pathname:S.pathnameBase])})),o,t,r);return n&&x?k.createElement(Ls.Provider,{value:{location:dr({pathname:"/",search:"",hash:"",state:null,key:"default"},g),navigationType:un.Pop}},x):x}function Sf(){let e=qf(),n=gf(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),t=e instanceof Error?e.stack:null,s={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return k.createElement(k.Fragment,null,k.createElement("h2",null,"Unexpected Application Error!"),k.createElement("h3",{style:{fontStyle:"italic"}},n),t?k.createElement("pre",{style:s},t):null,null)}const Ef=k.createElement(Sf,null);class Tf extends k.Component{constructor(n){super(n),this.state={location:n.location,revalidation:n.revalidation,error:n.error}}static getDerivedStateFromError(n){return{error:n}}static getDerivedStateFromProps(n,t){return t.location!==n.location||t.revalidation!=="idle"&&n.revalidation==="idle"?{error:n.error,location:n.location,revalidation:n.revalidation}:{error:n.error!==void 0?n.error:t.error,location:t.location,revalidation:n.revalidation||t.revalidation}}componentDidCatch(n,t){console.error("React Router caught the following error during render",n,t)}render(){return this.state.error!==void 0?k.createElement(en.Provider,{value:this.props.routeContext},k.createElement(nd.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Cf(e){let{routeContext:n,match:t,children:r}=e,s=k.useContext(Is);return s&&s.static&&s.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(s.staticContext._deepestRenderedBoundaryId=t.route.id),k.createElement(en.Provider,{value:n},r)}function Nf(e,n,t,r){var s;if(n===void 0&&(n=[]),t===void 0&&(t=null),r===void 0&&(r=null),e==null){var o;if(!t)return null;if(t.errors)e=t.matches;else if((o=r)!=null&&o.v7_partialHydration&&n.length===0&&!t.initialized&&t.matches.length>0)e=t.matches;else return null}let a=e,i=(s=t)==null?void 0:s.errors;if(i!=null){let g=a.findIndex(d=>d.route.id&&(i==null?void 0:i[d.route.id])!==void 0);g>=0||$(!1),a=a.slice(0,Math.min(a.length,g+1))}let u=!1,c=-1;if(t&&r&&r.v7_partialHydration)for(let g=0;g<a.length;g++){let d=a[g];if((d.route.HydrateFallback||d.route.hydrateFallbackElement)&&(c=g),d.route.id){let{loaderData:m,errors:v}=t,w=d.route.loader&&m[d.route.id]===void 0&&(!v||v[d.route.id]===void 0);if(d.route.lazy||w){u=!0,c>=0?a=a.slice(0,c+1):a=[a[0]];break}}}return a.reduceRight((g,d,m)=>{let v,w=!1,x=null,S=null;t&&(v=i&&d.route.id?i[d.route.id]:void 0,x=d.route.errorElement||Ef,u&&(c<0&&m===0?(_f("route-fallback"),w=!0,S=null):c===m&&(w=!0,S=d.route.hydrateFallbackElement||null)));let h=n.concat(a.slice(0,m+1)),p=()=>{let f;return v?f=x:w?f=S:d.route.Component?f=k.createElement(d.route.Component,null):d.route.element?f=d.route.element:f=g,k.createElement(Cf,{match:d,routeContext:{outlet:g,matches:h,isDataRoute:t!=null},children:f})};return t&&(d.route.ErrorBoundary||d.route.errorElement||m===0)?k.createElement(Tf,{location:t.location,revalidation:t.revalidation,component:x,error:v,children:p(),routeContext:{outlet:null,matches:h,isDataRoute:!0}}):p()},null)}var rd=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(rd||{}),sd=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(sd||{});function bf(e){let n=k.useContext(Is);return n||$(!1),n}function Af(e){let n=k.useContext(ed);return n||$(!1),n}function Rf(e){let n=k.useContext(en);return n||$(!1),n}function od(e){let n=Rf(),t=n.matches[n.matches.length-1];return t.route.id||$(!1),t.route.id}function qf(){var e;let n=k.useContext(nd),t=Af(),r=od();return n!==void 0?n:(e=t.errors)==null?void 0:e[r]}function Pf(){let{router:e}=bf(rd.UseNavigateStable),n=od(sd.UseNavigateStable),t=k.useRef(!1);return td(()=>{t.current=!0}),k.useCallback(function(s,o){o===void 0&&(o={}),t.current&&(typeof s=="number"?e.navigate(s):e.navigate(s,dr({fromRouteId:n},o)))},[e,n])}const Al={};function _f(e,n,t){Al[e]||(Al[e]=!0)}function Of(e,n){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Mf(e){let{to:n,replace:t,state:r,relative:s}=e;kt()||$(!1);let{future:o,static:a}=k.useContext(Ze),{matches:i}=k.useContext(en),{pathname:u}=Un(),c=zs(),g=hi(n,pi(i,o.v7_relativeSplatPath),u,s==="path"),d=JSON.stringify(g);return k.useEffect(()=>c(JSON.parse(d),{replace:t,state:r,relative:s}),[c,d,s,t,r]),null}function It(e){$(!1)}function If(e){let{basename:n="/",children:t=null,location:r,navigationType:s=un.Pop,navigator:o,static:a=!1,future:i}=e;kt()&&$(!1);let u=n.replace(/^\/*/,"/"),c=k.useMemo(()=>({basename:u,navigator:o,static:a,future:dr({v7_relativeSplatPath:!1},i)}),[u,i,o,a]);typeof r=="string"&&(r=xt(r));let{pathname:g="/",search:d="",hash:m="",state:v=null,key:w="default"}=r,x=k.useMemo(()=>{let S=gt(g,u);return S==null?null:{location:{pathname:S,search:d,hash:m,state:v,key:w},navigationType:s}},[u,g,d,m,v,w,s]);return x==null?null:k.createElement(Ze.Provider,{value:c},k.createElement(Ls.Provider,{children:t,value:x}))}function Lf(e){let{children:n,location:t}=e;return kf(ha(n),t)}new Promise(()=>{});function ha(e,n){n===void 0&&(n=[]);let t=[];return k.Children.forEach(e,(r,s)=>{if(!k.isValidElement(r))return;let o=[...n,s];if(r.type===k.Fragment){t.push.apply(t,ha(r.props.children,o));return}r.type!==It&&$(!1),!r.props.index||!r.props.children||$(!1);let a={id:r.props.id||o.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(a.children=ha(r.props.children,o)),t.push(a)}),t}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ws(){return ws=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)({}).hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},ws.apply(null,arguments)}function ad(e,n){if(e==null)return{};var t={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(n.indexOf(r)!==-1)continue;t[r]=e[r]}return t}function zf(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function Df(e,n){return e.button===0&&(!n||n==="_self")&&!zf(e)}const Ff=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],Hf=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],Uf="6";try{window.__reactRouterVersion=Uf}catch{}const $f=k.createContext({isTransitioning:!1}),Bf="startTransition",Rl=Md[Bf];function Wf(e){let{basename:n,children:t,future:r,window:s}=e,o=k.useRef();o.current==null&&(o.current=Gh({window:s,v5Compat:!0}));let a=o.current,[i,u]=k.useState({action:a.action,location:a.location}),{v7_startTransition:c}=r||{},g=k.useCallback(d=>{c&&Rl?Rl(()=>u(d)):u(d)},[u,c]);return k.useLayoutEffect(()=>a.listen(g),[a,g]),k.useEffect(()=>Of(r),[r]),k.createElement(If,{basename:n,children:t,location:i.location,navigationType:i.action,navigator:a,future:r})}const Vf=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Gf=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,W=k.forwardRef(function(n,t){let{onClick:r,relative:s,reloadDocument:o,replace:a,state:i,target:u,to:c,preventScrollReset:g,viewTransition:d}=n,m=ad(n,Ff),{basename:v}=k.useContext(Ze),w,x=!1;if(typeof c=="string"&&Gf.test(c)&&(w=c,Vf))try{let f=new URL(window.location.href),y=c.startsWith("//")?new URL(f.protocol+c):new URL(c),E=gt(y.pathname,v);y.origin===f.origin&&E!=null?c=E+y.search+y.hash:x=!0}catch{}let S=vf(c,{relative:s}),h=Kf(c,{replace:a,state:i,target:u,preventScrollReset:g,relative:s,viewTransition:d});function p(f){r&&r(f),f.defaultPrevented||h(f)}return k.createElement("a",ws({},m,{href:w||S,onClick:x||o?r:p,ref:t,target:u}))}),Qf=k.forwardRef(function(n,t){let{"aria-current":r="page",caseSensitive:s=!1,className:o="",end:a=!1,style:i,to:u,viewTransition:c,children:g}=n,d=ad(n,Hf),m=Ds(u,{relative:d.relative}),v=Un(),w=k.useContext(ed),{navigator:x,basename:S}=k.useContext(Ze),h=w!=null&&Xf(m)&&c===!0,p=x.encodeLocation?x.encodeLocation(m).pathname:m.pathname,f=v.pathname,y=w&&w.navigation&&w.navigation.location?w.navigation.location.pathname:null;s||(f=f.toLowerCase(),y=y?y.toLowerCase():null,p=p.toLowerCase()),y&&S&&(y=gt(y,S)||y);const E=p!=="/"&&p.endsWith("/")?p.length-1:p.length;let N=f===p||!a&&f.startsWith(p)&&f.charAt(E)==="/",b=y!=null&&(y===p||!a&&y.startsWith(p)&&y.charAt(p.length)==="/"),A={isActive:N,isPending:b,isTransitioning:h},F=N?r:void 0,q;typeof o=="function"?q=o(A):q=[o,N?"active":null,b?"pending":null,h?"transitioning":null].filter(Boolean).join(" ");let ye=typeof i=="function"?i(A):i;return k.createElement(W,ws({},d,{"aria-current":F,className:q,ref:t,style:ye,to:u,viewTransition:c}),typeof g=="function"?g(A):g)});var fa;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(fa||(fa={}));var ql;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(ql||(ql={}));function Jf(e){let n=k.useContext(Is);return n||$(!1),n}function Kf(e,n){let{target:t,replace:r,state:s,preventScrollReset:o,relative:a,viewTransition:i}=n===void 0?{}:n,u=zs(),c=Un(),g=Ds(e,{relative:a});return k.useCallback(d=>{if(Df(d,t)){d.preventDefault();let m=r!==void 0?r:vs(c)===vs(g);u(e,{replace:m,state:s,preventScrollReset:o,relative:a,viewTransition:i})}},[c,u,g,r,s,t,e,o,a,i])}function Xf(e,n){n===void 0&&(n={});let t=k.useContext($f);t==null&&$(!1);let{basename:r}=Jf(fa.useViewTransitionState),s=Ds(e,{relative:n.relative});if(!t.isTransitioning)return!1;let o=gt(t.currentLocation.pathname,r)||t.currentLocation.pathname,a=gt(t.nextLocation.pathname,r)||t.nextLocation.pathname;return pa(s.pathname,a)!=null||pa(s.pathname,o)!=null}const Yf="---\ntitle: API reference\ndescription: The complete export list, the App and Router classes, the Request and Response surface, and every middleware factory signature.\nsection: Reference\norder: 1\n---\n\nA single-page index of the public API. Each API area links to a page with more\ndetail and examples.\n\n## Exports\n\n```js\nimport App, {\n  createApp, Router, Request, Response,\n  HttpError, statusMessage, STATUS_TEXT,\n  json, urlencoded, text, raw,\n  logger, rateLimit, MemoryStore,\n  serveStatic, cors, compress,\n  sendFile, lookupMime,\n} from 'routiva';\n```\n\n| Export | Kind | Purpose |\n| --- | --- | --- |\n| `App` | class (also the default export) | The application |\n| `createApp(options?)` | function | `new App(options)` |\n| `Router` | class | A mountable sub-router |\n| `Request` / `Response` | classes | The wrapped `req` / `res` |\n| `HttpError` | class | An `Error` with an HTTP status |\n| `statusMessage(code)` | function | Canonical reason phrase |\n| `STATUS_TEXT` | object | The status-code → reason-phrase map |\n| `json` `urlencoded` `text` `raw` | factories | Body parsers |\n| `logger` | factory | Request logging |\n| `rateLimit` | factory | Fixed-window rate limiting |\n| `MemoryStore` | class | The default rate-limit store |\n| `serveStatic` | factory | Static file serving |\n| `cors` | factory | CORS headers and preflight |\n| `compress` | factory | gzip / deflate / brotli |\n| `sendFile` | function | Low-level file sender |\n| `lookupMime(filePath)` | function | Extension → MIME type |\n\nEvery middleware factory is also attached to the class, so you can write\n`App.json()`, `App.cors()`, `App.serveStatic()`, and so on.\n\n## App\n\n```js\nimport { App, createApp } from 'routiva';\n\nconst app = createApp({ trustProxy: true });\n// identical to: new App({ trustProxy: true })\n```\n\n| Member | Description |\n| --- | --- |\n| `new App(options?)` | Create an app |\n| `app.listen(port, [host], [cb])` | Create/start the `http.Server`; returns it |\n| `app.close([cb])` | Stop the server; returns `this` |\n| `app.handle(req, res, done)` | Dispatch an already-wrapped request |\n| `app.set(key, value)` | Set a setting; returns `this` |\n| `app.setting(key)` | Read a setting |\n| `app.enable(key)` / `app.disable(key)` | Boolean setting helpers |\n| `app.get/post/put/patch/delete/head/options/all` | Route registration |\n| `app.use([path], ...handlers)` | Middleware / mount a `Router` |\n| `app.param(name, fn)` | Parameter callback |\n| `app.route(path)` | Chainable method registration |\n\n### App options\n\n| Option | Default | Effect |\n| --- | --- | --- |\n| `env` | `process.env.NODE_ENV` or `'development'` | Environment name |\n| `trustProxy` | `false` | `req.ip` / `req.ips` read `X-Forwarded-For` |\n| `xPoweredBy` | `false` | Emit `X-Powered-By: routiva` |\n| `jsonSpaces` | `0` | Reserved |\n| `exposeStack` | `env !== 'production'` | 5xx messages and stacks in responses |\n\nSettings are the same keys, read and written via `app.setting()` and\n`app.set()`. See [Core concepts](core-concepts.md#settings).\n\n## Router\n\n| Member | Description |\n| --- | --- |\n| `new Router()` | Create a router |\n| `router.get/post/put/patch/delete/head/options(path, ...handlers)` | Register a route |\n| `router.all(path, ...handlers)` | Route for every method |\n| `router.use([path], ...handlers)` | Middleware, optionally prefixed |\n| `router.param(name, fn)` | Parameter callback `(req, res, next, value, name)` |\n| `router.route(path)` | Chainable builder |\n| `router.handle(req, res, done)` | Dispatch a request |\n| `router.stack` | The ordered layer array |\n\nHandlers may be functions, arrays of functions, or a `Router`. Mount one with\n`app.use('/prefix', router)`. See [Routing](routing.md).\n\n## Request\n\n| Member | Description |\n| --- | --- |\n| `req.raw` | The underlying `IncomingMessage` |\n| `req.app` | The handling `App` |\n| `req.method` | HTTP method |\n| `req.url` / `req.originalUrl` | Current / original URL |\n| `req.path` / `req.search` | Pathname / query string |\n| `req.query` | Parsed query (`?tag=a&tag=b` → array) |\n| `req.params` | Route parameters |\n| `req.body` | Parsed body (from body-parser middleware) |\n| `req.cookies` | Parsed cookies (`j:` JSON decoded) |\n| `req.headers` | Lower-cased header map |\n| `req.hostname` / `req.protocol` / `req.secure` | Derived from headers/socket |\n| `req.ip` / `req.ips` | Client IP, honouring `trust proxy` |\n| `req.header(name)` / `req.get(name)` | Case-insensitive header lookup |\n| `req.accepts(...types)` | Content negotiation |\n| `req.is(...types)` | Content-Type test |\n\nFull detail: [Request & Response](request-response.md).\n\n## Response\n\n| Member | Description |\n| --- | --- |\n| `res.status(code)` | Set the status; chainable |\n| `res.set(name, value)` / `res.set(obj)` | Set headers |\n| `res.header(...)` | Alias for `set()` |\n| `res.append(name, value)` | Append to a multi-value header |\n| `res.get(name)` | Read a set header |\n| `res.vary(field)` | Add to `Vary`, de-duplicated |\n| `res.type(value)` | Set `Content-Type` from a type or extension |\n| `res.cookie(name, value, options?)` | Set a cookie |\n| `res.clearCookie(name, options?)` | Expire a cookie |\n| `res.redirect([status], url)` | Redirect (default `302`) |\n| `res.sendStatus(code)` | Status + reason phrase as text |\n| `res.attachment(filename?)` | `Content-Disposition: attachment` |\n| `res.sendFile(path, options?, cb?)` | Send a file (returns a promise) |\n| `res.download(path, filename?, options?, cb?)` | Send as a download |\n| `res.format(obj)` | Content-negotiated response |\n| `res.json(value)` | JSON response |\n| `res.send(body)` | Send string/Buffer/object/empty |\n| `res.write(chunk)` / `res.end(...)` | Raw writes |\n| `res.raw` | The underlying `ServerResponse` |\n| `res.locals` | A per-response data object |\n| `res.statusCode` / `res.headersSent` / `res.finished` | State accessors |\n\nFull detail: [Request & Response](request-response.md).\n\n## Middleware factories\n\n### Body parsing\n\n| Factory | Options |\n| --- | --- |\n| `json({ limit, type, strict, reviver, verify })` | `limit` `'1mb'`, `strict: true` |\n| `urlencoded({ limit, extended })` | `limit` `'100kb'`, `extended: false` |\n| `text({ limit, type, encoding })` | `limit` `'100kb'`, `encoding: 'utf8'` |\n| `raw({ limit, type })` | `limit` `'100kb'`, any type unless `type` is set |\n\nDetail: [Body parsing](body-parsing.md).\n\n### Files\n\n| Factory | Options |\n| --- | --- |\n| `serveStatic(root, { fallthrough, dotfiles, index, extensions, redirect, maxAge, immutable, etag, headers, type })` | `dotfiles: 'ignore'`, `index: ['index.html']`, `maxAge: 0` |\n\nDetail: [Static files](static-files.md).\n\n### CORS\n\n| Factory | Options |\n| --- | --- |\n| `cors({ origin, methods, credentials, preflightContinue, optionsSuccessStatus, maxAge, allowedHeaders, exposedHeaders })` | `origin: '*'`, `methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'` |\n\nDetail: [CORS](cors.md).\n\n### Compression\n\n| Factory | Options |\n| --- | --- |\n| `compress({ threshold, filter, level })` | `threshold: '1kb'`, `filter: () => true` |\n\nDetail: [Compression](compression.md).\n\n### Rate limiting\n\n| Factory | Options |\n| --- | --- |\n| `rateLimit({ windowMs, max, limit, statusCode, message, headers, skip, keyGenerator, handler, store })` | `windowMs: 60000`, `max: 100` |\n\nDetail: [Rate limiting](rate-limiting.md).\n\n### Logging\n\n| Factory | Options |\n| --- | --- |\n| `logger({ stream, format, enabled, color })` | `stream: process.stdout`, `enabled: true` |\n\nDetail: [Logging](logging.md).\n\n## Errors\n\n```js\nimport { HttpError, statusMessage, STATUS_TEXT } from 'routiva';\n\nthrow new HttpError(422, 'validation failed', { type: 'validation.failed' });\nstatusMessage(404);        // 'Not Found'\nSTATUS_TEXT[500];          // 'Internal Server Error'\n```\n\n| `HttpError` member | Description |\n| --- | --- |\n| `new HttpError(status, message?, options?)` | `options`: `expose`, `type`, `cause` |\n| `.status` / `.statusCode` | The status code |\n| `.expose` | `status < 500`, or `options.expose` |\n| `.type` | Machine-readable code, echoed in responses |\n| `HttpError.badRequest(message?, options?)` | `400` |\n| `HttpError.unauthorized(...)` | `401` |\n| `HttpError.forbidden(...)` | `403` |\n| `HttpError.notFound(...)` | `404` |\n| `HttpError.methodNotAllowed(...)` | `405` |\n| `HttpError.tooLarge(...)` | `413` |\n| `HttpError.internal(...)` | `500` |\n\nDetail: [Error handling](error-handling.md).\n\n## Utilities\n\n| Export | Description |\n| --- | --- |\n| `sendFile(req, res, filePath, options?)` | Low-level file sender (used by `res.sendFile` and `serveStatic`) |\n| `lookupMime(filePath)` | Extension → MIME type, falling back to `application/octet-stream` |\n\n```js\nlookupMime('app.css');      // 'text/css; charset=utf-8'\nlookupMime('photo.webp');   // 'image/webp'\nlookupMime('archive.rar');  // 'application/octet-stream'\n```\n\n## Default responses\n\nWhen nothing responds, routiva produces one of:\n\n| Situation | Response |\n| --- | --- |\n| No path matched | `404` + `{ error: { message, status: 404, path } }` |\n| Path matched, wrong method | `405` + `Allow` + JSON error |\n| `OPTIONS` on a known path | `204` + `Allow` |\n| Unhandled error | `4xx`/`5xx` JSON error from `_handleError` |\n\n## Where to go next\n\n| If you want to… | Read |\n| --- | --- |\n| A step-by-step build | [Quick start](quick-start.md) |\n| How the internals fit together | [Architecture](architecture.md) |\n| Runnable code | [Examples](examples.md) |\n",Zf="---\ntitle: Architecture\ndescription: How routiva works under the hood — the layer stack, path compilation, dispatch and restoration, body parsing and file sending.\nsection: Reference\norder: 2\n---\n\n## High-level map\n\n```\n                 Client\n                   │  HTTP request\n                   ▼\n         node:http · http.createServer(handler)\n                   │  IncomingMessage + ServerResponse\n                   ▼\n         App._handle(rawReq, rawRes)\n           ├─ wrap:  new Request(raw)  +  new Response(raw, req)\n           └─ this.handle(req, res, done)\n                   │\n                   ▼\n         Router.handle → dispatch(this.stack)\n           ├─ logger()            → next()\n           ├─ json()              → next()\n           ├─ GET /users/:id      → res.json(...)      ← responds\n           ├─ POST /users         → next()\n           ├─ (err,req,res,next)  → only after next(err)\n           └─ serveStatic()       → next()\n                   │  stack exhausted\n                   ▼\n         done(err)\n           ├─ err  → _handleError(err)   → 4xx / 5xx JSON\n           └─ none → _handleNotFound()   → 404 / 405 / OPTIONS\n```\n\nThe request enters at `_handle`, is wrapped, then flows through a single ordered\nlist of layers. Each layer either handles the request, passes control onward\nwith `next()`, or raises an error with `next(err)`. When the stack is exhausted,\n`done(err)` chooses between an error response and a 404/405/OPTIONS.\n\n## Module dependency graph\n\n```\n  index.js ─────────────────────────────────────────────── public API + statics\n     │\n     ├── app.js ──────────▶ router.js ──▶ utils.js\n     │      │\n     │      ├────────────▶ request.js ──▶ utils.js\n     │      │\n     │      ├────────────▶ response.js ──▶ send.js ──▶ errors.js, utils.js\n     │      │                     └──────▶ errors.js\n     │      └────────────▶ errors.js\n     │\n     └── middleware/\n            ├── body-parser.js ──▶ errors.js, utils.js\n            ├── static.js ───────▶ send.js, errors.js\n            ├── cors.js\n            ├── compress.js ─────▶ utils.js, node:zlib\n            ├── logger.js\n            └── rate-limit.js\n```\n\nThe graph is acyclic and shallow. `errors.js` and `utils.js` are leaves;\n`send.js` is the only shared low-level utility used by two entry points\n(`res.sendFile()` and `serveStatic()`).\n\n## Module reference\n\n| Module | Responsibility |\n| --- | --- |\n| `src/index.js` | Public entry point; attaches middleware factories as `App` statics |\n| `src/app.js` | `App`: server lifecycle, settings, default 404/405/error handling |\n| `src/router.js` | `Router`: layer stack, path compilation, dispatch, `param`/`route`/`use` |\n| `src/request.js` | `Request` wrapper: URL, query, cookies, IP, negotiation |\n| `src/response.js` | `Response` wrapper: chainable helpers, cookies, send, sendFile, format |\n| `src/send.js` | File sending: MIME lookup, ETag, `Last-Modified`, Range, streaming |\n| `src/errors.js` | `HttpError` + HTTP reason phrases |\n| `src/utils.js` | Query/cookie/accept parsing, byte & duration parsing, regex escaping |\n| `src/middleware/body-parser.js` | `json()`, `urlencoded()`, `text()`, `raw()` |\n| `src/middleware/static.js` | `serveStatic()` with traversal protection and fallthrough |\n| `src/middleware/cors.js` | `cors()` with preflight handling |\n| `src/middleware/compress.js` | `compress()` via gzip / deflate / brotli |\n| `src/middleware/logger.js` | `logger()` request logging |\n| `src/middleware/rate-limit.js` | `rateLimit()` + `MemoryStore` fixed windows |\n\n## The layer stack\n\n`Router` holds a single array, `this.stack`. Registering anything pushes one\nlayer **per handler function**:\n\n```js\n// src/router.js — _register() (abridged)\nconst { regex, keys } = compile(path, !isMiddleware);   // compiled once, shared\nfor (const fn of flat) {\n  const handler = fn instanceof Router ? wrapRouter(fn) : fn;\n  this.stack.push({\n    method,                       // 'GET' | null (middleware / all)\n    path,                         // original pattern, for debugging\n    regex,                        // compiled matcher\n    keys,                         // captured parameter names\n    fn: handler,                  // the function actually invoked\n    owner: this,                  // which Router registered it (for param callbacks)\n    isMiddleware,                 // prefix match vs exact match\n    isErrorHandler: handler.length === 4,   // arity-based classification\n  });\n}\n```\n\nBecause routes and middleware live in the same list, **registration order is\nexecution order**. A route registered with several handlers pushes several\nlayers that share one compiled `regex` and `keys` array.\n\n## Path matching\n\nPatterns are compiled to a `RegExp` once, at registration time:\n\n```\n/                     end → /^\\/?$/              prefix → /^/\n/users/:id            end → /^\\/users\\/([^/]+)\\/?$/\n/files/*              end → /^\\/files\\/(.*)\\/?$/\n/users                prefix → /^\\/users(?=\\/|$)/\n```\n\n1. Normalise leading/trailing slashes.\n2. Split on `:name` and `*` tokens, keeping the literals.\n3. Regex-escape the literals; `:name` → `([^/]+)`, `*` → `(.*)`.\n4. `end: true` anchors with `^…\\/?$` — an **exact** match for routes, tolerating\n   a trailing slash.\n5. `end: false` uses a lookahead `^…(?=\\/|$)` — a **prefix** match for mounted\n   middleware, without consuming the next `/`.\n\nThe `keys` array records parameter names in capture order, so `invoke()` can zip\n`match[1..n]` back onto names:\n\n```js\nlayer.keys.forEach((key, i) => {\n  const value = match[i + 1];\n  if (value !== undefined) params[key] = safeDecode(value);   // URL-decode captures\n});\n```\n\n`safeDecode` wraps `decodeURIComponent`, so a malformed `%` never throws a 500.\n\n## Dispatch and `next()`\n\nAll dispatching lives in one function, `dispatch(stack, req, res, done)`. It uses\na **shared cursor** (`index`) plus a `finished` latch, so `next()` calls from any\ndepth walk the same list without re-running earlier layers:\n\n```js\n// src/router.js — dispatch() (abridged)\nfunction dispatch(stack, req, res, done) {\n  let index = 0;\n  let finished = false;\n\n  function next(err) {\n    if (finished) return;                          // one terminal transition only\n    if (index >= stack.length) {\n      finished = true;\n      return done(err);                            // stack exhausted\n    }\n\n    const wantsError = Boolean(err);\n    let layer, match;\n\n    while (index < stack.length) {\n      layer = stack[index++];\n      if (layer.isErrorHandler !== wantsError) continue;   // error ⇔ 4-arity only\n\n      match = layer.regex.exec(req.path);\n      if (!match) continue;\n\n      if (!methodAllows(layer, req)) {                     // HEAD→GET fallback\n        if (!layer.isMiddleware) recordAllowed(req, layer.method);\n        match = null;\n        continue;\n      }\n      break;\n    }\n\n    if (!match) { finished = true; return done(err); }\n    invoke(layer, match, err, req, res, next);\n  }\n\n  next();\n}\n```\n\nA `while` loop keeps stack depth O(1) per `next()` call and guarantees the cursor\nnever moves backwards. `finished` ensures `done` runs exactly once even if a\nhandler calls `next()` repeatedly.\n\n`methodAllows` lets a `HEAD` request use a `GET` route. When a path matches but\nthe method does not, `recordAllowed` notes the method (and `HEAD` for `GET`) so\n`_handleNotFound` can build the `Allow` header.\n\n## Params, mount prefixes and restoration\n\n`invoke()` runs a layer and does four careful things:\n\n**1. Build and merge params** — child params shadow parent params.\n\n**2. Strip the mount prefix** for middleware, so a router mounted at `/api`\nsees `/hello`, not `/api/hello`.\n\n**3. Restore on `next()`** — the previous `params`/`path`/`url`/`route` are saved\nand restored the first time the layer calls `next()`. A `nextCalled` latch\nignores duplicate calls:\n\n```js\n// src/router.js — invoke() (abridged)\nconst previous = { params: req.params, path: req.path, url: req.url, route: req.route };\nreq.params = { ...previous.params, ...params };\nreq.route = layer;\n\nconst consumed = layer.isMiddleware ? match[0].length : 0;   // prefix length\nif (consumed > 0) { /* req.path = req.path.slice(consumed) … */ }\n\nlet restored = false;\nconst restore = () => { if (restored) return; restored = true; /* undo all */ };\n\nlet nextCalled = false;\nconst layerNext = (nextErr) => {\n  if (nextCalled) return;      // guard against double next()\n  nextCalled = true;\n  restore();\n  next(nextErr);\n};\n```\n\n**4. Run param callbacks, then the handler**, with sync/async error capture:\n\n```js\nconst steps = [];   // param callbacks for this layer's params (if any)\n\nsteps.push((stepNext) => {\n  try {\n    const ret = layer.isErrorHandler\n      ? layer.fn(err, req, res, stepNext)      // 4-arity: (err, req, res, next)\n      : layer.fn(req, res, stepNext);          // 3-arity: (req, res, next)\n    if (isPromise(ret)) ret.catch(stepNext);   // async throws → error chain\n  } catch (e) {\n    stepNext(e);                                // sync throws → error chain\n  }\n});\nrunSteps(steps, layerNext);\n```\n\n`runSteps` sequences each param callback and the handler, so a callback can\nvalidate and short-circuit with `next(err)` before the handler runs. This is why\nboth `throw` and `Promise.reject` reach error middleware.\n\n## Error handling by arity\n\nError handlers are ordinary functions whose `length === 4`:\n\n```js\napp.use((err, req, res, next) => { /* ... */ });\n```\n\nThe dispatch loop selects layers with `layer.isErrorHandler !== wantsError`, so\n4-arity functions are skipped during normal flow and 3-arity functions are\nskipped during error flow. No registration API is involved.\n\nIf no error handler responds, `App._handleError` runs:\n\n```js\n// src/app.js — _handleError() (abridged)\nconst status = normalizeStatus(error);          // err.status/statusCode, else 500\nif (res.raw.headersSent) { res.raw.destroy?.(); return; }   // cannot recover\n\nconst expose = this.setting('expose stack');\nconst message = error.expose || expose ? error.message : statusMessage(status);\nres.status(status).json({ error: { message, status, type: error.type } });\n```\n\n`HttpError` sets `expose = status < 500`, so 4xx messages reach clients while 5xx\nmessages are hidden in production (a stack is included only when `expose stack`\nis on and the status is `>= 500`).\n\n## The Request wrapper\n\n`Request` lifts the fiddly parts of `IncomingMessage` into plain fields, parsed\nonce in the constructor so later reads are cheap:\n\n```js\nconst parsed = new URL(raw.url, 'http://localhost');  // base is irrelevant\nthis.path = parsed.pathname;                          // path only\nthis.search = parsed.search;\nthis.query = parseQuery(parsed.searchParams);         // repeated keys → arrays\nthis.cookies = parseCookies(this.headers.cookie);     // j: JSON decoded\nthis.ip = this._resolveIp();                          // honours trust proxy\n```\n\n`parseQuery` collapses `?tag=a&tag=b` into `{ tag: ['a', 'b'] }`. `req.accepts()`\nand `req.is()` use the shared negotiation helpers in `utils.js`, and the full\nfield list is on the [Request & Response](request-response.md) page.\n\n## The Response wrapper\n\n`Response` wraps `ServerResponse` and makes every mutator return `this`. The\nimportant safety mechanic is the **double-send guard**:\n\n```js\nsend(body) {\n  if (this._alreadySent()) return this;   // headersSent || writableEnded\n  // ...set Content-Type/Content-Length, then write\n}\n_alreadySent() {\n  return Boolean(this.raw.headersSent || this.raw.writableEnded);\n}\n```\n\nA stray second `res.json()` is silently ignored rather than crashing with\n`ERR_HTTP_HEADERS_SENT`. `_writeBody()` suppresses the payload for `HEAD`\nrequests while still computing `Content-Length`, so `HEAD` reuses `GET` routes.\n\n## Body parsing pipeline\n\nAll four parsers (`json`, `urlencoded`, `text`, `raw`) share one streaming\nreader, `readBuffer(stream, limit)`:\n\n```\nrequest stream ──data──▶ size += chunk.length\n                          │\n                          ├─ size > limit ─▶ resume() drain + reject HttpError(413)\n                          └─ else         ─▶ chunks.push(chunk)\n                                             │\n                                        end ─▶ Buffer.concat(chunks)\n```\n\nHighlights:\n\n- On overflow the stream is **drained** (`resume()`) rather than destroyed, so\n  the `413` response can actually be delivered.\n- `json()` adds a **strict** check (must start with `{` or `[`) and wraps parse\n  failures in a `400` with `type: 'entity.parse.failed'`.\n- Content-type gating means each parser ignores bodies it does not own, so they\n  can be stacked; `raw()` accepts anything when no `type` is given.\n- `verify` runs on the raw `Buffer` before `JSON.parse`, so a throwing signature\n  check flows into your error middleware.\n\nSee [Body parsing](body-parsing.md) for the option tables.\n\n## File sending\n\n`src/send.js` is shared by `res.sendFile()` and `serveStatic()`. It implements\nconditional-request and range semantics:\n\n```\nstat file ──▶ set Last-Modified, Accept-Ranges, ETag (W/\"size-mtime\")\n              │\n              ├─ If-None-Match / If-Modified-Since fresh? ─▶ 304\n              ├─ Range: bytes=a-b ─▶ 206 + Content-Range, stream that slice\n              ├─ bad range ─▶ 416 + Content-Range: bytes */size\n              ├─ maxAge ─▶ Cache-Control: public, max-age=…[, immutable]\n              └─ else ─▶ 200 + Content-Length, stream the file\n```\n\n`pipeFile()` uses `createReadStream(path, range).pipe(res.raw)` and resolves on\n`finish`, so memory stays flat for any file size. `serveStatic()` layers on\ntraversal protection (`resolveWithin`), a dotfiles policy, index files,\nextension fallback and safe fallthrough. See [Static files](static-files.md).\n\n## Settings and environment\n\n`App` keeps a null-prototype `settings` object:\n\n| Setting | Default | Effect |\n| --- | --- | --- |\n| `env` | `NODE_ENV` / `development` | Environment name |\n| `trust proxy` | `false` | `req.ip`/`req.ips` use `X-Forwarded-For` |\n| `x-powered-by` | `false` | Emit `X-Powered-By: routiva` |\n| `expose stack` | non-production | 5xx messages + stacks in responses |\n| `json spaces` | `0` | Reserved |\n\nSet them via `app.set(key, value)`, `app.enable(key)`, `app.disable(key)`; read\nwith `app.setting(key)`. `Request` consults `app.setting('trust proxy')` to\nresolve the client IP.\n\n## 404 / 405 / OPTIONS\n\nWhen the stack is exhausted without an error, `_handleNotFound` runs:\n\n```\nallowed = req._allowedMethods            // recorded when a path matched, method didn't\n   │\n   ├─ has entries?\n   │     ├─ method === OPTIONS ─▶ 204 + Allow: GET, HEAD, OPTIONS, POST, …\n   │     └─ otherwise          ─▶ 405 + Allow header + JSON error\n   │\n   └─ none ─▶ 404 JSON { error: { message, status, path } }\n```\n\nThis is stricter than Express (which generally returns `404` for a wrong method)\nand correct per RFC 9110.\n\n## Exit points\n\nThe framework never writes a response it cannot finish:\n\n- Handlers that respond end the request; further writes are no-ops.\n- Handlers that pass with `next()` reach the next matching layer.\n- Handlers that fail with `next(err)` reach the error chain.\n- An exhausted stack reaches `_handleNotFound`.\n- An unhandled error reaches `_handleError`, or aborts the socket if headers were\n  already sent.\n\n## Where to go next\n\n| If you want to… | Read |\n| --- | --- |\n| Match a name to a method | [API reference](api-reference.md) |\n| See the layer stack in use | [Middleware](middleware.md) |\n| Understand the tradeoffs | [Coming from Express](express-comparison.md) |\n",em="---\ntitle: Body parsing\ndescription: Parse JSON, form, text and raw request bodies into req.body with size limits and content-type gating.\nsection: Core concepts\norder: 5\n---\n\n## The four parsers\n\nroutiva ships four body parsers, all built on one streaming reader:\n\n- `json()` for `application/json`\n- `urlencoded()` for `application/x-www-form-urlencoded`\n- `text()` for `text/plain`\n- `raw()` for a `Buffer` of anything\n\nEach one writes a parsed value to `req.body` and shares the same size-limit and\nerror semantics, so you can stack them and let each parser decide whether the\nrequest is its job.\n\n```js\nimport { App, json, urlencoded, text, raw } from 'routiva';\n\nconst app = new App();\n\napp.use(json({ limit: '1mb' }));\napp.use(urlencoded({ extended: true }));\napp.use(text());\napp.use(raw());\n```\n\n`App.json()`, `App.urlencoded()`, `App.text()` and `App.raw()` are the same\nfunctions attached to the `App` class.\n\n## How a parser decides to run\n\nEvery parser runs the same three checks before touching the stream:\n\n1. **Already parsed?** If `req.body !== undefined`, it calls `next()` without\n   reading. This is what makes stacking safe — the first parser that handles the\n   request wins and the rest become no-ops.\n2. **Is there a body?** A request has one when `transfer-encoding` is present,\n   or `content-length` is present and greater than `0`. A plain `GET` is skipped.\n3. **Does the content type match?** The request's `content-type` is compared to\n   the parser's expected type with a case-insensitive substring match, so\n   `application/json; charset=utf-8` matches `application/json`.\n\nIf any check fails the parser calls `next()` and leaves `req.body` as\n`undefined`.\n\n> Gating is a substring match, not a media-type parse.\n> `application/vnd.api+json` does **not** contain the string `application/json`,\n> so the default `json()` parser skips it. Pass\n> `{ type: 'application/vnd.api+json' }`, or use `text()`/`raw()` for those.\n\n## json()\n\n```js\napp.post('/users', json({ limit: '100kb' }), (req, res) => {\n  res.status(201).json(req.body);\n});\n```\n\n| Option | Default | Behaviour |\n| --- | --- | --- |\n| `limit` | `'1mb'` | Maximum body size; overflow rejects with `413` |\n| `type` | `'application/json'` | Content-Type substring to match |\n| `strict` | `true` | Body must start with `{` or `[` |\n| `reviver` | `undefined` | Passed straight to `JSON.parse` |\n| `verify` | `undefined` | Called as `verify(req, res, buffer, 'utf-8')` before parsing |\n\nBehaviour worth knowing:\n\n- An **empty body** sets `req.body = {}` instead of leaving it `undefined`.\n- With the default `strict: true`, a bare `42`, `\"hello\"` or `true` is rejected\n  before parsing. Set `strict: false` to accept any valid JSON value.\n- **Malformed JSON** rejects with an `HttpError(400)` whose `type` is\n  `entity.parse.failed` and whose `body` property holds the raw text.\n- **Oversized bodies** reject with an `HttpError(413)` with\n  `type: 'entity.too.large'` and the message `Request entity too large`.\n- `verify` runs after the strict check and before `JSON.parse`. Because it runs\n  inside the read promise, **throwing from `verify` routes into your error\n  middleware** — exactly what a webhook signature check needs.\n\n### verify and webhook signatures\n\n`verify` gets the raw buffer, so it can validate a signature over the exact bytes\nthe client sent, before any JSON transformation:\n\n```js\nimport { createHmac, timingSafeEqual } from 'node:crypto';\nimport { HttpError, json } from 'routiva';\n\napp.post('/webhooks/stripe', json({\n  verify(req, res, buffer) {\n    const expected = createHmac('sha256', SECRET).update(buffer).digest('hex');\n    const received = req.header('x-signature') || '';\n    const a = Buffer.from(expected);\n    const b = Buffer.from(received);\n    if (a.length !== b.length || !timingSafeEqual(a, b)) {\n      throw new HttpError(400, 'invalid signature', { type: 'signature.invalid' });\n    }\n  },\n}), (req, res) => {\n  res.json({ received: true });\n});\n```\n\n## urlencoded()\n\n```js\napp.use(urlencoded({ extended: true }));\n```\n\n| Option | Default | Behaviour |\n| --- | --- | --- |\n| `limit` | `'100kb'` | Maximum body size |\n| `extended` | `false` | Decode bracket notation into nested objects |\n\n`urlencoded()` has no `type` option — it always matches\n`application/x-www-form-urlencoded`. The body is read with `URLSearchParams`, so\n`+` and percent-escapes are decoded for you.\n\nWith the default `extended: false`, keys stay flat and the last value wins:\n\n```text\nname=ada&role=admin&role=user    ->    { name: 'ada', role: 'user' }\n```\n\nWith `extended: true`, bracket notation builds nested objects:\n\n```text\nuser[name]=ada&user[address][city]=london\n\n->  { user: { name: 'ada', address: { city: 'london' } } }\n```\n\n> The extended parser builds **objects only**. Array notation such as\n> `tags[]=a&tags[]=b` stores a key literally named `''`, not an array. Send JSON\n> when you need arrays.\n\n## text()\n\n```js\napp.post('/notes', text({ type: 'text/plain' }), (req, res) => {\n  res.json({ length: req.body.length });\n});\n```\n\n| Option | Default | Behaviour |\n| --- | --- | --- |\n| `limit` | `'100kb'` | Maximum body size |\n| `type` | `'text/plain'` | Content-Type substring to match |\n| `encoding` | `'utf8'` | Passed to `buffer.toString(encoding)` |\n\n`req.body` is a string. Pass a broader `type` to accept other text-ish content\ntypes.\n\n## raw()\n\n```js\napp.post('/upload', raw({ type: 'application/octet-stream', limit: '5mb' }), (req, res) => {\n  res.json({ bytes: req.body.length });\n});\n```\n\n| Option | Default | Behaviour |\n| --- | --- | --- |\n| `limit` | `'100kb'` | Maximum body size |\n| `type` | unset | When omitted, **every** content type is accepted; when set, it must match |\n\n`req.body` is a `Buffer`. Unlike the other three parsers, `raw()` does not gate\non content type unless you pass `type`, which makes it the catch-all parser to\nregister last.\n\n## Size limits\n\nLimits are parsed by `parseBytes`, which understands bare numbers and unit\nsuffixes:\n\n| Value | Bytes |\n| --- | --- |\n| `1024` | 1,024 |\n| `'100kb'` | 102,400 |\n| `'1mb'` | 1,048,576 |\n| `'2gb'` | 2,147,483,648 |\n\nWhen the accumulated size exceeds the limit, the reader stops collecting chunks,\n**drains** the rest of the stream with `stream.resume()` so the socket stays\nwritable, and rejects with a `413`. An unparsable limit falls back to that\nparser's default.\n\n## What the client sees\n\nBody-parser errors are `HttpError`s, so the default error handler renders them as\nJSON:\n\n| Situation | Status | `type` | Default message |\n| --- | --- | --- | --- |\n| Malformed JSON | `400` | `entity.parse.failed` | the `JSON.parse` error message |\n| Non-object/array under `strict` | `400` | `entity.parse.failed` | `JSON body must be an object or array` |\n| Body over `limit` | `413` | `entity.too.large` | `Request entity too large` |\n\nBecause 4xx errors are exposed (`status < 500`), their message reaches the\nclient. Override the shape with your own error middleware — see\n[Error handling](error-handling.md).\n",nm="---\ntitle: Compression\ndescription: gzip, deflate and brotli compression for buffered responses with a size threshold and content-type filter.\nsection: Built-in middleware\norder: 2\n---\n\n## What compress() does\n\n`compress()` wraps `res.send()` and, when the client asks for it, compresses the\nfully buffered response with `node:zlib`. It handles the negotiation headers and\nsets `Content-Encoding`, `Content-Length` and `Vary` for you.\n\n```js\nimport { createApp, compress, serveStatic } from 'routiva';\n\nconst app = createApp();\n\napp.use(compress({ threshold: '1kb' }));\napp.use(serveStatic('public'));\n```\n\nRegister it early, before the routes or middleware that build responses, so\n`res.send` is wrapped in time.\n\n## Options\n\n| Option | Default | Meaning |\n| --- | --- | --- |\n| `threshold` | `'1kb'` | Minimum body size to compress; number or string (`'1kb'`, `'100kb'`) |\n| `filter` | `() => true` | `(req, res) => boolean`; return `false` to skip this request |\n| `level` | `undefined` | zlib compression level, passed to gzip and deflate only |\n\n`threshold` is parsed with `parseBytes`, so `'1kb'` means 1024 bytes. Bodies whose\nlength is **less than** the threshold are sent uncompressed; a body exactly at\nthe threshold is compressed. `filter` runs once per request, before any response\nbody exists.\n\n> `level` is applied to gzip and deflate. Brotli is called with `{}` and ignores\n> it, so `compress({ level: 9 })` has no effect when the chosen encoding is `br`.\n\n## Choosing an encoding\n\nThe encoding is picked from the `Accept-Encoding` request header in a fixed\npreference order. Quality values (`q=`) are not parsed — the first token that\nmatches wins.\n\n| `Accept-Encoding` contains | Chosen encoding |\n| --- | --- |\n| `br` | `br` (brotli) |\n| `gzip` (and no `br`) | `gzip` |\n| `deflate` (and no `br`/`gzip`) | `deflate` |\n| `*` (none of the above) | `gzip` |\n| nothing usable (`identity`, empty, absent) | none — response is sent as-is |\n\nThe match is on whole tokens, via a word-boundary regex, so `x-gzip` does not\ntrigger gzip.\n\n## What gets compressed\n\nThe middleware only touches responses that pass every one of these checks:\n\n- The request method is not `HEAD`. `HEAD` is skipped at the top of the\n  middleware.\n- `filter(req, res)` returns truthy.\n- An encoding was selected from `Accept-Encoding`.\n- The response has not already started (`headersSent` is false).\n- The response has no `Content-Encoding` yet, and its `Cache-Control` does not\n  contain `no-transform`.\n- The body is a `string`, `number` or `Buffer`. `null`, `undefined` and plain\n  objects are passed straight through (`objects` delegate to `res.json`).\n- If a `Content-Type` is set, it matches the compressible list below.\n- The buffered body is at least `threshold` bytes.\n\nAll types in this list are compressed:\n\n| Type | Example |\n| --- | --- |\n| `text/*` | `text/html`, `text/plain`, `text/css` |\n| `application/json` | JSON responses |\n| `application/javascript` | `res.type('js')` |\n| `application/xml` | XML |\n| `application/xhtml+xml` | XHTML |\n| `application/manifest+json` | Web app manifests |\n| `image/svg+xml` | SVG |\n\n`image/png`, `application/octet-stream` and anything else are left untouched.\nNote that `res.send()` always assigns a `Content-Type` (defaulting to\n`text/html`), so in practice most responses have a type to test.\n\n## Buffered only\n\nCompression happens inside a wrapped `res.send`, after the body has been built.\nThat makes it a good fit for `res.json()`, `res.send(string)` and buffers — and\nthe wrong tool for streams.\n\n- `res.sendFile()` and `serveStatic()` stream from disk. They never call\n  `res.send`, so those responses pass through uncompressed and keep streaming.\n- `res.end(chunk)` / `res.write(chunk)` called directly are not compressed.\n- `res.send()` on a `Buffer` is compressed if its `Content-Type` is compressible.\n\nWhen compression does run, routiva sets `Content-Encoding`, sets `Content-Length`\nto the compressed size, adds `Vary: Accept-Encoding`, and writes the compressed\nbytes straight to `res.raw.end()`.\n\n> `Vary: Accept-Encoding` is only added when a response is actually compressed.\n> Responses that skip compression do not get it.\n\n## Examples\n\nCompress everything that is at least 1kb, and skip small health checks:\n\n```js\napp.use(\n  compress({\n    threshold: '1kb',\n    filter: (req, res) => req.path !== '/health',\n  }),\n);\n```\n\nCompress only JSON and text, with a lower threshold:\n\n```js\napp.use(\n  compress({\n    threshold: 512,\n    level: 6,\n    filter: (req, res) => req.is('json', 'text/*'),\n  }),\n);\n```\n\nA request that compresses, end to end:\n\n```http\nGET /report HTTP/1.1\nAccept-Encoding: gzip, deflate, br\n```\n\n```http\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nContent-Encoding: br\nContent-Length: 1043\nVary: Accept-Encoding\n```\n\nBecause the `Content-Length` now describes the compressed bytes, clients must\ndecompress before reading the body. Node's `fetch` and most HTTP clients do this\nautomatically. To inspect raw bytes in a test, use the low-level `http` module,\nwhich leaves the body compressed.\n",tm="---\ntitle: Core concepts\ndescription: The mental model behind routiva: the layer stack, next(), the raw wrappers, async errors and app settings.\nsection: Core concepts\norder: 1\n---\n\n## The mental model\n\nAn app is a router. A router is an ordered list of layers. A layer is a route, a\npiece of middleware, or an error handler. A request walks the list from top to\nbottom; each layer either responds, passes control with `next()`, or signals a\nfailure with `next(err)`.\n\n```text\ncreateApp() ─▶ App (extends Router)\n                 │\n                 └─ stack: [ layer, layer, layer, … ]\n                             │\n        request ────────────▶ walk top to bottom ─▶ first response wins\n```\n\n## App extends Router\n\n`App` is a `Router` with an HTTP server, settings and default responses added.\nFrom `src/app.js`:\n\n```js\nexport class App extends Router {\n  constructor(options = {}) {\n    super();\n    this.settings = Object.create(null);\n    this.set('env', options.env || process.env.NODE_ENV || 'development');\n    // ...\n  }\n}\n```\n\nEvery routing method — `get`, `post`, `use`, `param`, `route` — is defined on\n`Router`, so an app has them all. A `Router` on its own is the building block\nfor modular sub-routers:\n\n```js\nimport { Router } from 'routiva';\n\nconst api = new Router();\napi.get('/status', (req, res) => res.json({ ok: true }));\n\napp.use('/api', api);   // mounted at a prefix\n```\n\n## Everything is a layer\n\nRegistering a handler pushes one object onto `this.stack`. A route with three\nhandlers pushes three layers. The shape, from `src/router.js`:\n\n```js\nthis.stack.push({\n  method,               // 'GET' | null (middleware / all)\n  path,                 // original pattern, for debugging\n  regex,                // compiled matcher, built once\n  keys,                 // captured parameter names\n  fn: handler,          // the function actually invoked\n  owner: this,          // which Router registered it\n  isMiddleware,         // prefix match vs exact match\n  isErrorHandler: handler.length === 4,\n});\n```\n\nRoutes and middleware share the same array. There is no separate \"middleware\nphase\" and \"route phase\" — only the order you registered things in. Paths are\ncompiled to a `RegExp` once, at registration, and reused for every request.\n\n## next() and next(err)\n\nA handler that does not respond must call `next()`. Calling `next(err)` switches\nthe stack into error mode. `dispatch()` enforces the switch with one comparison\n(`src/router.js`, abridged):\n\n```js\nfunction dispatch(stack, req, res, done) {\n  let index = 0;\n  let finished = false;\n\n  function next(err) {\n    if (finished) return;                                 // done() runs once\n    if (index >= stack.length) { finished = true; return done(err); }\n    const wantsError = Boolean(err);\n    let layer, match;\n    while (index < stack.length) {\n      layer = stack[index++];\n      if (layer.isErrorHandler !== wantsError) continue;  // 4-arity ⇔ error mode\n      match = layer.regex.exec(req.path);\n      if (!match) continue;\n      if (!methodAllows(layer, req)) continue;            // HEAD→GET, 405\n      break;\n    }\n    if (!match) { finished = true; return done(err); }\n    invoke(layer, match, err, req, res, next);\n  }\n\n  next();\n}\n```\n\nA shared cursor means `next()` from any depth walks forward through the same\nlist without re-running earlier layers. The `finished` latch guarantees `done`\nruns once even if a handler calls `next()` twice.\n\n## Registration order is execution order\n\nA `use()` written before your routes runs first. An error handler written after\nyour routes can catch their errors; one written before them cannot, because it\nhas already been passed.\n\n```js\napp.use(logger());                 // runs first\napp.get('/users', listUsers);      // runs next\napp.use((err, req, res, next) => { // runs only if a later layer calls next(err)\n  res.status(err.status || 500).json({ error: { message: err.message } });\n});\n```\n\n## Error handlers are arity 4\n\nThe only rule is the function's `length`. Four parameters marks an error\nhandler; three marks an ordinary handler or middleware. No registration API is\nneeded.\n\n```js\napp.use((req, res, next) => { /* normal */ });     // length === 3\napp.use((err, req, res, next) => { /* error */ });  // length === 4\n```\n\nIf no error handler responds, `App._handleError` builds a JSON error. `HttpError`\nsets `expose = status < 500`, so 4xx messages reach the client while 5xx messages\nare hidden unless `expose stack` is on:\n\n```js\nconst expose = this.setting('expose stack');\nconst message = error.expose || expose ? error.message : statusMessage(status);\nres.status(status).json({ error: { message, status } });\n```\n\n## Request and Response are thin wrappers\n\nNode's `IncomingMessage` and `ServerResponse` are wrapped once per request. Both\noriginals stay reachable as `req.raw` and `res.raw`, so the framework never\nhides the socket — anything the wrapper does not cover (`req.raw.setTimeout`,\n`res.raw.writeHead`) is still one property away.\n\n`Request` parses the URL, query, cookies and client IP in its constructor, so\nper-request work happens once. `Response` makes every mutator chainable\n(`res.status(201).type('json').send({ ok: true })`) and guards against a second\nsend by checking `res.raw.headersSent || res.raw.writableEnded`.\n\n## Async handlers\n\nHandlers may return a promise. routiva attaches `.catch(next)` to every returned\npromise (`src/router.js`), so a rejection is forwarded to the error chain exactly\nlike a synchronous throw — no wrapper library needed:\n\n```js\napp.get('/data', async (req, res) => {\n  const row = await db.get(req.params.id);  // rejection reaches your error handler\n  res.json(row);\n});\n```\n\nThis matches Express 5 behaviour. Express 4 only forwarded synchronous throws.\n\n## Settings\n\n`App` stores settings on a null-prototype object. Read them with\n`app.setting(key)`, write with `app.set(key, value)` or the boolean helpers\n`app.enable(key)` / `app.disable(key)`. Constructor options set the same keys up\nfront.\n\n| Setting | Default | Effect |\n| --- | --- | --- |\n| `env` | `process.env.NODE_ENV` or `'development'` | Environment name |\n| `trust proxy` | `false` | `req.ip` / `req.ips` read `X-Forwarded-For` |\n| `x-powered-by` | `false` | Adds `X-Powered-By: routiva` to responses |\n| `json spaces` | `0` | Reserved |\n| `expose stack` | `env !== 'production'` | 5xx messages and stack traces in error responses |\n\n```js\nconst app = createApp({ trustProxy: true, xPoweredBy: false });\napp.disable('x-powered-by');\napp.set('json spaces', 2);\n```\n\n`trust proxy` also accepts a number: with `n`, `req.ip` is taken `n` hops from\nthe right of `X-Forwarded-For`.\n\n## The request lifecycle\n\n```text\n  Client           App._handle            Router.handle          layer            Response\n    │  GET /users/1 ─▶│ wrap req/res ──────▶│ dispatch(stack) ─────▶│ handler(req,res) │\n    │                 │                     │                      │ res.status/json ▶│\n    │◀─────────────────────── 200 application/json ─────────────────────────────────── │\n    │                 │◀── done(err) ───────│ (only if nothing responded)\n    │                 │  _handleError(err)  or  _handleNotFound(req, res)\n```\n\n1. `_handle` wraps the raw request and response.\n2. `Router.handle` dispatches the stack, matching methods, params and prefixes.\n3. If a layer responds, the request is done.\n4. Otherwise `done()` produces a `404`, a `405` with an `Allow` header, or an auto `204` for `OPTIONS`.\n5. If an error was raised, `_handleError` produces a safe JSON error instead.\n\n## Why zero dependencies\n\nroutiva imports only Node built-ins: `node:http`, `node:url`, `node:fs`,\n`node:path`, `node:zlib` and `node:crypto`. That keeps the install tree at one\npackage and the entire framework in files you can read in an afternoon. The\ntrade-off is ecosystem size — routing, body parsing, static files, CORS,\ncompression and rate limiting ship in the core, but template engines, sessions\nand third-party plugins do not.\n",rm="---\ntitle: CORS\ndescription: Cross-origin headers, automatic preflight handling and an allow-list origin function for production.\nsection: Built-in middleware\norder: 1\n---\n\n## What cors() does\n\n`cors()` sets the `Access-Control-*` headers a browser needs for a cross-origin\nrequest, and answers `OPTIONS` preflight requests for you.\n\n```js\nimport { createApp, cors } from 'routiva';\n\nconst app = createApp();\n\napp.use(cors({ origin: 'https://example.com', credentials: true }));\n```\n\nRegister it once, before your routes, and it runs on every request that reaches\nit. It never ends the request except during a preflight.\n\n## Options\n\n| Option | Default | Meaning |\n| --- | --- | --- |\n| `origin` | `'*'` | Allowed origin: string, array, `true` (reflect), `'*'`, or a function |\n| `methods` | `'GET,HEAD,PUT,PATCH,POST,DELETE'` | Value for `Access-Control-Allow-Methods` |\n| `credentials` | `false` | Also send `Access-Control-Allow-Credentials: true` |\n| `preflightContinue` | `false` | Call `next()` after a preflight instead of responding |\n| `optionsSuccessStatus` | `204` | Status code used for the automatic preflight response |\n| `maxAge` | `undefined` | `Access-Control-Max-Age` in seconds; header is omitted when unset |\n| `allowedHeaders` | reflect request | Value for `Access-Control-Allow-Headers` |\n| `exposedHeaders` | `undefined` | Value for `Access-Control-Expose-Headers` |\n\n`methods`, `allowedHeaders` and `exposedHeaders` accept either a string or an\narray. Arrays are joined with `,` (no space) when written to the header.\n\n### Resolving origin\n\n`origin` accepts several shapes. The resolution lives in `resolveOrigin`:\n\n| `origin` value | Behaviour |\n| --- | --- |\n| `'*'` (default) | Sends `*`, unless `credentials` is true — then it reflects the request `Origin` |\n| `true` | Reflects the request `Origin` (falls back to `*` when the request has none) |\n| `'https://example.com'` | Sends that exact string for every request |\n| `['https://a.com', 'https://b.com']` | Reflects the request `Origin` only when it is in the array |\n| `(origin, req) => string \\| false` | Return value is used verbatim; `false` (or empty) sets no CORS headers |\n\nThe request origin comes from the `Origin` header. When an array value does not\ncontain it, or a function returns `false`, the middleware sets no CORS headers at\nall and simply calls `next()`.\n\n> A literal `Access-Control-Allow-Origin: *` is invalid together with\n> `Access-Control-Allow-Credentials: true`. routiva handles this for you: with the\n> default `'*'` and `credentials: true`, it reflects the request `Origin` instead.\n\n## Which headers are set\n\nFor any non-preflight request where an origin resolves to a truthy value:\n\n- `Access-Control-Allow-Origin` — the resolved origin.\n- `Vary: Origin` — **only** when the resolved origin is not `*`.\n- `Access-Control-Allow-Credentials: true` — when `credentials` is set.\n- `Access-Control-Expose-Headers` — when `exposedHeaders` is set.\n\nFor `OPTIONS` requests, additionally:\n\n- `Access-Control-Allow-Methods` — always, from `methods`.\n- `Access-Control-Allow-Headers` — only when `allowedHeaders` is set, or the\n  request already sent `Access-Control-Request-Headers` (which is echoed).\n- `Access-Control-Max-Age` — only when `maxAge != null`.\n\nThen control continues to `next()`.\n\n## How preflight is answered\n\nAn `OPTIONS` request is treated as a preflight whenever it reaches the\nmiddleware. The flow is:\n\n```text\nOPTIONS /api/items\n  │\n  ├─ resolve origin from `Origin`\n  ├─ set ACAO / Vary / credentials / expose headers\n  ├─ set Access-Control-Allow-Methods\n  ├─ echo Access-Control-Request-Headers (or use allowedHeaders)\n  ├─ set Access-Control-Max-Age (when maxAge is set)\n  │\n  └─ preflightContinue?\n        ├─ true  → next()   (headers stay set; your route owns the response)\n        └─ false → 204 (optionsSuccessStatus) + empty body\n```\n\nWith the default `preflightContinue: false`, the middleware ends the request with\n`res.status(optionsSuccessStatus).send()` — a `204` with `Content-Length: 0`.\nSet `preflightContinue: true` when you want a route or another middleware to\nproduce the `OPTIONS` response; the CORS headers are already on the response by\nthen.\n\nBecause `cors()` answers `OPTIONS` itself, it takes precedence over routiva's\nbuilt-in automatic `OPTIONS` handling.\n\n## A production allow-list\n\nUse a function to enforce an allow-list and reflect only the origins you trust.\nMixing `credentials: true` with a reflected origin is the correct combination.\n\n```js\nimport { createApp, cors } from 'routiva';\n\nconst ALLOWED = new Set([\n  'https://app.example.com',\n  'https://admin.example.com',\n]);\n\nconst app = createApp();\n\napp.use(\n  cors({\n    origin(origin, req) {\n      // No Origin header: not a browser cross-origin request.\n      if (!origin) return false;\n      return ALLOWED.has(origin) ? origin : false;\n    },\n    credentials: true,\n    methods: ['GET', 'POST', 'PATCH', 'DELETE'],\n    allowedHeaders: ['Content-Type', 'Authorization'],\n    exposedHeaders: ['X-Request-Id'],\n    maxAge: 86400,\n  }),\n);\n```\n\nReturning the request origin (instead of `'*'`) is what lets cookies flow.\nReturning `false` for an unknown origin leaves the response without CORS headers,\nso the browser blocks the call.\n\n## Caching and Vary\n\n`Vary: Origin` is added whenever the resolved origin is not `*`, so shared caches\nkey on the request `Origin` and do not serve one caller's allow-header to\nanother. For a static `'*'` origin with no credentials, the header is omitted and\nthe response is safe to share.\n\nIf you serve different origins from the same route, always use a string,\nfunction or array — never a bare `'*'` combined with credentials.\n",sm="---\ntitle: Error handling\ndescription: Route errors into 4-argument middleware, throw HttpError, and understand the default JSON error and 404/405 responses.\nsection: Core concepts\norder: 7\n---\n\n## next(err) is the switch\n\nHandlers either finish the response or call `next()`. Calling `next(err)` with a\ntruthy value switches the stack into error mode: from that point, only\n4-argument error handlers are eligible.\n\n```js\napp.get('/users/:id', (req, res, next) => {\n  const user = users.get(req.params.id);\n  if (!user) return next(new HttpError(404, 'user not found'));\n  res.json(user);\n});\n```\n\nTwo things reach error middleware automatically, with no wrapper library:\n\n- A **synchronous `throw`** inside any handler.\n- A **rejected promise** returned by any handler. The router calls\n  `.catch(next)` on every returned promise.\n\n```js\napp.get('/data', async (req, res) => {\n  const row = await db.get(req.params.id); // rejection → error middleware\n  res.json(row);\n});\n```\n\nExpress 4 only forwarded synchronous throws; routiva forwards both.\n\n## Error middleware\n\nAn error handler is any function whose `length === 4`. There is no registration\nAPI — arity is the marker.\n\n```js\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(err.status || 500).json({ error: { message: err.message } });\n});\n```\n\nThe dispatch loop skips 4-arity functions during normal flow and skips 3-arity\nfunctions during error flow, so the same stack serves both.\n\nOrdering matters, exactly as with regular middleware:\n\n- Register error handlers **after** the routes whose errors they should catch.\n- Registering one **before** a route means that route's errors will not reach it,\n  because the cursor has already moved past it.\n\nInside an error handler you can:\n\n- Send a response, ending the chain.\n- Call `next(err)` to pass the error to the next error handler (for example WARN,\n  then a final JSON handler).\n- Call `next()` with no argument to drop back into normal flow at the current\n  cursor.\n- Call `next` after the response is sent — the response is write-once, so extra\n  calls are ignored.\n\n## HttpError\n\n`HttpError` carries an HTTP status and marks itself safe to expose:\n\n```js\nimport { HttpError } from 'routiva';\n\nthrow new HttpError(422, 'validation failed', { type: 'validation.failed' });\n```\n\n| Argument | Type | Notes |\n| --- | --- | --- |\n| `status` | `number` | Also assigned to `statusCode` |\n| `message` | `string` | Defaults to the status reason phrase |\n| `options.expose` | `boolean` | Overrides the default exposure of the message |\n| `options.type` | `string` | Machine-readable error code, echoed in the response |\n| `options.cause` | `Error` | Underlying error, kept off the wire |\n\n`error.expose` is set to `status < 500 || options.expose === true`. In other\nwords, 4xx messages are safe to send and 5xx messages are hidden unless you opt\nin. The constructor also preserves a `cause` and sets the error name to\n`HttpError`.\n\nConvenience constructors:\n\n| Call | Status |\n| --- | --- |\n| `HttpError.badRequest(message?, options?)` | `400` |\n| `HttpError.unauthorized(message?, options?)` | `401` |\n| `HttpError.forbidden(message?, options?)` | `403` |\n| `HttpError.notFound(message?, options?)` | `404` |\n| `HttpError.methodNotAllowed(message?, options?)` | `405` |\n| `HttpError.tooLarge(message?, options?)` | `413` |\n| `HttpError.internal(message?, options?)` | `500` |\n\n## The default error handler\n\nIf no error middleware sends a response, `App._handleError` runs. It normalises\nthe error first: it accepts anything (`next('oops')` becomes `new Error('oops')`),\nreads `err.status` or `err.statusCode`, and uses it only when it is an integer\nbetween `400` and `599`. Everything else becomes `500`.\n\nThe body is JSON:\n\n```json\n{\n  \"error\": {\n    \"message\": \"user not found\",\n    \"status\": 404,\n    \"type\": \"validation.failed\"\n  }\n}\n```\n\n- `type` is included only when `error.type` is set.\n- `stack` is included only when the `expose stack` setting is on **and** the\n  status is `>= 500` and a stack exists.\n- `message` is `error.message` when the error is exposed **or** `expose stack` is\n  on; otherwise it is the canonical reason phrase for the status.\n\n### expose stack and production\n\nThe `expose stack` setting defaults to `env !== 'production'`, where `env` comes\nfrom `options.env`, then `NODE_ENV`, then `'development'`. So in development the\nreal message and a 5xx stack are returned; with `NODE_ENV=production` a 500\nreturns `{ \"error\": { \"message\": \"Internal Server Error\", \"status\": 500 } }` with\nno stack.\n\n| Error | `expose` | Development | Production |\n| --- | --- | --- | --- |\n| `HttpError(404, 'user not found')` | `true` | `user not found` | `user not found` |\n| `HttpError(500, 'db down')` | `false` | `db down` + stack | `Internal Server Error` |\n| `new Error('boom')` | unset | `boom` + stack | `Internal Server Error` |\n\nSet it explicitly with `app.set('expose stack', true/false)` or the\n`exposeStack` constructor option. For a single error, set\n`options.expose: true` on the `HttpError`.\n\n### Headers already sent\n\nIf a handler throws after it has started writing, the response cannot be replaced.\nThe default handler checks `res.raw.headersSent` and, rather than crashing with\n`ERR_HTTP_HEADERS_SENT`, aborts the socket with `res.raw.destroy()`. Your own\nerror middleware should make the same check:\n\n```js\napp.use((err, req, res, next) => {\n  if (res.raw.headersSent) return next(err); // let the default handler abort\n  res.status(500).json({ error: { message: 'Internal Server Error', status: 500 } });\n});\n```\n\n## 404, 405 and OPTIONS\n\nWhen the stack is exhausted without an error, `_handleNotFound` runs. If any\nroute matched the path but not the method, that method is recorded and the\nresponse describes what is allowed.\n\n| Situation | Response |\n| --- | --- |\n| No path matched | `404` + `{ error: { message: 'Not Found', status: 404, path: req.originalUrl } }` |\n| Path matched, wrong method | `405` + `Allow` header + `{ error: { message: 'Method Not Allowed', status: 405 } }` |\n| `OPTIONS` on a known path | `204` + `Allow` header, empty body |\n\nThe `Allow` list is sorted and always includes `OPTIONS`. When a `GET` route\nexists, `HEAD` is recorded alongside it, so a `GET`-only path reports\n`Allow: GET, HEAD, OPTIONS`. This is stricter than Express, which returns `404`\nfor a wrong method, and matches RFC 9110.\n\n## Customising\n\nAdd your own error middleware after the routes. A typical handler logs, then\nrenders a stable shape:\n\n```js\nimport { App, HttpError } from 'routiva';\n\nconst app = new App();\n\napp.get('/users/:id', (req, res) => {\n  throw new HttpError(404, 'user not found', { type: 'user.not_found' });\n});\n\napp.use((err, req, res, next) => {\n  if (res.raw.headersSent) return next(err);\n  const status = err.status || err.statusCode || 500;\n  res.status(status).json({\n    error: {\n      message: status < 500 ? err.message : 'internal error',\n      status,\n      type: err.type,\n    },\n  });\n});\n\napp.use((err, req, res, next) => {\n  // Fallback: delegate anything unhandled to the built-in handler.\n  next(err);\n});\n```\n\nTo replace the default 404 itself, register a terminal middleware or catch-all\nroute after your real routes; it will run before `_handleNotFound` gets a chance:\n\n```js\napp.use((req, res) => {\n  res.status(404).json({ error: { message: 'Not Found', status: 404, path: req.originalUrl } });\n});\n```\n",om=`---
title: Examples
description: A runnable demo, a complete CRUD API with a browser UI, and focused snippets for routing, errors, uploads, SPA fallbacks and custom middleware.
section: Guides
order: 1
---

## Running the bundled examples

From a clone of the repository:

\`\`\`bash
npm run example       # node examples/basic.js    → http://localhost:3000
npm run crud          # node crud-app/server.js    → http://127.0.0.1:3000
\`\`\`

\`examples/basic.js\` is a single readable file that touches most of the
framework. The CRUD app is a full application with a browser UI, persistent
storage and its own test suite.

## \`examples/basic.js\`, line by line

The demo registers the built-in middleware in the recommended order, then a
handful of routes.

\`\`\`js
import { fileURLToPath } from 'node:url';
import { App, Router, HttpError } from '../src/index.js';

const publicDir = fileURLToPath(new URL('./public', import.meta.url));
const app = new App();

// --- Global middleware -----------------------------------------------------
app.use(App.logger());
app.use(App.cors({ origin: true, credentials: true }));
app.use(App.compress());
app.use(App.rateLimit({ windowMs: 60_000, max: 100 }));
app.use(App.json());                    // parse JSON bodies (max 1mb)
app.use(App.serveStatic(publicDir, { maxAge: '1h' }));
\`\`\`

| Step | Why it is in this order |
| --- | --- |
| \`logger()\` | Wraps every request so the completion line is always written |
| \`cors()\` | Answers preflights before any route work |
| \`compress()\` | Wraps \`res.send\` before bodies are produced |
| \`rateLimit()\` | Rejects abusive callers before real work |
| \`json()\` | Parses only JSON requests, leaves others alone |
| \`serveStatic()\` | Last, so explicit routes win and misses fall through |

Routes use the wrapped \`req\`/\`res\` directly:

\`\`\`js
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query, cookies: req.cookies });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.get('/download', (req, res) => {
  res.download(fileURLToPath(new URL('./public/style.css', import.meta.url)), 'style.css');
});
\`\`\`

Content negotiation picks a representation from the \`Accept\` header:

\`\`\`js
app.get('/greet', (req, res) =>
  res.format({
    json: () => res.json({ hello: req.query.name || 'world' }),
    html: () => res.send(\`<h1>Hello \${req.query.name || 'world'}</h1>\`),
    default: () => res.status(406).send('Not Acceptable'),
  }),
);
\`\`\`

A sub-router mounted at a prefix:

\`\`\`js
const api = new Router();
api.get('/status', (req, res) => res.json({ status: 'ok' }));
app.use('/api', api);          // GET /api/status
\`\`\`

And an error handler, registered last:

\`\`\`js
app.get('/boom', () => {
  throw new HttpError(500, 'Something went wrong');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});
\`\`\`

## The CRUD application

\`crud-app/\` is a small inventory service built entirely on routiva: a REST API,
a JSON-backed store, a browser UI, validation and tests.

\`\`\`bash
npm run crud
\`\`\`

| URL | What |
| --- | --- |
| <http://127.0.0.1:3000> | Browser UI (create / edit / delete / restock / search) |
| <http://127.0.0.1:3000/api/products> | JSON API |
| <http://127.0.0.1:3000/api/health> | Health check |

Configuration is through environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| \`PORT\` | \`3000\` | Listening port |
| \`HOST\` | \`127.0.0.1\` | Listening host |
| \`DATA_FILE\` | \`crud-app/data/products.json\` | JSON datastore |

The app seeds five sample products on first run.

### The API

Base path \`/api\`. Errors share one envelope:

\`\`\`json
{ "error": { "message": "Validation failed", "status": 422,
             "details": { "name": "name is required" } } }
\`\`\`

| Method | Path | Description |
| --- | --- | --- |
| \`GET\` | \`/api/health\` | Liveness + uptime |
| \`GET\` | \`/api/stats\` | Counts and total inventory value |
| \`GET\` | \`/api/categories\` | Distinct categories |
| \`GET\` | \`/api/products\` | List, with query options below |
| \`POST\` | \`/api/products\` | Create → \`201\` + \`Location\` |
| \`GET\` | \`/api/products/:id\` | Read one → \`200\` / \`404\` |
| \`PUT\` | \`/api/products/:id\` | Replace → \`200\` |
| \`PATCH\` | \`/api/products/:id\` | Partial update → \`200\` |
| \`POST\` | \`/api/products/:id/restock\` | Add \`{ "amount": n }\` to stock |
| \`DELETE\` | \`/api/products/:id\` | Delete → \`204\` |

List query options: \`search\`, \`category\`, \`inStock=true|false\`,
\`sort=created|name|price|stock\`, \`order=asc|desc\`, \`page\`, \`limit\` (max 100).

Try it:

\`\`\`bash
curl http://127.0.0.1:3000/api/products
curl -X POST http://127.0.0.1:3000/api/products \\
  -H 'content-type: application/json' \\
  -d '{"name":"Webcam","sku":"CAM-1","price":59.99,"stock":4,"category":"peripherals"}'
curl -X POST http://127.0.0.1:3000/api/products/1/restock \\
  -H 'content-type: application/json' -d '{"amount":5}'
curl -X DELETE -i http://127.0.0.1:3000/api/products/1
\`\`\`

### How it is wired

\`crud-app/app.js\` exports a \`createApp()\` **factory** so tests can build an
isolated instance with a temp data file, logging off and a high rate limit:

\`\`\`js
export async function createApp({ dataFile, logging, rateLimitMax, seed } = {}) {
  const store = await new ProductStore(path.resolve(dataFile)).load();
  if (seed) await store.seedIfEmpty(SAMPLE_PRODUCTS);

  const app = new App({ env: process.env.NODE_ENV || 'development' });

  app.use(logger({ enabled: logging }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(compress({ threshold: '1kb' }));
  app.use(rateLimit({ windowMs: 60_000, max: rateLimitMax }));
  app.use(json({ limit: '100kb' }));

  app.use('/api', productsRouter(store));
  app.use(serveStatic(publicDir, { maxAge: '5m', extensions: ['html'] }));

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    let status = err.status || err.statusCode || 500;
    if (err.type === 'entity.parse.failed') status = 400;
    else if (err.type === 'entity.too.large') status = 413;
    res.status(status).json({ error: { message: err.message, status } });
  });

  return { app, store };
}
\`\`\`

\`crud-app/routes/products.js\` is a \`Router\` mounted at \`/api\`. It uses
\`router.param('id', …)\` to load and validate the product **once** for every
route with an \`:id\`:

\`\`\`js
router.param('id', (req, res, next, id) => {
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return next(new HttpError(400, 'product id must be a positive integer'));
  }
  const product = store.get(numeric);
  if (!product) return next(new HttpError(404, 'product not found'));
  req.product = product;
  req.productId = numeric;
  next();
});

router.get('/products/:id', (req, res) => res.json(req.product));

router.post('/products', async (req, res) => {
  const { ok, data, errors } = validateProduct(req.body ?? {});
  if (!ok) throw validationError(errors);
  if (store.findBySku(data.sku)) throw new HttpError(409, 'sku already exists');
  const product = await store.create(data);
  res.status(201).set('Location', \`/api/products/\${product.id}\`).json(product);
});
\`\`\`

Because routiva forwards rejected promises, the \`async\` handlers \`throw\` straight
into the error middleware — no \`try/catch\` and no \`next(err)\` wrappers.

### Testing it

\`\`\`bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh — end-to-end curl script
\`\`\`

The smoke script boots the app on a throwaway data file and port, drives every
endpoint with \`curl\`, prints status codes, and cleans up. The full story is on
the [Testing](testing.md) page.

## Focused snippets

### A JSON API with a param and an error handler

\`\`\`js
import { createApp, json, HttpError } from 'routiva';

const app = createApp();
app.use(json());

const items = new Map();

app.param('id', (req, res, next, id) => {
  const item = items.get(id);
  if (!item) return next(HttpError.notFound('item not found'));
  req.item = item;
  next();
});

app.get('/items/:id', (req, res) => res.json(req.item));
app.put('/items/:id', (req, res) => {
  Object.assign(req.item, req.body);
  res.json(req.item);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message, status: err.status || 500 } });
});

app.listen(3000);
\`\`\`

### A single-page app fallback

Serve real assets from disk, then return the shell for anything else:

\`\`\`js
app.use(serveStatic('dist', { index: ['index.html'], extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile('dist/index.html'));
\`\`\`

See [Static files](static-files.md#single-page-app-fallback) for the details.

### A verified webhook

\`json({ verify })\` runs on the raw bytes, so a signature check can reject before
the body is parsed:

\`\`\`js
import { createHmac, timingSafeEqual } from 'node:crypto';
import { json, HttpError } from 'routiva';

app.post('/webhooks/github', json({
  verify(req, res, buffer) {
    const expected = createHmac('sha256', SECRET).update(buffer).digest('hex');
    const received = req.header('x-hub-signature-256') || '';
    const a = Buffer.from(\`sha256=\${expected}\`);
    const b = Buffer.from(received);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new HttpError(401, 'invalid signature');
    }
  },
}), (req, res) => {
  res.json({ received: true, event: req.body });
});
\`\`\`

More on the parser hooks: [Body parsing](body-parsing.md#verify-and-webhook-signatures).

### Your own middleware

\`\`\`js
function requestId() {
  let counter = 0;
  return (req, res, next) => {
    const id = \`req-\${++counter}\`;
    req.id = id;
    res.set('X-Request-Id', id);
    next();
  };
}

app.use(requestId());
\`\`\`

See [Middleware](middleware.md#writing-your-own) for more patterns.

### A per-route rate limit

\`\`\`js
const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  keyGenerator: (req) => \`\${req.ip}:\${req.body?.email ?? ''}\`,
});

app.post('/login', loginLimiter, loginHandler);
\`\`\`

More: [Rate limiting](rate-limiting.md#per-route-limits).

## Where the files live

\`\`\`
examples/
  basic.js              runnable demo (static, cors, compress, download, format)
  public/               assets for the demo
crud-app/
  server.js             entry point: createApp() + listen + graceful shutdown
  app.js                createApp(): middleware order, routes, error handler
  store.js              file-backed JSON store (atomic writes)
  validate.js           pure validation returning { ok, data, errors }
  routes/products.js    a Router with the CRUD endpoints
  public/               static single-page frontend
  test/crud.test.js     integration tests (node:test + fetch)
  curl.sh               end-to-end smoke test
  requests.http         REST-client requests
\`\`\`

## Where to go next

| If you want to… | Read |
| --- | --- |
| Write tests like these | [Testing](testing.md) |
| Reason about performance | [Performance](performance.md) |
| Port an existing Express app | [Coming from Express](express-comparison.md) |
`,am="---\ntitle: Coming from Express\ndescription: Map an Express app onto routiva: what stays identical, what changes, and where Express still wins.\nsection: Guides\norder: 4\n---\n\n## The mental model is unchanged\n\nAn app is a router. A router is an ordered list of layers. A layer is a route, a\npiece of middleware, or an error handler. `next()` moves a request down the list,\nand registration order is execution order. None of that changes when you move\nfrom Express to routiva.\n\nThe handler signatures are identical, so most route bodies copy over untouched.\nA function `(req, res, next)` is middleware in both. A four-arity function\n`(err, req, res, next)` is an error handler in both.\n\n## API mapping\n\n| Express | routiva |\n| --- | --- |\n| `const app = express()` | `const app = createApp()` or `new App()` |\n| `app.use(fn)` | `app.use(fn)` |\n| `app.use('/api', router)` | `app.use('/api', router)` |\n| `app.get/post/put/patch/delete/head/options` | identical, plus `app.all()` |\n| `express.Router()` | `new Router()` |\n| `express.json()` | `json()` or `App.json()` |\n| `express.urlencoded({ extended: true })` | `urlencoded({ extended: true })` |\n| `express.static('public')` | `serveStatic('public')` |\n| `express.text()` / `express.raw()` | `text()` / `raw()` |\n| `req.params`, `req.query`, `req.body`, `req.cookies` | identical |\n| `req.get(name)` / `req.header(name)` | identical |\n| `res.status/json/send/redirect/type/set/cookie` | identical |\n| `res.sendFile(path)` / `res.download(path)` | identical |\n| `req.accepts()` / `res.format()` | identical |\n| `next(err)` | identical |\n| `app.use((err, req, res, next) => {})` | identical |\n| `app.listen(port, cb)` | identical; returns the `http.Server` |\n\nThe `cors`, `compression`, `express-rate-limit`, `morgan`, `cookie-parser` and\n`serve-static` imports disappear. Their equivalents are exported by `routiva`\nand used the same way.\n\n## Same shape, less ceremony\n\nA users endpoint in Express, with the packages it needs:\n\n```js\nimport express from 'express';\nimport cors from 'cors';\nimport compression from 'compression';\n\nconst app = express();\napp.use(cors());\napp.use(compression());\napp.use(express.json());\n\napp.get('/users/:id', async (req, res, next) => {\n  try {\n    const user = await db.find(req.params.id);\n    if (!user) return res.status(404).json({ error: 'not found' });\n    res.json(user);\n  } catch (err) {\n    next(err);          // Express 4 needs this\n  }\n});\n\napp.listen(3000);\n```\n\nThe routiva version:\n\n```js\nimport { createApp, cors, compress, json } from 'routiva';\n\nconst app = createApp();\napp.use(cors());\napp.use(compress());\napp.use(json());\n\napp.get('/users/:id', async (req, res) => {\n  const user = await db.find(req.params.id);   // a rejection is forwarded\n  if (!user) return res.status(404).json({ error: 'not found' });\n  res.json(user);\n});\n\napp.listen(3000);\n```\n\nThe route body does not change. The `try/catch`, the extra imports and the\nseparate packages do.\n\n## What differs\n\n### Async errors are handled for you\n\nExpress 4 only forwards synchronous throws to error middleware. A rejected\npromise inside an `async` handler hangs the request unless you wrap it. routiva\nattaches `.catch(next)` to the value every handler returns, so `throw` and\n`Promise.reject` both reach your error middleware. Express 5 catches async\nerrors too; routiva matches that behaviour.\n\n### 405 with an Allow header\n\nIf a path matches but the method does not, routiva answers\n`405 Method Not Allowed` with a correct `Allow` header. Express returns `404`.\nFor a path that exists, routiva answers `OPTIONS` automatically with `204` and\nthe same `Allow` list, and `HEAD` reuses the matching `GET` route with the body\nsuppressed.\n\n### One response, once\n\n`res.send()` and `res.json()` are guarded by `res.raw.headersSent` and\n`res.raw.writableEnded`. A stray second `res.json()` is a no-op instead of an\n`ERR_HTTP_HEADERS_SENT` crash.\n\n### Body parse errors have stable types\n\n`json()` rejects a body that is not an object or array with\n`400 entity.parse.failed`, and an oversized body with `413 entity.too.large`.\nThe `type` value is set on the error, so one error handler can map both.\n\n### No template engine or view system\n\nThere is no `res.render()`, no `app.set('view engine', ...)`, no views\ndirectory, no view cache and no `app.locals`. If your app renders HTML on the\nserver, keep Express or render it yourself and call `res.send()`. One minor\ndetail: `res.locals` exists as an empty object on each response, but nothing in\nthe framework reads it for you.\n\n### Smaller path syntax\n\nroutiva supports `:name` parameters and a `*` wildcard. Express also supports\noptional parameters (`:id?`), inline regex (`:id(\\d+)`) and arrays of paths.\nPort those by validating inside `router.param()` or the handler.\n\n## Where Express still wins\n\n- **Ecosystem.** Thousands of mature middlewares, adapters and integrations.\n- **Rendering.** Any template engine via `res.render()`.\n- **Sessions, flash, auth.** Passport and its strategies are Express-shaped.\n- **Advanced routing.** Optional params, regex params and path arrays.\n- **Streaming compression.** routiva compresses buffered `res.send()` output;\n  streamed files pass through untouched. Express's `compression` wraps the whole\n  response stream.\n- **Track record.** Express has years of production hardening. routiva is a\n  compact, well-tested implementation.\n\nUse Express when the ecosystem is doing real work for you. Use routiva when you\nwant the same mental model inside a core you can read end to end.\n\n## A migration checklist\n\n1. Replace `express()` with `createApp()` and swap `require` for an import.\n2. Move CORS, compression and rate limiting to routiva's bundled factories.\n3. Drop `cookie-parser`; `req.cookies` is already parsed.\n4. Replace `express.json()` with `json({ limit: '100kb' })`.\n5. Delete the `try/catch` plus `next(err)` wrappers around async handlers.\n6. Replace `res.render()` call sites before you start.\n7. Run your suite against the new app. Most handler bodies will not have\n   changed.\n",im=`---
title: FAQ & roadmap
description: Production readiness, TypeScript, websockets, uploads, Node versions, framework comparisons, the roadmap and contributing.
section: Guides
order: 5
---

## Is it production-ready?

It is small and tested, and the behaviour it implements is deliberate. It is
also new. The honest position:

- It works. There is a real test suite and a runnable demo app.
- It has not seen years of hostile traffic the way Express has.
- It ships no ecosystem, so anything beyond the built-in middleware is yours to
  write.

It is a good fit for internal services, prototypes, edge and embedded targets,
and any project that values a zero-dependency core. Evaluate it against your own
workload before putting it in front of users; nothing here replaces that
judgement.

## Does it work with TypeScript?

There are no bundled type declarations. routiva ships as plain ESM JavaScript.
You have three options:

1. Set \`"allowJs": true\` and let TypeScript infer what it can from the source.
2. Write a \`.d.ts\` file for the surface you use.
3. Write the server in plain JavaScript.

The API is regular: classes, named exports and middleware factories. Nothing
relies on dynamic shapes that resist typing, so hand-written declarations are
straightforward. Bundled types are on the roadmap.

## Does it support WebSockets or HTTP/2?

Not directly. routiva builds on \`node:http\`, and \`app.listen()\` returns the
underlying \`http.Server\`, so you can attach a WebSocket library to its \`upgrade\`
event. There is no HTTP/2 support and none is planned for the zero-dependency
core.

## Is there a template engine?

No. There is no \`res.render()\`, no view engine setting and no \`app.locals\`. You
compose HTML in a function and send it:

\`\`\`js
app.get('/', (req, res) => {
  res.type('html').send(\`<h1>Hello</h1>\`);
});
\`\`\`

Escape any user input you interpolate yourself. If you need a full template
engine, pair routiva with a standalone renderer or choose Express, where
\`res.render()\` is integrated.

## How do I handle file uploads?

There is no multipart parser. \`raw()\` gives you the request body as a \`Buffer\`
and \`text()\` gives it to you as a string, so a single-part upload can be read
directly:

\`\`\`js
app.post('/upload', raw({ limit: '5mb' }), (req, res) => {
  res.json({ bytes: req.body.length });
});
\`\`\`

For \`multipart/form-data\`, parse the body yourself or run a standalone parsing
step. There is no upload middleware in the box, and adding one would bring in the
kind of dependency routiva avoids. \`raw()\` still enforces a size \`limit\`.

## Which Node versions are supported?

Node \`18\` and newer, matching \`"engines": { "node": ">=18" }\`. The runtime uses
standard Node modules (\`node:http\`, \`node:fs\`, \`node:path\`, \`node:zlib\`, and
friends), all present on 18. The test suite relies on global \`fetch\` and
\`node:test\`, which are also 18+. There is no build step, so any current LTS or
newer works.

## How is it different from Fastify, Hono or Koa?

| | routiva | Fastify | Hono | Koa |
| --- | --- | --- | --- | --- |
| Runtime dependencies | 0 | some | some | some |
| Target | Node \`node:http\` | Node | multi-runtime | Node |
| Schema validation | no | built in | no | no |
| TypeScript types | not bundled | yes | yes | community |
| Middleware model | one ordered stack | hooks and plugins | one stack | onion |
| Opinion | Express-like | plugin-first | tiny and portable | minimal |

Koa replaces \`req\` and \`res\` with its own context and uses onion middleware.
Fastify adds schemas, plugins and serialization. Hono targets edge runtimes and
other platforms. routiva keeps Express's stack and handler signatures and stops
there.

## How do I report a bug or contribute?

Open an issue or a pull request on GitHub:
[github.com/uditc0derr/routiva](https://github.com/uditc0derr/routiva). A useful
bug report has a minimal reproduction, the Node version and what you expected to
happen. There is no CLA.

## Roadmap

Ideas that fit the architecture without breaking the zero-dependency rule, in no
committed order:

- \`res.render()\` with a pluggable engine interface.
- A streaming-safe compression path that wraps the socket, not just \`res.send\`.
- Signed cookies and a lightweight \`session()\` store.
- A full \`app.mount()\` with sub-app semantics.
- Bundled TypeScript declarations.
- Coverage reporting in CI.

None of these has a date. If one matters to you, say so in an issue.

## Contributing

- **Repository:** [uditc0derr/routiva](https://github.com/uditc0derr/routiva)
- **Package:** [routiva on npm](https://www.npmjs.com/package/routiva)
- **License:** MIT

Run \`npm test\` before opening a pull request. Keep the dependency count at zero:
if a Node built-in can do it, use the built-in. Match the existing file layout and
the one-layer-per-handler model. Small, focused changes are easier to review than
broad rewrites.
`,lm=`---
title: Getting started
description: What routiva is, the ideas behind it, and a working server in under a minute.
section: Introduction
order: 1
---

## What is routiva?

routiva is a small web framework for Node.js that gives you the ergonomics of
Express — routing, middleware, request/response helpers, body parsing, static
files, CORS, compression, logging and rate limiting — while staying completely
dependency-free.

Everything is built on Node's own \`node:http\`. There is no \`path-to-regexp\`, no
\`body-parser\`, no \`mime-types\`, no transitive tree of packages to audit. The
whole framework is roughly **1,900 lines** across **17 ES modules**.

\`\`\`bash
npm install routiva
\`\`\`

Requires **Node.js 18 or newer**. No runtime dependencies. No dev dependencies.

> routiva is not trying to replace Express for everyone. It is for the projects
> that want a framework small enough to read end to end, and a dependency graph
> that is exactly \`node_modules/routiva\`.

## Why another framework?

Express is excellent, mature and battle-tested. But it carries a large transitive
dependency tree and a handful of sharp edges that this project smooths over:

- **Async errors were an afterthought.** In Express 4, a rejected promise in a
  handler hangs the request unless you call \`next(err)\` yourself. routiva catches
  rejected promises and thrown errors automatically.
- **The framework is spread across packages.** CORS, compression, rate limiting
  and MIME types each live in their own dependency. routiva ships them in the core.
- **HTTP correctness is optional.** Express returns \`404\` for a path that exists
  with the wrong method. routiva answers \`405\` with an \`Allow\` header, and handles
  \`OPTIONS\` and \`HEAD\` for you.
- **You cannot read it.** Express is many files of which the interesting logic is
  a fraction. routiva is small enough to understand in an afternoon.

## The mental model

An app is a **router**. A router is an **ordered list of layers**. A layer is
either a route, a piece of middleware, or an error handler. Requests walk the
list top to bottom; the first layer that sends a response ends the journey.

\`\`\`text
incoming request
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  layer 0   logger()          → logs, calls next()    │
│  layer 1   cors()            → headers, calls next() │
│  layer 2   json()            → parses body, next()   │
│  layer 3   GET /users/:id    → sends a response  ────┼──▶ done
│  layer 4   error handler     → only runs on next(err)│
└─────────────────────────────────────────────────────┘
\`\`\`

That is the entire design. Once you understand the stack, every other page in
these docs is detail.

## Your first server

Create \`server.js\`:

\`\`\`js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
\`\`\`

Run it with \`node server.js\` (your \`package.json\` should have
\`"type": "module"\`), then:

\`\`\`bash
curl http://localhost:3000/
curl http://localhost:3000/users/42
\`\`\`

## Where to go next

| If you want to… | Read |
| --- | --- |
| Install it properly and try the bundled demo | [Installation](installation.md) |
| Build a small app step by step | [Quick start](quick-start.md) |
| Understand routes, params and wildcards | [Routing](routing.md) |
| Learn the middleware stack | [Middleware](middleware.md) |
| Look up a method or option | [API reference](api-reference.md) |

## Requirements and compatibility

| Requirement | Detail |
| --- | --- |
| Node.js | 18.0.0 or newer (uses global \`fetch\` in tests, \`node:test\`) |
| Module system | ESM. Set \`"type": "module"\` or use \`.mjs\` |
| Runtime dependencies | none |
| TypeScript | Ships as plain JavaScript; works with \`allowJs\` |
`,um=`---
title: Installation
description: Install routiva from npm, verify your runtime, and run the bundled demo and test suite.
section: Introduction
order: 2
---

## Requirements

routiva runs on **Node.js 18 or newer** and ships as pure ESM. There is no
compiler, bundler or transpile step.

| Requirement | Detail |
| --- | --- |
| Node.js | 18.0.0 or newer (\`"engines": { "node": ">=18" }\`) |
| Module system | ESM — set \`"type": "module"\`, or use \`.mjs\` files |
| Runtime dependencies | none |
| Dev dependencies | none |
| Build step | none |

If your project is CommonJS, add \`"type": "module"\` to its \`package.json\` and
switch \`require\` calls to \`import\`. routiva ships no CommonJS build.

## Install

\`\`\`bash
npm install routiva
\`\`\`

That installs exactly one package. routiva declares no \`dependencies\` and no
\`devDependencies\`, so the install tree is just \`node_modules/routiva\`.

## Named exports and the default export

The package has one entry point (\`src/index.js\`) with both named and default
exports.

Named exports give you the whole toolkit in one import:

\`\`\`js
import { createApp, Router, HttpError, json, serveStatic } from 'routiva';

const app = createApp();
\`\`\`

The default export is the \`App\` class. \`createApp(options)\` is simply
\`new App(options)\`:

\`\`\`js
import App from 'routiva';

const app = new App();
\`\`\`

The middleware factories are also attached to the class as statics
(\`App.json()\`, \`App.logger()\`, \`App.serveStatic()\`, \`App.rateLimit()\`, and so
on), so this works too:

\`\`\`js
import { App } from 'routiva';

app.use(App.logger());
app.use(App.json());
\`\`\`

Print the full export list to confirm what is available:

\`\`\`bash
node -e "import('routiva').then(m => console.log(Object.keys(m).sort().join(' ')))"
\`\`\`

## Verify your setup

Create \`server.js\`:

\`\`\`js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ status: 'ok', node: process.version });
});

app.listen(3000, () => console.log('http://localhost:3000'));
\`\`\`

\`\`\`bash
node server.js
curl http://localhost:3000/
\`\`\`

You should get back \`{"status":"ok","node":"v18.x.x"}\` (your version may
differ). If that prints, routing, JSON responses and the HTTP server all work.

## Zero dependencies

No runtime dependencies and no dev dependencies. The test suite is built on
\`node:test\` and the global \`fetch\`, so nothing is installed to run or verify
the project.

\`\`\`text
$ npm ls --all
routiva@0.1.2
└── (empty)
\`\`\`

That also means faster installs, smaller container images, and a supply-chain
surface of exactly one package.

## Run the tests

From a clone of the repository:

\`\`\`bash
node --test          # or: npm test
npm run test:watch   # re-run on change
\`\`\`

The suite is 15 test files and 63 tests covering routing, params, request and
response APIs, middleware ordering, error propagation, body parsing, cookies,
content negotiation, static files, CORS, compression, rate limiting and
logging. It starts real HTTP servers on ephemeral ports and makes real
requests — there are no mocks.

## Run the bundled demo

The repository ships a complete CRUD app you can run against the source:

\`\`\`bash
npm run crud          # node crud-app/server.js
\`\`\`

It listens on **port 3000** and serves a browser UI at
<http://127.0.0.1:3000> plus a JSON API at \`/api/products\`. Override the
defaults with environment variables:

\`\`\`bash
PORT=4000 HOST=0.0.0.0 DATA_FILE=./tmp/products.json npm run crud
\`\`\`

| Variable | Default | Purpose |
| --- | --- | --- |
| \`PORT\` | \`3000\` | Listening port |
| \`HOST\` | \`127.0.0.1\` | Listening host |
| \`DATA_FILE\` | \`crud-app/data/products.json\` | JSON file used as the datastore |

Run the app's integration tests on their own:

\`\`\`bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh — end-to-end curl script
\`\`\`

\`npm run example\` runs the smaller \`examples/basic.js\` demo instead.

## TypeScript

routiva ships as plain JavaScript with no bundled type declarations and no
\`.d.ts\` files. With \`"allowJs": true\` in your \`tsconfig.json\`, TypeScript will
import it and infer what it can from the source. Expect some \`any\` — there are
no generated types yet.

## No build step

\`package.json\` points \`main\` and \`exports\` straight at \`src/index.js\`. There is
no \`dist/\`, no bundler config and no prepare script: the code you import is the
code in the repository.

## Where to go next

| If you want to… | Read |
| --- | --- |
| Build a small app step by step | [Quick start](quick-start.md) |
| Understand the layer stack | [Core concepts](core-concepts.md) |
| Look up a method or option | [API reference](api-reference.md) |
`,cm=`---
title: Logging
description: One log line per request with method, URL, status and duration, and a custom format hook for JSON logs.
section: Built-in middleware
order: 4
---

## What logger() does

\`logger()\` writes one line per request after the response finishes. The default
line includes the time, method, URL, status code and duration. Pass \`format\` to
emit your own shape.

\`\`\`js
import { createApp, logger } from 'routiva';

const app = createApp();

app.use(logger());
\`\`\`

Register it first so it wraps every request, including ones that end in an error
handler.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| \`stream\` | \`process.stdout\` | Anything with a \`.write(string)\` method |
| \`format\` | \`undefined\` | \`(req, res, ms) => string\`; replaces the default line |
| \`enabled\` | \`true\` | Set \`false\` to disable logging entirely |
| \`color\` | \`stream.isTTY\` | Colorize the status code; defaults to on for a TTY |

When \`format\` is \`undefined\`, the built-in formatter is used. \`color\` defaults to
\`Boolean(stream.isTTY)\`, so piping to a file turns color off automatically. Force
it with \`color: true\` or \`color: false\`.

## When the line is written

The middleware starts a \`process.hrtime.bigint()\` timer on entry and registers
\`onFinish\` on both \`finish\` and \`close\` of \`res.raw\`. Logging happens on
whichever fires first, and a \`logged\` latch guarantees exactly one line per
request.

Because it runs after the response, \`res.statusCode\` and the duration are final —
even for responses produced by an error handler downstream. The line is written
with \`stream.write(\`\${line}\\n\`)\`, so a custom \`format\` should return a string
without a trailing newline.

## The default format

\`defaultFormat\` produces a single space-separated line:

\`\`\`text
<ISO timestamp> <METHOD> <URL> <STATUS> <ms>ms
\`\`\`

with the status colorized when \`useColor\` is true. The URL is
\`req.originalUrl || req.url\`, so a mounted router still logs the full path. The
duration is \`ms.toFixed(1)\`, one decimal place.

\`\`\`text
2026-10-14T09:31:02.114Z GET /health 200 3.2ms
\`\`\`

Status colors are chosen by range:

| Status | Color |
| --- | --- |
| \`5xx\` | red (\`31\`) |
| \`4xx\` | yellow (\`33\`) |
| \`3xx\` | cyan (\`36\`) |
| otherwise | green (\`32\`) |

The escape codes are only emitted when \`useColor\` is true, so redirected output
stays clean and copy-pasteable.

## Custom format

\`format\` receives \`(req, res, ms)\`, where \`ms\` is a number. Return the line you
want. This JSON example is suitable for production log pipelines:

\`\`\`js
import { createApp, logger } from 'routiva';

const app = createApp();

app.use(
  logger({
    format: (req, res, ms) =>
      JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(ms * 10) / 10,
        ip: req.ip,
      }),
  }),
);
\`\`\`

Each request writes one compact JSON object:

\`\`\`text
{"time":"2026-10-14T09:31:02.114Z","method":"POST","url":"/api/orders","status":201,"durationMs":12.4,"ip":"203.0.113.7"}
\`\`\`

Send logs somewhere other than stdout by passing a writable stream:

\`\`\`js
import fs from 'node:fs';
import { logger } from 'routiva';

const access = fs.createWriteStream('access.log', { flags: 'a' });

app.use(logger({ stream: access, color: false }));
\`\`\`

Any object with a \`write(string)\` method works. A file stream is not a TTY, so
color is already off; \`color: false\` makes that explicit.

## Turning it off

\`enabled: false\` makes the middleware a no-op — useful when a test harness or an
outer logger already covers requests.

\`\`\`js
app.use(logger({ enabled: process.env.NODE_ENV !== 'test' }));
\`\`\`

Unlike the other built-in middleware, \`logger()\` never changes the response: it
reads the request and response but sets no headers and writes no body.
`,dm=`---
title: Middleware
description: What a middleware function is, how ordering works, how to mount routers and paths, and how to write your own.
section: Core concepts
order: 3
---

## What middleware is

Middleware is a function with three parameters:

\`\`\`js
function middleware(req, res, next) {
  // read the request, set headers, maybe respond …
  next(); // … then pass control down the stack
}
\`\`\`

A middleware either **ends the request** by sending a response, or **passes it
on** with \`next()\`. It can also **fail** the request with \`next(err)\`, which
switches the stack into error mode. Anything registered with \`app.use()\` is
middleware; a route handler is just middleware that also has to match a method.

## Registering middleware

\`\`\`js
import { createApp, logger, cors, json } from 'routiva';

const app = createApp();

app.use(logger());       // every request
app.use(cors());
app.use(json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
\`\`\`

\`app.use(fn)\` runs on every request that reaches it, regardless of path.
Passing an array works too: \`app.use([logger(), cors()])\`.

## Mounting under a path

Give \`use()\` a path to run the middleware only for that prefix:

\`\`\`js
app.use('/api', requireApiKey);   // /api, /api/users, /api/users/42, …
app.use('/admin', adminOnly);     // not /adminx
\`\`\`

The prefix match uses a lookahead, so \`/api\` matches \`/api\` and \`/api/users\`
but not \`/apis\`. When the middleware runs, the mount prefix is **stripped** from
\`req.path\` and \`req.url\`, and everything is **restored** on \`next()\` — the same
mechanism mounted routers use (see [Routing](routing.md#mounted-routers)).

\`\`\`js
app.use('/api', (req, res, next) => {
  console.log(req.path);   // "/users" for a request to /api/users
  next();                  // after this, req.path is "/api/users" again
});
\`\`\`

A path can be given without handlers only if you pass at least one function;
\`app.use('/api')\` with no handler throws a \`TypeError\`.

## Ordering

There is **one stack**, and **registration order is execution order**. This is
the whole mental model:

\`\`\`js
app.use(logger());                 // 1
app.use(json());                   // 2
app.get('/users', listUsers);      // 3  ← responds
app.use((err, req, res, next) => { // 4  ← only on next(err)
  res.status(500).json({ error: { message: err.message } });
});
\`\`\`

Consequences worth internalising:

- Middleware registered **after** a route cannot run before it.
- A route that calls \`next()\` lets the request fall through to layers registered
  below it, including a static handler or a catch-all.
- An error handler placed **before** a route cannot catch that route's errors,
  because the cursor has already moved past it.

## Passing control on

\`next()\` moves to the next matching layer. It is safe to call from nested
callbacks and after an \`await\`:

\`\`\`js
app.use(async (req, res, next) => {
  const user = await loadUser(req);
  req.user = user;
  next();
});
\`\`\`

Two rules keep the stack sane:

- Call \`next()\` **once**. A \`nextCalled\` latch on each layer ignores duplicates.
- Do not call \`next()\` **and** send a response. If a layer responds, the request
  is finished; a later \`next()\` simply has nothing to do.

Errors are the exception you *want* to forward:

\`\`\`js
app.use((req, res, next) => {
  try {
    risky();
    next();
  } catch (err) {
    next(err);        // jump to the error chain
  }
});
\`\`\`

Throwing synchronously does the same thing, as does rejecting from an \`async\`
middleware. routiva attaches \`.catch(next)\` to every returned promise, so this
works without a wrapper:

\`\`\`js
app.use(async (req, res, next) => {
  await mightFail();   // a rejection becomes next(err) automatically
  next();
});
\`\`\`

## Error middleware

A function with **four** parameters is an error handler. Arity is the only
marker — there is no separate registration API:

\`\`\`js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: { message: err.message } });
});
\`\`\`

During normal flow, four-arity functions are skipped; during error flow,
three-arity functions are skipped. Register error handlers **last**. The full
story — \`HttpError\`, \`expose stack\`, the default handler and 404/405 — is on the
[Error handling](error-handling.md) page.

## Mounting a Router

A \`Router\` is middleware too. \`app.use('/prefix', router)\` mounts a whole
sub-stack:

\`\`\`js
import { App, Router } from 'routiva';

const users = new Router();
users.get('/', (req, res) => res.json([]));
users.get('/:id', (req, res) => res.json({ id: req.params.id }));

const app = new App();
app.use('/users', users);
\`\`\`

Because routers are just middleware, they compose: mount one router inside
another, or mix router methods with \`use()\` on the same prefix.

## Writing your own

A reusable middleware is a factory that returns the function. Keep the setup in
the factory and the per-request work in the returned closure:

\`\`\`js
export function timing() {
  return function timingMiddleware(req, res, next) {
    const start = process.hrtime.bigint();
    res.raw.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      res.set('X-Duration-Ms', ms.toFixed(1));   // no effect once sent
      console.log(\`\${req.method} \${req.url} \${res.statusCode} \${ms.toFixed(1)}ms\`);
    });
    next();
  };
}
\`\`\`

A few practical notes:

- The factory pattern (\`timing()\` returns a function) lets callers pass options
  and keeps the built-in middleware consistent. Every built-in follows it.
- \`req.raw\` and \`res.raw\` expose the underlying \`IncomingMessage\` and
  \`ServerResponse\` for anything the wrappers do not cover.
- Setting a header after the response has started does nothing — do header work
  before you call \`next()\`.

### Attaching data to the request

A common pattern is to look something up once and stash it on \`req\` for later
layers:

\`\`\`js
app.use('/api', async (req, res, next) => {
  req.db = await pool.connect();
  next();
});

app.get('/api/users', (req, res) => {
  res.json(rowsFrom(req.db));
});
\`\`\`

### A conditional guard

\`\`\`js
app.use('/admin', (req, res, next) => {
  if (req.header('authorization') !== \`Bearer \${SECRET}\`) {
    return next(new HttpError(401, 'unauthorized'));
  }
  next();
});
\`\`\`

## The built-in middleware

routiva ships the pieces most apps need. Each is documented on its own page:

| Factory | Page |
| --- | --- |
| \`json\` \`urlencoded\` \`text\` \`raw\` | [Body parsing](body-parsing.md) |
| \`serveStatic\` | [Static files](static-files.md) |
| \`cors\` | [CORS](cors.md) |
| \`compress\` | [Compression](compression.md) |
| \`rateLimit\` | [Rate limiting](rate-limiting.md) |
| \`logger\` | [Logging](logging.md) |

Every factory is also attached to the \`App\` class (\`App.json()\`,
\`App.cors()\`, …), so both import styles work.

## A recommended order

\`\`\`js
const app = createApp();

app.use(logger());          // observe everything
app.use(cors());            // answer preflights early
app.use(compress());        // wrap res.send before bodies are built
app.use(rateLimit());       // reject before doing real work
app.use(json());            // parse bodies
app.use(serveStatic('public'));

app.get('/api/users', listUsers);
app.use('/api', apiRouter);
app.get('*', (req, res) => res.sendFile('public/index.html'));

app.use(errorHandler);      // 4-arity, always last
\`\`\`

## Where to go next

| If you want to… | Read |
| --- | --- |
| Understand path matching | [Routing](routing.md) |
| Handle thrown and rejected errors | [Error handling](error-handling.md) |
| Use the built-in middleware | [CORS](cors.md), [Compression](compression.md), [Rate limiting](rate-limiting.md) |
`,pm=`---
title: Performance
description: Why routiva stays fast — compiled routes, a linear dispatch scan, streaming I/O — and how to benchmark your own workload.
section: Guides
order: 3
---

## Fast because it is small

routiva does not quote a throughput number, because a number from one machine
does not transfer to another. It is quick for a concrete reason: it does little
per request. There is no dependency graph to load, no routing table rebuilt on
each call, no body buffered that could be streamed, and no compression performed
unless the client asked for it.

This page describes the cost model so you can reason about your own app, then
shows how to measure it.

## Where the time goes

A request touches four things:

1. **Wrap.** \`new Request(raw)\` parses the URL, query string and cookies once.
2. **Dispatch.** The layer stack is scanned until a layer matches and responds.
3. **Handler.** Your code runs.
4. **Serialize.** \`res.send()\` writes headers and a body.

The framework owns steps 1, 2 and 4. Step 2 grows with the number of layers, so
the design keeps that scan cheap and predictable.

## Routes compile once

Patterns become a \`RegExp\` at registration time, never per request.
\`compile(pattern, end)\` in \`src/router.js\`:

\`\`\`text
/users/:id    ->  /^\\/users\\/([^/]+)\\/?$/    keys: ['id']
/files/*      ->  /^\\/files\\/(.*)\\/?$/       keys: ['wildcard']
/api (mount)  ->  /^\\/api(?=\\/|$)/           prefix, not anchored to the end
\`\`\`

Literal segments are regex-escaped, \`:name\` becomes \`([^/]+)\` and \`*\` becomes
\`(.*)\`. The compiled regex and its \`keys\` array are stored on the layer and
shared by every request. Dispatch only calls \`layer.regex.exec(req.path)\`.

## The dispatch loop is a linear scan

All routing runs through one function with a shared cursor:

\`\`\`js
function dispatch(stack, req, res, done) {
  let index = 0;
  let finished = false;

  function next(err) {
    if (finished) return;
    const wantsError = Boolean(err);

    while (index < stack.length) {
      const layer = stack[index++];
      if (layer.isErrorHandler !== wantsError) continue;
      const match = layer.regex.exec(req.path);
      if (!match) continue;
      // ...method check, then invoke(layer, match, err, req, res, next)
      break;
    }
    // stack exhausted -> done(err)
  }

  next();
}
\`\`\`

Two properties matter:

- **\`next()\` is O(1), not recursive.** The cursor never moves backwards, so a
  chain of \`next()\` calls does not re-scan earlier layers or grow the call stack.
- **Error handlers are skipped for free.** During normal flow, four-arity layers
  are filtered out by a single comparison before the regex is even run.

Cost is linear in the number of layers that precede the match.

## Per-request allocation

The only objects created per request are the two wrappers and the small values
they hold:

- \`new Request(raw)\` reads \`raw.url\` with the \`URL\` constructor once, then splits
  \`query\` and \`cookies\` into plain objects.
- \`new Response(raw, req)\` stores two references and an empty \`locals\` object.
- During dispatch, \`invoke()\` merges params into a fresh object and saves the
  previous values so a mounted router can restore them on \`next()\`.

Nothing clones the stack, and no layer is recompiled.

## Compression costs CPU to save bytes

\`compress()\` wraps \`res.send()\` and decides per response:

\`\`\`text
Accept-Encoding: br, gzip  -> pick br, else gzip, else deflate
body below threshold       -> send as-is
Content-Type not text-ish  -> send as-is
already encoded / streamed -> send as-is
\`\`\`

The trade is explicit: brotli and gzip burn CPU and latency to shrink a body.
The default \`threshold\` is \`1kb\`, so small responses skip the work entirely. A
response the client cannot benefit from (already encoded, an image, a streamed
file) is left alone. If compression shows up in a profile, raise \`threshold\`,
pin \`level\`, or gate it with \`filter(req, res)\`.

Because routiva buffers \`res.send()\` before compressing, it never wraps a file
stream. That keeps \`sendFile\` streaming, but large generated bodies are
compressed in memory.

## Static files are cheap when cached

\`send.js\` stats the file, then:

- sets \`ETag\` (\`W/"size-mtime"\`) and \`Last-Modified\`;
- returns \`304\` immediately when \`If-None-Match\` or \`If-Modified-Since\` says the
  client copy is fresh;
- sets \`Cache-Control\` from \`maxAge\` and \`immutable\` when configured;
- serves a single \`Range\` as \`206\` by streaming only that slice.

The \`304\` path is the win: no body, no read of the file contents. Set a long
\`maxAge\` for immutable assets and let conditional requests do the rest. The
\`stat\` call itself is a filesystem hit per request; that is the floor for this
strategy.

## The rate limit store is a Map

\`MemoryStore\` is a fixed-window counter keyed by IP:

- \`hit(key)\` is one \`Map\` lookup and an increment;
- expired keys are swept by an interval timer created with \`.unref()\`, so the
  timer never keeps the process alive;
- \`reset()\` clears one key or the whole store.

There is no external store. Run more than one process and each keeps its own
counters, so a shared limit needs a custom \`store\`.

## sendFile streams

\`pipeFile()\` uses \`createReadStream(path, range).pipe(res.raw)\`, so memory stays
flat regardless of file size. \`finish\` and \`error\` events resolve a promise, so
the surrounding \`await\` still sees failures. Byte ranges stream the same way.

## Measuring it

Measure your app on your hardware. \`autocannon\` and \`wrk\` are both good:

\`\`\`bash
npm install -g autocannon

# start your app in another shell
node server.js

# 10 connections for 10 seconds
autocannon -c 10 -d 10 http://127.0.0.1:3000/api/products

# 50 connections, JSON POST bodies
autocannon -c 50 -d 20 -m POST \\
  -H "content-type=application/json" \\
  -b '{"name":"widget","sku":"W-1","price":1}' \\
  http://127.0.0.1:3000/api/products
\`\`\`

\`wrk\` in the same shape:

\`\`\`bash
wrk -t4 -c100 -d30s http://127.0.0.1:3000/health
wrk -t4 -c100 -d30s -s post.lua http://127.0.0.1:3000/api/products
\`\`\`

Watch the shape, not just requests per second:

| Signal | What it tells you |
| --- | --- |
| requests per second | throughput at a given concurrency |
| latency p99 | tail behaviour under load |
| CPU per request | headroom left for middleware |
| RSS and heap | allocation churn and leaks |

Compare against a real Express build of the same app on the same machine. Both
sit on \`node:http\` and run your handlers, so the difference comes from the
framework's per-request work, not the socket.

## Practical tips

- **Register cheap middleware first.** Each layer is one regex test; a
  path-mounted middleware costs nothing on other routes.
- **Gate expensive work by path**, not by checking inside a global handler.
- **Set a compression threshold** that matches your typical payload.
- **Give static assets a long \`maxAge\`** and rely on \`ETag\` for the rest.
- **Stream large files** with \`serveStatic\` or \`res.sendFile\`, not by reading
  them into a Buffer.
- **Measure before optimizing.** Add \`logger()\` and read the duration field, or
  run \`autocannon\`. Do not guess.
`,hm=`---
title: Quick start
description: Build a small routiva app step by step, then exercise every endpoint with curl.
section: Introduction
order: 3
---

## What we are building

One file with a JSON API, request logging, body parsing, a static \`public/\`
folder and error handling. Each step adds one piece and explains why. The
finished server is about 40 lines.

## 1. Scaffold the project

\`\`\`bash
mkdir routiva-app
cd routiva-app
npm init -y
npm pkg set type=module
npm install routiva
\`\`\`

\`npm pkg set type=module\` writes \`"type": "module"\` into \`package.json\`, which
is required — routiva is ESM-only.

## 2. Your first route

Create \`server.js\`:

\`\`\`js
import { createApp } from 'routiva';

const app = createApp();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.listen(3000, () => console.log('http://localhost:3000'));
\`\`\`

Run \`node server.js\` and open <http://localhost:3000/>. \`res.json()\` sets
\`Content-Type: application/json\` and serializes the object.

## 3. Add logging and JSON parsing

\`logger()\` prints one line per request; \`json()\` parses JSON bodies into
\`req.body\`. Register both before your routes:

\`\`\`js
import { createApp, logger, json } from 'routiva';

const app = createApp();

app.use(logger());
app.use(json());
\`\`\`

Both call \`next()\`, so the request continues to the routes below. Middleware
registered after a route cannot run before it — registration order is
execution order.

## 4. Add a parameterized route

\`\`\`js
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
\`\`\`

\`:id\` matches a single path segment. \`/users/42\` sets \`req.params.id\` to the
string \`'42'\`; \`/users/42/posts\` does not match.

## 5. Read the query string

\`\`\`js
app.get('/search', (req, res) => {
  res.json({ q: req.query.q, tags: req.query.tag });
});
\`\`\`

\`req.query\` is parsed from the URL. Repeated keys become arrays, so
\`?tag=a&tag=b\` yields \`{ tag: ['a', 'b'] }\`.

## 6. Accept a JSON body

\`\`\`js
app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});
\`\`\`

\`req.body\` is populated by \`json()\` for \`application/json\` requests. Bodies
over the 1mb default limit get a \`413\`; malformed JSON gets a \`400\`.

## 7. Throw an error

Handlers can throw, and \`async\` handlers can reject. Either way the error flows
to an error handler. routiva has a default one, but a custom handler is easy to
add — four parameters marks it, and it is registered last:

\`\`\`js
import { HttpError } from 'routiva';

app.get('/boom', async () => {
  throw new HttpError(503, 'service unavailable');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});
\`\`\`

Without the custom handler, routiva returns
\`{ "error": { "message": "...", "status": ... } }\` for an \`HttpError\` and a
generic \`500\` for anything else.

## 8. Serve a folder of static files

Create \`public/index.html\`:

\`\`\`html
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>routiva</title></head><body><h1>Served by routiva</h1></body></html>
\`\`\`

Register the middleware after your routes so an explicit route always wins:

\`\`\`js
import { serveStatic } from 'routiva';

app.use(serveStatic('public'));
\`\`\`

\`serveStatic\` streams files, sets \`ETag\`/\`Last-Modified\` for \`304\` responses,
honours single \`Range\` requests, and falls through to the next layer when a file
is missing.

## 9. The complete server

\`\`\`js
import { createApp, logger, json, serveStatic, HttpError } from 'routiva';

const app = createApp();

// middleware every request passes through
app.use(logger());
app.use(json());

// routes
app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.get('/search', (req, res) => {
  res.json({ q: req.query.q, tags: req.query.tag });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.get('/boom', async () => {
  throw new HttpError(503, 'service unavailable');
});

// static files fall back for anything the routes did not match
app.use(serveStatic('public'));

// error handler goes last
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

app.listen(3000, () => console.log('http://localhost:3000'));
\`\`\`

## 10. Run it and test every endpoint

Start it with \`node server.js\`, then run:

\`\`\`bash
curl http://localhost:3000/
curl http://localhost:3000/users/42
curl "http://localhost:3000/search?q=cats&tag=a&tag=b"
curl -i -X POST http://localhost:3000/users \\
  -H 'content-type: application/json' \\
  -d '{"name":"Ada"}'
curl -i http://localhost:3000/boom
curl -i http://localhost:3000/index.html
\`\`\`

What to expect:

| Request | Response |
| --- | --- |
| \`GET /\` | \`{"hello":"world"}\` |
| \`GET /users/42\` | \`{"id":"42"}\` |
| \`GET /search?q=cats&tag=a&tag=b\` | \`{"q":"cats","tags":["a","b"]}\` |
| \`POST /users\` | \`201\` and \`{"created":{"name":"Ada"}}\` |
| \`GET /boom\` | \`503\` and \`{"error":{"message":"service unavailable"}}\` |
| \`GET /index.html\` | the HTML file as \`text/html\` |

\`GET /missing\` falls through the static middleware to routiva's default \`404\`
JSON.

## Next steps

- [Routing](routing.md) — parameters, wildcards, mounted routers and \`router.route\`.
- [Middleware](middleware.md) — write your own and understand the stack.
- [Error handling](error-handling.md) — \`HttpError\`, error middleware and safe defaults.
`,fm="---\ntitle: Rate limiting\ndescription: Fixed-window rate limiting keyed by client IP, with X-RateLimit headers, 429 responses and a pluggable store.\nsection: Built-in middleware\norder: 3\n---\n\n## What rateLimit() does\n\n`rateLimit()` counts requests per client in a fixed time window and rejects\ncallers who exceed the limit with a `429`. It sets the standard\n`X-RateLimit-*` headers and a `Retry-After` header on the rejection.\n\n```js\nimport { createApp, rateLimit } from 'routiva';\n\nconst app = createApp();\n\napp.use(rateLimit({ windowMs: 60_000, max: 100 }));\n```\n\n## Options\n\n| Option | Default | Meaning |\n| --- | --- | --- |\n| `windowMs` | `60000` | Window length in milliseconds |\n| `max` | `100` | Maximum requests per window (alias: `limit`) |\n| `statusCode` | `429` | Status code of the default rejection |\n| `message` | `'Too Many Requests'` | Message in the default JSON rejection |\n| `headers` | `true` | Emit `X-RateLimit-*` and `Retry-After` (set `false` to disable) |\n| `skip` | `() => false` | `(req, res) => boolean`; return `true` to bypass counting |\n| `keyGenerator` | client IP | `(req, res) => string`; the counter key |\n| `handler` | `undefined` | `(req, res, next, record) => void` for custom rejections |\n| `store` | `new MemoryStore(windowMs)` | Counter backend implementing `hit(key)` |\n\n## The algorithm\n\nThe default store uses a **fixed window** per key. Every request increments the\ncounter; the window resets after `windowMs`.\n\n```text\nhit(key)\n  │\n  ├─ no record, or record.resetTime <= now?\n  │      record = { count: 0, resetTime: now + windowMs }\n  │\n  ├─ record.count += 1\n  └─ return { count, resetTime }\n\nlimiter(req, res, next)\n  │\n  ├─ skip(req, res)? ─▶ next()\n  ├─ record = store.hit(keyGenerator(req, res))\n  ├─ remaining = max(0, max - record.count)\n  ├─ over limit? record.count > max\n  │      ├─ set Retry-After, call handler(...) or send statusCode JSON\n  │      └─ stop\n  └─ next()\n```\n\nThe count is incremented before it is checked, so with `max: 100` the 101st\nrequest in a window receives the `429`. A fixed window is cheap but allows a\nburst at a boundary: a client can send `max` requests just before the reset and\nanother `max` just after. For smooth limits, keep the interface and swap in a\nsliding-window `store`.\n\n## Response headers\n\nWhen `headers` is true (the default), every request through the limiter gets:\n\n| Header | Value |\n| --- | --- |\n| `X-RateLimit-Limit` | `max` |\n| `X-RateLimit-Remaining` | `max(0, max - count)` |\n| `X-RateLimit-Reset` | Window reset time in Unix **seconds** (`Math.ceil(resetTime / 1000)`) |\n| `Retry-After` | Seconds until reset, at least `1` — only on the `429` response |\n\nSet `headers: false` to suppress all of them, including `Retry-After`.\n\nThe default rejection is JSON, using `statusCode` and `message`:\n\n```json\n{ \"error\": { \"message\": \"Too Many Requests\", \"status\": 429 } }\n```\n\n## The MemoryStore\n\n`MemoryStore` is a `Map`-backed fixed-window store exported from the package.\n\n```js\nimport { rateLimit, MemoryStore } from 'routiva';\n\nconst store = new MemoryStore(60_000);\napp.use(rateLimit({ store }));\n```\n\n| Member | Description |\n| --- | --- |\n| `new MemoryStore(windowMs = 60000)` | Create the store; starts an `unref()`'d cleanup timer |\n| `hit(key)` | Increment and return `{ count, resetTime }` (resets expired windows) |\n| `reset(key)` | Delete one key; with no argument, clear the whole store |\n| `clearExpired()` | Drop every record whose `resetTime` has passed |\n| `size` | Number of live keys |\n| `stop()` | Stop the background cleanup timer |\n\nThe cleanup timer is `unref()`'d, so it never keeps the process alive.\n\n## Custom stores\n\nThe middleware only calls one method: `store.hit(key)`, which must return\n`{ count, resetTime }` **synchronously**. `reset`, `clearExpired` and `size` are\nconveniences on `MemoryStore` — the limiter does not use them.\n\n```js\nclass RedisStore {\n  constructor(windowMs) {\n    this.windowMs = windowMs;\n  }\n\n  // Must be synchronous: the middleware reads the record on the same tick.\n  hit(key) {\n    const count = redis.incr(key);           // node_redis in sync-ish wrapper\n    if (count === 1) redis.pexpire(key, this.windowMs);\n    const ttl = redis.pttl(key);\n    return { count, resetTime: Date.now() + ttl };\n  }\n}\n```\n\nMost real backends are async, but `hit` must stay synchronous. Do the async\nlookup in an earlier middleware, stash a `{ count, resetTime }` on the request,\nand read it back from `key` inside `hit`.\n\n## Per-route limits\n\nA limiter is ordinary middleware, so attach it to one route and clamp sensitive routes harder than the global default.\n\n```js\nimport { createApp, rateLimit } from 'routiva';\n\nconst app = createApp();\n\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60_000,\n  max: 10,\n  message: 'Too many login attempts. Try again later.',\n  keyGenerator: (req) => `${req.ip}:${req.body?.email ?? ''}`,\n});\n\napp.post('/login', loginLimiter, async (req, res) => {\n  // ...\n  res.json({ ok: true });\n});\n```\n\nA custom `handler` takes over the response completely. `record` carries the\ncurrent `{ count, resetTime }`:\n\n```js\napp.use(\n  rateLimit({\n    max: 20,\n    handler(req, res, next, record) {\n      res.status(429).json({\n        error: 'rate_limited',\n        retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000),\n      });\n    },\n  }),\n);\n```\n\nTo disable limiting during tests, pass `skip`:\n\n```js\napp.use(rateLimit({ skip: () => process.env.NODE_ENV === 'test' }));\n```\n\n## How keys are chosen\n\nThe default `keyGenerator` returns `req.ip`, falling back to\n`req.raw.socket.remoteAddress`, then `'unknown'`. `req.ip` respects the app's\n`trust proxy` setting: with it off, it is the socket's `remoteAddress`; with it\non, it comes from `X-Forwarded-For` (a number selects that many hops from the\nright). Behind a proxy, enable `trust proxy` or every caller shares the proxy's\nIP and the limit.\n\nThe default store lives in memory, so it counts per process. Multiple instances\nbehind a load balancer each keep their own counters unless you supply a shared\n`store`.\n",mm="---\ntitle: Request & Response\ndescription: Every field and helper on the wrapped req and res objects, from req.accepts() to res.format() and res.sendFile().\nsection: Core concepts\norder: 4\n---\n\n## The wrappers\n\nEach request is wrapped once. Node's `IncomingMessage` becomes a `Request` and\nits `ServerResponse` becomes a `Response`. Both originals stay reachable, so the\nwrapper is a convenience layer rather than a cage:\n\n```js\nreq.raw;   // the IncomingMessage\nres.raw;   // the ServerResponse\n```\n\nAnything the wrapper does not cover (`req.raw.setTimeout()`,\n`res.raw.writeHead()`, `res.raw.socket`) is one property away. Everything the\nwrapper *does* cover is listed below.\n\n## Request\n\n`Request` parses the URL, query string, cookies and client IP in its\nconstructor, so per-request work happens once, not on every property read.\n\n| Member | Type | Notes |\n| --- | --- | --- |\n| `raw` | `IncomingMessage` | The underlying stream |\n| `app` | `App` | The app handling this request |\n| `method` | `string` | `'GET'`, `'POST'`, … |\n| `url` | `string` | Current URL, minus any stripped mount prefix |\n| `originalUrl` | `string` | The original URL, unchanged |\n| `path` | `string` | Pathname only, no query string |\n| `search` | `string` | Query string including `?`, or `''` |\n| `query` | `object` | Parsed query; repeated keys become arrays |\n| `params` | `object` | Route parameters, set during dispatch |\n| `body` | `any` | Set by body-parser middleware |\n| `cookies` | `object` | Parsed `Cookie` header, `j:` values decoded |\n| `headers` | `object` | Lower-cased header map |\n| `hostname` | `string` | Host without the port |\n| `protocol` | `'http' \\| 'https'` | Derived from `secure` |\n| `secure` | `boolean` | `X-Forwarded-Proto` or a TLS socket |\n| `ip` | `string` | Client IP, honouring `trust proxy` |\n| `ips` | `string[]` | Forwarded chain, nearest first |\n\n```js\napp.get('/search', (req, res) => {\n  res.json({\n    path: req.path,                 // '/search'\n    q: req.query.q,                 // 'cats'\n    tags: req.query.tag,            // ['a', 'b'] for ?tag=a&tag=b\n    ip: req.ip,\n  });\n});\n```\n\n### Request methods\n\n| Method | Returns |\n| --- | --- |\n| `req.header(name)` | The header value (case-insensitive) or `undefined` |\n| `req.get(name)` | Alias for `header()` |\n| `req.accepts(...types)` | The first accepted type, or `false` |\n| `req.is(...types)` | Whether the request `Content-Type` matches |\n\n```js\nreq.header('user-agent');\nreq.accepts('json', 'html');   // 'json' | 'html' | false\nreq.is('json');                // true for application/json\nreq.is('json', 'text/*');      // true for JSON or any text type\n```\n\n`accepts()` with no arguments returns the raw `Accept` header (defaulting to\n`*/*`). `is()` accepts shorthand names (`'json'`, `'html'`) and media ranges\nsuch as `'text/*'`.\n\n### Cookies\n\nThe `Cookie` header is parsed for you. Values written as `j:` JSON — which is\nwhat `res.cookie()` produces for object values — are decoded back:\n\n```js\napp.get('/', (req, res) => {\n  const theme = req.cookies.theme;         // string\n  const prefs = req.cookies.prefs;         // object, if written as j: JSON\n  res.json({ theme, prefs });\n});\n```\n\n## Response\n\n`Response` makes every mutator return `this`, so calls chain:\n\n```js\nres.status(201).type('json').send({ ok: true });\n```\n\n| Member | Description |\n| --- | --- |\n| `res.raw` | The underlying `ServerResponse` |\n| `res.req` | The matching `Request` |\n| `res.locals` | A per-response object for your own data |\n| `res.statusCode` | Get/set the status code |\n| `res.headersSent` | `true` once the response has started |\n| `res.finished` | `true` once the response has ended |\n\n### Setting headers\n\n```js\nres.status(200);\nres.set('X-Request-Id', 'abc');           // one header\nres.set({ 'Cache-Control': 'no-store' }); // many at once\nres.header('X-Other', 'v');               // alias for set()\nres.append('Set-Cookie', 'a=1');          // append to a multi-value header\nres.get('Content-Type');                  // read one back\nres.vary('Accept');                       // add to Vary, de-duplicated\n```\n\n`vary()` merges with any existing `Vary` value and ignores duplicates.\n\n### Content type\n\n```js\nres.type('json');     // application/json; charset=utf-8\nres.type('html');     // text/html; charset=utf-8\nres.type('.css');     // text/css; charset=utf-8\nres.type('image/png'); // used verbatim when it contains \"/\"\n```\n\n### Sending a body\n\n`res.send()` picks a behaviour from the value it is given:\n\n| Body | Content-Type | Behaviour |\n| --- | --- | --- |\n| `null` / `undefined` | `text/plain` | Empty body, `Content-Length: 0` |\n| `Buffer` | `application/octet-stream` | Raw bytes |\n| object / array | `application/json` | Delegates to `res.json()` |\n| string / number | `text/html` | Written as UTF-8 |\n\nA `Content-Type` is only set when the response does not already have one.\n`res.json(value)` sets `application/json; charset=utf-8` when needed and\nserializes with `JSON.stringify`.\n\n```js\nres.json({ ok: true });\nres.send('<h1>Hello</h1>');\nres.send(Buffer.from('bytes'));\nres.sendStatus(204);          // status + reason phrase as text\n```\n\n### The write-once guard\n\n`res.send()`, `res.json()` and friends check `headersSent || writableEnded`\nfirst. A stray second `res.json()` is silently ignored instead of crashing with\n`ERR_HTTP_HEADERS_SENT`:\n\n```js\napp.get('/', (req, res) => {\n  res.json({ first: true });\n  res.json({ second: true });   // no-op\n});\n```\n\n### Cookies\n\n```js\nres.cookie('session', 'abc123', {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'lax',\n  maxAge: 1000 * 60 * 60,   // milliseconds\n  path: '/',\n});\n\nres.clearCookie('session');   // expires it immediately\n```\n\n`res.cookie()` merges into any existing `Set-Cookie` header rather than\noverwriting it, so several cookies can be set in one response. Supported\noptions: `path`, `maxAge` (ms), `expires`, `domain`, `secure`, `httpOnly`,\n`sameSite` (`true` means `Strict`) and `partitioned`. Object values are stored\nas `j:` JSON, which `req.cookies` decodes automatically.\n\n### Redirects and downloads\n\n```js\nres.redirect('/login');          // 302\nres.redirect(301, '/new');       // explicit status\nres.sendStatus(403);             // 403 with the reason phrase as body\n\nres.attachment('report.csv');    // Content-Disposition: attachment\nres.sendFile('reports/q3.pdf');  // resolves a path from the cwd\nres.download('reports/q3.pdf', 'Q3 2026.pdf');\n```\n\n`redirect()` accepts both `(url, status)` and `(status, url)`. `sendFile()` and\n`download()` share the static-file engine — see\n[Static files](static-files.md) for conditional and range requests.\n\n### Content negotiation\n\n`res.format()` chooses a handler from the client's `Accept` header, sets\n`Vary: Accept`, and falls back to `default` or `406`:\n\n```js\napp.get('/greet', (req, res) => {\n  res.format({\n    json: () => res.json({ hello: 'world' }),\n    html: () => res.send('<h1>Hello</h1>'),\n    default: () => res.status(406).send('Not Acceptable'),\n  });\n});\n```\n\nKeys may be shorthands (`json`, `html`) or full media types. Evaluation uses the\nsame `req.accepts()` logic as `Request`.\n\n### Low-level writes\n\nWhen you need the socket directly:\n\n```js\nres.write('chunk');\nres.end();\nres.raw.end(compressedBuffer);\n```\n\n`res.write()` and `res.end()` return the underlying write result / `this`\nrespectively. Prefer `res.send()` unless you are streaming or compressing\nmanually.\n\n## A worked example\n\n```js\nimport { createApp, json } from 'routiva';\n\nconst app = createApp();\napp.use(json());\n\napp.post('/users', (req, res) => {\n  const wantsHtml = req.accepts('html') === 'html';\n\n  res.status(201).set('X-Created', 'yes');\n  res.cookie('lastUser', { id: 7 }, { httpOnly: true });\n\n  if (wantsHtml) {\n    res.type('html').send('<p>Created</p>');\n  } else {\n    res.json({ created: req.body, id: 7 });\n  }\n});\n\napp.listen(3000);\n```\n\n## Where to go next\n\n| If you want to… | Read |\n| --- | --- |\n| See the full API surface | [API reference](api-reference.md) |\n| Send files and ranges | [Static files](static-files.md) |\n| Parse request bodies | [Body parsing](body-parsing.md) |\n| Return errors | [Error handling](error-handling.md) |\n",gm="---\ntitle: Routing\ndescription: Define routes, capture :params and * wildcards, mount sub-routers, and understand exactly how a path is matched.\nsection: Core concepts\norder: 2\n---\n\n## The route methods\n\nEvery HTTP method has a matching method on the app (and on a `Router`):\n\n```js\nimport { createApp } from 'routiva';\n\nconst app = createApp();\n\napp.get('/users', (req, res) => res.json([]));\napp.post('/users', (req, res) => res.status(201).json(req.body));\napp.put('/users/:id', replaceUser);\napp.patch('/users/:id', patchUser);\napp.delete('/users/:id', deleteUser);\napp.head('/users/:id', headUser);\napp.options('/users/:id', optionsUser);\napp.all('/ping', (req, res) => res.send('pong'));\n```\n\n| Method | Registers |\n| --- | --- |\n| `get` `post` `put` `patch` `delete` `head` `options` | A route for that one method |\n| `all` | A route for **every** method (stored with a `null` method) |\n| `use` | Middleware (see [Middleware](middleware.md)) |\n\nA route only runs when both the path and the method match. `HEAD` is special:\nit is served by a matching `GET` route, with the body suppressed. See\n[HEAD, OPTIONS and 405](#head-options-and-405).\n\n## More than one handler per route\n\nAny number of handlers can be registered for one path. Each becomes its own\nlayer sharing the same compiled pattern, so they run in order:\n\n```js\napp.get('/reports/:id', requireAuth, loadReport, (req, res) => {\n  res.json(req.report);\n});\n```\n\n`requireAuth` runs first, calls `next()` to continue, then `loadReport`, then the\nfinal handler. Arrays are flattened, so `app.get('/x', [a, b], c)` works too.\nThis is the same trick Express uses for route-level middleware.\n\n## Path parameters\n\nA `:name` segment captures one path segment (everything up to the next `/`):\n\n```js\napp.get('/users/:id', (req, res) => {\n  res.json({ id: req.params.id });\n});\n```\n\n| Pattern | Request | Match? | `req.params` |\n| --- | --- | --- | --- |\n| `/users/:id` | `/users/42` | ✅ | `{ id: '42' }` |\n| `/users/:id` | `/users/42/` | ✅ | `{ id: '42' }` (trailing slash tolerated) |\n| `/users/:id` | `/users/42/posts` | ❌ | — |\n| `/users/:id` | `/users/a%20b` | ✅ | `{ id: 'a b' }` (decoded) |\n| `/users/:id/posts/:postId` | `/users/7/posts/9` | ✅ | `{ id: '7', postId: '9' }` |\n\nCaptured values are URL-decoded with a safe wrapper, so a malformed escape such\nas `%E0%A4` is left as-is instead of throwing a `500`.\n\nParams from an outer layer and an inner layer are **merged**, with the inner\nvalue winning. When a mounted router matches `:tenant` and a route inside it\nmatches `:id`, the handler sees both.\n\n```text\napp.use('/t/:tenant', router)      // captures { tenant }\n  router.get('/u/:id', handler)    // captures { id }\n                                   // handler sees { tenant, id }\n```\n\nroutiva supports **required** `:name` segments only. Optional (`:id?`), inline\nregex (`:id(\\\\d+)`) and arrays of paths are not part of the syntax — validate\ninside a [`param()` callback](#routerparam) or the handler instead.\n\n## Wildcards\n\n`*` captures the rest of the path (including slashes) under the key `wildcard`:\n\n```js\napp.get('/files/*', (req, res) => {\n  res.json({ path: req.params.wildcard });\n});\n```\n\n| Pattern | Request | `req.params.wildcard` |\n| --- | --- | --- |\n| `/files/*` | `/files/a/b/c.txt` | `'a/b/c.txt'` |\n| `/files/*` | `/files/` | `''` |\n| `*` | `/anything/at/all` | `'anything/at/all'` |\n\nA bare `*` route is the usual single-page-app or catch-all fallback, and is\nmatched with the lowest priority because it is registered last:\n\n```js\napp.get('*', (req, res) => res.sendFile('dist/index.html'));\n```\n\n## How a path is compiled\n\nPatterns are compiled to a `RegExp` **once, at registration**, and reused for\nevery request. `compile(pattern, end)` in `src/router.js` normalises the leading\nand trailing slashes, splits on `:name` and `*`, regex-escapes the literals,\nand turns `:name` into `([^/]+)` and `*` into `(.*)`.\n\n```\n/users/:id     end → /^\\/users\\/([^/]+)\\/?$/     exact\n/files/*       end → /^\\/files\\/(.*)\\/?$/        exact\n/api  (mount)  end → /^\\/api(?=\\/|$)/            prefix\n/              end → /^\\/?$/    prefix → /^/\n```\n\nTwo details matter:\n\n- **Routes use an exact match** that tolerates a trailing slash (`^…/?$`).\n- **Mounted middleware uses a prefix match** with a lookahead (`^…(?=/|$)`), so\n  `/api` matches `/api` and `/api/users` but not `/apis`.\n\nMatching is **case-sensitive**: `/Users` and `/users` are different paths.\n\nThe captured names are stored in a `keys` array alongside the regex, and zipped\nback onto the match at request time, so parameter order is preserved.\n\n## Mounted routers\n\nA `Router` is a self-contained stack you can mount on a path:\n\n```js\nimport { App, Router } from 'routiva';\n\nconst api = new Router();\napi.get('/status', (req, res) => res.json({ status: 'ok' }));\n\nconst app = new App();\napp.use('/api', api);\n```\n\n`app.use('/api', api)` mounts the router at the `/api` prefix. When a request\nreaches it, the prefix is **stripped** before the inner router runs, so the\nrouter above sees `/status`, not `/api/status` — exactly like an Express sub-app.\nThe original `req.path`, `req.url`, `req.params` and `req.route` are saved and\n**restored** the moment the mounted layer calls `next()`, so an outer route can\ncontinue where the inner router left off.\n\nRouters nest: mount a router inside a router, and each prefix is stripped and\nrestored in turn.\n\n```js\nconst admin = new Router();\nadmin.get('/users', (req, res) => res.json({ scope: 'admin' }));\n\nconst v1 = new Router();\nv1.use('/admin', admin);          // /v1/admin/users\n\napp.use('/v1', v1);\n```\n\n## router.route()\n\nRegister several methods for one path with a chainable builder:\n\n```js\napp.route('/items')\n  .get(listItems)\n  .post(createItem)\n  .delete(clearItems);\n```\n\nThe chain exposes `get`, `post`, `put`, `patch`, `delete`, `head`, `options` and\n`all`, and every call returns the chain so calls can be stacked.\n\n## router.param()\n\n`param(name, fn)` registers a callback that runs whenever `name` appears in a\n**matched route's** parameters, before that route's handlers:\n\n```js\nimport { HttpError } from 'routiva';\n\napp.param('id', (req, res, next, id, name) => {\n  if (!/^\\d+$/.test(id)) {\n    return next(new HttpError(400, `${name} must be numeric`));\n  }\n  req.userId = Number(id);\n  next();\n});\n\napp.get('/users/:id', (req, res) => {\n  res.json({ id: req.userId });   // already validated and coerced\n});\n```\n\n| Argument | Meaning |\n| --- | --- |\n| `req`, `res` | The wrapped request and response |\n| `next` | Continue to the route handler, or `next(err)` to fail |\n| `value` | The decoded parameter value |\n| `name` | The parameter name |\n\nCallbacks are looked up on the router that **registered** the route, so a\nmounted router's params use its own callbacks. They run in parameter-name order,\nand a `next(err)` from any of them short-circuits straight to the error chain.\n\n## HEAD, OPTIONS and 405\n\nroutiva handles the request-method corners of HTTP for you:\n\n- **`HEAD`** is served by a matching `GET` route. Headers (including\n  `Content-Length`) are computed as usual; the body is suppressed.\n- **`OPTIONS`** on a known path is answered automatically with `204` and an\n  `Allow` header listing the allowed methods.\n- A path that matches but a method that does not produces\n  **`405 Method Not Allowed`** with the same `Allow` header — not a `404`.\n\nThe allowed list is recorded while the stack is scanned. When a `GET` route\nexists, `HEAD` is recorded with it, so a `GET`-only path reports\n`Allow: GET, HEAD, OPTIONS`.\n\n```http\nOPTIONS /users HTTP/1.1\n\nHTTP/1.1 204 No Content\nAllow: GET, HEAD, OPTIONS, POST\n```\n\nIf you want to answer `OPTIONS` yourself, register a route for it; it matches\nbefore the built-in fallback. CORS middleware answers its own preflights too,\nwhich takes precedence — see [CORS](cors.md).\n\n## Registration order is execution order\n\nRoutes and middleware share one ordered stack, so the first matching layer that\nresponds wins. Register specific routes before catch-alls, and API routes before\na static or SPA fallback:\n\n```js\napp.get('/api/users', listUsers);              // matched first\napp.use(serveStatic('public', { extensions: ['html'] }));\napp.get('*', (req, res) => res.sendFile('dist/index.html'));  // last resort\n```\n\n## A complete router\n\n```js\nimport { App, Router, HttpError } from 'routiva';\n\nconst app = new App();\n\n// Validate and coerce :id once for every route that uses it.\napp.param('id', (req, res, next, id) => {\n  if (!/^\\d+$/.test(id)) return next(new HttpError(400, 'id must be numeric'));\n  req.itemId = Number(id);\n  next();\n});\n\napp.route('/items')\n  .get((req, res) => res.json([]))\n  .post((req, res) => res.status(201).json(req.body));\n\napp.get('/items/:id', (req, res) => {\n  res.json({ id: req.itemId });\n});\n\napp.get('/files/*', (req, res) => {\n  res.json({ file: req.params.wildcard });\n});\n\n// Mounted sub-router, prefix stripped to \"/v1\"\nconst v1 = new Router();\nv1.get('/ping', (req, res) => res.json({ pong: true }));\napp.use('/v1', v1);\n\napp.listen(3000);\n```\n\n## Where to go next\n\n| If you want to… | Read |\n| --- | --- |\n| Write your own middleware | [Middleware](middleware.md) |\n| Use `req` and `res` in full | [Request & Response](request-response.md) |\n| Route errors to handlers | [Error handling](error-handling.md) |\n| Serve files and SPA fallbacks | [Static files](static-files.md) |\n",ym="---\ntitle: Static files\ndescription: Serve a directory with serveStatic, and send individual files with res.sendFile, res.download and res.attachment.\nsection: Core concepts\norder: 6\n---\n\n## serveStatic(root, options)\n\n`serveStatic()` is middleware. It resolves each request path inside `root` and,\nwhen it finds a file, streams it with the correct headers. When it doesn't, it\nhands control to the next layer.\n\n```js\nimport { App, serveStatic } from 'routiva';\n\nconst app = new App();\napp.use(serveStatic('public', { maxAge: '1h' }));\n```\n\n`App.serveStatic()` and the `App.static` alias point at the same function.\n\n## Options\n\n| Option | Default | Behaviour |\n| --- | --- | --- |\n| `fallthrough` | `true` | Misses call `next()`; set `false` to answer missing files with `404` |\n| `dotfiles` | `'ignore'` | `'ignore'` skips, `'deny'` returns `403`, `'allow'` serves them |\n| `index` | `['index.html']` | Files tried when the path resolves to a directory; `false` disables indexing |\n| `extensions` | `[]` | Extensions appended when the exact path is not a file |\n| `redirect` | `true` | Redirect directory requests instead of resolving them |\n| `maxAge` | `0` | Sets `Cache-Control: public, max-age=…`; `0` emits no cache header |\n| `immutable` | `false` | Appends `immutable` to `Cache-Control` when `maxAge` is set |\n| `etag` | `true` | Emit a weak `ETag`; `false` disables it |\n| `headers` | unset | Object of extra headers set on every response |\n| `type` | unset | Overrides the `Content-Type` derived from the file extension |\n\n> `redirect` defaults to `true`, but the current `findFile` never produces a\n> redirect target, so a directory with no matching index falls through (or\n> `404`s) rather than redirecting. A directory is only served through its\n> `index` list.\n\n## What it handles\n\n- **Methods.** Only `GET` and `HEAD`. Every other method calls `next()`\n  immediately, so it composes with `POST` routes on the same path.\n- **Traversal.** The path is percent-decoded, normalised and joined to `root`,\n  then verified to stay inside it. `..%2f..%2fetc%2fpasswd` resolves outside the\n  root and is rejected. A NUL byte is rejected too.\n- **Dotfiles.** Files or directories whose name starts with `.` follow the\n  `dotfiles` policy. `'ignore'` is the safe default.\n- **Index files.** A request for a directory walks the `index` list in order and\n  serves the first match that is a regular file.\n- **Extension fallback.** If the exact path is neither a file nor a directory,\n  each entry of `extensions` is tried in order.\n- **Fallthrough.** If nothing is found, `next()` runs unless `fallthrough` is\n  `false`, in which case the middleware raises `HttpError(404)`.\n\n### Path resolution\n\n`resolveWithin(root, requestPath, dotfiles)` returns an absolute path, `null`\nto skip, or `'deny'`:\n\n| Request path | Result |\n| --- | --- |\n| `/style.css` | `<root>/style.css` |\n| `/..%2f..%2fetc%2fpasswd` | `null` (escapes root) |\n| `/a/%00b` | `null` (NUL byte) |\n| `/.env` with `dotfiles: 'ignore'` | `null` |\n| `/.env` with `dotfiles: 'deny'` | `'deny'` → `403` |\n| `/.env` with `dotfiles: 'allow'` | `<root>/.env` |\n\n### Index and extension examples\n\n```js\n// Serve public/index.html for \"/\", public/index.htm as a fallback.\napp.use(serveStatic('public', { index: ['index.html', 'index.htm'] }));\n\n// Disable directory indexes entirely.\napp.use(serveStatic('public', { index: false }));\n\n// GET /about serves public/about.html.\napp.use(serveStatic('public', { extensions: ['html'] }));\n```\n\nExtension fallback runs only after the exact path and directory index checks\nfail, so it never shadows a real file.\n\n## Conditional and range requests\n\nFile responses are handled by `send.js`, the same engine `res.sendFile()` uses.\nFor every file it sets `Last-Modified`, `Accept-Ranges: bytes` and a weak ETag of\nthe form `W/\"<size-hex>-<mtime-hex>\"`.\n\n```text\nstat file\n   │\n   ├─ If-None-Match / If-Modified-Since still fresh ─▶ 304 (no body)\n   ├─ Range: bytes=a-b ─▶ 206 + Content-Range, stream the slice\n   ├─ bad range ─▶ 416 + Content-Range: bytes */size\n   └─ else ─▶ 200 + Content-Length, stream the file\n```\n\nMatching rules:\n\n- `If-None-Match: *` is always fresh. Otherwise the header is split on commas and\n  each tag is compared for exact equality with the ETag. With `etag: false` the\n  check is skipped.\n- `If-Modified-Since` is compared at whole-second resolution, because HTTP dates\n  carry no milliseconds.\n- A range request must match `bytes=<start>-<end>` exactly. Multiple ranges in one\n  header are not supported — an unrecognised value is treated as no range.\n\nValid forms:\n\n| Header | Meaning |\n| --- | --- |\n| `bytes=0-499` | First 500 bytes |\n| `bytes=500-` | From byte 500 to the end |\n| `bytes=-500` | Last 500 bytes |\n| `bytes=0-0` | A single byte |\n\nA suffix of `0`, or a start beyond the file size, is answered with `416`.\n\n## Caching\n\n`maxAge` is parsed by `parseDuration`, which accepts numbers or strings like\n`'500ms'`, `'30s'`, `'10m'`, `'1h'`, `'7d'`.\n\n```js\n// Hashed assets: cache for a year, safe because the name changes on edit.\n// Note the largest duration unit is weeks, so a year is expressed as 365d.\napp.use('/assets', serveStatic('public/assets', { maxAge: '365d', immutable: true }));\n\n// HTML: revalidate on every request.\napp.use(serveStatic('public', { etag: true, maxAge: 0 }));\n```\n\nOnly when `maxAge` is greater than zero is `Cache-Control: public, max-age=…`\nsent, with `, immutable` appended when requested. With the default `maxAge: 0`\nno `Cache-Control` header is written, so clients fall back to the ETag and\n`Last-Modified` revalidation above.\n\n## res.sendFile() and res.download()\n\nSingle-file responses reuse the same engine:\n\n```js\napp.get('/report', (req, res) => {\n  res.sendFile('reports/q3.pdf');            // inline\n});\n\napp.get('/report/download', (req, res) => {\n  res.download('reports/q3.pdf', 'Q3 2026.pdf');\n});\n```\n\n- `res.sendFile(filePath, options?, callback?)` resolves the path against the\n  process working directory and accepts the same `maxAge`, `etag`, `headers` and\n  `type` options as `serveStatic()`. It returns a promise; if you pass a\n  callback it returns `this`.\n- A missing file rejects with `HttpError(404)`, so it flows into your error\n  middleware.\n- `res.download(filePath, filename?, options?, callback?)` is `sendFile` plus a\n  `Content-Disposition: attachment` header. Arguments shift: a function\n  `filename` is treated as the callback, and an object `filename` is treated as\n  `options`.\n- `res.attachment(filename?)` sets `Content-Disposition: attachment` on its own.\n  Non-ASCII names get an RFC 5987 `filename*=UTF-8''…` parameter alongside a\n  sanitised ASCII `filename`.\n\n## MIME types\n\n`lookupMime(filePath)` maps an extension to a type using a built-in table, and\nfalls back to `application/octet-stream`. The table covers HTML, text, Markdown,\nJSON, JS, CSS, XML, CSV, YAML, the common image and font formats, audio, video,\nWASM, PDF, ZIP and gzip.\n\n```js\nimport { lookupMime } from 'routiva';\n\nlookupMime('app.css');   // 'text/css; charset=utf-8'\nlookupMime('photo.webp'); // 'image/webp'\nlookupMime('archive.rar'); // 'application/octet-stream'\n```\n\n`res.type(value)` uses its own small extension table, so `res.type('html')` works\nas shorthand for `text/html; charset=utf-8`.\n\n## Single-page app fallback\n\nMount the static handler first, then a catch-all route that returns the shell for\nany remaining `GET`. Anything the static layer didn't find lands here.\n\n```js\nimport { App, serveStatic } from 'routiva';\n\nconst app = new App();\n\napp.use(serveStatic('dist', {\n  index: ['index.html'],\n  extensions: ['html'],\n}));\n\n// Client-side routes: /settings, /users/42, … all return the SPA shell.\napp.get('*', (req, res) => {\n  res.sendFile('dist/index.html');\n});\n\napp.listen(3000);\n```\n\nBecause `serveStatic()` falls through by default, real assets like\n`/app.abc123.js` are streamed from disk and only the unknown paths reach the\ncatch-all. If you serve the API from the same app, register those routes before\nthe catch-all so they match first.\n",vm=`---
title: Testing
description: Test routiva apps with node --test and global fetch, bind servers to port 0, and run the CRUD demo suite.
section: Guides
order: 2
---

## No test framework to install

routiva tests itself with the runner that ships with Node: \`node --test\`. Test
files import \`test\` from \`node:test\` and assertions from \`node:assert/strict\`.
There is no mocha, no jest and no \`supertest\` to audit.

\`\`\`bash
npm test              # node --test, runs test/
npm run test:watch    # node --test --watch
\`\`\`

\`node --test\` discovers \`test/**/*.test.js\` and runs each file in its own
process. Two suites live in the repo: \`test/\` and \`crud-app/test/\`.

## Make real requests

Tests start a server and talk to it over HTTP with the global \`fetch\`. That
exercises the wrappers, the router, the middleware and Node's socket code
together, which is where framework bugs actually surface.

Bind to port \`0\` and let the OS pick the port:

\`\`\`js
const server = app.listen(0);
await once(server, 'listening');
const base = \`http://127.0.0.1:\${server.address().port}\`;
\`\`\`

Fixed ports collide between parallel runs; port \`0\` removes the problem.

## A small start helper

\`test/helpers.js\` wraps the pattern so each file does not repeat it:

\`\`\`js
import { once } from 'node:events';

export async function start(app) {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  return {
    server,
    url: \`http://127.0.0.1:\${port}\`,
    async close() {
      if (!server.listening) return;
      server.close();
      await once(server, 'close');
    },
  };
}
\`\`\`

## A full test file

The shape used across the repo: build the app, start it once in \`before\`, close
it in \`after\`, and assert status, headers and body from \`fetch\`.

\`\`\`js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, json } from 'routiva';

let server;
let base;

before(async () => {
  const app = createApp();
  app.use(json());

  app.get('/hello', (req, res) => res.json({ hello: 'world' }));
  app.post('/echo', (req, res) => res.status(201).json(req.body));
  app.get('/boom', () => {
    throw new Error('nope');
  });
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = \`http://127.0.0.1:\${server.address().port}\`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /hello returns JSON', async () => {
  const res = await fetch(\`\${base}/hello\`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\\/json/);
  assert.deepEqual(await res.json(), { hello: 'world' });
});

test('POST /echo returns the parsed body', async () => {
  const res = await fetch(\`\${base}/echo\`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ n: 1 }),
  });
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { n: 1 });
});

test('a thrown error reaches the error middleware', async () => {
  const res = await fetch(\`\${base}/boom\`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'nope' });
});
\`\`\`

\`before\` and \`after\` are exported by \`node:test\` and scoped to the file.

## Assert the things that break

- **Status first.** A wrong status usually means the route did not match, or a
  middleware swallowed the request.
- **Headers that carry meaning.** \`Allow\` on a \`405\`, \`Location\` on a \`201\`,
  \`Content-Type\` on JSON, \`Content-Encoding\` on a compressed response.
- **JSON shape, not string form.** \`assert.deepEqual(await res.json(), {...})\`
  survives key ordering and whitespace.

## Test middleware in isolation

Mount only the middleware under test and assert its observable behaviour. It is
faster to write and isolates the failure:

\`\`\`js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, cors } from 'routiva';
import { start } from './helpers.js';

test('cors reflects the origin when credentials are on', async (t) => {
  const app = createApp();
  app.use(cors({ origin: true, credentials: true }));
  app.get('/', (req, res) => res.send('ok'));

  const s = await start(app);
  t.after(() => s.close());

  const res = await fetch(s.url, { headers: { origin: 'https://example.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://example.com');
});
\`\`\`

\`t.after()\` scopes teardown to one test; \`before\` and \`after\` scope it to the
file.

## Testing the CRUD demo

The demo has its own end-to-end checks:

\`\`\`bash
npm run crud:test     # node --test crud-app/test/crud.test.js
npm run crud:smoke    # bash crud-app/curl.sh
\`\`\`

\`crud-app/test/crud.test.js\` builds the app with a temporary data file, logging
off and a high rate limit, then walks the full lifecycle: create, read, update,
restock, validation, duplicate SKU, \`405\`, delete and on-disk persistence. The
same discipline applies to your app: expose it as a factory that takes its
configuration, so a test can point it at a temp path and an ephemeral port.

\`crud-app/curl.sh\` takes a different route. It boots the real server on port
\`4123\` against a throwaway file, drives every endpoint with \`curl\` and prints
status codes, then cleans up. \`crud-app/requests.http\` holds the same calls for
the VS Code REST Client or the JetBrains HTTP client.

## Scripts

| Command | What it runs |
| --- | --- |
| \`npm test\` | \`node --test\`, the framework suite |
| \`npm run test:watch\` | \`node --test --watch\` |
| \`npm run crud:test\` | \`node --test crud-app/test/crud.test.js\` |
| \`npm run crud:smoke\` | \`bash crud-app/curl.sh\` |
| \`npm run crud\` | \`node crud-app/server.js\` |
| \`npm run example\` | \`node examples/basic.js\` |

## Tips

- **Avoid fixed ports.** Use \`listen(0)\` plus \`server.address().port\`.
- **Always close servers.** Use \`t.after\` or \`after\` so a failed assertion
  cannot leave a socket open and hang the runner.
- **Disable logging in tests.** Pass \`logger({ enabled: false })\` or a config
  flag so the output stays readable.
- **Use a raw \`http\` request when \`fetch\` hides the truth.** \`fetch\` decodes
  compressed bodies automatically, so the compression test uses the \`request()\`
  helper in \`test/helpers.js\` to read bytes and headers directly.
- **Raise rate limits for the suite.** The CRUD app takes \`rateLimitMax\` as a
  parameter, so hundreds of requests do not trip a production limit.
`,Pn=e=>String(e).replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]),wm=e=>Pn(e).replace(/`/g,"&#96;");function xm(e){return String(e).replace(/<[^>]+>/g,"").replace(/`/g,"").toLowerCase().replace(/[^\w\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-{2,}/g,"-")}function km(e){if(/^(https?:)?\/\//.test(e)||e.startsWith("#")||e.startsWith("mailto:"))return e;const[n,t=""]=e.split("#");let r=n.replace(/\.md$/,"").replace(/\.html$/,"");return r=r.replace(/^\.\//,"").replace(/\/$/,""),r==="index"&&(r=""),r&&!r.startsWith("/")&&(r=`/${r}`),r+(t?`#${t}`:"")}function id(e){return e.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim()}const jm={js:[["com",/\/\/[^\n]*|\/\*[\s\S]*?\*\//],["str",/`(?:\\[\s\S]|[^\\`])*`|'(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*"/],["num",/\b0[xX][\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],["kw",/\b(?:import|export|from|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|this|try|catch|finally|throw|async|await|of|in|typeof|instanceof|delete|void|yield|static|null|undefined|true|false)\b/],["fn",/\b[A-Za-z_$][\w$]*(?=\s*\()/],["prop",new RegExp("(?<=\\.)[A-Za-z_$][\\w$]*")]],json:[["str",/"(?:\\.|[^"\\])*"/],["num",/-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],["kw",/\b(?:true|false|null)\b/]],bash:[["com",/#[^\n]*/],["str",/"(?:\\.|[^"\\])*"|'[^']*'/],["var",/\$\{?[A-Za-z_][\w]*\}?/],["kw",/\b(?:npm|npx|node|pnpm|yarn|export|if|then|else|elif|fi|for|in|do|done|echo|printf|curl|cd|mkdir|rm|cp|mv|cat|grep|rg|ls|chmod|open|start|set|PORT|HOST|DATA_FILE|NODE_ENV)\b/],["flag",/-{1,2}[A-Za-z][\w-]*/],["num",/\b\d+(?:\.\d+)?\b/]],http:[["method",/\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/],["str",/https?:\/\/[^\s]+/],["attr",/^[A-Za-z][A-Za-z-]*(?=:)/],["num",/\b\d{3}\b/]],html:[["com",/<!--[\s\S]*?-->/],["tag",/<\/?[A-Za-z][\w-]*/],["attr",/\b[A-Za-z-]+(?==)/],["str",/"(?:[^"\\]|\\.)*"|'[^']*'/],["punc",/\/?>/]],css:[["com",/\/\*[\s\S]*?\*\//],["str",/"(?:[^"\\]|\\.)*"|'[^']*'/],["num",/#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr|deg|ch)?\b/],["prop",/[-a-z]+(?=\s*:)/]]},Pl={javascript:"js",mjs:"js",cjs:"js",js:"js",jsonc:"json",shell:"bash",sh:"bash",zsh:"bash",console:"bash",terminal:"bash",html:"html",xml:"html",css:"css",yaml:"bash",yml:"bash",txt:"text","":"text"};function Sm(e){const n=e.map(([t,r])=>`(?<${t}>${r.source})`).join("|");return new RegExp(n,"gm")}const yo=new Map;function ld(e,n){const t=Pl[n]!==void 0?Pl[n]:n,r=jm[t];if(!r)return Pn(e);yo.has(t)||yo.set(t,Sm(r));const s=yo.get(t);s.lastIndex=0;let o="",a=0,i;for(;(i=s.exec(e))!==null;){i.index>a&&(o+=Pn(e.slice(a,i.index)));const u=Object.keys(i.groups).find(c=>i.groups[c]!==void 0);o+=`<span class="tok-${u}">${Pn(i[0])}</span>`,a=s.lastIndex,s.lastIndex===i.index&&(s.lastIndex+=1)}return o+=Pn(e.slice(a)),o}const bn=/^(\s*)([-*+]|\d+\.)\s+(\S.*)$/;function Lt(e){const n=[];let t=Pn(e);return t=t.replace(/`([^`]+)`/g,(r,s)=>(n.push(s),`\0${n.length-1}\0`)),t=t.replace(/!\[([^\]]*)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,(r,s,o)=>`<img src="${o}" alt="${s}" loading="lazy">`),t=t.replace(/\[([^\]]+)\]\(([^)\s]+?)(?:\s+&quot;([^&]*)&quot;)?\)/g,(r,s,o)=>{const a=km(o),u=/^https?:\/\//.test(a)?' target="_blank" rel="noopener"':"";return`<a href="${a}"${u}>${s}</a>`}),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g,"$1<em>$2</em>"),t=t.replace(/(^|[^\w_])_([^_\n]+)_(?!\w)/g,"$1<em>$2</em>"),t=t.replace(/~~([^~]+)~~/g,"<del>$1</del>"),t=t.replace(/\u0000(\d+)\u0000/g,(r,s)=>`<code>${n[Number(s)]}</code>`),t}function vo(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(n=>n.trim())}function ma(e,n){const t=e[n].match(bn),r=t[1].length,s=/^\d/.test(t[2]);let o=s?"<ol>":"<ul>",a=n;for(;a<e.length;){const i=e[a].match(bn);if(!i)break;const u=i[1].length;if(u<r)break;if(u>r){const m=ma(e,a);o+=m.html,a=m.next;continue}if(/^\d/.test(i[2])!==s)break;let g=i[3];for(a+=1;a<e.length&&/^\s+\S/.test(e[a])&&!bn.test(e[a]);)g+=" "+e[a].trim(),a+=1;let d="";if(a<e.length&&bn.test(e[a])&&e[a].match(bn)[1].length>r){const v=ma(e,a);d=v.html,a=v.next}o+=`<li>${Lt(g)}${d}</li>`}return o+=s?"</ol>":"</ul>",{html:o,next:a}}function ud(e){const n=e.replace(/\r\n?/g,`
`).split(`
`),t=[],r=new Map;let s="",o=0;const a=i=>{const u=xm(i)||"section";if(!r.has(u))return r.set(u,0),u;const c=r.get(u)+1;return r.set(u,c),`${u}-${c}`};for(;o<n.length;){const i=n[o];if(/^\s*$/.test(i)){o+=1;continue}const u=i.match(/^\s*```\s*([\w-]*)\s*$/);if(u){const d=u[1]||"text",m=[];for(o+=1;o<n.length&&!/^\s*```\s*$/.test(n[o]);)m.push(n[o]),o+=1;o+=1;const v=m.join(`
`),w=d==="text"?"text":d;s+=`<div class="codeblock" data-lang="${wm(w)}"><div class="codeblock-head"><span class="lang">${Pn(w)}</span><button class="copy-btn" data-copy aria-label="Copy code">Copy</button></div><pre><code>${ld(v,d)}</code></pre></div>
`;continue}const c=i.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);if(c){const d=c[1].length,m=c[2],v=a(m),w=Lt(m);d<=4&&t.push({level:d,id:v,text:id(w)});const x=`<a class="anchor" href="#${v}" aria-hidden="true">#</a>`;s+=`<h${d} id="${v}">${w}${x}</h${d}>
`,o+=1;continue}if(/^(-{3,}|\*{3,}|_{3,})\s*$/.test(i)){s+=`<hr>
`,o+=1;continue}if(/^>\s?/.test(i)){const d=[];for(;o<n.length&&/^>\s?/.test(n[o]);)d.push(n[o].replace(/^>\s?/,"")),o+=1;const m=ud(d.join(`
`)).html;s+=`<blockquote>${m}</blockquote>
`;continue}if(i.includes("|")&&o+1<n.length&&/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(n[o+1])&&n[o+1].includes("-")){const d=vo(i),m=vo(n[o+1]).map(S=>/^:-+:$/.test(S)?"center":/^-+:$/.test(S)?"right":"left");o+=2;const v=[];for(;o<n.length&&n[o].includes("|")&&!/^\s*$/.test(n[o]);)v.push(vo(n[o])),o+=1;const w=S=>m[S]&&m[S]!=="left"?` style="text-align:${m[S]}"`:"";let x='<div class="table-wrap"><table><thead><tr>';d.forEach((S,h)=>{x+=`<th${w(h)}>${Lt(S)}</th>`}),x+="</tr></thead><tbody>";for(const S of v){x+="<tr>";for(let h=0;h<d.length;h+=1)x+=`<td${w(h)}>${Lt(S[h]||"")}</td>`;x+="</tr>"}x+=`</tbody></table></div>
`,s+=x;continue}if(bn.test(i)){const d=ma(n,o);s+=d.html+`
`,o=d.next;continue}const g=[i];for(o+=1;o<n.length&&!/^\s*$/.test(n[o])&&!/^(#{1,6})\s+/.test(n[o])&&!/^\s*```/.test(n[o])&&!/^>\s?/.test(n[o])&&!bn.test(n[o])&&!/^(-{3,}|\*{3,}|_{3,})\s*$/.test(n[o]);)g.push(n[o]),o+=1;s+=`<p>${Lt(g.join(" "))}</p>
`}return{html:s,headings:t}}function Em(e){const n=e.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);if(!n)return{data:{},body:e};const t={};for(const r of n[1].split(/\r?\n/)){const s=r.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(!s)continue;let o=s[2].trim();(/^".*"$/.test(o)||/^'.*'$/.test(o))&&(o=o.slice(1,-1)),t[s[1]]=o}return{data:t,body:e.slice(n[0].length)}}const Oe={repo:"https://github.com/uditc0derr/routiva",npm:"https://www.npmjs.com/package/routiva"},ga=["Introduction","Core concepts","Built-in middleware","Guides","Reference"],Tm=Object.assign({"../content/api-reference.md":Yf,"../content/architecture.md":Zf,"../content/body-parsing.md":em,"../content/compression.md":nm,"../content/core-concepts.md":tm,"../content/cors.md":rm,"../content/error-handling.md":sm,"../content/examples.md":om,"../content/express-comparison.md":am,"../content/faq.md":im,"../content/getting-started.md":lm,"../content/installation.md":um,"../content/logging.md":cm,"../content/middleware.md":dm,"../content/performance.md":pm,"../content/quick-start.md":hm,"../content/rate-limiting.md":fm,"../content/request-response.md":mm,"../content/routing.md":gm,"../content/static-files.md":ym,"../content/testing.md":vm}),_l=e=>{const n=ga.indexOf(e);return n===-1?ga.length:n};function Cm(){const e=Object.entries(Tm).map(([n,t])=>{const r=n.split("/").pop().replace(/\.md$/,""),{data:s,body:o}=Em(t),a=o.replace(/^\s*#\s+.*\n/,""),{html:i,headings:u}=ud(a);return{slug:r,title:s.title||r,description:s.description||"",section:s.section||"Reference",order:Number(s.order||0),html:i,headings:u,text:id(i)}});return e.sort((n,t)=>{const r=_l(n.section)-_l(t.section);return r!==0?r:n.order!==t.order?n.order-t.order:n.title.localeCompare(t.title)}),e}const lt=Cm(),Nm=new Map(lt.map(e=>[e.slug,e])),bm=[{title:"Home",section:"Overview",description:"A zero-dependency Express.js alternative for Node.js.",url:"/",text:"routiva zero dependency express alternative node.js routing middleware body parsing static files cors compression rate limiting"},...lt.map(e=>({title:e.title,section:e.section,description:e.description,url:`/${e.slug}`,text:e.text.slice(0,6e3)}))];function Am(e){return e?e.replace(/\.html$/,"").replace(/^index$/,""):""}const cd=k.createContext(null);function Rm(e,n){const t=n.trim().toLowerCase();if(!t)return e.slice(0,8);const r=t.split(/\s+/);return e.map(s=>{const o=`${s.title} ${s.section} ${s.description} ${s.text}`.toLowerCase();let a=0;for(const i of r){if(!o.includes(i))return null;s.title.toLowerCase().includes(i)&&(a+=6),s.description.toLowerCase().includes(i)&&(a+=3),a+=1}return{page:s,score:a}}).filter(Boolean).sort((s,o)=>o.score-s.score).slice(0,12).map(s=>s.page)}function qm({open:e,onClose:n}){const[t,r]=k.useState(""),[s,o]=k.useState(0),a=k.useRef(null),i=zs(),u=k.useMemo(()=>Rm(bm,t),[t]);if(k.useEffect(()=>{if(!e)return;r(""),o(0),document.body.style.overflow="hidden";const d=setTimeout(()=>a.current&&a.current.focus(),0);return()=>{clearTimeout(d),document.body.style.overflow=""}},[e]),k.useEffect(()=>{o(0)},[t]),!e)return null;const c=d=>{n(),d&&i(d.url)},g=d=>{d.key==="ArrowDown"?(d.preventDefault(),o(m=>Math.min(m+1,u.length-1))):d.key==="ArrowUp"?(d.preventDefault(),o(m=>Math.max(m-1,0))):d.key==="Enter"?c(u[s]):d.key==="Escape"&&n()};return l.jsx("div",{className:"search-overlay open",role:"dialog","aria-modal":"true","aria-label":"Search documentation",onClick:d=>{d.target===d.currentTarget&&n()},children:l.jsxs("div",{className:"search-modal",children:[l.jsxs("div",{className:"search-input-row",children:[l.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:[l.jsx("circle",{cx:"11",cy:"11",r:"7"}),l.jsx("path",{d:"M21 21l-4.3-4.3"})]}),l.jsx("input",{ref:a,id:"search-input",type:"search",placeholder:"Search the docs…",autoComplete:"off",spellCheck:"false",value:t,onChange:d=>r(d.target.value),onKeyDown:g}),l.jsx("span",{className:"kbd",children:"Esc"})]}),l.jsx("div",{className:"search-results",children:u.length===0?l.jsx("div",{className:"search-empty",children:"No matches. Try “routing”, “cors”, “sendFile”…"}):u.map((d,m)=>l.jsxs("a",{className:m===s?"search-hit active":"search-hit",href:d.url,onClick:v=>{v.preventDefault(),c(d)},children:[l.jsxs("span",{className:"hit-top",children:[l.jsx("span",{className:"hit-title",children:d.title}),l.jsx("span",{className:"hit-section",children:d.section})]}),l.jsx("span",{className:"hit-desc",children:d.description})]},d.url))}),l.jsxs("div",{className:"search-foot",children:[l.jsxs("span",{children:[l.jsx("span",{className:"kbd",children:"↑"}),l.jsx("span",{className:"kbd",children:"↓"})," navigate"]}),l.jsxs("span",{children:[l.jsx("span",{className:"kbd",children:"↵"})," open"]}),l.jsxs("span",{children:[l.jsx("span",{className:"kbd",children:"Esc"})," close"]})]})]})})}function Pm({children:e}){const[n,t]=k.useState(!1),r=k.useCallback(()=>t(!0),[]),s=k.useCallback(()=>t(!1),[]);k.useEffect(()=>{const a=i=>{const u=/^(INPUT|TEXTAREA|SELECT)$/.test(i.target&&i.target.tagName||"");if((i.metaKey||i.ctrlKey)&&i.key.toLowerCase()==="k"){i.preventDefault(),t(c=>!c);return}i.key==="/"&&!u&&(i.preventDefault(),t(!0)),i.key==="Escape"&&t(!1)};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[]);const o=k.useMemo(()=>({open:n,openSearch:r,closeSearch:s}),[n,r,s]);return l.jsxs(cd.Provider,{value:o,children:[e,l.jsx(qm,{open:n,onClose:s})]})}function _m(){const e=k.useContext(cd);if(!e)throw new Error("useSearch must be used within a SearchProvider");return e}const dd="routiva-theme";function Om(){if(typeof document>"u")return"dark";try{const e=localStorage.getItem(dd);if(e==="light"||e==="dark")return e}catch{}return document.documentElement.getAttribute("data-theme")||"dark"}function Mm(){const[e,n]=k.useState(Om);k.useEffect(()=>{document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem(dd,e)}catch{}},[e]);const t=k.useCallback(()=>n(r=>r==="dark"?"light":"dark"),[]);return{theme:e,toggle:t}}function Im(){return l.jsxs(l.Fragment,{children:[l.jsxs("svg",{className:"i-sun",width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:[l.jsx("circle",{cx:"12",cy:"12",r:"4"}),l.jsx("path",{d:"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"})]}),l.jsx("svg",{className:"i-moon",width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:l.jsx("path",{d:"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"})})]})}function Lm(){return l.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:[l.jsx("circle",{cx:"11",cy:"11",r:"7"}),l.jsx("path",{d:"M21 21l-4.3-4.3"})]})}function pd(){const{toggle:e}=Mm();return l.jsx("button",{className:"icon-btn",onClick:e,"aria-label":"Toggle color theme",title:"Toggle theme",type:"button",children:l.jsx(Im,{})})}function hd({menu:e=!1,onToggleMenu:n,version:t,children:r}){const{openSearch:s}=_m();return l.jsxs("header",{className:"topbar",children:[e&&l.jsx("button",{className:"hamburger",onClick:n,"aria-label":"Open navigation",type:"button",children:l.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:l.jsx("path",{d:"M3 6h18M3 12h18M3 18h18"})})}),l.jsxs(W,{className:"brand",to:"/",children:[l.jsx("span",{className:"mark",children:"r"}),l.jsx("span",{children:"routiva"}),t&&l.jsx("span",{className:"ver",children:t})]}),l.jsx("div",{className:"spacer"}),l.jsxs("button",{className:"search-trigger",onClick:s,"aria-label":"Search documentation",type:"button",children:[l.jsx(Lm,{}),l.jsx("span",{className:"label",children:e?"Search documentation":"Search docs"}),l.jsx("span",{className:"kbd",children:"⌘K"})]}),l.jsx("nav",{className:"topbar-links",children:r})]})}async function fd(e){const n=String(e);try{await navigator.clipboard.writeText(n);return}catch{}const t=document.createElement("textarea");t.value=n,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{document.execCommand("copy")}catch{}document.body.removeChild(t)}function ya({text:e,className:n="copy-btn",label:t="Copy"}){const[r,s]=k.useState(!1),o=async()=>{await fd(e),s(!0),setTimeout(()=>s(!1),1400)};return l.jsx("button",{type:"button",className:r?`${n} copied`:n,onClick:o,"aria-label":"Copy code",children:r?"Copied":t})}function Ol({label:e,lang:n,code:t}){return l.jsxs("div",{className:"codeblock",children:[l.jsxs("div",{className:"codeblock-head",children:[l.jsx("span",{className:"lang",children:e}),l.jsx(ya,{text:t})]}),l.jsx("pre",{children:l.jsx("code",{dangerouslySetInnerHTML:{__html:ld(t,n)}})})]})}const zm=`import { createApp, json, logger } from 'routiva';

const app = createApp();

app.use(logger());
app.use(json());

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, query: req.query });
});

app.post('/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.listen(3000, () => console.log('http://localhost:3000'));`,Dm=`import { createApp, cors, compress, rateLimit } from 'routiva';

const app = createApp();

app.use(cors({ origin: 'https://example.com', credentials: true }));
app.use(compress({ threshold: '1kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// async errors flow into your error middleware automatically
app.get('/report', async (req, res) => {
  const data = await loadReport();   // a rejection becomes a 500
  res.json(data);
});

// 405 + Allow, HEAD and OPTIONS are handled for you
app.get('/health', (req, res) => res.send('ok'));`,Fm=14,Hm=1917,Um=78,$m="0.1.2",Bm={sourceFiles:Fm,loc:Hm,tests:Um,version:$m},Wm=()=>l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:l.jsx("path",{d:"M5 12h14M13 6l6 6-6 6"})}),Vm=()=>l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"currentColor",children:l.jsx("path",{d:"M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"})}),Gm=[{icon:l.jsx("path",{d:"M4 7h16M4 12h10M4 17h7"}),title:"Routing",body:l.jsxs(l.Fragment,{children:[l.jsx("code",{children:":params"}),", ",l.jsx("code",{children:"*"})," wildcards, ",l.jsx("code",{children:"router.route()"})," and mounted sub-routers with prefix stripping."]})},{icon:l.jsx("path",{d:"M12 3v18M3 12h18"}),title:"Middleware",body:"One ordered stack. Registration order is execution order, exactly like Express."},{icon:l.jsxs(l.Fragment,{children:[l.jsx("path",{d:"M4 6h16v12H4z"}),l.jsx("path",{d:"M4 10h16"})]}),title:"Body parsing",body:l.jsxs(l.Fragment,{children:[l.jsx("code",{children:"json"}),", ",l.jsx("code",{children:"urlencoded"}),", ",l.jsx("code",{children:"text"})," and ",l.jsx("code",{children:"raw"})," with size limits, strict mode and 413 handling."]})},{icon:l.jsxs(l.Fragment,{children:[l.jsx("path",{d:"M3 7l9-4 9 4-9 4-9-4z"}),l.jsx("path",{d:"M3 12l9 4 9-4M3 17l9 4 9-4"})]}),title:"Static files",body:l.jsxs(l.Fragment,{children:[l.jsx("code",{children:"serveStatic"})," with ETags, ranges, caching and traversal protection. Plus"," ",l.jsx("code",{children:"res.sendFile"}),"."]})},{icon:l.jsxs(l.Fragment,{children:[l.jsx("circle",{cx:"12",cy:"12",r:"9"}),l.jsx("path",{d:"M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"})]}),title:"CORS",body:l.jsxs(l.Fragment,{children:["Correct preflight handling, origin reflection with credentials, and ",l.jsx("code",{children:"Vary: Origin"}),"."]})},{icon:l.jsxs(l.Fragment,{children:[l.jsx("path",{d:"M6 3v12a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v9"}),l.jsx("path",{d:"M3 6h3M18 15h3"})]}),title:"Compression",body:l.jsxs(l.Fragment,{children:["Brotli, gzip or deflate chosen from ",l.jsx("code",{children:"Accept-Encoding"}),", with a size threshold."]})},{icon:l.jsxs(l.Fragment,{children:[l.jsx("path",{d:"M12 8v4l3 2"}),l.jsx("circle",{cx:"12",cy:"12",r:"9"})]}),title:"Rate limiting",body:l.jsxs(l.Fragment,{children:["Fixed-window limiter with ",l.jsx("code",{children:"X-RateLimit-*"}),", ",l.jsx("code",{children:"Retry-After"})," and a pluggable store."]})},{icon:l.jsx("path",{d:"M4 5h16M4 12h16M4 19h10"}),title:"Logging",body:"One line per request with method, URL, status and duration. Bring your own stream."},{icon:l.jsx("path",{d:"M10.3 4.3L2 12l8.3 7.7M13.7 4.3L22 12l-8.3 7.7"}),title:"Safe by default",body:"Async errors are caught automatically, duplicate sends are ignored, and 405/OPTIONS are correct."}],Qm=[["Runtime dependencies",l.jsx("span",{className:"yes",children:"0"}),l.jsx("span",{className:"no",children:"~30 transitive"})],["Routing (:param, *)",l.jsx("span",{className:"yes",children:"Built in"}),"via path-to-regexp"],["Async error propagation",l.jsx("span",{className:"yes",children:"Automatic"}),l.jsx("span",{className:"no",children:"Express 4: no"})],["405 + Allow",l.jsx("span",{className:"yes",children:"Yes"}),l.jsx("span",{className:"no",children:"Returns 404"})],["Auto OPTIONS",l.jsx("span",{className:"yes",children:"Yes"}),"Partial"],["Double-send guard",l.jsx("span",{className:"yes",children:"Yes"}),l.jsx("span",{className:"no",children:"Crashes"})],["Bundled CORS / compression / rate limit",l.jsx("span",{className:"yes",children:"Yes"}),l.jsx("span",{className:"no",children:"Separate packages"})],["Template engines",l.jsx("span",{className:"no",children:"No"}),l.jsx("span",{className:"yes",children:"Yes"})],["Ecosystem & maturity",l.jsx("span",{className:"no",children:"New"}),l.jsx("span",{className:"yes",children:"Years of use"})]],Jm=[{k:"Introduction",to:"/getting-started",title:"Getting started",body:"What routiva is, the design philosophy, and your first server in a minute.",links:[["Overview","/getting-started"],["Install","/installation"],["Quick start","/quick-start"]]},{k:"Core concepts",to:"/routing",title:"Routing & middleware",body:"Path parameters, wildcards, the ordered layer stack and error handlers.",links:[["Routing","/routing"],["Middleware","/middleware"],["Errors","/error-handling"]]},{k:"Reference",to:"/request-response",title:"Request & Response",body:l.jsxs(l.Fragment,{children:["Every helper on the wrapped objects, from ",l.jsx("code",{children:"req.accepts()"})," to"," ",l.jsx("code",{children:"res.format()"}),"."]}),links:[["req & res","/request-response"],["API index","/api-reference"]]},{k:"Built-in middleware",to:"/cors",title:"CORS, compression, limits",body:"The middleware that ships in the core, with every option documented.",links:[["CORS","/cors"],["Compression","/compression"],["Rate limiting","/rate-limiting"],["Logging","/logging"]]},{k:"Guides",to:"/examples",title:"Examples & testing",body:"A runnable demo, a full CRUD API, and how the test suite works.",links:[["Examples","/examples"],["Testing","/testing"],["Performance","/performance"]]},{k:"Internals",to:"/architecture",title:"Architecture",body:"How dispatch, param restoration and path compilation actually work.",links:[["Architecture","/architecture"],["From Express","/express-comparison"],["FAQ","/faq"]]}];function Km(){k.useEffect(()=>{document.title="routiva — a zero-dependency Express alternative for Node.js"},[]);const{version:e,tests:n,sourceFiles:t,loc:r}=Bm,s=`~${(r/1e3).toFixed(1)}k`;return l.jsxs("div",{className:"page landing",children:[l.jsxs(hd,{version:e,children:[l.jsx(W,{to:"/getting-started",children:"Docs"}),l.jsx(W,{className:"hide-sm",to:"/api-reference",children:"API"}),l.jsx("a",{className:"hide-sm",href:Oe.repo,target:"_blank",rel:"noopener",children:"GitHub"}),l.jsx(pd,{})]}),l.jsxs("main",{id:"content",children:[l.jsx("section",{className:"hero",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("span",{className:"pill",children:[l.jsx("span",{className:"dot"})," Zero dependencies · Node 18+ · MIT"]}),l.jsxs("h1",{children:["The web framework you can ",l.jsx("span",{className:"serif",children:"read in an afternoon"}),"."]}),l.jsxs("p",{className:"sub",children:["routiva gives you the Express ergonomics you already know — routing, middleware, body parsing, static files, CORS, compression and rate limiting — in about"," ",l.jsxs("strong",{children:[r.toLocaleString()," lines of dependency-free JavaScript"]})," built directly on ",l.jsx("code",{children:"node:http"}),"."]}),l.jsxs("div",{className:"hero-actions",children:[l.jsxs("span",{className:"install",children:[l.jsx("span",{className:"prompt",children:"$"}),l.jsx("span",{className:"cmd",children:"npm install routiva"}),l.jsx(ya,{text:"npm install routiva"})]}),l.jsxs(W,{className:"btn btn-primary",to:"/getting-started",children:["Read the docs",l.jsx(Wm,{})]}),l.jsxs("a",{className:"btn btn-ghost",href:Oe.repo,target:"_blank",rel:"noopener",children:[l.jsx(Vm,{}),"GitHub"]})]}),l.jsxs("div",{className:"hero-meta",children:[l.jsxs("span",{children:[l.jsx("b",{children:e})," latest on npm"]}),l.jsxs("span",{children:[l.jsx("b",{children:"0"})," runtime dependencies"]}),l.jsxs("span",{children:[l.jsx("b",{children:n})," tests, no test framework"]}),l.jsxs("span",{children:[l.jsx("b",{children:t})," source files"]})]})]})}),l.jsx("section",{className:"stats",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"stat",children:[l.jsxs("div",{className:"n",children:["0",l.jsx("small",{children:"deps"})]}),l.jsx("div",{className:"l",children:"Runtime dependencies"})]}),l.jsxs("div",{className:"stat",children:[l.jsx("div",{className:"n",children:s}),l.jsx("div",{className:"l",children:"Lines of source"})]}),l.jsxs("div",{className:"stat",children:[l.jsxs("div",{className:"n",children:[n,l.jsx("small",{children:"pass"})]}),l.jsx("div",{className:"l",children:"Test suite"})]}),l.jsxs("div",{className:"stat",children:[l.jsx("div",{className:"n",children:"3"}),l.jsx("div",{className:"l",children:"Body parsers + raw"})]})]})}),l.jsx("section",{className:"section",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"section-head",children:[l.jsx("div",{className:"eyebrow",children:"Batteries included"}),l.jsx("h2",{children:"Everything you reach for, without the graph of packages."}),l.jsx("p",{children:"Each of these ships in the core. In Express, most of them are a separate install."})]}),l.jsx("div",{className:"features",children:Gm.map(o=>l.jsxs("div",{className:"card",children:[l.jsx("div",{className:"ico",children:l.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:o.icon})}),l.jsx("h3",{children:o.title}),l.jsx("p",{children:o.body})]},o.title))})]})}),l.jsx("section",{className:"section",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"showcase",children:[l.jsxs("div",{className:"showcase-copy",children:[l.jsx("div",{className:"eyebrow",children:"Familiar API"}),l.jsx("h3",{children:"Looks like Express. Reads like a book."}),l.jsxs("p",{children:["If you know Express, you already know routiva. Import ",l.jsx("code",{children:"App"}),", register middleware and routes, and listen."]}),l.jsxs("ul",{children:[l.jsxs("li",{children:["Named ESM exports and ",l.jsx("code",{children:"App.*"})," statics"]}),l.jsxs("li",{children:[l.jsx("code",{children:"req.params"}),", ",l.jsx("code",{children:"req.query"}),", ",l.jsx("code",{children:"req.cookies"}),","," ",l.jsx("code",{children:"req.body"})]}),l.jsxs("li",{children:["Chainable ",l.jsx("code",{children:"res.status().type().json()"})]}),l.jsx("li",{children:"Async handlers that reject into your error middleware"})]})]}),l.jsx(Ol,{label:"server.js",lang:"js",code:zm})]}),l.jsxs("div",{className:"showcase rev",style:{marginTop:56},children:[l.jsx(Ol,{label:"app.js",lang:"js",code:Dm}),l.jsxs("div",{className:"showcase-copy",children:[l.jsx("div",{className:"eyebrow",children:"Stricter HTTP"}),l.jsx("h3",{children:"Correct by default, not by convention."}),l.jsx("p",{children:"routiva handles the awkward corners of HTTP that Express leaves to you."}),l.jsxs("ul",{children:[l.jsxs("li",{children:[l.jsx("code",{children:"405 Method Not Allowed"})," with a real ",l.jsx("code",{children:"Allow"})," header"]}),l.jsxs("li",{children:["Automatic ",l.jsx("code",{children:"OPTIONS"})," responses (",l.jsx("code",{children:"204"}),")"]}),l.jsxs("li",{children:[l.jsx("code",{children:"HEAD"})," reuses ",l.jsx("code",{children:"GET"})," routes with the body suppressed"]}),l.jsxs("li",{children:["Async ",l.jsx("code",{children:"throw"})," and rejected promises reach error middleware"]})]})]})]})]})}),l.jsx("section",{className:"section",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"section-head",children:[l.jsx("div",{className:"eyebrow",children:"Honest comparison"}),l.jsx("h2",{children:"routiva vs. Express"}),l.jsx("p",{children:"Not a rewrite of Express — a transparent, dependency-free core for when that is what you want."})]}),l.jsx("div",{className:"compare",children:l.jsxs("table",{children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Dimension"}),l.jsx("th",{className:"hl",children:"routiva"}),l.jsx("th",{children:"Express"})]})}),l.jsx("tbody",{children:Qm.map((o,a)=>l.jsxs("tr",{children:[l.jsx("td",{children:o[0]}),l.jsx("td",{children:o[1]}),l.jsx("td",{children:o[2]})]},a))})]})})]})}),l.jsx("section",{className:"section",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"section-head",children:[l.jsx("div",{className:"eyebrow",children:"Documentation"}),l.jsx("h2",{children:"Start where you are."}),l.jsx("p",{children:"Twenty-one pages covering the API, the internals and the tradeoffs."})]}),l.jsx("div",{className:"docs-map",children:Jm.map(o=>l.jsxs("div",{className:"map-card",children:[l.jsx("span",{className:"k",children:o.k}),l.jsx("h3",{children:l.jsx(W,{to:o.to,children:o.title})}),l.jsx("p",{children:o.body}),l.jsx("span",{className:"links",children:o.links.map(([a,i])=>l.jsx(W,{to:i,children:a},a))})]},o.title))})]})}),l.jsx("section",{className:"section",style:{paddingTop:0},children:l.jsx("div",{className:"wrap",children:l.jsxs("div",{className:"cta",children:[l.jsx("h2",{children:"Ship something small and understandable."}),l.jsx("p",{children:"Install routiva, read the core in an afternoon, and never wonder which of thirty packages broke your build."}),l.jsxs("div",{className:"hero-actions",children:[l.jsxs("span",{className:"install",children:[l.jsx("span",{className:"prompt",children:"$"}),l.jsx("span",{className:"cmd",children:"npm install routiva"}),l.jsx(ya,{text:"npm install routiva"})]}),l.jsx(W,{className:"btn btn-primary",to:"/quick-start",children:"Quick start"})]})]})})}),l.jsx("footer",{className:"footer",children:l.jsxs("div",{className:"wrap",children:[l.jsxs("div",{className:"cols",children:[l.jsxs("div",{className:"about",children:[l.jsxs(W,{className:"brand",to:"/",children:[l.jsx("span",{className:"mark",children:"r"}),l.jsx("span",{children:"routiva"})]}),l.jsxs("p",{children:["A lightweight, zero-dependency Express.js alternative for Node.js. Built on"," ",l.jsx("code",{children:"node:http"}),"."]})]}),l.jsxs("div",{children:[l.jsx("h4",{children:"Docs"}),l.jsxs("ul",{children:[l.jsx("li",{children:l.jsx(W,{to:"/getting-started",children:"Getting started"})}),l.jsx("li",{children:l.jsx(W,{to:"/routing",children:"Routing"})}),l.jsx("li",{children:l.jsx(W,{to:"/middleware",children:"Middleware"})}),l.jsx("li",{children:l.jsx(W,{to:"/api-reference",children:"API reference"})})]})]}),l.jsxs("div",{children:[l.jsx("h4",{children:"Guides"}),l.jsxs("ul",{children:[l.jsx("li",{children:l.jsx(W,{to:"/examples",children:"Examples"})}),l.jsx("li",{children:l.jsx(W,{to:"/testing",children:"Testing"})}),l.jsx("li",{children:l.jsx(W,{to:"/performance",children:"Performance"})}),l.jsx("li",{children:l.jsx(W,{to:"/express-comparison",children:"Coming from Express"})})]})]}),l.jsxs("div",{children:[l.jsx("h4",{children:"Project"}),l.jsxs("ul",{children:[l.jsx("li",{children:l.jsx("a",{href:Oe.repo,target:"_blank",rel:"noopener",children:"GitHub"})}),l.jsx("li",{children:l.jsx("a",{href:Oe.npm,target:"_blank",rel:"noopener",children:"npm"})}),l.jsx("li",{children:l.jsx("a",{href:`${Oe.repo}/issues`,target:"_blank",rel:"noopener",children:"Issues"})}),l.jsx("li",{children:l.jsx("a",{href:`${Oe.repo}/blob/main/LICENSE`,target:"_blank",rel:"noopener",children:"MIT License"})})]})]})]}),l.jsxs("div",{className:"base",children:[l.jsxs("span",{children:["MIT © ",new Date().getFullYear()," uditcoderrr"]}),l.jsx("span",{className:"built",children:"built with routiva · zero dependencies"})]})]})})]})]})}function Xm({open:e=!1}){return l.jsxs("aside",{className:e?"sidebar open":"sidebar",id:"sidebar",children:[ga.map(n=>{const t=lt.filter(r=>r.section===n);return t.length?l.jsxs("div",{className:"nav-section",children:[l.jsx("div",{className:"nav-label",children:n}),t.map(r=>l.jsx(Qf,{to:`/${r.slug}`,className:({isActive:s})=>s?"nav-link active":"nav-link",children:r.title},r.slug))]},n):null}),l.jsxs("div",{className:"sidebar-foot",children:[l.jsx("a",{href:Oe.repo,target:"_blank",rel:"noopener",children:"GitHub ↗"}),l.jsx("a",{href:Oe.npm,target:"_blank",rel:"noopener",children:"npm ↗"}),l.jsx("a",{href:`${Oe.repo}/blob/main/LICENSE`,target:"_blank",rel:"noopener",children:"MIT ↗"})]})]})}function md({children:e}){const[n,t]=k.useState(!1),{pathname:r}=Un();return k.useEffect(()=>{t(!1)},[r]),l.jsxs("div",{className:"page",children:[l.jsxs(hd,{menu:!0,onToggleMenu:()=>t(s=>!s),version:"docs",children:[l.jsx(W,{to:"/",children:"Home"}),l.jsx("a",{className:"hide-sm",href:Oe.repo,target:"_blank",rel:"noopener",children:"GitHub"}),l.jsx("a",{className:"hide-sm",href:Oe.npm,target:"_blank",rel:"noopener",children:"npm"}),l.jsx(pd,{})]}),l.jsx(Xm,{open:n}),l.jsx("div",{className:n?"scrim open":"scrim",onClick:()=>t(!1)}),l.jsx("main",{className:"main",id:"content",children:l.jsx("div",{className:"main-inner",children:e})})]})}function Ym({html:e,className:n="prose"}){const t=k.useRef(null),r=zs();return k.useEffect(()=>{const s=t.current;if(!s)return;const o=a=>{const i=a.target.closest("[data-copy]");if(i&&s.contains(i)){a.preventDefault();const g=i.closest(".codeblock"),d=g&&g.querySelector("pre code");fd((d?d.textContent:i.getAttribute("data-copy")||"").trim());const m=i.textContent;i.textContent="Copied",i.classList.add("copied"),setTimeout(()=>{i.textContent=m,i.classList.remove("copied")},1400);return}const u=a.target.closest("a");if(!u||!s.contains(u))return;const c=u.getAttribute("href");if(c){if(c.startsWith("#")){a.preventDefault();const g=decodeURIComponent(c.slice(1)),d=document.getElementById(g);d&&d.scrollIntoView({behavior:"smooth",block:"start"}),window.history.replaceState(null,"",`#${g}`);return}u.target!=="_blank"&&c.startsWith("/")&&(a.preventDefault(),r(c))}};return s.addEventListener("click",o),()=>s.removeEventListener("click",o)},[e,r]),l.jsx("div",{ref:t,className:n,dangerouslySetInnerHTML:{__html:e}})}function Zm({prev:e,next:n}){return l.jsxs("nav",{className:"pager",children:[e?l.jsxs(W,{to:`/${e.slug}`,children:[l.jsx("span",{className:"dir",children:"Previous"}),l.jsx("span",{className:"t",children:e.title})]}):l.jsx("span",{className:"spacer"}),n?l.jsxs(W,{className:"next",to:`/${n.slug}`,children:[l.jsx("span",{className:"dir",children:"Next"}),l.jsx("span",{className:"t",children:n.title})]}):l.jsx("span",{className:"spacer"})]})}function eg({headings:e}){const n=e.filter(s=>s.level===2||s.level===3),[t,r]=k.useState("");return k.useEffect(()=>{if(!n.length)return;const s=new Map;for(const a of n){const i=document.getElementById(a.id);i&&s.set(i,a.id)}if(!s.size)return;const o=new IntersectionObserver(a=>{const i=a.filter(u=>u.isIntersecting).sort((u,c)=>u.boundingClientRect.top-c.boundingClientRect.top);i[0]&&r(s.get(i[0].target))},{rootMargin:"-84px 0px -70% 0px",threshold:0});return s.forEach((a,i)=>o.observe(i)),()=>o.disconnect()},[e]),n.length?l.jsxs("aside",{className:"toc","aria-label":"On this page",children:[l.jsx("div",{className:"toc-label",children:"On this page"}),n.map(s=>l.jsx("a",{className:`${s.level===3?"h3":""}${t===s.id?" active":""}`.trim(),href:`#${s.id}`,children:s.text},s.id))]}):null}function gd(){return k.useEffect(()=>{document.title="Page not found · routiva docs"},[]),l.jsx(md,{children:l.jsxs("article",{className:"article",children:[l.jsxs("header",{className:"article-head",children:[l.jsx("div",{className:"eyebrow",children:"404"}),l.jsx("h1",{children:"Page not found"}),l.jsx("p",{className:"lede",children:"The page you were looking for does not exist."})]}),l.jsx("div",{className:"prose",children:l.jsxs("p",{children:["That page does not exist. Try the ",l.jsx(W,{to:"/",children:"home page"})," or"," ",l.jsx(W,{to:"/getting-started",children:"getting started"}),", or press ",l.jsx("code",{children:"⌘K"})," to search the docs."]})})]})})}function ng(){const{slug:e}=xf(),n=Am(e),t=Nm.get(n);if(k.useEffect(()=>{t&&(document.title=`${t.title} · routiva docs`),window.location.hash||window.scrollTo(0,0)},[n]),!t)return l.jsx(gd,{});const r=lt.indexOf(t),s=lt[r-1],o=lt[r+1];return l.jsxs(md,{children:[l.jsxs("article",{className:"article",children:[l.jsxs("header",{className:"article-head",children:[l.jsx("div",{className:"eyebrow",children:t.section}),l.jsx("h1",{children:t.title}),l.jsx("p",{className:"lede",children:t.description})]}),l.jsx(Ym,{html:t.html}),l.jsx(Zm,{prev:s,next:o})]}),l.jsx(eg,{headings:t.headings})]})}function tg(){return l.jsx(Pm,{children:l.jsxs(Lf,{children:[l.jsx(It,{path:"/",element:l.jsx(Km,{})}),l.jsx(It,{path:"/index.html",element:l.jsx(Mf,{to:"/",replace:!0})}),l.jsx(It,{path:"/:slug",element:l.jsx(ng,{})}),l.jsx(It,{path:"*",element:l.jsx(gd,{})})]})})}Qc(document.getElementById("root")).render(l.jsx(Wl.StrictMode,{children:l.jsx(Wf,{children:l.jsx(tg,{})})}));
