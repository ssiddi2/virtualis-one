-- Update the handle_new_user function to be more resilient
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  default_hospital_id UUID;
BEGIN
  -- Try to get the first hospital, but don't fail if none exists
  SELECT id INTO default_hospital_id FROM hospitals LIMIT 1;
  
  -- Insert profile with or without hospital_id
  INSERT INTO public.profiles (id, email, first_name, last_name, role, hospital_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'physician'),
    COALESCE((NEW.raw_user_meta_data->>'hospital_id')::UUID, default_hospital_id)
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    -- Still create a basic profile without hospital
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'physician')
    );
    RETURN NEW;
END;
$function$;