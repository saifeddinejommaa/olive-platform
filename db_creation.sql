BEGIN;

-- ============================================================
-- 1. TABLES DE RÉFÉRENCE
-- ============================================================

-- ------------------------------------------------------------
-- Purchase Status
-- ------------------------------------------------------------

CREATE TABLE purchase_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- 1.1. DOCUMENT COUNTERS
-- ============================================================

CREATE TABLE document_counters (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    document_type VARCHAR(50) NOT NULL,

    year INTEGER NOT NULL,

    last_number INTEGER NOT NULL DEFAULT 0
        CHECK (last_number >= 0),

    CONSTRAINT uq_document_counters_document_type_year
        UNIQUE (document_type, year)
);

-- ------------------------------------------------------------
-- Sample Status
-- ------------------------------------------------------------

CREATE TABLE sample_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- Production / Pressing Operation Status
-- ------------------------------------------------------------

CREATE TABLE production_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- Oil Movement Type
-- ------------------------------------------------------------

CREATE TABLE oil_movement_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- Invoice Type
-- ------------------------------------------------------------

CREATE TABLE invoice_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- Invoice Status
-- ------------------------------------------------------------

CREATE TABLE invoice_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- Payment Method
-- ------------------------------------------------------------

CREATE TABLE payment_method (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================================
-- 2. AGRICULTURE
-- ============================================================

CREATE TABLE plots (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150),

    area_hectares NUMERIC(12,4) NOT NULL
        CHECK (area_hectares >= 0),

    number_of_trees INTEGER NOT NULL DEFAULT 0
        CHECK (number_of_trees >= 0),

    planting_year INTEGER
        CHECK (
            planting_year IS NULL
            OR planting_year BETWEEN 1900 AND 2100
        ),

    location TEXT,
    notes TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE olive_varieties (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE plot_varieties (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    plot_id INTEGER NOT NULL
        REFERENCES plots(id)
        ON DELETE CASCADE,

    variety_id INTEGER NOT NULL
        REFERENCES olive_varieties(id)
        ON DELETE RESTRICT,

    number_of_trees INTEGER
        CHECK (
            number_of_trees IS NULL
            OR number_of_trees >= 0
        ),

    percentage NUMERIC(5,2)
        CHECK (
            percentage IS NULL
            OR (percentage >= 0 AND percentage <= 100)
        ),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (plot_id, variety_id)
);


CREATE TABLE harvests (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    harvest_number VARCHAR(50) NOT NULL UNIQUE,

    plot_id INTEGER NOT NULL
        REFERENCES plots(id)
        ON DELETE RESTRICT,

    harvest_date DATE NOT NULL,

    quantity_kg NUMERIC(14,3) NOT NULL
        CHECK (quantity_kg > 0),

    quality_grade VARCHAR(100),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. ACHATS D'OLIVES
-- ============================================================

CREATE TABLE olive_purchases (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    purchase_number VARCHAR(50) NOT NULL UNIQUE,

    supplier_name VARCHAR(200) NOT NULL,

    purchase_date DATE NOT NULL,

    status_id INTEGER NOT NULL
        REFERENCES purchase_status(id)
        ON DELETE RESTRICT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE olive_purchase_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    purchase_id INTEGER NOT NULL
        REFERENCES olive_purchases(id)
        ON DELETE CASCADE,

    reference VARCHAR(100) NOT NULL,

    variety_id INTEGER
        REFERENCES olive_varieties(id)
        ON DELETE RESTRICT,

    description TEXT,

    agreed_quantity_kg NUMERIC(14,3) NOT NULL
        CHECK (agreed_quantity_kg > 0),

    price_per_kg NUMERIC(12,4) NOT NULL
        CHECK (price_per_kg >= 0),

    total_amount NUMERIC(16,2)
        GENERATED ALWAYS AS (
            agreed_quantity_kg * price_per_kg
        ) STORED,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_olive_purchase_item_reference
        UNIQUE (purchase_id, reference)
);


-- ============================================================
-- 4. LABORATOIRE
-- ============================================================

CREATE TABLE olive_samples (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sample_number VARCHAR(50) NOT NULL UNIQUE,

    purchase_id INTEGER
        REFERENCES olive_purchases(id)
        ON DELETE SET NULL,

    sample_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    quantity_kg NUMERIC(10,3)
        CHECK (
            quantity_kg IS NULL
            OR quantity_kg >= 0
        ),

    supplier_name VARCHAR(200),

    status_id INTEGER NOT NULL
        REFERENCES sample_status(id)
        ON DELETE RESTRICT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE lab_analyses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    analysis_number VARCHAR(50) NOT NULL UNIQUE,

    sample_id INTEGER NOT NULL
        REFERENCES olive_samples(id)
        ON DELETE CASCADE,

    analysis_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    analyst_name VARCHAR(150),

    general_quality VARCHAR(100),

    estimated_oil_yield NUMERIC(6,3)
        CHECK (
            estimated_oil_yield IS NULL
            OR estimated_oil_yield >= 0
        ),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE lab_analysis_results (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    analysis_id INTEGER NOT NULL
        REFERENCES lab_analyses(id)
        ON DELETE CASCADE,

    parameter_name VARCHAR(150) NOT NULL,

    value_numeric NUMERIC(16,6),

    value_text VARCHAR(255),

    unit VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        value_numeric IS NOT NULL
        OR value_text IS NOT NULL
    )
);


-- ============================================================
-- 5. PRESSAGE
-- ============================================================

-- Une pressing_operation représente UNE opération de pression.
--
-- La quantité d'olives entrante n'est PAS stockée ici.
-- Elle est calculée à partir de pressing_operation_inputs.
--
-- Une opération peut avoir plusieurs inputs, mais chaque input
-- doit provenir d'une seule source :
--
--     harvest_id       OU
--     purchase_item_id
--
-- jamais les deux.

CREATE TABLE pressing_operations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    operation_number VARCHAR(50) NOT NULL UNIQUE,

    pressing_date DATE NOT NULL,

    start_time TIMESTAMPTZ,

    end_time TIMESTAMPTZ,

    status_id INTEGER NOT NULL
        REFERENCES production_status(id)
        ON DELETE RESTRICT,

    oil_quantity_liters NUMERIC(14,3)
        CHECK (
            oil_quantity_liters IS NULL
            OR oil_quantity_liters >= 0
        ),

    yield_percentage NUMERIC(6,3)
        CHECK (
            yield_percentage IS NULL
            OR yield_percentage >= 0
        ),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE pressing_operation_inputs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pressing_operation_id INTEGER NOT NULL
        REFERENCES pressing_operations(id)
        ON DELETE CASCADE,

    harvest_id INTEGER
        REFERENCES harvests(id)
        ON DELETE RESTRICT,

    purchase_item_id INTEGER
        REFERENCES olive_purchase_items(id)
        ON DELETE RESTRICT,

    quantity_kg NUMERIC(14,3) NOT NULL
        CHECK (quantity_kg > 0),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Une ligne vient obligatoirement d'une seule source.
    CHECK (
        (harvest_id IS NOT NULL AND purchase_item_id IS NULL)
        OR
        (harvest_id IS NULL AND purchase_item_id IS NOT NULL)
    )
);


-- ============================================================
-- 6. LOTS D'HUILE
-- ============================================================

CREATE TABLE oil_batches (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    batch_number VARCHAR(50) NOT NULL UNIQUE,

    pressing_operation_id INTEGER NOT NULL
        REFERENCES pressing_operations(id)
        ON DELETE RESTRICT,

    production_date DATE NOT NULL,

    quantity_liters NUMERIC(14,3) NOT NULL
        CHECK (quantity_liters > 0),

    quality_grade VARCHAR(100),

    status VARCHAR(50) NOT NULL DEFAULT 'available',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 7. STOCK / CITERNES
-- ============================================================

CREATE TABLE tanks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(150),

    capacity_liters NUMERIC(14,3) NOT NULL
        CHECK (capacity_liters > 0),

    location VARCHAR(150),

    tank_type VARCHAR(100),

    status VARCHAR(50) NOT NULL DEFAULT 'active',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE oil_movements (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    movement_number VARCHAR(50) NOT NULL UNIQUE,

    movement_type_id INTEGER NOT NULL
        REFERENCES oil_movement_type(id)
        ON DELETE RESTRICT,

    movement_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    oil_batch_id INTEGER
        REFERENCES oil_batches(id)
        ON DELETE RESTRICT,

    source_tank_id INTEGER
        REFERENCES tanks(id)
        ON DELETE RESTRICT,

    destination_tank_id INTEGER
        REFERENCES tanks(id)
        ON DELETE RESTRICT,

    quantity_liters NUMERIC(14,3) NOT NULL
        CHECK (quantity_liters > 0),

    reference_type VARCHAR(50),

    reference_id INTEGER,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        source_tank_id IS NOT NULL
        OR destination_tank_id IS NOT NULL
    )
);


-- ============================================================
-- 8. FINANCE
-- ============================================================

CREATE TABLE expense_categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(150) NOT NULL,

    parent_id INTEGER
        REFERENCES expense_categories(id)
        ON DELETE RESTRICT,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE invoices (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    invoice_number VARCHAR(100) NOT NULL,

    invoice_type_id INTEGER NOT NULL
        REFERENCES invoice_type(id)
        ON DELETE RESTRICT,

    supplier_name VARCHAR(200),

    customer_name VARCHAR(200),

    invoice_date DATE NOT NULL,

    due_date DATE,

    subtotal NUMERIC(16,2) NOT NULL DEFAULT 0
        CHECK (subtotal >= 0),

    tax_amount NUMERIC(16,2) NOT NULL DEFAULT 0
        CHECK (tax_amount >= 0),

    total_amount NUMERIC(16,2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0),

    status_id INTEGER NOT NULL
        REFERENCES invoice_status(id)
        ON DELETE RESTRICT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (invoice_type_id, invoice_number)
);


CREATE TABLE invoice_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    invoice_id INTEGER NOT NULL
        REFERENCES invoices(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    quantity NUMERIC(14,3) NOT NULL DEFAULT 1
        CHECK (quantity > 0),

    unit_price NUMERIC(14,4) NOT NULL
        CHECK (unit_price >= 0),

    tax_rate NUMERIC(6,3) NOT NULL DEFAULT 0
        CHECK (tax_rate >= 0),

    total_amount NUMERIC(16,2)
        GENERATED ALWAYS AS (
            quantity * unit_price
        ) STORED,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE payments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    payment_number VARCHAR(50) NOT NULL UNIQUE,

    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    amount NUMERIC(16,2) NOT NULL
        CHECK (amount > 0),

    payment_method_id INTEGER NOT NULL
        REFERENCES payment_method(id)
        ON DELETE RESTRICT,

    invoice_id INTEGER
        REFERENCES invoices(id)
        ON DELETE SET NULL,

    supplier_name VARCHAR(200),

    worker_name VARCHAR(200),

    reference VARCHAR(150),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 9. TRAVAILLEURS
-- ============================================================

CREATE TABLE workers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(200) NOT NULL,

    phone VARCHAR(50),

    worker_type VARCHAR(100),

    daily_rate NUMERIC(12,2)
        CHECK (
            daily_rate IS NULL
            OR daily_rate >= 0
        ),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE work_sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    worker_id INTEGER NOT NULL
        REFERENCES workers(id)
        ON DELETE RESTRICT,

    plot_id INTEGER
        REFERENCES plots(id)
        ON DELETE RESTRICT,

    work_date DATE NOT NULL,

    work_type VARCHAR(100) NOT NULL,

    quantity NUMERIC(12,3),

    unit VARCHAR(50),

    amount NUMERIC(12,2)
        CHECK (
            amount IS NULL
            OR amount >= 0
        ),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 10. INDEXES
-- ============================================================

CREATE INDEX idx_plot_varieties_plot_id
ON plot_varieties(plot_id);

CREATE INDEX idx_plot_varieties_variety_id
ON plot_varieties(variety_id);


CREATE INDEX idx_harvests_plot_id
ON harvests(plot_id);

CREATE INDEX idx_harvests_date
ON harvests(harvest_date);


CREATE INDEX idx_olive_purchases_status_id
ON olive_purchases(status_id);

CREATE INDEX idx_purchase_items_purchase_id
ON olive_purchase_items(purchase_id);

CREATE INDEX idx_purchase_items_variety_id
ON olive_purchase_items(variety_id);


CREATE INDEX idx_olive_samples_purchase_id
ON olive_samples(purchase_id);

CREATE INDEX idx_olive_samples_status_id
ON olive_samples(status_id);


CREATE INDEX idx_lab_analyses_sample_id
ON lab_analyses(sample_id);

CREATE INDEX idx_lab_results_analysis_id
ON lab_analysis_results(analysis_id);


-- ------------------------------------------------------------
-- Pressing Operations
-- ------------------------------------------------------------

CREATE INDEX idx_pressing_operations_status_id
ON pressing_operations(status_id);

CREATE INDEX idx_pressing_operations_date
ON pressing_operations(pressing_date);


CREATE INDEX idx_pressing_operation_inputs_operation_id
ON pressing_operation_inputs(pressing_operation_id);

CREATE INDEX idx_pressing_operation_inputs_harvest_id
ON pressing_operation_inputs(harvest_id);

CREATE INDEX idx_pressing_operation_inputs_purchase_item_id
ON pressing_operation_inputs(purchase_item_id);


-- ------------------------------------------------------------
-- Oil Batches
-- ------------------------------------------------------------

CREATE INDEX idx_oil_batches_pressing_operation_id
ON oil_batches(pressing_operation_id);


-- ------------------------------------------------------------
-- Oil Movements
-- ------------------------------------------------------------

CREATE INDEX idx_oil_movements_type_id
ON oil_movements(movement_type_id);

CREATE INDEX idx_oil_movements_oil_batch_id
ON oil_movements(oil_batch_id);

CREATE INDEX idx_oil_movements_source_tank_id
ON oil_movements(source_tank_id);

CREATE INDEX idx_oil_movements_destination_tank_id
ON oil_movements(destination_tank_id);


-- ------------------------------------------------------------
-- Invoices
-- ------------------------------------------------------------

CREATE INDEX idx_invoices_date
ON invoices(invoice_date);

CREATE INDEX idx_invoices_type_id
ON invoices(invoice_type_id);

CREATE INDEX idx_invoices_status_id
ON invoices(status_id);

CREATE INDEX idx_invoice_items_invoice_id
ON invoice_items(invoice_id);


-- ------------------------------------------------------------
-- Payments
-- ------------------------------------------------------------

CREATE INDEX idx_payments_invoice_id
ON payments(invoice_id);

CREATE INDEX idx_payments_payment_method_id
ON payments(payment_method_id);

CREATE INDEX idx_payments_date
ON payments(payment_date);


-- ------------------------------------------------------------
-- Workers
-- ------------------------------------------------------------

CREATE INDEX idx_work_sessions_worker_id
ON work_sessions(worker_id);

CREATE INDEX idx_work_sessions_plot_id
ON work_sessions(plot_id);

CREATE INDEX idx_work_sessions_date
ON work_sessions(work_date);


-- ============================================================
-- 11. UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 12. UPDATED_AT TRIGGERS
-- ============================================================

CREATE TRIGGER trg_plots_updated_at
BEFORE UPDATE ON plots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_olive_varieties_updated_at
BEFORE UPDATE ON olive_varieties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_harvests_updated_at
BEFORE UPDATE ON harvests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_olive_purchases_updated_at
BEFORE UPDATE ON olive_purchases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_olive_samples_updated_at
BEFORE UPDATE ON olive_samples
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_lab_analyses_updated_at
BEFORE UPDATE ON lab_analyses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_pressing_operations_updated_at
BEFORE UPDATE ON pressing_operations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_oil_batches_updated_at
BEFORE UPDATE ON oil_batches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_tanks_updated_at
BEFORE UPDATE ON tanks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trg_workers_updated_at
BEFORE UPDATE ON workers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 13. DONNÉES DE RÉFÉRENCE
-- ============================================================

-- ------------------------------------------------------------
-- Purchase Status
-- ------------------------------------------------------------

INSERT INTO purchase_status (code, name, description)
VALUES
('draft', 'Draft', 'Purchase is being prepared'),
('pending', 'Pending', 'Purchase is waiting for approval'),
('approved', 'Approved', 'Purchase has been approved'),
('partially_received', 'Partially Received', 'Purchase has been partially received'),
('received', 'Received', 'Purchase has been fully received'),
('cancelled', 'Cancelled', 'Purchase has been cancelled');


-- ------------------------------------------------------------
-- Sample Status
-- ------------------------------------------------------------

INSERT INTO sample_status (code, name, description)
VALUES
('pending', 'Pending', 'Sample is waiting for analysis'),
('analyzed', 'Analyzed', 'Sample has been analyzed'),
('approved', 'Approved', 'Analysis has been approved'),
('rejected', 'Rejected', 'Sample or analysis has been rejected');


-- ------------------------------------------------------------
-- Production / Pressing Operation Status
-- ------------------------------------------------------------

INSERT INTO production_status (code, name, description)
VALUES
('planned', 'Planned', 'Pressing operation is planned'),
('in_progress', 'In Progress', 'Pressing operation is currently running'),
('completed', 'Completed', 'Pressing operation is completed'),
('cancelled', 'Cancelled', 'Pressing operation has been cancelled');


-- ------------------------------------------------------------
-- Oil Movement Type
-- ------------------------------------------------------------

INSERT INTO oil_movement_type (code, name, description)
VALUES
('production_in', 'Production In', 'Oil entering stock from pressing'),
('transfer_in', 'Transfer In', 'Oil transferred into a tank'),
('transfer_out', 'Transfer Out', 'Oil transferred out of a tank'),
('sale_out', 'Sale Out', 'Oil leaving stock because of a sale'),
('loss', 'Loss', 'Oil lost from stock'),
('adjustment', 'Adjustment', 'Manual stock adjustment');


-- ------------------------------------------------------------
-- Invoice Type
-- ------------------------------------------------------------

INSERT INTO invoice_type (code, name, description)
VALUES
('purchase', 'Purchase', 'Supplier purchase invoice'),
('sale', 'Sale', 'Customer sales invoice');


-- ------------------------------------------------------------
-- Invoice Status
-- ------------------------------------------------------------

INSERT INTO invoice_status (code, name, description)
VALUES
('draft', 'Draft', 'Invoice is being prepared'),
('issued', 'Issued', 'Invoice has been issued'),
('partially_paid', 'Partially Paid', 'Invoice has been partially paid'),
('paid', 'Paid', 'Invoice has been fully paid'),
('cancelled', 'Cancelled', 'Invoice has been cancelled');


-- ------------------------------------------------------------
-- Payment Method
-- ------------------------------------------------------------

INSERT INTO payment_method (code, name, description)
VALUES
('cash', 'Cash', 'Cash payment'),
('bank_transfer', 'Bank Transfer', 'Bank transfer'),
('check', 'Check', 'Payment by check'),
('other', 'Other', 'Other payment method');


COMMIT;