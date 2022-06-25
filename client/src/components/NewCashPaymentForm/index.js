import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

import moment from "moment";
import API from "../../utils/API";
const animatedComponent = makeAnimated();

class NewCashPaymentForm extends Component {
  state = {
    selectedUsers: [],
    validated: false,
    paymentDate: moment(),
    totalAmount: 0,
    paymentType: 1,
    paymentName: "Cash Advance",
    paymentNotes: "Advance Paid",
  };
  onChange = (selectedUsers) => {
    this.setState({
      selectedUsers: selectedUsers || [],
    });
  };

  loadOptions = async (inputText, callback) => {
    const response = await fetch(
      `https://nalandaapi.herokuapp.com/api/newcustomer/search?searchString=${inputText}`
    );
    const json = await response.json();

    callback(json.map((i) => ({ label: i.customerName, value: i.customerId })));
  };

  // Handles updating component state when the user types into the input field
  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  //Common function to handle dropdown selections - Occupancy and Locations
  handleDropDownSelection = (eventKey, event) => {
    this.setState({
      paymentName: eventKey,
      paymentNotes: event.target.id === "1" ? "Advance Paid" : "Bill Settlement",
    });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.setState({ validated: true });
      const newCashEntry = {
        customerId: this.state.selectedUsers.value,
        paymentDate: moment.utc(this.state.paymentDate).format("MM/DD/YYYY"),
        totalAmount: this.state.totalAmount,
        paymentType: this.state.paymentType,
        paymentNotes: this.state.paymentNotes,
      };
      API.createCashEntry(newCashEntry)
        .then((res) => {
          this.setState({
            selectedUsers: [],
            validated: false,
            paymentDate: moment(),
            totalAmount: 0,
            paymentType: 1,
            paymentName: "Cash Advance",
            paymentNotes: "Advance Paid",
          });
          this.props.closeCashPaymentForm();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    return this.props.trigger ? (
      <div className="newCashPayment">
        {" "}
        <div className="newCashPaymentInner">
          <h4 style={{ fontWeight: "bold" }}>New Cash Payment entry</h4>
          <hr size="" width="" color="grey" />
          <br></br>
          <h6 style={{ fontWeight: "normal", display: "inline" }}>
            Customer Name
          </h6>
          <span id="mandatory"> * </span>
          <AsyncSelect
            components={animatedComponent}
            value={this.state.selectedUsers}
            placeholder={"Search using customer name..."}
            loadOptions={this.loadOptions}
            onChange={this.onChange}
          />
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleOnSubmit}
          >
            <br></br>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Payment Date</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="date"
                placeholder="DD/MM/YYYY"
                name="paymentDate"
                onChange={this.handleInputChange}
                value={this.state.paymentDate}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Payment Type</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                  {this.state.paymentName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    id="1"
                    name="paymentType"
                    eventKey="Cash Advance"
                    onSelect={this.handleDropDownSelection}
                  >
                    Cash Advance
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="2"
                    name="paymentType"
                    eventKey="Bill Payment"
                    onSelect={this.handleDropDownSelection}
                  >
                    Bill Payment
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Amount</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="number"
                placeholder="Enter the amount..."
                name="totalAmount"
                onChange={this.handleInputChange}
                value={this.state.totalAmount}
                maxLength={10}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Notes</Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter notes if any..."
                name="paymentNotes"
                onChange={this.handleInputChange}
                value={this.state.paymentNotes}
                required
              />
            </Form.Group>
            <hr size="" width="" color="grey" />
            <Button
              id="subBtn"
              variant="info"
              type="submit"
              className="btn btn-success submit-button"
            >
              Submit
            </Button>
            <Button
              id="subBtn"
              variant="info"
              className="btn btn-light cancel-button"
              onClick={() => this.props.closeCashPaymentForm()}
            >
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    ) : (
      ""
    );
  }
}

export default withRouter(NewCashPaymentForm);
