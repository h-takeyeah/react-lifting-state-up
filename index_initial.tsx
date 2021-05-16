import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface BoilProps {
  celsius: number
}

function BoilingVerdict(props: BoilProps) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

interface CalcState {
  temperature: string
}

class Calculator extends React.Component<{}, CalcState> {
  constructor(props: CalcState) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { temperature: '' };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ temperature: e.target.value });
  }

  render() {
    const temperature = this.state.temperature
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={this.state.temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById('app')
)