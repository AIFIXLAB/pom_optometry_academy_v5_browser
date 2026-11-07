# Pom Optometry Academy V5 — Browser Edition

แอปเตรียมสอบทัศนมาตรศาสตร์สำหรับผู้เรียนคนเดียว (Pom) ใช้ Vercel สำหรับ deploy และ IndexedDB ในเบราว์เซอร์สำหรับเก็บข้อมูล โดยเวอร์ชันนี้ **ไม่ใช้ Supabase และไม่ต้องตั้งค่า API key**

## สิ่งที่มีในเวอร์ชันนี้
- Dashboard สรุปคลังข้อสอบ ความคืบหน้า และกิจกรรมล่าสุด
- Question Bank แยกตามหมวดวิชา พร้อมโจทย์สองภาษา ไทย/อังกฤษ
- Quiz แบบสุ่มชุด 10 ข้อ หรือเลือกฝึกทีละข้อ พร้อมเฉลย
- Learning Progress แยกผลตามหมวดวิชา
- Study Log บันทึกเวลาอ่านหนังสือ
- Study Plan 4 ช่วงจนถึงกรกฎาคม 2570
- IndexedDB สำหรับ questions, attempts, sessions, settings และ internal backup snapshot
- Export/Import JSON พร้อมตรวจสอบ schema version และเลือก merge/replace
- ประมาณการพื้นที่ด้วย Storage Estimate API และขอ persistent storage ได้เมื่อเบราว์เซอร์รองรับ
- Service worker สำหรับ cache app shell เพื่อให้เปิดแอปได้เมื่อเคยโหลดออนไลน์สำเร็จแล้ว

## เริ่มใช้งานในเครื่อง
ต้องติดตั้ง Node.js รุ่น LTS ก่อน

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal

## Deploy บน Vercel
1. แตก ZIP แล้วนำโฟลเดอร์โปรเจกต์ขึ้น GitHub
2. เข้า Vercel แล้วเลือก Add New Project และ Import repository
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy ได้เลย ไม่ต้องใส่ Environment Variables

## โครงสร้างสำคัญ
- `src/db.js` — storage adapter ที่แยกจาก UI; หากเพิ่ม Supabase ภายหลังให้สร้าง adapter ใหม่โดยรักษา interface นี้
- `src/main.js` — UI และ application logic
- `src/questions.js` — starter question bank
- `public/sw.js` — service worker
- `vercel.json` — SPA rewrite

## ข้อมูลและความเป็นส่วนตัว
- ข้อมูลข้อสอบที่เพิ่ม ประวัติทำข้อสอบ และเวลาอ่าน ถูกเก็บใน IndexedDB ของ browser/device นี้
- ไม่มี cloud sync, ไม่มี login และไม่มีการส่งข้อมูลไป Supabase
- IndexedDB quota ขึ้นกับ browser, device, disk space และนโยบายของ browser ไม่ควรถือว่าได้ 50 MB แน่นอน
- การขอ persistent storage เป็น best-effort; browser อาจปฏิเสธได้
- Internal snapshot อยู่ใน browser เดียวกัน จึงไม่ใช่ backup ภายนอก
- ดาวน์โหลด JSON backup ไปเก็บภายนอกเป็นระยะ โดยเฉพาะก่อนล้างข้อมูล browser หรือเปลี่ยนอุปกรณ์
- หากเปิดผ่าน HTTPS บน Vercel จะรองรับ service worker; offline ใช้ได้หลังจากโหลดหน้าและ assets สำเร็จแล้ว แต่การอัปเดตแอปยังต้องเชื่อมต่ออินเทอร์เน็ต

## หมายเหตุเรื่องเนื้อหาวิชาการ
ข้อสอบเริ่มต้น 15 ข้อเป็น starter questions ที่สร้างเพื่อทบทวนหลักการ ไม่ใช่ข้อสอบจริงหรือข้อสอบย้อนหลังที่ยืนยันแหล่งที่มา เฉลยบางข้ออาจต้องทบทวนเพิ่มเติมกับตำรา/อาจารย์ก่อนใช้เป็นแนวทางสอบจริง ควรเพิ่มคลังข้อสอบโดยอ้างอิงตำรามาตรฐานและแนวทางวิชาชีพที่เป็นปัจจุบัน

## เตรียมต่อยอด Supabase ในอนาคต
UI เรียกใช้เมธอดผ่าน `src/db.js` (`getAll`, `get`, `put`, `add`, `remove`, `clear`, `count`, `replaceAll`, `exportAll`, `importAll`, `snapshot`) ไม่ผูกกับ IndexedDB โดยตรงในหน้าจอ จึงสามารถสร้าง `supabaseAdapter.js` ที่ implement เมธอดเดียวกัน แล้วสลับ adapter ในจุด bootstrap ได้ โดยไม่ต้องเขียน UI ใหม่ทั้งหมด
