export default function Loading({ slow }) {
  return (
    <div className="loading-block" role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="loading-title">{slow ? "Waking up the store server" : "Loading"}</p>
      {slow && (
        <p className="muted">
          This demo runs on free hosting, so the first visit can take up to a minute. Thanks for
          waiting.
        </p>
      )}
    </div>
  );
}
