const assert = require("assert");
const ErrorAnalyzer = require("../src/ErrorAnalyzer");
const sinon = require("sinon");

suite("ErrorAnalyzer Test Suite", () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
    });

    teardown(() => {
        sandbox.restore();
    });

    test("returns analysis result for valid response", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                candidates: [
                    {
                        content: {
                            parts: [
                                { text: "Mocked analysis result" }
                            ]
                        }
                    }
                ]
            })
        }
        sandbox.stub(global, "fetch").resolves(mockResponse);

        const result = await ErrorAnalyzer.analyzeError("Error output", "codeText");

        assert.strictEqual(result, "Mocked analysis result");
    });

    test("rejects with NetworkError for network error", async () => {
        sandbox.stub(global, 'fetch').rejects(new Error('Network error'));

        await assert.rejects(
            ErrorAnalyzer.analyzeError('Error output', 'codeText'),
            {
                name: 'Error',
                message: 'Network error'
            }
        );
    });

    test("rejects with HTTPError for non-OK response", async () => {
        const mockResponse = {
            ok: false,
            status: 400,
            statusText: "Bad Request"
        };

        sandbox.stub(global, "fetch").resolves(mockResponse);

        await assert.rejects(
            ErrorAnalyzer.analyzeError("Error output", "codeText"),
            {
                name: "Error",
                message: "HTTP error! status: 400"
            }
        );
    });

    test("rejects with TypeError for invalid response format", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({})
        };

        sandbox.stub(global, "fetch").resolves(mockResponse);

        await assert.rejects(
            ErrorAnalyzer.analyzeError("Error output", "codeText"),
            {
                name: "TypeError",
                message: "Cannot read properties of undefined (reading '0')"
            }
        );
    });

    test("passes correct language parameter", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                candidates: [
                    {
                        content: {
                            parts: [
                                { text: "분석 결과" }
                            ]
                        }
                    }
                ]
            })
        };

        const fetchStub = sandbox.stub(global, "fetch").resolves(mockResponse);

        await ErrorAnalyzer.analyzeError("에러 출력", "코드 텍스트", "한국어");

        assert(fetchStub.calledOnce);
        const fetchArgs = fetchStub.getCall(0).args;
        const requestBody = JSON.parse(fetchArgs[1].body);
        assert.strictEqual(requestBody.language, "한국어");
        assert.strictEqual(requestBody.errorOutput, "에러 출력");
        assert.strictEqual(requestBody.code, "코드 텍스트");
    });
});