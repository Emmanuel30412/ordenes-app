type AlertProps = {
    type: "success" | "error" | "warning"
    message: string
}

export function Alert({ type, message }: AlertProps) {

    const styles = {
        success: "bg-green-100 text-green-800 border-green-300",
        error: "bg-red-100 text-red-800 border-red-300",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-300"
    }

    return (
        <div
            className={`fixed top-5 right-5 z-50 border px-4 py-2 rounded shadow-lg ${styles[type]}`}
        >
            {message}
        </div>
    )
}