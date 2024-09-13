module.exports = class {
    /**
     * Analyzes the given error output and code to generate an explanation.
     * 
     * @async
     * @param {string} errorOutput - The error output string to analyze
     * @param {string} code - The code string where the error occurred
     * @returns {Promise<string>} The text result of the error analysis
     * @throws {Error} If the HTTP request fails or an error occurs during response processing
     */
    static async analyzeError(errorOutput, code, language) {
        try {
            const response = await fetch("http://gemini-server-kappa.vercel.app/generate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorOutput, code, language }),
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