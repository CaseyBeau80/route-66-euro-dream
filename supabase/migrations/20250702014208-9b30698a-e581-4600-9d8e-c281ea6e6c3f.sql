-- Fix potential infinite recursion in get_location_trailblazer function
CREATE OR REPLACE FUNCTION public.get_location_trailblazer(location_stop_id text)
 RETURNS TABLE(has_trailblazer boolean, user_session_id text, achieved_at timestamp with time zone, photo_url text)
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
  achievement_record RECORD;
BEGIN
  -- First check if any trailblazer exists for this location
  SELECT ta.user_session_id, ta.achieved_at, pc.photo_url
  INTO achievement_record
  FROM trailblazer_achievements ta
  LEFT JOIN photo_challenges pc ON ta.photo_challenge_id = pc.id
  WHERE ta.stop_id = location_stop_id
  ORDER BY ta.achieved_at ASC
  LIMIT 1;

  -- Return the result
  IF FOUND THEN
    RETURN QUERY
    SELECT 
      true as has_trailblazer,
      achievement_record.user_session_id,
      achievement_record.achieved_at,
      achievement_record.photo_url;
  ELSE
    RETURN QUERY
    SELECT 
      false as has_trailblazer,
      NULL::text as user_session_id,
      NULL::timestamp with time zone as achieved_at,
      NULL::text as photo_url;
  END IF;
END;
$function$;