import * as React from 'react'
import * as ReactDOM from 'react-dom'

/* not_syncの反省を活かして状態を親要素のそれとして持っておくことにした

親要素[Calculator]が共有のstateを保持することでstateが“信頼できる
情報源 (source of truth)”となる。親要素からは子どもに対して
input.valueに変更があったときの通知用にonTemperatureChange
プロパティが渡されている。ふつう子要素は親のstateを変更できない。
しかしonTemperatureChangeで通知してやることで
親のstateが親の手で変更されレンダーが走る。そのとき子要素が新しいstateの
値に基づいて再レンダーされる

他にもpropsもしくはstateからあ静的に作り出すことのできるデータについては、
おそらくstateに保持すべきではない、というのも学び。
今回は常にCとFの値を持つのではなく、値とその単位の組を持っておいた。
一方はもう一方から計算できるのでこれでオッケー。
*/

interface BoilProps {
  celsius: number
}

function BoilingVerdict(props: BoilProps) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

function toCelsius(fahrenheit: number) {
  return (fahrenheit - 32) * 5 / 9
}

function toFahrenheit(celsius: number) {
  return (celsius * 9 / 5) + 32
}

function tryConvert(temperature: string, convert: (n: number) => number) {
  const input = parseFloat(temperature)
  if (Number.isNaN(input)) {
    return ''
  }
  const output = convert(input)
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

type Scale = 'c' | 'f'

interface TempProps {
  scale: Scale,
  temperature: string,
  onTemperatureChange: (n: string) => void
}

class TemperatureInput extends React.Component<TempProps, {}> {
  constructor(props: TempProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('event occured!')
    // ここだけデータの流れが親から子ではなく、子から親になっている
    this.props.onTemperatureChange(e.target.value)
  }

  render() {
    const temperature = this.props.temperature
    const scale = this.props.scale
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
      </fieldset>
    )
  }
}

interface CalcState {
  scale: Scale,
  temperature: string
}

class Calculator extends React.Component<{}, CalcState> {
  constructor(props: {} | Readonly<{}>) {
    super(props)
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this)
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this)
    this.state = { temperature: '', scale: 'c' }
  }

  handleCelsiusChange(temperature: string) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature: string) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale
    const temperature = this.state.temperature
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature

    return (
      <div>
        <TemperatureInput
          scale='c'
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale='f'
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
        {/* 沸騰するかどうかを計算するときにはcelsiusを使うこと */}
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