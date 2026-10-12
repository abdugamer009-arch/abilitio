-- Cache the request's fixed user ID once per statement. Policy roles,
-- operations and ownership/ban checks stay the same.
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
DO $$
DECLARE p record; next_qual text; next_check text; statement text;
BEGIN
  FOR p IN SELECT schemaname,tablename,policyname,qual,with_check
    FROM pg_policies WHERE schemaname IN ('public','storage')
  LOOP
    -- pg_get_expr deparses existing scalar subqueries as SELECT auth.uid().
    -- The lookbehind keeps this migration idempotent, including partial wraps.
    next_qual := regexp_replace(p.qual,'(?<!SELECT )auth[.]uid[(][)]','(SELECT auth.uid())','g');
    next_check := regexp_replace(p.with_check,'(?<!SELECT )auth[.]uid[(][)]','(SELECT auth.uid())','g');
    IF next_qual IS DISTINCT FROM p.qual OR next_check IS DISTINCT FROM p.with_check THEN
      statement := format('ALTER POLICY %I ON %I.%I',p.policyname,p.schemaname,p.tablename);
      IF next_qual IS NOT NULL THEN statement := statement || format(' USING (%s)',next_qual); END IF;
      IF next_check IS NOT NULL THEN statement := statement || format(' WITH CHECK (%s)',next_check); END IF;
      EXECUTE statement;
    END IF;
  END LOOP;
END $$;
