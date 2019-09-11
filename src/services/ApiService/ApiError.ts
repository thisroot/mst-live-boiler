interface ApiErrorProps {
    message: string
    code?: number
    description?: string
}

const DEF_TEXT = 'API error'

export class ApiError extends Error {
    public code: number
    public description: string

    constructor({ message = DEF_TEXT, code = 500, description = '' }: ApiErrorProps) {
        super(message)
        this.code = code || 500
        this.description = description
    }
}
