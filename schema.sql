--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: base1_7xzt_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO base1_7xzt_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: joueur; Type: TABLE; Schema: public; Owner: base1_7xzt_user
--

CREATE TABLE public.joueur (
    id integer NOT NULL,
    pseudo character varying NOT NULL,
    date_inscription timestamp without time zone NOT NULL
);


ALTER TABLE public.joueur OWNER TO base1_7xzt_user;

--
-- Name: joueur_id_seq; Type: SEQUENCE; Schema: public; Owner: base1_7xzt_user
--

CREATE SEQUENCE public.joueur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.joueur_id_seq OWNER TO base1_7xzt_user;

--
-- Name: joueur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: base1_7xzt_user
--

ALTER SEQUENCE public.joueur_id_seq OWNED BY public.joueur.id;


--
-- Name: progression; Type: TABLE; Schema: public; Owner: base1_7xzt_user
--

CREATE TABLE public.progression (
    id integer NOT NULL,
    joueur_id integer NOT NULL,
    etape character varying NOT NULL,
    payload json,
    horodatage timestamp without time zone NOT NULL
);


ALTER TABLE public.progression OWNER TO base1_7xzt_user;

--
-- Name: progression_id_seq; Type: SEQUENCE; Schema: public; Owner: base1_7xzt_user
--

CREATE SEQUENCE public.progression_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.progression_id_seq OWNER TO base1_7xzt_user;

--
-- Name: progression_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: base1_7xzt_user
--

ALTER SEQUENCE public.progression_id_seq OWNED BY public.progression.id;


--
-- Name: joueur id; Type: DEFAULT; Schema: public; Owner: base1_7xzt_user
--

ALTER TABLE ONLY public.joueur ALTER COLUMN id SET DEFAULT nextval('public.joueur_id_seq'::regclass);


--
-- Name: progression id; Type: DEFAULT; Schema: public; Owner: base1_7xzt_user
--

ALTER TABLE ONLY public.progression ALTER COLUMN id SET DEFAULT nextval('public.progression_id_seq'::regclass);


--
-- Name: joueur joueur_pkey; Type: CONSTRAINT; Schema: public; Owner: base1_7xzt_user
--

ALTER TABLE ONLY public.joueur
    ADD CONSTRAINT joueur_pkey PRIMARY KEY (id);


--
-- Name: progression progression_pkey; Type: CONSTRAINT; Schema: public; Owner: base1_7xzt_user
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT progression_pkey PRIMARY KEY (id);


--
-- Name: ix_joueur_pseudo; Type: INDEX; Schema: public; Owner: base1_7xzt_user
--

CREATE UNIQUE INDEX ix_joueur_pseudo ON public.joueur USING btree (pseudo);


--
-- Name: progression progression_joueur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: base1_7xzt_user
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT progression_joueur_id_fkey FOREIGN KEY (joueur_id) REFERENCES public.joueur(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO base1_7xzt_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO base1_7xzt_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO base1_7xzt_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO base1_7xzt_user;


--
-- PostgreSQL database dump complete
--

