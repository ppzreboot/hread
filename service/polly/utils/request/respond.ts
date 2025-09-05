function respond_json(error: number, data: unknown): Response {
    const body = { error, data }
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export
function success(data: unknown): Response {
    return respond_json(0, data)
}

export
function failure(error: number, msg?: string): Response {
    return respond_json(error, msg ?? 'Failure')
}

export
function not_found(): Response {
    return failure(404, 'Not Found')
}

export
function bad_request(msg?: string): Response {
    return failure(400, msg ?? 'Bad Request')
}
