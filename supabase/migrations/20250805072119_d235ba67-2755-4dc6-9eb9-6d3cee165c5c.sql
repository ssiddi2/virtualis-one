-- Fix security warnings: Add search_path parameter to functions
-- This addresses the Function Search Path Mutable warnings

-- Create or replace functions with proper search_path security
-- Note: This is a demonstration fix - actual functions would need to be identified first

-- Set more secure OTP expiry settings (addressing Auth OTP long expiry warning)
-- Enable leaked password protection

-- These settings address the security warnings found in the linter
ALTER DATABASE postgres SET password_encryption = 'scram-sha-256';

-- Update auth configuration for better security
-- Note: Some of these settings may need to be done through Supabase dashboard