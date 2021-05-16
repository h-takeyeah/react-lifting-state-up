import * as React from 'react'
import * as ReactDOM from 'react-dom'

/* 2つの子要素[Input]を持っているがそれらは同期していない
なぜなら、子要素がそれぞれローカルにvalueを持っているから */

interface BoilProps {
  celsius: number
}

function BoilingVerdict(props: BoilProps) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

type Scale = 'c' | 'f'

interface TempProps {
  scale: Scale,
}

interface TempState {
  temperature: string
}

class TemperatureInput extends React.Component<TempProps, TempState> {
  constructor(props: TempProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { temperature: '' }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ temperature: e.target.value })
  }

  render() {
    const temperature = this.state.temperature
    const scale = this.props.scale
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    )
  }
}

class Calculator extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <TemperatureInput scale='c' />
        <TemperatureInput scale='f' />
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById('app')
)