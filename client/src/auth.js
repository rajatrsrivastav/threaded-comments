const STORAGE_KEY = 'tcs_user'
const API_URL = import.meta.env.VITE_API_URL

export function getUser() {
  const savedUser = localStorage.getItem(STORAGE_KEY)
  if (!savedUser) return null
  return JSON.parse(savedUser)
}

// Handle Google OAuth - send decoded user data to backend
export async function handleGoogleLogin(googleUser) {
  try {
    // Send user data to backend
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: googleUser.sub,           // Google user ID
        email: googleUser.email,
        displayName: googleUser.name,
        photoURL: googleUser.picture
      })
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    // Get user data back from backend
    const user = await response.json()
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export function signOut() {
  localStorage.removeItem(STORAGE_KEY)
}
