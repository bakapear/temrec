/* unzipit@1.4.0, license MIT */
'use strict'; (function (z, G) { 'object' === typeof exports && 'undefined' !== typeof module ? G(exports) : 'function' === typeof define && define.amd ? define(['exports'], G) : (z = 'undefined' !== typeof globalThis ? globalThis : z || self, G(z.unzipit = {})) })(this, function (z) { 
function G (a) { return a.arrayBuffer ? a.arrayBuffer() : new Promise((b, c) => { const e = new FileReader(); e.addEventListener('loadend', () => { b(e.result) }); e.addEventListener('error', c); e.readAsArrayBuffer(a) }) } async function na (a) { a = await G(a); return new Uint8Array(a) }
  function aa (a) { return 'undefined' !== typeof Blob && a instanceof Blob } function I (a) { return 'undefined' !== typeof SharedArrayBuffer && a instanceof SharedArrayBuffer } function R (a, b) { let c = a.length; if (b <= c) return a; b = new Uint8Array(Math.max(c << 1, b)); b.set(a, 0); return b } function oa (a, b, c, e, d, h) { for (let k = ba, f = ca, l = 0; l < c;) { let n = a[f(e, d) & b]; d += n & 15; let u = n >>> 4; if (u<=15)h[l] = u, l++; else { let x = n = 0; u==16 ? (x = 3 + k(e, d, 2), d += 2, n = h[l - 1]) : u==17 ? (x = 3 + k(e, d, 3), d += 3) : u==18 && (x = 11 + k(e, d, 7), d += 7); for (u = l + x; l < u;)h[l] = n, l++ } } return d }
  function da (a, b, c, e) { for (var d = 0, h = 0, k = e.length >>> 1; h < c;) { let f = a[h + b]; e[h << 1] = 0; e[(h << 1) + 1] = f; f > d && (d = f); h++ }for (;h < k;)e[h << 1] = 0, e[(h << 1) + 1] = 0, h++; return d } function J (a, b) { let c = a.length; var e; var  d; let h = g.bl_count; for (d = 0; d <= b; d++)h[d] = 0; for (d = 1; d < c; d += 2)h[a[d]]++; d = g.next_code; let k = 0; h[0] = 0; for (e = 1; e <= b; e++)k = k + h[e - 1] << 1, d[e] = k; for (b = 0; b < c; b += 2)h = a[b + 1], h!=0 && (a[b] = d[h], d[h]++) } function K (a, b, c) { 
for (let e = a.length, d = g.rev15, h = 0; h < e; h += 2){if(0!=a[h+1]){var k=a[h+1],f=h>>1<<4|k,l=b-k;k=a[h]<<l;for(l=k+
(1<<l);k!=l;)c[d[k]>>>15-b]=f,k++}} 
} function ea (a, b) { for (let c = g.rev15, e = 15 - b, d = 0; d < a.length; d += 2)a[d] = c[a[d] << b - a[d + 1]] >>> e } function ba (a, b, c) { return (a[b >>> 3] | a[(b >>> 3) + 1] << 8) >>> (b & 7) & (1 << c) - 1 } function pa (a, b, c) { return (a[b >>> 3] | a[(b >>> 3) + 1] << 8 | a[(b >>> 3) + 2] << 16) >>> (b & 7) & (1 << c) - 1 } function ca (a, b) { return (a[b >>> 3] | a[(b >>> 3) + 1] << 8 | a[(b >>> 3) + 2] << 16) >>> (b & 7) } function qa (a) { D.push(a.target); S(); const { id: b, error: c, data: e } = a.data; a = N.get(b); N.delete(b); c ? a.reject(c) : a.resolve(e) } function T (a) { 
return new Promise((b,
    c) => { const e = new Worker(a); e.onmessage = d => { 'start' === d.data ? (e.onerror = void 0, e.onmessage = void 0, b(e)) : c(Error(`unexpected message: ${d.data}`)) }; e.onerror = c }) 
} async function ra () { if (D.length===0 && U < y.numWorkers) { ++U; try { const a = await V.createWorker(y.workerURL); O.push(a); D.push(a); V.addEventListener(a, qa) }catch (a) { P = !1 } } return D.pop() } async function S () { 
if (B.length!==0) { 
if (y.useWorkers && P) { 
var a = await ra(); if (P) { 
if (a) { 
if (B.length===0) { D.push(a); S(); return } const {
 id: E, src: W, uncompressedSize: X, type: Y,
    resolve: L, reject: sa
 } = B.shift(); N.set(E, { id: E, resolve: L, reject: sa }); a.postMessage({ type: 'inflate', data: { id: E, type: Y, src: W, uncompressedSize: X } }, []) 
} return 
} 
}for (;B.length;) { 
const { src: E, uncompressedSize: W, type: X, resolve: Y } = B.shift(); a = E; aa(E) && (a = await na(E));  { let b = a; a = X; let c = Y; const L = new Uint8Array(W); var e = void 0; var d=void 0; var h; var k=L; var  f = Uint8Array; if (b[0]==3 && b[1]==0)k || new f(0); else { 
let l = pa; var n=ba; var u=oa; var x=ca; var  A = k==null; A && (k = new f(b.length >>> 2 << 3)); for (var C = 0, t = 0, r = h = 0, m = 0; C==0;) { 
C = l(b, m, 1); let q = l(b, m +
1, 2); m += 3; if (q==0)(m&7)!=0 && (m += 8 - (m & 7)), m = (m >>> 3) + 4, q = b[m - 4] | b[m - 3] << 8, A && (k = R(k, r + q)), k.set(new f(b.buffer, b.byteOffset + m, q), r), m = m + q << 3, r += q; else { 
A && (k = R(k, r + 131072)); q==1 && (d = g.flmap, e = g.fdmap, t = 511, h = 31); if (q==2) { 
q = n(b, m, 5) + 257; h = n(b, m + 5, 5) + 1; e = n(b, m + 10, 4) + 4; m += 14; for (d = 0; d<38; d += 2)g.itree[d] = 0, g.itree[d + 1] = 0; t = 1; for (d = 0; d < e; d++) { var p = n(b, m + 3 * d, 3); g.itree[(g.ordr[d] << 1) + 1] = p; p > t && (t = p) }m += 3 * e; J(g.itree, t); K(g.itree, t, g.imap); d = g.lmap; e = g.dmap; m = u(g.imap, (1 << t) - 1, q + h, b, m, g.ttree); p = da(g.ttree,
    0, q, g.ltree); t = (1 << p) - 1; q = da(g.ttree, q, h, g.dtree); h = (1 << q) - 1; J(g.ltree, p); K(g.ltree, p, d); J(g.dtree, q); K(g.dtree, q, e) 
}for (;;)if (q = d[x(b, m) & t], m += q & 15, p = q >>> 4, p>>>8==0)k[r++] = p; else if (p==256) break; else { q = r + p - 254; p>264 && (p = g.ldef[p - 257], q = r + (p >>> 3) + n(b, m, p & 7), m += p & 7); p = e[x(b, m) & h]; m += p & 15; p = g.ddef[p >>> 4]; let Q = (p >>> 4) + l(b, m, p & 15); m += p & 15; for (A && (k = R(k, r + 131072)); r < q;)k[r] = k[r++ - Q], k[r] = k[r++ - Q], k[r] = k[r++ - Q], k[r] = k[r++ - Q]; r = q } 
} 
}k.length == r || k.slice(0, r) 
}c(a ? new Blob([L], { type: a }) : L.buffer) } 
} 
} 
} function fa (a,
    b, c) { return new Promise((e, d) => { B.push({ src: a, uncompressedSize: b, type: c, resolve: e, reject: d, id: ta++ }); S() }) } async function ua () { for (const a of O) await V.terminate(a); O.splice(0, O.length); D.splice(0, D.length); B.splice(0, B.length); N.clear(); U = 0; P = !0 } async function H (a, b, c) { return await a.read(b, c) } async function Z (a, b, c, e) { return a.sliceAsBlob ? await a.sliceAsBlob(b, c, e) : await a.read(b, c) } function v (a, b) { return a[b] + 256 * a[b + 1] } function w (a, b) { return a[b] + 256 * a[b + 1] + 65536 * a[b + 2] + 16777216 * a[b + 3] } function F (a,
    b) { return w(a, b) + 4294967296 * w(a, b + 4) } function M (a, b) { I(a.buffer) && (a = new Uint8Array(a)); return va.decode(a) } async function wa (a, b) { 
let c = Math.min(65557, b); b -= c; let e = await H(a, b, c); for (c -= 22; c>=0; --c) { 
if (w(e,c)!==101010256) continue; let d = new Uint8Array(e.buffer, e.byteOffset + c, e.byteLength - c); e = v(d, 4); if (e!==0) throw Error(`multi-volume zip files are not supported. This is volume: ${e}`); e = v(d, 10); const k = w(d, 12); const  f = w(d, 16); let h = v(d, 20); const l = d.length - 22; if (h !== l) throw Error(`invalid comment length. expected: ${l}, actual: ${h}`)
d = new Uint8Array(d.buffer, d.byteOffset + 22, h); h = M(d); return e===65535 || f===4294967295 ? await xa(a, b + c, h, d) : await ha(a, f, k, e, h, d) 
} throw Error('could not find end of central directory. maybe not zip file')} async function xa (a, b, c, e) { 
b = await H(a, b - 20, 20); if (w(b,0)!==117853008) throw Error('invalid zip64 end of central directory locator signature'); b = F(b, 8); let d = await H(a, b, 56); if (w(d,0)!==101075792) throw Error('invalid zip64 end of central directory record signature'); b = F(d, 32); const h = F(d, 40); d = F(d,
    48); return ha(a, d, h, b, c, e) 
} async function ha (a, b, c, e, d, h) { 
let k = 0; b = await H(a, b, c); c = []; for (let A = 0; A < e; ++A) { 
let f = b.subarray(k, k + 46); var  l = w(f, 0); if (l!==33639248) throw Error(`invalid central directory file header signature: 0x${l.toString(16)}`); f = {
 versionMadeBy: v(f, 4), 
versionNeededToExtract: v(f, 6), 
generalPurposeBitFlag: v(f, 8), 
compressionMethod: v(f, 10), 
lastModFileTime: v(f, 12), 
lastModFileDate: v(f, 14), 
crc32: w(f, 16), 
compressedSize: w(f, 20), 
uncompressedSize: w(f, 24), 
fileNameLength: v(f, 28), 
extraFieldLength: v(f,
    30), 
fileCommentLength: v(f, 32), 
internalFileAttributes: v(f, 36), 
externalFileAttributes: w(f, 38), 
relativeOffsetOfLocalHeader: w(f, 42)
 }; if (f.generalPurposeBitFlag & 64) throw Error('strong encryption is not supported'); k += 46; l = b.subarray(k, k + f.fileNameLength + f.extraFieldLength + f.fileCommentLength); f.nameBytes = l.slice(0, f.fileNameLength); f.name = M(f.nameBytes); let n = f.fileNameLength + f.extraFieldLength; const C = l.slice(f.fileNameLength, n); f.extraFields = []; for (let u = 0; u < C.length - 3;) { 
const t = v(C, u + 0); let x = v(C, u +
2); u += 4; x = u + x; if (x > C.length) throw Error('extra field length exceeds extra field buffer size'); f.extraFields.push({ id: t, data: C.slice(u, x) }); u = x 
}f.commentBytes = l.slice(n, n + f.fileCommentLength); f.comment = M(f.commentBytes); k += l.length; if (f.uncompressedSize===4294967295 || f.compressedSize===4294967295 || f.relativeOffsetOfLocalHeader===4294967295) { 
l = f.extraFields.find(t => t.id===1); if (!l) throw Error('expected zip64 extended information extra field'); l = l.data; n = 0; if (f.uncompressedSize===4294967295) { 
if (n + 8 >
l.length) throw Error('zip64 extended information extra field does not include uncompressed size'); f.uncompressedSize = F(l, n); n += 8 
}if (f.compressedSize===4294967295) { if (n + 8 > l.length) throw Error('zip64 extended information extra field does not include compressed size'); f.compressedSize = F(l, n); n += 8 }if (f.relativeOffsetOfLocalHeader===4294967295) { if (n + 8 > l.length) throw Error('zip64 extended information extra field does not include relative header offset'); f.relativeOffsetOfLocalHeader = F(l, n); n += 8 } 
}if (l = f.extraFields.find(t =>
    t.id===28789 && t.data.length>=6 && t.data[0]===1 && w(t.data, 1), ya.unsigned(f.nameBytes)))f.fileName = M(l.data.slice(5)); if (f.compressionMethod===0 && (l = f.uncompressedSize, (f.generalPurposeBitFlag&1)!==0 && (l += 12), f.compressedSize !== l)) throw Error(`compressed size mismatch for stored file: ${f.compressedSize} != ${l}`); c.push(f) 
}return { zip: { comment: d, commentBytes: h }, entries: c.map(A => new za(a, A)) } 
} async function ia (a, b) { 
if (b.generalPurposeBitFlag & 1) throw Error('encrypted entries not supported'); let c = await H(a,
    b.relativeOffsetOfLocalHeader, 30); a = await a.getLength(); let e = w(c, 0); if (e!==67324752) throw Error(`invalid local file header signature: 0x${e.toString(16)}`); e = v(c, 26); let d = v(c, 28); c = b.relativeOffsetOfLocalHeader + c.length + e + d; if (b.compressionMethod===0)e = !1; else if (b.compressionMethod===8)e = !0; else throw Error(`unsupported compression method: ${b.compressionMethod}`); d = c + b.compressedSize; if (b.compressedSize!==0 && d > a) throw Error(`file data overflows file bounds: ${c} +  ${b.compressedSize}  > ${a}`)
return { decompress: e, fileDataStart: c } 
} async function Aa (a, b) { const { decompress: c, fileDataStart: e } = await ia(a, b); if (!c) return b = await H(a, e, b.compressedSize), b.byteOffset===0 && b.byteLength === b.buffer.byteLength ? b.buffer : b.slice().buffer; a = await Z(a, e, b.compressedSize); return await fa(a, b.uncompressedSize) } async function Ba (a, b, c) { 
const { decompress: e, fileDataStart: d } = await ia(a, b); if (!e) return b = await Z(a, d, b.compressedSize, c), aa(b) ? b : new Blob([I(b.buffer) ? new Uint8Array(b) : b], { type: c }); a = await Z(a,
    d, b.compressedSize); return await fa(a, b.uncompressedSize, c) 
} async function ja (a) { 
if ('undefined' !== typeof Blob && a instanceof Blob)a = new ka(a); else if (a instanceof ArrayBuffer || a && a.buffer && a.buffer instanceof ArrayBuffer)a = new la(a); else if (I(a) || I(a.buffer))a = new la(a); else if ('string' === typeof a) { var b = await fetch(a); if (!b.ok) throw Error(`failed http request ${a}, status: ${b.status}: ${b.statusText}`); a = await b.blob(); a = new ka(a) } else if ('function' !== typeof a.getLength || 'function' !== typeof a.read) throw Error('unsupported source type')
b = await a.getLength(); if (b > Number.MAX_SAFE_INTEGER) throw Error(`file too large. size: ${b}. Only file sizes up 4503599627370496 bytes are supported`); return await wa(a, b) 
} const Ca = 'undefined' !== typeof process && process.versions && 'undefined' !== typeof process.versions.node && 'undefined' === typeof process.versions.electron; class la {
constructor (a) { this.typedArray = a instanceof ArrayBuffer || I(a) ? new Uint8Array(a) : new Uint8Array(a.buffer, a.byteOffset, a.byteLength) } async getLength () { return this.typedArray.byteLength } async read (a,
    b) { return new Uint8Array(this.typedArray.buffer, this.typedArray.byteOffset + a, b) }
} class ka {constructor (a) { this.blob = a } async getLength () { return this.blob.size } async read (a, b) { a = this.blob.slice(a, a + b); a = await G(a); return new Uint8Array(a) } async sliceAsBlob (a, b, c = '') { return this.blob.slice(a, a + b, c) }} class Da {
constructor (a) { this.url = a } async getLength () { 
if (void 0 === this.length) { 
const a = await fetch(this.url, { method: 'HEAD' }); if (!a.ok) throw Error(`failed http request ${this.url}, status: ${a.status}: ${a.statusText}`)
this.length = parseInt(a.headers.get('content-length')); if (Number.isNaN(this.length)) throw Error('could not get length')} return this.length 
}
 async read (a, b) { if (b===0) return new Uint8Array(0); const c = await fetch(this.url, { headers: { Range: `bytes=${a}-${a + b - 1}` } }); if (!c.ok) throw Error(`failed http request ${this.url}, status: ${c.status} offset: ${a} size: ${b}: ${c.statusText}`); a = await c.arrayBuffer(); return new Uint8Array(a) }
} const g = (function(){var a=Uint16Array,b=Uint32Array;return{next_code:new a(16),
bl_count:new a(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new a(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new b(32),flmap:new a(512),
fltree:[],fdmap:new a(32),fdtree:[],lmap:new a(32768),ltree:[],ttree:[],dmap:new a(32768),dtree:[],imap:new a(512),itree:[],rev15:new a(32768),lhst:new b(286),dhst:new b(30),ihst:new b(19),lits:new b(15E3),strt:new a(65536),prev:new a(32768)}}()); (function () { 
function a (e, d, h) { for (;d--!=0;)e.push(0, h) }for (var b = 0; b<32768; b++) { 
let c = b; c = (c & 2863311530) >>> 1 | (c & 1431655765) << 1; c = (c & 3435973836) >>> 2 | (c & 858993459) << 2; c = (c & 4042322160) >>> 4 | (c & 252645135) << 4; c = (c & 4278255360) >>> 8 | (c & 16711935) << 8; g.rev15[b] = (c >>>
16 | c << 16) >>> 17 
}for (b = 0; b<32; b++)g.ldef[b] = g.of0[b] << 3 | g.exb[b], g.ddef[b] = g.df0[b] << 4 | g.dxb[b]; a(g.fltree, 144, 8); a(g.fltree, 112, 9); a(g.fltree, 24, 7); a(g.fltree, 8, 8); J(g.fltree, 9); K(g.fltree, 9, g.flmap); ea(g.fltree, 9); a(g.fdtree, 32, 5); J(g.fdtree, 5); K(g.fdtree, 5, g.fdmap); ea(g.fdtree, 5); a(g.itree, 19, 0); a(g.ltree, 286, 0); a(g.dtree, 30, 0); a(g.ttree, 320, 0) 
})(); const ma = {
 table: (function(){for(var a=new Uint32Array(256),b=0;256>b;b++){for(var c=b,e=0;8>e;e++)c=c&1?3988292384^c>>>1:c>>>1;a[b]=c}return a}()), 
update: function (a,
      b, c, e) { for (let d = 0; d < e; d++)a = ma.table[(a ^ b[c + d]) & 255] ^ a >>> 8; return a }, 
crc: function (a, b, c) { return ma.update(4294967295, a, b, c) ^ 4294967295 }
 }; const  y = { numWorkers: 1, workerURL: '', useWorkers: !1 }; let ta = 0; let U=0; let  P = !0; const O = []; const D=[]; const B=[]; const N=new Map; const  V = (function(){if(Ca){const {Worker:a}=module.require("worker_threads");return{async createWorker(b){return new a(b)},addEventListener(b,c){b.on("message",e=>{c({target:b,data:e})})},async terminate(b){await b.terminate()}}}return{async createWorker(a){try{return await T(a)}catch(c){console.warn("could not load worker:",
a)}let b;try{const c=await fetch(a,{mode:"cors"});if(!c.ok)throw Error(`could not load: ${a}`);b=await c.text();a=URL.createObjectURL(new Blob([b],{type:"application/javascript"}));const e=await T(a);y.workerURL=a;return e}catch(c){console.warn("could not load worker via fetch:",a)}if(void 0!==b)try{a=`data:application/javascript;base64,${btoa(b)}`;const c=await T(a);y.workerURL=a;return c}catch(c){console.warn("could not load worker via dataURI")}console.warn("workers will not be used");throw Error("can not start workers");
},addEventListener(a,b){a.addEventListener("message",b)},async terminate(a){a.terminate()}}}()); class za {
constructor (a, b) { 
this._reader = a; this._rawEntry = b; this.name = b.name; this.nameBytes = b.nameBytes; this.size = b.uncompressedSize; this.compressedSize = b.compressedSize; this.comment = b.comment; this.commentBytes = b.commentBytes; this.compressionMethod = b.compressionMethod; a = b.lastModFileDate; let c = b.lastModFileTime; this.lastModDate = new Date((a >> 9 & 127) + 1980, (a >> 5 & 15) - 1, a & 31, c >> 11 & 31, c >> 5 & 63, 2 * (c & 31), 0); this.isDirectory =
b.uncompressedSize===0 && b.name.endsWith('/'); this.encrypted = !!(b.generalPurposeBitFlag & 1); this.externalFileAttributes = b.externalFileAttributes; this.versionMadeBy = b.versionMadeBy 
}
 async blob (a = 'application/octet-stream') { return await Ba(this._reader, this._rawEntry, a) } async arrayBuffer () { return await Aa(this._reader, this._rawEntry) } async text () { const a = await this.arrayBuffer(); return M(new Uint8Array(a)) } async json () { const a = await this.text(); return JSON.parse(a) }
} const ya = { unsigned () { return 0 } }; const  va =
new TextDecoder(); z.HTTPRangeReader = Da; z.cleanup = function () { ua() }; z.setOptions = function (a) { y.workerURL = a.workerURL || y.workerURL; a.workerURL && (y.useWorkers = !0); y.useWorkers = void 0 !== a.useWorkers ? a.useWorkers : y.useWorkers; y.numWorkers = a.numWorkers || y.numWorkers }; z.unzip = async function (a) { const { zip: b, entries: c } = await ja(a); return { zip: b, entries: Object.fromEntries(c.map(e => [e.name, e])) } }; z.unzipRaw = ja; Object.defineProperty(z, '__esModule', { value: !0 }) 
})
