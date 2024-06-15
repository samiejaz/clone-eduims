import { ProgressSpinner } from "primereact/progressspinner"

export function CustomSpinner({ message = "" }) {
  return (
    <div className="flex align-items-center justify-content-center min-h-90vh">
      <div>
        {message === "" ? (
          <>
            <ProgressSpinner />
          </>
        ) : (
          <>
            <div className="flex flex-column align-items-center">
              <ProgressSpinner />
              <p>{message}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
