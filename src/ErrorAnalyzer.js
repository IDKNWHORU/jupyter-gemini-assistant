const path = require('path');
// 프로젝트 루트 폴더에 있는 .env 파일의 절대 경로를 계산하여 로드합니다.
const result = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// (선택 사항) 로드가 실패했는지 확인하여 디버깅에 활용할 수 있습니다.
if (result.error) {
    console.error("Error loading .env file:", result.error);
} else {
    console.log(`${Object.keys(result.parsed).length} environment variables loaded from .env`);
}

module.exports = class {
    /**
     * Analyzes the given error output and code to generate an explanation.
     * 
     * @async
     * @param {string} errorOutput - The error output string to analyze
     * @param {string} code - The code string where the error occurred
     * @param {string} language - The locale/language for the analysis
     * @prram {string} model - the model to use for analysis
     * @returns {Promise<string>} The text result of the error analysis
     * @throws {Error} If the HTTP request fails or an error occurs during response processing
     */
    static async analyzeError(errorOutput, code, language, model) {
        console.log("Analyzing error with model:", model);
        
        try {
            const response = await fetch(process.env.API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorOutput, code, language, model }),
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