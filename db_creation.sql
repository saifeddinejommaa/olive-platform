--
-- PostgreSQL database dump
--

\restrict o2GXX1V9xTHNmylLh5Qyj1CuYLum3oveCDFNG9Xa3w1u0gIP6gRaa0UOD7m3XDz

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.2

-- Started on 2026-08-23 23:31:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 275 (class 1255 OID 17653)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 274 (class 1259 OID 19016)
-- Name: document_counters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_counters (
    id integer NOT NULL,
    document_type character varying(50) NOT NULL,
    year integer NOT NULL,
    last_number integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.document_counters OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 19015)
-- Name: document_counters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.document_counters ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.document_counters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 18803)
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    parent_id integer,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 18802)
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.expense_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expense_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 18510)
-- Name: harvests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.harvests (
    id integer NOT NULL,
    harvest_number character varying(50) NOT NULL,
    plot_id integer NOT NULL,
    harvest_date date NOT NULL,
    quantity_kg numeric(14,3) NOT NULL,
    quality_grade character varying(100),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT harvests_quantity_kg_check CHECK ((quantity_kg > (0)::numeric))
);


ALTER TABLE public.harvests OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18509)
-- Name: harvests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.harvests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.harvests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 266 (class 1259 OID 18861)
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    description text NOT NULL,
    quantity numeric(14,3) DEFAULT 1 NOT NULL,
    unit_price numeric(14,4) NOT NULL,
    tax_rate numeric(6,3) DEFAULT 0 NOT NULL,
    total_amount numeric(16,2) GENERATED ALWAYS AS ((quantity * unit_price)) STORED,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT invoice_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT invoice_items_tax_rate_check CHECK ((tax_rate >= (0)::numeric)),
    CONSTRAINT invoice_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 18860)
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.invoice_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invoice_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 18413)
-- Name: invoice_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_status (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.invoice_status OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18412)
-- Name: invoice_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.invoice_status ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invoice_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 18398)
-- Name: invoice_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_type (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.invoice_type OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18397)
-- Name: invoice_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.invoice_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invoice_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 264 (class 1259 OID 18823)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_number character varying(100) NOT NULL,
    invoice_type_id integer NOT NULL,
    supplier_name character varying(200),
    customer_name character varying(200),
    invoice_date date NOT NULL,
    due_date date,
    subtotal numeric(16,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(16,2) DEFAULT 0 NOT NULL,
    total_amount numeric(16,2) DEFAULT 0 NOT NULL,
    status_id integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT invoices_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT invoices_tax_amount_check CHECK ((tax_amount >= (0)::numeric)),
    CONSTRAINT invoices_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 18822)
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.invoices ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 18616)
-- Name: lab_analyses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_analyses (
    id integer NOT NULL,
    analysis_number character varying(50) NOT NULL,
    sample_id integer NOT NULL,
    analysis_date timestamp with time zone DEFAULT now() NOT NULL,
    analyst_name character varying(150),
    general_quality character varying(100),
    estimated_oil_yield numeric(6,3),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lab_analyses_estimated_oil_yield_check CHECK (((estimated_oil_yield IS NULL) OR (estimated_oil_yield >= (0)::numeric)))
);


ALTER TABLE public.lab_analyses OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 18615)
-- Name: lab_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_analyses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lab_analyses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 250 (class 1259 OID 18641)
-- Name: lab_analysis_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_analysis_results (
    id integer NOT NULL,
    analysis_id integer NOT NULL,
    parameter_name character varying(150) NOT NULL,
    value_numeric numeric(16,6),
    value_text character varying(255),
    unit character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lab_analysis_results_check CHECK (((value_numeric IS NOT NULL) OR (value_text IS NOT NULL)))
);


ALTER TABLE public.lab_analysis_results OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 18640)
-- Name: lab_analysis_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_analysis_results ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lab_analysis_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 18716)
-- Name: oil_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oil_batches (
    id integer NOT NULL,
    batch_number character varying(50) NOT NULL,
    production_batch_id integer NOT NULL,
    production_date date NOT NULL,
    quantity_liters numeric(14,3) NOT NULL,
    quality_grade character varying(100),
    status character varying(50) DEFAULT 'available'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT oil_batches_quantity_liters_check CHECK ((quantity_liters > (0)::numeric))
);


ALTER TABLE public.oil_batches OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 18715)
-- Name: oil_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.oil_batches ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.oil_batches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 18383)
-- Name: oil_movement_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oil_movement_type (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.oil_movement_type OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18382)
-- Name: oil_movement_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.oil_movement_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.oil_movement_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 260 (class 1259 OID 18763)
-- Name: oil_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oil_movements (
    id integer NOT NULL,
    movement_number character varying(50) NOT NULL,
    movement_type_id integer NOT NULL,
    movement_date timestamp with time zone DEFAULT now() NOT NULL,
    oil_batch_id integer,
    source_tank_id integer,
    destination_tank_id integer,
    quantity_liters numeric(14,3) NOT NULL,
    reference_type character varying(50),
    reference_id integer,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT oil_movements_check CHECK (((source_tank_id IS NOT NULL) OR (destination_tank_id IS NOT NULL))),
    CONSTRAINT oil_movements_quantity_liters_check CHECK ((quantity_liters > (0)::numeric))
);


ALTER TABLE public.oil_movements OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 18762)
-- Name: oil_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.oil_movements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.oil_movements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 18559)
-- Name: olive_purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_purchase_items (
    id integer NOT NULL,
    purchase_id integer NOT NULL,
    variety_id integer,
    description text,
    agreed_quantity_kg numeric(14,3) NOT NULL,
    price_per_kg numeric(12,4) NOT NULL,
    total_amount numeric(16,2) GENERATED ALWAYS AS ((agreed_quantity_kg * price_per_kg)) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reference character varying(255) NOT NULL,
    CONSTRAINT olive_purchase_items_agreed_quantity_kg_check CHECK ((agreed_quantity_kg > (0)::numeric)),
    CONSTRAINT olive_purchase_items_price_per_kg_check CHECK ((price_per_kg >= (0)::numeric))
);


ALTER TABLE public.olive_purchase_items OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18558)
-- Name: olive_purchase_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.olive_purchase_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.olive_purchase_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 242 (class 1259 OID 18535)
-- Name: olive_purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_purchases (
    id integer NOT NULL,
    purchase_number character varying(50) NOT NULL,
    supplier_name character varying(200) NOT NULL,
    purchase_date date NOT NULL,
    status_id integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.olive_purchases OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18534)
-- Name: olive_purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.olive_purchases ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.olive_purchases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 18586)
-- Name: olive_samples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_samples (
    id integer NOT NULL,
    sample_number character varying(50) NOT NULL,
    purchase_id integer,
    sample_date timestamp with time zone DEFAULT now() NOT NULL,
    quantity_kg numeric(10,3),
    supplier_name character varying(200),
    status_id integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT olive_samples_quantity_kg_check CHECK (((quantity_kg IS NULL) OR (quantity_kg >= (0)::numeric)))
);


ALTER TABLE public.olive_samples OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 18585)
-- Name: olive_samples_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.olive_samples ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.olive_samples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 18467)
-- Name: olive_varieties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_varieties (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.olive_varieties OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18466)
-- Name: olive_varieties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.olive_varieties ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.olive_varieties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 18428)
-- Name: payment_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_method (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.payment_method OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18427)
-- Name: payment_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_method ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payment_method_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 268 (class 1259 OID 18888)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    payment_number character varying(50) NOT NULL,
    payment_date timestamp with time zone DEFAULT now() NOT NULL,
    amount numeric(16,2) NOT NULL,
    payment_method_id integer NOT NULL,
    invoice_id integer,
    supplier_name character varying(200),
    worker_name character varying(200),
    reference character varying(150),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_amount_check CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 18887)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 18483)
-- Name: plot_varieties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plot_varieties (
    id integer NOT NULL,
    plot_id integer NOT NULL,
    variety_id integer NOT NULL,
    number_of_trees integer,
    percentage numeric(5,2),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT plot_varieties_number_of_trees_check CHECK (((number_of_trees IS NULL) OR (number_of_trees >= 0))),
    CONSTRAINT plot_varieties_percentage_check CHECK (((percentage IS NULL) OR ((percentage >= (0)::numeric) AND (percentage <= (100)::numeric))))
);


ALTER TABLE public.plot_varieties OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18482)
-- Name: plot_varieties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.plot_varieties ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plot_varieties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 18443)
-- Name: plots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plots (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150),
    area_hectares numeric(12,4) NOT NULL,
    number_of_trees integer DEFAULT 0 NOT NULL,
    planting_year integer,
    location text,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT plots_area_hectares_check CHECK ((area_hectares >= (0)::numeric)),
    CONSTRAINT plots_number_of_trees_check CHECK ((number_of_trees >= 0)),
    CONSTRAINT plots_planting_year_check CHECK (((planting_year IS NULL) OR ((planting_year >= 1900) AND (planting_year <= 2100))))
);


ALTER TABLE public.plots OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18442)
-- Name: plots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.plots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 18686)
-- Name: pressing_operation_inputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pressing_operation_inputs (
    id integer CONSTRAINT production_batch_inputs_id_not_null NOT NULL,
    pressing_operation_id integer CONSTRAINT production_batch_inputs_production_batch_id_not_null NOT NULL,
    harvest_id integer,
    purchase_item_id integer,
    quantity_kg numeric(14,3) CONSTRAINT production_batch_inputs_quantity_kg_not_null NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT production_batch_inputs_created_at_not_null NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    CONSTRAINT pressing_operation_inputs_source_check CHECK ((((harvest_id IS NOT NULL) AND (purchase_item_id IS NULL)) OR ((harvest_id IS NULL) AND (purchase_item_id IS NOT NULL)))),
    CONSTRAINT pressing_operation_inputs_status_check CHECK ((status = ANY (ARRAY[0, 1, 2]))),
    CONSTRAINT production_batch_inputs_quantity_kg_check CHECK ((quantity_kg > (0)::numeric))
);


ALTER TABLE public.pressing_operation_inputs OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 18660)
-- Name: pressing_operations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pressing_operations (
    id integer CONSTRAINT production_batches_id_not_null NOT NULL,
    operation_number character varying(50) CONSTRAINT production_batches_batch_number_not_null NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    status_id integer CONSTRAINT production_batches_status_id_not_null NOT NULL,
    oil_quantity_liters numeric(14,3),
    notes text,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT production_batches_created_at_not_null NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT production_batches_updated_at_not_null NOT NULL,
    CONSTRAINT production_batches_oil_quantity_liters_check CHECK (((oil_quantity_liters IS NULL) OR (oil_quantity_liters >= (0)::numeric)))
);


ALTER TABLE public.pressing_operations OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 18685)
-- Name: production_batch_inputs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pressing_operation_inputs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_batch_inputs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 251 (class 1259 OID 18659)
-- Name: production_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pressing_operations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_batches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 18368)
-- Name: production_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_status (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.production_status OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18367)
-- Name: production_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.production_status ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 18338)
-- Name: purchase_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_status (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.purchase_status OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18337)
-- Name: purchase_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.purchase_status ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchase_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 18353)
-- Name: sample_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample_status (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.sample_status OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18352)
-- Name: sample_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sample_status ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sample_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 258 (class 1259 OID 18743)
-- Name: tanks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tanks (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150),
    capacity_liters numeric(14,3) NOT NULL,
    location character varying(150),
    tank_type character varying(100),
    status character varying(50) DEFAULT 'active'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tanks_capacity_liters_check CHECK ((capacity_liters > (0)::numeric))
);


ALTER TABLE public.tanks OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 18742)
-- Name: tanks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tanks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tanks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 272 (class 1259 OID 18937)
-- Name: work_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_sessions (
    id integer NOT NULL,
    worker_id integer NOT NULL,
    plot_id integer,
    work_date date NOT NULL,
    work_type character varying(100) NOT NULL,
    quantity numeric(12,3),
    unit character varying(50),
    amount numeric(12,2),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT work_sessions_amount_check CHECK (((amount IS NULL) OR (amount >= (0)::numeric)))
);


ALTER TABLE public.work_sessions OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 18936)
-- Name: work_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.work_sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.work_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 270 (class 1259 OID 18917)
-- Name: workers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workers (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    phone character varying(50),
    worker_type character varying(100),
    daily_rate numeric(12,2),
    is_active boolean DEFAULT true NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT workers_daily_rate_check CHECK (((daily_rate IS NULL) OR (daily_rate >= (0)::numeric)))
);


ALTER TABLE public.workers OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 18916)
-- Name: workers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.workers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.workers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5448 (class 0 OID 19016)
-- Dependencies: 274
-- Data for Name: document_counters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_counters (id, document_type, year, last_number) FROM stdin;
1	PRESSING	2026	2
\.


--
-- TOC entry 5436 (class 0 OID 18803)
-- Dependencies: 262
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, code, name, parent_id, description, created_at) FROM stdin;
1	AGRI	Agriculture	\N	Dépenses agricoles	2026-08-13 17:15:19.162248+02
2	FUEL	Carburant	\N	Carburant machines et véhicules	2026-08-13 17:15:19.162248+02
3	TRANSPORT	Transport	\N	Transport des olives	2026-08-13 17:15:19.162248+02
4	LAB	Laboratoire	\N	Analyses et laboratoire	2026-08-13 17:15:19.162248+02
5	MAINT	Maintenance	\N	Maintenance machines et équipements	2026-08-13 17:15:19.162248+02
6	SALARY	Main d'œuvre	\N	Paiements des travailleurs	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5414 (class 0 OID 18510)
-- Dependencies: 240
-- Data for Name: harvests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.harvests (id, harvest_number, plot_id, harvest_date, quantity_kg, quality_grade, notes, created_at, updated_at) FROM stdin;
4	HARV-2026-001	4	2026-10-15	18500.000	A	Première récolte de la saison	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
5	HARV-2026-002	5	2026-10-20	24200.000	A	Récolte principale	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
6	HARV-2026-003	6	2026-10-25	31000.000	B	Récolte jeune plantation	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5440 (class 0 OID 18861)
-- Dependencies: 266
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, description, quantity, unit_price, tax_rate, created_at) FROM stdin;
1	1	Fournitures agricoles	1.000	2500.0000	19.000	2026-08-13 17:15:19.162248+02
2	2	Transport olives	12.000	150.0000	19.000	2026-08-13 17:15:19.162248+02
3	3	Huile d'olive Extra Vierge	3000.000	5.0000	19.000	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5404 (class 0 OID 18413)
-- Dependencies: 230
-- Data for Name: invoice_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_status (id, code, name, description, is_active) FROM stdin;
1	draft	Draft	Invoice is being prepared	t
2	issued	Issued	Invoice has been issued	t
3	partially_paid	Partially Paid	Invoice has been partially paid	t
4	paid	Paid	Invoice has been fully paid	t
5	cancelled	Cancelled	Invoice has been cancelled	t
\.


--
-- TOC entry 5402 (class 0 OID 18398)
-- Dependencies: 228
-- Data for Name: invoice_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_type (id, code, name, description, is_active) FROM stdin;
1	purchase	Purchase	Supplier purchase invoice	t
2	sale	Sale	Customer sales invoice	t
\.


--
-- TOC entry 5438 (class 0 OID 18823)
-- Dependencies: 264
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_number, invoice_type_id, supplier_name, customer_name, invoice_date, due_date, subtotal, tax_amount, total_amount, status_id, notes, created_at, updated_at) FROM stdin;
1	FAC-ACH-2026-001	1	Fournitures Agricoles Tunisie	\N	2026-10-12	2026-11-12	2500.00	475.00	2975.00	2	Fournitures agricoles	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	FAC-ACH-2026-002	1	Transport Ben Salah	\N	2026-10-20	2026-11-20	1800.00	342.00	2142.00	3	Transport olives	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	FAC-VTE-2026-001	2	\N	Client Huile Premium	2026-10-25	2026-11-25	15000.00	2850.00	17850.00	2	Vente huile extra vierge	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5422 (class 0 OID 18616)
-- Dependencies: 248
-- Data for Name: lab_analyses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_analyses (id, analysis_number, sample_id, analysis_date, analyst_name, general_quality, estimated_oil_yield, notes, created_at, updated_at) FROM stdin;
1	ANALYSIS-2026-001	1	2026-10-10 14:00:00+02	Laboratoire Central	Excellent	22.500	Très bon potentiel d extraction	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	ANALYSIS-2026-002	2	2026-10-18 15:00:00+02	Laboratoire Central	Excellent	24.200	Qualité premium	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5424 (class 0 OID 18641)
-- Dependencies: 250
-- Data for Name: lab_analysis_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_analysis_results (id, analysis_id, parameter_name, value_numeric, value_text, unit, notes, created_at) FROM stdin;
1	1	Humidité	48.500000	\N	%	Valeur normale	2026-08-13 17:15:19.162248+02
2	1	Acidité	0.420000	\N	%	Très bonne acidité	2026-08-13 17:15:19.162248+02
3	1	Indice de peroxyde	5.800000	\N	meq O2/kg	Conforme	2026-08-13 17:15:19.162248+02
4	2	Humidité	46.200000	\N	%	Très bonne	2026-08-13 17:15:19.162248+02
5	2	Acidité	0.310000	\N	%	Excellente	2026-08-13 17:15:19.162248+02
6	2	Odeur	\N	Fruitée intense	\N	Profil aromatique intéressant	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5430 (class 0 OID 18716)
-- Dependencies: 256
-- Data for Name: oil_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oil_batches (id, batch_number, production_batch_id, production_date, quantity_liters, quality_grade, status, notes, created_at, updated_at) FROM stdin;
1	OIL-2026-001	1	2026-10-16	3600.000	Extra Virgin	available	Huile issue de PROD-2026-001	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	OIL-2026-002	2	2026-10-21	5060.000	Extra Virgin Premium	available	Huile premium	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5400 (class 0 OID 18383)
-- Dependencies: 226
-- Data for Name: oil_movement_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oil_movement_type (id, code, name, description, is_active) FROM stdin;
1	production_in	Production In	Oil entering stock from production	t
2	transfer_in	Transfer In	Oil transferred into a tank	t
3	transfer_out	Transfer Out	Oil transferred out of a tank	t
4	sale_out	Sale Out	Oil leaving stock because of a sale	t
5	loss	Loss	Oil lost from stock	t
6	adjustment	Adjustment	Manual stock adjustment	t
\.


--
-- TOC entry 5434 (class 0 OID 18763)
-- Dependencies: 260
-- Data for Name: oil_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oil_movements (id, movement_number, movement_type_id, movement_date, oil_batch_id, source_tank_id, destination_tank_id, quantity_liters, reference_type, reference_id, notes, created_at) FROM stdin;
1	MOV-2026-001	1	2026-10-16 19:00:00+02	1	\N	1	3600.000	production_batch	\N	Entrée production PROD-2026-001	2026-08-13 17:15:19.162248+02
2	MOV-2026-002	1	2026-10-21 20:00:00+02	2	\N	3	5060.000	production_batch	\N	Entrée production premium	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5418 (class 0 OID 18559)
-- Dependencies: 244
-- Data for Name: olive_purchase_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.olive_purchase_items (id, purchase_id, variety_id, description, agreed_quantity_kg, price_per_kg, notes, created_at, reference) FROM stdin;
1	1	5	Olives Arbequina	12000.000	1.8500	Qualité A	2026-08-13 17:15:19.162248+02	LOT-1231
2	2	6	Olives Koroneiki	8000.000	2.1000	Forte teneur en huile	2026-08-13 17:15:19.162248+02	LOT-1232
3	3	8	Olives Chemlali	15000.000	1.6500	Achat en vrac	2026-08-13 17:15:19.162248+02	LOT-1233
\.


--
-- TOC entry 5416 (class 0 OID 18535)
-- Dependencies: 242
-- Data for Name: olive_purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.olive_purchases (id, purchase_number, supplier_name, purchase_date, status_id, notes, created_at, updated_at) FROM stdin;
1	PUR-2026-001	Ahmed Ben Salah	2026-10-10	3	Achat olives qualité supérieure	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	PUR-2026-002	Coopérative El Amal	2026-10-18	5	Olives destinées à la production premium	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	PUR-2026-003	Ferme Agricole El Baraka	2026-10-22	2	En attente de validation	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5420 (class 0 OID 18586)
-- Dependencies: 246
-- Data for Name: olive_samples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.olive_samples (id, sample_number, purchase_id, sample_date, quantity_kg, supplier_name, status_id, notes, created_at, updated_at) FROM stdin;
1	SAMPLE-2026-001	1	2026-10-10 09:30:00+02	2.500	Ahmed Ben Salah	2	Échantillon avant achat	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	SAMPLE-2026-002	2	2026-10-18 10:00:00+02	2.500	Coopérative El Amal	3	Très bonne qualité	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	SAMPLE-2026-003	3	2026-10-22 11:00:00+02	2.500	Ferme Agricole El Baraka	1	Analyse en attente	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5410 (class 0 OID 18467)
-- Dependencies: 236
-- Data for Name: olive_varieties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.olive_varieties (id, name, description, created_at, updated_at) FROM stdin;
5	Arbequina	Petite olive espagnole, huile fruitée et douce	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
6	Koroneiki	Variété grecque, huile très fruitée et riche en polyphénols	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
7	Arbosana	Variété adaptée aux plantations intensives	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
8	Chemlali	Variété tunisienne, très répandue dans le sud	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5406 (class 0 OID 18428)
-- Dependencies: 232
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method (id, code, name, description, is_active) FROM stdin;
1	cash	Cash	Cash payment	t
2	bank_transfer	Bank Transfer	Bank transfer	t
3	check	Check	Payment by check	t
4	other	Other	Other payment method	t
\.


--
-- TOC entry 5442 (class 0 OID 18888)
-- Dependencies: 268
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, payment_number, payment_date, amount, payment_method_id, invoice_id, supplier_name, worker_name, reference, notes, created_at) FROM stdin;
1	PAY-2026-001	2026-10-15 10:00:00+02	1500.00	2	1	Fournitures Agricoles Tunisie	\N	VIR-20261015-001	Premier paiement fournisseur	2026-08-13 17:15:19.162248+02
2	PAY-2026-002	2026-10-22 10:00:00+02	1000.00	1	2	Transport Ben Salah	\N	\N	Paiement partiel transport	2026-08-13 17:15:19.162248+02
3	PAY-2026-003	2026-10-15 18:00:00+02	45.00	1	\N	\N	Mohamed Ali	\N	Paiement travail récolte	2026-08-13 17:15:19.162248+02
4	PAY-2026-004	2026-10-15 18:00:00+02	40.00	1	\N	\N	Ahmed Trabelsi	\N	Paiement travail récolte	2026-08-13 17:15:19.162248+02
5	PAY-2026-005	2026-10-16 18:00:00+02	440.00	1	\N	\N	Sami Ben Amor	\N	Paiement transport olives	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5412 (class 0 OID 18483)
-- Dependencies: 238
-- Data for Name: plot_varieties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plot_varieties (id, plot_id, variety_id, number_of_trees, percentage, notes, created_at) FROM stdin;
5	4	5	3000	57.69	Variété principale	2026-08-13 17:15:19.162248+02
6	4	6	2200	42.31	Deuxième variété	2026-08-13 17:15:19.162248+02
7	5	8	6800	100.00	Variété unique	2026-08-13 17:15:19.162248+02
8	6	5	8000	100.00	Plantation intensive	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5408 (class 0 OID 18443)
-- Dependencies: 234
-- Data for Name: plots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plots (id, code, name, area_hectares, number_of_trees, planting_year, location, notes, is_active, created_at, updated_at) FROM stdin;
4	PLOT-001	Oliveraie Nord	25.5000	5200	2018	Secteur Nord	Plantation principale	t	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
5	PLOT-002	Oliveraie Sud	32.7500	6800	2016	Secteur Sud	Production régulière	t	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
6	PLOT-003	Oliveraie Est	40.2000	8000	2019	Secteur Est	Jeune plantation à haut rendement	t	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5428 (class 0 OID 18686)
-- Dependencies: 254
-- Data for Name: pressing_operation_inputs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pressing_operation_inputs (id, pressing_operation_id, harvest_id, purchase_item_id, quantity_kg, notes, created_at, status) FROM stdin;
1	1	4	\N	18000.000	Olives provenant de la récolte PLOT-001	2026-08-13 17:15:19.162248+02	0
2	2	\N	2	8000.000	Olives achetées - Koroneiki	2026-08-13 17:15:19.162248+02	0
3	2	5	\N	15000.000	Olives récolte PLOT-002	2026-08-13 17:15:19.162248+02	0
4	8	\N	3	15000.000	\N	2026-08-19 00:00:00+02	0
5	9	6	\N	31000.000	\N	2026-08-19 00:00:00+02	0
6	10	6	\N	31000.000	\N	2026-08-20 00:00:00+02	0
7	11	\N	1	12000.000	\N	2026-08-21 00:00:00+02	0
\.


--
-- TOC entry 5426 (class 0 OID 18660)
-- Dependencies: 252
-- Data for Name: pressing_operations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pressing_operations (id, operation_number, start_time, end_time, status_id, oil_quantity_liters, notes, created_at, updated_at) FROM stdin;
1	PROD-2026-001	2026-10-16 06:00:00+02	2026-10-16 18:00:00+02	3	3600.000	Production olives exploitation	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	PROD-2026-002	2026-10-21 06:00:00+02	2026-10-21 19:00:00+02	3	5060.000	Production qualité premium	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	PROD-2026-003	\N	\N	1	\N	Production planifiée	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
4	PRESS-26-1	\N	\N	1	\N	\N	2026-08-19 00:00:00+02	2026-08-19 15:00:33.278074+02
8	PRESS-26-2	\N	\N	1	\N	\N	2026-08-19 00:00:00+02	2026-08-19 15:19:13.335463+02
9	PRESS-2026-2	\N	\N	1	\N	\N	2026-08-19 00:00:00+02	2026-08-19 16:26:02.112722+02
10	PRES-2026-001	\N	\N	1	\N	\N	2026-08-20 00:00:00+02	2026-08-20 11:06:45.588828+02
11	PRES-2026-002	\N	\N	1	\N	\N	2026-08-21 00:00:00+02	2026-08-20 15:13:30.216989+02
\.


--
-- TOC entry 5398 (class 0 OID 18368)
-- Dependencies: 224
-- Data for Name: production_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_status (id, code, name, description, is_active) FROM stdin;
1	planned	Planned	Production is planned	t
2	in_progress	In Progress	Production is currently running	t
3	completed	Completed	Production is completed	t
4	cancelled	Cancelled	Production has been cancelled	t
\.


--
-- TOC entry 5394 (class 0 OID 18338)
-- Dependencies: 220
-- Data for Name: purchase_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_status (id, code, name, description, is_active) FROM stdin;
1	draft	Draft	Purchase is being prepared	t
2	pending	Pending	Purchase is waiting for approval	t
3	approved	Approved	Purchase has been approved	t
4	partially_received	Partially Received	Purchase has been partially received	t
5	received	Received	Purchase has been fully received	t
6	cancelled	Cancelled	Purchase has been cancelled	t
\.


--
-- TOC entry 5396 (class 0 OID 18353)
-- Dependencies: 222
-- Data for Name: sample_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sample_status (id, code, name, description, is_active) FROM stdin;
1	pending	Pending	Sample is waiting for analysis	t
2	analyzed	Analyzed	Sample has been analyzed	t
3	approved	Approved	Analysis has been approved	t
4	rejected	Rejected	Sample or analysis has been rejected	t
\.


--
-- TOC entry 5432 (class 0 OID 18743)
-- Dependencies: 258
-- Data for Name: tanks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tanks (id, code, name, capacity_liters, location, tank_type, status, notes, created_at, updated_at) FROM stdin;
1	TANK-001	Citerne principale 1	10000.000	Zone stockage A	Inox	active	Citerne grande capacité	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	TANK-002	Citerne principale 2	10000.000	Zone stockage A	Inox	active	Citerne grande capacité	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	TANK-003	Citerne premium	5000.000	Zone stockage B	Inox	active	Réservée huile premium	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
4	TANK-004	Citerne tampon	3000.000	Zone production	Inox	active	Stockage temporaire	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5446 (class 0 OID 18937)
-- Dependencies: 272
-- Data for Name: work_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_sessions (id, worker_id, plot_id, work_date, work_type, quantity, unit, amount, notes, created_at) FROM stdin;
1	1	4	2026-10-15	Récolte	1.000	jour	45.00	Récolte olives	2026-08-13 17:15:19.162248+02
2	2	4	2026-10-15	Récolte	1.000	jour	40.00	Récolte olives	2026-08-13 17:15:19.162248+02
3	1	5	2026-10-20	Récolte	1.000	jour	45.00	Récolte olives	2026-08-13 17:15:19.162248+02
4	3	\N	2026-10-16	Transport olives	8.000	trajets	440.00	Transport vers pressoir	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5444 (class 0 OID 18917)
-- Dependencies: 270
-- Data for Name: workers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workers (id, code, name, phone, worker_type, daily_rate, is_active, notes, created_at, updated_at) FROM stdin;
1	W-001	Mohamed Ali	22123456	Agriculture	45.00	t	Responsable terrain	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
2	W-002	Ahmed Trabelsi	22345678	Agriculture	40.00	t	Ouvrier agricole	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
3	W-003	Sami Ben Amor	22456789	Transport	55.00	t	Chauffeur	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
4	W-004	Karim Mansour	22567890	Production	50.00	t	Opérateur pressoir	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
5	W-005	Hassan Gharbi	22678901	Agriculture	40.00	t	Ouvrier agricole	2026-08-13 17:15:19.162248+02	2026-08-13 17:15:19.162248+02
\.


--
-- TOC entry 5454 (class 0 OID 0)
-- Dependencies: 273
-- Name: document_counters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_counters_id_seq', 1, true);


--
-- TOC entry 5455 (class 0 OID 0)
-- Dependencies: 261
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 6, true);


--
-- TOC entry 5456 (class 0 OID 0)
-- Dependencies: 239
-- Name: harvests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.harvests_id_seq', 6, true);


--
-- TOC entry 5457 (class 0 OID 0)
-- Dependencies: 265
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 3, true);


--
-- TOC entry 5458 (class 0 OID 0)
-- Dependencies: 229
-- Name: invoice_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_status_id_seq', 5, true);


--
-- TOC entry 5459 (class 0 OID 0)
-- Dependencies: 227
-- Name: invoice_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_type_id_seq', 2, true);


--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 263
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 3, true);


--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 247
-- Name: lab_analyses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_analyses_id_seq', 2, true);


--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 249
-- Name: lab_analysis_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_analysis_results_id_seq', 6, true);


--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 255
-- Name: oil_batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oil_batches_id_seq', 2, true);


--
-- TOC entry 5464 (class 0 OID 0)
-- Dependencies: 225
-- Name: oil_movement_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oil_movement_type_id_seq', 6, true);


--
-- TOC entry 5465 (class 0 OID 0)
-- Dependencies: 259
-- Name: oil_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oil_movements_id_seq', 2, true);


--
-- TOC entry 5466 (class 0 OID 0)
-- Dependencies: 243
-- Name: olive_purchase_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.olive_purchase_items_id_seq', 3, true);


--
-- TOC entry 5467 (class 0 OID 0)
-- Dependencies: 241
-- Name: olive_purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.olive_purchases_id_seq', 3, true);


--
-- TOC entry 5468 (class 0 OID 0)
-- Dependencies: 245
-- Name: olive_samples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.olive_samples_id_seq', 3, true);


--
-- TOC entry 5469 (class 0 OID 0)
-- Dependencies: 235
-- Name: olive_varieties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.olive_varieties_id_seq', 8, true);


--
-- TOC entry 5470 (class 0 OID 0)
-- Dependencies: 231
-- Name: payment_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_method_id_seq', 4, true);


--
-- TOC entry 5471 (class 0 OID 0)
-- Dependencies: 267
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 5, true);


--
-- TOC entry 5472 (class 0 OID 0)
-- Dependencies: 237
-- Name: plot_varieties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plot_varieties_id_seq', 8, true);


--
-- TOC entry 5473 (class 0 OID 0)
-- Dependencies: 233
-- Name: plots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plots_id_seq', 6, true);


--
-- TOC entry 5474 (class 0 OID 0)
-- Dependencies: 253
-- Name: production_batch_inputs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_batch_inputs_id_seq', 7, true);


--
-- TOC entry 5475 (class 0 OID 0)
-- Dependencies: 251
-- Name: production_batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_batches_id_seq', 11, true);


--
-- TOC entry 5476 (class 0 OID 0)
-- Dependencies: 223
-- Name: production_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_status_id_seq', 4, true);


--
-- TOC entry 5477 (class 0 OID 0)
-- Dependencies: 219
-- Name: purchase_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_status_id_seq', 6, true);


--
-- TOC entry 5478 (class 0 OID 0)
-- Dependencies: 221
-- Name: sample_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sample_status_id_seq', 4, true);


--
-- TOC entry 5479 (class 0 OID 0)
-- Dependencies: 257
-- Name: tanks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tanks_id_seq', 4, true);


--
-- TOC entry 5480 (class 0 OID 0)
-- Dependencies: 271
-- Name: work_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_sessions_id_seq', 4, true);


--
-- TOC entry 5481 (class 0 OID 0)
-- Dependencies: 269
-- Name: workers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workers_id_seq', 5, true);


--
-- TOC entry 5175 (class 2606 OID 18816)
-- Name: expense_categories expense_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_code_key UNIQUE (code);


--
-- TOC entry 5177 (class 2606 OID 18814)
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5119 (class 2606 OID 18528)
-- Name: harvests harvests_harvest_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_harvest_number_key UNIQUE (harvest_number);


--
-- TOC entry 5121 (class 2606 OID 18526)
-- Name: harvests harvests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_pkey PRIMARY KEY (id);


--
-- TOC entry 5187 (class 2606 OID 18881)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 18426)
-- Name: invoice_status invoice_status_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_status
    ADD CONSTRAINT invoice_status_code_key UNIQUE (code);


--
-- TOC entry 5099 (class 2606 OID 18424)
-- Name: invoice_status invoice_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_status
    ADD CONSTRAINT invoice_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5093 (class 2606 OID 18411)
-- Name: invoice_type invoice_type_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_type
    ADD CONSTRAINT invoice_type_code_key UNIQUE (code);


--
-- TOC entry 5095 (class 2606 OID 18409)
-- Name: invoice_type invoice_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_type
    ADD CONSTRAINT invoice_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5182 (class 2606 OID 18849)
-- Name: invoices invoices_invoice_type_id_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_type_id_invoice_number_key UNIQUE (invoice_type_id, invoice_number);


--
-- TOC entry 5184 (class 2606 OID 18847)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5141 (class 2606 OID 18634)
-- Name: lab_analyses lab_analyses_analysis_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_analyses
    ADD CONSTRAINT lab_analyses_analysis_number_key UNIQUE (analysis_number);


--
-- TOC entry 5143 (class 2606 OID 18632)
-- Name: lab_analyses lab_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_analyses
    ADD CONSTRAINT lab_analyses_pkey PRIMARY KEY (id);


--
-- TOC entry 5146 (class 2606 OID 18653)
-- Name: lab_analysis_results lab_analysis_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_analysis_results
    ADD CONSTRAINT lab_analysis_results_pkey PRIMARY KEY (id);


--
-- TOC entry 5159 (class 2606 OID 18736)
-- Name: oil_batches oil_batches_batch_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_batch_number_key UNIQUE (batch_number);


--
-- TOC entry 5161 (class 2606 OID 18734)
-- Name: oil_batches oil_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_pkey PRIMARY KEY (id);


--
-- TOC entry 5089 (class 2606 OID 18396)
-- Name: oil_movement_type oil_movement_type_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movement_type
    ADD CONSTRAINT oil_movement_type_code_key UNIQUE (code);


--
-- TOC entry 5091 (class 2606 OID 18394)
-- Name: oil_movement_type oil_movement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movement_type
    ADD CONSTRAINT oil_movement_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5171 (class 2606 OID 18781)
-- Name: oil_movements oil_movements_movement_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_movement_number_key UNIQUE (movement_number);


--
-- TOC entry 5173 (class 2606 OID 18779)
-- Name: oil_movements oil_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 5132 (class 2606 OID 18574)
-- Name: olive_purchase_items olive_purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5126 (class 2606 OID 18550)
-- Name: olive_purchases olive_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_pkey PRIMARY KEY (id);


--
-- TOC entry 5128 (class 2606 OID 18552)
-- Name: olive_purchases olive_purchases_purchase_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_purchase_number_key UNIQUE (purchase_number);


--
-- TOC entry 5136 (class 2606 OID 18602)
-- Name: olive_samples olive_samples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_samples
    ADD CONSTRAINT olive_samples_pkey PRIMARY KEY (id);


--
-- TOC entry 5138 (class 2606 OID 18604)
-- Name: olive_samples olive_samples_sample_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_samples
    ADD CONSTRAINT olive_samples_sample_number_key UNIQUE (sample_number);


--
-- TOC entry 5109 (class 2606 OID 18481)
-- Name: olive_varieties olive_varieties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_varieties
    ADD CONSTRAINT olive_varieties_name_key UNIQUE (name);


--
-- TOC entry 5111 (class 2606 OID 18479)
-- Name: olive_varieties olive_varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_varieties
    ADD CONSTRAINT olive_varieties_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 18441)
-- Name: payment_method payment_method_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_code_key UNIQUE (code);


--
-- TOC entry 5103 (class 2606 OID 18439)
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (id);


--
-- TOC entry 5192 (class 2606 OID 18905)
-- Name: payments payments_payment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_key UNIQUE (payment_number);


--
-- TOC entry 5194 (class 2606 OID 18903)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5205 (class 2606 OID 19025)
-- Name: document_counters pk_document_counters; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_counters
    ADD CONSTRAINT pk_document_counters PRIMARY KEY (id);


--
-- TOC entry 5115 (class 2606 OID 18496)
-- Name: plot_varieties plot_varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_pkey PRIMARY KEY (id);


--
-- TOC entry 5117 (class 2606 OID 18498)
-- Name: plot_varieties plot_varieties_plot_id_variety_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_plot_id_variety_id_key UNIQUE (plot_id, variety_id);


--
-- TOC entry 5105 (class 2606 OID 18465)
-- Name: plots plots_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_code_key UNIQUE (code);


--
-- TOC entry 5107 (class 2606 OID 18463)
-- Name: plots plots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_pkey PRIMARY KEY (id);


--
-- TOC entry 5149 (class 2606 OID 18679)
-- Name: pressing_operations pressing_operations_operation_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT pressing_operations_operation_number_key UNIQUE (operation_number);


--
-- TOC entry 5156 (class 2606 OID 18699)
-- Name: pressing_operation_inputs production_batch_inputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT production_batch_inputs_pkey PRIMARY KEY (id);


--
-- TOC entry 5151 (class 2606 OID 18677)
-- Name: pressing_operations production_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT production_batches_pkey PRIMARY KEY (id);


--
-- TOC entry 5085 (class 2606 OID 18381)
-- Name: production_status production_status_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_status
    ADD CONSTRAINT production_status_code_key UNIQUE (code);


--
-- TOC entry 5087 (class 2606 OID 18379)
-- Name: production_status production_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_status
    ADD CONSTRAINT production_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5077 (class 2606 OID 18351)
-- Name: purchase_status purchase_status_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_status
    ADD CONSTRAINT purchase_status_code_key UNIQUE (code);


--
-- TOC entry 5079 (class 2606 OID 18349)
-- Name: purchase_status purchase_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_status
    ADD CONSTRAINT purchase_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5081 (class 2606 OID 18366)
-- Name: sample_status sample_status_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_status
    ADD CONSTRAINT sample_status_code_key UNIQUE (code);


--
-- TOC entry 5083 (class 2606 OID 18364)
-- Name: sample_status sample_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_status
    ADD CONSTRAINT sample_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5163 (class 2606 OID 18761)
-- Name: tanks tanks_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_code_key UNIQUE (code);


--
-- TOC entry 5165 (class 2606 OID 18759)
-- Name: tanks tanks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_pkey PRIMARY KEY (id);


--
-- TOC entry 5207 (class 2606 OID 19027)
-- Name: document_counters uq_document_counters_document_type_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_counters
    ADD CONSTRAINT uq_document_counters_document_type_year UNIQUE (document_type, year);


--
-- TOC entry 5203 (class 2606 OID 18950)
-- Name: work_sessions work_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 5196 (class 2606 OID 18935)
-- Name: workers workers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_code_key UNIQUE (code);


--
-- TOC entry 5198 (class 2606 OID 18933)
-- Name: workers workers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_pkey PRIMARY KEY (id);


--
-- TOC entry 5122 (class 1259 OID 18964)
-- Name: idx_harvests_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_harvests_date ON public.harvests USING btree (harvest_date);


--
-- TOC entry 5123 (class 1259 OID 18963)
-- Name: idx_harvests_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_harvests_plot_id ON public.harvests USING btree (plot_id);


--
-- TOC entry 5185 (class 1259 OID 18984)
-- Name: idx_invoice_items_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items USING btree (invoice_id);


--
-- TOC entry 5178 (class 1259 OID 18981)
-- Name: idx_invoices_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_date ON public.invoices USING btree (invoice_date);


--
-- TOC entry 5179 (class 1259 OID 18983)
-- Name: idx_invoices_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_status_id ON public.invoices USING btree (status_id);


--
-- TOC entry 5180 (class 1259 OID 18982)
-- Name: idx_invoices_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_type_id ON public.invoices USING btree (invoice_type_id);


--
-- TOC entry 5139 (class 1259 OID 18970)
-- Name: idx_lab_analyses_sample_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_analyses_sample_id ON public.lab_analyses USING btree (sample_id);


--
-- TOC entry 5144 (class 1259 OID 18971)
-- Name: idx_lab_results_analysis_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_results_analysis_id ON public.lab_analysis_results USING btree (analysis_id);


--
-- TOC entry 5157 (class 1259 OID 18976)
-- Name: idx_oil_batches_production_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_batches_production_batch_id ON public.oil_batches USING btree (production_batch_id);


--
-- TOC entry 5166 (class 1259 OID 18980)
-- Name: idx_oil_movements_destination_tank_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_destination_tank_id ON public.oil_movements USING btree (destination_tank_id);


--
-- TOC entry 5167 (class 1259 OID 18978)
-- Name: idx_oil_movements_oil_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_oil_batch_id ON public.oil_movements USING btree (oil_batch_id);


--
-- TOC entry 5168 (class 1259 OID 18979)
-- Name: idx_oil_movements_source_tank_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_source_tank_id ON public.oil_movements USING btree (source_tank_id);


--
-- TOC entry 5169 (class 1259 OID 18977)
-- Name: idx_oil_movements_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_type_id ON public.oil_movements USING btree (movement_type_id);


--
-- TOC entry 5124 (class 1259 OID 18965)
-- Name: idx_olive_purchases_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_olive_purchases_status_id ON public.olive_purchases USING btree (status_id);


--
-- TOC entry 5133 (class 1259 OID 18968)
-- Name: idx_olive_samples_purchase_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_olive_samples_purchase_id ON public.olive_samples USING btree (purchase_id);


--
-- TOC entry 5134 (class 1259 OID 18969)
-- Name: idx_olive_samples_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_olive_samples_status_id ON public.olive_samples USING btree (status_id);


--
-- TOC entry 5188 (class 1259 OID 18987)
-- Name: idx_payments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_date ON public.payments USING btree (payment_date);


--
-- TOC entry 5189 (class 1259 OID 18985)
-- Name: idx_payments_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_invoice_id ON public.payments USING btree (invoice_id);


--
-- TOC entry 5190 (class 1259 OID 18986)
-- Name: idx_payments_payment_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payment_method_id ON public.payments USING btree (payment_method_id);


--
-- TOC entry 5112 (class 1259 OID 18961)
-- Name: idx_plot_varieties_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plot_varieties_plot_id ON public.plot_varieties USING btree (plot_id);


--
-- TOC entry 5113 (class 1259 OID 18962)
-- Name: idx_plot_varieties_variety_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plot_varieties_variety_id ON public.plot_varieties USING btree (variety_id);


--
-- TOC entry 5152 (class 1259 OID 19010)
-- Name: idx_pressing_operation_inputs_harvest_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_harvest_id ON public.pressing_operation_inputs USING btree (harvest_id);


--
-- TOC entry 5153 (class 1259 OID 19009)
-- Name: idx_pressing_operation_inputs_operation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_operation_id ON public.pressing_operation_inputs USING btree (pressing_operation_id);


--
-- TOC entry 5154 (class 1259 OID 19011)
-- Name: idx_pressing_operation_inputs_purchase_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_purchase_item_id ON public.pressing_operation_inputs USING btree (purchase_item_id);


--
-- TOC entry 5147 (class 1259 OID 19012)
-- Name: idx_pressing_operations_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operations_status_id ON public.pressing_operations USING btree (status_id);


--
-- TOC entry 5129 (class 1259 OID 18966)
-- Name: idx_purchase_items_purchase_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_items_purchase_id ON public.olive_purchase_items USING btree (purchase_id);


--
-- TOC entry 5130 (class 1259 OID 18967)
-- Name: idx_purchase_items_variety_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_items_variety_id ON public.olive_purchase_items USING btree (variety_id);


--
-- TOC entry 5199 (class 1259 OID 18990)
-- Name: idx_work_sessions_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_date ON public.work_sessions USING btree (work_date);


--
-- TOC entry 5200 (class 1259 OID 18989)
-- Name: idx_work_sessions_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_plot_id ON public.work_sessions USING btree (plot_id);


--
-- TOC entry 5201 (class 1259 OID 18988)
-- Name: idx_work_sessions_worker_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_worker_id ON public.work_sessions USING btree (worker_id);


--
-- TOC entry 5237 (class 2620 OID 18993)
-- Name: harvests trg_harvests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_harvests_updated_at BEFORE UPDATE ON public.harvests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5244 (class 2620 OID 19000)
-- Name: invoices trg_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5240 (class 2620 OID 18996)
-- Name: lab_analyses trg_lab_analyses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_lab_analyses_updated_at BEFORE UPDATE ON public.lab_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5242 (class 2620 OID 18998)
-- Name: oil_batches trg_oil_batches_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_oil_batches_updated_at BEFORE UPDATE ON public.oil_batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5238 (class 2620 OID 18994)
-- Name: olive_purchases trg_olive_purchases_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_olive_purchases_updated_at BEFORE UPDATE ON public.olive_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5239 (class 2620 OID 18995)
-- Name: olive_samples trg_olive_samples_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_olive_samples_updated_at BEFORE UPDATE ON public.olive_samples FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5236 (class 2620 OID 18992)
-- Name: olive_varieties trg_olive_varieties_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_olive_varieties_updated_at BEFORE UPDATE ON public.olive_varieties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5235 (class 2620 OID 18991)
-- Name: plots trg_plots_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_plots_updated_at BEFORE UPDATE ON public.plots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5241 (class 2620 OID 19013)
-- Name: pressing_operations trg_pressing_operations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pressing_operations_updated_at BEFORE UPDATE ON public.pressing_operations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5243 (class 2620 OID 18999)
-- Name: tanks trg_tanks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_tanks_updated_at BEFORE UPDATE ON public.tanks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5245 (class 2620 OID 19001)
-- Name: workers trg_workers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_workers_updated_at BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5227 (class 2606 OID 18817)
-- Name: expense_categories expense_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.expense_categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5210 (class 2606 OID 18529)
-- Name: harvests harvests_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE RESTRICT;


--
-- TOC entry 5230 (class 2606 OID 18882)
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- TOC entry 5228 (class 2606 OID 18850)
-- Name: invoices invoices_invoice_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_type_id_fkey FOREIGN KEY (invoice_type_id) REFERENCES public.invoice_type(id) ON DELETE RESTRICT;


--
-- TOC entry 5229 (class 2606 OID 18855)
-- Name: invoices invoices_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.invoice_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5216 (class 2606 OID 18635)
-- Name: lab_analyses lab_analyses_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_analyses
    ADD CONSTRAINT lab_analyses_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.olive_samples(id) ON DELETE CASCADE;


--
-- TOC entry 5217 (class 2606 OID 18654)
-- Name: lab_analysis_results lab_analysis_results_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_analysis_results
    ADD CONSTRAINT lab_analysis_results_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.lab_analyses(id) ON DELETE CASCADE;


--
-- TOC entry 5222 (class 2606 OID 18737)
-- Name: oil_batches oil_batches_production_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_production_batch_id_fkey FOREIGN KEY (production_batch_id) REFERENCES public.pressing_operations(id) ON DELETE RESTRICT;


--
-- TOC entry 5223 (class 2606 OID 18797)
-- Name: oil_movements oil_movements_destination_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_destination_tank_id_fkey FOREIGN KEY (destination_tank_id) REFERENCES public.tanks(id) ON DELETE RESTRICT;


--
-- TOC entry 5224 (class 2606 OID 18782)
-- Name: oil_movements oil_movements_movement_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_movement_type_id_fkey FOREIGN KEY (movement_type_id) REFERENCES public.oil_movement_type(id) ON DELETE RESTRICT;


--
-- TOC entry 5225 (class 2606 OID 18787)
-- Name: oil_movements oil_movements_oil_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_oil_batch_id_fkey FOREIGN KEY (oil_batch_id) REFERENCES public.oil_batches(id) ON DELETE RESTRICT;


--
-- TOC entry 5226 (class 2606 OID 18792)
-- Name: oil_movements oil_movements_source_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_source_tank_id_fkey FOREIGN KEY (source_tank_id) REFERENCES public.tanks(id) ON DELETE RESTRICT;


--
-- TOC entry 5212 (class 2606 OID 18575)
-- Name: olive_purchase_items olive_purchase_items_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.olive_purchases(id) ON DELETE CASCADE;


--
-- TOC entry 5213 (class 2606 OID 18580)
-- Name: olive_purchase_items olive_purchase_items_variety_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_variety_id_fkey FOREIGN KEY (variety_id) REFERENCES public.olive_varieties(id) ON DELETE RESTRICT;


--
-- TOC entry 5211 (class 2606 OID 18553)
-- Name: olive_purchases olive_purchases_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.purchase_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5214 (class 2606 OID 18605)
-- Name: olive_samples olive_samples_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_samples
    ADD CONSTRAINT olive_samples_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.olive_purchases(id) ON DELETE SET NULL;


--
-- TOC entry 5215 (class 2606 OID 18610)
-- Name: olive_samples olive_samples_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_samples
    ADD CONSTRAINT olive_samples_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.sample_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5231 (class 2606 OID 18911)
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- TOC entry 5232 (class 2606 OID 18906)
-- Name: payments payments_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id) ON DELETE RESTRICT;


--
-- TOC entry 5208 (class 2606 OID 18499)
-- Name: plot_varieties plot_varieties_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE CASCADE;


--
-- TOC entry 5209 (class 2606 OID 18504)
-- Name: plot_varieties plot_varieties_variety_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_variety_id_fkey FOREIGN KEY (variety_id) REFERENCES public.olive_varieties(id) ON DELETE RESTRICT;


--
-- TOC entry 5219 (class 2606 OID 19004)
-- Name: pressing_operation_inputs pressing_operation_inputs_pressing_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT pressing_operation_inputs_pressing_operation_id_fkey FOREIGN KEY (pressing_operation_id) REFERENCES public.pressing_operations(id) ON DELETE CASCADE;


--
-- TOC entry 5220 (class 2606 OID 18705)
-- Name: pressing_operation_inputs production_batch_inputs_harvest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT production_batch_inputs_harvest_id_fkey FOREIGN KEY (harvest_id) REFERENCES public.harvests(id) ON DELETE RESTRICT;


--
-- TOC entry 5221 (class 2606 OID 18710)
-- Name: pressing_operation_inputs production_batch_inputs_purchase_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT production_batch_inputs_purchase_item_id_fkey FOREIGN KEY (purchase_item_id) REFERENCES public.olive_purchase_items(id) ON DELETE RESTRICT;


--
-- TOC entry 5218 (class 2606 OID 18680)
-- Name: pressing_operations production_batches_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT production_batches_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.production_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5233 (class 2606 OID 18956)
-- Name: work_sessions work_sessions_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE RESTRICT;


--
-- TOC entry 5234 (class 2606 OID 18951)
-- Name: work_sessions work_sessions_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id) ON DELETE RESTRICT;


-- Completed on 2026-08-23 23:31:23

--
-- PostgreSQL database dump complete
--

\unrestrict o2GXX1V9xTHNmylLh5Qyj1CuYLum3oveCDFNG9Xa3w1u0gIP6gRaa0UOD7m3XDz

