async function getAllPublics() {
    try {
        const response = await fetch('http://localhost:3008/publics');
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
        const response = await fetch('http://localhost:3008/themes');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching themes:', error);
        return [];
    }
}

export {getAllPublics, getAllThemes}
