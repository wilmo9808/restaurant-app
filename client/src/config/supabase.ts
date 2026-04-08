import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxjzrybssqhjifzaprpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4anpyeWJzc3FoamlmemFwcnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDkzODgsImV4cCI6MjA5MTA4NTM4OH0.L43BpLuvpMpgf8JOMxR9IZDKA43-4jmLbvb7jkB4UbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);