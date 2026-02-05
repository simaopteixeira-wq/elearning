import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('supabase service', () => {
  it('should have auth methods defined', async () => {
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.auth.getSession).toBe('function');
  });

  it('should return null session by default', async () => {
    const { data } = await supabase.auth.getSession();
    expect(data.session).toBeNull();
  });
});
