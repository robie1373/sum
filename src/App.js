import React, { Component } from 'react';
import logo from './logo.svg';
import  {Pie} from "react-chartjs";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: true,
      show_table: true,
      acct_name: '',
      acct_bal: '',
      values: [{label: 'Kindness of strangers', value: 1}]
    }

    this.handleTableChange = this.handleTableChange.bind(this);
    this.header = this.header.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleBalanceChange = this.handleBalanceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showTable = this.showTable.bind(this);
    this.handleClearStorage = this.handleClearStorage.bind(this);

  }

  componentDidMount() {
    const cachedValues = localStorage.getItem("values");
    if (cachedValues) {
      this.setState({values: JSON.parse(cachedValues) });
      return;
    }
  }

  handleAccountChange(event) {
    this.setState({acct_name: event.target.value});
  }

  handleBalanceChange(event) {
    this.setState({acct_bal: event.target.value});
  }

  handleSubmit(event) {
    let acct_name = event.target.elements[0].value;
    let acct_bal = event.target.elements[1].value;

    if (this.state.debug) {
      console.log("acct_name: " + String(acct_name));
      console.log("acct_bal: " + String(acct_bal));
      console.log("typeof values: " + (typeof this.state.values));
      console.log("values.toString(): " + this.state.values.toString());
      console.log("values.length: " + this.state.values.length);
    }

    if ( acct_name.length > 0 && acct_bal.length > 0 ) {
      try {
        let el = {label: acct_name, value: acct_bal};
        if (this.state.debug) {
          console.log("new el is a " + typeof el);
          console.log("values is a " + typeof this.state.values);
          console.log("concat is " + this.state.values.concat(el));
        }
        localStorage.setItem('values', JSON.stringify(this.state.values.concat([el])) );
        this.setState((prevState, props) => (
          {
            values: prevState.values.concat([el])
          }
        ));
      }
      catch (error) {
        this.setState({ hasError: true });
        console.log(error);
      }
    }
    this.setState({acct_name: ''});
    this.setState({acct_bal: ''});
    event.preventDefault();
  }

  handleTableChange(event) {
    console.log(this.state.show_table);
    this.setState((prevState, props) => ({
      show_table: !prevState.show_table
    }));
  }

  handleClearStorage(event) {
    let default_data = [{label: 'Kindness of strangers', value: 1}];
    console.log("clearingStorage")
    localStorage.setItem('values', JSON.stringify(default_data));
    this.setState({values: default_data});
    event.preventDefault();
  }

  header() {
    return(<header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome</h1>
    </header>)
  }

  showTable = () => {
    if (this.state.show_table) {
      return <UnorderedList items={this.state.values} />
    }
  }

  render() {
    return (
      <div className="App">
        <this.header />
        <Options
          show_table={this.state.show_table}
          handleTableChange={this.handleTableChange}
          handleClearStorage={this.handleClearStorage}
        />
        { this.showTable() }

        <AccountForm
          handleTableChange={this.handleTableChange}
          handleAccountChange={this.handleAccountChange}
          handleBalanceChange={this.handleBalanceChange}
          handleSubmit={this.handleSubmit}
          handleClearStorage={this.handleClearStorage}
          acct_name={this.state.acct_name}
          acct_bal={this.state.acct_bal}
        />
        <SumTotal values={this.state.values} />
        <PieChart data={this.state.values} />

      </div>
    );
  }
}

class SumTotal extends Component{
  constructor(props) {
    super(props);

    this.sumTotal = this.sumTotal.bind(this);
  }

  sumTotal = () => {
    var length = this.props.values.length;
    var accumulator = 0;
    for (var i=0; i<length; i++){
      accumulator += Number(this.props.values[i].value)
    }
    return accumulator.toLocaleString('en');
  }

  render () {
    return (
      <div className="component-boundary" id="sumTotal">
        <h1>${this.sumTotal()}</h1>
      </div>
    )
  }
}

class Options extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render () {
    var table_text = this.props.show_table ? "Hide table" : "Show table";
    return (
      <div className="component-boundary" id="options-div">
        <form onSubmit={this.props.handleClearStorage}>
          <input id="show_table" type="submit" value={table_text}
              onClick={this.props.handleTableChange} />
          <label>
            Clear Table?
            <input id="clear_table" type="submit" value="Clear localStorage"/>
          </label>
        </form>
      </div>
    )
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {debug: true}
  }

  render () {
    if (this.state.debug) {
      console.log(this.props.acct_name + " " + this.props.value);
    }
    return (<li key={ this.props.column_number }>{ this.props.acct_name } : ${ Number(this.props.value).toLocaleString('en')}</li>);
  }
}

class UnorderedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: true
    };
    this.listItems = this.listItems.bind(this);
  }

  listItems = () => {
    var l = [];
    var arrayLength = this.props.items.length;
    if (this.state.debug) {
      console.log("listItems arrayLength: " + arrayLength);
    }
    for (var i = 0; i < arrayLength; i++) {
      if (this.state.debug) {
        console.log("LI2")
        console.log(this.props.items[i]);
      }
      //for (var key in this.props.items[i]) {
        if (this.state.debug) {
          //console.log(key);
        }
        //if (typeof this.props.items[i][key] !== 'function') {
          //if (['value', 'label'].includes(key)) {
            const item = this.props.items[i];
            const li_key = i.toString(); //+ key;
            console.log(item['label']);
            l.push((<ListItem key={li_key} acct_name={item.label} value={item.value} />));
        //}
        //}
      //}
    }
    return l;
  }

  render () {
    return ( <div className="component-boundary" id="table">
        <ul> {this.listItems()} </ul>
      </div>);
  }
}

class AccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: false,
    };

  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error);
    console.log(info);
  }

  showForm = () => {
    var f = (
    <form onSubmit={this.props.handleSubmit}>
      <label>
        Account:
        <input id="acct_name" type="text" value={this.props.acct_name} onChange={this.props.handleAccountChange} autoFocus="true" />
      </label>
      <label>
        Balance:
        <input id="acct_bal" type="number" value={this.props.acct_bal} onChange={this.props.handleBalanceChange} />
      </label>
      <input type="submit" value="Add to chart" />
    </form>
  )
  return f
  }

  render() {
    if (this.state.hasError) {
      return (<h1>Something went wrong</h1>);
    }
    return(
      <div className="component-boundary" id="InputForm">
        { this.showForm() }
      </div>
    );
  }
}

class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartOptions: {
        legend: {
          display: true,
          labels:  {
            fontColor: 'rgb(255, 99, 132)',
            fontSize: 20
          }
        },
        title: {
          display: true,
          text: "sum of stuff"
        },
        //Boolean - Whether we should show a stroke on each segment
        	segmentShowStroke : false,

        	//String - The colour of each segment stroke
        	segmentStrokeColor : "#fff",

        	//Number - The width of each segment stroke
        	segmentStrokeWidth : 2,

        	//Number - The percentage of the chart that we cut out of the middle
        	percentageInnerCutout : 40, // This is 0 for Pie charts

        	//Number - Amount of animation steps
        	animationSteps : 80,

        	//String - Animation easing effect
        	animationEasing : "easeOutElastic",

        	//Boolean - Whether we animate the rotation of the Doughnut
        	animateRotate : true,

        	//Boolean - Whether we animate scaling the Doughnut from the centre
        	animateScale : true,
        	//String - A legend template
        	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
      }
    };
    this.myPie = this.myPie.bind(this);
  }

   myPie = () => {
     const thisPie = <Pie data={this.props.data} options={this.state.chartOptions} width="600" height="500"/>
     return thisPie;
   }

  render () {
    return (
      <div className="component-boundary" id="PieChart">
        { this.myPie() }
      </div>
    );
  }
}

export default App;
