import { useEffect } from 'react'
import { useMemo, useState } from 'react'
import Infomation from './components/Infomation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const synth = window.speechSynthesis

function App() {
  const voices = useMemo(() => synth.getVoices(), [])
  const [voiceSelected, setVoiceSelected] = useState('Google US English')
  const [text, setText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState('')
  const [meanings, setMeanings] = useState([])
  const [phonetics, setPhonetics] = useState([])
  const [word, setWord] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!text.trim()) return reset()

    async function dictionaryApi() {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
        const result = await response.json()
        setMeanings(result[0].meanings)
        setPhonetics(result[0].phonetics)
        setWord(result[0].word)
        setError('')
      } catch (err) {
        setError(err)
        toast.error(`Couldn't find this word. Please enter another word!`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        })
      }
    }

    const debounce = setTimeout(dictionaryApi, 1000)

    return () => clearTimeout(debounce)
  }, [text])

  function startSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text)

    const voice = voices.find((voice) => voice.name === voiceSelected)
    utterance.voice = voice

    synth.speak(utterance)
  }

  function handleSpeech() {
    if (!text.trim()) return

    if (!synth.speaking) {
      startSpeech(text)
      setIsSpeaking('speak')
    } else {
      synth.cancel()
    }

    setInterval(() => {
      if (!synth.speaking) {
        setIsSpeaking('')
      }
    }, 100)
  }

  function reset() {
    setIsSpeaking('')
    setError('')
    setMeanings([])
    setPhonetics([])
    setWord('')
  }

  return (
    <div className="container">
      <h1>english dictionary</h1>

      <form>
        <div className="row">
          <textarea
            cols="30"
            rows="4"
            placeholder="Enter your text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="voices">
            <div className="voices-selection">
              <select value={voiceSelected} onChange={(e) => setVoiceSelected(e.target.value)}>
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <i className={`fa-solid fa-volume-high ${isSpeaking}`} onClick={handleSpeech} />
          </div>
        </div>
      </form>

      {text.trim() !== '' && !error && (
        <Infomation word={word} meanings={meanings} phonetics={phonetics} setText={setText} />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
