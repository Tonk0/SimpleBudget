import { Form } from 'react-router-dom';

function Login() {
  return (
    <div className="flex-center flex-column">
      <h2>Enter your name</h2>
      <Form method="post" className="flex-column flex-center" action="/">
        <div className="flex-column form-control">
          <label htmlFor="name">Name</label>
          <input type="text" required name="name" id="name" />
        </div>
        <button type="submit" className="btn btn-black" style={{ marginTop: '8px' }}>Enter</button>
      </Form>
    </div>
  );
}

export default Login;
