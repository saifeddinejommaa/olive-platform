BEGIN;

-- ============================================================
-- 1. OLIVE VARIETIES
-- ============================================================

INSERT INTO olive_varieties
    (name, description)
VALUES
    ('Arbequina', 'Petite olive espagnole, huile fruitée et douce'),
    ('Koroneiki', 'Variété grecque, huile très fruitée et riche en polyphénols'),
    ('Arbosana', 'Variété adaptée aux plantations intensives'),
    ('Chemlali', 'Variété tunisienne, très répandue dans le sud')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 2. PLOTS
-- ============================================================

INSERT INTO plots
(
    code,
    name,
    area_hectares,
    number_of_trees,
    planting_year,
    location,
    notes,
    is_active
)
VALUES
(
    'PLOT-001',
    'Oliveraie Nord',
    25.5000,
    5200,
    2018,
    'Secteur Nord',
    'Plantation principale',
    TRUE
),
(
    'PLOT-002',
    'Oliveraie Sud',
    32.7500,
    6800,
    2016,
    'Secteur Sud',
    'Production régulière',
    TRUE
),
(
    'PLOT-003',
    'Oliveraie Est',
    40.2000,
    8000,
    2019,
    'Secteur Est',
    'Jeune plantation à haut rendement',
    TRUE
)
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 3. PLOT VARIETIES
-- ============================================================

INSERT INTO plot_varieties
(
    plot_id,
    variety_id,
    number_of_trees,
    percentage,
    notes
)
SELECT
    p.id,
    v.id,
    3000,
    57.69,
    'Variété principale'
FROM plots p
JOIN olive_varieties v
    ON v.name = 'Arbequina'
WHERE p.code = 'PLOT-001'
ON CONFLICT (plot_id, variety_id) DO NOTHING;


INSERT INTO plot_varieties
(
    plot_id,
    variety_id,
    number_of_trees,
    percentage,
    notes
)
SELECT
    p.id,
    v.id,
    2200,
    42.31,
    'Deuxième variété'
FROM plots p
JOIN olive_varieties v
    ON v.name = 'Koroneiki'
WHERE p.code = 'PLOT-001'
ON CONFLICT (plot_id, variety_id) DO NOTHING;


INSERT INTO plot_varieties
(
    plot_id,
    variety_id,
    number_of_trees,
    percentage,
    notes
)
SELECT
    p.id,
    v.id,
    6800,
    100,
    'Variété unique'
FROM plots p
JOIN olive_varieties v
    ON v.name = 'Chemlali'
WHERE p.code = 'PLOT-002'
ON CONFLICT (plot_id, variety_id) DO NOTHING;


INSERT INTO plot_varieties
(
    plot_id,
    variety_id,
    number_of_trees,
    percentage,
    notes
)
SELECT
    p.id,
    v.id,
    8000,
    100,
    'Plantation intensive'
FROM plots p
JOIN olive_varieties v
    ON v.name = 'Arbequina'
WHERE p.code = 'PLOT-003'
ON CONFLICT (plot_id, variety_id) DO NOTHING;


-- ============================================================
-- 4. HARVESTS
-- ============================================================

INSERT INTO harvests
(
    harvest_number,
    plot_id,
    harvest_date,
    quantity_kg,
    quality_grade,
    notes
)
SELECT
    'HARV-2026-001',
    p.id,
    '2026-10-15',
    18500,
    'A',
    'Première récolte de la saison'
FROM plots p
WHERE p.code = 'PLOT-001'
ON CONFLICT (harvest_number) DO NOTHING;


INSERT INTO harvests
(
    harvest_number,
    plot_id,
    harvest_date,
    quantity_kg,
    quality_grade,
    notes
)
SELECT
    'HARV-2026-002',
    p.id,
    '2026-10-20',
    24200,
    'A',
    'Récolte principale'
FROM plots p
WHERE p.code = 'PLOT-002'
ON CONFLICT (harvest_number) DO NOTHING;


INSERT INTO harvests
(
    harvest_number,
    plot_id,
    harvest_date,
    quantity_kg,
    quality_grade,
    notes
)
SELECT
    'HARV-2026-003',
    p.id,
    '2026-10-25',
    31000,
    'B',
    'Récolte jeune plantation'
FROM plots p
WHERE p.code = 'PLOT-003'
ON CONFLICT (harvest_number) DO NOTHING;


-- ============================================================
-- 5. OLIVE PURCHASES
-- ============================================================

INSERT INTO olive_purchases
(
    purchase_number,
    supplier_name,
    purchase_date,
    status_id,
    notes
)
SELECT
    'PUR-2026-001',
    'Ahmed Ben Salah',
    '2026-10-10',
    s.id,
    'Achat olives qualité supérieure'
FROM purchase_status s
WHERE s.code = 'approved'
ON CONFLICT (purchase_number) DO NOTHING;


INSERT INTO olive_purchases
(
    purchase_number,
    supplier_name,
    purchase_date,
    status_id,
    notes
)
SELECT
    'PUR-2026-002',
    'Coopérative El Amal',
    '2026-10-18',
    s.id,
    'Olives destinées à la production premium'
FROM purchase_status s
WHERE s.code = 'received'
ON CONFLICT (purchase_number) DO NOTHING;


INSERT INTO olive_purchases
(
    purchase_number,
    supplier_name,
    purchase_date,
    status_id,
    notes
)
SELECT
    'PUR-2026-003',
    'Ferme Agricole El Baraka',
    '2026-10-22',
    s.id,
    'En attente de validation'
FROM purchase_status s
WHERE s.code = 'pending'
ON CONFLICT (purchase_number) DO NOTHING;


-- ============================================================
-- 6. OLIVE PURCHASE ITEMS
-- ============================================================

INSERT INTO olive_purchase_items
(
    purchase_id,
    variety_id,
    description,
    agreed_quantity_kg,
    price_per_kg,
    notes
)
SELECT
    p.id,
    v.id,
    'Olives Arbequina',
    12000,
    1.8500,
    'Qualité A'
FROM olive_purchases p
JOIN olive_varieties v
    ON v.name = 'Arbequina'
WHERE p.purchase_number = 'PUR-2026-001';


INSERT INTO olive_purchase_items
(
    purchase_id,
    variety_id,
    description,
    agreed_quantity_kg,
    price_per_kg,
    notes
)
SELECT
    p.id,
    v.id,
    'Olives Koroneiki',
    8000,
    2.1000,
    'Forte teneur en huile'
FROM olive_purchases p
JOIN olive_varieties v
    ON v.name = 'Koroneiki'
WHERE p.purchase_number = 'PUR-2026-002';


INSERT INTO olive_purchase_items
(
    purchase_id,
    variety_id,
    description,
    agreed_quantity_kg,
    price_per_kg,
    notes
)
SELECT
    p.id,
    v.id,
    'Olives Chemlali',
    15000,
    1.6500,
    'Achat en vrac'
FROM olive_purchases p
JOIN olive_varieties v
    ON v.name = 'Chemlali'
WHERE p.purchase_number = 'PUR-2026-003';


-- ============================================================
-- 7. OLIVE SAMPLES
-- ============================================================

INSERT INTO olive_samples
(
    sample_number,
    purchase_id,
    sample_date,
    quantity_kg,
    supplier_name,
    status_id,
    notes
)
SELECT
    'SAMPLE-2026-001',
    p.id,
    '2026-10-10 09:30:00',
    2.500,
    p.supplier_name,
    s.id,
    'Échantillon avant achat'
FROM olive_purchases p
JOIN purchase_status ps
    ON ps.id = p.status_id
JOIN sample_status s
    ON s.code = 'analyzed'
WHERE p.purchase_number = 'PUR-2026-001';


INSERT INTO olive_samples
(
    sample_number,
    purchase_id,
    sample_date,
    quantity_kg,
    supplier_name,
    status_id,
    notes
)
SELECT
    'SAMPLE-2026-002',
    p.id,
    '2026-10-18 10:00:00',
    2.500,
    p.supplier_name,
    s.id,
    'Très bonne qualité'
FROM olive_purchases p
JOIN sample_status s
    ON s.code = 'approved'
WHERE p.purchase_number = 'PUR-2026-002';


INSERT INTO olive_samples
(
    sample_number,
    purchase_id,
    sample_date,
    quantity_kg,
    supplier_name,
    status_id,
    notes
)
SELECT
    'SAMPLE-2026-003',
    p.id,
    '2026-10-22 11:00:00',
    2.500,
    p.supplier_name,
    s.id,
    'Analyse en attente'
FROM olive_purchases p
JOIN sample_status s
    ON s.code = 'pending'
WHERE p.purchase_number = 'PUR-2026-003';


-- ============================================================
-- 8. LAB ANALYSES
-- ============================================================

INSERT INTO lab_analyses
(
    analysis_number,
    sample_id,
    analysis_date,
    analyst_name,
    general_quality,
    estimated_oil_yield,
    notes
)
SELECT
    'ANALYSIS-2026-001',
    s.id,
    '2026-10-10 14:00:00',
    'Laboratoire Central',
    'Excellent',
    22.500,
    'Très bon potentiel d extraction'
FROM olive_samples s
WHERE s.sample_number = 'SAMPLE-2026-001';


INSERT INTO lab_analyses
(
    analysis_number,
    sample_id,
    analysis_date,
    analyst_name,
    general_quality,
    estimated_oil_yield,
    notes
)
SELECT
    'ANALYSIS-2026-002',
    s.id,
    '2026-10-18 15:00:00',
    'Laboratoire Central',
    'Excellent',
    24.200,
    'Qualité premium'
FROM olive_samples s
WHERE s.sample_number = 'SAMPLE-2026-002';


-- ============================================================
-- 9. LAB ANALYSIS RESULTS
-- ============================================================

INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Humidité',
    48.50,
    NULL,
    '%',
    'Valeur normale'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-001';


INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Acidité',
    0.42,
    NULL,
    '%',
    'Très bonne acidité'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-001';


INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Indice de peroxyde',
    5.80,
    NULL,
    'meq O2/kg',
    'Conforme'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-001';


INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Humidité',
    46.20,
    NULL,
    '%',
    'Très bonne'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-002';


INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Acidité',
    0.31,
    NULL,
    '%',
    'Excellente'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-002';


INSERT INTO lab_analysis_results
(
    analysis_id,
    parameter_name,
    value_numeric,
    value_text,
    unit,
    notes
)
SELECT
    a.id,
    'Odeur',
    NULL,
    'Fruitée intense',
    NULL,
    'Profil aromatique intéressant'
FROM lab_analyses a
WHERE a.analysis_number = 'ANALYSIS-2026-002';


-- ============================================================
-- 10. PRODUCTION BATCHES
-- ============================================================

INSERT INTO production_batches
(
    batch_number,
    production_date,
    start_time,
    end_time,
    status_id,
    olive_quantity_kg,
    oil_quantity_liters,
    yield_percentage,
    notes
)
SELECT
    'PROD-2026-001',
    '2026-10-16',
    '2026-10-16 06:00:00',
    '2026-10-16 18:00:00',
    s.id,
    18000,
    3600,
    20.000,
    'Production olives exploitation'
FROM production_status s
WHERE s.code = 'completed';


INSERT INTO production_batches
(
    batch_number,
    production_date,
    start_time,
    end_time,
    status_id,
    olive_quantity_kg,
    oil_quantity_liters,
    yield_percentage,
    notes
)
SELECT
    'PROD-2026-002',
    '2026-10-21',
    '2026-10-21 06:00:00',
    '2026-10-21 19:00:00',
    s.id,
    23000,
    5060,
    22.000,
    'Production qualité premium'
FROM production_status s
WHERE s.code = 'completed';


INSERT INTO production_batches
(
    batch_number,
    production_date,
    start_time,
    end_time,
    status_id,
    olive_quantity_kg,
    oil_quantity_liters,
    yield_percentage,
    notes
)
SELECT
    'PROD-2026-003',
    '2026-10-26',
    NULL,
    NULL,
    s.id,
    NULL,
    NULL,
    NULL,
    'Production planifiée'
FROM production_status s
WHERE s.code = 'planned';


-- ============================================================
-- 11. PRODUCTION BATCH INPUTS
-- ============================================================

INSERT INTO production_batch_inputs
(
    production_batch_id,
    harvest_id,
    purchase_item_id,
    quantity_kg,
    notes
)
SELECT
    pb.id,
    h.id,
    NULL,
    18000,
    'Olives provenant de la récolte PLOT-001'
FROM production_batches pb
JOIN harvests h
    ON h.harvest_number = 'HARV-2026-001'
WHERE pb.batch_number = 'PROD-2026-001';


INSERT INTO production_batch_inputs
(
    production_batch_id,
    harvest_id,
    purchase_item_id,
    quantity_kg,
    notes
)
SELECT
    pb.id,
    NULL,
    pi.id,
    8000,
    'Olives achetées - Koroneiki'
FROM production_batches pb
JOIN olive_purchases p
    ON p.purchase_number = 'PUR-2026-002'
JOIN olive_purchase_items pi
    ON pi.purchase_id = p.id
WHERE pb.batch_number = 'PROD-2026-002';


INSERT INTO production_batch_inputs
(
    production_batch_id,
    harvest_id,
    purchase_item_id,
    quantity_kg,
    notes
)
SELECT
    pb.id,
    h.id,
    NULL,
    15000,
    'Olives récolte PLOT-002'
FROM production_batches pb
JOIN harvests h
    ON h.harvest_number = 'HARV-2026-002'
WHERE pb.batch_number = 'PROD-2026-002';


-- ============================================================
-- 12. OIL BATCHES
-- ============================================================

INSERT INTO oil_batches
(
    batch_number,
    production_batch_id,
    production_date,
    quantity_liters,
    quality_grade,
    status,
    notes
)
SELECT
    'OIL-2026-001',
    id,
    production_date,
    oil_quantity_liters,
    'Extra Virgin',
    'available',
    'Huile issue de PROD-2026-001'
FROM production_batches
WHERE batch_number = 'PROD-2026-001';


INSERT INTO oil_batches
(
    batch_number,
    production_batch_id,
    production_date,
    quantity_liters,
    quality_grade,
    status,
    notes
)
SELECT
    'OIL-2026-002',
    id,
    production_date,
    oil_quantity_liters,
    'Extra Virgin Premium',
    'available',
    'Huile premium'
FROM production_batches
WHERE batch_number = 'PROD-2026-002';


-- ============================================================
-- 13. TANKS
-- ============================================================

INSERT INTO tanks
(
    code,
    name,
    capacity_liters,
    location,
    tank_type,
    status,
    notes
)
VALUES
(
    'TANK-001',
    'Citerne principale 1',
    10000,
    'Zone stockage A',
    'Inox',
    'active',
    'Citerne grande capacité'
),
(
    'TANK-002',
    'Citerne principale 2',
    10000,
    'Zone stockage A',
    'Inox',
    'active',
    'Citerne grande capacité'
),
(
    'TANK-003',
    'Citerne premium',
    5000,
    'Zone stockage B',
    'Inox',
    'active',
    'Réservée huile premium'
),
(
    'TANK-004',
    'Citerne tampon',
    3000,
    'Zone production',
    'Inox',
    'active',
    'Stockage temporaire'
)
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 14. OIL MOVEMENTS
-- ============================================================

INSERT INTO oil_movements
(
    movement_number,
    movement_type_id,
    movement_date,
    oil_batch_id,
    source_tank_id,
    destination_tank_id,
    quantity_liters,
    reference_type,
    notes
)
SELECT
    'MOV-2026-001',
    mt.id,
    '2026-10-16 19:00:00',
    ob.id,
    NULL,
    t.id,
    3600,
    'production_batch',
    'Entrée production PROD-2026-001'
FROM oil_batches ob
JOIN tanks t
    ON t.code = 'TANK-001'
JOIN oil_movement_type mt
    ON mt.code = 'production_in'
WHERE ob.batch_number = 'OIL-2026-001';


INSERT INTO oil_movements
(
    movement_number,
    movement_type_id,
    movement_date,
    oil_batch_id,
    source_tank_id,
    destination_tank_id,
    quantity_liters,
    reference_type,
    notes
)
SELECT
    'MOV-2026-002',
    mt.id,
    '2026-10-21 20:00:00',
    ob.id,
    NULL,
    t.id,
    5060,
    'production_batch',
    'Entrée production premium'
FROM oil_batches ob
JOIN tanks t
    ON t.code = 'TANK-003'
JOIN oil_movement_type mt
    ON mt.code = 'production_in'
WHERE ob.batch_number = 'OIL-2026-002';


-- ============================================================
-- 15. EXPENSE CATEGORIES
-- ============================================================

INSERT INTO expense_categories
(
    code,
    name,
    description
)
VALUES
(
    'AGRI',
    'Agriculture',
    'Dépenses agricoles'
),
(
    'FUEL',
    'Carburant',
    'Carburant machines et véhicules'
),
(
    'TRANSPORT',
    'Transport',
    'Transport des olives'
),
(
    'LAB',
    'Laboratoire',
    'Analyses et laboratoire'
),
(
    'MAINT',
    'Maintenance',
    'Maintenance machines et équipements'
),
(
    'SALARY',
    'Main d''œuvre',
    'Paiements des travailleurs'
)
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 16. WORKERS
-- ============================================================

INSERT INTO workers
(
    code,
    name,
    phone,
    worker_type,
    daily_rate,
    is_active,
    notes
)
VALUES
(
    'W-001',
    'Mohamed Ali',
    '22123456',
    'Agriculture',
    45.00,
    TRUE,
    'Responsable terrain'
),
(
    'W-002',
    'Ahmed Trabelsi',
    '22345678',
    'Agriculture',
    40.00,
    TRUE,
    'Ouvrier agricole'
),
(
    'W-003',
    'Sami Ben Amor',
    '22456789',
    'Transport',
    55.00,
    TRUE,
    'Chauffeur'
),
(
    'W-004',
    'Karim Mansour',
    '22567890',
    'Production',
    50.00,
    TRUE,
    'Opérateur pressoir'
),
(
    'W-005',
    'Hassan Gharbi',
    '22678901',
    'Agriculture',
    40.00,
    TRUE,
    'Ouvrier agricole'
)
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 17. WORK SESSIONS
-- ============================================================

INSERT INTO work_sessions
(
    worker_id,
    plot_id,
    work_date,
    work_type,
    quantity,
    unit,
    amount,
    notes
)
SELECT
    w.id,
    p.id,
    '2026-10-15',
    'Récolte',
    1,
    'jour',
    45.00,
    'Récolte olives'
FROM workers w
JOIN plots p
    ON p.code = 'PLOT-001'
WHERE w.code = 'W-001';


INSERT INTO work_sessions
(
    worker_id,
    plot_id,
    work_date,
    work_type,
    quantity,
    unit,
    amount,
    notes
)
SELECT
    w.id,
    p.id,
    '2026-10-15',
    'Récolte',
    1,
    'jour',
    40.00,
    'Récolte olives'
FROM workers w
JOIN plots p
    ON p.code = 'PLOT-001'
WHERE w.code = 'W-002';


INSERT INTO work_sessions
(
    worker_id,
    plot_id,
    work_date,
    work_type,
    quantity,
    unit,
    amount,
    notes
)
SELECT
    w.id,
    p.id,
    '2026-10-20',
    'Récolte',
    1,
    'jour',
    45.00,
    'Récolte olives'
FROM workers w
JOIN plots p
    ON p.code = 'PLOT-002'
WHERE w.code = 'W-001';


INSERT INTO work_sessions
(
    worker_id,
    plot_id,
    work_date,
    work_type,
    quantity,
    unit,
    amount,
    notes
)
SELECT
    w.id,
    NULL,
    '2026-10-16',
    'Transport olives',
    8,
    'trajets',
    440.00,
    'Transport vers pressoir'
FROM workers w
WHERE w.code = 'W-003';


-- ============================================================
-- 18. INVOICES
-- ============================================================

INSERT INTO invoices
(
    invoice_number,
    invoice_type_id,
    supplier_name,
    customer_name,
    invoice_date,
    due_date,
    subtotal,
    tax_amount,
    total_amount,
    status_id,
    notes
)
SELECT
    'FAC-ACH-2026-001',
    it.id,
    'Fournitures Agricoles Tunisie',
    NULL,
    '2026-10-12',
    '2026-11-12',
    2500.00,
    475.00,
    2975.00,
    ist.id,
    'Fournitures agricoles'
FROM invoice_type it
JOIN invoice_status ist
    ON ist.code = 'issued'
WHERE it.code = 'purchase';


INSERT INTO invoices
(
    invoice_number,
    invoice_type_id,
    supplier_name,
    customer_name,
    invoice_date,
    due_date,
    subtotal,
    tax_amount,
    total_amount,
    status_id,
    notes
)
SELECT
    'FAC-ACH-2026-002',
    it.id,
    'Transport Ben Salah',
    NULL,
    '2026-10-20',
    '2026-11-20',
    1800.00,
    342.00,
    2142.00,
    ist.id,
    'Transport olives'
FROM invoice_type it
JOIN invoice_status ist
    ON ist.code = 'partially_paid'
WHERE it.code = 'purchase';


INSERT INTO invoices
(
    invoice_number,
    invoice_type_id,
    supplier_name,
    customer_name,
    invoice_date,
    due_date,
    subtotal,
    tax_amount,
    total_amount,
    status_id,
    notes
)
SELECT
    'FAC-VTE-2026-001',
    it.id,
    NULL,
    'Client Huile Premium',
    '2026-10-25',
    '2026-11-25',
    15000.00,
    2850.00,
    17850.00,
    ist.id,
    'Vente huile extra vierge'
FROM invoice_type it
JOIN invoice_status ist
    ON ist.code = 'issued'
WHERE it.code = 'sale';


-- ============================================================
-- 19. INVOICE ITEMS
-- ============================================================

INSERT INTO invoice_items
(
    invoice_id,
    description,
    quantity,
    unit_price,
    tax_rate
)
SELECT
    i.id,
    'Fournitures agricoles',
    1,
    2500.00,
    19.00
FROM invoices i
WHERE i.invoice_number = 'FAC-ACH-2026-001';


INSERT INTO invoice_items
(
    invoice_id,
    description,
    quantity,
    unit_price,
    tax_rate
)
SELECT
    i.id,
    'Transport olives',
    12,
    150.00,
    19.00
FROM invoices i
WHERE i.invoice_number = 'FAC-ACH-2026-002';


INSERT INTO invoice_items
(
    invoice_id,
    description,
    quantity,
    unit_price,
    tax_rate
)
SELECT
    i.id,
    'Huile d''olive Extra Vierge',
    3000,
    5.00,
    19.00
FROM invoices i
WHERE i.invoice_number = 'FAC-VTE-2026-001';


-- ============================================================
-- 20. PAYMENTS
-- ============================================================

INSERT INTO payments
(
    payment_number,
    payment_date,
    amount,
    payment_method_id,
    invoice_id,
    supplier_name,
    worker_name,
    reference,
    notes
)
SELECT
    'PAY-2026-001',
    '2026-10-15 10:00:00',
    1500.00,
    pm.id,
    i.id,
    i.supplier_name,
    NULL,
    'VIR-20261015-001',
    'Premier paiement fournisseur'
FROM invoices i
JOIN payment_method pm
    ON pm.code = 'bank_transfer'
WHERE i.invoice_number = 'FAC-ACH-2026-001';


INSERT INTO payments
(
    payment_number,
    payment_date,
    amount,
    payment_method_id,
    invoice_id,
    supplier_name,
    worker_name,
    reference,
    notes
)
SELECT
    'PAY-2026-002',
    '2026-10-22 10:00:00',
    1000.00,
    pm.id,
    i.id,
    i.supplier_name,
    NULL,
    NULL,
    'Paiement partiel transport'
FROM invoices i
JOIN payment_method pm
    ON pm.code = 'cash'
WHERE i.invoice_number = 'FAC-ACH-2026-002';


INSERT INTO payments
(
    payment_number,
    payment_date,
    amount,
    payment_method_id,
    invoice_id,
    supplier_name,
    worker_name,
    reference,
    notes
)
SELECT
    'PAY-2026-003',
    '2026-10-15 18:00:00',
    45.00,
    pm.id,
    NULL,
    NULL,
    'Mohamed Ali',
    NULL,
    'Paiement travail récolte'
FROM payment_method pm
WHERE pm.code = 'cash';


INSERT INTO payments
(
    payment_number,
    payment_date,
    amount,
    payment_method_id,
    invoice_id,
    supplier_name,
    worker_name,
    reference,
    notes
)
SELECT
    'PAY-2026-004',
    '2026-10-15 18:00:00',
    40.00,
    pm.id,
    NULL,
    NULL,
    'Ahmed Trabelsi',
    NULL,
    'Paiement travail récolte'
FROM payment_method pm
WHERE pm.code = 'cash';


INSERT INTO payments
(
    payment_number,
    payment_date,
    amount,
    payment_method_id,
    invoice_id,
    supplier_name,
    worker_name,
    reference,
    notes
)
SELECT
    'PAY-2026-005',
    '2026-10-16 18:00:00',
    440.00,
    pm.id,
    NULL,
    NULL,
    'Sami Ben Amor',
    NULL,
    'Paiement transport olives'
FROM payment_method pm
WHERE pm.code = 'cash';


-- ============================================================
-- COMMIT
-- ============================================================

COMMIT;


-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT 'olive_varieties' AS table_name, COUNT(*) AS count
FROM olive_varieties

UNION ALL

SELECT 'plots', COUNT(*)
FROM plots

UNION ALL

SELECT 'plot_varieties', COUNT(*)
FROM plot_varieties

UNION ALL

SELECT 'harvests', COUNT(*)
FROM harvests

UNION ALL

SELECT 'olive_purchases', COUNT(*)
FROM olive_purchases

UNION ALL

SELECT 'olive_purchase_items', COUNT(*)
FROM olive_purchase_items

UNION ALL

SELECT 'olive_samples', COUNT(*)
FROM olive_samples

UNION ALL

SELECT 'lab_analyses', COUNT(*)
FROM lab_analyses

UNION ALL

SELECT 'lab_analysis_results', COUNT(*)
FROM lab_analysis_results

UNION ALL

SELECT 'production_batches', COUNT(*)
FROM production_batches

UNION ALL

SELECT 'production_batch_inputs', COUNT(*)
FROM production_batch_inputs

UNION ALL

SELECT 'oil_batches', COUNT(*)
FROM oil_batches

UNION ALL

SELECT 'tanks', COUNT(*)
FROM tanks

UNION ALL

SELECT 'oil_movements', COUNT(*)
FROM oil_movements

UNION ALL

SELECT 'expense_categories', COUNT(*)
FROM expense_categories

UNION ALL

SELECT 'workers', COUNT(*)
FROM workers

UNION ALL

SELECT 'work_sessions', COUNT(*)
FROM work_sessions

UNION ALL

SELECT 'invoices', COUNT(*)
FROM invoices

UNION ALL

SELECT 'invoice_items', COUNT(*)
FROM invoice_items

UNION ALL

SELECT 'payments', COUNT(*)
FROM payments

ORDER BY table_name;