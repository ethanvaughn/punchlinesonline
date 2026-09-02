import { Masthead } from '../components/Masthead'

const punchlines = [
  "A voice broke through the thunder and the rain, saying, 'Repaint! And thin no more!'",
  "The second string said to the bartender, 'You'll have to excuse my buddy here ... he's not NULL Terminated.'",
  "The bar tender exclaimed. 'Hey! Aren't you that string I told to get lost?' The string said to the bar tender, 'No sir! I'm a frayed knot!'",
]

export function LandingPage() {
  return (
    <div className="site-shell">
      <Masthead />
      <main>
        <section className="cityscape" aria-label="Seattle cityscape placeholder" />
        <section className="punchline-section">
          <div className="punchline-table" role="table" aria-label="Punchlines">
            {punchlines.map((punchline, index) => (
              <div className="punchline-row" role="row" key={punchline}>
                <p className="punchline" role="cell">{punchline}</p>
                <p className="owner" role="cell">I. P. Standing</p>
                <p className="date-added" role="cell" aria-label={`Date added for row ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
