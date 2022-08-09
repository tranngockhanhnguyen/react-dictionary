import PropTypes from 'prop-types'

Infomation.propTypes = {
  word: PropTypes.string,
  meanings: PropTypes.array,
  phonetics: PropTypes.array,
  setText: PropTypes.func,
}

function Infomation({ word = '', meanings = [], phonetics = [], setText = null }) {
  return (
    <ul>
      <li className="word">
        <h2>{word}</h2>
        {phonetics.map((phonetic, index) => (
          <span key={index}>{phonetic.text}</span>
        ))}
      </li>

      {meanings.map((meaning, index) => (
        <li className="contain" key={index}>
          <h3>{meaning.partOfSpeech}</h3>

          <div className="details meaning">
            <h3>Meaning</h3>
            {meaning.definitions.map((definition, index) => (
              <p key={index}>- {definition.definition}</p>
            ))}
          </div>

          {meaning.synonyms.length > 0 && (
            <div className="details synonyms">
              <h3>Synonyms</h3>
              {meaning.synonyms.map((synonym, index) => (
                <span key={index} onClick={() => setText(synonym)}>
                  {`${synonym}, `}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Infomation
