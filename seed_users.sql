-- ==========================================================
-- DUMMY DATA : users
-- Cara pakai: phpMyAdmin (http://localhost:9192) -> pilih database
-- -> tab SQL -> paste isi file ini -> Go.
--
-- Semua user memakai password: password
-- (hash bcrypt, kompatibel dengan login aplikasi ini)
--
-- INSERT IGNORE: aman dijalankan berulang (email yang sudah ada dilewati).
-- Tabel dibuat otomatis saat aplikasi berjalan (APP_ENV=local).
-- ==========================================================

INSERT IGNORE INTO `users`
  (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`)
VALUES
  ('2acb499e-8428-543b-bd85-0d9098718220', 'Administrator', 'admin@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'admin', NOW(), NOW()),
  ('dbeb55f3-257c-507d-9e98-82b1db026769', 'Budi Santoso', 'budi@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'manager', NOW(), NOW()),
  ('f678db43-d350-5bee-b9a5-c3c739d232f9', 'Dewi Lestari', 'dewi@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'manager', NOW(), NOW()),
  ('8effbb20-ca87-5894-b8fa-87e84cfd4a22', 'Siti Rahayu', 'siti@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'staff', NOW(), NOW()),
  ('7ab9e96e-1948-5c2f-a45d-30f88fe503ec', 'Andi Pratama', 'andi@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'staff', NOW(), NOW()),
  ('2e73c8bd-1c42-5e30-b266-829375f0384b', 'Rudi Hartono', 'rudi@example.com', '$2b$10$peWx9lyczQPMoy1Yg2/jW.YQgDtHmeFH.Jj2mNZDCq19951R1yxQa', 'staff', NOW(), NOW());
