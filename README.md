# Pom Optometry Academy V6 — Complete Practice Edition

แอปเตรียมสอบทัศนมาตรศาสตร์สำหรับปอม ใช้ Vercel สำหรับ deploy และ IndexedDB ในเบราว์เซอร์สำหรับเก็บข้อมูล ไม่ใช้ Supabase และไม่ต้องตั้งค่า API key

## คลังข้อสอบฝึก
มีข้อสอบฝึกสร้างใหม่ 130 ข้อ ครอบคลุม 13 หมวดวิชา โดยแต่ละข้อมีโจทย์ภาษาไทยและอังกฤษ ตัวเลือก เฉลย และคำอธิบายสองภาษา:
1. Geometric Optics
2. Clinical Refraction
3. Binocular Vision & Orthoptics
4. Ocular Anatomy & Physiology
5. Ocular Disease & Red Eye
6. Contact Lens
7. Paediatric Optometry & Myopia
8. Low Vision & Visual Rehabilitation
9. Ocular Pharmacology
10. Visual Perception & Neuro-Optometry
11. Dispensing Optics & Ophthalmic Lenses
12. Clinical Procedures & Instrumentation
13. Professional Practice, Ethics & Patient Safety

## ฟังก์ชัน
- Dashboard สรุปคลังข้อสอบ ความคืบหน้า และกิจกรรมล่าสุด
- Question Bank แยกตามหมวดวิชา พร้อมโจทย์สองภาษา
- Quiz สุ่มชุด 20 ข้อ หรือเลือกฝึกทีละข้อ พร้อมเฉลย
- Learning Progress แยกผลตามหมวดวิชา
- Study Log บันทึกเวลาอ่านหนังสือ
- Study Plan 4 ช่วงจนถึงกรกฎาคม 2570
- IndexedDB เก็บ questions, attempts, sessions, settings และ internal backup snapshot
- Export/Import JSON พร้อมตรวจสอบ schema version และเลือก merge/replace
- ประมาณการพื้นที่ด้วย Storage Estimate API และขอ persistent storage ได้เมื่อเบราว์เซอร์รองรับ
- Service worker สำหรับ cache app shell เพื่อให้เปิดแอปได้เมื่อเคยโหลดออนไลน์สำเร็จแล้ว

## เริ่มใช้งานในเครื่อง
ต้องติดตั้ง Node.js รุ่น LTS ก่อน

```bash
npm install
npm run dev
```

## Deploy บน Vercel
1. แตก ZIP แล้วนำโฟลเดอร์ขึ้น GitHub
2. เข้า Vercel แล้วเลือก Add New Project และ Import repository
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy ได้เลย ไม่ต้องใส่ Environment Variables

## โครงสร้างสำคัญ
- `src/db.js` — storage adapter แยกจาก UI; เพิ่ม Supabase ภายหลังได้โดยสร้าง adapter ใหม่
- `src/main.js` — UI และ application logic
- `src/questions.js` — คลังข้อสอบฝึก 130 ข้อ
- `public/sw.js` — service worker
- `vercel.json` — SPA rewrite

## ข้อมูลและความเป็นส่วนตัว
- ข้อมูลเก็บใน IndexedDB ของ browser/device นี้ ไม่มี cloud sync และไม่มี login
- IndexedDB quota ขึ้นกับ browser, device, disk space และนโยบายของ browser ไม่ได้รับประกัน 50 MB
- Internal snapshot อยู่ใน browser เดียวกัน ไม่ใช่ cloud backup
- ดาวน์โหลด JSON backup ไปเก็บภายนอกเป็นระยะ
- Offline ใช้ได้หลังโหลดหน้าและ assets สำเร็จแล้ว; การอัปเดตแอปต้องใช้อินเทอร์เน็ต

## ข้อจำกัดด้านแหล่งข้อสอบ
ข้อสอบ 130 ข้อเป็นข้อสอบฝึกที่สร้างขึ้นใหม่ ไม่ใช่ข้อสอบจริงหรือข้อสอบย้อนหลังที่รับรองแหล่งที่มา ไม่สามารถรับประกันว่าจะครอบคลุมทุกข้อที่ออกสอบจริง ควรตรวจทานเฉลยกับตำรามาตรฐานและอาจารย์ผู้สอน โดยเฉพาะเนื้อหาการวินิจฉัย การใช้ยา และแนวทางส่งต่อผู้ป่วย
