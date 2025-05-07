import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eroittwzyzdcfdshzlvj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyb2l0dHd6eXpkY2Zkc2h6bHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzgwMDMsImV4cCI6MjA2MjIxNDAwM30.s-67mNUJTD9sSd-vTlE2-EdiNDOQ6qWA7sHHxzy9PCA";

export const supabase = createClient(supabaseUrl, supabaseKey);
