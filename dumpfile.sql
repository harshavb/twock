--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Homebrew)
-- Dumped by pg_dump version 15.1 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sentiment; Type: TABLE; Schema: public; Owner: ben
--

CREATE TABLE public.sentiment (
    se_symbol character varying(20) NOT NULL,
    se_tweet_id bigint NOT NULL,
    se_sentiment numeric(3,2),
    se_subjectivity numeric(3,2)
);


--
-- Name: stock; Type: TABLE; Schema: public;
--

CREATE TABLE public.stock (
    s_symbol character varying(20) NOT NULL,
    s_percent_change double precision,
    s_price double precision
);


--
-- Name: tweet_information; Type: TABLE; Schema: public;
--

CREATE TABLE public.tweet_information (
    ti_tweet_id bigint NOT NULL,
    ti_user_id bigint,
    ti_text character varying(1000),
    ti_unix_timestamp bigint,
    ti_s_symbol character varying(20)
);


--
-- Name: twitter_user; Type: TABLE; Schema: public;
--

CREATE TABLE public.twitter_user (
    tu_user_id bigint NOT NULL,
    tu_profile_image_url character varying(255),
    tu_username character varying(63),
    tu_display_name character varying(255)
);


--
-- Data for Name: sentiment; Type: TABLE DATA; Schema: public;
--

COPY public.sentiment (se_symbol, se_tweet_id, se_sentiment, se_subjectivity) FROM stdin;
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public;
--

COPY public.stock (s_symbol, s_percent_change, s_price) FROM stdin;
\.


--
-- Data for Name: tweet_information; Type: TABLE DATA; Schema: public;
--

COPY public.tweet_information (ti_tweet_id, ti_user_id, ti_text, ti_unix_timestamp, ti_s_symbol) FROM stdin;
\.


--
-- Data for Name: twitter_user; Type: TABLE DATA; Schema: public;
--

COPY public.twitter_user (tu_user_id, tu_profile_image_url, tu_username, tu_display_name) FROM stdin;
\.


--
-- Name: sentiment sentiment_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.sentiment
    ADD CONSTRAINT sentiment_pkey PRIMARY KEY (se_symbol, se_tweet_id);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (s_symbol);


--
-- Name: tweet_information tweet_information_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.tweet_information
    ADD CONSTRAINT tweet_information_pkey PRIMARY KEY (ti_tweet_id);


--
-- Name: twitter_user twitter_user_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.twitter_user
    ADD CONSTRAINT twitter_user_pkey PRIMARY KEY (tu_user_id);


--
-- Name: sentiment sentiment_se_symbol_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.sentiment
    ADD CONSTRAINT sentiment_se_symbol_fkey FOREIGN KEY (se_symbol) REFERENCES public.stock(s_symbol);


--
-- Name: sentiment sentiment_se_tweet_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.sentiment
    ADD CONSTRAINT sentiment_se_tweet_id_fkey FOREIGN KEY (se_tweet_id) REFERENCES public.tweet_information(ti_tweet_id);


--
-- Name: tweet_information tweet_information_ti_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.tweet_information
    ADD CONSTRAINT tweet_information_ti_user_id_fkey FOREIGN KEY (ti_user_id) REFERENCES public.twitter_user(tu_user_id);


--
-- PostgreSQL database dump complete
--

