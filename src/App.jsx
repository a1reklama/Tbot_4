import { useMemo, useState } from 'react'
import './styles.css'

const societyPresets = [
  'Соседи',
  'Курьеры',
  'Кассиры в супермаркете',
  'Люди в очередях',
  'Работники сферы обслуживания',
  'Сотрудники банка',
  'Прохожие на улице',
  'Люди в транспорте',
  'Водители соседних машин',
  'Полиция',
  'Чиновники',
  'Врачи',
  'Таксисты',
  'Продавцы',
  'Официанты',
  'Охранники',
]

const selfQuestions = [
  'Когда мне плохо, обращаюсь ли я сразу к врачу?',
  'Ем ли я здоровую еду?',
  'Поддерживаю ли я режим регулярного питания?',
  'Соблюдаю ли я личную гигиену, чищу ли я зубы утром и вечером?',
  'Активен ли я физически, насколько часто я занимаюсь спортом или делаю зарядку?',
  'Есть ли у меня хобби, какие-то увлечения помимо работы?',
  'Есть ли у меня друзья, провожу ли я с ними время?',
  'Верю ли я, что существует что-то невидимое и доброе, что помогает мне каждый день?',
  'Обращаюсь ли я ежедневно к Богу, или к какой-то высшей силе?',
  'Употребляю ли я наркотики?',
  'Напиваюсь ли я регулярно?',
  'Играю ли я в азартные игры?',
  'Делаю ли я ставки?',
  'Изменяю ли я любимому человеку?',
  'Применяю ли я насилие над кем-либо — эмоциональное или физическое?',
  'Присваиваю ли я чужие деньги?',
  'Торчу ли я на интернет порно?',
  'Трачу ли я больше часа в день на чтение новостей?',
  'Залипаю ли я в социальных сетях или в мессенджерах?',
  'Курю ли я?',
  'Пью ли я без меры кофе или энергетики?',
  'Страдаю ли я от трудоголизма?',
  'Страдаю ли я от беспорядочного секса?',
  'Беру ли я в долг?',
  'Вёлся ли я словами или действиями на какую-то другую одержимость?',
]

const yesNoQuestions = new Set([
  'Употребляю ли я наркотики?',
  'Напиваюсь ли я регулярно?',
  'Играю ли я в азартные игры?',
  'Делаю ли я ставки?',
  'Изменяю ли я любимому человеку?',
  'Применяю ли я насилие над кем-либо — эмоциональное или физическое?',
  'Присваиваю ли я чужие деньги?',
  'Торчу ли я на интернет порно?',
  'Трачу ли я больше часа в день на чтение новостей?',
  'Залипаю ли я в социальных сетях или в мессенджерах?',
  'Курю ли я?',
  'Пью ли я без меры кофе или энергетики?',
  'Страдаю ли я от трудоголизма?',
  'Страдаю ли я от беспорядочного секса?',
  'Беру ли я в долг?',
  'Вёлся ли я словами или действиями на какую-то другую одержимость?',
])

const hardZeroQuestions = new Set([
  'Употребляю ли я наркотики?',
  'Напиваюсь ли я регулярно?',
])

const capAtThreeQuestions = new Set([
  'Курю ли я?',
  'Вёлся ли я словами или действиями на какую-то другую одержимость?',
])

const obsessionQuestions = [
  'Употребляю ли я наркотики?',
  'Напиваюсь ли я регулярно?',
  'Играю ли я в азартные игры?',
  'Делаю ли я ставки?',
  'Изменяю ли я любимому человеку?',
  'Применяю ли я насилие над кем-либо — эмоциональное или физическое?',
  'Присваиваю ли я чужие деньги?',
  'Торчу ли я на интернет порно?',
  'Трачу ли я больше часа в день на чтение новостей?',
  'Залипаю ли я в социальных сетях или в мессенджерах?',
  'Курю ли я?',
  'Пью ли я без меры кофе или энергетики?',
  'Страдаю ли я от трудоголизма?',
  'Страдаю ли я от беспорядочного секса?',
  'Беру ли я в долг?',
  'Вёлся ли я словами или действиями на какую-то другую одержимость?',
]

const freqOptions = ['Никогда', 'Редко', 'Иногда', 'Часто', 'Всегда']
const ynOptions = ['Да', 'Нет']

function mean(values) {
  const filtered = values.filter((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)
  if (!filtered.length) return 0
  return Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length)
}

function mapAnswerToScore(question, answer) {
  if (!answer) return 0
  if (yesNoQuestions.has(question)) return answer === 'Нет' ? 10 : 0
  const map = { Никогда: 0, Редко: 3, Иногда: 5, Часто: 8, Всегда: 10 }
  return map[answer] ?? 0
}

function calculateSelfScore(selfAnswers) {
  const baseAverage = mean(Object.entries(selfAnswers).map(([q, a]) => mapAnswerToScore(q, a)))
  if (Array.from(hardZeroQuestions).some((q) => selfAnswers[q] === 'Да')) return 0
  const obsessionCount = obsessionQuestions.filter((q) => selfAnswers[q] === 'Да').length
  if (obsessionCount >= 4) return 0
  if (Array.from(capAtThreeQuestions).some((q) => selfAnswers[q] === 'Да')) return Math.min(baseAverage, 3)
  return baseAverage
}

function parseEntry(text) {
  const m = text.trim().match(/^(.*)\s+(\d{1,2})$/)
  if (!m) return null
  const score = Number(m[2])
  if (score < 0 || score > 10) return null
  return { name: m[1].trim(), score }
}

function StepHeader({ title, subtitle }) {
  return (
    <div className='step-header'>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

function ScoreChips({ onPick, selected }) {
  return (
    <div className='chip-grid'>
      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
        <button key={n} className={selected === n ? 'chip active' : 'chip'} onClick={() => onPick(n)}>
          {n}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [stage, setStage] = useState(1)
  const [familyInput, setFamilyInput] = useState('')
  const [workInput, setWorkInput] = useState('')
  const [familyItems, setFamilyItems] = useState([])
  const [workItems, setWorkItems] = useState([])
  const [societySelected, setSocietySelected] = useState(societyPresets[0])
  const [societyScores, setSocietyScores] = useState({})
  const [customSocietyName, setCustomSocietyName] = useState('')
  const [selfAnswers, setSelfAnswers] = useState({})
  const [error, setError] = useState('')

  const currentQuestionIndex = useMemo(() => selfQuestions.findIndex((q) => !selfAnswers[q]), [selfAnswers])
  const currentQuestion = currentQuestionIndex >= 0 ? selfQuestions[currentQuestionIndex] : null
  const currentOptions = currentQuestion && yesNoQuestions.has(currentQuestion) ? ynOptions : freqOptions

  const familyScore = mean(familyItems.map((x) => x.score))
  const workScore = mean(workItems.map((x) => x.score))
  const societyScore = mean(Object.values(societyScores))
  const selfScore = calculateSelfScore(selfAnswers)
  const totalScore = mean([familyScore, workScore, societyScore, selfScore])

  const progress = !started ? 0 : stage === 1 ? 20 : stage === 2 ? 40 : stage === 3 ? 60 : stage === 4 ? 80 + Math.round((Object.keys(selfAnswers).length / selfQuestions.length) * 20) : 100

  function addFamily() {
    const parsed = parseEntry(familyInput)
    if (!parsed) return setError('Введи имя и оценку от 0 до 10, например: Мама 5')
    setFamilyItems((prev) => [...prev, parsed])
    setFamilyInput('')
    setError('')
  }

  function addWork() {
    const parsed = parseEntry(workInput)
    if (!parsed) return setError('Введи роль и оценку от 0 до 10, например: Начальник 4')
    setWorkItems((prev) => [...prev, parsed])
    setWorkInput('')
    setError('')
  }

  function nextStage() {
    setError('')
    setStage((s) => Math.min(5, s + 1))
  }

  function restartAll() {
    setStarted(false)
    setStage(1)
    setFamilyInput('')
    setWorkInput('')
    setFamilyItems([])
    setWorkItems([])
    setSocietyScores({})
    setCustomSocietyName('')
    setSocietySelected(societyPresets[0])
    setSelfAnswers({})
    setError('')
  }

  function resetCurrentStage() {
    setError('')
    if (stage === 1) {
      setFamilyInput('')
      setFamilyItems([])
    }
    if (stage === 2) {
      setWorkInput('')
      setWorkItems([])
    }
    if (stage === 3) {
      setCustomSocietyName('')
      setSocietyScores({})
      setSocietySelected(societyPresets[0])
    }
    if (stage === 4) {
      setSelfAnswers({})
    }
  }

  function addSocietyCustom(score) {
    const label = customSocietyName.trim()
    if (!label) return setError('Сначала введи название своей категории')
    setSocietyScores((prev) => ({ ...prev, [label]: score }))
    setCustomSocietyName('')
    setError('')
  }

  return (
    <div className='app-shell'>
      <div className='container'>
        <header className='topbar'>
          <div>
            <h1>Калькулятор выздоровления</h1>
            <p>Одноразовое прохождение без сохранения истории. Удобно для ежедневного повторного ввода.</p>
          </div>
          <button className='ghost-btn' onClick={restartAll}>Пройти заново</button>
        </header>

        <div className='progress-wrap'>
          <div className='progress-bar'><span style={{ width: `${progress}%` }} /></div>
          <div className='progress-text'>Этап {started ? stage : 0} из 5</div>
        </div>

        {!started && (
          <section className='card'>
            <StepHeader title='Добро пожаловать' subtitle='Сначала семья, затем работа, общество, личные вопросы и итоговый расчет.' />
            <div className='button-row'>
              <button className='primary-btn' onClick={() => setStarted(true)}>Старт</button>
              <button className='secondary-btn' type='button'>Видео</button>
            </div>
          </section>
        )}

        {started && stage === 1 && (
          <section className='card'>
            <StepHeader title='Этап 1. Семья' subtitle='Пиши имя человека и через пробел оценку от 0 до 10. Например: Мама 5' />
            <div className='entry-row'>
              <input value={familyInput} onChange={(e) => setFamilyInput(e.target.value)} placeholder='Например: Мама 5' />
              <button className='primary-btn' onClick={addFamily}>Добавить</button>
            </div>
            {!!error && <div className='error-box'>{error}</div>}
            <div className='list-box'>
              {familyItems.length ? familyItems.map((item, i) => (
                <div className='list-item' key={`${item.name}-${i}`}><span>{item.name}</span><strong>{item.score}</strong></div>
              )) : <div className='empty-box'>Пока нет введенных имен</div>}
            </div>
            <div className='button-row'>
              <button className='secondary-btn' onClick={() => setFamilyItems([])}>Удалить все имена</button>
              <button className='secondary-btn' onClick={resetCurrentStage}>Начать этап заново</button>
              <button className='primary-btn' onClick={nextStage}>Finish</button>
            </div>
          </section>
        )}

        {started && stage === 2 && (
          <section className='card'>
            <StepHeader title='Этап 2. Работа / учеба' subtitle='Оцени отношения с людьми на работе или в учебном заведении. Например: Начальник 4' />
            {!!familyItems.length && (
              <div className='summary-box'>
                <div className='summary-title'>Оценки семьи</div>
                {familyItems.map((item, i) => <div key={`${item.name}-f-${i}`}>{item.name} {item.score}</div>)}
              </div>
            )}
            <div className='entry-row'>
              <input value={workInput} onChange={(e) => setWorkInput(e.target.value)} placeholder='Например: Коллега 6' />
              <button className='primary-btn' onClick={addWork}>Добавить</button>
            </div>
            {!!error && <div className='error-box'>{error}</div>}
            <div className='list-box'>
              {workItems.length ? workItems.map((item, i) => (
                <div className='list-item' key={`${item.name}-${i}`}><span>{item.name}</span><strong>{item.score}</strong></div>
              )) : <div className='empty-box'>Пока нет введенных ролей</div>}
            </div>
            <div className='button-row'>
              <button className='secondary-btn' onClick={() => setWorkItems([])}>Удалить все имена</button>
              <button className='secondary-btn' onClick={resetCurrentStage}>Начать этап заново</button>
              <button className='primary-btn' onClick={nextStage}>Finish</button>
            </div>
          </section>
        )}

        {started && stage === 3 && (
          <section className='card'>
            <StepHeader title='Этап 3. Общество' subtitle='Оцени отношения с людьми, которые тебе не близки: соседи, курьеры, врачи, кассиры и другие.' />
            <div className='preset-grid'>
              {societyPresets.map((label) => (
                <button key={label} className={societySelected === label ? 'preset active' : 'preset'} onClick={() => setSocietySelected(label)}>
                  <span>{label}</span>
                  <small>{societyScores[label] !== undefined ? `Оценка: ${societyScores[label]}` : 'Выбери оценку'}</small>
                </button>
              ))}
            </div>
            <div className='score-panel'>
              <div className='score-title'>Оценка для: {societySelected}</div>
              <div className='button-row'>
                <button className='secondary-btn' onClick={() => setSocietyScores((prev) => ({ ...prev, [societySelected]: -1 }))}>Пропустить</button>
              </div>
              <ScoreChips selected={societyScores[societySelected]} onPick={(n) => setSocietyScores((prev) => ({ ...prev, [societySelected]: n }))} />
            </div>
            <div className='custom-box'>
              <div className='summary-title'>Своя категория</div>
              <div className='entry-row'>
                <input value={customSocietyName} onChange={(e) => setCustomSocietyName(e.target.value)} placeholder='Например: Дворник' />
              </div>
              <ScoreChips onPick={addSocietyCustom} selected={null} />
            </div>
            {!!error && <div className='error-box'>{error}</div>}
            <div className='summary-box'>
              <div className='summary-title'>Уже оценено</div>
              {Object.keys(societyScores).length ? Object.entries(societyScores).map(([k, v]) => <div key={k}>{k} {v === -1 ? 'Пропуск' : v}</div>) : <div>Пока пусто</div>}
            </div>
            <div className='button-row'>
              <button className='secondary-btn' onClick={() => setSocietyScores({})}>Удалить все имена</button>
              <button className='secondary-btn' onClick={resetCurrentStage}>Начать этап заново</button>
              <button className='primary-btn' onClick={nextStage}>Finish</button>
            </div>
          </section>
        )}

        {started && stage === 4 && (
          <section className='card'>
            <StepHeader title='Этап 4. Личное выздоровление' subtitle='Отвечай по одному вопросу. Расчет включает специальные ограничения для одержимостей.' />
            <div className='rules-box'>
              <div>Если ответ «Да» на наркотики или алкоголь — личное выздоровление = 0.</div>
              <div>Если ответ «Да» на курение или другую одержимость — максимум 3.</div>
              <div>Если «Да» по 4 и более одержимостям — личное выздоровление = 0.</div>
            </div>
            {currentQuestion ? (
              <>
                <div className='question-box'>
                  <div className='question-counter'>Вопрос {currentQuestionIndex + 1} из {selfQuestions.length}</div>
                  <div className='question-text'>{currentQuestion}</div>
                </div>
                <div className='button-row wrap'>
                  {currentOptions.map((option) => (
                    <button key={option} className='answer-btn' onClick={() => setSelfAnswers((prev) => ({ ...prev, [currentQuestion]: option }))}>{option}</button>
                  ))}
                </div>
              </>
            ) : (
              <div className='done-box'>Все вопросы заполнены</div>
            )}
            <div className='summary-box'>
              <div className='summary-title'>Ответы</div>
              {Object.keys(selfAnswers).length ? Object.entries(selfAnswers).map(([q, a]) => <div key={q}><strong>{a}</strong> — {q}</div>) : <div>Пока нет ответов</div>}
            </div>
            <div className='button-row'>
              <button className='secondary-btn' onClick={resetCurrentStage}>Начать этап заново</button>
              <button className='primary-btn' onClick={nextStage}>Finish</button>
            </div>
          </section>
        )}

        {started && stage === 5 && (
          <section className='card'>
            <StepHeader title='Результат' subtitle='Итог рассчитывается по четырем блокам, с учетом специальных правил личного выздоровления.' />
            <div className='result-grid'>
              <div className='result-card'><span>Выздоровление в семье</span><strong>{familyScore}</strong></div>
              <div className='result-card'><span>Выздоровление на работе</span><strong>{workScore}</strong></div>
              <div className='result-card'><span>Выздоровление в обществе</span><strong>{societyScore}</strong></div>
              <div className='result-card'><span>Личное выздоровление</span><strong>{selfScore}</strong></div>
            </div>
            <div className='final-score'>Итого качество твоего выздоровления: {totalScore}</div>
            <div className='button-row'>
              <button className='primary-btn' onClick={restartAll}>Пройти заново</button>
              <button className='secondary-btn' type='button'>Видео</button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
