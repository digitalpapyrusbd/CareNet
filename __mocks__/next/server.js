// Manual mock for next/server
const actualNext = jest.requireActual('next/server');

class MockNextResponse extends Response {
  static json(body, init) {
    const response = new Response(JSON.stringify(body), {
      status: init?.status || 200,
      statusText: init?.statusText || '',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    // Add json method to response
    response.json = async () => body;
    response.body = body;
    response.ok = (init?.status || 200) < 400;
    return response;
  }
  
  static redirect(url, init) {
    return new Response(null, {
      status: init?.status || 307,
      headers: { Location: url },
    });
  }
}

module.exports = {
  ...actualNext,
  NextResponse: MockNextResponse,
};
