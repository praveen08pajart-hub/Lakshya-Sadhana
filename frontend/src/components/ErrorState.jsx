function ErrorState({
    title = "Something went wrong",
    message = "Unable to load data.",
    onRetry
}) {
    return (
        <div className="dashboard-error">

            <div className="dashboard-error-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3>{title}</h3>

            <p>{message}</p>

            {onRetry && (
                <button
                    className="dashboard-retry-btn"
                    onClick={onRetry}
                >
                    <i className="fa-solid fa-rotate-right"></i>
                    Try Again
                </button>
            )}

        </div>
    );
}

export default ErrorState;