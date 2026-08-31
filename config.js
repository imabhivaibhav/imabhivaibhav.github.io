/* =========================================================
   SUPABASE CENTRAL CONFIGURATION
========================================================= */
const SUPABASE_URL = 'https://hgbmebmjrajbwhqjaeeu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYm1lYm1qcmFqYndocWphZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNTY2NTMsImV4cCI6MjEwMzczMjY1M30.fPZ_sJEeACTkj64sapeszIywAc9At1Ytb1krdEubtLE';

// Single Supabase Client Instance
let supabaseClient = null;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
