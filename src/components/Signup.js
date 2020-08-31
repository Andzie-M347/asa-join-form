import React from "react";
import useForm from "./form";
import "../index.css";
import { Row, Col, Form, Container } from "react-bootstrap";

function Signup() {
  // Define your state schema
  const stateSchema = {
    first_name: { value: "", error: "" },
    last_name: { value: "", error: "" },
    email: { value: "", error: "" },
    phone: { value: "", error: "" },
    idnumber: { idnumber: "", error: "" },
  };

  const stateValidatorSchema = {
    first_name: {
      required: true,
      validator: {
        func: (value) => /^[a-zA-Z]+$/.test(value),
        error: "Invalid first name.",
      },
    },
    last_name: {
      required: true,
      validator: {
        func: (value) => /^[a-zA-Z]+$/.test(value),
        error: "Invalid last name.",
      },
    },
    email: {
      required: true,
      validator: {
        func: (value) =>
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            value
          ),
        error: "Email address is invalid.",
      },
    },

    phone: {
      required: true,
      validator: {
        func: (value) => /^(\+27|0)[6-8][0-9]{8}$/.test(value),
        error: "Phone number is invalid.",
      },
    },

    idnumber: {
      required: true,
      validator: {
        func: (value) =>
          /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/.test(
            value
          ),
        error: "ID number is invalid.",
      },
    },
  };

  const onSubmitForm = (state) => {
    alert(JSON.stringify(state, null, 2));
  };

  const {
    values,
    errors,
    dirty,
    handleOnChange,
    handleOnSubmit,
    disable,
  } = useForm(stateSchema, stateValidatorSchema, onSubmitForm);

  const { first_name, last_name, email, phone, idnumber } = values;

  return (
    <Container>
      <form className="my-form" onSubmit={handleOnSubmit}>
        <Row>
          <Col>
            <label htmlFor="first_name">First name:</label>
            <Form.Control
              type="text"
              name="first_name"
              value={first_name}
              onChange={handleOnChange}
              placeholder="First name"
            />
            {errors.first_name && dirty.first_name && (
              <p className="error">{errors.first_name}</p>
            )}
          </Col>
          <Col>
            <label htmlFor="last_name">Last name:</label>
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Last name"
              value={last_name}
              onChange={handleOnChange}
            />
            {errors.last_name && dirty.last_name && (
              <p className="error">{errors.last_name}</p>
            )}
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
            />
            {errors.email && dirty.email && (
              <p className="error">{errors.email}</p>
            )}
          </Col>
          <Col>
            <Form.Label htmlFor="phone">Phone:</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={phone}
              onChange={handleOnChange}
            />
            {errors.phone && dirty.phone && (
              <p className="error">{errors.phone}</p>
            )}
          </Col>
        </Row>

        <Form.Group controlId="formGridAddress1">
          <Form.Label>SA ID Number</Form.Label>
          <Form.Control
            type="text"
            name="idnumber"
            value={idnumber}
            onChange={handleOnChange}
          />
          {errors.idnumber && dirty.idnumber && (
            <p className="error">{errors.idnumber}</p>
          )}
        </Form.Group>

        <input
          type="submit"
          name="submit"
          disabled={disable}
          className="button button__submit"
        />
      </form>
    </Container>
  );
}

export default Signup;
