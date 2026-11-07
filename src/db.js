// Storage adapter: UI calls this layer, not IndexedDB directly.
// A future Supabase adapter can implement the same methods without rewriting the UI.
const DB_NAME = "pom-optometry-academy";
const DB_VERSION = 1;
const STORES = ["questions", "attempts", "sessions", "settings", "backups"];

let dbPromise;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("เบราว์เซอร์นี้ไม่รองรับ IndexedDB"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          const options = store === "questions" ? { keyPath: "id" } : { keyPath: "id", autoIncrement: store !== "settings" };
          db.createObjectStore(store, options);
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("เปิดฐานข้อมูลไม่สำเร็จ"));
    request.onblocked = () => reject(new Error("ฐานข้อมูลถูกเปิดค้างในแท็บอื่น กรุณาปิดแท็บแอปที่ซ้ำกันแล้วลองใหม่"));
  });
  return dbPromise;
}

async function request(storeName, mode, action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let req;
    try { req = action(store); } catch (e) { reject(e); return; }
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("อ่านหรือบันทึกข้อมูลไม่สำเร็จ"));
    tx.onerror = () => reject(tx.error || new Error("เกิดข้อผิดพลาดในการบันทึก"));
  });
}

export const storage = {
  async getAll(store) { return request(store, "readonly", s => s.getAll()); },
  async get(store, key) { return request(store, "readonly", s => s.get(key)); },
  async put(store, value) { return request(store, "readwrite", s => s.put(value)); },
  async add(store, value) { return request(store, "readwrite", s => s.add(value)); },
  async remove(store, key) { return request(store, "readwrite", s => s.delete(key)); },
  async clear(store) { return request(store, "readwrite", s => s.clear()); },
  async count(store) { return request(store, "readonly", s => s.count()); },
  async replaceAll(store, items) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const objectStore = tx.objectStore(store);
      objectStore.clear();
      for (const item of items) objectStore.put(item);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("นำเข้าข้อมูลไม่สำเร็จ"));
      tx.onabort = () => reject(tx.error || new Error("ยกเลิกการนำเข้าข้อมูล"));
    });
  },
  async exportAll() {
    const result = {};
    for (const store of STORES) result[store] = await this.getAll(store);
    return result;
  },
  async importAll(payload, mode = "merge") {
    const db = await openDB();
    const tx = db.transaction(STORES, "readwrite");
    for (const name of STORES) {
      const store = tx.objectStore(name);
      const incoming = Array.isArray(payload[name]) ? payload[name] : [];
      if (mode === "replace") store.clear();
      for (const item of incoming) store.put(item);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("นำเข้าข้อมูลไม่สำเร็จ"));
      tx.onabort = () => reject(tx.error || new Error("ยกเลิกการนำเข้าข้อมูล"));
    });
  },
  async snapshot() {
    const data = await this.exportAll();
    await this.put("backups", { id: "latest", createdAt: new Date().toISOString(), data });
  }
};

export const STORE_NAMES = STORES;
