// Starter questions for practice. These are educational draft items, not official past-paper questions.
export const starterQuestions = [
  {
    id: "q001", topic: "Optics", subtopic: "Geometric Optics", difficulty: "พื้นฐาน",
    question: "A lens has a power of +2.00 D. What is its focal length in metres? / เลนส์กำลัง +2.00 D มีความยาวโฟกัสเท่าใด",
    options: ["+0.50 m", "+2.00 m", "-0.50 m", "-2.00 m"],
    answer: 0,
    explanation: "Focal length f = 1/F. Therefore f = 1/2.00 = +0.50 m. / ความยาวโฟกัส f = 1/F ดังนั้น f = +0.50 เมตร",
    reference: "หลักการพื้นฐานทางทัศนศาสตร์"
  },
  {
    id: "q002", topic: "Optics", subtopic: "Spherical Lenses", difficulty: "พื้นฐาน",
    question: "Which lens is used to correct myopia? / เลนส์ชนิดใดใช้แก้ไขภาวะสายตาสั้น",
    options: ["Plus (convex) lens", "Minus (concave) lens", "Cylindrical plus lens only", "Prism only"],
    answer: 1,
    explanation: "A minus/diverging lens moves the focal point back onto the retina in myopia. / เลนส์ลบช่วยกระจายแสงเพื่อเลื่อนจุดโฟกัสกลับไปตกบนจอประสาทตา",
    reference: "หลักการแก้ไขความผิดปกติของสายตา"
  },
  {
    id: "q003", topic: "Refraction", subtopic: "Retinoscopy", difficulty: "กลาง",
    question: "During static retinoscopy, a 'with' motion is neutralized using which lens direction? / การตรวจ static retinoscopy พบ with motion โดยทั่วไปต้องเติมเลนส์ทิศทางใดเพื่อ neutralize",
    options: ["Plus", "Minus", "Prism base-in", "No lens is required"],
    answer: 1,
    explanation: "With motion is neutralized by adding minus power (or reducing plus) until neutrality. Working-distance compensation is then applied. / เติมกำลังลบหรือ ลดกำลังบวกจนเป็น neutral และชดเชย working distance",
    reference: "หลักการ retinoscopy; ต้องพิจารณา working distance"
  },
  {
    id: "q004", topic: "Binocular Vision", subtopic: "Cover Test", difficulty: "กลาง",
    question: "An eye moves outward when uncovered after being covered. This is most consistent with: / เมื่อเปิดตาที่ถูกปิดไว้แล้วพบว่าตาเคลื่อนออกด้านนอก สอดคล้องกับภาวะใดมากที่สุด",
    options: ["Exophoria", "Esophoria", "Hypertropia", "Orthophoria"],
    answer: 1,
    explanation: "An outward recovery movement indicates the eye had been deviated inward under dissociation, consistent with esophoria? Review the direction carefully: an eye moving outward to regain fixation indicates an eso deviation. / หากตาเคลื่อนออกเพื่อกลับมาจับเป้า แสดงว่าก่อนหน้านั้นเบนเข้า จึงสอดคล้องกับ esophoria",
    reference: "Cover test interpretation"
  },
  {
    id: "q005", topic: "Ocular Disease", subtopic: "Red Eye", difficulty: "กลาง",
    question: "Which finding is a red flag requiring urgent ophthalmic assessment? / อาการใดเป็นสัญญาณอันตรายที่ควรส่งประเมินจักษุแพทย์อย่างเร่งด่วน",
    options: ["Mild itching in both eyes", "Severe ocular pain with reduced vision", "Occasional tearing in wind", "Mild bilateral dryness after screen use"],
    answer: 1,
    explanation: "Severe pain with reduced vision may indicate sight-threatening disease such as acute angle-closure glaucoma, keratitis, or uveitis. / ปวดตามากร่วมกับตามัวอาจเป็นโรคที่คุกคามการมองเห็น ต้องส่งต่อเร่งด่วน",
    reference: "Clinical red flags; differential diagnosis required"
  },
  {
    id: "q006", topic: "Contact Lens", subtopic: "Fitting", difficulty: "กลาง",
    question: "A contact lens with excessive movement on blink is most likely: / คอนแทคเลนส์เคลื่อนมากเกินไปขณะกะพริบตา มักบ่งชี้อะไร",
    options: ["Tight fit", "Loose fit", "Perfect fit in all cases", "Corneal edema by itself"],
    answer: 1,
    explanation: "Excessive movement can indicate a loose fit, although assessment must include centration, coverage, comfort, and ocular surface findings. / การเคลื่อนมากอาจบ่งชี้ว่าเลนส์หลวม ต้องประเมินร่วมกับ centration, coverage และสภาพผิวตา",
    reference: "Contact lens fitting principles"
  },
  {
    id: "q007", topic: "Clinical Optometry", subtopic: "Visual Acuity", difficulty: "พื้นฐาน",
    question: "A Snellen acuity of 6/12 means the patient sees at 6 metres what a standard observer can see at: / VA 6/12 หมายถึงผู้ป่วยเห็นที่ระยะ 6 เมตร เทียบเท่าคนปกติเห็นที่ระยะเท่าใด",
    options: ["3 m", "6 m", "12 m", "24 m"],
    answer: 2,
    explanation: "The numerator is the testing distance and denominator is the distance at which the smallest line would normally be resolved. / ตัวเศษคือระยะตรวจ ตัวส่วนคือระยะที่คนสายตามาตรฐานอ่านบรรทัดนั้นได้",
    reference: "Visual acuity notation"
  },
  {
    id: "q008", topic: "Optics", subtopic: "Astigmatism", difficulty: "กลาง",
    question: "What is the spherical equivalent of -2.00 / -1.00 × 180? / Spherical equivalent ของ -2.00 / -1.00 × 180 คือเท่าใด",
    options: ["-1.50 D", "-2.00 D", "-2.50 D", "-3.00 D"],
    answer: 2,
    explanation: "SE = sphere + (cylinder/2) = -2.00 + (-1.00/2) = -2.50 D. / SE = sphere + cylinder/2",
    reference: "Spherical equivalent calculation"
  },
  {
    id: "q009", topic: "Binocular Vision", subtopic: "Prism", difficulty: "กลาง",
    question: "Prism dioptre is defined as a deviation of how many centimetres at 1 metre? / 1 prism dioptre ทำให้ลำแสงเบี่ยงเบนกี่เซนติเมตรที่ระยะ 1 เมตร",
    options: ["1 cm", "5 cm", "10 cm", "100 cm"],
    answer: 0,
    explanation: "One prism dioptre (1Δ) produces 1 cm displacement at 1 m. / 1Δ ทำให้เกิดการเบี่ยงเบน 1 เซนติเมตรที่ระยะ 1 เมตร",
    reference: "Prism dioptre definition"
  },
  {
    id: "q010", topic: "Ocular Disease", subtopic: "Glaucoma", difficulty: "กลาง",
    question: "Which structure is primarily assessed when evaluating glaucomatous optic neuropathy? / โครงสร้างใดเป็นหลักในการประเมิน glaucomatous optic neuropathy",
    options: ["Optic nerve head", "Lacrimal gland", "Meibomian gland", "Conjunctival fornix"],
    answer: 0,
    explanation: "Assessment includes optic nerve head/RNFL, intraocular pressure, visual field, and angle status; no single parameter is sufficient alone. / ประเมิน optic nerve head/RNFL, IOP, visual field และมุมช่องหน้าม่านตาร่วมกัน",
    reference: "Glaucoma assessment principles"
  },
  {
    id: "q011", topic: "Refraction", subtopic: "Subjective Refraction", difficulty: "กลาง",
    question: "The main purpose of the fogging technique is to: / จุดประสงค์หลักของ fogging technique คืออะไร",
    options: ["Stimulate accommodation", "Relax accommodation", "Measure IOP", "Assess stereopsis"],
    answer: 1,
    explanation: "Fogging adds plus power to blur the image and reduce accommodative stimulation during refraction. / เพิ่มเลนส์บวกเพื่อทำให้ภาพพร่าและลดการกระตุ้น accommodation",
    reference: "Subjective refraction"
  },
  {
    id: "q012", topic: "Clinical Optometry", subtopic: "Pupils", difficulty: "กลาง",
    question: "A relative afferent pupillary defect (RAPD) is commonly assessed with which test? / การตรวจใดใช้ประเมิน RAPD",
    options: ["Cover-uncover test", "Swinging flashlight test", "Worth 4-dot test", "Schirmer test"],
    answer: 1,
    explanation: "The swinging flashlight test compares direct and consensual pupillary responses between eyes. / ส่องไฟสลับตาเพื่อเปรียบเทียบการตอบสนองของรูม่านตา",
    reference: "Pupillary examination"
  },
  {
    id: "q013", topic: "Contact Lens", subtopic: "Corneal Health", difficulty: "ยาก",
    question: "Which symptom combination in a contact lens wearer should raise concern for microbial keratitis? / อาการร่วมใดในผู้ใส่คอนแทคเลนส์ควรสงสัย microbial keratitis",
    options: ["Mild dryness relieved by blinking", "Pain, photophobia, redness and reduced vision", "Itching only during pollen season", "Transient blur that clears after blinking"],
    answer: 1,
    explanation: "Pain, photophobia, redness and reduced vision are urgent warning symptoms. Stop lens wear and arrange urgent ophthalmic assessment. / ปวด แพ้แสง ตาแดง และตามัว เป็นสัญญาณเร่งด่วน ให้หยุดใส่เลนส์และส่งตรวจ",
    reference: "Contact lens complications; urgent referral"
  },
  {
    id: "q014", topic: "Optics", subtopic: "Vertex Distance", difficulty: "ยาก",
    question: "A -10.00 D spectacle lens is moved from 12 mm to 8 mm vertex distance. The effective power at the corneal plane becomes approximately: / เลนส์แว่น -10.00 D เปลี่ยน vertex distance จาก 12 mm เป็น 8 mm กำลังที่ corneal plane จะเป็นอย่างไรโดยประมาณ",
    options: ["More minus", "Less minus", "Unchanged", "Becomes plus"],
    answer: 1,
    explanation: "Moving a high minus lens closer to the eye reduces its effective minus power at the corneal plane. Exact calculation depends on the reference plane convention. / เลนส์ลบกำลังสูงเมื่อขยับเข้าใกล้ตาจะมี effective minus ลดลง",
    reference: "Vertex distance compensation"
  },
  {
    id: "q015", topic: "Clinical Optometry", subtopic: "Referral", difficulty: "ยาก",
    question: "A patient reports sudden painless monocular vision loss. The safest next step is: / ผู้ป่วยสูญเสียการมองเห็นตาข้างเดียวอย่างฉับพลันโดยไม่ปวด แนวทางที่ปลอดภัยที่สุดคืออะไร",
    options: ["Routine review in 6 months", "Update spectacle prescription only", "Urgent same-day ophthalmic assessment", "Recommend lubricating drops and observe"],
    answer: 2,
    explanation: "Sudden monocular vision loss is an emergency until proven otherwise and warrants urgent same-day assessment. / การสูญเสียการมองเห็นข้างเดียวฉับพลันถือเป็นภาวะฉุกเฉินจนกว่าจะพิสูจน์ได้ว่าไม่ใช่",
    reference: "Clinical red flags; emergency referral"
  }
];
