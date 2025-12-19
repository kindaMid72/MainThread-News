-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying,
  entity_type character varying,
  entity_id bigint,
  description text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.article_revisions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL,
  editor_id uuid NOT NULL,
  title character varying,
  content_html text,
  note text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT article_revisions_pkey PRIMARY KEY (id),
  CONSTRAINT article_revisions_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_revisions_editor_id_fkey FOREIGN KEY (editor_id) REFERENCES auth.users(id)
);
CREATE TABLE public.article_tags (
  article_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT article_tags_pkey PRIMARY KEY (article_id, tag_id),
  CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.article_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL,
  ip_address character varying,
  user_agent text,
  viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT article_views_pkey PRIMARY KEY (id),
  CONSTRAINT article_views_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content_html text NOT NULL,
  thumbnail_url text,
  author_id uuid NOT NULL,
  status USER-DEFINED DEFAULT 'draft'::article_status,
  source_type USER-DEFINED DEFAULT 'manual'::article_source_type,
  source_ref text,
  view_count bigint DEFAULT 0,
  is_breaking boolean DEFAULT false,
  is_headline boolean DEFAULT false,
  published_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  category_id uuid NOT NULL,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  uploader_id uuid,
  file_url text NOT NULL,
  file_type character varying,
  file_size bigint,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT media_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES auth.users(id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  setting_key character varying NOT NULL UNIQUE,
  setting_value text,
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users_access (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  role USER-DEFINED NOT NULL DEFAULT 'writer'::user_role,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_access_pkey PRIMARY KEY (id),
  CONSTRAINT users_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);