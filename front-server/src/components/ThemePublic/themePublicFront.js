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
async function getAllActivePublics() {
    try {
        const response = await fetch('http://localhost:3008/activepublics');
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
        const response = await fetch('http://localhost:3008/activethemes');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching active themes:', error);
        return [];
    }
}

export {getAllPublics, getAllThemes, getAllActivePublics, getAllActiveThemes}
