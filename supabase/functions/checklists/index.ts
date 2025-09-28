import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'GET') {
      // Retrieve all checklists
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklists:', error);
        throw error;
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      // Save checklist items
      const checklistItems = await req.json();

      // First, clear existing items (for new checklist scenario)
      const { error: deleteError } = await supabase
        .from('checklist_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all items

      if (deleteError) {
        console.error('Error clearing existing items:', deleteError);
        // Continue anyway - this might be the first save
      }

      // Insert new items
      const itemsToInsert = checklistItems.map((item: any) => ({
        phase: item.phase,
        item: item.item,
        checked: item.checked,
        comment: item.comment || ''
      }));

      const { data, error } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert)
        .select();

      if (error) {
        console.error('Error saving checklist:', error);
        throw error;
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Saved ${data.length} checklist items`,
        data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in checklists function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});