/**
 * Utility to provide high-quality fallback images for experiences
 * based on their category or name.
 */

const FALLBACK_IMAGES = {
  regalo: [
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2030'
  ],
  experiencia: [
    'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2062'
  ],
  default: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070'
}

export function getExperienceImage(experiencia: { 
  imagen_url?: string | null; 
  categoria?: string | null; 
  id: string 
}) {
  // If there is a real image URL, use it
  if (experiencia.imagen_url && experiencia.imagen_url.trim() !== '') {
    return experiencia.imagen_url
  }

  // Determine fallback based on category
  const cat = experiencia.categoria?.toLowerCase() || 'default'
  const images = FALLBACK_IMAGES[cat as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default

  if (Array.isArray(images)) {
    // Deterministic selection based on ID so same experience always has same image
    const index = Math.abs(hashCode(experiencia.id)) % images.length
    return images[index]
  }

  return images as string
}

/**
 * Simple hash function to get a deterministic index from a string
 */
function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
