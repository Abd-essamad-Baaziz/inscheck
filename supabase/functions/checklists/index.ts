import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

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
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse body to check for method (when using supabase.functions.invoke)
    let requestBody: any = {};
    let method = req.method;
    
    if (req.method === 'POST') {
      try {
        requestBody = await req.json();
        // If body contains a method field, use that instead
        if (requestBody.method) {
          method = requestBody.method;
        }
      } catch (e) {
        // If JSON parsing fails, continue with default POST behavior
        console.error('Failed to parse request body:', e);
      }
    }

    if (method === 'GET' || (!requestBody.method && req.method === 'GET')) {
      // Retrieve user's checklists with items
      const { data, error } = await supabase
        .from('checklists')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          checklist_items (
            id,
            phase,
            item,
            checked,
            comment,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklists:', error);
        throw error;
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST' && !requestBody.method) {
      // Save user's checklist items
      const { title, items } = requestBody;

      // First create the checklist record
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklists')
        .insert({
          user_id: user.id,
          title: title || `Checklist - ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (checklistError) {
        console.error('Error creating checklist:', checklistError);
        throw checklistError;
      }

      // Then insert all items linked to this checklist
      const itemsToInsert = items.map((item: any) => ({
        phase: item.phase,
        item: item.item,
        checked: item.checked,
        comment: item.comment || '',
        user_id: user.id,
        checklist_id: checklistData.id
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert)
        .select();

      if (itemsError) {
        console.error('Error saving checklist items:', itemsError);
        throw itemsError;
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Saved ${itemsData.length} checklist items`,
        checklist: checklistData,
        items: itemsData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'DELETE') {
      // Delete a checklist (cascade will delete items)
      const checklistId = requestBody.checklistId;

      if (!checklistId) {
        return new Response(JSON.stringify({ error: 'checklistId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Deleting checklist:', checklistId);

      const { error } = await supabase
        .from('checklists')
        .delete()
        .eq('id', checklistId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting checklist:', error);
        throw error;
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Checklist deleted successfully'
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