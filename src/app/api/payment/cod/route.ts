const CALLBACK = async (request: Request) => {
    //update status of order
    const data = await request.json()
    return new Response(JSON.stringify(data))
}

export { CALLBACK as POST}