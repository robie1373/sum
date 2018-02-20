import React, { Component } from 'react';
import logo from './logo.svg';
import  {Pie} from "react-chartjs";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        <AccountForm />
        <NewPieChart />
      </div>
    );
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (<li key={ this.props.column_number }>{ this.props.column_name } : { this.props.value}</li>);
  }
}

class UnorderedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: false
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
      for (var key in this.props.items[i]) {
        if (this.state.debug) {
          console.log(key);
        }
        if (typeof this.props.items[i][key] !== 'function') {
          const li_key = i.toString() + key;
          l.push((<ListItem key={li_key} column_name={key} value={this.props.items[i][key]} />));
        }
      }
    }
    return l;
  }

  render () {
    return ( <ul> {this.listItems()} </ul>);
  }
}

class AccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug: true,
      acct_name: '',
      acct_balance: '',
      values: [{name: 'acct1', bal: 99}]
    };

    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleBalanceChange = this.handleBalanceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.acctList = this.acctList.bind(this);
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error);
    console.log(info);
  }

  handleAccountChange(event) {
    this.setState({acct_name: event.target.value});
  }

  handleBalanceChange(event) {
    this.setState({acct_balance: event.target.value});
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

    try {
      let el = {name: acct_name, bal: acct_bal};
      if (this.state.debug) {
        console.log("new el is a " + typeof el);
        console.log("values is a " + typeof this.state.values);
        console.log("concat is " + this.state.values.concat(el));
      }
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
    this.setState({acct_name: ''});
    this.setState({acct_balance: ''});
    event.preventDefault();
  }

  acctList = () => {
    let d = <div id="acct-list"></div>
    let list = this.state.values;
    for (var i = 0; i < list.length; i++) {
      //for (var obj_key in list[i]) {
        d += list[i].name;
        d += list[i].bal;
      //}
    }
    console.log(d);
    return d;
  }

  render() {
    if (this.state.hasError) {
      return (<h1>Something went wrong</h1>);
    }
    return(
      <div className="InputForm">
      <UnorderedList items={this.state.values} />
        <form onSubmit={this.handleSubmit}>
          <label>
            Account:
            <input id="acct_field" type="text" value={this.state.acct_name} onChange={this.handleAccountChange} autoFocus="true" />
          </label>
          <label>
            Balance:
            <input id="acct_balance" type="number" value={this.state.acct_balance} onChange={this.handleBalanceChange} />
          </label>
          <input type="submit" />
        </form>
        <p> Thing 1 {this.state.acct_name}: {this.state.acct_balance}</p>
      </div>
    );
  }
}

class NewPieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        { value: 100, label: "Acct1" },
        { value: 120, label: "Acct2" },
        { value: 135, label: "Acct3" },
        { value: 50, label: "Acct4" }
      ],
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
     const thisPie = <Pie data={this.state.data} options={this.state.chartOptions} width="600" height="500"/>
     return thisPie;
   }

  render () {
    return (
      <div>
        { this.myPie() }
      </div>
    );
  }
}

export default App;
