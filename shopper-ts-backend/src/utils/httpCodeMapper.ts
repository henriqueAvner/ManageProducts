type HttpMapCode = {
    [key: string]: number;
};


const httpMapCode: HttpMapCode = {
    'INVALID_DATA': 400,
    'CREATED': 201,
    'SUCCESS': 200,
    'NOT_FOUND': 404,
    'BAD_REQUEST': 400,
    'UNPROCESSABLE_ENTITY': 422,
    'NO_CONTENT': 204,
    'INTERNAL_SERVER_ERROR': 500,
};


export default httpMapCode;