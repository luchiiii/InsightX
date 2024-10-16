const Error = ({ errorMessage }) => {
  return (
    <div class="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  );
};

export default Error;
