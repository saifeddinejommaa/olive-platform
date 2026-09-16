--
-- PostgreSQL database dump
--

\restrict kyo8Iyhu9penWEW3cQlhi5FjcHEPDkZPmdMI8f1WKpJidJED8fEY1J5CQa7Z9No

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.2

-- Started on 2026-09-15 15:34:21

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
-- TOC entry 279 (class 1255 OID 17653)
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
-- TOC entry 268 (class 1259 OID 19016)
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
-- TOC entry 267 (class 1259 OID 19015)
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
-- TOC entry 256 (class 1259 OID 18803)
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
-- TOC entry 255 (class 1259 OID 18802)
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
-- TOC entry 270 (class 1259 OID 19287)
-- Name: harvest_stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.harvest_stock (
    id bigint NOT NULL,
    harvest_id bigint NOT NULL,
    reference character varying(100) CONSTRAINT harvest_stock_lot_number_not_null NOT NULL,
    status character varying(30) DEFAULT 'AVAILABLE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    quantity_kg numeric
);


ALTER TABLE public.harvest_stock OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 19286)
-- Name: harvest_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.harvest_stock ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.harvest_stock_id_seq
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
    reference character varying(50) CONSTRAINT harvests_harvest_number_not_null NOT NULL,
    plot_id integer NOT NULL,
    harvest_date date NOT NULL,
    quantity_kg numeric(14,3) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status integer DEFAULT 1 CONSTRAINT harvests_status_id_not_null NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    harvested_trees integer,
    variety_id integer NOT NULL,
    planned_trees integer DEFAULT 0 NOT NULL,
    CONSTRAINT harvests_quantity_kg_check CHECK ((quantity_kg >= (0)::numeric))
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
-- TOC entry 260 (class 1259 OID 18861)
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
-- TOC entry 259 (class 1259 OID 18860)
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
    label character varying(100) CONSTRAINT invoice_status_name_not_null NOT NULL,
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
    label character varying(100) CONSTRAINT invoice_type_name_not_null NOT NULL,
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
-- TOC entry 258 (class 1259 OID 18823)
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
-- TOC entry 257 (class 1259 OID 18822)
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
-- TOC entry 276 (class 1259 OID 19399)
-- Name: oil_analyses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oil_analyses (
    id integer NOT NULL,
    reference character varying(50) NOT NULL,
    source_type_id integer NOT NULL,
    source_id integer NOT NULL,
    acidity_percentage numeric(5,2),
    peroxide_index numeric(6,2),
    k232 numeric(6,3),
    k270 numeric(6,3),
    organoleptic_grade integer,
    analysis_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    status integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.oil_analyses OWNER TO postgres;

--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 276
-- Name: COLUMN oil_analyses.source_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.oil_analyses.source_type_id IS '1 = PressingOperation (analyse indicative post-pressage), 2 = Tank (classification finale après repos)';


--
-- TOC entry 275 (class 1259 OID 19398)
-- Name: oil_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oil_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.oil_analyses_id_seq OWNER TO postgres;

--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 275
-- Name: oil_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oil_analyses_id_seq OWNED BY public.oil_analyses.id;


--
-- TOC entry 250 (class 1259 OID 18716)
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
-- TOC entry 249 (class 1259 OID 18715)
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
    label character varying(100) CONSTRAINT oil_movement_type_name_not_null NOT NULL,
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
-- TOC entry 254 (class 1259 OID 18763)
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
-- TOC entry 253 (class 1259 OID 18762)
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
-- TOC entry 274 (class 1259 OID 19345)
-- Name: olive_analyses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_analyses (
    id integer NOT NULL,
    source_type integer NOT NULL,
    source_id integer NOT NULL,
    humidity_percentage numeric(10,3),
    water_percentage numeric(10,3),
    oil_percentage numeric(10,3),
    acidity_percentage numeric(10,3),
    analysis_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    reference character varying(50)
);


ALTER TABLE public.olive_analyses OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 19344)
-- Name: olive_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.olive_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.olive_analyses_id_seq OWNER TO postgres;

--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 273
-- Name: olive_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.olive_analyses_id_seq OWNED BY public.olive_analyses.id;


--
-- TOC entry 244 (class 1259 OID 18559)
-- Name: olive_purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_purchase_items (
    id integer NOT NULL,
    purchase_id integer NOT NULL,
    variety_id integer,
    agreed_quantity_kg numeric(14,3) NOT NULL,
    price_per_kg numeric(12,4) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reference character varying(255) NOT NULL,
    updated_at date,
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
    reference character varying(50) CONSTRAINT olive_purchases_purchase_number_not_null NOT NULL,
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
-- TOC entry 236 (class 1259 OID 18467)
-- Name: olive_varieties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.olive_varieties (
    id integer NOT NULL,
    label character varying(100) CONSTRAINT olive_varieties_name_not_null NOT NULL,
    is_active boolean DEFAULT true NOT NULL
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
    label character varying(100) CONSTRAINT payment_method_name_not_null NOT NULL,
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
-- TOC entry 262 (class 1259 OID 18888)
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
-- TOC entry 261 (class 1259 OID 18887)
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
    reference character varying(50) CONSTRAINT plots_code_not_null NOT NULL,
    name character varying(150),
    area_hectares numeric(12,4) NOT NULL,
    number_of_trees integer DEFAULT 0 NOT NULL,
    planting_year integer,
    location text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
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
-- TOC entry 248 (class 1259 OID 18686)
-- Name: pressing_operation_inputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pressing_operation_inputs (
    id integer CONSTRAINT production_batch_inputs_id_not_null NOT NULL,
    pressing_operation_id integer CONSTRAINT production_batch_inputs_production_batch_id_not_null NOT NULL,
    purchase_item_id integer,
    quantity_kg numeric(14,3) CONSTRAINT production_batch_inputs_quantity_kg_not_null NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT production_batch_inputs_created_at_not_null NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    harvest_id integer,
    CONSTRAINT pressing_operation_inputs_status_check CHECK ((status = ANY (ARRAY[0, 1, 2]))),
    CONSTRAINT production_batch_inputs_quantity_kg_check CHECK ((quantity_kg > (0)::numeric))
);


ALTER TABLE public.pressing_operation_inputs OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 18660)
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
    expected_oil_liters numeric,
    oil_yield_deviation_liters numeric,
    CONSTRAINT production_batches_oil_quantity_liters_check CHECK (((oil_quantity_liters IS NULL) OR (oil_quantity_liters >= (0)::numeric)))
);


ALTER TABLE public.pressing_operations OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 19417)
-- Name: pressing_parameters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pressing_parameters (
    id integer NOT NULL,
    pressing_operation_id integer NOT NULL,
    process_type_id integer,
    mill_id integer,
    malaxing_temperature_c numeric(6,2),
    malaxing_duration_minutes integer,
    malaxing_speed_rpm numeric(8,2),
    feed_rate_kg_h numeric(10,2),
    decanter_speed_rpm numeric(8,2),
    decanter_differential_rpm numeric(8,2),
    centrifuge_speed_rpm numeric(8,2),
    added_water_liters numeric(10,2),
    water_temperature_c numeric(6,2),
    waiting_time_before_extraction_minutes integer,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_added_water CHECK (((added_water_liters IS NULL) OR (added_water_liters >= (0)::numeric))),
    CONSTRAINT chk_feed_rate CHECK (((feed_rate_kg_h IS NULL) OR (feed_rate_kg_h >= (0)::numeric))),
    CONSTRAINT chk_malaxing_duration CHECK (((malaxing_duration_minutes IS NULL) OR (malaxing_duration_minutes >= 0))),
    CONSTRAINT chk_malaxing_speed CHECK (((malaxing_speed_rpm IS NULL) OR (malaxing_speed_rpm >= (0)::numeric))),
    CONSTRAINT chk_malaxing_temperature CHECK (((malaxing_temperature_c IS NULL) OR (malaxing_temperature_c >= (0)::numeric)))
);


ALTER TABLE public.pressing_parameters OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 19416)
-- Name: pressing_parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pressing_parameters ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pressing_parameters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 247 (class 1259 OID 18685)
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
-- TOC entry 245 (class 1259 OID 18659)
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
    label character varying(100) CONSTRAINT production_status_name_not_null NOT NULL,
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
    label character varying(100) CONSTRAINT purchase_status_name_not_null NOT NULL,
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
-- TOC entry 272 (class 1259 OID 19334)
-- Name: source_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.source_types (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.source_types OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 19333)
-- Name: source_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.source_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.source_types_id_seq OWNER TO postgres;

--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 271
-- Name: source_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.source_types_id_seq OWNED BY public.source_types.id;


--
-- TOC entry 252 (class 1259 OID 18743)
-- Name: tanks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tanks (
    id integer NOT NULL,
    reference character varying(50) CONSTRAINT tanks_code_not_null NOT NULL,
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
-- TOC entry 251 (class 1259 OID 18742)
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
-- TOC entry 266 (class 1259 OID 18937)
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
-- TOC entry 265 (class 1259 OID 18936)
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
-- TOC entry 264 (class 1259 OID 18917)
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
-- TOC entry 263 (class 1259 OID 18916)
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
-- TOC entry 5056 (class 2604 OID 19402)
-- Name: oil_analyses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_analyses ALTER COLUMN id SET DEFAULT nextval('public.oil_analyses_id_seq'::regclass);


--
-- TOC entry 5054 (class 2604 OID 19348)
-- Name: olive_analyses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_analyses ALTER COLUMN id SET DEFAULT nextval('public.olive_analyses_id_seq'::regclass);


--
-- TOC entry 5052 (class 2604 OID 19337)
-- Name: source_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source_types ALTER COLUMN id SET DEFAULT nextval('public.source_types_id_seq'::regclass);


--
-- TOC entry 5163 (class 2606 OID 18816)
-- Name: expense_categories expense_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_code_key UNIQUE (code);


--
-- TOC entry 5165 (class 2606 OID 18814)
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5197 (class 2606 OID 19302)
-- Name: harvest_stock harvest_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvest_stock
    ADD CONSTRAINT harvest_stock_pkey PRIMARY KEY (id);


--
-- TOC entry 5121 (class 2606 OID 18528)
-- Name: harvests harvests_harvest_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_harvest_number_key UNIQUE (reference);


--
-- TOC entry 5123 (class 2606 OID 18526)
-- Name: harvests harvests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_pkey PRIMARY KEY (id);


--
-- TOC entry 5175 (class 2606 OID 18881)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5103 (class 2606 OID 18424)
-- Name: invoice_status invoice_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_status
    ADD CONSTRAINT invoice_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 18409)
-- Name: invoice_type invoice_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_type
    ADD CONSTRAINT invoice_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5170 (class 2606 OID 18849)
-- Name: invoices invoices_invoice_type_id_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_type_id_invoice_number_key UNIQUE (invoice_type_id, invoice_number);


--
-- TOC entry 5172 (class 2606 OID 18847)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5205 (class 2606 OID 19412)
-- Name: oil_analyses oil_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_analyses
    ADD CONSTRAINT oil_analyses_pkey PRIMARY KEY (id);


--
-- TOC entry 5207 (class 2606 OID 19414)
-- Name: oil_analyses oil_analyses_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_analyses
    ADD CONSTRAINT oil_analyses_reference_key UNIQUE (reference);


--
-- TOC entry 5147 (class 2606 OID 18736)
-- Name: oil_batches oil_batches_batch_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_batch_number_key UNIQUE (batch_number);


--
-- TOC entry 5149 (class 2606 OID 18734)
-- Name: oil_batches oil_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_pkey PRIMARY KEY (id);


--
-- TOC entry 5099 (class 2606 OID 18394)
-- Name: oil_movement_type oil_movement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movement_type
    ADD CONSTRAINT oil_movement_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5159 (class 2606 OID 18781)
-- Name: oil_movements oil_movements_movement_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_movement_number_key UNIQUE (movement_number);


--
-- TOC entry 5161 (class 2606 OID 18779)
-- Name: oil_movements oil_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 5202 (class 2606 OID 19360)
-- Name: olive_analyses olive_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_analyses
    ADD CONSTRAINT olive_analyses_pkey PRIMARY KEY (id);


--
-- TOC entry 5134 (class 2606 OID 18574)
-- Name: olive_purchase_items olive_purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5128 (class 2606 OID 18550)
-- Name: olive_purchases olive_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_pkey PRIMARY KEY (id);


--
-- TOC entry 5130 (class 2606 OID 18552)
-- Name: olive_purchases olive_purchases_purchase_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_purchase_number_key UNIQUE (reference);


--
-- TOC entry 5111 (class 2606 OID 18481)
-- Name: olive_varieties olive_varieties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_varieties
    ADD CONSTRAINT olive_varieties_name_key UNIQUE (label);


--
-- TOC entry 5113 (class 2606 OID 18479)
-- Name: olive_varieties olive_varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_varieties
    ADD CONSTRAINT olive_varieties_pkey PRIMARY KEY (id);


--
-- TOC entry 5105 (class 2606 OID 18439)
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (id);


--
-- TOC entry 5180 (class 2606 OID 18905)
-- Name: payments payments_payment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_key UNIQUE (payment_number);


--
-- TOC entry 5182 (class 2606 OID 18903)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5193 (class 2606 OID 19025)
-- Name: document_counters pk_document_counters; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_counters
    ADD CONSTRAINT pk_document_counters PRIMARY KEY (id);


--
-- TOC entry 5117 (class 2606 OID 18496)
-- Name: plot_varieties plot_varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_pkey PRIMARY KEY (id);


--
-- TOC entry 5119 (class 2606 OID 18498)
-- Name: plot_varieties plot_varieties_plot_id_variety_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_plot_id_variety_id_key UNIQUE (plot_id, variety_id);


--
-- TOC entry 5107 (class 2606 OID 18465)
-- Name: plots plots_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_code_key UNIQUE (reference);


--
-- TOC entry 5109 (class 2606 OID 18463)
-- Name: plots plots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_pkey PRIMARY KEY (id);


--
-- TOC entry 5137 (class 2606 OID 18679)
-- Name: pressing_operations pressing_operations_operation_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT pressing_operations_operation_number_key UNIQUE (operation_number);


--
-- TOC entry 5209 (class 2606 OID 19434)
-- Name: pressing_parameters pressing_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_parameters
    ADD CONSTRAINT pressing_parameters_pkey PRIMARY KEY (id);


--
-- TOC entry 5144 (class 2606 OID 18699)
-- Name: pressing_operation_inputs production_batch_inputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT production_batch_inputs_pkey PRIMARY KEY (id);


--
-- TOC entry 5139 (class 2606 OID 18677)
-- Name: pressing_operations production_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT production_batches_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 18379)
-- Name: production_status production_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_status
    ADD CONSTRAINT production_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5091 (class 2606 OID 18349)
-- Name: purchase_status purchase_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_status
    ADD CONSTRAINT purchase_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5093 (class 2606 OID 18366)
-- Name: sample_status sample_status_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_status
    ADD CONSTRAINT sample_status_code_key UNIQUE (code);


--
-- TOC entry 5095 (class 2606 OID 18364)
-- Name: sample_status sample_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_status
    ADD CONSTRAINT sample_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5199 (class 2606 OID 19343)
-- Name: source_types source_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source_types
    ADD CONSTRAINT source_types_pkey PRIMARY KEY (id);


--
-- TOC entry 5151 (class 2606 OID 18761)
-- Name: tanks tanks_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_code_key UNIQUE (reference);


--
-- TOC entry 5153 (class 2606 OID 18759)
-- Name: tanks tanks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_pkey PRIMARY KEY (id);


--
-- TOC entry 5195 (class 2606 OID 19027)
-- Name: document_counters uq_document_counters_document_type_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_counters
    ADD CONSTRAINT uq_document_counters_document_type_year UNIQUE (document_type, year);


--
-- TOC entry 5211 (class 2606 OID 19436)
-- Name: pressing_parameters uq_pressing_parameters_operation; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_parameters
    ADD CONSTRAINT uq_pressing_parameters_operation UNIQUE (pressing_operation_id);


--
-- TOC entry 5191 (class 2606 OID 18950)
-- Name: work_sessions work_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 18935)
-- Name: workers workers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_code_key UNIQUE (code);


--
-- TOC entry 5186 (class 2606 OID 18933)
-- Name: workers workers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_pkey PRIMARY KEY (id);


--
-- TOC entry 5124 (class 1259 OID 18964)
-- Name: idx_harvests_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_harvests_date ON public.harvests USING btree (harvest_date);


--
-- TOC entry 5125 (class 1259 OID 18963)
-- Name: idx_harvests_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_harvests_plot_id ON public.harvests USING btree (plot_id);


--
-- TOC entry 5173 (class 1259 OID 18984)
-- Name: idx_invoice_items_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items USING btree (invoice_id);


--
-- TOC entry 5166 (class 1259 OID 18981)
-- Name: idx_invoices_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_date ON public.invoices USING btree (invoice_date);


--
-- TOC entry 5167 (class 1259 OID 18983)
-- Name: idx_invoices_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_status_id ON public.invoices USING btree (status_id);


--
-- TOC entry 5168 (class 1259 OID 18982)
-- Name: idx_invoices_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_type_id ON public.invoices USING btree (invoice_type_id);


--
-- TOC entry 5203 (class 1259 OID 19415)
-- Name: idx_oil_analyses_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_analyses_source ON public.oil_analyses USING btree (source_type_id, source_id);


--
-- TOC entry 5145 (class 1259 OID 18976)
-- Name: idx_oil_batches_production_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_batches_production_batch_id ON public.oil_batches USING btree (production_batch_id);


--
-- TOC entry 5154 (class 1259 OID 18980)
-- Name: idx_oil_movements_destination_tank_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_destination_tank_id ON public.oil_movements USING btree (destination_tank_id);


--
-- TOC entry 5155 (class 1259 OID 18978)
-- Name: idx_oil_movements_oil_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_oil_batch_id ON public.oil_movements USING btree (oil_batch_id);


--
-- TOC entry 5156 (class 1259 OID 18979)
-- Name: idx_oil_movements_source_tank_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_source_tank_id ON public.oil_movements USING btree (source_tank_id);


--
-- TOC entry 5157 (class 1259 OID 18977)
-- Name: idx_oil_movements_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oil_movements_type_id ON public.oil_movements USING btree (movement_type_id);


--
-- TOC entry 5126 (class 1259 OID 18965)
-- Name: idx_olive_purchases_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_olive_purchases_status_id ON public.olive_purchases USING btree (status_id);


--
-- TOC entry 5176 (class 1259 OID 18987)
-- Name: idx_payments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_date ON public.payments USING btree (payment_date);


--
-- TOC entry 5177 (class 1259 OID 18985)
-- Name: idx_payments_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_invoice_id ON public.payments USING btree (invoice_id);


--
-- TOC entry 5178 (class 1259 OID 18986)
-- Name: idx_payments_payment_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payment_method_id ON public.payments USING btree (payment_method_id);


--
-- TOC entry 5114 (class 1259 OID 18961)
-- Name: idx_plot_varieties_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plot_varieties_plot_id ON public.plot_varieties USING btree (plot_id);


--
-- TOC entry 5115 (class 1259 OID 18962)
-- Name: idx_plot_varieties_variety_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plot_varieties_variety_id ON public.plot_varieties USING btree (variety_id);


--
-- TOC entry 5140 (class 1259 OID 19397)
-- Name: idx_pressing_operation_inputs_harvest_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_harvest_id ON public.pressing_operation_inputs USING btree (harvest_id);


--
-- TOC entry 5141 (class 1259 OID 19009)
-- Name: idx_pressing_operation_inputs_operation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_operation_id ON public.pressing_operation_inputs USING btree (pressing_operation_id);


--
-- TOC entry 5142 (class 1259 OID 19011)
-- Name: idx_pressing_operation_inputs_purchase_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operation_inputs_purchase_item_id ON public.pressing_operation_inputs USING btree (purchase_item_id);


--
-- TOC entry 5135 (class 1259 OID 19012)
-- Name: idx_pressing_operations_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pressing_operations_status_id ON public.pressing_operations USING btree (status_id);


--
-- TOC entry 5131 (class 1259 OID 18966)
-- Name: idx_purchase_items_purchase_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_items_purchase_id ON public.olive_purchase_items USING btree (purchase_id);


--
-- TOC entry 5132 (class 1259 OID 18967)
-- Name: idx_purchase_items_variety_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_items_variety_id ON public.olive_purchase_items USING btree (variety_id);


--
-- TOC entry 5187 (class 1259 OID 18990)
-- Name: idx_work_sessions_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_date ON public.work_sessions USING btree (work_date);


--
-- TOC entry 5188 (class 1259 OID 18989)
-- Name: idx_work_sessions_plot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_plot_id ON public.work_sessions USING btree (plot_id);


--
-- TOC entry 5189 (class 1259 OID 18988)
-- Name: idx_work_sessions_worker_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_sessions_worker_id ON public.work_sessions USING btree (worker_id);


--
-- TOC entry 5200 (class 1259 OID 19361)
-- Name: ix_olive_analyses_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_olive_analyses_source ON public.olive_analyses USING btree (source_type, source_id);


--
-- TOC entry 5241 (class 2620 OID 18993)
-- Name: harvests trg_harvests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_harvests_updated_at BEFORE UPDATE ON public.harvests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5246 (class 2620 OID 19000)
-- Name: invoices trg_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5244 (class 2620 OID 18998)
-- Name: oil_batches trg_oil_batches_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_oil_batches_updated_at BEFORE UPDATE ON public.oil_batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5242 (class 2620 OID 18994)
-- Name: olive_purchases trg_olive_purchases_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_olive_purchases_updated_at BEFORE UPDATE ON public.olive_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5240 (class 2620 OID 18992)
-- Name: olive_varieties trg_olive_varieties_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_olive_varieties_updated_at BEFORE UPDATE ON public.olive_varieties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5239 (class 2620 OID 18991)
-- Name: plots trg_plots_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_plots_updated_at BEFORE UPDATE ON public.plots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5243 (class 2620 OID 19013)
-- Name: pressing_operations trg_pressing_operations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pressing_operations_updated_at BEFORE UPDATE ON public.pressing_operations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5245 (class 2620 OID 18999)
-- Name: tanks trg_tanks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_tanks_updated_at BEFORE UPDATE ON public.tanks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5247 (class 2620 OID 19001)
-- Name: workers trg_workers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_workers_updated_at BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5228 (class 2606 OID 18817)
-- Name: expense_categories expense_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.expense_categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5236 (class 2606 OID 19303)
-- Name: harvest_stock fk_harvest_stock_harvest; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvest_stock
    ADD CONSTRAINT fk_harvest_stock_harvest FOREIGN KEY (harvest_id) REFERENCES public.harvests(id);


--
-- TOC entry 5214 (class 2606 OID 19260)
-- Name: harvests fk_harvests_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT fk_harvests_status FOREIGN KEY (status) REFERENCES public.production_status(id);


--
-- TOC entry 5237 (class 2606 OID 19380)
-- Name: olive_analyses fk_olive_analyses_production_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_analyses
    ADD CONSTRAINT fk_olive_analyses_production_status FOREIGN KEY (status) REFERENCES public.production_status(id);


--
-- TOC entry 5220 (class 2606 OID 19392)
-- Name: pressing_operation_inputs fk_pressing_input_harvest; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT fk_pressing_input_harvest FOREIGN KEY (harvest_id) REFERENCES public.harvests(id);


--
-- TOC entry 5238 (class 2606 OID 19437)
-- Name: pressing_parameters fk_pressing_parameters_operation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_parameters
    ADD CONSTRAINT fk_pressing_parameters_operation FOREIGN KEY (pressing_operation_id) REFERENCES public.pressing_operations(id) ON DELETE CASCADE;


--
-- TOC entry 5215 (class 2606 OID 18529)
-- Name: harvests harvests_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE RESTRICT;


--
-- TOC entry 5231 (class 2606 OID 18882)
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- TOC entry 5229 (class 2606 OID 18850)
-- Name: invoices invoices_invoice_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_type_id_fkey FOREIGN KEY (invoice_type_id) REFERENCES public.invoice_type(id) ON DELETE RESTRICT;


--
-- TOC entry 5230 (class 2606 OID 18855)
-- Name: invoices invoices_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.invoice_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5223 (class 2606 OID 18737)
-- Name: oil_batches oil_batches_production_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_batches
    ADD CONSTRAINT oil_batches_production_batch_id_fkey FOREIGN KEY (production_batch_id) REFERENCES public.pressing_operations(id) ON DELETE RESTRICT;


--
-- TOC entry 5224 (class 2606 OID 18797)
-- Name: oil_movements oil_movements_destination_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_destination_tank_id_fkey FOREIGN KEY (destination_tank_id) REFERENCES public.tanks(id) ON DELETE RESTRICT;


--
-- TOC entry 5225 (class 2606 OID 18782)
-- Name: oil_movements oil_movements_movement_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_movement_type_id_fkey FOREIGN KEY (movement_type_id) REFERENCES public.oil_movement_type(id) ON DELETE RESTRICT;


--
-- TOC entry 5226 (class 2606 OID 18787)
-- Name: oil_movements oil_movements_oil_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_oil_batch_id_fkey FOREIGN KEY (oil_batch_id) REFERENCES public.oil_batches(id) ON DELETE RESTRICT;


--
-- TOC entry 5227 (class 2606 OID 18792)
-- Name: oil_movements oil_movements_source_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oil_movements
    ADD CONSTRAINT oil_movements_source_tank_id_fkey FOREIGN KEY (source_tank_id) REFERENCES public.tanks(id) ON DELETE RESTRICT;


--
-- TOC entry 5217 (class 2606 OID 18575)
-- Name: olive_purchase_items olive_purchase_items_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.olive_purchases(id) ON DELETE CASCADE;


--
-- TOC entry 5218 (class 2606 OID 18580)
-- Name: olive_purchase_items olive_purchase_items_variety_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchase_items
    ADD CONSTRAINT olive_purchase_items_variety_id_fkey FOREIGN KEY (variety_id) REFERENCES public.olive_varieties(id) ON DELETE RESTRICT;


--
-- TOC entry 5216 (class 2606 OID 18553)
-- Name: olive_purchases olive_purchases_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.olive_purchases
    ADD CONSTRAINT olive_purchases_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.purchase_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5232 (class 2606 OID 18911)
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- TOC entry 5233 (class 2606 OID 18906)
-- Name: payments payments_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id) ON DELETE RESTRICT;


--
-- TOC entry 5212 (class 2606 OID 18499)
-- Name: plot_varieties plot_varieties_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE CASCADE;


--
-- TOC entry 5213 (class 2606 OID 18504)
-- Name: plot_varieties plot_varieties_variety_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plot_varieties
    ADD CONSTRAINT plot_varieties_variety_id_fkey FOREIGN KEY (variety_id) REFERENCES public.olive_varieties(id) ON DELETE RESTRICT;


--
-- TOC entry 5221 (class 2606 OID 19004)
-- Name: pressing_operation_inputs pressing_operation_inputs_pressing_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT pressing_operation_inputs_pressing_operation_id_fkey FOREIGN KEY (pressing_operation_id) REFERENCES public.pressing_operations(id) ON DELETE CASCADE;


--
-- TOC entry 5222 (class 2606 OID 18710)
-- Name: pressing_operation_inputs production_batch_inputs_purchase_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operation_inputs
    ADD CONSTRAINT production_batch_inputs_purchase_item_id_fkey FOREIGN KEY (purchase_item_id) REFERENCES public.olive_purchase_items(id) ON DELETE RESTRICT;


--
-- TOC entry 5219 (class 2606 OID 18680)
-- Name: pressing_operations production_batches_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pressing_operations
    ADD CONSTRAINT production_batches_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.production_status(id) ON DELETE RESTRICT;


--
-- TOC entry 5234 (class 2606 OID 18956)
-- Name: work_sessions work_sessions_plot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_plot_id_fkey FOREIGN KEY (plot_id) REFERENCES public.plots(id) ON DELETE RESTRICT;


--
-- TOC entry 5235 (class 2606 OID 18951)
-- Name: work_sessions work_sessions_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id) ON DELETE RESTRICT;


-- Completed on 2026-09-15 15:34:22

--
-- PostgreSQL database dump complete
--

\unrestrict kyo8Iyhu9penWEW3cQlhi5FjcHEPDkZPmdMI8f1WKpJidJED8fEY1J5CQa7Z9No

