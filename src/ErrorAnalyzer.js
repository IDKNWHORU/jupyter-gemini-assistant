module.exports = class {
    static async analyzeError(errorOutput, code) {
        try {
            const response = await fetch("https://gemini-server-kappa.vercel.app/generate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorOutput, code }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error analyzing error:', error);
            throw error;
        }
    }
}