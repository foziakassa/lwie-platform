// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Mock client for environments where Supabase isn't available
const createMockClient = () => {
  console.log("Creating mock Supabase client")
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => ({
              then: () => ({ data: [], error: null }),
            }),
            in: () => ({
              order: () => ({
                then: () => ({ data: [], error: null }),
              }),
            }),
            single: () => ({
              then: () => ({ data: null, error: null }),
            }),
          }),
          order: () => ({
            then: () => ({ data: [], error: null }),
          }),
          single: () => ({
            then: () => ({ data: null, error: null }),
          }),
        }),
        or: () => ({
          then: () => ({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          then: () => ({ data: [], error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            then: () => ({ data: [], error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          then: () => ({ data: null, error: null }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg" } }),
      }),
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  }
}

// Singleton pattern to avoid multiple instances
const supabaseInstance = null

export const createClient = () => {
  // Always return a mock client to prevent any network requests
  return createMockClient()
}

// Helper to get the current user
export const getCurrentUser = async () => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return data?.user || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
