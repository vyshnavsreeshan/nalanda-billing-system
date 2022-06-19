import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

import Navbar from "../components/Navbar";
import {
  Tabs,
  Tab,
  Container,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import moment from "moment";
import API from "../utils/API";

class BillingInvoices extends Component {
  state = {
    focusedBillFrom: false,
    focusedBillTo: false,

    billFromDate: moment(),
    billToDate: moment(),
    ratePerKg: 0,
    showBillSummary: false,
  };
  onBillFromDateChange = (date) => {
    this.setState({ billFromDate: moment(date).format("MM/DD/YYYY") });
  };
  onBillToDateChange = (date) => {
    this.setState({ billToDate: moment(date).format("MM/DD/YYYY") });
  };
  // Handles updating component state when the user types into the input field
  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
    console.log(value);
  };
  calculateInvoice() {
    console.log(this.state);
    API.calculateInvoiceAmount({
      billFromDate: this.state.billFromDate,
      billToDate: this.state.billToDate,
      unitRatePerKg: parseInt(this.state.ratePerKg),
    })
      .then((res) => {
        console.log(res.data);
        this.setState({
          BillSummaryRecord: res.data,
          showBillSummary: true,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    let numberOfCustomers = "Number of Customers:";
    let totalNetWeight = "Total Net Weight:";
    let totalDryWeight = "Total Dry Weight:";
    let ratePerKg = "Rate/Kg:";
    let totaInvoiceAmount = "Total Invoice Amount:";

    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <br></br>
        <Container>
          <div>
            <Tabs
              defaultActiveKey="calcInvoice"
              id="uncontrolled-tab-example"
              className="mb-3 billingTabs"
            >
              <Tab
                className="innerTab"
                eventKey="calcInvoice"
                title="Calculate Invoice Amount"
              >
                <div className="grid-container">
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>From Date</Form.Label>
                      </div>

                      <SingleDatePicker
                        date={moment(this.state.billFromDate)} // momentPropTypes.momentObj or null
                        onDateChange={this.onBillFromDateChange}
                        focused={this.state.focusedBillFrom} // PropTypes.bool
                        isOutsideRange={() => false}
                        onFocusChange={({ focused }) =>
                          this.setState({ focusedBillFrom: focused })
                        }
                        id="billFromDate" // PropTypes.string.isRequired,
                      />
                    </Form.Group>
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>To Date</Form.Label>
                      </div>

                      <SingleDatePicker
                        date={moment(this.state.billToDate)} // momentPropTypes.momentObj or null
                        onDateChange={this.onBillToDateChange}
                        focused={this.state.focusedBillTo} // PropTypes.bool
                        isOutsideRange={() => false}
                        onFocusChange={({ focused }) =>
                          this.setState({ focusedBillTo: focused })
                        }
                        id="billToDate" // PropTypes.string.isRequired,
                      />
                    </Form.Group>
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label className="titleText">
                          Average Rate
                        </Form.Label>
                      </div>

                      <Form.Control
                        type="number"
                        placeholder="Enter the rate per kg"
                        name="ratePerKg"
                        onChange={this.handleInputChange}
                        value={this.state.ratePerKg}
                        maxLength={10}
                        required
                        className="avg-rate"
                      />
                    </Form.Group>
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label className="titleText"></Form.Label>
                      </div>
                      <Button
                        id="subBtn1"
                        variant="info"
                        type="submit"
                        className="btn btn-success submit-button calc-button"
                        onClick={() => this.calculateInvoice()}
                      >
                        Calculate Invoice Amount
                      </Button>{" "}
                    </Form.Group>
                  </div>
                  <div className="grid-child purple"></div>
                </div>
                {this.state.showBillSummary ? (
                  <div>
                    <br></br>
                    <br></br>
                    <Card className="invoiceCard" style={{ width: "36rem" }}>
                      <Card.Header>
                        <h2>Invoice Summary</h2>
                      </Card.Header>
                      <ListGroup variant="flush" style={{ whiteSpace: "pre" }}>
                        <ListGroup.Item>
                          {numberOfCustomers +
                            this.state.BillSummaryRecord.numberOfBills}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totalNetWeight +
                            this.state.BillSummaryRecord.totalNetWeight}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totalDryWeight +
                            this.state.BillSummaryRecord.totaldryWeight}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {ratePerKg +
                            this.state.BillSummaryRecord.unitRatePerKg}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totaInvoiceAmount +
                            this.state.BillSummaryRecord.totalBillAmount}
                        </ListGroup.Item>
                      </ListGroup>
                      <Button variant="primary">
                        Generate & Print Invoices
                      </Button>
                    </Card>
                  </div>
                ) : (
                  ""
                )}
              </Tab>
              <Tab
                className="innerTab"
                eventKey="invoiceHistory"
                title="Billing & Invoice History"
              >
                {" "}
                <h1> Tab 2</h1>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </>
    );
  }
}
export default withRouter(BillingInvoices);
