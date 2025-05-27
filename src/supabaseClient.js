import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwlpbprmsceyryznknrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bHBicHJtc2NleXJ5em5rbnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzY4NTksImV4cCI6MjA2Mzg1Mjg1OX0.ffYGfWbB8tGOON-9tkKbtAyJ7ZDZxvBMUFYP4KYOFDM'; // API Key yang kamu miliki

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
