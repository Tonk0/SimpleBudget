import { Form } from 'react-router-dom';

function CreateAccount() {
  return (
    <div className="flex-column flex-center">
      <h2>Create budget</h2>
      <Form method="post" action="/createBudget" className="flex-column flex-center">
        <div className="flex-column form-control">
          <label htmlFor="budgetName">Budget name</label>
          <input type="text" required name="budgetName" id="budgetName" placeholder="Card" />
        </div>
        <div className="flex-column form-control">
          <label htmlFor="budgetAmount">Budget balance</label>
          <input type="number" required name="budgetAmount" id="budgetAmount" placeholder="123.15" />
        </div>
        <button type="submit" className="btn btn-green" style={{ marginTop: '8px' }}>Create</button>
      </Form>
    </div>
  );
}

export default CreateAccount;
