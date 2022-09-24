import './App.css';
import React from "react";


class App extends React.Component {

  render() {
    return (
        <Calculator/>
    )
  }
}

export default App;

function calculateSize(row) {
  const wsjfFloat = (row.bizValue + row.timeCriticality + row.riskOpportunity) / row.size;
  let wsjfInt = parseInt(wsjfFloat)
  return wsjfInt

}

class Calculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [
        {task: "Build Deathstar", bizValue: 10, timeCriticality: 8, riskOpportunity: 9, size: 9, wsjf: 3},
        {task: "Kidnap Leia", bizValue: 5, timeCriticality: 7, riskOpportunity: 6, size: 7, wsjf: 2},
        {task: "Destroy Tattooine", bizValue: 1, timeCriticality: 2, riskOpportunity: 2, size: 5, wsjf: 5}
      ],
      sortAsc: false,
    }
    this.handleFieldChange=this.handleFieldChange.bind(this)
    this.handleDeleteClick=this.handleDeleteClick.bind(this)
    this.handleAddClick=this.handleAddClick.bind(this)
    this.handleSortClick=this.handleSortClick.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
  }
  componentDidMount() {
    let newRows = this.copyRows()
    for (let i = 0; i < newRows.length; i++) {
      newRows[i].wsjf = calculateSize(newRows[i]);
    }
    this.setState({rows: newRows})
  }

  copyRows() {
    return JSON.parse(JSON.stringify(this.state.rows));
  }

  updateField(rowIndex, fieldName, fieldValue) {
    let newRows = this.copyRows()
    newRows[rowIndex][fieldName] = fieldValue
    let wsjf = calculateSize(newRows[rowIndex])
    newRows[rowIndex].wsjf = isNaN(wsjf) ? '' : wsjf
    this.setState({rows: newRows})
  }

  handleFieldChange(e) {
    const rowIndex = e.target.name.split("-")[0]
    const fieldName = e.target.name.split("-")[1]
    let fieldValue = e.target.value

    if (fieldName !== "task" && fieldValue !== "") {
      fieldValue = parseInt(fieldValue)
      fieldValue = Math.min(Math.max(e.target.value, 0), 10)
    }
    this.updateField(rowIndex, fieldName, fieldValue)
  }

  handleAddClick(e) {
    let newRows = this.copyRows()
    newRows.push({task: "", bizValue: "", timeCriticality: "", riskOpportunity: "", size: "", wsjf: ""},)
    this.setState({rows: newRows})
  }

  handleSortClick(e) {
    let newRows = this.copyRows()
    const sortAscNew = !this.state.sortAsc
    if (sortAscNew === true) {
      newRows.sort((a, b) => {return a.wsjf - b.wsjf;})
      console.log("Sort ascending")
    } else {
      newRows.sort((a, b) => {return b.wsjf - a.wsjf;})
      console.log("Sort descending")
    }
    this.setState({rows: newRows, sortAsc: sortAscNew})
  }

  handleDeleteClick(e) {
    console.log("deleteclicks")
    let newRows = this.copyRows()
    const rowIndex = e.target.id.split("-")[0];
    newRows.splice(rowIndex, 1)
    this.setState({rows: newRows})
  }

  renderRow(rowIndex, row) {
    return (
      <Row
        key={rowIndex}
        rowIndex={rowIndex}
        row={row}
        handleFieldChange={this.handleFieldChange}
        handleDeleteClick={this.handleDeleteClick}
      />
    );
  }

  render() {
    return (
      <div>
        <table>
          <thead>
          <tr>
            <th className="task-field"><strong data-tooltip="Tooltip">Task</strong></th>
            <th className="var-field"><strong data-tooltip="Tooltip">Business<br/>Value</strong></th>
            <th className="var-field"><strong data-tooltip="Tooltip">Time<br/>Criticality</strong></th>
            <th className="var-field"><strong data-tooltip="Tooltip">Risk /<br/>Opportunity</strong></th>
            <th className="var-field"><strong data-tooltip="Tooltip">Size</strong></th>
            <th className="wsjf-field">
              <strong data-tooltip="Tooltip">WSJF</strong>
              <SortButton sortAsc={this.state.sortAsc} handleSortClick={this.handleSortClick}>Sort</SortButton>
            </th>
            <th className="delete">&nbsp;</th>
          </tr>
          </thead>
          <tbody>
          {this.state.rows.map((row, index) => (this.renderRow(index, row)))}
          </tbody>
        </table>
        <div className="buttons">
          <button className="button primary" onClick={this.handleAddClick}>+ Add row</button>
        </div>
      </div>
    );
  }
}

class Row extends React.Component {

  render() {
    return (
      <tr>
        <React.Fragment>
          <TaskField value={this.props.row.task} fieldName='task' rowIndex={this.props.rowIndex} handleFieldChange={this.props.handleFieldChange} />
          <VarField value={this.props.row.bizValue} fieldName='bizValue' rowIndex={this.props.rowIndex} handleFieldChange={this.props.handleFieldChange} />
          <VarField value={this.props.row.timeCriticality} fieldName='timeCriticality' rowIndex={this.props.rowIndex} handleFieldChange={this.props.handleFieldChange} />
          <VarField value={this.props.row.riskOpportunity} fieldName='riskOpportunity' rowIndex={this.props.rowIndex} handleFieldChange={this.props.handleFieldChange} />
          <VarField value={this.props.row.size} fieldName='size' rowIndex={this.props.rowIndex} handleFieldChange={this.props.handleFieldChange} />
          <WsjfField value={this.props.row.wsjf} />
        </React.Fragment>
        <DeleteButton rowIndex={this.props.rowIndex} handleDeleteClick={this.props.handleDeleteClick} />
      </tr>
    );
  }
}

class TaskField extends React.Component {

  render() {
    return (
      <td className="task-field">
        <input
          name={this.props.rowIndex + "-" + this.props.fieldName}
          value={this.props.value}
          onChange={this.props.handleFieldChange}
          className="task-field"
          type="text"
        />
      </td>
    );
  }
}

class VarField extends React.Component {

  render() {
    return (
      <td className="var-field">
        <input
          name={this.props.rowIndex + "-" + this.props.fieldName}
          value={this.props.value}
          onChange={this.props.handleFieldChange}
          className="var-field"
          type="number"
          min="0"
          max="10"
        />
      </td>
    );
  }
}

class WsjfField extends React.Component {
  render() {
    return (
      <td className="wsjf-field">
        <input
          type="text"
          value={this.props.value}
          className="wsjf-field"
          readOnly
        />
      </td>
    );
  }
}


class DeleteButton extends React.Component {

  render() {
    return (
      <td className="delete">
        <span
          name={this.props.rowIndex + "-delete"}
          onClick={this.props.handleDeleteClick}
          className="delete-button"
        >
        ❌
        </span>
      </td>
    );
  }
}

class SortButton extends React.Component {

  render() {
    return (
      <span
        id={this.props.rowIndex + "-sort"}
        onClick={this.props.handleSortClick}
        className="sort-button"
      >
        {this.props.sortAsc ? "🔼" : "🔽"}
      </span>
    );
  }
}
