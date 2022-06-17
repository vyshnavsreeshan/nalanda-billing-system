import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";
import moment from "moment";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Dropdown,
  Jumbotron,
  Modal,
  Table,
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import NewCashPaymentForm from "../components/NewCashPaymentForm";
import API from "../utils/API";
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
}
let gridApi;
class CashPayments extends Component {
  state = {
    addCashPaymentFormTrigger: false,
    columnDefs: [
      {
        field: "customerId",
        filter: "agSetColumnFilter",
        headerName: "Customer Id",
        floatingFilter: true
      },
      {
        field: "Customer.customerName",
        filter: "agSetColumnFilter",
        headerName: "Customer Name",
        floatingFilter: true
      },
      {
        field: "paymentDate",
        filter: "agDateColumnFilter",
        headerName: "Payement Date",
        floatingFilter: true,
        cellRenderer: (data) => {
          return moment(data.data.paymentDate).format('DD/MM/YYYY')
        }
      },
      {
        field: "paymentType",
        filter: "agSetColumnFilter",
        headerName: "Payement Type",
        editable: true,
        floatingFilter: true,
      },
      {
        field: "totalAmount",
        filter: "agSetColumnFilter",
        headerName: "Amount",
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "paymentNotes",
        filter: "agSetColumnFilter",
        headerName: "Notes",
        editable: true,
        floatingFilter: true
      }

    ],
    defaultColDef: {
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      flex:1
    }
  };

  showCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: true,
    });
  };
  closeCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: false,
    });
    // this.componentDidMount();
  };
  componentDidMount = () => {
    this.loadcashPayments();
  };
  loadcashPayments = () => {
    API.getCashEntry()
      .then((res) => {
        console.log(res);
        this.setState({ cashPayments: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onGridReady = (params) =>{
    gridApi = params.api;
  }
  onExportClick = () =>{
    gridApi.exportDataAsCsv();
  }
  render() {
    {
      console.log("test cash page");
    }
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <Container></Container>
        <br></br>
        <button id="addCashPayment" onClick={this.showCashPaymentForm}>Add cash Advance</button>
        <button className="exportbtn" onClick={this.onExportClick}> Export</button>
        <button className="printbtn"> Print</button>
        <br></br>
        <br></br>
        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            rowData={this.state.cashPayments}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            paginationAutoPageSize={true}
            pagination={true}
            onGridReady={this.onGridReady}
          ></AgGridReact>
        </div>
        <NewCashPaymentForm
          trigger={this.state.addCashPaymentFormTrigger}
          closeCashPaymentForm={this.closeCashPaymentForm}
        ></NewCashPaymentForm>
      </>
    );
  }
}
export default withRouter(CashPayments);