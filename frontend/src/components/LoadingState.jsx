function LoadingState({
    title = "Loading...",
    message = "Please wait a moment."
}) {
    return (
        <div className="dashboard-loading">

            <div className="loading-spinner"></div>

            <h3>{title}</h3>

            <p>{message}</p>

        </div>
    );
}

export default LoadingState;