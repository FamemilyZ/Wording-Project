# Data Model Diagram (แผนภาพข้อมูล)

ไฟล์นี้ควรเป็นไฟล์รูปภาพ (`.png`) ที่แสดงโครงสร้างของข้อมูลที่จัดเก็บใน Cloud Firestore

## สิ่งที่ควรมีในแผนภาพ (ERD-like for NoSQL)

ควรแสดงถึง Collections และ Documents หลักๆ ในฐานข้อมูล Firestore ของคุณ

### ตัวอย่าง Collections:

1.  **`users` (Collection)**
    - เอกสาร (Document) ในนี้จะมี ID เป็น `uid` ของผู้ใช้จาก Firebase Authentication
    - **Fields:**
        - `email` (string): อีเมลผู้ใช้
        - `displayName` (string): ชื่อที่แสดงผล (อาจได้มาจาก Google)
        - `createdAt` (timestamp): วันที่สร้างบัญชี

2.  **`user_levels` (Collection)**
    - เป็น Sub-collection ของแต่ละ `user` document ก็ได้ หรือเป็น Collection หลักก็ได้
    - **Fields:**
        - `userId` (string): `uid` ของเจ้าของด่าน
        - `levelName` (string): ชื่อด่านที่ผู้ใช้ตั้ง
        - `words` (array of maps): รายการคำศัพท์ในด่าน
            - `en` (string): คำศัพท์ภาษาอังกฤษ
            - `th` (string): คำแปลภาษาไทย
        - `createdAt` (timestamp): วันที่สร้างด่าน

3.  **`quiz_history` (Collection)**
    - **Fields:**
        - `userId` (string): `uid` ของผู้เล่น
        - `levelName` (string): ชื่อด่านที่เล่น
        - `score` (number): คะแนนที่ได้
        - `totalQuestions` (number): จำนวนคำถามทั้งหมด
        - `playedAt` (timestamp): วันที่เล่น

**หมายเหตุ:** Gemini ไม่สามารถสร้างไฟล์รูปภาพได้ กรุณาสร้างแผนภาพนี้ด้วยเครื่องมือเช่น Draw.io, Figma, หรือโปรแกรมอื่นๆ แล้วบันทึกเป็นไฟล์ `Data_Model_Diagram.png` มาไว้ในโฟลเดอร์นี้
