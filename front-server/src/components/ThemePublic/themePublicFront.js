async function getAllPublics() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/publics`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching publics:', error);
        return [];
    }
}
async function getAllThemes() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/themes`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching themes:', error);
        return [];
    }
}
async function getAllActivePublics() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/activepublics`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching active publics:', error);
        return [];
    }
}
async function getAllActiveThemes() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/activethemes`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching active themes:', error);
        return [];
    }
}

async function getPublicsAndThemes(questionId) {
  try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/associatedThemesAndPublicsQuestion/${questionId}`);
      if (response.ok) {
          const data = await response.json();
          return data;
      }
  } catch (error) {
      console.error('Error fetching publics and themes for question:', error);
      return [];
  }
}

export {getAllPublics, getAllThemes, getAllActivePublics, getAllActiveThemes, getPublicsAndThemes}
